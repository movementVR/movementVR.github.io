

function openOptionsWindow(htmlFileName,htmlFileTab,windowTitleText,windowTitleImage) {  
        var newWindow =  createWindow(widthIn,heightIn,'px',-5,-5,'+%');   

        robustOnLoad(newWindow,function() {
            populateOptionWindow(newWindow,htmlFileName,htmlFileTab,windowTitleText,windowTitleImage);
        });  
}  


  


function populateOptionWindow(newWindow,htmlFileName,htmlFileTab,windowTitleText,windowTitleImage){ 
        // Populate the new window with content from htmlFileName.html
    baseHtmlFileName='web/builder/popup/tabHtml.html';
        fetch(baseHtmlFileName)
            .then(response => response.text())
            .then(html => {
                newWindow.document.write(html); // loads base html code 
             
                // Creates Containers 
			 	var titleContainer = newWindow.document.createElement("div"); // container for navigation tabs
                titleContainer.id = "builderPopupTitleContainer";
                titleContainer.className = "builderPopup-title-container"; 
                var tabContainer = newWindow.document.createElement("div"); // container for navigation tabs
                tabContainer.id = "builderPopupTabContainer";
                tabContainer.className = "builderPopup-tabs-container";                
                var contentContainer = newWindow.document.createElement("div"); //  container to display content
                contentContainer.id = "builderPopupContentContainer";
                contentContainer.className = "builderPopup-content-container";    
			
			    // Append the containers to the body of the new window
                newWindow.document.body.appendChild(titleContainer);                    
                newWindow.document.body.appendChild(tabContainer);
			    newWindow.document.body.appendChild(contentContainer);
                newWindow.document.body.style.overflow = "hidden";
                newWindow.document.body.style.marginTop = "0px";
            

                // Includes styles and scripts 
                includeStyle( 'web/builder/popup/builderPopup.css',newWindow); 
                includeStyle( 'web/builder/popup/builderPopupInputs.css',newWindow); 
                includeScript( 'web/general/general.js',newWindow); 
                includeScript( 'web/general/general.css',newWindow); 
       
                // Creates tabs             
                const tabsDefinition =allTabsDefinition[htmlFileName] ;  
                let initialTab = htmlFileTab;

                if (initialTab == "") {
                    initialTab = Object.keys(tabsDefinition)[0];
                }; 
            
                createPopupTitle(newWindow,windowTitleText,windowTitleImage); 
                createTabs(newWindow,tabsDefinition,initialTab);  
                
                // window adjustments 
                createOKButton(newWindow); // Creates OK button
            
                changeHeightToFitParent(newWindow,'builderPopup-content-container'); // Makes the tabcontent scrollable and makes OK final button always visible           

                newWindow.addEventListener('beforeunload', function (event) {
                    builderSaveStoreOptions(newWindow);
                }); 
        });
} 
 
 

// Function to create popup title, above the tabs
function createPopupTitle(newWindow,windowTitleText,windowTitleImage) {   
	// Actual window title
	newWindow.document.title=windowTitleText; // changes the popup window title  
	
	// Title row in window content with title 
    const titleContainer = newWindow.document.getElementById('builderPopupTitleContainer'); 
	
	//// Title row Image
	if(windowTitleImage && windowTitleImage!=""){
		const titleRowImg = newWindow.document.createElement("img");
		titleRowImg.src = windowTitleImage; 
		titleRowImg.className = "builderPopup-title-image";
		titleContainer.appendChild(titleRowImg); 
	}
	
	//// Title row Text 
	const titleRowText = document.createElement("span");
	titleRowText.textContent = windowTitleText;
	titleRowText.className = "builderPopup-title-text";   
	titleContainer.appendChild(titleRowText);
	
}

// Function to create navigation tabs
function createTabs(newWindow,tabsDefinition,initialTab) {   
    const tabContainer = newWindow.document.getElementById('builderPopupTabContainer');
    for (const tabName in tabsDefinition) {
        const button = newWindow.document.createElement('button');
        button.textContent = tabName;
        button.className = 'builderPopup-tabs-button';
        button.addEventListener('click', () => clickTab(newWindow,button,tabsDefinition[tabName],false));
        tabContainer.appendChild(button);
 
        if (tabName == initialTab){ 
            clickTab(newWindow,button,tabsDefinition[tabName],true);
        }
    }  
}
 

// Function to fetch and display content
function clickTab(newWindow,clickedTab,htmlFileName,flagNewWindow) {  
    
    if (flagNewWindow==false){
            builderSaveStoreOptions(newWindow);        
    }
    
    const folderName = "web/builder/parameters";
    const htmlFile = `${folderName}/${htmlFileName}.html`;
    fetch(htmlFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            newWindow.document.getElementById('builderPopupContentContainer').innerHTML = html;
        
            popupTabSetup(newWindow,htmlFileName,true);
    
        
        }) 
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    newWindow.document.querySelectorAll('.builderPopup-tabs-button').forEach(button => {
        button.classList.remove('active');
    });
    clickedTab.classList.add('active'); 
    lastClickedHtmlFileName=htmlFileName;
    
}

