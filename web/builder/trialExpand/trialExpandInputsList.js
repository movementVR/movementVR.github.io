// SCRIPT WITH functions handling right panel container for paradigm pop-up window 
// Including first line and dropdown of trial types 


function updateTrialTypeInputsContainer(mainParentContainer,itemTrialType){
    showSelectedTrialTypeContainer(mainParentContainer,itemTrialType); 
}

function showSelectedTrialTypeContainer(mainParentContainer,itemTrialType){  
	
    // selects respective Inputs Container
    const selectedParentID = 'parentContainer-' + itemTrialType;
    const selectedInputsParentContainer = mainParentContainer.querySelector(`#${selectedParentID}`);

	
    // sets current container to visible, and others to invisible
    const allIinputsParentContainers = mainParentContainer.querySelectorAll('.trialexpandMainContainerInputs');
	
    allIinputsParentContainers.forEach(function(child) { 
		if (child.id == selectedParentID){ 
            child.style.display = 'inline-block'; 
         } else { 
            child.style.display = 'none'; 
         } 
    });
}



 

function createSequenceTypeDropdown(teWindow,parentContainer,trialTypeManager){ 
	const inputsContainerID = parentContainer.closest('.trialexpandMainContainerInputs').id; 
	const inputsTrialType = inputsContainerID.substring(inputsContainerID.indexOf('-') + 1);
	
    const label = document.createElement('label');
    label.id='SequenceTypeName';
    label.textContent = inputsTrialType; 
    label.setAttribute('for', 'dropdownMenu'); 
    label.classList.add('trialexpandInputsTitleSequenceName'); 
    
    // Create the dropdown menu (select element)
    const dropdownMenu = teWindow.document.createElement('select');
    dropdownMenu.id = 'SequenceTypeDropdownMenu';
    dropdownMenu.classList.add('trialexpandInputsTitleSequenceType'); 

    // Define the input type options to be added to the dropdown (i.e., constant, random, ...)
	// Adds them to dropdown menu at the top of right column panel
	const inputTypes=trialTypeManager.getInputTypes();
	const inputTypesKeys = Object.keys(inputTypes); // Get the keys: 'Constant', 'Linear', etc.
    inputTypesKeys.forEach((key) => {
        const optionElement = teWindow.document.createElement('option');
        optionElement.value = key; // Use the key for the value
        optionElement.textContent = inputTypes[key][0]; // Use the descriptive name for display 
        dropdownMenu.appendChild(optionElement);
    }); 
 
    parentContainer.appendChild(label);
    parentContainer.appendChild(dropdownMenu);

}






 