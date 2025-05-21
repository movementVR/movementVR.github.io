/* 
const handler = (event) => myFunction(arg1, arg2, arg3);
myButton.addEventListener('click', handler);

myButton.addEventListener('click', myFunction.bind(null, arg1, arg2, arg3));

BEST OPTION
myButton.addEventListener('click', () => {
  myFunction(arg1, arg2, arg3);
});
*/



// MAIN JS FILE THAT IS CALLED UPON WEBSITE LOADING 
// Creates the main window top row tabs and tabs contents,
//   and handles everything else through other scripts 
 			
// Main window, tabs definition
const mainWindowTabDefinition = [
    { buttonText: 'HOME', htmlFileName: 'home', tooltip: 'Welcome to MovementVR!' },
    { buttonText: 'ABOUT', htmlFileName: 'about', tooltip: 'Features and publications' },
    { buttonText: 'BUILDER', htmlFileName: 'builder', tooltip: 'Design your experiment' }, 
    { buttonText: 'APPLICATION', htmlFileName: 'install', tooltip: 'Install and run the VR App' },
    { buttonText: 'ANALYZER', htmlFileName: 'export', tooltip: 'Export and process your data'  },
    { buttonText: 'LEARN', htmlFileName: 'help', tooltip: 'Instructions and Guides'  }
];
 
 

// MAIN WINDOW - INITIAL CALL
// Prepare main window overall structure (top row, and container for page content),
// then loads home page
document.addEventListener("DOMContentLoaded", async () => {
    generalSetup(); // any general setup script that must be run first 
    
    // OVERALL TOP NAVIGATION MENU 
	// Container 
    const mainWindowTopRowContainer = document.createElement('div');
    mainWindowTopRowContainer.className = 'mainWindow-topRowContainer';
    document.body.appendChild(mainWindowTopRowContainer);
    
    // Logo image 
    const logoImg = document.createElement('img');
    logoImg.src = 'web/img/logo.png'; 
    mainWindowTopRowContainer.appendChild(logoImg); 
	
	// This array will store all json files and call information
	// // starts with general website + popup modal window for Session Configuration Storage
	// // adds individual pages in the loop below
    const jsonFiles = [ 
      { jsonPath: 'web/general/general.json', selection: 'main', htmlContainer: document.body }
    ];
	

    // Tab links -> creates content for each page + gets JSON references + links buttons
    mainWindowTabDefinition.forEach(({ buttonText, htmlFileName, tooltip }) => {
        const button = document.createElement('button');
        button.id = htmlFileName + '_Button'; 
        button.title = tooltip; 
        button.textContent = buttonText;
		button.addEventListener('click', () => {
			mainWindowClickTab(htmlFileName, button);
		});  
        mainWindowTopRowContainer.appendChild(button); 
        mainWindowInitializeTabContent(htmlFileName,jsonFiles);
    });   
	 
    
	// includes general scripts and styles as defined by the .json files   
	await includeFilesFromJson(jsonFiles); 
	
	// post-json-loading setup 
	 setupPage();
    
    // Clicks to open home page  
    document.getElementById('home_Button').click();
     
});

  

// FUNCTION to initialize the tab contents (container, html content, script/style files)     
function mainWindowInitializeTabContent(htmlFileName,jsonFiles){   
    // creates tab content container   
    const tabContentContainer = document.createElement('div');
    tabContentContainer.className = 'mainWindow-tabContentContainer';
    tabContentContainer.id = htmlFileName+'_Container';
    document.body.appendChild(tabContentContainer);
	
	// Stores tab-specific .json file and parameters to array,
	// used to include tab-specific scripts, styles, and HTML content, as defined by the .json files   
    const folderName='web/'+htmlFileName;    
    const jsonPath=folderName+'/'+htmlFileName+'.json';   // tab-specific json   
    jsonFiles.push({ jsonPath, selection: "main", htmlContainer: tabContentContainer }); 
	
} 
 

// FUNCTION to click on a tab (load the content of a main window tab, change tab link style)                           
function mainWindowClickTab0(clickedTab) {   
    
	// 1) "Closes" all the pages except for the clicked tab
	const clickedTabID = clickedTab + '_Container';
	const allTabContentContainers = document.querySelectorAll('.mainWindow-tabContentContainer'); 	
	allTabContentContainers.forEach(tabContent => {
		// If the page ID matches the selected tab ID, display it; otherwise, hide it
		tabContent.style.display = (tabContent.id === clickedTabID) ? "block" : "none";
	});	
	 
	// 2) Scrolls back up - resets view for new page
	window.scrollTo({ top: 0 });
	
	 
	// 3) Resets aspect of top row tab links	
	const clickedButtonID = clickedTab + '_Button';  	
	// Get all buttons inside mainWindowTopRowContainer
    const allTabButtons = document.querySelectorAll('.mainWindow-topRowContainer button'); 	
	allTabButtons.forEach(button => {
		// If the button ID matches the selected tab ID, add "active" class, otherwise remove it 
		button.classList.toggle('active', button.id === clickedButtonID);
	}); 
 
}


function mainWindowClickTab(clickedTab) {
	const clickedTabID = clickedTab + '_Container';
	const allTabContentContainers = document.querySelectorAll('.mainWindow-tabContentContainer');

	allTabContentContainers.forEach(tabContent => {
		if (tabContent.id === clickedTabID) {
			tabContent.classList.add('show');
			setTimeout(() => {
				tabContent.style.opacity = '1';
			}, 10); // Let class apply before transitioning
		} else {
			tabContent.style.opacity = '0';
			setTimeout(() => {
				tabContent.classList.remove('show');
			}, 100); // Match CSS transition duration
		}
	});

	// Scroll up on tab switch
	window.scrollTo({ top: 0 });

	// Update button styles
	const clickedButtonID = clickedTab + '_Button';
	const allTabButtons = document.querySelectorAll('.mainWindow-topRowContainer button');
	allTabButtons.forEach(button => {
		button.classList.toggle('active', button.id === clickedButtonID);
	});
}





                  