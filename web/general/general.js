
// includes a javascript in scriptName.js to the doc (if only first argument passsed) or a window (second argument)
function includeScript(scriptName, targetWindow, onloadTargetFunction) {
    let targetDoc;
    if (targetWindow) {
        targetDoc = targetWindow.document;
    } else {
        targetDoc = document;
    }
    
    var scriptElement = targetDoc.createElement('script'); 
    
    if (onloadTargetFunction){
        scriptElement.onload = onloadTargetFunction();
    }
    
    scriptElement.src = scriptName; 
    targetDoc.body.appendChild(scriptElement); 
    return scriptElement;
}

 

// includes a style in scriptName.css to the doc (if only first argument passsed) or a window (second argument)
function includeStyle(scriptName, targetWindow) {
    let targetDoc;
    if (targetWindow) {
        targetDoc = targetWindow.document;
    } else {
        targetDoc = document;
    }
    const cssLink = targetDoc.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';
    cssLink.href = scriptName;
    targetDoc.head.appendChild(cssLink);
}


function createWindow(widthIn,heightIn,sizeUnits){   
    var newWindowWidth = 0;
    var newWindowHeight = 0;
    
    // Get the dimensions of the main window
    var mainWindowWidth = window.innerWidth;
    var mainWindowHeight = window.innerHeight;

    if(sizeUnits=="px"){ //pixels
        newWindowWidth = widthIn;
        newWindowHeight = heightIn;
    } else { //percent

        // Calculate the size for the new window (sizePercent% of the main window's dimensions)
        newWindowWidth = Math.round(mainWindowWidth * widthIn);
        newWindowHeight = Math.round(mainWindowHeight * heightIn);
    }
     
     
    // Calculate the position to center the new window
    var leftOffset = Math.round((mainWindowWidth - newWindowWidth) / 2);
    var topOffset = Math.round((mainWindowHeight - newWindowHeight) / 2);
 
    // Open a new window with the specified size and centered position
    var newWindow = window.open('', 'myWindow', 'width=' + newWindowWidth + ',height=' + newWindowHeight + ',left=' + leftOffset + ',top=' + topOffset);

      
    return newWindow;
}


function toggleExpandableWindow  (button, windowId) {
    var expandableWindow = document.getElementById(windowId); 
    expandableWindow.style.display = (expandableWindow.style.display === 'inline-block') ? 'none' : 'inline-block';
    button.classList.toggle('expanded', expandableWindow.style.display === 'inline-block');
};


function createOKButton(targetWindow){
             
    
        // Create a container for the button
        const buttonContainer = targetWindow.document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.height = '100%';
        buttonContainer.id = 'button-container';


        // Create an "OK" button
        const okButton = targetWindow.document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.marginTop = '20px'; // Adjust as needed for spacing
        // Add event listener to close the window when the button is clicked
        okButton.addEventListener('click', function() {
            targetWindow.close();
        });
        // Append the button to the buttonContainer
        buttonContainer.appendChild(okButton);
        // Append the buttonContainer to the document body
        targetWindow.document.body.appendChild(buttonContainer);
    
}



function changeHeightToFitParent(targetWindow,classToResize,manualOffset=20) {
    // 1) calculate the sum of offsetHeight of all children of a targetWindow excluding elements with class classToResize
    let totalOffsetHeight = 0; 
    const childrenArray = targetWindow.document.body.children;  
    // Iterate through all children of the target window
    for (let i = 0; i < childrenArray.length; i++) {
        let child = childrenArray[i];
        // Check if the element has class classToResize, if yes, skip it
        if (!child.classList.contains(classToResize)) {
            // Add the offsetHeight of each child to the total
            totalOffsetHeight += child.offsetHeight;  
        }
    }  
    //2) resize element of class classToResize to occupy remaining height
   const targetHeight = targetWindow.innerHeight -  totalOffsetHeight - manualOffset;    
   targetWindow.document.querySelector('.' + classToResize).style.height = targetHeight + 'px';  
}


function robustOnLoad(loadingElement,targetFunction){ 
        // Check if the new window is already loaded
        if (loadingElement.document.readyState === 'complete') {
            // If already loaded, execute modifications immediately
            targetFunction(); 
        } else {
            // If not loaded, attach a load event listener
            loadingElement.addEventListener('load', targetFunction); 
        }
}


function includeFilesFromJson(jsonPath,targetWindow,flagJS=true,flagCSS=true){ 
     // flagJS / flagCSS: flags for whether to load javascript (js) / CSS files
    fetch(jsonPath)
    .then(response => response.json())
    .then(data => { 
        const filePath = data.path;    // containing folder 
        data.js.forEach(file => {   // javascript files 
            includeScript(filePath+file, targetWindow);
        }); 
        data.css.forEach(file => {  // css files 
            includeStyle(filePath+file, targetWindow);
        });
    });     
}
      
function loadJsonVariable(jsonPath){
    let myVar; // my variable
    fetch(jsonPath)  // loads json file given full path and name
        .then(response => response.json())  
        .then(data => {
            myVar = data;  // myVar = JSON file content  
        });
    return myVar;
}
