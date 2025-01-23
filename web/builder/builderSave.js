// FUNCTIONS TO EXTRACT, STORE, AND DOWNLOAD PARAMETER VALUES FROM BUILDER FORMS
// all parameter values from the main builder pop-up (constant parameter def for options.csv)
// are stored in the object "allTrialDesignForms[htmlFileName]"  
// each entry "allTrialDesignForms[htmlFileName]"  contains the form for that htmlFileName, 
// including all inputs and the current (*) values of those inputs
// * the values are stores as they are upon definining allTrialDesignForms[htmlFileName]=currentForm,
//   but the functions below ensure they are kept up-to-date with the current values 




//////////////////////////////////////////////////////////////////////////////
// FUNCTIONS TO INITIALIZE AND STORE PARAMETER VALUES

// function to re-store / update the input values for the current form, 
// this is called any time we change tab, close the window (with OK or 'close'),
//   or open a paradigm pop-up (plus button)
//// how is it called:
// // // (close) builderPopup.js -> function populateOptionWindow -> 
// // // 					EventListener for 'beforeunload' of builder popup window
// // // (change tab) builderPopup.js -> function clickTab
// // // (paradigm popup) builderTrialExpand.js -> function createPlusButton 
// // // 					-> Event listerner for 'onclick' of Plus Button
function builderSaveStoreOptions(newWindow){
    allFormPages = newWindow.document.forms;
    allTrialDesignForms[lastClickedHtmlFileName] = allFormPages[0];
}



// Function to initialize variable 'allTrialDesignForms' to be structured to store all options forms
// Function extracts all unique parameter identifiers from the nested `allTabsDefinition` object
// and fetch corresponding HTML files to store their forms for trial design. 
// Stores references to forms upon builder initialization, and later uses these object reference to store and retrieve values
function builderSaveInitializeOptions(allTabsDefinitionObj) {
    // allTabsDefinitionObj: allTabsDefinition defined in builderDef
	// (contains references to all parameters,
	//  how to display/organize them in the builder,
	//  and how to locate the respective html files to get them as inputs)
	
	// 1) Extracts list of all parameter html files, as defined in allTabsDefinition 
	// ---> uniqueParameterHtmlFiles = Set (list) of all tabs (html file names) defined in allTabsDefinition (unique)
    const allParameterHtmlFiles = new Set();
    function extractValues(nAllTabsDefinitionObj) {
        for (const key in nAllTabsDefinitionObj) {
            if (typeof nAllTabsDefinitionObj[key] === 'object') {
                extractValues(nAllTabsDefinitionObj[key]);
            } else {
                allParameterHtmlFiles.add(nAllTabsDefinitionObj[key]);
            }
        }
    }
    extractValues(allTabsDefinitionObj);    	
    const uniqueParameterHtmlFiles = Array.from(allParameterHtmlFiles);
	
	 
	// 2) steps through all html files (listed in the variable uniqueParameterHtmlFiles)
	//    and stores the page "form" element to the variable "allTrialDesignForms[htmlFileName]"
	//    (this variable is used when opening the paradigm editor)
    const folderName = "web/builder/parameters"; // folder containing all html files (extracted in uniqueParameterHtmlFiles)
    const parser = new DOMParser();   // object for inbuild functions for parsing HTML file content 
    uniqueParameterHtmlFiles.forEach(htmlFileName => {
        const htmlFile = `${folderName}/${htmlFileName}.html`; // html file path + name
        fetch(htmlFile) 
            .then(response => {  // catch errors
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // extracts text
            })
            .then(html => {            
                const doc = parser.parseFromString(html, 'text/html'); 
                const thisPageForms = doc.getElementsByTagName('form');
                if (thisPageForms.length > 0) {
                    allTrialDesignForms[htmlFileName] = thisPageForms[0];  // DOES THE ACTUAL STORING             
                }
            })
            .catch(error => { // catch errors
                console.error('There was a problem with the fetch operation:', error);
            });
    }); 
}
 


//////////////////////////////////////////////////////////////////////////////
// FUNCTIONS TO GENERATE AND DOWNLOAD CSV FILES 

// function downloads all csv files from builder for parameter definition 
function builderSaveCsvDownload( ){
    builderSaveCsvDownloadOptions(); // call function to download options.csv (constant parameter values)
    builderSaveCsvDownloadDefault(); // call function to download default.csv (default constant parameter values)
    builderSaveCsvDownloadTrials();  // call function to download trials.csv (changing parameter values defined by trial)
	builderSaveCsvDownloadParadigm(); // call function to download paradigm.csv (same information as trial.csv but formatted as user input for paradigm builder)
}


// function to generate and download options.csv (constant parameter values)
function builderSaveCsvDownloadOptions(){  
	// 1) extracts values of all parameters from all builder forms into the variable 'optionsRows' (array) 
	//	  each optionsRows element = parameter script, name, value --> will be a row of options.csv
	optionsRows = [];  // Initialize an array to hold rows of CSV data
	for (var iikey in allTrialDesignForms) { // Loop through all forms in allTrialDesignForms
		var myFormData = new FormData(allTrialDesignForms[iikey]);  // gets Form Data object for current form              
		data = Object.fromEntries(myFormData.entries());				
		
		// headers = array with all headers for current form --> parameter script,names (e.g., 'setupScript,righthandStartingInBoundFlag')	
		headers = Object.keys(data); 	 
		
		// values = array with values for each parameter/header
		values = Object.values(data);                
		
		// optionsRows = array with each parameter script, name, value
		// (e.g. one array element:  'setupScript,lefthandStartingInBoundSizeY,0.1')
		for (j = 0; j < headers.length; j++) {
			line = [ headers[j], values[j] ];		
			optionsRows.push(line.join(',')); 
		}
	}	
	
	// 2) converts extracted data to .csv format 
	//optionsData =  single string with optionsRows array elements divided by new line \r
	optionsData = optionsRows.join('\r');  
	
	// objects with inbuilt functions to create and then download csv file
	optionsBlob = new Blob([optionsData], { type: 'text/csv' });
	optionsUrl = window.URL.createObjectURL(optionsBlob);
	a = window.document.createElement('a');
	a.setAttribute('href', optionsUrl);
	a.setAttribute('download', 'options.csv');
	a.click()	;
}



// function to generate and download trials.csv 
// (trial-by-trial changing parameter values)
function builderSaveCsvDownloadTrials() {
	
	// 1) Ensures all parameters are defined to have the same number of total trials 
	//    (if not, pads shorter parameters using last value, but gives a warning)
	
	// Check if all arrays in allParadigmOutput have the same length (same N Trials)
	const lengths = Object.values(allParadigmOutput)
		.filter(value => Array.isArray(value)) // Only consider array values
		.map(array => array.length);          // Map to their lengths
	 
    // Find the maximum length -> this is used as the number of trials   
    const trialCount = Math.max(...lengths); 

	// Check if all lengths are the same by comparing them to the max length (trialCount)
 	const flagEqualLengths = lengths.every(length => length === trialCount);	
	
	// If not, display a warning message
	if (!flagEqualLengths){		 		
		const message = `Warning: different N Trials definitions found.`+
			  ` Paradigm values in trials.csv padded to the max N Trials = ${trialCount}` +
			  ` using the last parameter value.`; 
		alert(message); 
	}
 
	 
	
	// 2) Converts variable format 
	//    converts allParadigmOutput to paradigmData variable that has a format
	//    targeted to csv export (using comma and \r separators)
	
    // Initialize an array to hold rows of CSV data
    const paradigmRows = [];  
    
    // Create the header row: Empty cells for the first two columns, numbers from 1 to N for the rest
    const headerRow = ['', '', ...Array.from({ length: trialCount }, (_, i) => i + 1)];
    paradigmRows.push(headerRow.join(',')); // Add header row to the CSV
    
    // Iterate through allParadigmOutput keys
    Object.keys(allParadigmOutput).forEach(key => { 
		// checks if user wants to use values from paradigm editor for this set of parameters
		// (otherwise this input is discarded)
		if (allParadigmDropdown[key]=="Paradigm"){ 
			const values = allParadigmOutput[key]; // Get array of values for the key

			const lastValue = values[values.length - 1]; // Get the last value of the array

			// Pads array if n values <  trialCount (using last value)
			while (values.length < trialCount) {
			  values.push(lastValue);
			}  

			// Prepare row with key as the parameter name and values as trial data
			const row = [key, ...values];
			paradigmRows.push(row.join(',')); // Join each row with commas
			
		} else if (allParadigmDropdown[key]=="File"){
				   
			const savedRow = allTrialsUploaded[key]; 
			paradigmRows.push(savedRow); // Uses previously loaded data  
	    }
    });

    // Convert paradigmRows to CSV string
    const paradigmData = paradigmRows.join('\r\n'); // Rows separated by newline characters
	
	
	// 3) Create and download the CSV file (trials.csv)
    const paradigmBlob = new Blob([paradigmData], { type: 'text/csv' });
    const paradigmUrl = window.URL.createObjectURL(paradigmBlob);
    const a = window.document.createElement('a');
    a.setAttribute('href', paradigmUrl);
    a.setAttribute('download', 'trials.csv');
    a.click();
}







// function to generate and download paradigm.csv 
// (trial-by-trial parameter values organized in user input format, for paradigm builder popup)
function builderSaveCsvDownloadParadigm() {
    // 1) Initialize an array to store rows of CSV data
    const rows = [];

    // 2) Loop through the keys in `allParadigmInput`
    Object.keys(allParadigmInput).forEach(key => {
		
		// checks if user wants to use value from paradigm editor for this set of parameters
		// (otherwise this input is discarded)
		if (allParadigmDropdown[key]=="Paradigm"){ 
			
			const blockData = allParadigmInput[key].Blocks; // Extract Blocks
			const inputsData = allParadigmInput[key].Inputs; // Extract Inputs

			// 3) Add block data rows
			blockData.forEach(block => {
				const row = [key, `Blocks`, block.TrialType, block.Repeats];
				rows.push(row.join(',')); // Convert array to CSV row
			}); 

			// 4) Add input data rows
			Object.keys(inputsData).forEach(trialType => {
				const inputDetails = inputsData[trialType];
				const inheritedInputs = inputDetails.InheritedInputs;
				const probabilities = inputDetails.Probabilities;

				Object.keys(inheritedInputs).forEach(param => {
					const row = [
						key,
						`Inputs`,
						trialType,
						param,
						inheritedInputs[param].join('|'), // Use '|' as a separator for array values
						probabilities.join('|'),
						inputDetails.SelectedOption
					];
					rows.push(row.join(',')); // Convert array to CSV row
				});
			});
		} 
		
    });

    // 5) Convert rows to CSV format
    const csvData = rows.join('\r\n'); // Join rows with newline separator

    // 6) Create and download the CSV file
    const csvBlob = new Blob([csvData], { type: 'text/csv' });
    const csvUrl = window.URL.createObjectURL(csvBlob);
    const a = document.createElement('a');
    a.setAttribute('href', csvUrl);
    a.setAttribute('download', 'paradigm.csv');
    a.click();
}


// function downloads default.csv file, 
// internally stored in folder "web/builder/download/default.csv";
function builderSaveCsvDownloadDefault() 
{
    var link = document.createElement("a");
    uri="web/builder/download/default.csv";
    link.setAttribute('download', 'default.csv');
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
}


 


//////////////////////////////////////////////////////////////////////////////
// FUNCTIONS TO LOAD PARAMETER VALUES FROM PREVIOUSLY-GENERATED  CSV FILES

 
// Function loads constant parameter values from uploaded options.csv file
// and populates builder forms with the uploaded parameter values  
function builderSaveCsvUploadOptions(file) {
    // Read and parse csv file
    const reader = new FileReader();
    reader.onload = function(event) {
        const csvData = event.target.result;
        const rows = csvData.split('\r');
        const csvFormData = {};
        rows.forEach(row => {
            const [name1,name2, csvInputValue] = row.split(',');
            const csvInputName=name1 + "," +name2; 
            
            // Iterate through allTrialDesignForms to find matching input elements
            for (const formName in allTrialDesignForms) {
                const currentForm = allTrialDesignForms[formName];
                
                // Check each input element in the form
                for (let i = 0; i < currentForm.elements.length; i++) {
                    const currentElement = currentForm.elements[i];
                    if (currentElement.name === csvInputName) {  
                        currentElement.value = csvInputValue.trim();
                    }
                }
            }
             
        });
 
       
    };
    reader.onerror = function(event) {
        console.error("File could not be read: " + event.target.error);
    };
    reader.readAsText(file);
	 

}
 
 

// Function loads changing parameter values in trial-by-trial format from uploaded trials.csv file, 
// and populates paradigm builder popups with the uploaded parameter values as if they were defined as sequential 
function builderSaveCsvUploadTrials(file) {
	
    // Read and parse csv file
    const reader = new FileReader();
    reader.onload = function(event) {
        const csvData = event.target.result;
        const rows = csvData.split('\r\n');  
		
		// loops through each row
        rows.forEach(row => {
			
			// extracts row elements in array format
			const rowElements=row.split(',');
			
			// key = Parameter name = Element 0+1 
			const key = rowElements[0] + "," +rowElements[1]; 
			
			// stores row in allTrialsUploaded[key]
			allTrialsUploaded[key]=row;
			 
             
        });
 
       
    };
    reader.onerror = function(event) {
        console.error("File could not be read: " + event.target.error);
    };
    reader.readAsText(file);
	 
}
   
   
// Function loads parameter values  from csv files, 
// and populates builders/popups with the uploaded values   
function builderSaveCsvUpload(files) { 
    let fileOptions = null; // options.csv
    let fileParadigm = null; // paradigm.csv
    let fileTrials = null; // trials.csv

    // Loops through files and identifies which file is which based on the name
    for (const file of files) {
        const fileName = file.name.toLowerCase();  
        if (fileName.startsWith('options')) {
            fileOptions = file;
        } else if (fileName.startsWith('paradigm')) {
            fileParadigm = file;
        } else if (fileName.startsWith('trials')) {
            fileTrials = file;
        }
    }
	
	// Calls appropriate functions with respective files  
    if (fileOptions) {
        builderSaveCsvUploadOptions(fileOptions);
    }
    if (fileParadigm) { 
		 builderSaveCsvUploadParadigm(fileParadigm);
    }
    if (fileTrials) {
        builderSaveCsvUploadTrials(fileTrials);
    } 
    
    
}


  

// Function loads changing parameter values in user-input format from uploaded paradigm.csv file, 
// and populates paradigm builder popups with the uploaded parameter values  
function builderSaveCsvUploadParadigm(file) {
	let loadedAllParadigmInput={};
    // Read and parse csv file
    const reader = new FileReader();
    reader.onload = function(event) {
        const csvData = event.target.result; 
        const rows = csvData.split('\r\n');
        const csvFormData = {};
		//loops through each row
        rows.forEach(row => { 
			// 1) extracts row elements in array format
			const rowElements=row.split(','); 
			
			// 2) Input Key and Blocks/Inputs Key of allParadigmInput
			// Element 0+1: main key (input key) of allParadigmInput
			const mainKey = rowElements[0] + "," +rowElements[1]; 
			
			// Initialize the key if it doesn't exist
			if (!loadedAllParadigmInput[mainKey]) {
                loadedAllParadigmInput[mainKey] = []; 
				loadedAllParadigmInput[mainKey].Blocks=[];
				loadedAllParadigmInput[mainKey].Inputs={};
            }
			
			const blocksOrInputs=rowElements[2]; // 'Blocks' or 'Inputs' Key
			
			// 3) Blocks			
			if (blocksOrInputs=='Blocks'){
				const trialType=rowElements[3]; // trial type for this phase
				const nTrials=rowElements[4];  // number of trials for this phase 
				// Retrieves and stores Blocks info (phases)
				loadedAllParadigmInput[mainKey].Blocks.push({
					TrialType: trialType,
					Repeats: nTrials // Ensure the value is an integer
				});
				
			// 4) Inputs 	
			} else if (blocksOrInputs=='Inputs'){
				// Extracts individual element information
				const trialTypeKey = rowElements[3]; // trial type key  
				const inheritedKey = rowElements[4] + "," +rowElements[5]; // InheritedInputs -> Key
				const inheritedValues = rowElements[6].split('|'); // InheritedInputs -> Array of Values
				const probabilities = rowElements[7].split('|'); // Probabilities Array
				const selectedOptions = rowElements[8]; // SelectedOption 
				
				// Initialize the trial type key if it doesn't exist
				if (!loadedAllParadigmInput[mainKey].Inputs[trialTypeKey]) {
					loadedAllParadigmInput[mainKey].Inputs[trialTypeKey] = {
						SelectedOption: selectedOptions,
						InheritedInputs: {},
						Probabilities: probabilities  
					};
				}
				
				// Stores inherited input key -> array of values 
				loadedAllParadigmInput[mainKey].Inputs[trialTypeKey].InheritedInputs[inheritedKey] = inheritedValues;
				 
			}
			 
        });
 
      	allParadigmInput = loadedAllParadigmInput; 
    };
    reader.onerror = function(event) {
        console.error("File could not be read: " + event.target.error);
    };
    reader.readAsText(file);
	 

}
 
 