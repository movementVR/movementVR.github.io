
function popupTabSetup(newWindow,htmlFileName,flagMainLevel){ 
    populateTabValues(newWindow,htmlFileName);
    colorInputsSetup(newWindow);
    addTrialExpandButtons(newWindow,htmlFileName,flagMainLevel);
    setInputsWidth(newWindow);
	setInputsOpacity(newWindow);
}




function populateTabValues(newWindow,htmlFileName){    
        // Populate the current form with stored values
        if (allTrialDesignForms[htmlFileName]) {
            const storedForm = allTrialDesignForms[htmlFileName];// Retrieve the stored form data
            const currentForm = newWindow.document.forms[0]; // Get the first form element in the new window's document
            
            // Loop through each stored element in the form
            for (let i = 0; i < storedForm.elements.length; i++) {
                const storedElement = storedForm.elements[i];// Get the current element from the stored form
                const currentElement = currentForm.elements[storedElement.name];// Find the corresponding element in the current form by name
                
                // If the corresponding element exists in the current form, set its value
                if (currentElement) { 
                    currentElement.value = storedElement.value;
                }
            }
        }
}


///////////////////////
function setInputsOpacity(newWindow){
	
	// support function: gray out main container when selecting something other than paradigm
	function grayOutContainer(element,inputChildren,inputsPlusButton) {		  
		
		// Disable user interaction for all input children
		inputChildren.forEach ((inputElement, index) => { 
			inputElement.style.pointerEvents = 'none'; 
		});  	
		
		// Sets parent element appearance to Not Active
		element.style.opacity = '0.5'; // Make the container look grayed out
		element.title = 'Edit with Paradigm Editor (+ button to the left)'; // adds explanation

		// changes appearance of 'Plus' button to show it is in use  	
	 	if (inputsPlusButton){ 
			inputsPlusButton.classList.add('trialexpandbtnUsed'); // adds class trialexpandbtnUsed (Used)
		}
		 
		
	}

	// support function: restore main container when selecting paradigm
	function restoreContainer(element,inputChildren,inputsPlusButton) {
		
		// Re-Enables user interaction for all input children
		inputChildren.forEach ((inputElement, index) => { 
			inputElement.style.pointerEvents = 'auto'; 
		});   
		
		// Sets parent element appearance to Active
		element.style.opacity = '1'; // Restore full visibility 
		element.title = ''; // removes disabled explanation
		
		// reverts appearance of 'Plus' button to 'not in use'  
		if (inputsPlusButton){ 
			inputsPlusButton.classList.remove('trialexpandbtnUsed'); // removes 'in use' class
		}
		
	} 
	 
	// gets the form object from the current window
	const currentForm = newWindow.document.forms[0];
	
	// gets and loops through all the <inputs> containers of input objects 
	const inputsElements =  (currentForm.querySelectorAll('inputs')); 
	inputsElements.forEach(element => { 
		const firstInput = element.querySelector('input, textarea'); // first input or textarea child
		if (firstInput){
			const key = firstInput.name; // the name of the first element of <inputs> is used as key
			
			// stored variable for whether the parameters are defined using builder, paradigm editor, or file
			const parametersDefinitionType=allParadigmDropdown[key];
			
			//  'Plus' button 
			let inputsPlusButton=null;
			const inputsName = element.previousElementSibling.closest('name'); // 'name' element		
			if (inputsName){
				inputsPlusButton = inputsName.querySelector('.trialexpandbtn'); // plus button (child of name element)
			}		
			
			// all input children elements 
			const inputChildren=element.querySelectorAll('label,input,textarea'); 
			
			if (parametersDefinitionType && parametersDefinitionType!='Builder'){
				grayOutContainer(element,inputChildren,inputsPlusButton);
			}else{
				restoreContainer(element,inputChildren,inputsPlusButton);
			}  			
		}
	});

	 
	
} 



 


