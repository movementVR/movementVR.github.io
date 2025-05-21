 
////////////////// VARIABLE INITIALIZATION ///////////////////

//// Variable Initialization  
// Data: parameter values / session config 
var builderSession = {
	parameters: {},                	   // effective GUI parameter values (source defined by parametersSource)
	parametersSource: {},              // parameter values source (popup, File or Paradigm Editor)
    sessionConfigParadigmEditor: {}   // Builder session configuration for paradigm editor
};

var builderParametersDefault = {};             // default GUI parameter values from default csv
var builderParametersBackupSource = {};         // backup parameter values source (if "cancel" pressed on source interface)

// Internal (not user input)
var helpParameterText = {}; // Object to store help texts for all parameters
var builderConfig = []; // Internal configuration information for builder layout
var builderPopupTabsConfig = {}; // Internal configuration information for builder popup layout

var builderPaths;
var builderStaticWindowConfig;   // definition of popup windows properties 
var builderCatalogWindowConfig;   // definition of help windows properties
var builderTrialWindowConfig;   // definition of trial expand windows properties
	


builderPopupTabsConfig = defBuilderPopupTabs();   // definition of tabs within popup windows 
	 

// Initializes builder 
builderInitialization();


////////////////// MAIN FUNCTION THAT SETS UP BUILDER ////////////////////////////////
	 
async function builderInitialization(){ 

	////////////////// Layout / Savings INITIALIZATION ///////////////////

	//// Gets definitions (layout/data) from builderDef.js
	builderConfig = defBuilderLayout(); // definition of main builder layout - which blocks to show and what popup they open
 	builderPaths = defBuilderPaths(); 
	builderPopupTabsConfig = defBuilderPopupTabs();   // definition of tabs within popup windows 
	builderStaticWindowConfig = defBuilderPopupWindow();   // definition of popup windows properties 
	builderCatalogWindowConfig = defBuilderHelpWindow();   // definition of help windows properties
	builderTrialWindowConfig = defBuilderTrialExpandWindow();   // definition of trial expand windows properties
	 
 
	//// Initializes builderSession w/ default parameter values & settings
    await builderIOInitialization(); 
 
	//// Initializes in-builder parameter text help 
	// by loading it from help/parameters.csv file 
	// Stores parameter input form internally, 
	// so that it can be pulled up by builderHelp.js  
	builderHelpLoadContent();

	////////////////// CONTENT CREATION ///////////////////
	//// Parent creation
	// create containers for trial blocks  
	const parentcontainer = document.getElementById('builder_Container'); 
	const container = document.createElement("div");
	container.className = "builderGrid";     
	parentcontainer.appendChild(container); 



	//// Sets number of rows and columns for parent container
	// Counts number of rows and columns based on builderConfig definition
	let maxRow = 0;
	let maxColumn = 0;
	let currColumn = 0;
	builderConfig.forEach(block => {
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
	builderConfig.forEach(block => {
		const blockElement = document.createElement("div");
		container.appendChild(blockElement);

		// graphic properties  
		blockElement.className = `element ${block.class || ""}`;
		if (block.title){
			blockElement.title = block.title;			
		}
		blockElement.style.gridColumn = block.gridColumn;
		blockElement.style.gridRow = block.gridRow;
		if (block.hasOwnProperty("color")){
			blockElement.style.backgroundColor = block.color;
		} 		
		
		//// create the text element
		const textElement = document.createElement("span");
		textElement.textContent = block.text; 
		blockElement.appendChild(textElement);

		// create the image element
		let blockImgSrc=""; 
		if (block.hasOwnProperty("img")){
			block.img =	builderPaths.builderIconPath(block.img);   
			const imgElement = document.createElement("img");
			imgElement.src = block.img;  
			imgElement.alt = block.title;  //  for accessibility  
			blockElement.appendChild(imgElement);  // insert the image before the text content
		}
 
		// link to page
		if (block.hasOwnProperty("onclick") && block.onclick.trim() !== ""){     
			blockElement.addEventListener('click', () => { 
				openStaticBuilder(block); 
			});
		}
	});

	////// Creates bottom row (download, upload, instructions...)
	createFooterActionButtons(parentcontainer);
	
	//// Hidden Copy of All Forms ////    
	createHiddenFormsCopy(parentcontainer);
	
	
	
	//// //// //// //// HELPER FUNCTIONS //// //// //// //// 

	////// Creates bottom row (download, upload, instructions...) ////
	function createFooterActionButtons(parentcontainer){
		//// DOWNLOAD  /  SAVE/LOAD SESSION  / IMPORT PARAMETERS
		//// Download Button 
		const trialDownloadButton = document.createElement("button");
		trialDownloadButton.className = "buttonMain download";    
		trialDownloadButton.textContent = "Download";       
		trialDownloadButton.addEventListener('click', builderIOParametersToFile); 



		//// Upload Button 
		// creates actual Upload Button
		const trialUploadButton = document.createElement('input');
		trialUploadButton.type = 'file'; 
		trialUploadButton.id = 'csvFileInput'; // Set the ID for the input
		trialUploadButton.accept = '.csv';  
		trialUploadButton.style.display = 'none'; // Hide the actual file input 
		trialUploadButton.addEventListener('change', (event) => { 
			const file = event.target.files[0]; 
			builderIOParametersFromFile(file,true, true, "all", [], true);
			event.target.value = '';   // reset so same file can be chosen again
		});
		const trialUploadButtonVisual = document.createElement('label'); // label acting as visual upload button
		trialUploadButtonVisual.htmlFor = 'csvFileInput'; // Match this with the file input ID
		trialUploadButtonVisual.textContent = 'Upload parameters'; // Button text
		trialUploadButtonVisual.className = 'buttonSecondary uploadParam';
		trialUploadButtonVisual.appendChild(trialUploadButton);  



		//// Save/Load session	 
		// creates Button
		const openSessionConfigButton = document.createElement('button'); 
		openSessionConfigButton.className = "buttonSecondary sessionConfig";  
		openSessionConfigButton.textContent = 'Save / Load Session';  
		openSessionConfigButton.addEventListener('click', () => {	
			 // opens session configuration popup  
			const configurationInput = {
				configurationType: 'builder',
				configurationData: builderSession
			};
			openSessionConfiguration(configurationInput, handleLoadedConfiguration);     

			function handleLoadedConfiguration(loadedConfiguration){ 
				builderSession = structuredClone(loadedConfiguration); 
			} 
		});



		//// Instruction Button  
		const mainBuilderHelpButton = document.createElement("button");
		mainBuilderHelpButton.className = "buttonHelpInfo instructions";    
		mainBuilderHelpButton.textContent = "Help";  
		mainBuilderHelpButton.addEventListener('click', () => { 	 
			const guidePopupFrame = document.getElementById('guideBuilder'); 
			guidePopupFrame.contentWindow.openModal(); 	  
		});


		//// Parameter Catalog  
		const parameterCatalogButton = document.createElement("button");
		parameterCatalogButton.className = "buttonHelpInfo parameterCatalog";    
		parameterCatalogButton.textContent = "Parameter Catalog";  	 
		parameterCatalogButton.addEventListener('click', () => { 
			openBuilderParameterCatalog(builderPaths); 
		});


		//// -> Footer Container for action buttons	////
		const builderFooterButtonsContainer = document.createElement('div');
		builderFooterButtonsContainer.className = 'builderBottomRowContainer';
		parentcontainer.appendChild(builderFooterButtonsContainer); 
		builderFooterButtonsContainer.appendChild(mainBuilderHelpButton); 
		builderFooterButtonsContainer.appendChild(parameterCatalogButton); 
		builderFooterButtonsContainer.appendChild(trialDownloadButton);
		builderFooterButtonsContainer.appendChild(trialUploadButtonVisual); 
		builderFooterButtonsContainer.appendChild(openSessionConfigButton); 
		
	}
	
    
	//// Hidden Copy of All Forms ////    
	function createHiddenFormsCopy(parentcontainer){
		const hiddedFormsCopy = document.createElement("div");
		hiddedFormsCopy.id = "forms-hidden-copy";
		hiddedFormsCopy.style.display = "none";
	   // hiddedFormsCopy.classList.add("hidden");
		parentcontainer.appendChild(hiddedFormsCopy); 
		const jsonFiles = [  
			{ jsonPath: 'web/builder/builder.json', 
			  selection: 'parameters', 
			  htmlContainer: hiddedFormsCopy }
		];	
		// appends all parameters html files to container   
		includeFilesFromJson(jsonFiles);  
		
	}
	

}
