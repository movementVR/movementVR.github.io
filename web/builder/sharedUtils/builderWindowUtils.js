/////////// FILE CONTAINS FUNCTIONS FOR BUILDER WINDOWS (shared by builders) ////////////////
// creates parts that are common to multiple windows
// Eg: Top Row container with Title ...


async function openBuilderWindow(windowConfig, windowJSON, windowClass, windowTitle) {
	//windowConfig: builderStaticWindowConfig, builderTrialWindowConfig, builderCatalogWindowConfig
	//windowJSON: 'staticBuilder', 'trialBuilder', ???TBD    
	
	// 1) Create New Window 
	const targetWindow = await createWindow(windowConfig); 
    targetWindow.windowType = windowJSON;

	// 2) Create window elements that are shared across window types 
    // // Parent
	const parentContainer = createContainer(targetWindow, targetWindow.document.body, `builder ${windowClass}`); 
    // // -> Top Title Row
    createTitleRow(targetWindow, windowTitle, parentContainer);  	
    // // -> Middle Content Panel
	const contentContainer = createContainer(targetWindow, parentContainer, 'content'); // Content
    // // -> Bottom Footer Row w/ control buttons
	createFooterRow(targetWindow,parentContainer);     // Bottom row buttons (Help, OK, Save, Cancel)


	// 3) Load JSON content
	// // Includes Files (html content, styles, scripts) from Json definitions
	const jsonFiles = [ 
		{ jsonPath: 'web/general/general.json', htmlContainer: contentContainer},
		{ jsonPath: 'web/builder/builder.json', selection: windowJSON, htmlContainer: contentContainer}
	];	 
	await includeFilesFromJson(jsonFiles, targetWindow); 
    
    
    //4) creates beforeunload listener
    targetWindow.unsavedChanges = false;
	targetWindow.addEventListener('beforeunload', (e) => {
        if (targetWindow.unsavedChanges) {	// if there are unsaved changes, tells the user
            // Cancel the event as stated by the standard.
            e.preventDefault(); 
            e.returnValue = '';
        }
	}); 
	
	 
	return targetWindow;
 

	////// HELPER FUNCTIONS //////
	// Function to create popup title, above the tabs
	function createTitleRow(targetWindow,windowTitle,parentContainer) {         
        const titleContainer = createContainer(targetWindow, parentContainer, 'title'); // Title row 	
        
		// text, img, sub (subtitle), doc (if document title differs)
		const windowTitleText = windowTitle.text ?? "";  // Top Row Container, Main Title
		const windowSubtitleText = windowTitle.sub ?? "";  // Top Row Container, Subtitle
		const windowTitleImage = windowTitle.img ?? "";  // Top Row Container, Icon/Image
		const windowDocTitle = windowTitle.doc ?? windowTitle.text;  // Title of actual window 

		// Actual window title
		targetWindow.document.title=windowDocTitle; // changes the popup window title    

		//// Title row - Image
		if(windowTitleImage && windowTitleImage!=""){
			const titleRowImg = targetWindow.document.createElement("img");
			titleRowImg.src = windowTitleImage; 
			titleRowImg.className = "icon";
			titleContainer.appendChild(titleRowImg); 
		}

		//// Title row - Main Title Text 
		if(windowTitleText && windowTitleText!=""){
			const titleRowText = document.createElement("span");
			titleRowText.textContent = windowTitleText.toLowerCase();
			titleRowText.className = "main-text";   
			titleContainer.appendChild(titleRowText);	
		}

		//// Title row - Subtitle Text 
		if(windowSubtitleText && windowSubtitleText!=""){
			const titleRowSubText = document.createElement("span");
			titleRowSubText.textContent = windowSubtitleText;
			titleRowSubText.className = "sub-text";   
			titleContainer.appendChild(titleRowSubText);	
		}
	}



 
    // Function to create standard buttons at the end of popup windows (OK, save, cancel...)
    // Help (left)  /   OK, Cancel, Save (right)
    function createFooterRow(targetWindow,parentContainer){  
        
	   const buttonContainer = createContainer(targetWindow, parentContainer, 'footer'); // Bottom Row
         
        createFooterButton('Help','help-button',['help']);
        createFooterButton('OK','ok-button',['save','close']);
        createFooterButton('Cancel','cancel-button',['cancel','close']);
        createFooterButton('Save','save-button',['save']);
         


        // Support functions 
        function createFooterButton(buttonLabel,buttonClass,actions){            
            const footerButton = targetWindow.document.createElement('button'); 
            footerButton.textContent = buttonLabel;
            footerButton.className = buttonClass;
            // Append the button to the buttonContainer
            buttonContainer.appendChild(footerButton);
            // Add event listener to perform actions when the button is clicked
            footerButton.addEventListener('click', () => {
                actions.forEach(action =>{
                    switch(action){
                        case "help":
                            openHelpPopup();
                            break;
                        case "cancel":  // will eliminate unsaved changes without asking                           
                            targetWindow.unsavedChanges = false;
                            break;
                        case "save":
                            targetWindow.someSaved = true;
                            saveData();
                            break;
                        case "close": 
                            targetWindow.close();
                            break;                            
                    }
                });
            });
        }
        
        
        function saveData(){
            switch (targetWindow.windowType) {
                case 'staticBuilder':  
                    builderIOParametersFromEditorStatic(targetWindow);
                    break;

                case 'trialBuilder': 
                    builderIOParametersFromEditorTrial(targetWindow);
                    paradigmSaveConfiguration(targetWindow);
                    break;

            } 
            targetWindow.unsavedChanges = false;
        } 
        
        function openHelpPopup(){ 
			const guidePopupFrame = targetWindow.document.getElementById('guide'); 
			if (guidePopupFrame){
				guidePopupFrame.contentWindow.openModal(); 	
			}    

        }
    }
}





//  Creates container and appends it to parent 
function createContainer(targetWindow, parentContainer, containerClass) {	
	// 1) Creates container
	const newContainer = targetWindow.document.createElement('div');
	
	// 2) Sets Class 
	newContainer.className = containerClass;
	
	// 3) Appends & returns container
	parentContainer.appendChild(newContainer); 
	return newContainer;
}
 
