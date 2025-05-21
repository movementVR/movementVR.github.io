// // //  SCRIPT HANDLES INLINE HELP BUTTONS AND TOOLTIPS // // // 

// function creates and sets up the help button for the input group 
// (receives as inputs: iconContainer = container for the button; groupName = name of input group)
function builderHelpSetupButtons(staticBuilderWindow, inputGroup, iconContainer, groupName, parameterNames){ 
	// Create the help button (icon)
	const helpButton = staticBuilderWindow.document.createElement('button'); 
	helpButton.innerHTML = '?'; // Help icon as a question mark
	helpButton.classList.add('help-button'); // Use the class from your CSS

	// add button to container
	iconContainer.appendChild(helpButton); 		

	// sets up event listener: show tooltip on help button click
	helpButton.addEventListener('click', () => {
		handleHelpButtonClick(staticBuilderWindow, inputGroup, helpButton, iconContainer, groupName);
	}); 


	// Function to handle help button click
	function handleHelpButtonClick(staticBuilderWindow, inputGroup, helpButton, iconContainer, groupName) { 
		event.preventDefault(); // Prevent the form validation or submission (otherwise checks inputs for errors)	 

		// Checks if helpPopup already exists (if so, closes it, because repeated button click)
		let helpPopup = iconContainer.querySelector('.help-popup');
		if (helpPopup) { // exists -> close it 
			closeHelpTooltip(helpPopup,helpButton);
		} else { // did not exist -> opens it  
			openHelpTooltip(staticBuilderWindow, inputGroup, helpButton, iconContainer, groupName);   // Creates tooltip popup with help content
		}		

		// Function to close help tooltip
		function closeHelpTooltip(helpPopup,helpButton) {
			helpPopup.remove();
			helpButton.classList.remove('in-use');
		}
		// Function to create and show help tooltip
		function openHelpTooltip(staticBuilderWindow, inputGroup, helpButton, iconContainer, groupName) { 	 		
			// Create the helpPopup div (main container w/ bubble shape)  
			const helpPopup = staticBuilderWindow.document.createElement('div');
			helpPopup.className = 'help-popup';
			iconContainer.appendChild(helpPopup); 

			// Create the arrow (dip towards help button)
			const arrow = staticBuilderWindow.document.createElement('div');
			arrow.className = 'arrow'; 
			helpPopup.appendChild(arrow);

			// Create the close button (x)
			const closeButton = staticBuilderWindow.document.createElement('span');
			closeButton.className = 'close-button';
			closeButton.textContent = '\u00D7';  // 'x' to exit window
			helpPopup.appendChild(closeButton);

			// Create the helpPopup content div (for the text)
			const helpPopupContent = staticBuilderWindow.document.createElement('div');
			helpPopupContent.className = 'help-content';
			helpPopup.appendChild(helpPopupContent);

			// Populates the helpPopup with text
			populateHelpTooltipContent(inputGroup, groupName, helpPopupContent);

			// Adjusts size / position of bubble to fit tabPanel container  
			adjustHelpTooltipMeas(staticBuilderWindow,helpPopup,arrow);

			// Toggles button class
			helpButton.classList.add('in-use'); 

			// Listener to close the helpPopup when clicking the close button (removes it)
			closeButton.addEventListener('click', () => {		 
				closeHelpTooltip(helpPopup,helpButton); 
			}); 

		}

		// Populate tooltip with help content loaded from internal file 
		function populateHelpTooltipContent(inputGroup, groupName, helpPopupContent){	
			
			console.log(inputGroup);
			
			// help content from inputGroup children (different parameters - inputs and textareas)
			const parsedHelpContent = getBuilderParametersHelpContent(inputGroup, true);
			
			const groupNameNoColon = groupName.replace(/:\s*$/, ''); // removes any colon ":" at end of the string
			const parsedHelpContentWithName = `<b>${groupNameNoColon}</b>: ${parsedHelpContent}`; 	

			// Sets the tooltip content to the help text 
			helpPopupContent.innerHTML = parsedHelpContentWithName;   
			
		}	

		// Adjusts size / position of bubble to fit tabPanel container 
		function adjustHelpTooltipMeas(staticBuilderWindow,helpPopup,arrow){		
			// -> tab content properties  
			const tabPanel = helpPopup.closest('.tabpanel'); 
			const tabPanelWidth = tabPanel.offsetWidth;
			const tabPanelTop = tabPanel.getBoundingClientRect().top	

			// -> configuration parameters  
			const widthPercentRemaining = defBuilderTooltip().widthPercentRemaining/100;   // % of remaining width to occupy
			const spaceTopMinPx = defBuilderTooltip().spaceTopMinPx; // min space top of bubble (px)

			// -> computations for width  
			// 	  (adjusts the width to fill a percentage of remaining window width)
			const helpPopupLeft = helpPopup.getBoundingClientRect().left;	
			const helpPopupTargetWidth = widthPercentRemaining*(tabPanelWidth - helpPopupLeft); // Calculate the width
			helpPopup.style.width = `${helpPopupTargetWidth}px`; // Set the new width 
			
			// -> computations for top position  
			// 	  (ensures that the bubble does not run over the tabPanel container top border)
			const spaceTop = helpPopup.getBoundingClientRect().top - tabPanelTop;  
			if (spaceTop < spaceTopMinPx){
				const additionalSpace = spaceTopMinPx - spaceTop;  		
				helpPopup.style.marginTop = `${additionalSpace}px`;  // Set the new vertical position 
				arrow.style.marginTop = `${-additionalSpace}px`;  // Maintain original vertical position
			} 
		}

	}
}

 



// Function parses help content from different parameters in fieldset
// into a single string 
// inputOrInputGroup can be the fieldset or a child input/textarea in the fieldset
function getBuilderParametersHelpContent(inputOrInputGroup, styleFormatting = true){
	
	// Gets Fieldset (either passed inputOrInputGroup or its parent)
	let inputGroup;
	if (inputOrInputGroup.tagName === 'FIELDSET') {
		inputGroup = inputOrInputGroup;
	} else {
		inputGroup = inputOrInputGroup.closest('fieldset');
	}

	// Initializes help text arrays
	helpArrayMain=[];
	helpArraySub=[];

	// Tracks input duplicates to not repeat their help (same name, used for hidden checkboxes = FALSE)
	const seenNames = new Set();          

	// Gets <input> and <textarea> children to find help text
	const inputChildren = inputGroup.querySelectorAll('input, textarea');  

	// Loop through children to find help text
	inputChildren.forEach(inputChild => {  				
		// processes individual <input> or <textarea> child elements inputChild
		const paramName = inputChild.getAttribute('name');  

		// Check that name and respective help exist + haven't been added yet
		if (paramName && helpParameterText[paramName] && !seenNames.has(paramName)) {
			//  Retrieve mainHelp and indivHelp from helpParameterText
			const { helpMain, helpSub } = helpParameterText[paramName]; 

			// If mainHelp exists, push it to helpArrayMain
			if (helpMain) {
				helpArrayMain.push(helpMain);
			} 
			// If indivHelp exists, push it to helpArraySub
			if (helpSub) {
				helpArraySub.push(helpSub);
			}

			// Keeps track of this paramName to skip it in the future
			seenNames.add(paramName); 					
		}  
	}); 	

	// Styles and parses help text into a single string
	let parsedHelpContent = '';
	if (helpArraySub && helpArraySub.length>0){
		parsedHelpContent = helpArraySub.join(', '); 		
		if (styleFormatting){
			parsedHelpContent = `<i>${parsedHelpContent}</i>`; 		
		} 
	}  
	parsedHelpContent = `${helpArrayMain.join(' ')} ${parsedHelpContent}`; 	

	return parsedHelpContent;
}



// Function loads help content from internal file help 
// -> stores help content in helpParameterText
function builderHelpLoadContent() { 
    const uri =  builderPaths.builderHelpCsvPath;
	loadFile(uri).then(csvData => {   
		const rows = csvData.split(/\r\n|\r|\n/);		
		const csvFormData = {};
		rows.forEach(row => { 

			if (row){  // skips empty lines, common for manually edited csv 
				const [scriptName, paramName, paramValue, helpMain, helpSub] = row.split(','); 
				const fullParamName = scriptName + "," + paramName; 

				// Store in the helpParameterText object
				helpParameterText[fullParamName] = {
					helpMain: helpMain,
					helpSub: helpSub
				};
			}  
			
		});
	}); 
	
}
 

