// Script with functions handling trial type dropdown 


/////////// EVENT BEHAVIORS: DROPDOWN  ////////////// 
// FUNCTION: Main Interface for event listener
function handleDropdownChange(event, allowedTargets,teWindow,mainOverallParentContainer,
							   trialTypeManager,inheritedWidthsDataManager,
							   populateTrialType_addNewOptionPrompt,populateTrialType_addNewOption) {  
	  
    if (event.target && allowedTargets.some(target => event.target.matches(target))) { 
        
		// Gets the value selected in the dropdown
		const selectedOption = event.target.value; 
		
		// Handles "ADD NEW OPTION" case
		let newOption=null;
        if (selectedOption === populateTrialType_addNewOption) {			
            newOption = teWindow.prompt(populateTrialType_addNewOptionPrompt);
            if (newOption) { 
                trialTypeManager.addOption(newOption);
                updateTrialTypeDropdowns(teWindow,mainOverallParentContainer,event.target.parentNode,trialTypeManager,populateTrialType_addNewOption);
            }
        }	 
		
		 
		// handles Panel-specific options  
		if (mainOverallParentContainer.classList.contains("trialexpandMainContainerBlocks")) { // Left Panel
			dropdownChangeLeftPanel(event.target.parentNode,newOption,teWindow,
									trialTypeManager,inheritedWidthsDataManager); 
		} else if (mainOverallParentContainer.classList.contains("trialexpandMainContainerInputs")) { // Right Panel 
		/*	dropdownChangeRightPanel(selectedOption,mainOverallParentContainer,
									trialTypeManager,true,false); */
			dropdownChangeRightPanel(mainOverallParentContainer,trialTypeManager,true,false); 
		 
		}   
	
    }
}   


///////////// ADD NEW OPTIONS / POPULATE LIST FUNCTIONS /////////////////
// FUNCTION to handle "ADD NEW OPTION" case
function updateTrialTypeDropdowns(teWindow,mainOverallParentContainer,selectedItem,trialTypeManager,populateTrialType_addNewOption) {
    let populateTrialType_trialTypeOptions = trialTypeManager.getOptions();
    const dropdowns = mainOverallParentContainer.querySelectorAll('.trialexpandInputsItemTrialType');
    dropdowns.forEach(dropdown => {
        const previousValue = dropdown.value;
        dropdown.innerHTML = '';
        populateTrialTypeDropdown(teWindow,populateTrialType_trialTypeOptions, dropdown, populateTrialType_addNewOption);

        if (dropdown.parentNode === selectedItem) {
            dropdown.value = populateTrialType_trialTypeOptions[populateTrialType_trialTypeOptions.length - 1]; // Set to the last option
        } else {
            dropdown.value = previousValue;
        }
    });
}

// FUNCTION to populate Trial Type Dropdowns
// (at the beginning and after "ADD NEW OPTION" case)
function populateTrialTypeDropdown(teWindow,populateTrialType_trialTypeOptions, trialTypeDropdown, populateTrialType_addNewOption) {
     
    populateTrialType_trialTypeOptions.forEach(option => { 
        const optionElement = teWindow.document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        trialTypeDropdown.appendChild(optionElement);
    }); 

    const populateTrialType_addNewOptionElement = teWindow.document.createElement('option');
    populateTrialType_addNewOptionElement.textContent = populateTrialType_addNewOption;
    trialTypeDropdown.appendChild(populateTrialType_addNewOptionElement);
}



/////// LEFT PANEL DROPDOWNS //////
// Function changes right panel based on left panel selected trial 
function dropdownChangeLeftPanel(item,newOption,teWindow,
								  trialTypeManager,inheritedWidthsDataManager,htmlContent){	
	if (newOption){ 
		
		const trialType = trialTypeManager.getOptions()[trialTypeManager.getOptions().length - 1]; 
		const htmlContent = trialTypeManager.getInheritedHTML();
		const hiddenPanel=teWindow.document.getElementById('parentContainer-NewHidden'); 
		hiddenPanel.id= 'parentContainer-'+trialType;  
		const title=hiddenPanel.querySelector('#SequenceTypeName'); 
		title.innerHTML = trialType;
		
		createTrialexpandPanel(teWindow, trialTypeManager,
					  			   inheritedWidthsDataManager,false,'NewHidden','Inputs',
								   htmlContent);   
		
	}  
	handleBlockClickImplementation(item);
		
	 
}