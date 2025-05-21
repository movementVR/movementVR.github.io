/////////// FILE CONTAINS FUNCTIONS FOR FORM INPUT FIELDS (shared by builders) ////////////////
// Main Interface Function = builderFormsSetup(targetWindow),
//  	--> called upon populating a new window with form inputs
//		--> Shared setup for both staticEditor and trialEditor 
 
// Main interface function that is called to set up forms for both staticEditor and trialEditor
function builderFormsSetup(targetWindow, loadValues = true){ 
	// 1) Default Behavior: sets up base event default behavior replacing browser's default
	defaultBehaviorSetup(targetWindow);
	
	// 2) Color inputs: Sets up listeners to automatically sync color pickers with their numerical inputs
	colorInputsSetup(targetWindow); 

	// 3) Inputs values: Loads stored input values to current form
    if (loadValues){
	   builderIOParametersToEditor(targetWindow);         
    }
	  
	// 4) Inputs opacity: Sets opacity/pointers to disable input fields that are handled by other interfaces 
	setInputsOpacity(targetWindow); 	
	


	/////////// HELPER FUNCTIONS ///////////////

	function defaultBehaviorSetup(targetWindow){  
		// Loops through all input and textarea elements 
		const inputsAndTextareas = targetWindow.document.querySelectorAll('input, textarea');
		inputsAndTextareas.forEach(input => {    
			// On any change -> keeps track that there are unsaved changes  
            input.addEventListener('change', () => {
                targetWindow.unsavedChanges = true;
            });
            
			// On blur (when we click outside of / leave the input field)
			// -> checks if input meets built-in / preset validation rules
			input.addEventListener('blur', () => { 
				
                // Calls function to check if input is valid (built-in + custom checks)
                const errorMsg = builderIOCheckInputValue(input);
                
                if (errorMsg) { // shows error message if invalid
					input.reportValidity(); 
				}  
				 
			}); 
			
			// On input (when user types in input/textarea fields) -> clears any error message
			input.addEventListener('input', () => {
				input.setCustomValidity('');
			});

			// Does not allow to write "-" for numerical input fields that have a min>=0 
			if (input.tagName === 'INPUT' && input.type==='number' && input.hasAttribute('min') && input.min>=0) { 
				input.addEventListener('keydown', (event) => {
					if (event.key === '-' || event.key === 'Subtract') {
						event.preventDefault();
					}
				 });			 
			}

			// Replaces default "enter" key behavior (which would submit the form) with common behaviors
			// --> Enter on numerical input: blur (clicks outside). Enter on checkbox: clicks checkbox.
			input.addEventListener('keydown', (event) => {
				if (event.key === "Enter") {
					// Handle different input types
					if (input.tagName === 'INPUT') {
						switch (input.type) {// Replaces default submission seen for number, checkbox, radio 
							case 'number':   
								event.preventDefault(); 					
								input.blur();// Simulate clicking outside by removing focus
							case 'checkbox':  
								event.preventDefault();
								input.click(); // Simulate clicking the checkbox
							case 'radio': 
								event.preventDefault();	// no form submission
								break;
							case 'color': 
								event.preventDefault();  
								input.click(); // clicks to open color picker (default for Chrome but not all)
								break;
							case 'hidden':  
								break;  
						}
					} else if (input.tagName === 'TEXTAREA') {  
						 // no changes because default for textarea = new line
					} 
				}
			});  
			
		});
		 
	}




    /////////////  COLOR INPUT SYNC UTILITIES  /////////////
	/////////// FUNCTIONS TO DEAL WITH COLOR INPUTS IN BUILDER ////////////////
	/* Color inputs are displayed as color pickers, but internally stored as RGB numerical channels.
	This file contains functions that 
	1) convert between color picker (hexadecimal css format) and RGB numerical formats
	2) use event listeners to sync the values of two input types  
	Note: html files contain both input elements - the picker element is visible while the RGB elements are hidden.
	Color picker: used by users to manually pick a color. 
	RGB: updated when parameter values uploaded from file, and used to download parameter values. 
	Functions ensure that when either input is changes, the other also automatically changes to that value.
	*/ 

    function colorInputsSetup(targetWindow) {

        // conversion functions 
        const hexToRgb = hex => ({
            r: parseInt(hex.slice(1, 3), 16) / 255,
            g: parseInt(hex.slice(3, 5), 16) / 255,
            b: parseInt(hex.slice(5, 7), 16) / 255
        });

        const rgbToHex = (r, g, b) => {
            const clamp = v => Math.max(0, Math.min(255, Math.round(parseFloat(v) * 255)));
            const toHex  = n => clamp(n).toString(16).padStart(2, '0');
            if ([r, g, b].some(v => v === '' || isNaN(v))) return '#000000';
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        };

        // main setup script 
        const rgbChannels = ['r', 'g', 'b']; // suffix for color inputs to VR
        const colorInputs = targetWindow.document.querySelectorAll('input[type="color"]'); // visible color pickers

        colorInputs.forEach(colorInput => {
            
            const baseId = colorInput.id.replace(/_picker$/, '');

            const rgbInputs = Object.fromEntries(
                rgbChannels.map(channel => {
                    const inputsParent = colorInput.closest('.inputs');  
                    const hiddenInput  = inputsParent.querySelector(`#${baseId}${channel}`); 
                    
                    // cross-references: store channel ids as picker attributes and viceversa
                    colorInput.setAttribute(channel, hiddenInput.id);      // “r”, “g”, “b” 
                    hiddenInput.setAttribute('helperRefId', colorInput.id);     // “helperRefId” 

                    return [channel, hiddenInput];  // → Object { r:…, g:…, b:… }
                })
            );
            
            
            // Listener: numeric  →  picker
            const syncPicker = () => {
                colorInput.value = rgbToHex(
                    rgbInputs.r.value,
                    rgbInputs.g.value,
                    rgbInputs.b.value
                );
            };

            rgbChannels.forEach(channel =>
                rgbInputs[channel].addEventListener('input', syncPicker)
            );
                    /*hiddenInput.addEventListener('input', () => {
                        colorInput.value = rgbToHex(
                            rgbInputs.r.value,
                            rgbInputs.g.value,
                            rgbInputs.b.value
                        );
                    });*/
                    //hiddenInput.dispatchEvent(new Event('input'));  // fire immediately

            // Listener: picker  →  numeric
            colorInput.addEventListener('input', () => { 
                const { r, g, b } = hexToRgb(colorInput.value);
                rgbInputs.r.value = r;
                rgbInputs.g.value = g;
                rgbInputs.b.value = b;
            });
            
              
            syncPicker();
            
            // Reference of all hidden channels as picker attribute 
            const targetRefIds = rgbChannels.map(ch => baseId + ch).join('/');
            colorInput.setAttribute('targetRefId', targetRefIds);
            
        });
    }
 
	
} 



