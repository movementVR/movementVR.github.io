
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
    
	
	
	scriptElement.onload = () => {
		console.log(scriptName+ "  loaded.");
	};
	
    scriptElement.src = scriptName; 
    targetDoc.body.appendChild(scriptElement); 
	
	console.log(scriptName);
	console.log(targetWindow);
	console.log(targetDoc);
	
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


function createWindow(widthIn,heightIn,sizeUnits,leftOffsetIn,topOffsetIn,offsetUnits,sizeRefWindow){  
    
    var newWindowWidth = 0;
    var newWindowHeight = 0;
    var topOffset = 0;
    var leftOffset = 0;
    var mainWindowWidth = 0;
    var mainWindowHeight = 0;
   
    if (!sizeUnits) {
        sizeUnits = "%"; // Default unit is pixels if sizeUnits is not provided
    }
    if (!offsetUnits) {
        offsetUnits = "%"; // Default unit is pixels if sizeUnits is not provided
    }
    
    
    // SIZE
    // Get the dimensions of the main window or screen
    if (sizeRefWindow){
        mainWindowWidth = sizeRefWindow.innerWidth;
        mainWindowHeight = sizeRefWindow.innerHeight;
    } else {
        mainWindowWidth = window.screen.width;
        mainWindowHeight = window.screen.height; 
    }
    
    if (sizeUnits=="px"){ //pixels
        newWindowWidth = widthIn;
        newWindowHeight = heightIn;
    } else if (sizeUnits=="%") { //percent
        // Calculate the size for the new window (sizePercent% of the main window's dimensions)
        if (widthIn>1){
            widthIn=widthIn/100;
        }
        if (heightIn>1){
            heightIn=heightIn/100;
        }
        newWindowWidth = Math.round(mainWindowWidth * widthIn);
        newWindowHeight = Math.round(mainWindowHeight * heightIn);
    }
     
     // OFFSET POSITION
    
    const leftOffsetCenter = Math.round((mainWindowWidth - newWindowWidth) / 2);
    const topOffsetCenter =  Math.round((mainWindowHeight - newWindowHeight) / 2);
    // If there are no Offset inputs, calculate the position to center the new window
    if (leftOffsetIn){
        if(offsetUnits=="px"){ //pixels
            leftOffset = leftOffsetIn; 
        } else if (offsetUnits=="%") { //percent 
            if (leftOffsetIn>1){
                leftOffsetIn=leftOffsetIn/100;
            }
            leftOffset = Math.round(mainWindowWidth * leftOffsetIn); 
        } else if(offsetUnits=="+px"){ //pixels delta from center
            leftOffset = leftOffsetCenter + leftOffsetIn; 
        } else if (offsetUnits=="+%") { //percent delta from center 
            if (Math.abs(leftOffsetIn)>1){
                leftOffsetIn=leftOffsetIn/100;
            }
            leftOffset = leftOffsetCenter + Math.round(mainWindowWidth * leftOffsetIn); 
        }
    } else {
        leftOffset = leftOffsetCenter;
    }    
    if (topOffsetIn) { 
        if(offsetUnits=="px"){ //pixels
            topOffset = topOffsetIn; 
        } else if (offsetUnits=="%") { //percent
            if (topOffsetIn>1){
                topOffsetIn=topOffsetIn/100;
            }
            topOffset = Math.round(mainWindowHeight * topOffsetIn); 
        } else if(offsetUnits=="+px"){ //pixels delta from center
            topOffset = topOffsetCenter + topOffsetIn; 
        } else if (offsetUnits=="+%") { //percent delta from center 
            if (Math.abs(topOffsetIn)>1){
                topOffsetIn=topOffsetIn/100;
            }
            topOffset = topOffsetCenter + Math.round(mainWindowHeight * topOffsetIn);  
        }
    } else {
        topOffset = topOffsetCenter;
    }
  
  
    // Open a new window with the specified size and centered position
    var newWindow = window.open('', '_blank', 'width=' + newWindowWidth + ',height=' + newWindowHeight + ',left=' + leftOffset + ',top=' + topOffset);

 
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




// gets the value of a css property as originally defined in the css file (original value even if later overridden in js)
function getOriginalStyle(selector, property) {
	// example use:
	// const originalDisplay2 = getOriginalStyle('.trialexpandInputsAddButton', 'display');
	// console.log(originalDisplay2); // Will output the display style like "flex"
	// To check actual current style, use:	console.log(window.getComputedStyle(dragItemBtns[0]).display);
    for (const sheet of document.styleSheets) {
        for (const rule of sheet.cssRules || sheet.rules) {
            if (rule.selectorText === selector) {
                return rule.style[property] || null;
            }
        }
    }
    return null;
}



