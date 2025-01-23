
// script with functions handling storing and loading of data in the paradigm popup window


// function to load input values for the parameter of interest from existing builder forms 
function loadSpecificInputValue(htmlFileName,targetInputName){ 
    //  targetInputName="trialScript,paradigmFullPerturbation";
    if (allTrialDesignForms[htmlFileName]) {
        const storedForm = allTrialDesignForms[htmlFileName]; // Retrieve the stored form data
        
        // Loop through each element in the stored form to find the desired element
        for (let i = 0; i < storedForm.elements.length; i++) {
            const storedElement = storedForm.elements[i]; // Get each stored element
            
            // Check if the element name matches the targetInputName (eg "trialScript,paradigmFullPerturbation")
            if (storedElement.name === targetInputName) {
                return storedElement.value; // Return the value of the matching element
            }
        }
    } else {
        console.error('Stored form for the given htmlFileName not found.');
        return null;
    } 
}



 
// function retrieves stored configuration values from previous paradigm popups (stored in var allParadigmInput)
// and updates list of trial types in trial type manager
function loadTrialExpandConfiguration(htmlContent,trialTypeManager){
	// 1) Retrieves previous paradigm popup configurations 
	// initializes returns for left and right panels
	var leftPanelInitialization=null;
	var rightPanelInitialization=null;
	
	// Name of first input -> parameterKey under which config has been stored
	const parameterKey=htmlContent.match(/name="([^"]+)"/)[1];
	
	// Checks if this specific popup has been opened before --> retrieves its values for both right and left panels
	if (allParadigmInput[parameterKey]){	
		leftPanelInitialization = allParadigmInput[parameterKey].Blocks; 
		rightPanelInitialization = allParadigmInput[parameterKey].Inputs; 
	} else { // Otherwise, checks if any popup has been opened before -> uses these values for left panel only
		const allKeys = Object.keys(allParadigmInput); // all keys from allParadigmInput 
		if (allKeys.length > 0) { // if there are any keys, uses the last one			
			const lastKey = allKeys[allKeys.length - 1];
			leftPanelInitialization = allParadigmInput[lastKey].Blocks; //left panel only
		}  
	}
	
	// 2) Updates list of trial types in trial type manager
	// gets list of trial types from previous paradigm popup window 
	var additionalTrialTypeOptions=null;
	if (rightPanelInitialization){ // if current popup was previously defined, adds its trial types options		 
		additionalTrialTypeOptions = Object.keys(rightPanelInitialization);
	} else if (leftPanelInitialization){ // otherwise, if any popup was previously defined, adds trial types options from last popup	
		additionalTrialTypeOptions = leftPanelInitialization.map(trial => trial.TrialType);
	}  
	// adds the additional trial types to the trial type manager
	if (additionalTrialTypeOptions){
		additionalTrialTypeOptions.forEach((trialType,index) => { 
			if (!trialTypeManager.getOptions().includes(trialType)) {
				trialTypeManager.addOption(trialType);
			}
		}); 
	}
	 
	return [leftPanelInitialization,rightPanelInitialization,parameterKey];
}
	
 
 


// FUNCTIONS TO EXTRACT VALUES AND PREP PARADIGM DATA 

// function is called when the paradigm popup window is closed (with OK or close/X button)
// main function that manages how to extract defined paradigm values via other functions 
function trialExpandStoreValues(trialExpandWindow){  
	
	// 1) Initialization / initial definitions
	
	// 1A) Gets elements references from popup window panels
	// overall window main container (both left and right panels)
	const overallContainer = trialExpandWindow.document.getElementById('trialexpand-contentContainer'); 
	
	// left panel 
	const leftPanel = overallContainer.querySelector('.trialexpandMainContainerBlocks'); 
	const allParadigmPhases = leftPanel.querySelectorAll('.trialexpandInputsItemParent'); //class="trialexpandInputsItemParent"
      
	// 1B) New variables initialization
	// Initialize the object to store trial-by-trial parameter values for this popup
	var paradigmOutput = {}; 
	
	// Initialize variables to store user inputs for this popup (left panel)
	var currentInputItems_Blocks = []; // variable for left panel
	var currentInputItems_Inputs = {}; // variable for right panel
	
    
	// 2) Extract and computes parameter values for each paradigm phase
    allParadigmPhases.forEach(paradigmPhaseBlock => {   
		
		// 2A) Extracts all information from user input		
		// Extracts trial information from left panel phase block
		const trialType = paradigmPhaseBlock.querySelector('.trialexpandInputsItemTrialType').value;
		const nTrials = Number(paradigmPhaseBlock.querySelector('.trialexpandInputsItemRepeats').value); 
		
		// gets right panel info for this trial type
		const rightPanelName = 'parentContainer-' + trialType;		  
		const rightPanel = trialExpandWindow.document.getElementById(rightPanelName); 
		
		// Get the selected option from the dropdown menu for this right panel
		const selectedOption = rightPanel.querySelector('#SequenceTypeDropdownMenu').value;
		
 
		// 2B) Computes and Stores information for trials.csv (storing trial-by-trial values)
		// computes trial-by-trial parameters for this phase based on N Trials (left panel) and defs from right panel
		const [inputsGroupedByName,probabilityValues] = trialExpandGetRightPanelForms(rightPanel); 
		const outputTrials = generateOutputTrials(inputsGroupedByName, nTrials, rightPanel,probabilityValues,selectedOption);
         
		
        // Merge `outputTrials` into `paradigmOutput`
        Object.keys(outputTrials).forEach(key => {
            if (!paradigmOutput[key]) {
                paradigmOutput[key] = []; // Initialize the key if it doesn't exist
            }
            paradigmOutput[key] = paradigmOutput[key].concat(outputTrials[key]); // Concatenate arrays
        });
		
		
		// 2C) Stores information for internal paradigm configuration (storing the raw user inputs)
		// Stores current phase information from left panel 
		currentInputItems_Blocks.push({
			TrialType: trialType,
			Repeats: nTrials // Ensure the value is an integer
		});
		
		// Stores information from each trial type from right panel 
		currentInputItems_Inputs[trialType]={
			SelectedOption: selectedOption,
			InheritedInputs: inputsGroupedByName,
			Probabilities: probabilityValues  
		};
 
    });	   
	
	// 3) Adds variables from current popup to overall storage variables 
	// 'allParadigmOutput' stores trial-by-trial parameter values for trials.csv download
	Object.keys(paradigmOutput).forEach(key => {
    	allParadigmOutput[key] = paradigmOutput[key]; 
	}); 
	
	// 'allParadigmInput' stores raw user inputs for internal paradigm configuration 
	//  (to recreate current windown popup values if the person re-opens it)   
	// defines the 'key' to be the name of the first parameter (e.g., 'setupScript,tgtBirdPositionOffsetX')
	//      (this was stored in currentInputItems_Inputs -> InheritedInputs) 
	const firstInheritedInputs=Object.values(currentInputItems_Inputs)[0].InheritedInputs;
	const allParameters = Object.keys(firstInheritedInputs);
	const parameterKey = Object.keys(firstInheritedInputs)[0];
	allParadigmInput[parameterKey]={
		Blocks: currentInputItems_Blocks,
		Inputs: currentInputItems_Inputs 
	};
	
	// 'allParadigmDropdown' stores the main paradigm dropdown selecting whether the user wants 
	// to use the parameter values from the paradigm editor or not
	// Values are stored using parameterKey, but here we expand it to each parameter
	allParameters.forEach(key => {
    	allParadigmDropdown[key] = allParadigmDropdown[parameterKey]; 
	});  
	
}
 

// function takes a right panel as input (an object of class "trialexpandMainContainerInputs")
// extracts all forms, and organizes form inputs and their values by input name
function trialExpandGetRightPanelForms(rightPanel) { 
    // Find all <form> elements within the rightPanel
    const panelInputBlocks = rightPanel.querySelectorAll('.trialexpandInputsItemParent');

    // Initialize an object to store inputs grouped by name, and the probabilities
    const inputsGroupedByName = {};
	const probabilityValues = [];

    // Loop through each form
    panelInputBlocks.forEach(inputBlock => { 
		
		// gets current form 
		const form =inputBlock.querySelector('form');
		
        // Create a FormData object for the current form
        const formData = new FormData(form);

        // Convert the form data to an object
        const data = Object.fromEntries(formData.entries());

        // Group values by input name
        for (const [name, value] of Object.entries(data)) {
            // If the input name doesn't exist in the result object, initialize it as an empty array
            if (!inputsGroupedByName[name]) {
                inputsGroupedByName[name] = [];
            }
            // Push the value into the array for this input name
            inputsGroupedByName[name].push(value);
        }
		
		// Gets probability element
		const probabilityValue = Number(inputBlock.querySelector('.trialexpandInputsItemProbability').value); 
		probabilityValues.push(probabilityValue);
		
    });	  
	 
	return [inputsGroupedByName, probabilityValues];
}
 

 
// Function generates parameter values across all trials in this phase 
function generateOutputTrials(inputsGroupedByName, nTrials, rightPanel, valueProbability, selectedOption) {

    // Initialize the outputTrials object
    const outputTrials = {};

    // Helper functions
    function linearInterpolation(start, end, points) {
        if (isNaN(start) || isNaN(end)) return null; // Return null for invalid numerical inputs
        const step = (end - start) / (points - 1);
        return Array.from({ length: points }, (_, i) => start + step * i);
    }

	function generateRandomIndicesWithProbability(probabilities, trials) {  
        const cumulativeProbabilities = probabilities.reduce((acc, p, i) => {
            acc.push((acc[i - 1] || 0) + p);
            return acc;
        }, []); 
        return Array.from({ length: trials }, () => {
            const randomValue = Math.random() * cumulativeProbabilities[cumulativeProbabilities.length - 1];
            return cumulativeProbabilities.findIndex(cp => randomValue <= cp);
        });
    }
	 

    function generateBlockedOrder(values, trials) {
        const fullReps = Math.floor(trials / values.length);
        const remaining = trials % values.length;
        const sequence = [];
        for (let i = 0; i < fullReps; i++) {
            sequence.push(...values.sort(() => Math.random() - 0.5)); // Shuffle each block
        }
        sequence.push(...values.slice(0, remaining));
        return sequence;
    }

    function generateUniformSamples(lower, upper, trials) {
        if (isNaN(lower) || isNaN(upper)) return null; // Return null for invalid numerical inputs
        return Array.from({ length: trials }, () => Math.random() * (upper - lower) + lower);
    }

    function generateNormalSamples(mean, variance, trials) {
        if (isNaN(mean) || isNaN(variance)) return null; // Return null for invalid numerical inputs
        const stddev = Math.sqrt(variance);
        return Array.from({ length: trials }, () => {
            // Box-Muller transform
            const u1 = Math.random();
            const u2 = Math.random();
            return mean + stddev * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        });
    }
	
	
	// Precompute random indices for Random and Blocked cases
    let randomIndices = null;
    if (selectedOption === 'Random' || selectedOption === 'Blocked') {
        const valuesLength = Object.values(inputsGroupedByName)[0]?.length || 0;
        if (valuesLength > 0) {
            if (selectedOption === 'Random') {
				const probabilities = valueProbability || Array(valuesLength).fill(1 / valuesLength); // Default equal probability
                randomIndices = generateRandomIndicesWithProbability(probabilities, nTrials);
            } else if (selectedOption === 'Blocked') {
                randomIndices = generateBlockedOrder(Array.from({ length: valuesLength }, (_, i) => i), nTrials);
            }
        }
    }
	

    // Iterate through each input name in inputsGroupedByName
    for (const [inputName, values] of Object.entries(inputsGroupedByName)) {
        if (values.length < 1) continue; // Skip if no values are provided

        switch (selectedOption) {
            case 'Constant':
                // First value repeated nTrials times
                outputTrials[inputName] = Array(nTrials).fill(values[0]); 
                break;

            case 'Linear':
                // Linear interpolation between first and second values
                if (values.length < 2 || isNaN(Number(values[0])) || isNaN(Number(values[1]))) {
                    // Fallback to repeating the first value
                    outputTrials[inputName] = Array(nTrials).fill(values[0]);
                } else {
                    outputTrials[inputName] = linearInterpolation(Number(values[0]), Number(values[1]), nTrials);
                }
                break;

            case 'Sequential':
                // Repeat all values in order until nTrials are filled
                outputTrials[inputName] = Array.from({ length: nTrials }, (_, i) => values[i % values.length]);
                break;

            case 'Random':
                // Random sampling of values based on precomputed indices
                outputTrials[inputName] = randomIndices.map(index => values[index]);
                break;

            case 'Blocked':
                // Blocked random sampling based on precomputed indices
                outputTrials[inputName] = randomIndices.map(index => values[index]);
                break;

            case 'Uniform':
                // Uniform samples between first and second value
                if (values.length < 2 || isNaN(Number(values[0])) || isNaN(Number(values[1]))) {
                    // Fallback to repeating the first value
                    outputTrials[inputName] = Array(nTrials).fill(values[0]);
                } else {
                    outputTrials[inputName] = generateUniformSamples(Number(values[0]), Number(values[1]), nTrials);
                }
                break;

            case 'Normal':
                // Normal samples with mean and variance
                if (values.length < 2 || isNaN(Number(values[0])) || isNaN(Number(values[1]))) {
                    // Fallback to repeating the first value
                    outputTrials[inputName] = Array(nTrials).fill(values[0]);
                } else {
                    outputTrials[inputName] = generateNormalSamples(Number(values[0]), Number(values[1]), nTrials);
                }
                break;

            default:
                throw new Error(`Invalid selectedOption: ${selectedOption}`);
        }
    }

    return outputTrials;
}

 

 

 