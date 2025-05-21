 
function builderIOParametersFromEditorTrial(trialBuilderWindow){     
	
	var parameterValuesByTrial = {}; // temporary local variable to stores trial-by-trial parameter values 
	
	const leftPanel = trialBuilderWindow.document.querySelector('.trialbuilderPanel.blocks-panel'); 
	const leftPanelListElements = leftPanel.querySelectorAll('.trialbuilderInputsItemParent:not(.template)'); 
    
	// Steps through all Left Panel list elements -> creates trial-by-trial parameter values for each phase  
    leftPanelListElements.forEach(element => {   // each element represents a Trial Block (paradigm phase)

		// 1) Parse User Input 
		// Left Panel -> Extracts trial information from left panel phase block
		const trialType = element.querySelector('.trialbuilderInputsItem.itemTrialType').value;
		const nTrials = Number(element.querySelector('.trialbuilderInputsItem.itemRepeats').value); 
		
		// gets Right Panel
		const rightPanelName = 'trialbuilder-right-panel-' + trialType;		  
		const rightPanel = trialBuilderWindow.document.getElementById(rightPanelName); 
		
		// Right Panel -> Get the selected option from the dropdown menu for this right panel
		const sequenceType = rightPanel.querySelector('#SequenceTypeDropdownMenu').value; 
 
		// Right Panel -> parsed form values for: 
		// - Parameters input fields: "parametersGroupedByName"
		// - Probabilities: "probabilityValues"
		const [parametersGroupedByName,probabilityValues] = trialExpandGetRightPanelForms(rightPanel); 
		
		// 2) Computes trial-by-trial parameter values for csv export
		const currentPhaseValuesByTrial = generateOutputTrials(nTrials, sequenceType, 
												  parametersGroupedByName, probabilityValues);
		
         
		// 3) Stores trial-by-trial parameter values 
		// (Using a temporary local parameterValuesByTrial because we need to concatenate different phases,
		//  and then eventually replace previous values in global variable)        
        Object.keys(currentPhaseValuesByTrial).forEach(key => { // key = parameter name
            if (!parameterValuesByTrial[key]) {
                parameterValuesByTrial[key] = []; // Initialize the key if it doesn't exist
            }
			// Concatenates current phase `currentPhaseValuesByTrial` to local `parameterValuesByTrial`
            parameterValuesByTrial[key] = parameterValuesByTrial[key].concat(currentPhaseValuesByTrial[key]);  
        });		 
 
    });	   
	
	// 4) Adds local variable 'parameterValuesByTrial' to global storage variables: 
    //    'builderSession.parameters' (main export) and 'builderSession.parametersBackupTrial' (backup) 
	Object.keys(parameterValuesByTrial).forEach(key => { 
    	builderSession.parameters[key] = parameterValuesByTrial[key];   
	});  
    
	 
	
	// // SUPPORTING FUNCTIONS // // 

	// function takes a right panel as input (an object of class "trialbuilderPanel.inputs-panel")
	// extracts all forms, and organizes form inputs and their values by input name
	function trialExpandGetRightPanelForms(rightPanel) { 
		// Find all <form> elements within the rightPanel
		const panelInputBlocks = rightPanel.querySelectorAll('.trialbuilderInputsItemParent:not(.template)'); 

		// Initialize an object to store inputs grouped by name, and the probabilities
		const parametersGroupedByName = {};
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
				if (!parametersGroupedByName[name]) {
					parametersGroupedByName[name] = [];
				}
				// Push the value into the array for this input name
				parametersGroupedByName[name].push(value);
			}

			// Gets probability element
			const probabilityValue = Number(inputBlock.querySelector('.trialbuilderInputsItem.itemProbability').value); 
			probabilityValues.push(probabilityValue);

		});	  

		return [parametersGroupedByName, probabilityValues];
	}
	
	


	// Function generates parameter values across all trials in this phase 
	function generateOutputTrials(nTrials, sequenceType, parametersGroupedByName, valueProbability) {

		// Initialize the currentPhaseValuesByTrial object
		const currentPhaseValuesByTrial = {};

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
		if (sequenceType === 'random' || sequenceType === 'blocked') {
			const valuesLength = Object.values(parametersGroupedByName)[0]?.length || 0;
			if (valuesLength > 0) {
				if (sequenceType === 'random') {
					const probabilities = valueProbability || Array(valuesLength).fill(1 / valuesLength); // Default equal probability
					randomIndices = generateRandomIndicesWithProbability(probabilities, nTrials);
				} else if (sequenceType === 'blocked') {
					randomIndices = generateBlockedOrder(Array.from({ length: valuesLength }, (_, i) => i), nTrials);
				}
			}
		}


		// Iterate through each input name in parametersGroupedByName
		for (const [parameterName, values] of Object.entries(parametersGroupedByName)) {
			if (values.length < 1) continue; // Skip if no values are provided

			switch (sequenceType) {
				case 'constant':
					// First value repeated nTrials times
					currentPhaseValuesByTrial[parameterName] = Array(nTrials).fill(values[0]); 
					break;

				case 'linear':
					// Linear interpolation between first and second values
					if (values.length < 2 || isNaN(Number(values[0])) || isNaN(Number(values[1]))) {
						// Fallback to repeating the first value
						currentPhaseValuesByTrial[parameterName] = Array(nTrials).fill(values[0]);
					} else {
						currentPhaseValuesByTrial[parameterName] = linearInterpolation(Number(values[0]), Number(values[1]), nTrials);
					}
					break;

				case 'sequential':
					// Repeat all values in order until nTrials are filled
					currentPhaseValuesByTrial[parameterName] = Array.from({ length: nTrials }, (_, i) => values[i % values.length]);
					break;

				case 'random':
					// Random sampling of values based on precomputed indices 
					currentPhaseValuesByTrial[parameterName] = randomIndices.map(index => values[index]);
					break;

				case 'blocked':
					// Blocked random sampling based on precomputed indices 
					currentPhaseValuesByTrial[parameterName] = randomIndices.map(index => values[index]);
					break;

				case 'uniform':
					// Uniform samples between first and second value
					if (values.length < 2 || isNaN(Number(values[0])) || isNaN(Number(values[1]))) {
						// Fallback to repeating the first value
						currentPhaseValuesByTrial[parameterName] = Array(nTrials).fill(values[0]);
					} else {
						currentPhaseValuesByTrial[parameterName] = generateUniformSamples(Number(values[0]), Number(values[1]), nTrials);
					}
					break;

				case 'normal':
					// Normal samples with mean and variance
					if (values.length < 2 || isNaN(Number(values[0])) || isNaN(Number(values[1]))) {
						// Fallback to repeating the first value
						currentPhaseValuesByTrial[parameterName] = Array(nTrials).fill(values[0]);
					} else {
						currentPhaseValuesByTrial[parameterName] = generateNormalSamples(Number(values[0]), Number(values[1]), nTrials);
					}
					break;

				default:
					throw new Error(`Invalid sequenceType: ${sequenceType}`);
			}
		}

		return currentPhaseValuesByTrial;
	}

}
 