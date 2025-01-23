// MAIN SCRIPT WITH FUNCTIONS ADDING PLUS BUTTONS TO TRIAL DESIGN WINDOW
// AND THEN MANAGING THE PARADIGM POPUP WINDOW (CREATION AND SETUP,
// THROUGH INTERFACE WITH OTHER FUNCTIONS IN THIS FOLDER)
// Primary script: builderTrialExpand.js
// Secondary script: trialExpand.js


// Function to append the button at the start of each non-empty name element
function addTrialExpandButtons(newWindow,htmlFileName,flagActualButton) {
    const names = newWindow.document.querySelectorAll('name'); // Find all name elements
    names.forEach(nameContainer => {
        if (nameContainer.textContent.trim() !== '') { // Check if name element is not empty
            
            const htmlContent=collectHtmlFromNameContainer(nameContainer) ; // gets the content to be expanded 
            
            // Insert button at the start of the name element
            createPlusButton(newWindow,nameContainer,htmlContent,htmlFileName,flagActualButton);
        }
    });  
}
  
 
  
 
// Function to create a button with a plus sign
function createPlusButton(newWindow,nameContainer,htmlContent,htmlFileName,flagActualButton) { 
    const button = newWindow.document.createElement("span");
    if(flagActualButton){
        button.className = 'trialexpandbtn'; // Add the CSS class to the button
        button.textContent ='+';
        button.onclick = function() {
            builderSaveStoreOptions(newWindow);
            openTrialExpandWindow(newWindow,htmlContent,htmlFileName);
        };
    } else {
        button.className = 'trialexpandbtn-label'; // Add the CSS class to the button
        button.textContent ='1)';        
    }
    nameContainer.insertBefore(button, nameContainer.firstChild);  
}

function collectHtmlFromNameContainer(nameContainer) { 
    let htmlContent = nameContainer.outerHTML; // Start with the current name element's HTML	 
    let nextSibling = nameContainer.nextElementSibling;

    // Loop through siblings until we find another name element or a closing div/inputcolumn
    while (nextSibling && 
          nextSibling.tagName.toLowerCase() !== 'name' && 
          nextSibling.tagName.toLowerCase() !== 'div' && 
          nextSibling.tagName.toLowerCase() !== 'inputcolumn') {
        htmlContent += nextSibling.outerHTML; // Append the sibling's HTML
        nextSibling = nextSibling.nextElementSibling;
    }

    // If the next sibling is a closing </div> or </inputcolumn>, include it
    if (nextSibling && 
        (nextSibling.tagName.toLowerCase() === 'div' || nextSibling.tagName.toLowerCase() === 'inputcolumn')) {
        htmlContent += nextSibling.outerHTML;
    }
  
	 
	htmlContent= transformColorInputsToRGB(htmlContent); 

    return htmlContent;
}

 





/////////////////////////// POPUP /////////////////////////////////

 


function openTrialExpandWindow(newWindow,htmlContent,htmlFileName) { 
    
    const mainPageWidth = document.getElementById('builder_tabID').offsetWidth;  // width of main page container 
    
   
    const pWidth = 90; 
    const pHeight = 80;
    const pLeft = 5;
    const pTop = 10;    
    
    var trialExpandWindow =  createWindow(pWidth,pHeight,'%',pLeft,pTop,'%');
	
    
    // Populate the new window with content 
    robustOnLoad(trialExpandWindow,function() {
        populateTrialExpandWindow(newWindow,trialExpandWindow,htmlContent,htmlFileName);
    });  
}  


  


function populateTrialExpandWindow(newWindow,trialExpandWindow,htmlContent,htmlFileName){ 
        // Populate the new window with content from htmlFileName.html
    
    
    baseHtmlFileName = 'web/builder/trialExpand/trialExpandHtml.html';
    fetch(baseHtmlFileName)
        .then(response => { 
            return response.text(); // Return the text for the next .then()
        })
        .then(html => {            
            trialExpandWindow.document.write(html); // loads base html code  

			// Includes styles and scripts 
			includeStyle( 'web/builder/popup/tabHtmlStyle.css',trialExpandWindow); 
			includeStyle( 'web/builder/popup/trialDesignChildrenStyles.css',trialExpandWindow); 
			includeStyle( 'web/builder/trialExpand/trialExpand.css',trialExpandWindow);  
			includeScript( 'web/builder/trialExpand/trialExpand.js',trialExpandWindow); 
			includeScript( 'web/builder/trialExpand/trialExpandSave.js',trialExpandWindow); 
			includeScript( 'web/general/general.js',trialExpandWindow); 
			includeScript( 'web/general/general.css',trialExpandWindow); 

			// sets window to hide extra content
			trialExpandWindow.document.body.style.overflow = "hidden";   

			// creates empty MAIN CONTAINER
			const trialexpandPopup_contentContainer = createTrialExpandContainers(trialExpandWindow);

			// creates OK BUTTON 
			createOKButton(trialExpandWindow); // Creates OK button
		
			// adds event to save data on unload
			trialExpandWindow.addEventListener('beforeunload', function (event) {
                    trialExpandStoreValues(trialExpandWindow);
					setInputsOpacity(newWindow)
                }); 
		 
			// implements content of MAIN CONTAINER (2 panels: trial blocks and parameter definitions inputs)
			createTrialExpandPopupContent(trialExpandWindow,trialexpandPopup_contentContainer,
										  htmlContent,htmlFileName); 
         
        })
        .catch(error => {
            console.error('Error fetching the HTML file:', error);
        });
 
    
   
} 


function createTrialExpandContainers(trialExpandWindow){         
    
    // Creates Containers 
    var contentContainer = trialExpandWindow.document.createElement("div"); //  container to display content
    contentContainer.id = "trialexpand-contentContainer";
    contentContainer.className = "trialexpandMainContainer";            

    // Append the containers to the body of the new window   
    trialExpandWindow.document.body.appendChild(contentContainer);
    
    return contentContainer;
        
}
 
 
 

