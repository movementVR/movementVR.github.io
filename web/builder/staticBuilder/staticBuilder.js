// MAIN INTERFACE FUNCTION: OPENS + SETS UP STATIC BUILDER 
async function openStaticBuilder(block) { 
	 
	// Definition for current popup window (tabs, title)
	const windowDefinition = builderPopupTabsConfig[block.onclick];   

	// Creates and initializes the popup window and waits for it to complete
	const staticBuilderWindow = await openBuilderWindow (
		builderStaticWindowConfig, 		// window config
		'staticBuilder', 				// window json selection
		'static', 						// window elements class specifier
		{ text: windowDefinition.title, // window title 
		  img: windowDefinition.icon }  
	); 
	
	
	// Set up static builder tabs and content
	setupStaticBuilder(staticBuilderWindow, windowDefinition.tabs);
 

    
    
	// Function to create navigation tabs
	async function setupStaticBuilder(staticBuilderWindow, tabsDefinition) { 	 
		const contentContainer = staticBuilderWindow.document.querySelector('.builder .content'); 

		// Tab List = Top Row menu w/ navigation tabs 
		const tablistContainer = createContainer(staticBuilderWindow, contentContainer, 'tablist');
		      
        
		// Creates individual tabs in the tablistContainer and listener to populate content 
        const tabPromises = Object.keys(tabsDefinition).map((tabName) => {
            const tabFileName = tabsDefinition[tabName];
			const button = staticBuilderWindow.document.createElement('button');
			button.textContent = tabName;
			button.className = 'tab';       
            button.id = tabFileName+'_Button';  
			button.addEventListener('click', () => {
				clickTab(staticBuilderWindow,tabFileName);
			});
			tablistContainer.appendChild(button);
            
            // Return the promise from initializeTabContent -> waits for this function
            return initializeTabContent(staticBuilderWindow, tabFileName);
		});  
        
        // Wait for all tab initializations to complete
        await Promise.all(tabPromises); 
        
		//  After all tabs initialized -> Sets up the New Tab Parameters Form
		builderPopupInputsSetup(staticBuilderWindow);
        
        // Clicks on the first tab
        const firstTabName = Object.keys(tabsDefinition)[0]; 
        const firstTabFileName = tabsDefinition[firstTabName]; 
        clickTab(staticBuilderWindow,firstTabFileName); 
        
         
        
        async function initializeTabContent(staticBuilderWindow,tabFileName){              
            // Tab Panels w/ tab content (parameter forms) 
            const tabpanelContainer = createContainer(staticBuilderWindow, contentContainer, 'tabpanel');             
            tabpanelContainer.id = tabFileName+'_Container';  

			// 4) Loads the New Tab HTML Content from file 
			const filePath = builderPaths.builderParametersPath(tabFileName); 
			await loadHTML(filePath, tabpanelContainer, false);   		 
        }


		// Function to handle tab click -> 1) store input values, 2) changes tab selection, 3) changes tab content
		function clickTab(staticBuilderWindow,tabFileName) {  
            
            // 1) "Closes" all the pages except for the clicked tab
            const clickedTabID = tabFileName + '_Container';
            const allTabContentContainers = staticBuilderWindow.document.querySelectorAll('.tabpanel'); 	
            allTabContentContainers.forEach(tabContent => {
                // If the page ID matches the selected tab ID, display it; otherwise, hide it
                tabContent.style.display = (tabContent.id === clickedTabID) ? "flex" : "none";
            });
            
            
			// 2) Selects the New Tab Button 
			// change appearance of the tab in tablistContainer to signal which has been clicked  
            const clickedButtonID = tabFileName + '_Button';  	
            // Get all buttons inside mainWindowTopRowContainer
            const allTabButtons = staticBuilderWindow.document.querySelectorAll('.builder .content .tablist .tab');
            allTabButtons.forEach(button => {
                // If the button ID matches the selected tab ID, add "active" class, otherwise remove it 
                button.classList.toggle('active', button.id === clickedButtonID);
            }); 

  

			// 2) Updates Window internal reference to New Tab  
			//staticBuilderWindow.setAttribute('data-html-file', tabFileName);// stores tabFileName as window attribute

            
		} 

	}
    
     
}



