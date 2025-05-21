 	
/* -----------------MAIN PAGES SETUP ---------------- */
function setupPage() {

	setupOnThisPageBox();

	/* ----------------- HELPER FUNCTIONS ---------------- */
	/*  Creates "On This Page" Box with in-page Links  */
	function setupOnThisPageBox(){
			// For each tab:
		document.querySelectorAll('.mainWindow-tabContentContainer').forEach(tabContent => {
			// 1. Find the nav inside this specific tab content
			const nav = tabContent.querySelector('nav.on-this-page');
			if (!nav) return;								// no placeholder → nothing to do
			const list = nav.querySelector('ul');
			if (!list) return;

			list.innerHTML = '';								// clear the placeholder items

			// 2. Collect every header in tab
			const headers = tabContent.querySelectorAll('.section-header:not(.temp-hidden.section-header)');

			headers.forEach((header, idx) => {
				// 2-3. Ensure each header has a unique ID (slugified from its text)
				if (!header.id) {
					const base = header.textContent
						.trim()
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, '-')			// spaces & punctuation → dashes
						.replace(/^-|-$|/g, '');				// trim leading / trailing dashes
					let slug = base || `section-${idx + 1}`;	// fallback if text empty
					let unique = slug, n = 1;
					while (document.getElementById(unique)) unique = `${slug}-${n++}`;
					header.id = unique;
				}

				// 4-5. Build the nav entry
				const li = document.createElement('li');
				const a  = document.createElement('a');
				a.href = `#${header.id}`;
				a.textContent = header.textContent.trim();
				li.appendChild(a);
				list.appendChild(li);
			});
		});

	}
}


 
function openPopup(event, url, sizeRatioWidth = 0.9, sizeRatioHeight = 0.65) {
  event.preventDefault();

  // Calculate popup size as percentage of screen size
  const width = Math.floor(screen.width * sizeRatioWidth);
  const height = Math.floor(screen.height * sizeRatioHeight);

  // Center the popup
  const left = Math.floor((screen.width - width) / 2);
  const top = Math.floor((screen.height - height) / 2)-50;

  window.open(
    url,
    'popupWindow',
    `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
  );
} 



