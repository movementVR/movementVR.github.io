 
/*  ─────────── Opens Window  ─────────────────────────────────────────────────── */
async function openBuilderParameterCatalog (builderPaths) {

	//  open a blank popup + JSON stuff
	const parameterCatalogWindow = await openBuilderWindow(
		builderCatalogWindowConfig,		// window config
		'parameterCatalog',				// JSON selector
		'parameterCatalog',				// class name
		{ text : 'Parameter Catalog'}	// title bar text
	);

	// setup
	await setupParameterCatalog(parameterCatalogWindow, builderPaths);


	/* -------------------- Initializes the popup ---------------------------------- */
 
	async function setupParameterCatalog (parameterCatalogWindow, builderPaths) {

		/* ──────────────────── Initializes vars ──────────────────────── */
		
		  
		const $   = parameterCatalogWindow.$;               // jQuery already injected
 
		const {
			defBuilderLayout,
			defBuilderPaths,
			defBuilderPopupTabs,
			loadHTML
		} = parameterCatalogWindow.opener;


		let currentData = [];
		let currentSelection = "";
		
		
		
		/* ─────────────────── Actual Catalog Creation & Rendering  ─────────────────── */
		const fullCatalog   = await preloadBuilderPopupsAndCatalog();
		const uniqueCatalog = buildUniqueCatalog(fullCatalog);

		renderParamTable(fullCatalog);
		currentSelection = 'full';
		
		
		
		/* ─────────────────── Button Listeners  ─────────────────── */

		/* radio‑button toggle */
		 parameterCatalogWindow.document.querySelectorAll('input[name="viewToggle"]').forEach(rb => {
			rb.addEventListener('change', () => {
				if (rb.checked){ 
					currentSelection = rb.value;
					renderParamTable(rb.value === 'full' ? fullCatalog : uniqueCatalog);
				}
			});
		});

		
		/* CSV button */
		const downloadBtn = parameterCatalogWindow.document.querySelector('.save-button');
		downloadBtn.id='downloadCSV';
		downloadBtn.title='Download current view as CSV';
		downloadBtn.textContent='Download as CSV';
		parameterCatalogWindow.document.addEventListener('click', evt => {
			if (evt.target.id === 'downloadCSV') {
				downloadCatalogCSV();
			}
		}); 
		
		
		
		/* ─────────────────── Table Visualization Settings  ─────────────────── */

		// Parameter Description (truncated by default): Expand to show full description on click
		const table = $( parameterCatalogWindow.document).find('#paramTable').DataTable(); 
		$( parameterCatalogWindow.document).find('#paramTable tbody').on('click', 'td', function () {
			const tr = $(this).closest('tr');
			const row = table.row(tr);

			if (row.child.isShown()) {
				row.child.hide();
				tr.removeClass('shown');
			} else {
				const fullDescription = row.data().parameterInfo;
				row.child(`<div style="padding:0.5em 1em;">${fullDescription}</div>`).show();
				tr.addClass('shown');
			}
		});

		// columns resizing
		$( parameterCatalogWindow.document).find('#paramTable').colResizable({
			liveDrag: true,
			resizeMode: 'fit' // or 'overflow' if you want scrollbar instead of squeezing
		});



		
		
		
		/* ─────────────────── HELPER FUNCTIONS  ─────────────────── */

		/* ═══════════════════════════════════════════════════════════════
		 * 1. Table rendering
		 * ═════════════════════════════════════════════════════════════ */
		function renderParamTable (data) {
			currentData = data; 

			$( parameterCatalogWindow.document).find('#paramTable').DataTable({
				destroy : true,
				data    : data,
				columns : [
					{ data:'codeName',             title:'Code Name' },
					{ data:'builderLocation',      title:'UI Location' },
					{ data:'displayName',          title:'Display Label' },
					{ data:'typeAndAllowedValues', title:'Type' },
					{ data:'parameterInfo', 	   title:'Description' }
				],
				pageLength : 25,
				order      : [],
				createdRow: function (row, rowData) {
					$('td:eq(0)', row).attr('title', rowData.codeName);  // 1st column 
					$('td:eq(1)', row).attr('title', rowData.builderLocation);  // 2nd column 
					$('td:eq(2)', row).attr('title', rowData.displayName);  // 3rd column 
					$('td:eq(3)', row).attr('title', rowData.typeAndAllowedValues);  // 4th column 
					$('td:eq(4)', row).attr('title', rowData.parameterInfo);  // 5th column 
				}
			});
		}

		
		
		/* ═══════════════════════════════════════════════════════════════
		 * 2.  Main Catalog Building 
		 * ═════════════════════════════════════════════════════════════ */  
		async function preloadBuilderPopupsAndCatalog () {

			const builderConfig          = defBuilderLayout();
			const builderPaths           = defBuilderPaths();
			const builderPopupTabsConfig = defBuilderPopupTabs();
			const catalog                = [];

			/* one block per popup (skip duplicates) */
			const popupBlocks = [...new Map(
				builderConfig
					.filter(b => b.onclick && builderPopupTabsConfig[b.onclick])
					.map(b => [b.onclick, b])
			).values()];

			await Promise.all(popupBlocks.map(async blk => {
				const popupDef  = builderPopupTabsConfig[blk.onclick];
				const container =  parameterCatalogWindow.document.createElement('div');
				container.style.display = 'none';
				 parameterCatalogWindow.document.body.appendChild(container);

				await Promise.all(Object.entries(popupDef.tabs).map(async ([tabName, file]) => {
					const path = builderPaths.builderParametersPath(file);
					await loadHTML(path, container, false);	// opener helper
					catalogTabParameters(container, popupDef.title, tabName, catalog);
				}));
			}));

			return catalog;
			
			
			
			// // // helper functions // // // 
			/* ───── extract one tab’s controls into catalog ─────────────── */
			function catalogTabParameters (container, winTitle, tabName, catalog) {

				const radioGroups = new Map();   // htmlName → index

				container.querySelectorAll('input, textarea').forEach(el => {

					const { main, subname } = findDisplayedNames(el);
					const labelText         = container.querySelector(`label[for="${el.id}"]`)?.textContent.trim() || '';
					const elementType       = getElementType(el);
					const parameterInfo   = getBuilderParametersHelpContent(el, false);

					if (elementType === 'input:hidden' || !el.name) return;

					/* build strings */
					const joinArrow = (...p) => p.filter(Boolean).join(' -> ');
					const joinDash  = (...p) => p.filter(Boolean).join(' - ');

					const builderLocation = joinArrow(winTitle, tabName);
					const baseDisplay     = joinDash(main, subname);

					/* --- type + allowed values ----------------------------- */
					let typeAndAllowedValues;

					switch (elementType) {
						case 'input:checkbox':
							typeAndAllowedValues = 'checkbox (values: TRUE, FALSE)';
							break;

						case 'textarea':
							typeAndAllowedValues = 'text';
							break;

						case 'input:number': {
							const lim = [];
							if (el.min !== '')                lim.push('min=' + el.min);
							if (el.max !== '')                lim.push('max=' + el.max);
							if (el.step && el.step !== 'any') lim.push('step=' + el.step);
							typeAndAllowedValues = 'number' + (lim.length ? ' (' + lim.join(', ') + ')' : '');
							break;
						}

						case 'input:radio': {
							const cur = el.value;
							if (radioGroups.has(el.name)) {
								const idx   = radioGroups.get(el.name);
								const entry = catalog[idx];
								if (labelText) entry.displayName += ' | ' + labelText;
								entry.typeAndAllowedValues =
									entry.typeAndAllowedValues.slice(0, -1) + ', ' + cur + ')';
								return;
							}
							radioGroups.set(el.name, catalog.length);
							typeAndAllowedValues = 'radio (values: ' + cur + ')';
							break;
						}
					}

					catalog.push({
						codeName          : el.name,
						builderLocation   : builderLocation,
						displayName       : joinArrow(baseDisplay, labelText),
						typeAndAllowedValues,
						parameterInfo
					});
				});
		 
		
				/* ───────── helpers for element type & names ────────────────── */
				function getElementType (el) {
					const tag = el.tagName.toLowerCase();
					if (tag === 'textarea') return 'textarea';
					if (tag === 'select')   return 'select';
					if (tag === 'input')    return `input:${el.type}`;
					return tag;
				}

				function findDisplayedNames (ctrlEl) {
					const HDR = '.name-type.name, .name-type.subname, ' +
								'.fullname-type.name, .fullname-type.subname';

					let node = ctrlEl, header = null;
					while (node && !header) {
						node = node.previousElementSibling || node.parentElement?.previousElementSibling;
						if (node && node.matches(HDR) && node.textContent.trim()) header = node;
					}
					if (!header) return { main:'', subname:'' };

					if (header.classList.contains('subname')) {
						const mains = [... parameterCatalogWindow.document.querySelectorAll('.name-type.name, .fullname-type.name')]
							.filter(h => (h.compareDocumentPosition(ctrlEl) & Node.DOCUMENT_POSITION_FOLLOWING) &&
										h.textContent.trim());
						const main = mains.length ? mains[mains.length - 1].textContent.trim() : '';
						return { main, subname: header.textContent.trim() };
					}
					return { main: header.textContent.trim(), subname:'' };
				} 
		
			}
			
		}
		
		
		
		
		/* ═══════════════════════════════════════════════════════════════
		 * 3.  Unique Parameter Catalog   
		 * ═════════════════════════════════════════════════════════════ */   
		function buildUniqueCatalog (arr) {
			const map = new Map();
			arr.forEach(o => {
				if (!map.has(o.codeName)) {
					map.set(o.codeName, { ...o });
				} else {
					const e    = map.get(o.codeName);
					const locs = new Set(
						e.builderLocation.split(' | ').concat(o.builderLocation.split(' | '))
					);
					e.builderLocation = Array.from(locs).join(' | ');
				}
			});
			return Array.from(map.values());
		}

		
 
		
		/* ═══════════════════════════════════════════════════════════════
		 * 4.  CSV Download 
		 * ═════════════════════════════════════════════════════════════ */ 
		function downloadCatalogCSV () {
			const csv = arrayToCSV(currentData);
			const filename = 'parameterCatalog' + currentSelection.charAt(0).toUpperCase() + currentSelection.slice(1) + '.csv';
			const blob = new Blob(["\uFEFF" + csv], { type:'text/csv;charset=utf-8;' });
			const link =  parameterCatalogWindow.document.createElement('a');
			link.href      = URL.createObjectURL(blob);
			link.download  = filename;
			link.style.display = 'none';
			 parameterCatalogWindow.document.body.appendChild(link);
			link.click();
			 parameterCatalogWindow.document.body.removeChild(link);
			URL.revokeObjectURL(link.href);
			
			

			/* ───────── helper ─────────────────────────────────────── */
			function arrayToCSV (arr) {
				const headers = ['codeName','builderLocation','displayName','typeAndAllowedValues','parameterInfo'];
				const esc     = v => '"' + String(v).replace(/"/g,'""') + '"';

				const dataRows = arr.map(row => headers.map(h => esc(row[h] || '')).join(','));
				return [headers.join(',')].concat(dataRows).join('\n');
			}
			
		}


	}
 
}



