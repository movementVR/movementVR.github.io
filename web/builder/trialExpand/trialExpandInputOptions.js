// script contains functions to modify right panel inputs 
// based on definition option chosen from top dropdown
  
/////// RIGHT PANEL DROPDOWNS ////// 
function dropdownChangeRightPanel(mainOverallParentContainer,trialTypeManager,flagNewList,rightPanelInitialization){	
	 	
	// SETTINGS APPLIED TO NEW POPUP WINDOW ONLY
	// settings only applied when we first open popup window
	// (these are the settings retrieved from previous user inputs in previous paradigm popups)
	let flagUseDefaultInitialization=true;
	if(rightPanelInitialization){		
		// Extract the trialType from the id of the mainOverallParentContainer
		const trialType = mainOverallParentContainer.id.replace('parentContainer-', ''); 
		
		// Get the content for current panel from rightPanelInitialization
		const currentPanelInitialization = rightPanelInitialization[trialType];
		
		//if this is available, it uses it to initialize panel (and will not use the default initialiation later)
		if (currentPanelInitialization){
			rightPanelInitialWindowSetup(currentPanelInitialization,mainOverallParentContainer);
			flagUseDefaultInitialization=false;
		}
	}

	// GETS VALUES FROM CURRENT PANEL / TRIAL TYPE MANAGER 
	// Definitions of input blocks properties for the different options in the dropdown of right panel
	const inputTypes=trialTypeManager.getInputTypes();   
	
	// selected trial type option from dropdown menu
	const selectedOption=mainOverallParentContainer.querySelector('#SequenceTypeDropdownMenu').value;
	
	// SETTINGS APPLEID TO NEW LIST ONLY
	// Some settings are "new list settings" only applied when creating a new list 
	// (upon creation or upon dropdown change) (e.g., # items)
	if(flagNewList){
		if(flagUseDefaultInitialization){ // if false, these initializations were done above based on previous popups
			// "N": Sets the number of items to that defined by inputTypes (default)			
			const targetNumberBlocks = inputTypes[selectedOption][1]; 
			dropdownChangeRightPanelSetNumberOfItems(targetNumberBlocks,mainOverallParentContainer);	
		}
		
		// "Labels": change the left item labels when appropriate  (those numbering the block items)
		dropdownChangeRightPanelSetItemLabels(selectedOption,inputTypes,mainOverallParentContainer);
	}	
	 
	
	// SETTINGS APPLIED TO EVERY ITEM
	// "ChangeN", "Prob": remove the Delete/Add/Drag buttons or Probability when appropriate
	//	(for inputTypes flags ChangeN=0 or Prob=0) 
	dropdownChangeRightPanelSetElementVisibility(selectedOption,inputTypes,mainOverallParentContainer);
	 
	
}

function dropdownChangeRightPanelSetNumberOfItems(targetNumberBlocks,mainOverallParentContainer){
	 
	const inputsListContainer = mainOverallParentContainer.querySelector('.trialexpandInputsListContainer');
	
	// gets 'plus' add item button for current panel 
	const addItemBtn = mainOverallParentContainer.querySelector('.trialexpandInputsAddButton');   
	
	// gets all current input blocks in panel 2
	// by finding all elements of class 'trialexpandInputsItemParent' in mainOverallParentContainer
    const inputBlocks = mainOverallParentContainer.querySelectorAll('.trialexpandInputsItemParent');
	
	// ADD MISSING BLOCKS 
	for (let i = inputBlocks.length; i < targetNumberBlocks; i++) { 
		// Trigger the click event
		addItemBtn.click();
	}
	
	// DELETE EXTRA BLOCKS  
	// by looping through blocks [currentN-1] : -1 : [targetN]  (because index goes from 0 to currentN-1)
	// and calling delete block function 'handleDeleteButtonClickImplementation' for each of these input blocks
	for (let i = inputBlocks.length - 1; i >= targetNumberBlocks; i--) { 
		handleDeleteButtonClickImplementation(inputBlocks[i],mainOverallParentContainer,inputsListContainer);
	} 

}


function dropdownChangeRightPanelSetElementVisibility(selectedOption,inputTypes,mainOverallParentContainer){
	
	// flags for whether add/delete/drag buttons and probability should be displayed 
	const flagChangeN = inputTypes[selectedOption][2]; 
	const flagProb = inputTypes[selectedOption][3];  

	//add button:
	const addItemBtn = mainOverallParentContainer.querySelector('.trialexpandInputsAddButton');  
	const addItemBtnDisplay = getOriginalStyle('.trialexpandInputsAddButton', 'display');

	// delete buttons for each item
	const deleteItemBtns = mainOverallParentContainer.querySelectorAll('.trialexpandInputsItemDelete'); 
	const deleteItemBtnDisplay = getOriginalStyle('.trialexpandInputsItemDelete', 'display');
	
	// drag buttons for each item
	const dragItemBtns = mainOverallParentContainer.querySelectorAll('.trialexpandInputsItemDrag'); 
	const dragItemBtnDisplay = getOriginalStyle('.trialexpandInputsItemDrag', 'display');

	// probability input for each item
	const probabilityElements = mainOverallParentContainer.querySelectorAll('.trialexpandInputsItemProbability');
	const probabilityElementsDisplay = getOriginalStyle('.trialexpandInputsItemProbability', 'display');

	// probability text for each item
	const probabilityTextElements = mainOverallParentContainer.querySelectorAll('.trialexpandInputsItemProbabilityText');
	const probabilityTextDisplay = getOriginalStyle('.trialexpandInputsItemProbabilityText', 'display');
	
	// probability text title
	const probabilityTitle = mainOverallParentContainer.querySelector('.trialexpandInputsTitleProbability');
	const probabilityTitleDisplay = getOriginalStyle('.trialexpandInputsTitleProbability', 'display');

	// implementation: add, delete, drag buttons
	if (flagChangeN){
		addItemBtn.style.display=addItemBtnDisplay;
		deleteItemBtns.forEach(element => {
			element.style.display=deleteItemBtnDisplay;        
    	}); 
		dragItemBtns.forEach(element => {
			element.style.display=dragItemBtnDisplay;        
    	}); 
	} else {
		addItemBtn.style.display='none';
		deleteItemBtns.forEach(element => {
			element.style.display='none';        
    	}); 
		dragItemBtns.forEach(element => {
			element.style.display='none';        
    	}); 
	}  
	
	// implementation: probability
	if (flagProb){
		probabilityTitle.style.display=probabilityTitleDisplay;
		probabilityElements.forEach(element => {
			element.style.display=probabilityElementsDisplay;        
    	}); 
		probabilityTextElements.forEach(element => {
			element.style.display=probabilityTextDisplay;        
    	}); 
	} else {
		probabilityTitle.style.display='none';
		probabilityElements.forEach(element => {
			element.style.display='none';        
    	}); 
		probabilityTextElements.forEach(element => {
			element.style.display='none';        
    	}); 
	} 
	
} 


function dropdownChangeRightPanelSetItemLabels(selectedOption,inputTypes,mainOverallParentContainer){ 
  
	// item labels definition from trial manager 
	const itemLabels = inputTypes[selectedOption][4]; // array of labels
	const itemLabelsRotate = inputTypes[selectedOption][5]; // whether to rotate label by 90deg   
	
	//  elements with number/order left label for each item
	const orderElements = mainOverallParentContainer.querySelectorAll('.trialexpandInputsItemOrder');  
 
	// implementation
	orderElements.forEach((element, index) => {
		if(itemLabels[index]){ // if this is null, then this is a numerical type and the label is updated automatically when adding new items
			if (itemLabelsRotate){
				element.innerHTML = `<span style="display: inline-block; transform: rotate(-90deg);">${itemLabels[index]}</span>`;			

			} else {	
				element.innerHTML = itemLabels[index]; // current item label 
			}	
		}
		
	}); 
	 
}




/////////////////// NEW WINDOW: SETUP BASED ON PREVIOUS POPUP WINDOWS //////////////////////
 
/*

allParadigmInput = {setupScript,tgtBirdPositionOffsetX: {…}, setupScript,tgtBirdRotationX: {…}}
setupScript,tgtBirdPositionOffsetX: 
	Blocks: Array(3)
		0: {TrialType: 'Baseline Trial', Repeats: 30}
		1: {TrialType: 'Learning Trial', Repeats: 120}
		2: {TrialType: 'Washout Trial', Repeats: 60}
	Inputs: 
		Baseline Trial: {SelectedOption: 'Constant', InheritedInputs: {…}, Probabilities: Array(1)}
		Learning Trial: {SelectedOption: 'Constant', InheritedInputs: {…}, Probabilities: Array(1)}
		Washout Trial:  {SelectedOption: 'Constant', InheritedInputs: {…}, Probabilities: Array(1)}
setupScript,tgtBirdRotationX: 
	{Blocks: Array(3), Inputs: {…}} 
	
	
Object.keys(allParadigmInput) --> ['setupScript,tgtBirdPositionOffsetX','setupScript,tgtBirdRotationX',...]	



console.log(allParadigmInput);
console.log(allParadigmInput['setupScript,tgtBirdPositionOffsetX']);
	Blocks: Array(3) 
	Inputs: ...
console.log(allParadigmInput['setupScript,tgtBirdPositionOffsetX'].Blocks);
	 Array(3) 
	 		0: {TrialType: 'Baseline Trial', Repeats: 30} 
	 		1:......
			2:...
console.log(allParadigmInput['setupScript,tgtBirdPositionOffsetX'].Blocks[0]);
	{TrialType: 'Baseline Trial', Repeats: 30}
console.log(allParadigmInput['setupScript,tgtBirdPositionOffsetX'].Blocks[0].TrialType);
	'Baseline Trial'
	
	
console.log(allParadigmInput['setupScript,tgtBirdPositionOffsetX'].Inputs);
		Baseline Trial: {SelectedOption: 'Constant', InheritedInputs: {…}, Probabilities: Array(1)}
		Learning Trial: {SelectedOption: 'Constant', InheritedInputs: {…}, Probabilities: Array(1)}
		Washout Trial:  {SelectedOption: 'Constant', InheritedInputs: {…}, Probabilities: Array(1)}
console.log(allParadigmInput['setupScript,tgtBirdPositionOffsetX'].Inputs['Baseline Trial']);
	 {SelectedOption: 'Constant', InheritedInputs: {…}, Probabilities: Array(1)}
console.log(allParadigmInput['setupScript,tgtBirdPositionOffsetX'].Inputs['Baseline Trial'].SelectedOption);
	'Constant'	
	
	
console.log(allParadigmInput['setupScript,tgtBirdPositionOffsetX'].Inputs['Baseline Trial'].SelectedOption);
	'Random'	
console.log(allParadigmInput['setupScript,tgtBirdPositionOffsetX'].Inputs['Baseline Trial'].InheritedInputs);
	setupScript,tgtBirdPositionOffsetX: (3) ['0', '0', '0']
	setupScript,tgtBirdPositionOffsetY: (3) ['0', '0', '0']
	setupScript,tgtBirdPositionOffsetYStandOnTargetFlag: (3) ['TRUE', 'TRUE', 'TRUE']
	setupScript,tgtBirdPositionOffsetZ: (3) ['0', '0', '0']
	
	(These are the individual inputs of the overall input objects, and the values they take in each item in the list)
	(in this example there are three items in the right panel)
 

*/

function rightPanelInitialWindowSetup(currentPanelInitialization,mainOverallParentContainer){
	console.log(mainOverallParentContainer);	 
	console.log(currentPanelInitialization); 
	
	// 1) Extracts stored values from currentPanelInitialization variable
	const currentSelectedOption = currentPanelInitialization.SelectedOption;  // stored trial type   
	const currentProbabilities = currentPanelInitialization.Probabilities; // probability for each item in list
	const currentInheritedInputs = currentPanelInitialization.InheritedInputs; // Main definition of each item in list
	
	
	// 2) Changes trial type in dropdown menu (in title row)	
	mainOverallParentContainer.querySelector('#SequenceTypeDropdownMenu').value = currentSelectedOption; 
	 
	// 3) Changes number of input items in list 
	const targetNumberBlocks = currentProbabilities.length; 
	dropdownChangeRightPanelSetNumberOfItems(targetNumberBlocks,mainOverallParentContainer);	
	
	// 4) Changes probability for each item
	const probabilityElements = mainOverallParentContainer.querySelectorAll('.trialexpandInputsItemProbability');
	probabilityElements.forEach((element,index) => {
		element.value=currentProbabilities[index];        
	});  
	
	//5) Changes input values for each item
	const inheritedInputElements = mainOverallParentContainer.querySelectorAll('.trialexpandInputsItemInheritedInputs');
	inheritedInputElements.forEach((element,index) => {
		
		// Locate all input and textarea elements within the current inherited input container
		const inputsAndTextareas = element.querySelectorAll('input, textarea');
		
		// Locate all input elements within the current inherited input container
		//const inputs = element.querySelectorAll('input'); 
		
		
		// Set values for each input
		inputsAndTextareas.forEach(input => {
			const inputName = input.name; // Get the name of the input (matches keys in currentInheritedInputs)

			
			 // Check if the name exists in currentInheritedInputs
			if (currentInheritedInputs.hasOwnProperty(inputName)) {
				const value = currentInheritedInputs[inputName][index];

				if (input.tagName === 'INPUT') {
					// Handle different input types
					switch (input.type) {
						case 'number':						 
							input.value = value; // Handle other input types (e.g., 'number', 'text')
							break;
						case 'checkbox':
							input.checked = value === 'TRUE';
							break;
						case 'radio':
							if (input.value === value) {
								input.checked = true;
							}
							break;
						case 'color':
							input.value = value; // Set the color value (e.g., '#ff0000')
							break; 
						case 'hidden': //do nothing
							break; 
						case 'textarea':  
							input.value = value;
							break;   
					}
				} else if (input.tagName === 'TEXTAREA') {
					// Handle <textarea> elements
					input.value = value;
				}
			} 
		});
		 
		 
		
	});   

}


