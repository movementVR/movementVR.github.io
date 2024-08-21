
const widthIn = 800;
const heightIn = 450;

const allTabsDefinition = getAllTabsDefinition();
const blockData=getBlockData();
var allTrialDesignForms = {};
var lastClickedHtmlFileName = "";
builderStoreAllParameters(allTabsDefinition);

// create containers for trial blocks  
const parentcontainer = document.getElementById('builder_tabID');
//parentcontainer.className = "trialContainerParent";  
const container = document.createElement("div");
container.className = "trialContainer";     
parentcontainer.appendChild(container); 


// Counts number of rows and columns based on blockData definition
let maxRow = 0;
let maxColumn = 0;
let currColumn = 0;
blockData.forEach(block => {
    if (typeof block.gridColumn === 'string') {
        currColumn= parseInt(block.gridColumn.split('/')[0].trim()) +  
            parseInt(block.gridColumn.split('span')[1].trim()) -1;
        maxColumn = Math.max(maxColumn, currColumn); 
    } else {
        maxColumn = Math.max(maxColumn, block.gridColumn);
    }
    maxRow = Math.max(maxRow, block.gridRow);
});    

//container.style.gridTemplateColumns = `repeat(${maxColumn},1fr)`; 
container.style.gridTemplateColumns = `1.7fr repeat(${maxColumn-2},1fr) 0.3fr`; 
container.style.gridTemplateRows = `repeat(${maxRow},1fr)`; 


 

blockData.forEach(block => {
    const blockElement = document.createElement("div");
    container.appendChild(blockElement);

    // graphic properties 
    blockElement.className = `trialBlockBase ${block.class || ""}`;
    blockElement.title = block.title;
    blockElement.style.gridColumn = block.gridColumn;
    blockElement.style.gridRow = block.gridRow;
    if (block.hasOwnProperty("color")){
        blockElement.style.backgroundColor = block.color;
    }

    // add text content
    const textElement = document.createElement("span");
    textElement.textContent = block.text;
    textElement.className = "trialGameObjectTextSubblock";  // optional, add class for styling
    blockElement.appendChild(textElement);
    
    // create the image element
    if (block.hasOwnProperty("img")){
        const imgElement = document.createElement("img");
        imgElement.src = `web/img/gameobjects/${block.img}.png`;   // assuming you have an imageSrc property in blockData
        imgElement.alt = block.title;  // optional, for accessibility
        imgElement.className = "trialGameObjectImageSubblock";  // optional, add class for styling

        // insert the image before the text content
        blockElement.appendChild(imgElement);
    }


    // link to page
    if (block.hasOwnProperty("onclick") && block.onclick.trim() !== ""){    
        blockElement.setAttribute("onclick", `openOptionsWindow('${block.onclick}','${block.tab}')`);  
    }
});



// Download Button 
const trialDownloadButtonContainer = document.createElement('div');
trialDownloadButtonContainer.className = 'trialLoadButtonContainerClass';
parentcontainer.appendChild(trialDownloadButtonContainer); 

const trialDownloadButton = document.createElement("button");
trialDownloadButton.className = "trialDownloadButtonClass";    
trialDownloadButton.textContent = "Download";     
trialDownloadButton.addEventListener('click', builderCsvDownload); 
trialDownloadButtonContainer.appendChild(trialDownloadButton);   
 

// Upload Button 
const trialUploadButton = document.createElement('input');
trialUploadButton.type = 'file'; 
trialUploadButton.id = 'csvFileInput'; // Set the ID for the input
trialUploadButton.accept = '.csv'; 
trialUploadButton.style.display = 'none'; // Hide the actual file input 
trialDownloadButtonContainer.appendChild(trialUploadButton); 

// Add event listener for when a file is selected
trialUploadButton.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        loadCsvAndPopulateForms(file); // Custom function to handle file
    }
});

// Create a label that acts as the visual button
const trialUploadButtonVisual = document.createElement('label');
trialUploadButtonVisual.htmlFor = 'csvFileInput'; // Match this with the file input ID
trialUploadButtonVisual.textContent = 'Upload parameters'; // Button text
trialUploadButtonVisual.className = 'trialUploadButtonClass';
trialDownloadButtonContainer.appendChild(trialUploadButtonVisual); 




// Instruction Button  
const trialInstructionDownloadButton = document.createElement("button");
trialInstructionDownloadButton.className = "trialInstructionDownloadButtonClass";    
trialInstructionDownloadButton.textContent = "Instructions";     
trialInstructionDownloadButton.addEventListener('click', function() {
    openOptionsWindow('instructions', 'Download');
});
trialDownloadButtonContainer.appendChild(trialInstructionDownloadButton); 


// // //  FUNCTIONS // // // 
     
 

function openOptionsWindow(htmlFileName,htmlFileTab) {  
   //     const windowSizePercent = 0.9;  
  //  var newWindow = createWindow(windowSizePercent,windowSizePercent); 
    /*
        const element = document.querySelector('.trialContainerParent');
    console.log(element);
        const style = window.getComputedStyle(element);
        const widthIn = style.width;
        const heightIn = style.height;
    */
        var newWindow =  createWindow(widthIn,heightIn,'px');   

        robustOnLoad(newWindow,function() {
            populateOptionWindow(newWindow,htmlFileName,htmlFileTab);
        });  
}  


  


function populateOptionWindow(newWindow,htmlFileName,htmlFileTab){ 
        // Populate the new window with content from htmlFileName.html
    baseHtmlFileName='web/builder/popup/tabHtml.html';
        fetch(baseHtmlFileName)
            .then(response => response.text())
            .then(html => {
                newWindow.document.write(html); // loads base html code 
                newWindow.document.title=htmlFileName; // changes the html page title 
             
                // Creates Containers 
                var tabContainer = newWindow.document.createElement("div"); // container for navigation tabs
                tabContainer.id = "input-window-tabcontainer";
                tabContainer.className = "input-subtab-container";                
                var contentContainer = newWindow.document.createElement("div"); //  container to display content
                contentContainer.id = "contentContainer";
                contentContainer.className = "contentcontainerclass";            
                newWindow.document.body.appendChild(tabContainer); // Append the containers to the body of the new window
                newWindow.document.body.appendChild(contentContainer);
                newWindow.document.body.style.overflow = "hidden";
            

                // Includes styles and scripts 
                includeStyle( 'web/builder/popup/tabHtmlStyle.css',newWindow); 
                includeStyle( 'web/builder/popup/trialDesignChildrenStyles.css',newWindow); 
                includeScript( 'web/general/general.js',newWindow); 
                includeScript( 'web/general/general.css',newWindow); 
       
                // Creates tabs             
                const tabsDefinition =allTabsDefinition[htmlFileName] ;  
                let initialTab = htmlFileTab;

                if (initialTab == "") {
                    initialTab = Object.keys(tabsDefinition)[0];
                }; 
            
                createTabs(newWindow,tabsDefinition,initialTab);  
                
                // window adjustments 
                createOKButton(newWindow); // Creates OK button
            
                changeHeightToFitParent(newWindow,'contentcontainerclass'); // Makes the tabcontent scrollable and makes OK final button always visible           

                newWindow.addEventListener('beforeunload', function (event) {
                    trialDesignStoreValues(newWindow);
                }); 
        });
} 
 
 



// Function to create navigation tabs
function createTabs(newWindow,tabsDefinition,initialTab) {  
    const tabContainer = newWindow.document.getElementById('input-window-tabcontainer');
    for (const tabName in tabsDefinition) {
        const button = newWindow.document.createElement('button');
        button.textContent = tabName;
        button.className = 'input-subtab-button';
        button.addEventListener('click', () => clickTab(newWindow,button,tabsDefinition[tabName],false));
        tabContainer.appendChild(button);
 
        if (tabName == initialTab){ 
            clickTab(newWindow,button,tabsDefinition[tabName],true);
        }
    }  
}
 

// Function to fetch and display content
function clickTab(newWindow,clickedTab,htmlFileName,flagNewWindow) {  
    
    if (flagNewWindow==false){
            trialDesignStoreValues(newWindow);        
    }
    
    const folderName = "web/builder/parameters";
    const htmlFile = `${folderName}/${htmlFileName}.html`;
    fetch(htmlFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            newWindow.document.getElementById('contentContainer').innerHTML = html;
        
            setInputsWidth(newWindow);
        
         
        
            // Populate the current form with stored values
            if (allTrialDesignForms[htmlFileName]) {
                const storedForm = allTrialDesignForms[htmlFileName];
                const currentForm = newWindow.document.forms[0];
                for (let i = 0; i < storedForm.elements.length; i++) {
                    const storedElement = storedForm.elements[i];
                    const currentElement = currentForm.elements[storedElement.name];
                    if (currentElement) { 
                        currentElement.value = storedElement.value;
                    }
                }
            }
    
        
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    newWindow.document.querySelectorAll('.input-subtab-button').forEach(button => {
        button.classList.remove('active');
    });
    clickedTab.classList.add('active'); 
    lastClickedHtmlFileName=htmlFileName;
    
   
    
 
    
}




 
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




function setInputsWidth(newWindow){ 
  //  setInputsWidthCore(newWindow);
    setTimeout(function() {setInputsWidthCore(newWindow);}, 10);
 //   setTimeout(function() {setInputsWidthCore(newWindow);}, 50);
  //  setTimeout(function() {setInputsWidthCore(newWindow);}, 100);
}

function setInputsWidthCore(newWindow){ 
    const addedOffset0=5;
    const addedOffset=10; 
    const addedOffset2=5;
    const addedOffset3=10;
    const addedOffset4=100;
    
    
    newWindow.document.querySelectorAll('.expand-button').forEach(button => {
        button.click();
    });
    
    const inputs = newWindow.document.querySelectorAll('inputs'); 
    console.log(inputs);
    let maxWidth = 0;
 
    // Finds width
    inputs.forEach(input => { 
        let originalWidth = input.style.width;
        input.style.width = 'auto';
        const inputWidth = input.offsetWidth; 
        console.log(inputWidth);
        input.style.width = originalWidth;
        if (inputWidth > maxWidth) {
            maxWidth = inputWidth;
        }
    });
    if (maxWidth>400){
        maxWidth=400;
    }
    if (maxWidth<260){
        maxWidth=260;
    }
 
   
    const name = newWindow.document.querySelectorAll('name'); 
    const inputcolumn = newWindow.document.querySelectorAll('inputcolumn'); 
    const figurecolumn = newWindow.document.querySelectorAll('figurecolumn'); 
    const formcontr = newWindow.document.querySelectorAll('.form-control'); 
    const tabcont = newWindow.document.querySelectorAll('.tabcontent'); 
    const overcont = newWindow.document.querySelectorAll('.contentcontainerclass'); 
   // inputcolumn[0].style.width = `${name[0].offsetWidth+maxWidth+addedOffset}px`;
      
    const nameWidth=name[0].offsetWidth;
    const tabcontWidth=tabcont[0].offsetWidth;
    
    inputs.forEach(input => {
        input.style.width = `${maxWidth+addedOffset0}px`;
    }); 
    
    inputcolumn[0].style.width = `${nameWidth+maxWidth+addedOffset}px`;
     
    formcontr[0].style.width = `${nameWidth+maxWidth+addedOffset+addedOffset2}px`;
    
    figurecolumn[0].style.width = `${tabcontWidth- formcontr[0].offsetWidth - addedOffset3}px`;
//    figurecolumn[0].style.height =`${overcont[0].offsetHeight - addedOffset4}px`;
    
    
    const fimg = newWindow.document.querySelectorAll('img');  
    if (fimg.length === 0) { 
        figurecolumn[0].style.backgroundColor='inherit';
    }


    newWindow.document.querySelectorAll('.expand-button').forEach(button => {
        button.click();
    });
    

}