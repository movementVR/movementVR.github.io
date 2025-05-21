
function guideSetup(){

	document.querySelector('.x-close').onclick = () => {
		closeHelpWindow();
	};
	document.querySelector('.closeButton').onclick = () => {
		closeHelpWindow();
	};


	window.onclick = (event) => {
	  if (event.target == document.getElementById('helpGuide-modal'))
		document.querySelector('.x-close').onclick();
	};


	const originalContent = document.getElementById('helpGuide-content').innerHTML;

	document.getElementById('search-box').addEventListener('input', function() {
	  const query = this.value.trim();
	  if (!query || query.includes('<') || query.includes('>')) return resetContent();

	  const temp = document.createElement('div');
	  temp.innerHTML = originalContent;
	  const walk = document.createTreeWalker(temp, NodeFilter.SHOW_TEXT, null, false);
	  let node;
	  const regex = new RegExp(`(${query})`, 'gi');
	  while (node = walk.nextNode()) {
		node.nodeValue = node.nodeValue.replace(regex, '[[[HIGHLIGHT]]]$1[[[/HIGHLIGHT]]]');
	  }

	  document.getElementById('helpGuide-content').innerHTML = temp.innerHTML.replace(/\[\[\[HIGHLIGHT\]\]\]/g, '<span class="highlight">').replace(/\[\[\[\/HIGHLIGHT\]\]\]/g, '</span>');

	  document.querySelectorAll('.section-content').forEach(section => {
		if (section.querySelector('.highlight')) section.style.display = 'block';
	  });
	});
}


function openModal(){
	guideSetup();
	
	// Opens Window
	window.frameElement.style.display = "block";
	window.frameElement.classList.add("help-iframe"); 
	document.getElementById('helpGuide-modal').style.display = 'block'; 
}	

function closeHelpWindow(){
	document.getElementById('helpGuide-modal').style.display 	= 'none';
	document.getElementById('search-box').value = '';
	resetContent();


	//	window.frameElement.style.display = "none";

	const frameEl = window.frameElement;
	if (frameEl){ // html was opened as a frame -> hide the frame
		window.frameElement.style.display = "none";
	} else { // html was opened as a window -> close the window
		window.close();		
	}  
}	

function toggleStickyHeader(clickedHeader){
  const nextDiv = clickedHeader.nextElementSibling;
  nextDiv.style.display = (nextDiv.style.display === 'block') ? 'none' : 'block';
}

function resetContent() {
  document.getElementById('helpGuide-content').innerHTML = originalContent;
  document.querySelectorAll('.section-content').forEach(sec => sec.style.display = 'none');
} 
 

	