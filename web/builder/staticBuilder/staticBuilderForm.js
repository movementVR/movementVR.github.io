/////////// FILE CONTAINS FUNCTIONS FOR SPECIFIC INPUTS SETUPS, IN BUILDER POPUP TABS ////////////////
// Main Interface Function = builderPopupInputsSetup(staticBuilderWindow),
//  	-> called upon clicking of a new tab (or opening of the popup window -> main tab)
//   	   to set up the form (staticBuilder) 



// Main interface function that is called to set up the form in the current tab (staticBuilder)
function builderPopupInputsSetup(staticBuilderWindow){   
	// 1) Generic setup
	builderFormsSetup(staticBuilderWindow);
	
	// 2) Expandable windows: sets up "on click" listeners to open expandable window when button is clicked
	expandableWindowsSetup(staticBuilderWindow);

	// 3) Inline buttons: adds and sets up help button and trial builder button for each group of inputs
	inlineButtonsSetup(staticBuilderWindow);	  
     
} 



// Function handles expandable containers within builder popup windows (for extra parameter inputs)
function expandableWindowsSetup(staticBuilderWindow) { 
	const expandButtons = staticBuilderWindow.document.querySelectorAll('.expand-button');
	expandButtons.forEach(button => {  
		button.addEventListener('click', () => { 
			// Main: Expands / Collapses Target Expandable Window 
			// -> Gets expandable window using ID, and action status (expanded vs collapsed)
			const expandWindowId = button.getAttribute('data-target'); 
			const expandableWindow = staticBuilderWindow.document.querySelector(expandWindowId);
			
			// -> Parses action: if currently collapsed => expand, if currently expanded => collapse		
			const expandAction = expandableWindow.classList.contains('collapsed');

			// -> Toggle classes based on the current 'expanded' state
			expandableWindow.classList.toggle('expanded', expandAction);
			expandableWindow.classList.toggle('collapsed', !expandAction); 
			button.classList.toggle('expanded', expandAction);
			button.classList.toggle('collapsed', !expandAction);
			
			
			// Secondary: Collapses Expandable Windows for Inline Sibiling Toggles (if we expanded the window)
			if (expandAction){
				// -> Gets all windows that are a "collapse target" for the current button
				const buttonsToCollapse = staticBuilderWindow.document
											.querySelectorAll(`[data-collapse="${expandWindowId}"]`); 
				buttonsToCollapse.forEach((buttonToCollapse) => { 
					// -> Collapses windows (adds 'collapsed' & removes 'expanded' class)
					buttonToCollapse.classList.add('collapsed'); 
					buttonToCollapse.classList.remove('expanded');				
					// -> Gets and collapses toggle button for current window 
					const windowToCollapse = staticBuilderWindow.document
												.querySelector(buttonToCollapse.getAttribute('data-target')); 
					windowToCollapse.classList.add('collapsed'); 
					windowToCollapse.classList.remove('expanded'); 
				}); 				
			}
			
			 
			
		});
	});
}
 


//  function to setup help and trial builder buttons (in third column, for each input group)
function inlineButtonsSetup(staticBuilderWindow) { 
	 
	// Inputs groups for trial builder (fieldsets with class "trial-builder-group")
	//const trialBuilderGroups = staticBuilderWindow.document.querySelectorAll('fieldset.trial-builder-group');  
	 const trialBuilderGroups = staticBuilderWindow.document.querySelectorAll('fieldset.trial-builder-group, fieldset.help-builder-group');

    trialBuilderGroups.forEach(inputGroup => { 	
        // // INPUT GROUP CONTENT // //
		// 1) SAVES HTML CONTENT BEFORE ADDING BUTTONS
		const htmlContent = inputGroup.innerHTML;
		
		// 2) PARSES GROUP NAME AND TITLE
		// Find the first element with class "name-type" (group name or first input name)
        const groupNameElement = inputGroup.querySelector('.name-type, .fullname-type');   
        
		// Creates Group Title = [Popup Title, Tab Name, Main Inputs Name]
		// (if groupNameElement is a name: Main Inputs Name = groupName,
		//  if groupNameElement is a subname / namenote: Main Inputs Name = last preceeding '.name-type.name') 
        const currentTabPanelID = inputGroup.closest('.tabpanel').id;
        const currentTabButtonID = currentTabPanelID.replace('_Container', '_Button');
        const currentTabButton = staticBuilderWindow.document.getElementById(currentTabButtonID);
		const groupTitle = [
			staticBuilderWindow.document.querySelector('.builder .title .main-text').textContent, // Popup Title
	        currentTabButton.textContent, // Tab Name	            
			groupNameElement.classList.contains('name') ? "" : // Main Inputs Name
				Array.from(staticBuilderWindow.document.querySelectorAll('.name'))
				.filter(el => el.compareDocumentPosition(groupNameElement) & Node.DOCUMENT_POSITION_FOLLOWING).pop()
				.textContent//(names array->filter selects those preceeding groupNameElement->pop takes last of these)
		];   
        
        // Get the groupName as text
        const groupName = groupNameElement.textContent;
  
        // 3) GETS PARAMETERS NAMES
        const parameterNames = builderIOGetParametersName(inputGroup);			
		
        
        // // BUTTONS CREATION // //
		// 4) CREATES BUTTON CONTAINER 
		const iconContainer = staticBuilderWindow.document.createElement('div'); 
		iconContainer.className='icons-type';
		
		// 5) APPEND BUTTON CONTAINER (TO THIRD COLUMN)		
		// Looks for the correct placement location (selects the preceeding sibiling)
		// If the next element is an'input-type' -> places icons after that element
		const nextElement = groupNameElement.nextElementSibling; // Get the element right after the group name
		const preceedingSibling = nextElement.classList.contains('inputs-type') ? nextElement : groupNameElement;  
		
		// Append the buttons to the first row of the groupNameElement, third column
    	preceedingSibling.parentNode.insertBefore(iconContainer, preceedingSibling.nextSibling);
		
		// 6) CREATES / SETS UP INDIVIDUAL BUTTONS
		if (inputGroup.classList.contains('trial-builder-group')) {
			setupIOSelectionButtons(staticBuilderWindow, inputGroup, iconContainer, groupName, parameterNames, groupTitle, htmlContent); 
		}
		builderHelpSetupButtons(staticBuilderWindow, inputGroup, iconContainer, groupName, parameterNames);
    });
    
    


    // Function creates inline gear buttons -> opens Input Source selection on click 
    function setupIOSelectionButtons(staticBuilderWindow, inputGroup, iconContainer, groupName, parameterNames, groupTitle, htmlContent){ 
        // Create "open trial builder" button (gear settings icon)
        const openTrialBuilderButton = staticBuilderWindow.document.createElement('button');
        openTrialBuilderButton.innerHTML = '&#x2699;';  // Gear settings icon
        openTrialBuilderButton.classList.add('trials-button'); 

        // add button to container 
        iconContainer.appendChild(openTrialBuilderButton); 		

        // sets up event listener: open trial builder  popup when clicking button 
        openTrialBuilderButton.addEventListener('click', (event) => {
            event.preventDefault();  // Prevent the form validation or submission (otherwise checks inputs for errors)	 		
             
            
            if (staticBuilderWindow.unsavedChanges){
                const errorPopupFrame = staticBuilderWindow.document.getElementById('error'); 
                errorPopupFrame.contentWindow.openModal(
                    'Unsaved changes',
                    'Please save before continuing',
                    'OK'                   
                );  

            } else {
                
                builderSelectInputSource(staticBuilderWindow,groupName,parameterNames,groupTitle,htmlContent);  
                
            } 
        }); 
    } 


    
} 
 
 
 
