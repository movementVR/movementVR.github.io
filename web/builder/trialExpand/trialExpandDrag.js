// This files contains the functions handling dragging behavior
// Used in the "expand paradigm" popup windows to reorder blocks in both columns


function createHorizontalLine(teWindow) { 
    const line = teWindow.document.createElement('div');
    line.classList.add('horizontal-line');
    // Set the style of the line (e.g., blue color, height, position)
    line.style.backgroundColor = 'blue'; 
    line.style.height = '2px';
    line.style.width = '100%'; 
    line.style.position = 'relative'; // Adjusting the position to relative
    line.style.left = '0'; 
    line.style.display='none';
    return line;
}
 

function dragTrackNewPosition(event,dragHorizontalLine,mainOverallParentContainer){
	let targetItem = event.target; 
    const inputsListContainerParents = mainOverallParentContainer.querySelectorAll('.trialexpandInputsItemParent');
	
	// Remove dragTargetInsertBefore and dragTargetInsertEnd classes from all items 
	inputsListContainerParents.forEach(item => {
		item.classList.remove('dragTargetInsertBefore');
		item.classList.remove('dragTargetInsertEnd');
	});
	
    const targetTop = targetItem.getBoundingClientRect().top;   // target Item top 
    const targetBottom = targetItem.getBoundingClientRect().bottom;   // target Item bottom 
    const targetMiddle = (targetTop+targetBottom)/2;
    const mouseY = event.clientY;  
	
	let targetIndex = Array.from(inputsListContainerParents).indexOf(targetItem); 
	
	let colorStr='gray';
	let otherItem=null;
	let otherItemY;
	let lineY;
	if (mouseY<targetMiddle){ // top half 
 		 targetItem.classList.add('dragTargetInsertBefore');	
		 if (targetIndex>0){ // previous item -> line position 
			 otherItem=inputsListContainerParents[targetIndex - 1];
			 otherItemY=(otherItem.getBoundingClientRect().top + otherItem.getBoundingClientRect().bottom)/2;
			 lineY=(otherItemY + targetMiddle)/2;
		 } else {
			 lineY=targetTop;
		 }
		
	} else { // bottom half 
		 if (targetIndex<(inputsListContainerParents.length-1)){ // next item -> line position 
			 otherItem=inputsListContainerParents[targetIndex + 1];
			 otherItemY=(otherItem.getBoundingClientRect().top + otherItem.getBoundingClientRect().bottom)/2;
			 lineY=(otherItemY + targetMiddle)/2;
 		     otherItem.classList.add('dragTargetInsertBefore');	
		 } else {
			 lineY=targetBottom;
 		     targetItem.classList.add('dragTargetInsertEnd');	
		 }
	}
	 
	 	 
	dragHorizontalLine.style.display='block'; 
	dragHorizontalLine.style.top = `${lineY}px`;
    const lineTop = dragHorizontalLine.getBoundingClientRect().top;    
	dragHorizontalLine.style.top = `${lineY + lineY-lineTop}px`;
	   
	  
}

 


/////////// EVENT BEHAVIORS: DRAG  //////////////

function handleDragStart(event, allowedTargets,teWindow,mainOverallParentContainer,inputsListContainer,dragHorizontalLine,containerWidths) {
	try { 
		// Selects the correct element to be dragged
		let draggedItem = event.target;  		
		if (draggedItem.nodeType === Node.TEXT_NODE) {
			draggedItem = draggedItem.parentElement;
		} 
		if (draggedItem && allowedTargets.some(target => draggedItem.matches(target))) {  
			
		    draggedItem.classList.add('dragging'); // adds 'dragging' class to the dragged item
			 
		} else { 
			 
			dragAbort(dragHorizontalLine,teWindow,mainOverallParentContainer); 
			 event.preventDefault();
		}
	
	} catch { 
    	dragAbort(dragHorizontalLine,teWindow,mainOverallParentContainer); 
	}
}

 


function handleDragEnd(event, allowedTargets, teWindow,mainOverallParentContainer,inputsListContainer,dragHorizontalLine) {
    
	dragHorizontalLine.style.display='none';
	try{ 	 
		// Selects the correct element to be dragged
		let draggedItem = event.target;  
		if (draggedItem.nodeType === Node.TEXT_NODE) {
			draggedItem = draggedItem.parentElement;
		}  
		if (draggedItem && allowedTargets.some(target => draggedItem.matches(target))) {    
			
			const dragTargetItem = mainOverallParentContainer.querySelector('.dragTargetInsertBefore'); 
			const dragTargetEnd = mainOverallParentContainer.querySelector('.dragTargetInsertEnd'); 
			if (dragTargetItem || dragTargetEnd){
				if (dragTargetItem){
					inputsListContainer.insertBefore(draggedItem, dragTargetItem);  					
				} else {
					inputsListContainer.appendChild(draggedItem);
				} 				
				draggedItem.classList.remove('dragging');                 
				updateItemNumber(mainOverallParentContainer); 
			} else {
				 event.preventDefault();				
			}
		  
		} else {  
				
			dragAbort(dragHorizontalLine,teWindow,mainOverallParentContainer); 
			 event.preventDefault();
		}
	} catch {
			  
  
    	dragAbort(dragHorizontalLine,teWindow,mainOverallParentContainer); 
	}
}




function handleDragOver(event, allowedTargets,teWindow,mainOverallParentContainer,dragHorizontalLine) {  
	
    try { 
		const draggableElement = event.target.closest('[draggable="true"]');  
		if (!draggableElement) {
			// If there is no draggable element, prevent further handling of the dragover event
			event.preventDefault(); 
			return;
		}
		event.preventDefault();  
		if (event.target && allowedTargets.some(target => event.target.matches(target))) {   
							
 		    dragTrackNewPosition(event,dragHorizontalLine,mainOverallParentContainer); 

		} else {  
			 event.preventDefault();
		}  
		
	} catch {  
    	 dragAbort(dragHorizontalLine,teWindow,mainOverallParentContainer); 
	}

}


function dragAbort(dragHorizontalLine,teWindow,mainOverallParentContainer){ 
	dragHorizontalLine.style.display='none';
	const draggedItem = mainOverallParentContainer.querySelector('.dragging');
	if (draggedItem){
		draggedItem.classList.remove('dragging'); 
	}                
	updateItemNumber(mainOverallParentContainer); 
}