

////////////////// GET + STORE PARAMETER VALUES FROM CSV FILE /////////////////////////// 

// //  function builderIOImportFileInterface // //
function builderIOImportFileInterface(staticBuilderWindow, selectedParameters) { 
    
	// Frame for Help Guide  
	const importCsvGuide = staticBuilderWindow.document.getElementById('importCsvGuide');
	
    // Gets and opens Import Csv File Interface
    const importCsvFileFrame = staticBuilderWindow.document.getElementById('importcsv');       
    importCsvFileFrame.contentWindow.openModal( 
        validationFunction, 
        callbackFunction,
		importCsvGuide
    );   
    
    async function validationFunction(fileSource){
        return await builderIOParametersFromFile(fileSource, true, false, "none",selectedParameters); 
    }
     
    async function callbackFunction(buttonClicked, fileSource, selectedScope, constantAsStaticBuilder){ 
        // (buttonClicked: "OK" or "Cancel"; selectedScope: "selected" or "all") 
        if (buttonClicked == "OK"){ 
            // OK -> Saves Source Selection & Imports File
            await builderIOParametersFromFile(fileSource, false, false, 
                                              selectedScope, selectedParameters, constantAsStaticBuilder);  
        } else {
            // Cancel -> Reverts Source Selection & Aborts 
            builderSession.parametersSource = structuredClone(builderParametersBackupSource);  
        }
        
        // Updates Static Builder inputs values and opacity
	    builderIOParametersToEditor(staticBuilderWindow); 
        setInputsOpacity(staticBuilderWindow);  
        
    }
}



// //  function builderIOParametersFromFile // //
// loads parameters values from file -> populates builder forms & stores to builderSession.parameters
// INTERNAL FILE <- fileSource = file path string,
// EXTERNAL FILE <- fileSource = file object (loaded by user using <input type='file'>)
// (performValidation = whether to notify the user of what was loaded and changed)

async function builderIOParametersFromFile(fileSource, performValidation = true, showAlert = false, importParameters = "all", selectedParameters = [], constantAsStaticBuilder = false) {  
    
	// 1) Read File
	const csvData = await loadFile(fileSource); 
    
	const rows = csvData.split(/\r\n|\r|\n/);

	// 2) Checks that all is correct (file format, parameter names & values)
	let validationOutput = {}; 
	if (performValidation) { 
        validationOutput = validateFile(rows,selectedParameters);
	}

	// 3) If error -> show error  
	if (validationOutput.errorMessage) {
        if (showAlert){
		  alert(validationOutput.errorMessage);
        } 
	} else { 	        
        // 4) If no error -> Imports values 
        let importParametersArg;
        switch (importParameters) {
            case "all":
                importParametersArg="all";
                break;
            case "selected":
                importParametersArg=selectedParameters;
                break;
            case "none":
                importParametersArg=[];
                break;
            default:
                importParametersArg=importParameters;
                break;
        }
	    importValues(rows, importParametersArg, constantAsStaticBuilder);
    }
     
    
    // 5) Returns errorMessage ("" if no error) & other validation output variables 
    return validationOutput;
    
    
	// SUPPORT FUNCTIONS 
    function validateFile(rows,selectedParameters) {
        let errorMessage = ""; 
        const multitrialRows = []; // array to store row N
        const multitrialNValues =  new Set(); // "Set" to store NValues (automatically holds UNIQUE values) 
        let parameterCount = 0;
        let anyConstant = false;
        let selectedConstant = false;
        const missingSelected=new Set(selectedParameters);

        rows.forEach((row, rowIndex) => {
            if (!row) return;
            parameterCount++;
            const rowNum = rowIndex + 1;
            const rowElements = row.split(',');

            // a) Missing parameter name parts?
            if (rowElements.length < 2 || !rowElements[0].trim() || !rowElements[1].trim()) {
                errorMessage += `  - Row ${rowNum}: Missing parameter name in column 1 or 2\n`;
                return;
            }

            // b) Empty cells in the middle of the values list?
            const rawValues = rowElements.slice(2);
            const trimmedValues = rawValues.map(v => v.trim());
            const firstEmpty = trimmedValues.findIndex(v => v === "");
            if (firstEmpty !== -1 && trimmedValues.slice(firstEmpty + 1).some(v => v !== "")) {
                errorMessage += `  - Row ${rowNum}: Blanks are only allowed at the end of the values list\n`;
                return;
            }

            // --> Premilinary Parsing after passing checks a) and b)
            const key = `${rowElements[0].trim()},${rowElements[1].trim()}`; // 1) parameter name
            const nonEmptyValues = trimmedValues.filter(v => v !== ""); // 2) parameter (non-empty) values 
            const nValues = nonEmptyValues.length; // 3) nValues === Number of Trials for this parameter 
            anyConstant ||= (nValues === 1); // 4) anyConstant flag <- true if single value (any parameter) 
            selectedConstant ||= (selectedParameters.includes(key) && nValues === 1); // 5) selectedConstant flag <- true if single value (selected parameter) 
            
            // c) Inexistent parameter name?
            if (!(key in builderSession.parameters)) {
                errorMessage += `  - Row ${rowNum}: Parameter "${key}" does not exist\n`;
                return;
            }

            // d) No values provided?
            if (nValues === 0) {
                errorMessage += `  - Row ${rowNum}: No trial values provided for "${key}"\n`;
                return;
            }

            // e) Invalid parameter values?
            const uniqueValues = [...new Set(nonEmptyValues)];
            const validationError = validateValues(key, uniqueValues);
            if (validationError) { 
                errorMessage += `  - Row ${rowNum}: ${validationError}\n`;
                return;
            }
            
            // --> "Global" checks after passing within-parameter checks a)-e)
            //      (implemented via variables that hold info across rows, 
            //       warning message written after loop)
            // f) Mismatched trial counts across parameters?
            if (nValues > 1) {  
                multitrialRows.push(rowNum); // push and add are the same commands for array vs set
                multitrialNValues.add(nValues); 
            } 
            
            // g) Any "selected parameters" missing from file?
            missingSelected.delete(key); // iteratively removes all existing parameters from missingSelected
            
        });

        // --> f) Report any trial‑count mismatches
        if (multitrialNValues.size > 1) { // if multiple non-constant nValues (inconsistent # Trials)
            errorMessage += `  - Mismatched number of trials in rows: ${multitrialRows.join(', ')}\n`;
        }
        
        // --> g) Report any missing Selected Parameter 
        if (missingSelected.size > 0) { // if any remaining element in missingSelected 
            const missingSelectedList = Array.from(missingSelected).join(', ');
            errorMessage += `  - The file does not contain selected parameters: ${missingSelectedList}\n`; 
        }
        
        // Writes introductory sentence to error message 
        if (errorMessage){ 
            errorMessage = "The file has errors and cannot be imported:\n"
                            + errorMessage;
        }
        
        const validationOutput = { 
            errorMessage:  errorMessage,
            selectedParametersList: selectedParameters.join(', '),
            parameterCount:   parameterCount,
            selectedConstant: selectedConstant,
            anyConstant: anyConstant
        }; 
        return validationOutput;        
        
    }

            
    function validateValues(key,allValues){ 
        
        // 1) Get hidden copy of all forms/inputs 
        const hiddenContainer = document.getElementById("forms-hidden-copy");

        // 2) Get input with name = key 
        const input = hiddenContainer.querySelector(`[name="${key}"]:not([type="hidden"])`);
        
        // 3) Loop through all unique values and check their validity 
        for (const value of allValues) {  
            // Validation depends on input type
            if (input.type =='checkbox'){ 
                // Checkbox type : must be TRUE or FALSE 
                const isBool = (value === 'TRUE' || value === 'FALSE');
                if (!isBool) { 
                    return "Values must be TRUE or FALSE";
                }                
            } else  if (input.type =='radio'){
                // Radio type: value must match value of exisiting radio button
                
                const allRadios = hiddenContainer.querySelectorAll(`[name="${key}"]`);
                const allowedValues = Array.from(allRadios).map(r => r.value);
                if (!allowedValues.includes(value)) {
                    return `Values must be one of: ${allowedValues.join(', ')}`;
                }
            } else {
                // Standard validation for everything else                
                // --> a) Sets input value in 'hidden' validation form
                builderIOSetInputValue(input,value); 

                // --> b) Checks if input value is valid 
                const errorMessage = builderIOCheckInputValue(input); // (empty or error message) 
                 
                // --> c) Returns validation message if error
                if (errorMessage){ // this "if" ensures that we don't leave the for loop at the first valid value 
                    return errorMessage; 
                }
            } 
        } 

        return "";
    }




	function importValues(rows, importParameters, constantAsStaticBuilder) { 
        if (!importParameters || importParameters=="none"){
            return;
        } 
        
		let alertMessageToFile = "";
		let alertMessageToStaticBuilder = "";

		rows.forEach((row, rowIndex) => { 
			if (!row) return; 

			const rowElements = row.split(',');
			const key = rowElements[0] + "," + rowElements[1];
            
            // decide whether to import this key              
            const shouldImport =
                importParameters === 'all' ||
                (Array.isArray(importParameters) && importParameters.includes(key)); 

            if (shouldImport){ 
                
                // Imports parameter values
                builderSession.parameters[key] = rowElements
                    .slice(2)
                    .filter(cell => cell.trim() !== "");
                
                // Updates input source (& alert message)
                if (constantAsStaticBuilder && (builderSession.parameters[key].length == 1))  {  
                    // Source = STATIC BUILDER //
                    if (builderGetSetInputSource('get', key) != 'staticBuilder') { 
                        builderGetSetInputSource('set', key,'staticBuilder'); 
                        alertMessageToStaticBuilder += "  -  " + key + "\n";
                    }
                } else {
                    // Source = CSV FILE //
                    if (builderGetSetInputSource('get', key) != 'csvFile') { 
                        builderGetSetInputSource('set', key,'csvFile');  
                        alertMessageToFile += "  -  " + key + "\n";
                    }
                } 
                    
              
                
            }
		});
 
		/*if (performValidation && showAlert) {*/
		if (showAlert) {
			if (alertMessageToFile) {
				alert("Loaded! \nThe value source for following parameters changed to 'File':\n" + 
                     alertMessageToFile + 
                     "\nThe value source for following parameters changed to 'Static Builder':\n" + alertMessageToStaticBuilder);
			} else {
				alert("Loaded!");
			}
		}
	}
}




 
 



////////////////////////// EXPORT PARAMETER VALUES TO CSV FILE //////////////////////////////////

// function generates & downloads parameters.csv with parameters values 
function builderIOParametersToFile( ){ 
	console.log(builderSession);
    
	 // checks consistency of parameters lengths -> pads parameters if necessary	
	const paddedParameters = fixLength(builderSession.parameters);  
	   
	// Initializes array that will hold CSV rows (each row is a parameter)	
	let parametersRows = []; 
	
	// steps through paddedParameters -> stores data in parametersRows
	Object.keys(paddedParameters).forEach( key => { 
		const row = [ key, paddedParameters[key] ];	 
		parametersRows.push(row.join(',')); 
	});   
	
	// merges rows with new line \r
	parametersData = parametersRows.join('\r');  		
	
	// exports to .csv file 
	parametersBlob = new Blob([parametersData], { type: 'text/csv' });
	parametersUrl = window.URL.createObjectURL(parametersBlob);
	a = window.document.createElement('a');
	a.setAttribute('href', parametersUrl);
	a.setAttribute('download', 'parameters.csv');
	a.click();



	function fixLength(parameters) {	
		// Keys for  parameters
		const keys = Object.keys(parameters);

		// Determines Trial Count = max length of parameters values 
		const lengths = keys.map(key => parameters[key].length);
		const trialCount = Math.max(...lengths);

		// Gets keys with array length != trialCount or 1
		const mismatchedKeys = keys.filter(key => {
			const len = parameters[key].length;
			return len !== trialCount && len !== 1;
		});	 

		// Check if all parameters have length = trialCount or 1
		const flagEqualLengths = lengths.every(length => length === trialCount || length === 1); 

		// Stores padded parameters to alert user 
		let alertMessage = "";

		// Pads arrays that are too short and record their keys
		mismatchedKeys.forEach(key => {
			const values = parameters[key]; 
			const lastValue = values[values.length - 1]; // last value  
			while (parameters[key].length < trialCount) { // pads parameters with last value
				parameters[key].push(lastValue);
			}
			alertMessage+= "  -  " + key + "\n"; // will alert user of padding 
		});

		// Alert message
		if (alertMessage){ // any parameters was padded
			alertMessage = 
				"Warning: Inconsistent # trials across parameters.\nThese parameters were padded (w/ last value):\n" 
				+ alertMessage;
			alert(alertMessage);
		}
		
		// returns padded parameters
		return parameters;
	}
}

 
