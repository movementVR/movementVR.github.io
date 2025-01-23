// SCRIPT CONTAINING THE FUNCTIONS THAT CREATE AND INITIALIZE THE CONTENT OF THE PARADIGM POPUP WINDOW

// FUNCTION  createList
// called to create each list of block/inputs items 
// (the left panel list of paradigm phases blocks, 
// and each right panel list of parameter input values)
// The overall list contaner is already created (inputsListContainer)
function createList(inheritedWidthsDataManager,teWindow,mainOverallParentContainer, inputsListContainer ,
                     configurations, widthPercents,containerOffsetWidth,defaultInputItems,
                     inputItems,trialTypeManager,populateTrialType_addNewOption,
                     htmlContent,panelInitialization) {
	
	// 1) SETUP OF TITLE ROW AND CONTAINER WIDTHS
    // Creates title row
    const titleRow = teWindow.document.createElement('li');
    titleRow.classList.add('trialexpandInputsTitleParent');        
    inputsListContainer.appendChild(titleRow);
    // Sets containers widths and returns their values 
    var containerWidths = setContainerWidths(widthPercents,containerOffsetWidth,mainOverallParentContainer);

	 
	// Populates title row with Title elements
    let lastTitle = createTitles(teWindow,titleRow, configurations, widthPercents, trialTypeManager); // creates row with titles

	// Adds "Add Item" (Plus +) button to title row
    createAddItemButton(inheritedWidthsDataManager,teWindow,titleRow,lastTitle,mainOverallParentContainer,inputsListContainer,
                        containerWidths,widthPercents,inputItems,
                        trialTypeManager,populateTrialType_addNewOption,
                        htmlContent);  // Replace the last title with the button

	// 2) SETUP OF ALL BLOCK/INPUTS ELEMENTS IN LIST
	// Waits until width is properly adjusted  (Use requestAnimationFrame to ensure 
	//          DOM updates are completed before running initializeListInputsItems) 
	//setTimeout(() => {
    //console.log('This runs after a delay of 2 seconds');
	
    requestAnimationFrame(() => { 
        initializeListInputsItems(inheritedWidthsDataManager,teWindow,mainOverallParentContainer,inputsListContainer,
                                  defaultInputItems,containerWidths,widthPercents,inputItems,
                                  trialTypeManager,populateTrialType_addNewOption,
                                  htmlContent,panelInitialization);  // DOM is now fully updated
    });  

    return containerWidths;
 
}


//FUNCTION createTitles
//// creates title elements and Populates title row (already created) with Title elements
function createTitles(teWindow,parent, configurations, widthPercents, trialTypeManager){
    let lastTitle = null; // Variable to keep track of the last created title

    Object.keys(configurations).forEach(name => {
        const textContent = configurations[name];  // Destructure name and text content
        const className = `trialexpandInputsTitle${name}`;  // Dynamically create the class name
        const titleWidth = widthPercents[name];  // Get the width from widthPercents based on the name

        const title = teWindow.document.createElement('span');
        parent.appendChild(title);
        title.innerHTML = textContent;
        title.classList.add('trialexpandInputsTitle', className);
        title.style.width = titleWidth[0] + 'px';  // Set width using  
        title.style.marginRight = titleWidth[1] + 'px';
        
        if (name=='InheritedInputs'){ 
            createSequenceTypeDropdown(teWindow,title,trialTypeManager);
        }
 
        lastTitle = title; // Keep track of the last title
    });
    return lastTitle;

}


// FUNCTION createAddItemButton
// creates "add Item" (plus +) button and adds it to title row
function createAddItemButton(inheritedWidthsDataManager,teWindow,parent,lastTitle,mainOverallParentContainer,inputsListContainer ,
                              containerWidths,widthPercents,inputItems,
                              trialTypeManager,populateTrialType_addNewOption,
                              htmlContent){
    const addItemBtn = teWindow.document.createElement('button');
    addItemBtn.className = 'trialexpandInputsAddButton';

    // Create a span inside the button to control the offset of the '+'
    const plusSign = teWindow.document.createElement('span');
    plusSign.innerText = '+';
    plusSign.className = 'trialexpandInputsAddButton-plusSign'; // Add a class for styling
    addItemBtn.appendChild(plusSign);

    addItemBtn.addEventListener('click', function() {
        handleAddButtonClick(inheritedWidthsDataManager,teWindow,mainOverallParentContainer,inputsListContainer,
                      containerWidths,widthPercents,inputItems,
                      trialTypeManager,populateTrialType_addNewOption,
                      htmlContent);
    });
	

    parent.replaceChild(addItemBtn, lastTitle);  // Replace the last title with the button
}


// FUNCTION inputsListEventListener
// adds event listener to the list container 
function inputsListEventListener(configurations, inputsListContainer) {
    configurations.forEach(config => {
        const [eventName, eventFunction, allowedTargets, ...extraInputs] = config; 
        inputsListContainer.addEventListener(eventName, function(event) {
            eventFunction(event, allowedTargets, ...extraInputs);
        });
    });
}



// FUNCTION setContainerWidths
// Computes width of containers based on definitions and fixed values like scroll bar
// Sets width of parent container and title container, and returns width to be used by list items 
function setContainerWidths(widthPercents,containerOffsetWidth,mainOverallParentContainer){
     

    const scrollbarWidth=50;   
    const totalWidthBase = Object.values(widthPercents)
        .flat()  // Flattens the array of arrays into a single array
        .reduce((sum, value) => sum + value, 0); // Sums all values 


    const totalWidth = totalWidthBase + containerOffsetWidth + 'px';
    const totalWidthWithScroll = totalWidthBase + containerOffsetWidth + scrollbarWidth + 'px';

    // Set the width for the relevant elements
    const titleParent = mainOverallParentContainer.querySelector('.trialexpandInputsTitleParent');	
 
    titleParent.style.width = totalWidth;
	mainOverallParentContainer.style.width = totalWidthWithScroll;
	 
    return totalWidth; 
}


// FUNCTION THAT COMPUTES STEP 2) SETUP OF ALL BLOCK/INPUTS ELEMENTS IN LIST
// (called after the container has been initialized)
function initializeListInputsItems(inheritedWidthsDataManager,teWindow,mainOverallParentContainer,inputsListContainer,
                                    defaultInputItems,containerWidths,widthPercents,inputItems,
                                    trialTypeManager,populateTrialType_addNewOption,
                                    htmlContent,panelInitialization){ 
	
	// flag that is true for right panels, false for left panel
	const flagRightPanel = mainOverallParentContainer.classList.contains("trialexpandMainContainerInputs"); 
	
	// Defines list of initial elements 
	//    for LEFT PANEL <-- checks if there are previous configurations we should use, or if we use the default
	//    for RIGHT PANEL <-- set to default, because main initialization occurs via trialExpandInputOptions.js
	//    						function dropdownChangeRightPanel, called at the end of this function)
	var initialInputItems;
	if (!flagRightPanel && panelInitialization){   //LEFT PANEL if panelInitialization
		initialInputItems = panelInitialization;
	} else { //RIGHT PANEL or LEFT PANEL if no panelInitialization
		initialInputItems = defaultInputItems;
	} 	
	
    // Creates all the elements in (initial) list
	// // // Loop through each element in initialInputItems to initialize list
    initialInputItems.forEach(item => {  
		// Creates the list element (Block or Input)
        let newItem = handleAddButtonClick(inheritedWidthsDataManager,teWindow,mainOverallParentContainer,inputsListContainer,
                                    containerWidths,widthPercents,inputItems,
                                    trialTypeManager,populateTrialType_addNewOption,
                                    htmlContent);  // creates new item in list  

        //  For each key in that item (TrialType, Repeats, etc.), sets the input value to the specified initial value
		// // // Loop through each key (TrialType, Repeats, etc.) in current List Block/Input "item"
        Object.keys(item).forEach(key => {  
			// Gets Child Element corresponding to current Key
            let childElement = newItem.querySelector(`.trialexpandInputsItem${key}`); // child element of specified class
            if (childElement) { 
                // Sets value of numerical or "INPUT" types
				// // If it's a number input type or something that accepts innerHTML/textContent
                if (childElement.type === 'number' || childElement.tagName === 'INPUT') {
                    childElement.value = item[key];  // For input elements (use value instead of innerHTML/textContent)
                } 
				
				// Sets value of Dropdown types
                // // If it's a select dropdown menu input type
                else if (childElement.tagName === 'SELECT') {
                    let optionToSelect = Array.from(childElement.options).find(option => option.text === item[key]);
                    if (optionToSelect) {
                        childElement.value = optionToSelect.value;  // Select the option specified by the string
                    }
                }
            }
        });
    });
	if (flagRightPanel) { // Right Panel 	
		dropdownChangeRightPanel(mainOverallParentContainer,trialTypeManager,true,panelInitialization);
	}
 
}

 

