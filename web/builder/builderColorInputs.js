
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

 


 