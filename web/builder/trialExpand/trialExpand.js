// Secondary script for the creation and managing of the paradigm popup window 


// Calls functions to populate entire paradigm popup window, 
// 1) Creates main container for paradigm popup window 
// 2) loops through each panel in the window and calls other function to create it and populate it
function createTrialExpandPopupContent(teWindow,mainContainer,htmlContent,htmlFileName){
    
 ///////////////////////////////////// STYLE SETUP  /////////////////////////////////////////  
    // WINDOW STYLE SETUP: Setup Paradigm Editor window's basic style and configuration
    teWindow.document.title='Paradigm Editor'; 
	teWindow.document.body.style.justifyContent = "center"; // Center content horizontally
	teWindow.document.body.style.alignItems = "center"; // Center content vertically
	teWindow.document.body.style.textAlign = "center"; // Center text
	teWindow.document.body.style.backgroundColor = "lightgray"; // Set background color 
	teWindow.document.body.style.margin = "0"; // Remove any default margin
	teWindow.document.body.style.height = "100%"; // Remove any default margin
 
 ///////////////////////////////////// INITIALIZATION AND DEFAULT SETTINGS /////////////////////////////////////////  
    
	// link to definitions for content and style of two panels of popup window (contained in trialExpandDef.js)
    const trialTypeManager=getTrialTypeManager();
    const inheritedWidthsDataManager=getInheritedWidthsDataManager(); 
	
	// configurations to initialize panels using previous user inputs from paradigm popups (those stores in allParadigmInput)
	const [leftPanelInitialization, rightPanelInitialization,parameterKey] = loadTrialExpandConfiguration(htmlContent,trialTypeManager);
	
	// saves HTML info
	trialTypeManager.setInheritedHTML(htmlContent);
 
 ///////////////////////////////////// IMPLEMENT PANELS  /////////////////////////////////////////  
	// Creates LEFT PANEL (paradigm phases, called 'Blocks')
    createTrialexpandPanel(teWindow,trialTypeManager,inheritedWidthsDataManager,true,'Blocks','Blocks',
								   htmlContent,leftPanelInitialization); 
	
	// Creates RIGHT PANEL (parameter value definition, called 'Inputs')
	// Creates one right panel for each trial type (baseline, adaptation, washout)
	// upon clicking on the respective trial type, it shows that right panel and hides the other right panels	
	let initialTrialTypeOptions= trialTypeManager.getOptions(); 	// list of trial types ( default + previous popups)
	 
	// lists & creates visible panel first (the first trial type in left panel list -> selected by default)	
	if (leftPanelInitialization) { // Define initialRightPanel from leftPanelInitialization
		const initialRightPanel = leftPanelInitialization[0].TrialType;
		// Rearrange initialTrialTypeOptions so that initialRightPanel is the first value
		initialTrialTypeOptions = [
			initialRightPanel,
			...initialTrialTypeOptions.filter(option => option !== initialRightPanel)
		];
	} 
	
	// loops through each trial type 
	initialTrialTypeOptions.forEach((trialType,index) => { 
		
		if (index === 0) {  // Creation of the first Right Panel (the visible one)
			 createTrialexpandPanel(teWindow, trialTypeManager,
				     			   inheritedWidthsDataManager,true,trialType,'Inputs',
								   htmlContent,rightPanelInitialization);   
			
			// sets up width based on parameter inputs, only for first right panel
    		inheritedInputWidthSetupAll(teWindow,inheritedWidthsDataManager);   
		 
		} else {
			 createTrialexpandPanel(teWindow, trialTypeManager,
					  			   inheritedWidthsDataManager,false,trialType,'Inputs',
								   htmlContent,rightPanelInitialization);  
	  
		} 
	   
    }); 
    
	createTrialexpandPanel(teWindow, trialTypeManager,
							   inheritedWidthsDataManager,false,'NewHidden','Inputs',
							   htmlContent,rightPanelInitialization);  
	
	
 ///////////////////////////////////// IMPLEMENT OVERALL SELECTION DROPDOWN  ///////////////////////////////////////// 
	 
	const okButtonContainer = teWindow.document.getElementById('button-container');
	console.log(okButtonContainer);
	createMainParadigmDropdown(teWindow,mainContainer,okButtonContainer,parameterKey); 
	 
} 



 ////// FUNCTION //////
// function to create and populate each individual panel in paradigm popup window 
function createTrialexpandPanel(teWindow,trialTypeManager,inheritedWidthsDataManager,visibleFlag,containerID,
								 inputSet,htmlContent,panelInitialization) {
	// Gets the panels style and content definitions from the getTrialExpandDef function
	const {
		containerOffsetWidth, 
		widthPercents, 
		titleConfigs, 
		inputItems, 
		defaultInputItems,
		mainSubContainerClass
	} = getTrialExpandDefinitions(inputSet);  
	
	
	// finds main container for paradigm popup window
	const mainContainer = teWindow.document.querySelector('.trialexpandMainContainer');


	// Creates & sets up main sub-container for this panel 
	var mainOverallParentContainer = teWindow.document.createElement('div'); 
	mainOverallParentContainer.id='parentContainer-'+containerID; 
	mainOverallParentContainer.className = mainSubContainerClass;
	if (visibleFlag) {
			mainOverallParentContainer.style.display = 'inline-block';
	}  else  {
			mainOverallParentContainer.style.display = 'none';
	}
	mainContainer.appendChild(mainOverallParentContainer); 

	// Gets Default labels shown when defining a new trial type 
	const populateTrialType_addNewOption = trialTypeManager.newOptionDefault;
	const populateTrialType_addNewOptionPrompt = trialTypeManager.newOptionPrompt; 


	/////////////////// CREATES CHILDREN COMPONENTS OF PANEL /////////////
	 // creates container/structure around list (container for paradigm or input blocks)
	const inputsListContainer = teWindow.document.createElement('ul');
	inputsListContainer.className = 'trialexpandInputsListContainer';
	mainOverallParentContainer.appendChild(inputsListContainer); 

	// creates horizontal line for drag event
	let dragHorizontalLine=createHorizontalLine(teWindow) ;
	inputsListContainer.appendChild(dragHorizontalLine);  

	// creates list of blocks/inputs items  
	var containerWidths =  createList(inheritedWidthsDataManager,teWindow,mainOverallParentContainer,inputsListContainer , 
									  titleConfigs, widthPercents,containerOffsetWidth,
									  defaultInputItems,inputItems,trialTypeManager,populateTrialType_addNewOption,
									  htmlContent,panelInitialization);
 


	/////////////////// CREATES EVENT LISTENERS /////////////
	// Defines Events Listeners shared by all panels 
	var inputsListEvents = [
		['change', handleDropdownChange, ['.trialexpandInputsItemTrialType','.trialexpandInputsTitleSequenceType'],teWindow,mainOverallParentContainer,trialTypeManager,inheritedWidthsDataManager,populateTrialType_addNewOptionPrompt,populateTrialType_addNewOption],
		['click', handleDeleteButtonClick, ['.trialexpandInputsItemDelete'],mainOverallParentContainer,inputsListContainer],
		['keydown', handleKeyDown, ['.trialexpandInputsItemRepeats','.trialexpandInputsItemPhase']],
		['input', handleRepeatsInput, ['.trialexpandInputsItemRepeats']],
		['dragstart', handleDragStart, ['.trialexpandInputsItemParent'],teWindow,mainOverallParentContainer,inputsListContainer,dragHorizontalLine,containerWidths],
		['dragend', handleDragEnd, ['.trialexpandInputsItemParent'],teWindow,mainOverallParentContainer,inputsListContainer,dragHorizontalLine],
		['dragover', handleDragOver, ['.trialexpandInputsItemParent'],teWindow,mainOverallParentContainer,dragHorizontalLine],
	   ]; 

	//Defines Additional Event Listener for left panel only: block click
	if (inputSet === 'Blocks') {
		inputsListEvents.push(['click', handleBlockClick,
							   ['.trialexpandInputsItemParent',
								'.trialexpandInputsItemOrder',
								'.trialexpandInputsItemDrag']]);
	}

	// Calls function to set up the Event Listeners defined in "inputsListEvents"
	inputsListEventListener(inputsListEvents,inputsListContainer);



}



/// FUNCTION///
// Function creates dropdown menu by the OK button,
// to select whether to use this popup for paradigm definition, or the trials.csv file, 
// or just the single value from the builder

function createMainParadigmDropdown(teWindow,mainContainer,okButtonContainer,parameterKey){  
	
	// support function: gray out main container when selecting something other than paradigm
	function grayOutContainer(mainContainer) {		
		mainContainer.style.pointerEvents = 'none'; // Disable user interaction
		mainContainer.style.opacity = '0.5'; // Make the container look grayed out		 
	}

	// support function: restore main container when selecting paradigm
	function restoreContainer(mainContainer) {		
		mainContainer.style.pointerEvents = 'auto'; // Re-enable user interaction 
		mainContainer.style.opacity = '1'; // Restore full visibility 
	} 
	
    // Changes okButtonContainer style for horizontal layout (OK button and dropdown on same line)
    okButtonContainer.style.display = 'flex';
    okButtonContainer.style.flexDirection = 'row'; 
	okButtonContainer.style.alignItems = 'flex-start'; // Align items to the top of the container
	okButtonContainer.style.justifyContent = 'flex-start'; // Align items to the left
    okButtonContainer.style.gap = '10px'; // Add some spacing between items
	
	
    // Create the label for the dropdown menu
    const label = teWindow.document.createElement('label');
    label.id='MainParadigmDropdownLabel';
    label.textContent = 'Use values from:'; 
    label.setAttribute('for', 'dropdownMenu'); 
    label.classList.add('trialexpandMainDropdownLabel'); 
    label.style.marginLeft = '50px'; 
     
    // Create the dropdown menu 
    const dropdownMenu = teWindow.document.createElement('select');
    dropdownMenu.id = 'MainParadigmDropdown';
    dropdownMenu.classList.add('trialexpandMainDropdownSelect'); 
    dropdownMenu.style.marginRight = '100px'; 

    // Adds options to the dropdown  
	const mainDropdownOptionLabels = ['Paradigm Editor','Builder (fixed values)','File (trials.csv)'];
	const mainDropdownOptions = ['Paradigm','Builder','File'];
    mainDropdownOptions.forEach((option,index) => {
        const optionElement = teWindow.document.createElement('option');
        optionElement.value = option; // Use the option for the value
        optionElement.textContent = mainDropdownOptionLabels[index]; // Use the descriptive label for display 
        dropdownMenu.appendChild(optionElement);
    }); 
	
    //// Add an event listener to the dropdown menu
    dropdownMenu.addEventListener('change', (event) => { 
        const selectedValue = event.target.value; // Get the selected value  
		allParadigmDropdown[parameterKey]=selectedValue;  // Stores selection in memory
		
		// Adjusts style of paradigm editor
		if (selectedValue=='Paradigm'){
			restoreContainer(mainContainer);
		}else{
			grayOutContainer(mainContainer); 
		}
    });
  
	// Append elements to the container as the first elements
	okButtonContainer.insertBefore(dropdownMenu, okButtonContainer.firstChild);
	okButtonContainer.insertBefore(label, okButtonContainer.firstChild);
	
	// Sets initial dropdown value to that stored in variable allParadigmDropdown
	if (allParadigmDropdown[parameterKey]){
		// if variable previously defined -> selects this option in the dropdown
		dropdownMenu.value = allParadigmDropdown[parameterKey]; 
	}  
	
	// Triggers a change event to apply settings and store initial selected option (as if we manually selected it)
	dropdownMenu.dispatchEvent(new Event('change'));

}


    
