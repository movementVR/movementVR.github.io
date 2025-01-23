
function colorInputsSetup(newWindow){   
    let groups = getColorGroups(newWindow);
    replaceColorInputs(newWindow,groups);
    setInputColorListeners(newWindow);  
}
 
 

// color inputs grouped by R G B A
function getColorGroups(newWindow){
    const inputs = Array.from(newWindow.document.querySelectorAll('input'));
    const groups = {};
    inputs.forEach((input, index) => {
        const id = input.id;
        const baseIdMatch = id.match(/(.+)_([R])/); // Match only the _R suffix
        if (baseIdMatch) {
            const baseId = baseIdMatch[1];
            // Ensure there are three more inputs and that they exist and have the correct IDs
            if (
                inputs[index + 1] && inputs[index + 1].id === `${baseId}_G` &&
                inputs[index + 2] && inputs[index + 2].id === `${baseId}_B` &&
                inputs[index + 3] && inputs[index + 3].id === `${baseId}_A`
            ) {
                // Create the group and store the consecutive inputs
                groups[baseId] = {
                    R: input,
                    G: inputs[index + 1],
                    B: inputs[index + 2],
                    A: inputs[index + 3],
                };
            }
        }
    });   
    return groups;
}



function rgbToHex(inputR,inputG,inputB){
    const r = inputR.value * 255;
    const g = inputG.value * 255;
    const b = inputB.value * 255; 
    return "#" + [r, g, b].map(x => {
                    const hex = Math.round(x).toString(16);
                    return hex.length === 1 ? "0" + hex : hex;
                }).join('');  // rgb To Hex
}

function hexToRgb(hexColor) {
    var r = parseInt(hexColor.substring(1, 3), 16) / 255;
    var g = parseInt(hexColor.substring(3, 5), 16) / 255;
    var b = parseInt(hexColor.substring(5, 7), 16) / 255;
    return { r: r, g: g, b: b };
}


// Function to search for input elements and replace them with a color input
function replaceColorInputs(newWindow,groups) {    
    Object.keys(groups).forEach(baseId => {
        const group = groups[baseId];        
         
        if (group.R && group.G && group.B) { 
            const color =rgbToHex(group.R,group.G,group.B);
            
            // Hide the original R, G, B inputs and labels
            group.R.previousElementSibling.style.display = 'none'; // Hide R label
            group.R.style.display = 'none'; // Hide R input
            group.G.previousElementSibling.style.display = 'none'; // Hide G label
            group.G.style.display = 'none'; // Hide G input
            group.B.previousElementSibling.style.display = 'none'; // Hide B label
            group.B.style.display = 'none'; // Hide B input
            
            // Create new label for color input
            const label = newWindow.document.createElement('label');
            label.setAttribute('for', baseId);
            label.innerText = 'Color:';
            group.R.parentNode.insertBefore(label, group.R);
            
            // Create new color input element
            const colorInput = newWindow.document.createElement('input');
            colorInput.type = 'color';
            colorInput.id = baseId;
            colorInput.value = color;
            group.R.parentNode.insertBefore(colorInput, group.R);   
            
      
        }
    });
}
 

function setInputColorListeners(newWindow){
    colorPickerToRGBChannels(newWindow);
    RGBChannelsToColorPicker(newWindow);
}

// Listener 1: color picker -> R G B number inputs
function colorPickerToRGBChannels(newWindow){
    var colorInputs = newWindow.document.querySelectorAll('input[type="color"]'); //all input elements of type color 
    var rgbInputs = ['R', 'G', 'B'];  // suffix for number inputs  
    
    colorInputs.forEach(function(colorInput) { 

        colorInput.addEventListener("input", function(id) {
            var id = colorInput.id; // ID of the color input
                     
            var hexColor = colorInput.value;
            var rgb = hexToRgb(hexColor);
            
            newWindow.document.getElementById(id + "_R").value = rgb.r;
            newWindow.document.getElementById(id + "_G").value = rgb.g;
            newWindow.document.getElementById(id + "_B").value = rgb.b;

         
        }); 
        
    });

}




// Listener 2: R G B number inputs -> color picker 
function RGBChannelsToColorPicker(newWindow){
    var colorInputs = newWindow.document.querySelectorAll('input[type="color"]'); //all input elements of type color 
    var rgbInputs = ['R', 'G', 'B'];  // suffix for number inputs 
    
    colorInputs.forEach(function(colorInput) {
        
         rgbInputs.forEach(function(component) {             
            var id = colorInput.id; // ID of the color input
            var input = newWindow.document.getElementById(id + "_" + component);
             input.addEventListener("input", function() { 
                
                var hexColor = rgbToHex(newWindow.document.getElementById(id + "_R"),
                                        newWindow.document.getElementById(id + "_G"),
                                        newWindow.document.getElementById(id + "_B"));
 
                newWindow.document.getElementById(id).value = hexColor; 
            });
        }); 
        
    }); 

}

   


////////////////// TRANFORM BACK ///////////
// Function to process the given HTML content
function transformColorInputsToRGB(htmlContent) {
    // Create a temporary DOM element to manipulate the HTML string
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    // Find all color inputs
    const colorInputs = tempDiv.querySelectorAll('input[type="color"]');	
	 
    colorInputs.forEach((colorInput,index) => {
        // Find the parent container (likely <inputs>)
        const parentInputs = colorInput.closest('inputs');

        if (parentInputs) {
            // Find associated R, G, B, and A labels and inputs
            const rInput = parentInputs.querySelector(`#${colorInput.id}_R`);
            const gInput = parentInputs.querySelector(`#${colorInput.id}_G`);
            const bInput = parentInputs.querySelector(`#${colorInput.id}_B`);
            const rLabel = parentInputs.querySelector(`label[for="${colorInput.id}_R"]`);
            const gLabel = parentInputs.querySelector(`label[for="${colorInput.id}_G"]`);
            const bLabel = parentInputs.querySelector(`label[for="${colorInput.id}_B"]`); 
            const colorInputLabel = tempDiv.querySelector(`label[for="${colorInput.id}"]`);
			

            // Make the R, G, and B labels and inputs visible
            if (rInput && rLabel) {
                rInput.style.display = '';
                rLabel.style.display = '';
                rInput.style.marginRight = '0';
                rLabel.style.marginRight = '0';
            }

            if (gInput && gLabel) {
                gInput.style.display = '';
                gLabel.style.display = '';
                gInput.style.marginRight = '0';
                gLabel.style.marginRight = '0';
            }

            if (bInput && bLabel) {
                bInput.style.display = '';
                bLabel.style.display = '';
                bInput.style.marginRight = '0';
                bLabel.style.marginRight = '0';
            }

            // Remove the color input element
            colorInput.remove(); 
			if (colorInputLabel){
				colorInputLabel.remove();
			}
        }
    });
	 
	// Set widths for form control and input column
    tempDiv.querySelectorAll('.form-control').forEach((formControl) => {
        formControl.style.width = '580px';
    });

    tempDiv.querySelectorAll('inputcolumn').forEach((inputColumn) => {
        inputColumn.style.width = '575px';
    });

    // Set a new width for the parent inputs container  
    tempDiv.querySelectorAll('inputs').forEach((inputs) => {
        inputs.style.width = '380px';
    });
	
	
	htmlContent = tempDiv.innerHTML;
	
 
	
    return htmlContent;

}


 