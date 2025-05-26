 
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
var builderConfig = {}; // Internal configuration information for builder layout
var builderPopupTabsConfig = {}; // Internal configuration information for builder popup layout

var builderPaths;
var builderStaticWindowConfig;   // definition of popup windows properties 
var builderCatalogWindowConfig;   // definition of help windows properties
var builderTrialWindowConfig;   // definition of trial expand windows properties
	


	 

// Initializes builder 
builderInitialization();

 

////////////////// MAIN FUNCTION THAT SETS UP BUILDER ////////////////////////////////
async function builderInitialization(){ 
//function builderInitialization(){ 

	//// Gets definitions (layout/data) from builderDef.js
	defInit();
 
	//// Initializes builderSession w/ default parameter values & settings
    await builderIOInitialization(); 
     //builderIOInitialization(); 
 
	//// Initializes in-builder parameter text help 
	// by loading it from help/parameters.csv file 
	// Stores parameter input form internally, 
	// so that it can be pulled up by builderHelp.js  
	builderHelpLoadContent(); 
	
	
	////////////////// Layout  INITIALIZATION ///////////////////
 
	
	const parentcontainer = document.getElementById('builder_Container');  
	builderInitializeLayout();
	
	////// Creates Main Builder Grid & Other Buttons
	createBuilderGrid(".builderGrid", builderConfig.mainGrid);	
	createBuilderGrid(".quickLinks", builderConfig.quickLinks); 
	createBuilderGrid(".sessionManagementContainer", builderConfig.sessionManagement);	
	createBuilderGrid(".builderBottomRowContainer", builderConfig.footerButtons)
	
	////// Creates bottom row (download, upload, instructions...)
	//createFooterActionButtons(parentcontainer);
	
	//// Hidden Copy of All Forms ////    
	createHiddenFormsCopy(parentcontainer);
	
	
	
	//// //// //// //// HELPER FUNCTIONS //// //// //// //// 

	function defInit(){
		//// Gets definitions (layout/data) from builderDef.js
		builderPopupTabsConfig = defBuilderPopupTabs();   // definition of tabs within popup windows 
		builderConfig = defBuilderLayout(); // definition of main builder layout - which blocks to show and what popup they open
		builderPaths = defBuilderPaths(); 
		builderPopupTabsConfig = defBuilderPopupTabs();   // definition of tabs within popup windows 
		builderStaticWindowConfig = defBuilderPopupWindow();   // definition of popup windows properties 
		builderCatalogWindowConfig = defBuilderHelpWindow();   // definition of help windows properties
		builderTrialWindowConfig = defBuilderTrialExpandWindow();   // definition of trial expand windows properties

	}

	
	
	
	
	function builderInitializeLayout(){ 
		
		////Main Builder Panel for actual Builder Stuff  
		const subparentContainer = document.createElement("div");
		subparentContainer.className = "builderMainPanel";     
		parentcontainer.appendChild(subparentContainer);
		
		
		
		////Individual Grids in Main Builder Panel 
		const containerMainGrid = document.createElement("div");
		containerMainGrid.className = "builderPanel builderGrid"; 
 
		const containerQuickLinks = document.createElement("div");
		containerQuickLinks.className = "builderPanel sideBubbles quickLinks"; 
		
		//// -> Footer Container for action buttons	////
		const builderFooterButtonsContainer = document.createElement('div');
		builderFooterButtonsContainer.className = 'builderPanel builderBottomRowContainer';				
		
		//// Session Management container 	////
		const builderSessionManagementContainer = document.createElement('div');
		builderSessionManagementContainer.className = 'builderPanel sideBubbles sessionManagementContainer'; 

		 
		////Col 1 Container 
		const subparentContainerLine1 = document.createElement("div");
		subparentContainerLine1.id = "builderMainPanelCol1";     
		subparentContainerLine1.className = "builderMainPanelCol colMainGrid"; 
		
		////Col 2 Container 
		const subparentContainerLine2 = document.createElement("div");
		subparentContainerLine2.id = "builderMainPanelCol2";     
		subparentContainerLine2.className = "builderMainPanelCol colSidePanels";         		
		             
		subparentContainerLine1.appendChild(containerMainGrid);  
		subparentContainerLine1.appendChild(builderFooterButtonsContainer); 
		subparentContainerLine2.appendChild(containerQuickLinks);
		subparentContainerLine2.appendChild(builderSessionManagementContainer); 
		
		subparentContainer.appendChild(subparentContainerLine1);
		subparentContainer.appendChild(subparentContainerLine2);
		
		
		//subparentContainerLine1.className = "builderMainPanelCol"; 
		
			////Col 1 Container 
		/*const subparentContainerLine1 = document.createElement("div");
		subparentContainerLine1.id = "builderMainPanelRow1";      
		subparentContainerLine1.className = "builderMainPanelRow";      
		subparentContainer.appendChild(subparentContainerLine1);
		
		
		const subparentContainerLine1R = document.createElement("div"); 
		subparentContainerLine1R.className = "builderMainPanelCol";      
		
		const subparentContainerLine1A = document.createElement("div"); 
		subparentContainerLine1A.className = "builderMainPanelRow";      
		subparentContainerLine1R.appendChild(subparentContainerLine1A);
		const subparentContainerLine1B = document.createElement("div"); 
		subparentContainerLine1B.className = "builderMainPanelRow";      
		subparentContainerLine1R.appendChild(subparentContainerLine1B);
		
		////Col 2 Container 
		const subparentContainerLine2 = document.createElement("div");
		subparentContainerLine2.id = "builderMainPanelRow2";      
		subparentContainerLine1.className = "builderMainPanelRow";        
		subparentContainer.appendChild(subparentContainerLine2);		
		             
		subparentContainerLine1.appendChild(containerMainGrid);  
		subparentContainerLine2.appendChild(builderFooterButtonsContainer); 
		subparentContainerLine1A.appendChild(containerQuickLinks);
		subparentContainerLine1B.appendChild(builderSessionManagementContainer); 
		
		
		subparentContainerLine1.appendChild(subparentContainerLine1R);
		
		parentcontainer.appendChild(builderFooterButtonsContainer); */
		
	}
	
	
	
	
	
	
	function createBuilderGrid(containerSelector,objectConfig){
		
		////////////////// CONTENT CREATION ///////////////////
		const container = parentcontainer.querySelector(containerSelector);
		
		linesConfig = setBuilderGrid();   // Automatically sets number of Columns and Rows in Grid + Grid lines
		 
		
		console.log(
		[...linesConfig,...objectConfig]);

		//// Creates blocks of builder (objects to click to open popups for parameters)
		[...linesConfig,...objectConfig].forEach(block => {
			const blockElement = document.createElement("div");
			container.appendChild(blockElement);

			// graphic properties  
			blockElement.className = `element ${block.class || ""}`;
			if (block.id){
				blockElement.id = block.id;			
			}
			if (block.title){
				blockElement.title = block.title;			
			}
			if(block.gridColumn){
				blockElement.style.gridColumn = block.gridColumn;				
			}
			if(block.gridRow){
				blockElement.style.gridRow = block.gridRow;				
			} 
			if (block.hasOwnProperty("color")){
				blockElement.style.backgroundColor = block.color;
			} 					

			//// create the text element
			const textElement = document.createElement("span");
			textElement.innerHTML = block.text || ""; 
			const textElementClone = textElement.cloneNode(true);			
			textElement.className = "visible-el";			
			textElementClone.className = "hidden-clone";
			blockElement.appendChild(textElement);
			blockElement.appendChild(textElementClone);

			// create the image element 
			if (block.hasOwnProperty("img")){
				block.img =	builderPaths.builderIconPath(block.img);   
				const imgElement = document.createElement("img");
				imgElement.src = block.img;  
				imgElement.alt = block.title;  //  for accessibility 
				
				if(blockElement.classList.contains("trialsequenceheader")){
					
					blockElement.insertBefore(imgElement, blockElement.firstChild);
				} else {
					blockElement.appendChild(imgElement);  // insert the image before the text content
					
				}
			}

			// link to page
			if (block.hasOwnProperty("onclick") && block.onclick.trim() !== ""){     
				blockElement.addEventListener('click', () => { 
					openStaticBuilder(block); 
				});
			}
		});
		

		// -------------------- HELPER FUNCTIONS FOR GRID BUILDING ---------------- //
		function setBuilderGrid() { 
			
			let linesConfig = [];
			
			if (containerSelector==".builderGrid"){
				
			
				// Counts number of rows and columns based on objectConfig definition
				let nRows = 0;
				let nColumns = 0; 
				let currColumn = 0; 
				let currRow = 0; 
				objectConfig.forEach(block => { 
					if (typeof block.gridColumn === 'string') { 
						currColumn= parseInt(block.gridColumn.split('/')[0].trim()) +  
							parseInt(block.gridColumn.split('span')[1].trim()) -1; 
						nColumns = Math.max(nColumns, currColumn);  
					} else if (typeof block.gridColumn === 'number')  {
						nColumns = Math.max(nColumns, block.gridColumn); 
					}
					if (typeof block.gridRow === 'string') { 
						currRow= parseInt(block.gridRow.split('/')[0].trim()) +  
							parseInt(block.gridRow.split('span')[1].trim()) -1; 
						nRows = Math.max(nRows, currRow);  
					} else if (typeof block.gridRow === 'number')  {
						nRows = Math.max(nRows, block.gridRow); 
					} 
				});    

				//// Sets number of rows and columns for this grid 
				const classList = container.classList;
				const currentgrid = classList[classList.length - 1]; 
				document.documentElement.style.setProperty(`--${currentgrid}NRows`, nRows);
				document.documentElement.style.setProperty(`--${currentgrid}NCol`, nColumns); 

				// Creates Grid Lines
				const verticalLines = [];
				const horizonalLines = [];
				lastclassV='vN';
				lastclassH='hN';
				let lastclass;
				for (let i = 1; i <= nColumns; i++) { 
					lastclass = (i==nColumns) ?  lastclassV : '';
					verticalLines.push({
						class: `line vertical v${i} ${lastclass}`,
						gridColumn: i
					});
				} 			
				for (let i = 1; i <= nRows; i++) {
					lastclass = (i==nRows) ?  lastclassH : '';
					horizonalLines.push({
						class: `line horizontal h${i} ${lastclass}`,
						gridRow: i
					});
				}
				
				linesConfig = [ ...verticalLines,  ...horizonalLines];
			
			}
			 
			return linesConfig;

		}
		
	}
	
	
	////// Creates bottom row (download, upload, instructions...) ////
	function createFooterActionButtons(parentcontainer){
		
		  
		
		
		//// DOWNLOAD  /  SAVE/LOAD SESSION  / IMPORT PARAMETERS
		//// Download Button     
		const trialDownloadButton = parentcontainer.getElementById("mainBuilderDownloadButton");
		trialDownloadButton.addEventListener('click', builderIOParametersToFile); 



		//// Upload Button  
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
		
		
		// label acting as visual upload button
		const trialUploadButtonVisual = parentcontainer.getElementById("mainBuilderUploadButton");
		trialUploadButtonVisual.htmlFor = 'csvFileInput'; // Match this with the file input ID  
		trialUploadButtonVisual.appendChild(trialUploadButton);  



		//// Save/Load session	  
		const openSessionConfigButton = parentcontainer.getElementById("mainBuilderSaveLoadButton");
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
		const mainBuilderHelpButton = parentcontainer.getElementById("mainBuilderHelpButton");
		mainBuilderHelpButton.addEventListener('click', () => { 	 
			const guidePopupFrame = document.getElementById('guideBuilder'); 
			guidePopupFrame.contentWindow.openModal(); 	  
		});


		//// Parameter Catalog  
		const parameterCatalogButton = parentcontainer.getElementById("parameterCatalogBuilderButton");  
		parameterCatalogButton.addEventListener('click', () => {  
			openBuilderParameterCatalog(builderPaths); 
		});
 
		
		//// Parameter File Template via Catalog (hidden here)  
		const parameterTemplateButton = parentcontainer.getElementById("parameterTemplateBuilderButton");     	 
		parameterTemplateButton.addEventListener('click', () => {  
			openBuilderParameterCatalog(builderPaths,true); 
		});

		 
		
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
