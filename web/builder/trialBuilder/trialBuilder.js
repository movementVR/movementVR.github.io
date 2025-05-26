
/////////////////////////// ENTRY SCRIPT for TRIAL BUILDER POPUP /////////////////////////////////

// Function creates popup window for Trial Builder
// and calls other function to populate window on load 
async function openTrialBuilder(htmlContent,groupTitle) {    
 
	// Creates and initializes the popup window and waits for it to complete
	const trialBuilderWindow = await openBuilderWindow (
		builderTrialWindowConfig, 		// window config
		'trialBuilder', 				// window json selection
		'trial', 						// window elements class specifier
		{ text: groupTitle[0] } // window title  
	);  
	
    // Populate the new window with content 
	setupTrialBuilder(trialBuilderWindow,htmlContent,groupTitle);
    
	return trialBuilderWindow;
     

    // SUPPORT FUNCTION: TRIAL BUILDER INITIALIZATION //
    function setupTrialBuilder(trialBuilderWindow, htmlContent, groupTitle){  

        // Overall Main Container
        const container = trialBuilderWindow.document.getElementById('trial-builder-parentContainer');  

        // Sets up back-end listeners to support GUI functionalities (buttons, drag/drop, dropdowns etc...)
        setupGUIListeners(trialBuilderWindow, container); 

        // Inserts Parameters HTML content (from builder Parameters Group) into appropriate container  
        insertParametersContent(trialBuilderWindow, container, htmlContent); 

        // Generic form setup
        builderFormsSetup(trialBuilderWindow);

        // Creates initial GUI elements (left panel list items, right panels for trial types...)
        initializeGUIElements(trialBuilderWindow, container);	 
        
        // Re-runs Generic form setup to setup newly-added inputs in right panels (but without overwriting values)
        builderFormsSetup(trialBuilderWindow, false);
		
		 
        // //  SUPPORT FUNCTIONS // // 		
        // Function inserts htmlContent for Parameter Group into appropriate container in Paradigm Editor
        function insertParametersContent(trialBuilderWindow, container, htmlContent){
            const parametersItemContainer =  container.querySelector(
                '.trialbuilderInputsItem.itemInheritedInputs.inputs-panel .inner-container');
            parametersItemContainer.innerHTML = htmlContent; 
            
            // HANDLES non-numerical inputs -> sequence types            
            let allNonNumerical = true; // Track if all are non-numerical
            // Adds classes to handle non-numerical-inputs in numerical sequences
            const elements = parametersItemContainer.querySelectorAll('input, textarea');
            elements.forEach((element) => { 
                if (!(element.tagName === "INPUT" && element.type === "number")) { // Not numerical input 
                    // 1) adds non-numerical-input class to inputs and labels
                    element.classList.add('non-numerical-input'); 
                    const label = parametersItemContainer.querySelector(
                        `label[for="${element.id}"]`
                    );
                    if (label) {
                        label.classList.add('non-numerical-input'); 
                    }
                    
                    // 2) adds non-numerical-note class to the last of label, input
                    let lastElem = element;
                    if  (label && (element.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING))  {
                        lastElem = label;
                    }
                    lastElem.classList.add('non-numerical-note');  
                    
                } else {
                    allNonNumerical = false;
                }
            });
            // if all inputs are non-numerical, add "non-numerical-only" class to main parent container
            if (allNonNumerical) {
                container.classList.add('non-numerical-only');
            }  

        }


        // Function creates initial GUI elements: Left Panel list elements -> trial types -> Right Panels
        // (for default Baseline, Adaptation, and Washout, or from previous configuration)
        function initializeGUIElements(trialBuilderWindow, container){			
            const leftPanelPlusButton = container.querySelector('.trialbuilderInputsTitle.itemAdd.blocks-panel'); 

            // Loops through Initial Left List Elements -> creates & initializes:
            // - Left Panel list elements & dropdown options
            // - Right Panels for each trial type
            const initialLeftListElements = trialbuilderLoadConfigurationLeft(trialBuilderWindow); 
            initialLeftListElements.forEach(({ trialType, repeats }) => {	
                 // 1) Create Left Panel List Element
                // lastDropdown: dropdown menu for the newly-created list element
                const lastDropdown = createLeftListElement(leftPanelPlusButton,repeats,container);

                // 2) Create New Trial Type -> Dropdown Option & Right Panel
                // if trialType is new -> sets lastDropdown = trialType, and creates Right Panel for trialType
                newTrialBlockType(trialBuilderWindow, lastDropdown, trialType, container);
            }); 	


            // 3) Initialize Right Panels
            initializeRightPanels(trialBuilderWindow);	


            // Selects first List Element in Left Panel
            const firstTrialBlock = container.querySelector('.trialbuilderInputsItemParent.blocks-panel:not(.template)');
            firstTrialBlock.click();

            // 1) Creates Left Panel List Element
            function createLeftListElement(leftPanelPlusButton,repeats,container){ 
                // Adds new list element
                leftPanelPlusButton.click(); 

                // Gets the newly-created list element (last non-template element) 
                const allElements = container.querySelectorAll(			
                        '.trialbuilderInputsItemParent.blocks-panel:not(.template)'); 
                const lastElement = allElements[allElements.length - 1];

                // Gets the dropdown and repeats items of the newly-created element 
                const lastDropdown = lastElement.querySelector('.trialbuilderInputsItem.itemTrialType.blocks-panel');
                const lastRepeats = lastElement.querySelector('.trialbuilderInputsItem.itemRepeats.blocks-panel');		 

                // Sets # Repeats in Left Panel Element
                lastRepeats.value = repeats; 	

                return lastDropdown;
            }

            function initializeRightPanels(trialBuilderWindow){
                // Loops through all (non-template) Right Panels
                const rightPanels=trialBuilderWindow.document.querySelectorAll(
                                            '.trialbuilderPanel.inputs-panel:not(.template)');
                rightPanels.forEach(rightPanel => {	 				 
                    // 1) Get the configuration for current Right Panel
                    const { initialListSequence, initialListElements } = 
                          paradigmLoadConfigurationRight(trialBuilderWindow, rightPanel);

                    // Proceeds only if it is not empty (otherwise keeps default elements)
                    if(initialListSequence){ 
                        // 2) Remove all current list elements (except the template)
                        const listContainer = rightPanel.querySelector('.trialbuilderInputsListContainer');
                        const existingElements = listContainer.querySelectorAll(
                                                            '.trialbuilderInputsItemParent:not(.template)');
                        existingElements.forEach(el => el.remove());

                        // 3) Set up Sequence Type (Main Dropdown)
                        const sequenceDropdown = rightPanel.querySelector('#SequenceTypeDropdownMenu');
                        sequenceDropdown.value = initialListSequence;
                        // triggers event to use same GUI implementation as for user input (eg set sequence attribute)
                        sequenceDropdown.dispatchEvent(new Event('change', { bubbles: true })); 

                        // 4) Loops through List Elements Definition -> Creates and Initializes them 
                        const plusButton = rightPanel.querySelector('.trialbuilderInputsTitle.itemAdd.inputs-panel');
                        initialListElements.forEach(({ inheritedInputs, probabilities }) => {
                            createRightListElement(trialBuilderWindow, rightPanel, plusButton, listContainer, 
                                                   inheritedInputs, probabilities );
                        }); 
                         
                    } else {
                        
                        // Otherwise, checks if there are any <varies> copied over & active
                        // -> replaces tehm with default values
                        const activeFields = trialBuilderWindow.document.querySelectorAll(
                            'input:not([disabled]), textarea:not([disabled])');

                        activeFields.forEach(input => {
                            if (input.value === "" && input.placeholder === "(varies)") { 
                                const key = input.getAttribute('name');
                                input.value = builderParametersDefault[key];
                                input.placeholder = "";
                            }
                        }); 
                        
                    }	   	
                }); 	 

                // Function to create and initialize a new list element within a given right panel.
                function createRightListElement(trialBuilderWindow, rightPanel, plusButton, listContainer, 
                                               inheritedInputs, probabilities)  {  
                    // 1) creates list element			
                    plusButton.click(); // Adds new list element
                    // Gets the newly-created list element (last non-template element) 
                    const allElements = listContainer.querySelectorAll(			
                            '.trialbuilderInputsItemParent.inputs-panel:not(.template)'); 
                    const lastElement = allElements[allElements.length - 1];

                    // 2) sets probability 
                    const lastProbability = lastElement.querySelector(
                                                '.trialbuilderInputsItem.itemProbability.inputs-panel');		
                    lastProbability.value = probabilities; 	 

                    // 3) loops through inheritedInput (for each {name,value} pair) 
                    const lastForm = lastElement.querySelector(
                                                '.trialbuilderInputsItem.itemInheritedInputs.inputs-panel form');  
                    // Loop through each [name, value] pair from the inheritedInputs config.
                    for (const [name, value] of Object.entries(inheritedInputs)) {
                        // Find an input or textarea with the matching name attribute.
                        const inputField = lastForm.querySelector(`[name="${name}"]`); 
                        inputField.value = value;  // sets its value to that from config
                    }			  
                } 
            }

        }

    } 
	 
} 




 

 

