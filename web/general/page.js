 /* ----------------- CONFIG  ---------------- */
// Definition for the popup window 
function defPagePopupWindow(url = ''){  
	const pagePopupWindowConfig = {
		width: 0.9,
		height: 0.7,
		sizeUnits: '%',
		left: 0,
		top: 0,
		positionUnits:'+%',
		htmlFile: url
	};     
	return pagePopupWindowConfig;
} 


/* -----------------MAIN PAGES SETUP ---------------- */
async function setupPage() { 
	console.log('Running');
	await setupDataContent();
	setupOnThisPageBox(); 
    setupDataLinks(); 
	setupImageCarousel(); 

	
	
	/* ----------------- HELPER FUNCTIONS ---------------- */	
	/*  ─────────── Loads HTML content from [data-content] ───────── */	
	 async function setupDataContent(root = document, count=0) {
		 // (count < maxNestedCalls) is a fallback against infinite loop
		 // Self-calls occur for nested data contents (loaded content 1 loads has data-content itself to be setup)
		 maxNestedCalls = 10; // max hierarchy layers (content inside content inside content...)
		 count++; 
		 if (count<maxNestedCalls){ 
			const divs = root.querySelectorAll('[data-content]'); 

			for (const div of divs) {
				
				console.log(div.getAttribute('data-content'));
				
				
				// Find the closest parent container with data-path
				const tabParent = div.closest('.mainWindow-tabContentContainer[data-path]');

				// path <- data-path attribute of mainWindow-tabContentContainer parent
				// or no base path (path='') if this does not exist
				const path = tabParent ? tabParent.getAttribute('data-path') : '';  
				
				// extracts name of file and data-source selection  
				const targetFilename = `${path}${div.getAttribute('data-content')}.html`; 
				const targetSelection = div.getAttribute('data-content-sel') || '';  				
				
				await loadHTML(targetFilename, div, true, targetSelection); // loads content from file to container 
				
				await setupDataContent(div, count); // recursive: sets up data content within new content
				
			} 
		 }
	} 
	
	 
	
	/* ───────────────────── Links ───────────────────── */ 
	async function setupDataLinks(){
		// Links to Popups (<a> with  data-popupref attribute)
		const popupLinks = document.querySelectorAll('a[data-popupref]');
		console.log(popupLinks);
		popupLinks.forEach(link => {
			link.addEventListener('click', async event => {
				event.preventDefault(); // prevent href="" from navigating

				// Find and opens frame
				const url = link.getAttribute('data-popupref'); 


				//  Create New Window 
			   const targetWindow = await createWindow(defPagePopupWindow(url)); 


				//  Load JSON content
				// // Includes Files (html content, styles, scripts) from Json definitions
				const jsonFiles = [ 
					{ jsonPath: 'web/general/general.json', selection: "main"}
				];	 
				await includeFilesFromJson(jsonFiles, targetWindow); 

			});
		});
		
		
		// Links to Buttons (<a> with  data-buttonref attribute)
		const buttonLinks = document.querySelectorAll('a[data-buttonref]');
		console.log(document);
		console.log(buttonLinks);
		buttonLinks.forEach(link => {
			link.addEventListener('click', async event => { 
				event.preventDefault(); // prevent href="" from navigating

				// Find & Click button
				const buttonID = link.getAttribute('data-buttonref'); 
				const button = document.getElementById(buttonID);
				 
				button.click();  

			});
		});
	}
	
	
	
	/* ───────────────────── Image Carousel ───────────────────── */ 
	function setupImageCarousel(){   
		document.querySelectorAll('.carousel-container').forEach(container => {

			console.log(container);
			const slides = Array.from(container.querySelectorAll('.carousel-slide-img')).map(img => ({
				image: img.src,
				caption: img.dataset.caption || ''
			}));

			const displayImg = container.querySelector('.carousel-display');
			const captionEl = container.querySelector('.carousel-header');
			let currentSlide = 0;

			const updateSlide = () => {
				displayImg.src = slides[currentSlide].image;
				captionEl.textContent = slides[currentSlide].caption;
			};

			container.querySelector('.prev-btn').addEventListener('click', () => {
				currentSlide = (currentSlide - 1 + slides.length) % slides.length;
				updateSlide();
			});

			container.querySelector('.next-btn').addEventListener('click', () => {
				currentSlide = (currentSlide + 1) % slides.length;
				updateSlide();
			});

			updateSlide();
		});

	}

 
	/* ───────────────── "On This Page" table of content ────────────────── */ 
	function setupOnThisPageBox() {
		const contentParent = document.querySelectorAll('.mainpage-parent');

		contentParent.forEach(parent => {
			const nav = parent.querySelector('nav.on-this-page');
			if (!nav) return;

			const tocRoot = nav.querySelector('ul');
			if (!tocRoot) return;
			tocRoot.innerHTML = '';

			const includeSummarys = nav.classList.contains('levels-three');
			const includePanels   = includeSummarys || nav.classList.contains('levels-two');	 

			// helper to slug-ify header text and ensure unique IDs
			const ensureId = (el, fallback) => {
				if (el.id) return el.id;
				const base = (el.textContent || fallback || '')
					.trim().toLowerCase()
					.replace(/[^a-z0-9]+/g, '-')
					.replace(/^-|-$/g, '');
				let unique = base || `section-${Date.now()}`;
				for (let n = 1; document.getElementById(unique); n++)
					unique = `${base}-${n}`;
				el.id = unique;
				return unique;
			};

			parent.querySelectorAll('.section-header:not(.temp-hidden)').forEach((header, idx) => {
				const sectionId = ensureId(header, `section-${idx + 1}`);

				/* ---------- level-1 list item ---------- */
				const li = document.createElement('li');
				const a  = document.createElement('a');
				a.href = `#${sectionId}`;
				a.textContent = header.textContent.trim();
				li.appendChild(a);

				/* ---------- optional level-2 items ---------- */
				if (includePanels) {
					let subHeaders = [];

					// preferred: panel headers inside the very next .section-content wrapper
					let contentWrapper = header.nextElementSibling;
					if (contentWrapper && contentWrapper.classList.contains('section-content')) {
						subHeaders = Array.from(
							contentWrapper.querySelectorAll('.section-panel-header:not(.temp-hidden)')
						);
					}

					// fallback: sibling scan until the next .section-header
					if (subHeaders.length === 0) {
						let sib = header.nextElementSibling;
						while (sib && !sib.classList.contains('section-header')) {
							if (sib.classList && sib.classList.contains('section-panel-header') &&
								!sib.classList.contains('temp-hidden')) {
								subHeaders.push(sib);
							}
							sib = sib.nextElementSibling;
						}
					}

					/* ---------- build nested level-2 list ---------- */
					if (subHeaders.length) {
						const subUl = document.createElement('ul');

						subHeaders.forEach((pHead, pIdx) => {
							const pId = ensureId(pHead, `panel-${idx + 1}-${pIdx + 1}`);
							const subLi = document.createElement('li');
							const subA  = document.createElement('a');
							subA.href = `#${pId}`;
							subA.textContent = pHead.textContent.trim();
							subLi.appendChild(subA);

							/* ---------- optional level-3 from <summary> ---------- */
							if (includeSummarys) {
								const summaries = [];

								// scan siblings until next panel or section header
								let sib2 = pHead.nextElementSibling;
								while (sib2 && !sib2.classList.contains('section-panel-header') &&
									!sib2.classList.contains('section-header')) {

									// collect <summary> in direct <details> siblings
									if (sib2.tagName === 'DETAILS') {
										const s = sib2.querySelector('summary');
										if (s && !s.classList.contains('temp-hidden')) summaries.push(s);
									} else {
										// collect any nested <summary> elements
										sib2.querySelectorAll('details > summary').forEach(s => {
											if (!s.classList.contains('temp-hidden')) summaries.push(s);
										});
									}

									sib2 = sib2.nextElementSibling;
								}

								if (summaries.length) {
									const subSubUl = document.createElement('ul');
									summaries.forEach((sumEl, sIdx) => {
										const sId = ensureId(sumEl, `sum-${idx + 1}-${pIdx + 1}-${sIdx + 1}`);
										const subSubLi = document.createElement('li');
										const subSubA  = document.createElement('a');
										subSubA.href = `#${sId}`;
										subSubA.textContent = sumEl.textContent.trim();
										subSubLi.appendChild(subSubA);
										subSubUl.appendChild(subSubLi);
									});
									subLi.appendChild(subSubUl);
								}
							}

							subUl.appendChild(subLi);
						});

						li.appendChild(subUl);
					}
				}

				tocRoot.appendChild(li);
			});
	
			/* expand On Scroll */
			if (nav.classList.contains('expandOnScroll')) {
				initOnThisPageScrollSpy(nav);  				
			}
		
		});
		
		
		
		// // // --------- helper ------- // // //
		/* highlights + auto-expand current section */
		function initOnThisPageScrollSpy(nav) {
			/* 1 – collect links & targets */
			const links   = Array.from(nav.querySelectorAll('a[href^="#"]'));
			const targets = links
				.map(a => document.querySelector(a.hash))
				.filter(Boolean);

			/* 2 – central routine that marks the TOC */
			const setActive = id => {
				if (!id) return;
				nav.querySelectorAll('li.active').forEach(li => li.classList.remove('active'));

				const link = nav.querySelector(`a[href="#${id}"]`);
				if (!link) return;

				let li = link.parentElement;
				li.classList.add('active');               // current item
				while ((li = li.parentElement.closest('li'))) {
					li.classList.add('active');           // all ancestors (auto-expand)
				}
			};

			/* 3 – scroll-based spy   */
			const observer = new IntersectionObserver(
				entries => {
					for (const entry of entries) {
						if (entry.isIntersecting) setActive(entry.target.id);
					}
				},
				
				
				// rootMargin: '(FROM TOP) 0px (FROM BOTTM) 0px' 
				// considers an element active when it is in the range between (FROM TOP) - (FROM BOTTOM)
				// i.e., when the element (likely the header) is in the range defined by:
				// // y position = between [-(FROM TOP)]% and [100+(FROM BOTTOM)]% from the top of the viewport
				//{ rootMargin: '-40% 0px -55% 0px' } // means active when 40% to (100-55)% = 40% to 45% from top
				{ rootMargin: '0% 0px -80% 0px' } // tune as needed
			);
			targets.forEach(t => observer.observe(t));

			/* 4 – hash-based spy (click or programmatic jump) */
			// a) page loads with a hash
			if (location.hash) setActive(location.hash.slice(1));

			// b) user clicks a TOC link
			links.forEach(a => {
				a.addEventListener('click', () => {
					/* Wait one frame so the browser finishes the jump scroll */
					requestAnimationFrame(() => setActive(a.hash.slice(1)));
				});
			});

			// c) hash changes by any other means (keyboard shortcuts, JS, etc.)
			window.addEventListener('hashchange', () =>
				setActive(location.hash.slice(1))
			);
		}

		
		
		
	 

	} 
	
	// // end of function block // //
	
} 


