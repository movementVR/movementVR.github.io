// Script with functions to handle STORAGE / UPLOADING / DOWNLOADING / SETTING of PARAMETER VALUES //


/////////////// INTERFACE FUNCTIONS //////////////
// Interface function: returns parameter value for the key  
function builderIOGetParameterValue(key, firstOnly = false){  
	const arrayOfValues = builderSession.parameters[key] ?? []; // sets it to empty if null 
    
    // if arrayOfValues is a single element -> returns it, 
    // otherwise returns "" (empty) , or the first value if (firstOnly)
    if (firstOnly){
        return  arrayOfValues[0];  
    } else {
        return arrayOfValues.length === 1 ? arrayOfValues[0] : "(varies)";      
    }    
} 
 

// Interface function: returns parameters names for inputGroup
function builderIOGetParametersName(inputGroup){        
    // Locate all input and textarea elements 
    const inputsAndTextareas = inputGroup.querySelectorAll('input[name], textarea[name]');

    // Return an array of parameter names 
    const parameterNames =  [...new Set(                  // Keeps unique names
        Array.from(inputsAndTextareas).map(el => el.name) // (All Names - duplicates for radio buttons)
    )];
    return parameterNames;                        
}



// Helper function to set 'input' field to given 'value'
// <- parses value based on the input type (differs for numerical, radio, checkbox...) 
function builderIOSetInputValue(input,value){ 
    //if (value) {
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
                    input.checked = input.value === value; 
                   /* if (input.value === value) {
                        input.checked = true;
                    }*/
                    break;
                case 'color':
                    input.value = value; // Set the color value (e.g., '#ff0000')
                    break; 
                case 'hidden': //do nothing
                    break;  
            }
        } else if (input.tagName === 'TEXTAREA') { 
            // Handle <textarea> elements
            input.value = value;
        }
        input.dispatchEvent(new Event('input'));		
  //  } 
} 

   
// Function checks if an input value is valid 
function builderIOCheckInputValue(input){  
    
    // 1) Adds custom function‑based validation
    input.setCustomValidity(''); //  Reset previous custom error
    const customError = customValidators(input);  // Gets new validation
    input.setCustomValidity(customError); // Sets input custom error
    
    // 2) Checks if input is valid (built‑in + custom rules)
    if (!input.checkValidity()) {   // If input is not valid 
        return input.validationMessage;
    } 
     
    return "";
		
    // CUSTOM VALIDATORS
    function customValidators(input) { 

        // Custom Validators by Parameter Name
        switch (input.name) { 
            case 'trialScript,targetBirdSpeciesList': {
                const allowedSpecies = ['cardinal','bluejay','robin','chickadee','goldfinch','sparrow'];
                const regExpCheck = new RegExp('^\\s*(?:' + allowedSpecies.join('|') + ')' + '(?:\\s*>\\s*(?:' + allowedSpecies.join('|') + '))*' + '\\s*$', 'i');
                if (!regExpCheck.test( input.value.trim() )) { 
                    return 'Invalid list. Please write species listed below separated by >.';
                }
            } 
        } 
        return ''; // if no custom rule or if no error based on custom rule
    }
} 

    
    
//////////////// INITIALIZATION ////////////////
// Function initializes builderSession w/ default parameter values & settings:
// - "parameters" <- parameter values from built-in default csv file 
// - "parametersSource" <- "static" by default 
async function builderIOInitialization(){   
	// 1) Initializes "parameters" (values) from file
    await builderIOParametersFromFile(  // await till values are loaded 
        builderPaths.builderDefaultCsvPath,    // Default file used for initialization
                         false); // Do not display message with loading info 
     
    builderParametersDefault = structuredClone(builderSession.parameters); // stores default values 
    
	// 2) Initializes "parametersSource" (input source): same keys as "parameters", all set to "staticBuider"
    Object.keys(builderSession.parameters).forEach(key => {
        builderSession.parametersSource[key] = "staticBuilder";
    });
     
    
} 
 

////////////////// GET + STORE PARAMETER VALUES FROM FORMS /////////////////////////// 
// function updates parameter values in memory (builderSession.parameters) using current form
// called when we change tab, close the popup (with OK or 'close'), or open Paradigm Editor 
function builderIOParametersFromEditorStatic(staticBuilderWindow){ 
    const allForms = staticBuilderWindow.document.forms; // all forms across tabs
    for (const currentForm of allForms) {
        const currentFormData = new FormData(currentForm);  // gets Form Data object for current form              
        const currentFormObject = Object.fromEntries(currentFormData.entries());			
        Object.keys(currentFormObject).forEach(key => {  
            if (builderSession.parametersSource[key] == "staticBuilder"){
                builderSession.parameters[key] = [currentFormObject[key]];  // actual export values 
            }
        });    
    }
} 
 

 
////////////////// SET FORM INPUT FIELDS WITH PARAMETER VALUES FROM MEMORY ///////////////////////////
// Function to load stored input values to current tab form
function builderIOParametersToEditor(targetBuilderWindow){ 
    const allForms = targetBuilderWindow.document.forms; // all forms across tabs
    for (const currentForm of allForms) {

        // Locate all input and textarea elements 
        const inputsAndTextareas = currentForm.querySelectorAll('input, textarea'); 

        // Set values for each input
        inputsAndTextareas.forEach(input => {  
            flagFirstValue = builderGetSetInputSource("get",input) == "staticBuilder"; 
            const value =  builderIOGetParameterValue(input.name, flagFirstValue); 
            const actualValue = (value === "(varies)" ? "" : value);
            builderIOSetInputValue(input,actualValue);             
            input.placeholder = (value === "(varies)" ? "(varies)" : "");
        });  	
    } 
}


 
 
   