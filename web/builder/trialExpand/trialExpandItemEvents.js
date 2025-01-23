// SCRIPT WITH FUNCTIONS TO HANDLE EVENTS 
// FOR EVENTS: NUMERICAL INPUTS, DELETE BLOCKS, CLICK BLOCKS, UPDATE BLOCK NUMBERS 
// (DRAG, DROPDOWN, and ADD ITEM  EVENTS IMPLEMENTED SEPARATELY AS THEY HAVE A LOT OF FUNCTIONS)


/////////// UPDATE BLOCK NUMBER (AFTER DRAGGING)  //////////////

 function updateItemNumber(mainOverallParentContainer){
    const inputsListContainerX = mainOverallParentContainer.querySelectorAll('.trialexpandInputsItemParent');

	// Update itemOrder values after dragging
	inputsListContainerX.forEach((item, index) => {
		const itemOrder = item.querySelector('.trialexpandInputsItemOrder');
		itemOrder.textContent = index + 1; // Update itemOrder to index + 1
	}); 
	itemCount = inputsListContainerX.length;

	 // update probability text	 
	 updateProbabilityTextNumber(mainOverallParentContainer);
	  
 
 }



/////////// UPDATE PROBABILITY TEXT NUMBER (AFTER ADDING OR DELETING)  //////////////

 function updateProbabilityTextNumber(mainOverallParentContainer){
    const inputsListContainerX = mainOverallParentContainer.querySelectorAll('.trialexpandInputsItemParent');
	itemCount = inputsListContainerX.length; 
	
	 // update probability text	 
	inputsListContainerX.forEach((item, index) => {
		const currProbText = item.querySelector('.trialexpandInputsItemProbabilityText');
		if(currProbText){
			currProbText.textContent = `/${itemCount}`;			
		}
	});  	
	
 }


/////////// EVENT BEHAVIORS: NUMERICAL INPUTS   //////////////

function handleRepeatsInput(event, allowedTargets) { 
    if (event.target && allowedTargets.some(target => event.target.matches(target))) {  
        const input = event.target; 
       /* if (input.value === '') { 
            return; // Allow backspace to remove all text
        }*/
        input.addEventListener('blur', function blurHandler() {
            input.removeEventListener('blur', blurHandler); // Remove the blur event listener  
            if (input.value === '') {
                input.value = 1; // Set to 1 if input is empty when clicking out
            } else if (input.value < 1) {
                input.value = 1;
            }
        });            
    }
}

// Function to handle Enter key press
function handleKeyDown(event, allowedTargets) { 
    if (event.target && allowedTargets.some(target => event.target.matches(target))) {  
        const input = event.target;
        if (event.key === 'Enter') {
            if (input.value === '') {
                input.value = 1; // Set to 1 if input is empty
            } 
            input.blur(); // Trigger blur event
        }
    }
}


/////////// EVENT BEHAVIORS: DELETE  //////////////
function handleDeleteButtonClick(event, allowedTargets,mainOverallParentContainer,inputsListContainer) {
    if (event.target && allowedTargets.some(target => event.target.matches(target))) {  
        const item = event.target.parentNode;
		handleDeleteButtonClickImplementation(item,mainOverallParentContainer,inputsListContainer); 
    }
}
function handleDeleteButtonClickImplementation(item,mainOverallParentContainer,inputsListContainer){
	inputsListContainer.removeChild(item);
	updateItemNumber(mainOverallParentContainer);
	updateProbabilityTextNumber(mainOverallParentContainer);
}


 

////////  EVENT BEHAVIORS: CLICK BLOCK ///////////// 
function handleBlockClick(event, allowedTargets) {
    if (event.target && allowedTargets.some(target => event.target.matches(target))) {   
        // selects item parent container
        let item = event.target;
         if (item.classList.contains('trialexpandInputsItem')) {
            item = item.closest('.trialexpandInputsItemParent');
        } 
		
		// Handles all the implementation steps
		// 1) Style changes in the left panel to show what was selected
		// 2) Right panel change (showing the selected one)
		handleBlockClickImplementation(item);
            
    }
}
function handleBlockClickImplementation(item){
	// 1a) changes style of selected item to Selected
	handleBlockClickSelectedStyle(item);

	// 1b) changes style of all other items to Not Selected
	const blocksParentContainer = item.closest('.trialexpandMainContainerBlocks');
	const allItems = blocksParentContainer.querySelectorAll('.trialexpandInputsItemParent');
	allItems.forEach(function(child) {
		 if (child!==item){
			child.style.outline = 'none';
			child.style.backgroundColor = '#e6e6e6';
		 }
	});
	 
	
	// 2) changes the trial selection in the Inputs List Right Panel
	const itemTrialType = item.querySelector('.trialexpandInputsItemTrialType').value;
	const mainParentContainer = item.closest('.trialexpandMainContainer');
	updateTrialTypeInputsContainer(mainParentContainer,itemTrialType);	
}
function handleBlockClickSelectedStyle(item){
	// changes style of selected item to Selected
	item.style.outline = '3px solid #1b7e7e';
	item.style.backgroundColor = '#E5F9F9';
}


