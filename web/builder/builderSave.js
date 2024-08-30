
function builderStoreAllParameters(obj) {
    
    const values = new Set();
    function extractValues(nestedObj) {
        for (const key in nestedObj) {
            if (typeof nestedObj[key] === 'object') {
                extractValues(nestedObj[key]);
            } else {
                values.add(nestedObj[key]);
            }
        }
    }
    extractValues(obj);
    
    const uniqueValues = Array.from(values);
    const folderName = "web/builder/parameters";
    const parser = new DOMParser();
    uniqueValues.forEach(htmlFileName => {
        const htmlFile = `${folderName}/${htmlFileName}.html`;
        fetch(htmlFile)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {            
                const doc = parser.parseFromString(html, 'text/html'); 
                const thisPageForms = doc.getElementsByTagName('form');
                if (thisPageForms.length > 0) {
                    allTrialDesignForms[htmlFileName] = thisPageForms[0];                    
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }); 
}
 

function trialDesignStoreValues(newWindow){
    allFormPages = newWindow.document.forms;
    allTrialDesignForms[lastClickedHtmlFileName] = allFormPages[0];
}

function builderCsvDownload( ){
    builderCsvDownloadOptions();
    builderCsvDownloadDefault() ;
    builderCsvDownloadTrials() ;
}

function builderCsvDownloadOptions(){    
			optionsRows = []; 
			for (var iikey in allTrialDesignForms) { 
			var myFormData = new FormData(allTrialDesignForms[iikey]);                
			    data = Object.fromEntries(myFormData.entries());				
				headers = Object.keys(data);	
				values = Object.values(data);                
				for (j = 0; j < headers.length; j++) {
					line = [ headers[j], values[j] ];		
					optionsRows.push(line.join(','));
				}
			}			
			optionsData = optionsRows.join('\r');
			optionsBlob = new Blob([optionsData], { type: 'text/csv' });
			optionsUrl = window.URL.createObjectURL(optionsBlob);
			a = window.document.createElement('a');
			a.setAttribute('href', optionsUrl);
			a.setAttribute('download', 'options.csv');
			a.click()	;
}
function builderCsvDownloadDefault() 
{
    var link = document.createElement("a");
    uri="web/builder/download/default.csv";
    link.setAttribute('download', 'default.csv');
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
}
function builderCsvDownloadTrials() 
{
    var link = document.createElement("a");
    uri="web/builder/download/trials.csv";
    link.setAttribute('download', 'trials.csv');
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
}



function loadCsvAndPopulateForms(file) {
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

