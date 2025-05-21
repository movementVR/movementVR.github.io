// SCRIPT WITH FUNCTIONS TO SAVE & LOAD PARADIGM EDITOR CONFIGURATION 
// (List Elements previously created for selected Parameter Group)

// function is called when the paradigm popup window is closed (with OK or close/X button)
// main function that manages how to extract defined paradigm values via other functions 
function paradigmSaveConfiguration(trialBuilderWindow){ 
	
	// 1) Stores configuration of Left Panel
	var leftPanelConfiguration = []; // variable to store internal configuration of Left Panel
	// Loops through Left Panel list elements -> stores their properties	 
	const leftPanel = trialBuilderWindow.document.querySelector('.trialbuilderPanel.blocks-panel'); 
	const leftPanelListElements = leftPanel.querySelectorAll('.trialbuilderInputsItemParent:not(.template)'); 	
    leftPanelListElements.forEach(element => {   // each element represents a Trial Block (paradigm phase)
 
		// Left Panel Elements Info: trialType & nTrials
		const trialType = element.querySelector('.trialbuilderInputsItem.itemTrialType').value;
		const nTrials = element.querySelector('.trialbuilderInputsItem.itemRepeats').value; 
		
		// Stores information for internal paradigm configuration 
		leftPanelConfiguration.push({
			trialType: trialType,
			repeats: nTrials // Ensure the value is an integer
		});	  
	});
	
	
	// 2) Stores configurations of the Right Panels
	var allRightPanelConfiguration = {}; // variable to store internal configurations of all Right Panels
	
	// Extract unique trial types from the leftPanelConfiguration
	const uniqueTrialTypes = [...new Set(leftPanelConfiguration.map(trial => trial.trialType))]; 
	
	// Loops through uniqueTrialTypes -> associated Right Panels 
	uniqueTrialTypes.forEach(trialType => { 
		// Right Panel for this trial type & Overall Properties
		const rightPanelName = 'trialbuilder-right-panel-' + trialType;		  
		const rightPanel = trialBuilderWindow.document.getElementById(rightPanelName);   
		const rightPanelSequenceType = rightPanel.querySelector('#SequenceTypeDropdownMenu').value;  
		
		// Stores overall properties in configuration variable (key=trialType, object=all info)
		allRightPanelConfiguration[trialType]={
			sequenceType: rightPanelSequenceType,
			listElements: [], 
		}

		
		// Loops through the current Right Panel list elements -> stores their properties	  
		const rightPanelListElements = rightPanel.querySelectorAll('.trialbuilderInputsItemParent:not(.template)'); 	
		rightPanelListElements.forEach(element => {   // each element contains a copy of the Parameter Input Group

			// Right Panel Elements Info: Parameters input values & Probabilities 
			var parameterInputValues={};
			
			// gets current form -> FormData -> [name,value] data
			const form =element.querySelector('form'); 
			const formData = new FormData(form); 
			const data = Object.fromEntries(formData.entries()); 
			for (const [name, value] of Object.entries(data)) {
				parameterInputValues[name]=value;
			}

			// Gets probability element
			const probabilityValue = Number(element.querySelector('.trialbuilderInputsItem.itemProbability').value); 
			
			// Stores information for internal paradigm configuration (adds elements to listElement) 
			allRightPanelConfiguration[trialType].listElements.push({
				inheritedInputs: parameterInputValues,
				probabilities: probabilityValue  
			});	   
		});	 
	});
	
	// key for current Parameter Group edited in Paradigm Editor
	const groupKey = paradigmGetKey(trialBuilderWindow); 
	builderSession.sessionConfigParadigmEditor[groupKey]={
			leftPanel: leftPanelConfiguration,
			rightPanel: allRightPanelConfiguration, 		
	}
	// Left Panel configuration is used across Parameter Groups by default 
	// (only new ones which don't have their own configuration)
	builderSession.sessionConfigParadigmEditor['default'] = {
			leftPanel: leftPanelConfiguration,		
	} 
	
}
 
/*function paradigmLoadConfigurationFile(){
	// Retrieve the string from localStorage
	let storedDataString = localStorage.getItem('myPSC');

	// Check if data exists
	if (storedDataString) {
	  // Parse the JSON string back to an object
	  let storedData = JSON.parse(storedDataString);
 
		console.log(storedData);
	} else {
	  console.log("No data found in localStorage.");
	}
}*/

// load configuration for left panel
function trialbuilderLoadConfigurationLeft(trialBuilderWindow){	
	let initialListElements = []; // Initial List Elements for Left Panel	
	const groupKey = paradigmGetKey(trialBuilderWindow); // key to load Parameter Group Configuration 
	if (builderSession.sessionConfigParadigmEditor[groupKey]) {		
		// Stored configuration for this Parameter Group (previous use of Paradigm Editor itor for this group)
		initialListElements = builderSession.sessionConfigParadigmEditor[groupKey].leftPanel;
	} else if (builderSession.sessionConfigParadigmEditor['default']) { 
		// Stored default left panel (previous use of Editor for any parameter group)
		initialListElements = builderSession.sessionConfigParadigmEditor['default'].leftPanel;
	} else {
		// Default Left Panel <- Adaptation Phases from Builder (first use of Paradigm Editor)
		initialListElements = [
			{   trialType: "Baseline Trial",
				repeats: builderIOGetParameterValue("trialScript,paradigmBaseline")        },
			{   trialType: "Learning Trial",
				repeats: String(Number(builderIOGetParameterValue("trialScript,paradigmGradual")) + 
									Number(builderIOGetParameterValue("trialScript,paradigmFullPerturbation")))  },
			{   trialType: "Washout Trial",
				repeats: builderIOGetParameterValue("trialScript,paradigmWashout")   }  
		]; 	 
	} 
	return initialListElements;
}

// load configuration for right panel
function paradigmLoadConfigurationRight(trialBuilderWindow,rightPanel){ 
	// 1) Initialize configuration variables	
	let initialListElements = []; // Initial List Elements for Right Panel	
	let initialListSequence = ""; // Sequence Type  for Right Panel	
	
	// 2) Get Trial Type from right panel ID ("trialbuilder-right-panel-" + trialType) 
	const rightPanelId = rightPanel.getAttribute('id') || '';
	const trialType = rightPanelId.replace('trialbuilder-right-panel-', '');
	
	// 3) Get Group Key to load Parameter Group Configurations
	const groupKey = paradigmGetKey(trialBuilderWindow); 
	
	// 4) Retrieve configuration if it exists for this parameter group and trial type
	if (builderSession.sessionConfigParadigmEditor[groupKey]) {		
		// Stored configuration for this Parameter Group & Trial Type 
		const initialListConfiguration = builderSession.sessionConfigParadigmEditor[groupKey].rightPanel[trialType];
		initialListSequence = initialListConfiguration.sequenceType;
		initialListElements = initialListConfiguration.listElements;		
	}  
	return {initialListSequence,initialListElements};
} 

// gets [key] for current Parameter Group to store/load Paradigm Editor configuration
function paradigmGetKey(trialBuilderWindow){
    
	// --> First instance of inputGroup in trialBuilderWindow:
	const inputGroup = trialBuilderWindow.document.querySelector( 
		'.trialbuilderInputsItem.itemInheritedInputs.inputs-panel');
    
	// --> groupKey = 'name' attributes of active (selected) input fields, joined by '&'       
    // select all enabled inputs/textareas 
    const activeFields = inputGroup.querySelectorAll('input:not([disabled]), textarea:not([disabled])');
    
    // get "name" attributes and join with '&'
    const groupKey = Array.from(activeFields)
        .map(el => el.getAttribute('name'))
        .join('&');
 
    return groupKey;
    
}



