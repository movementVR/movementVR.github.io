// DOWNLOAD  /  SAVE/LOAD SESSION  / IMPORT PARAMETERS
/* 
	const configurationInput = {
		configurationType: 'builder'
	};	
	openSessionConfiguration(configurationInput);
 */ 






/*
function handleLoadedConfiguration(loadedConfiguration){
		/// 
		console.log('Loaded Configuration:', loadedConfiguration); 
		// DO SOMETHING HERE
	
}
 */


function openSessionConfiguration(configurationInput = {}, callback=null){	  
	// Parses Configuration Input
	const { 
		configurationType = 'undefined',   // Default values in not passed in input
		configurationData = {} 
	} = configurationInput;
	
    handleLoadedConfiguration = callback;
	console.log(configurationInput);
	console.log(configurationType);
	console.log(configurationData);
	
	
	// Creates new configuration
	let newConfiguration = null; 
	if (configurationData){
		newConfiguration = { 
			configuration: configurationData,   
			date: new Date().toISOString(),
			type: configurationType
		};		
	} 
	
	// Initializes Variables
	const modal = document.querySelector('.config-modal');
	const modalList = document.getElementById('configList'); 
	let configurationTypeName = "";

	// "opens" modal popup window (makes it visible)
	openModal(); 
	
	
	/////// FUNCTIONS TO INITIALIZE AND UPDATE WINDOW / LIST ELEMENTS  ////////// 
	// Modal control functions
	function openModal() {		
		modal.classList.remove('hidden'); 	
		setupTitle();
		setupListeners();
		updateList();
	}

	function closeModal() {
		modal.classList.add('hidden'); 
	}
	
	// Setup Event listeners associated with 'general' window buttons (versus those on each list item)
	function setupListeners(){	
		// SAVE
		modal.querySelector('.save-button').addEventListener('click',clickSaveButton);

		// CLOSE MODAL
		modal.querySelector('.x-close').addEventListener('click', closeModal); 
		modal.querySelector('.close-button').addEventListener('click', closeModal); 
		
		// IMPORT  
		modal.querySelector('.import-button').addEventListener('click', clickImportButton);
		modal.querySelector('.file-input').addEventListener('click', resetLoaded);
		
		// EXPORT-NEW  
		modal.querySelector('.export-button').addEventListener('click', () => { // Export button
				clickExportButton('new');
			});   
		
	}
	
	
	// Refresh the list of saved configurations, sorted with most recent first.
	function updateList() {
		// eliminate modalList elements except empty-list or template 
		const items = modalList.querySelectorAll('.config-item:not(.empty-list):not(.template)');
		items.forEach(item => item.remove());

		// loads configurations from local storage
		const configurations = getConfigsLocalStorage();
		
		// sorts them by date (most recent first)
		const keys = Object.keys(configurations).sort((a, b) => {
			return new Date(configurations[b].date) - new Date(configurations[a].date);
		});
		
		// if there are no configurations, shows "no config..."
		modalList.querySelector('.config-item.empty-list').classList.toggle('hidden', keys.length != 0);
		
		// template
		const template = modalList.querySelector('.config-item.template'); 
		
		// loops through configurations in configurations object
		keys.forEach(name => {
			// Creates item and adds it to the list
			const item = template.cloneNode(true);
			item.classList.remove('template'); 
			modalList.appendChild(item);
			
			// Sets up properties = current configuration 			
			item.querySelector('.config-name span').textContent = name;  // Configuration Name 		
			
			item.querySelector('.config-date span').textContent = 
									new Date(configurations[name].date).toLocaleString(); // date/time display			
			
			const itemLoad = item.querySelector('.config-load');
			itemLoad.addEventListener('click', () => { // Load button
				clickLoadButton(itemLoad,name);
			});  			
			
			item.querySelector('.config-export').addEventListener('click', () => { // Export button
				clickExportButton('local',name);
			});   
			
			item.querySelector('.config-delete').addEventListener('click', () => { // Delete button
				if (confirm(`Delete configuration "${name}"?`)) {
					clickDeleteButton(name);
				}
			}); 

		});
	}
	
	
	function setupTitle(){		
		// Configuration Type name based on configurationType
		if (configurationType=='builder'){
			configurationTypeName="Builder";
			modal.querySelector('.main-title').innerHTML = ` Save / Load ${configurationTypeName} Session`; 
			modal.querySelector('.main-subtitle').innerHTML ='(parameter values & paradigm editor configuration)';
		}
	}
	
	
	// Support Function to get New Configuration name
	function getNewConfigurationName(){		
		// Gets "Name" user input and resets 'configName' element value
		const nameInputElement = document.getElementById('configName');
		const name = nameInputElement.value.trim(); 
		
		// Alerts the user if something is wrong
		if (!name) {
			alert('Please enter a configuration name.');
			return;
		}
		if (!newConfiguration) { 
			alert('No current configuration to save.');
			return;
		} 
	  	const illegalChars = /[\/\\?%*:|"<>]/;  //  illegal characters for file name
	  	if (illegalChars.test(name)) {
			alert('The configuration name contains invalid characters. Please remove / \\ ? % * : | " < >.');
			return;
	  	}
		
		return name;
	}
	
	
	

	
	
	/////// FUNCTIONS TO HANDLE EVENTS  //////////
	
	// "save" button click -> adds configuration to 'configurations' variable and calls saveConfigsLocalStorage
	function clickSaveButton() { 	
		const name = getNewConfigurationName(); // gets the new configuration name from User Input
		
		if(name){
			// Adds new configuration to local storage configurations		
			const configurations = getConfigsLocalStorage();// loads configurations from local storage		
			configurations[name] = newConfiguration;
			saveConfigsLocalStorage(configurations);  // re-stores configurations in local storage

			// updates list
			updateList(); 			
		}
	}

	// "load" button click -> loads selected configuration (if it exists) -> passes it on to handle
	function clickLoadButton(item,name) {
		// 1) gets appropriate configuration from local storage
		const loadedConfiguration = getSelectedConfigurationLocalStorage(name);
		
		if (loadedConfiguration){			
			// 2) handles loading
			handleLoadedConfiguration(loadedConfiguration); 

			// 3) lets user know
			alert('Loaded!'); 
			
			resetLoaded();
			item.classList.add('loaded'); 
		}
		
	}
	
	function resetLoaded(){
		// resets "loaded" in Local Storate list item
		const internalItem = modal.querySelector('.config-load.loaded');
		if(internalItem){
			internalItem.classList.remove('loaded');
		} 
		
		// Resets Import Panel 'Loaded' message 
		modal.querySelector('.import-info').classList.add('hidden');
	}
	 

	// "delete" button click -> deletes selected configuration (if it exists) 
	function clickDeleteButton(name) {		
		const configurations = getConfigsLocalStorage();// (Deletes from local storage by loading configurations...
		if (configurations[name]) {			
			delete configurations[name]; // ...deleting the selected configuration...
			saveConfigsLocalStorage(configurations); //...& re-saving configurations to local storage)
			updateList();
		}
	}
	
	 
	
	
	/////// FUNCTIONS THAT INTERFACE WITH LOCAL STORAGE //////////

	// Get saved configurations from localStorage (or return an empty object) 
	function getConfigsLocalStorage() {
		
		const allConfigs = JSON.parse(localStorage.getItem('config')); //loads variable with all configurations
		console.log("Local Storage 'config' variable: ", allConfigs);
		
		// checks if any configuration of configurationType exist
		if (allConfigs && allConfigs[configurationType]){  			
			const configurations = allConfigs[configurationType]; // selected Configurations for configurationType
			return configurations; 
		} else {
    		return {}; //otherwise returns empty
		}
	}
	
	// Interface to get specific configuration by name
	function getSelectedConfigurationLocalStorage(name){			
		// 1) gets configurations variable from local storage
		const configurations = getConfigsLocalStorage();

		// 2) extracts selected configuration if it exists  
		const loadedConfiguration = configurations[name] ? configurations[name].configuration : null; 
		if (!loadedConfiguration) { // If the configuration doesn't exist, show an alert and exit
			alert('Selected configuration not found in storage. It may have been deleted.');
			return;
		}
		
		return loadedConfiguration;
	}
		

	// Save all configurations to localStorage
	function saveConfigsLocalStorage(configurations) {	
		let allConfigs = JSON.parse(localStorage.getItem('config'));	
		if (!allConfigs){
			allConfigs = {};
		}
		allConfigs[configurationType] = configurations;  
		//	allConfigs = {};
		localStorage.setItem('config', JSON.stringify(allConfigs));
	}
	
	
	/////// FUNCTIONS FOR FILE IMPORT / EXPORT //////////
	// function called when the LOAD button in "import" panel is clicked	
	function clickImportButton(){	
		const fileInput = document.getElementById('jsonInput'); // build-in "Choose File" button + file input
		if (!fileInput.files.length) { // checks if user has selected a file yet
			alert('Please select a JSON file first.');
			return;
		}
		
		// reads file selected by user
		const file = fileInput.files[0]; 
		const reader = new FileReader();
		reader.onload = function (event) {
			try {
				const loadedConfiguration = JSON.parse(event.target.result); 
				if (newConfiguration.type !== configurationType){					
					alert(`Error - loaded file is not a ${configurationTypeName} configuration file`);
				}
				
				// Shows message 'Loaded!' (GUI and alert)
				resetLoaded();
				modal.querySelector('.import-info').classList.remove('hidden'); 
				alert('Loaded!'); 
				
				// handles actual loading of loadedConfiguration  
				handleLoadedConfiguration(loadedConfiguration);  
				
			} catch (err) {
				alert('Error - loaded file is not a configuration file');
			}
		};
		reader.readAsText(file);
	}
	
	

    // Export the current JSON data to a file
	function clickExportButton(selection,name){
		let filename='';
		let filedata=null;
		// selection = new (save session) or local (local storage)
		if (selection == 'new'){
			filename = getNewConfigurationName(); // gets the new configuration name from User Input
			filedata = newConfiguration; // configuration passed to the main modal function
		} else if (selection == 'local') {
			filename = name;
			filedata = getSelectedConfigurationLocalStorage(name);
		} 
		//const name = getNewConfigurationName(); // gets the new configuration name from User Input
		if (filename && filedata){
			let jsonData = 'test'; // will store the JSON data
			// Convert JSON data to a string and create a Blob
			const jsonStr = JSON.stringify(jsonData, null, 2);
			const blob = new Blob([jsonStr], { type: 'application/json' });
			const url = URL.createObjectURL(blob);

			// Create a temporary link to trigger the download
			const a = document.createElement('a');
			a.href = url;
			a.download =`${filename}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);				
		}	
	} 
	  
	
}