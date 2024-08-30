

function openOptionsWindow(htmlFileName,htmlFileTab) {  
   //     const windowSizePercent = 0.9;  
  //  var newWindow = createWindow(windowSizePercent,windowSizePercent); 
    /*
        const element = document.querySelector('.trialContainerParent');
    console.log(element);
        const style = window.getComputedStyle(element);
        const widthIn = style.width;
        const heightIn = style.height;
    */
        var newWindow =  createWindow(widthIn,heightIn,'px');   

        robustOnLoad(newWindow,function() {
            populateOptionWindow(newWindow,htmlFileName,htmlFileTab);
        });  
}  


  


function populateOptionWindow(newWindow,htmlFileName,htmlFileTab){ 
        // Populate the new window with content from htmlFileName.html
    baseHtmlFileName='web/builder/popup/tabHtml.html';
        fetch(baseHtmlFileName)
            .then(response => response.text())
            .then(html => {
                newWindow.document.write(html); // loads base html code 
                newWindow.document.title=htmlFileName; // changes the html page title 
             
                // Creates Containers 
                var tabContainer = newWindow.document.createElement("div"); // container for navigation tabs
                tabContainer.id = "input-window-tabcontainer";
                tabContainer.className = "input-subtab-container";                
                var contentContainer = newWindow.document.createElement("div"); //  container to display content
                contentContainer.id = "contentContainer";
                contentContainer.className = "contentcontainerclass";            
                newWindow.document.body.appendChild(tabContainer); // Append the containers to the body of the new window
                newWindow.document.body.appendChild(contentContainer);
                newWindow.document.body.style.overflow = "hidden";
            

                // Includes styles and scripts 
                includeStyle( 'web/builder/popup/tabHtmlStyle.css',newWindow); 
                includeStyle( 'web/builder/popup/trialDesignChildrenStyles.css',newWindow); 
                includeScript( 'web/general/general.js',newWindow); 
                includeScript( 'web/general/general.css',newWindow); 
       
                // Creates tabs             
                const tabsDefinition =allTabsDefinition[htmlFileName] ;  
                let initialTab = htmlFileTab;

                if (initialTab == "") {
                    initialTab = Object.keys(tabsDefinition)[0];
                }; 
            
                createTabs(newWindow,tabsDefinition,initialTab);  
                
                // window adjustments 
                createOKButton(newWindow); // Creates OK button
            
                changeHeightToFitParent(newWindow,'contentcontainerclass'); // Makes the tabcontent scrollable and makes OK final button always visible           

                newWindow.addEventListener('beforeunload', function (event) {
                    trialDesignStoreValues(newWindow);
                }); 
        });
} 
 
 



// Function to create navigation tabs
function createTabs(newWindow,tabsDefinition,initialTab) {  
    const tabContainer = newWindow.document.getElementById('input-window-tabcontainer');
    for (const tabName in tabsDefinition) {
        const button = newWindow.document.createElement('button');
        button.textContent = tabName;
        button.className = 'input-subtab-button';
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
            trialDesignStoreValues(newWindow);        
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
            newWindow.document.getElementById('contentContainer').innerHTML = html;
        
            popupTabSetup(newWindow,htmlFileName);
    
        
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    newWindow.document.querySelectorAll('.input-subtab-button').forEach(button => {
        button.classList.remove('active');
    });
    clickedTab.classList.add('active'); 
    lastClickedHtmlFileName=htmlFileName;
    
}

