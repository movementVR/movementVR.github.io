
////////////////////////////// HANDLES TRUE CONTENT OF PANELS    /////////////////////////////////////
//////////////////// TRIAL TYPES & RIGHT PANELS SELECTION, CREATION, UPDATES  //////////////////////// 




////////////////////      CREATION   /   INITIALIATION      //////////////////////// 

// Function: adds a new trial block type defined by user 
// 1) adds option to the trial block dropdowns in the left panel
// 2) creates the right panel for this trial type option
function newTrialBlockType(trialBuilderWindow, dropdownElement, newOptionValue, container) {
	// // 0) Check Option Existance // //
	// Checks to see this is truly a new option (or they wrote the same name as existing one) // // 
  	const newOption = !Array.from(dropdownElement.options).some(option => option.value === newOptionValue);
	if (newOption){
		// // 1) New Dropdown Option // // 	 
		//  Creates the new <option> element in all Trial Type dropdown menus 
		const trialTypeDropdownElements = container.querySelectorAll('.trialbuilderInputsItem.itemTrialType.blocks-panel');
		// loops through all trialType dropdown elements
		trialTypeDropdownElements.forEach((element)=>{				
			const newOption = trialBuilderWindow.document.createElement("option"); // creates the <option> 		
			newOption.value = newOptionValue; // sets the new option value to the user-entered input
			newOption.textContent = newOptionValue;
			// Adds <option> to each dropdown element
			element.insertBefore(newOption, element.lastElementChild); 
		});

		// // 2) New Right Panel for new option // // 
		const rightPanelTemplate = container.querySelector('.trialbuilderPanel.inputs-panel.template'); 
        const clonedPanel = rightPanelTemplate.cloneNode(true); // clones the right panel template  
        
		clonedPanel.classList.remove('template');   // removes template class
		clonedPanel.id = `trialbuilder-right-panel-${newOptionValue}`; // changes the ID to reflect trial type option
		// changes the Panel Title to the user-inputted newOptionValue 
		const clonedPanelLabel = clonedPanel.querySelector('.trialbuilderInputsTitle.panelTitle.inputs-panel');
		clonedPanelLabel.textContent = newOptionValue; 
		// adds cloned panel to the Main Panel Container (at the end but before template)	   
		container.querySelector('.trialbuilderMainContainer').insertBefore(clonedPanel, rightPanelTemplate);	
		// adds 3 List Row Elements to the newly-created right panel 
		// (note: click listener was added to container --> must add panel to container first)
		const addButton = clonedPanel.querySelector('.trialbuilderInputsTitle.itemAdd.inputs-panel'); 
		for (let i = 0; i < 3; i++) addButton.click(); 
	}
	// // 3) Option Selection in Dropdown // //
	// Sets dropdown selection to newOptionValue (whether new or pre-existing option) 
	dropdownElement.value = newOptionValue;  
} 


// Function selects the Trial Block element in the left panel, 
// and the corresponding right panel
// (called when the left panel trial blocks are clicked or dropdown menus changed)
function selectTrialBlock(selectedTrialBlockElement, container){ 
	// // 1) LEFT PANEL: toggles selection of Trial Block element // //
	// De-selects previously-selected Trial Block element
	const currentlySelectedElement = container.querySelector('li.trialbuilderInputsItemParent.selected');
	if(currentlySelectedElement){ // check if it exists (if may have been deleted, etc...)
		currentlySelectedElement.classList.remove('selected');
	}
	// Selects newly-clicked Trial Block element
	selectedTrialBlockElement.classList.add('selected');

	// // 2) RIGHT PANEL: shows Right Panel for selected trial type   
	// selects visible panels (not hidden nor template) and hides them
	const visibleRightPanels = container.querySelectorAll(
					'.trialbuilderPanel.inputs-panel:not(.hidden):not(.template)'); 
	visibleRightPanels.forEach((panel)=>{ 
		panel.classList.add('hidden'); 
	});
	// Parses out trial type from selected Trial Block element
	const trialType = selectedTrialBlockElement.
				querySelector('.trialbuilderInputsItem.itemTrialType.blocks-panel').value;
	const safeTrialType = CSS.escape(trialType); 
	// selects the Right Panel for the current Trial Block Type and shows it 
	const selectedRightPanel = container.querySelector(`#trialbuilder-right-panel-${safeTrialType}`); 
	selectedRightPanel.classList.remove('hidden');   
}
	


////////////////////      UPDATE:  PROBABILITY TEXT      //////////////////////// 
	
// function to update probability text ("/N")
function probabilityText(trialBuilderWindow, container){   
	// Gets Current Right Panel (visible, not hidden or template) 
	const visibleRightPanel = container.querySelector(
		'.trialbuilderPanel.inputs-panel:not(.hidden):not(.template)'); 
	
	if (visibleRightPanel) { // checks that this exists (it does not exist during first initialization)	
		
		// Counts the number of List Elements in the right panel 
		const listElements = visibleRightPanel.querySelectorAll(
					'.trialbuilderInputsItemParent.inputs-panel:not(.template)');	
		const rightpanelN = `"${listElements.length}"`; // tot N elements (string '"value"')

		// updates css property to update all "/N" labels  
		trialBuilderWindow.document.documentElement.style.setProperty('--rightpanel-n', rightpanelN);  
	}	
}
  
 




 
