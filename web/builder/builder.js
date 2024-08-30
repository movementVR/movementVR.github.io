
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
        blockElement.setAttribute("ondblclick", `openOptionsWindow('${block.onclick}','${block.tab}')`);
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

 
     
 

