////////////////// VARIABLE INITIALIZATION ///////////////////
 
//// Layout Definitions
const widthIn = 800;
const heightIn = 450;


//// Variable Initialization
var allTrialDesignForms = {};
var allParadigmOutput = {};
var allParadigmInput = {};
var allParadigmDropdown = {};
var allTrialsUploaded = {};
var lastClickedHtmlFileName = "";

var blockData = [];
var allTabsDefinition = {};


//////////////// POST-PONED INITIALIZATION AFTER LOADING OF DEPENDENT SCRIPTS ///////////////////

// Scripts that must be loaded before builder is set up 
const builderSaveScript = document.querySelector('script[src="/web/builder/builderSave.js"]');
const builderDefScript = document.querySelector('script[src="/web/builder/builderDef.js"]');

// Sets up builder immeditately if scripts already loaded
const initializedBuilder = builderInitializationWithCheck(builderSaveScript,builderDefScript);

// Creates listeners otherwise 
//// --> builderInitializationWithCheck is called when either script is loaded 
if (!initializedBuilder){	
	// // builderSave.js listener // //
	const builderSaveScriptOnload = builderSaveScript.onload; // Current onload function
	builderSaveScript.onload = () => { 	 
		builderSaveScriptOnload(); // Appends to current onload function
		builderInitializationWithCheck(builderSaveScript,builderDefScript);  // Builder initialization (if both loaded)
	};	
	
	// // builderDef.js listener // //
	const builderDefScriptOnload = builderDefScript.onload;
	builderDefScript.onload = () => { 	 
		builderDefScriptOnload();
		builderInitializationWithCheck(builderSaveScript,builderDefScript);
	};
}	
 
// Function that checks whether all needed scripts are loaded, 
// and initializes builder if so, by calling builderInitialization() below
function builderInitializationWithCheck(builderSaveScript,builderDefScript){  
	const initializedBuilder = builderSaveScript.fullyLoaded && builderDefScript.fullyLoaded;
	if (initializedBuilder){
		builderInitialization();
	}
	return initializedBuilder;
}
				



////////////////// MAIN FUNCTION THAT SETS UP BUILDER ////////////////////////////////
	 
function builderInitialization(){
	 
	////////////////// Layout / Savings INITIALIZATION ///////////////////

	//// Gets definitions (layout/data) from builderDef.js
	blockData=getBlockData(); // definition of main builder layout - which blocks to show and what popup they open
	allTabsDefinition = getAllTabsDefinition();   // definition of tabs within popup windows 

	//// Initializes parameter storage through builderSave.js
	// Stores parameter input form internally, 
	// so that it can be pulled up if the paradigm popup window is used 
	// trialExpandSave -> loadSpecificInputValue function
	builderSaveInitializeOptions(allTabsDefinition);  





	////////////////// CONTENT CREATION ///////////////////
	//// Parent creation
	// create containers for trial blocks  
	const parentcontainer = document.getElementById('builder_tabID');
	//parentcontainer.className = "trialContainerParent";  
	const container = document.createElement("div");
	container.className = "trialContainer";     
	parentcontainer.appendChild(container); 



	//// Sets number of rows and columns for parent container
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

	container.style.gridTemplateColumns = `1.7fr repeat(${maxColumn-2},1fr) 0.3fr`; 
	container.style.gridTemplateRows = `repeat(${maxRow},1fr)`; 



	//// Creates blocks of builder (objects to click to open popups for parameters)
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
		
		
		// create the text element
		//// checks if block should have text content, store text content		
		let stringTextTitle=block.text;
		let stringTextBlock=block.text;
		if (stringTextTitle.startsWith("_")){   // display text in popup title but not in block
			stringTextTitle=stringTextTitle.slice(1);
			stringTextBlock=""; 
		}   		
		//// creates the actual text object
		const textElement = document.createElement("span");
		textElement.textContent =stringTextBlock;
		textElement.className = "trialGameObjectTextSubblock";  // optional, add class for styling
		blockElement.appendChild(textElement);

		// create the image element
		let blockImgSrc=""; 
		if (block.hasOwnProperty("img")){
			let stringImage=block.img;
			if (stringImage.startsWith("_")){   // display image in popup title but not in block
				stringImage=stringImage.slice(1);
				blockImgSrc = `web/img/gameobjects/${stringImage}.png`;   
			} else {   // display image in both popup title and block
				blockImgSrc = `web/img/gameobjects/${block.img}.png`;   
				const imgElement = document.createElement("img");
				imgElement.src = blockImgSrc;  
				imgElement.alt = block.title;  // optional, for accessibility
				imgElement.className = "trialGameObjectImageSubblock";  // optional, add class for styling

				// insert the image before the text content
				blockElement.appendChild(imgElement); 
			}
		}


		// link to page
		if (block.hasOwnProperty("onclick") && block.onclick.trim() !== ""){    
			blockElement.setAttribute("onclick", 
				 `openOptionsWindow('${block.onclick}','${block.tab}','${stringTextTitle}','${blockImgSrc}')`);  
			blockElement.setAttribute("ondblclick", 
				 `openOptionsWindow('${block.onclick}','${block.tab}','${stringTextTitle}','${blockImgSrc}')`); 
		}
	});



	////// Creates bottom row (download, upload, instructions...)

	//// Download Button 
	const trialDownloadButtonContainer = document.createElement('div');
	trialDownloadButtonContainer.className = 'trialLoadButtonContainerClass';
	parentcontainer.appendChild(trialDownloadButtonContainer); 

	const trialDownloadButton = document.createElement("button");
	trialDownloadButton.className = "trialDownloadButtonClass";    
	trialDownloadButton.textContent = "Download";     
	trialDownloadButton.addEventListener('click', builderSaveCsvDownload); 
	trialDownloadButtonContainer.appendChild(trialDownloadButton);   



	//// Upload Button 
	// creates actual Upload Button
	const trialUploadButton = document.createElement('input');
	trialUploadButton.type = 'file'; 
	trialUploadButton.id = 'csvFileInput'; // Set the ID for the input
	trialUploadButton.accept = '.csv'; 
	trialUploadButton.multiple = true; // Allow multiple file uploads
	trialUploadButton.style.display = 'none'; // Hide the actual file input 
	trialDownloadButtonContainer.appendChild(trialUploadButton); 

	// creates listener that does the upload 
	trialUploadButton.addEventListener('change', 
	   function(event) { // Event listener for files uploads   
			const files = event.target.files; 
			if (files.length > 0) {
				builderSaveCsvUpload(files); // Custom function to handle multiple files
			}
			event.target.value = ''; 
	});



	// Create a label that acts as the visual upload button
	const trialUploadButtonVisual = document.createElement('label');
	trialUploadButtonVisual.htmlFor = 'csvFileInput'; // Match this with the file input ID
	trialUploadButtonVisual.textContent = 'Upload parameters'; // Button text
	trialUploadButtonVisual.className = 'trialUploadButtonClass';
	trialDownloadButtonContainer.appendChild(trialUploadButtonVisual); 




	//// Instruction Button  
	const trialInstructionDownloadButton = document.createElement("button");
	trialInstructionDownloadButton.className = "trialInstructionDownloadButtonClass";    
	trialInstructionDownloadButton.textContent = "Instructions";  	 
	trialInstructionDownloadButton.addEventListener('click', function() {	
		openOptionsWindow('instructions', 'Download',"Instructions",null);
	});
	trialDownloadButtonContainer.appendChild(trialInstructionDownloadButton); 


}
