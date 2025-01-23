// Script with functions handling Add New Item - Plus Button Press Event 

/////////// EVENT BEHAVIORS: ADD ITEM TO LIST ////////////// 
// FUNCTION to create a new list item 
// (creates new item container and calls function to populate new item content)
function handleAddButtonClick(inheritedWidthsDataManager,teWindow,mainOverallParentContainer,inputsListContainer,
                        containerWidths,widthPercents,inputItems,
                        trialTypeManager,populateTrialType_addNewOption,
                        htmlContent) {

    const inputsListContainerX = mainOverallParentContainer.querySelectorAll('.trialexpandInputsItemParent');
    let itemCount = inputsListContainerX.length;
 
    itemCount++; // Increment the item count 

	// Creates Item Container
    const newItem = teWindow.document.createElement('li');
    newItem.classList.add('trialexpandInputsItemParent');
    newItem.draggable = true;
    newItem.style.width = containerWidths;

	
	// Populates Item Content
    createNewInputsItems(inheritedWidthsDataManager,teWindow,mainOverallParentContainer,newItem,inputItems,widthPercents,itemCount,
                         trialTypeManager,populateTrialType_addNewOption,
                         htmlContent); 

	
	
	// for left panel, changes style of the first element to appear 'selected'
	// (because the first right panel is shown as if this item had been clicked)
	if (mainOverallParentContainer.id === "parentContainer-Blocks" && itemCount==1) { 
		handleBlockClickSelectedStyle(newItem);
	}   
	
    
	inputsListContainer.appendChild(newItem); 
	
	
	if (mainOverallParentContainer.classList.contains("trialexpandMainContainerInputs")) { // Right Panel 	
		updateProbabilityTextNumber(mainOverallParentContainer);
		dropdownChangeRightPanel(mainOverallParentContainer,trialTypeManager,false,false);
	} 

    return newItem;
}


// Function to Populate new Item Content 
function createNewInputsItems(inheritedWidthsDataManager,teWindow,mainOverallParentContainer,newItem, configurations, widthPercents, itemCount,
                               trialTypeManager,populateTrialType_addNewOption,
                               htmlContent) { 
	 
	
	// Loop through each key in the configuration object to create and append children elements to the item
	// (children elements are the labels, input numebrs, delete/draag buttons etc... of each item)
    Object.keys(configurations).forEach(name => { 
		// Gets element configuration info
        const [elementType, options] = configurations[name];  
        const className = `trialexpandInputsItem${name}`; 
        const itemWidth = widthPercents[name]; 

		// Creates and sets up the element properties shared across elements: 
		// // Class, Id, Width, Margin
        const element = teWindow.document.createElement(elementType); 
        element.classList.add('trialexpandInputsItem', className);
        element.id = `${className}_${itemCount}`;
        element.style.width = itemWidth[0] + 'px'; 
        element.style.marginRight = itemWidth[1] + 'px';   

		// Creates and sets up the element properties specific to certain elements 
		// // Type and Min
        if (options.type) element.type = options.type;
        if (options.min) element.min = options.min;
		
		// // for TrialTypeDropdown elemnts: calls function to set up element
        if (options.populateTrialType) populateTrialTypeDropdown(teWindow,trialTypeManager.getOptions(), element, populateTrialType_addNewOption);
        
		// // for InheritedInput elements: calls function to set up element 
		if (options.populateInheritedInput) populateInheritedInput(inheritedWidthsDataManager,teWindow,htmlContent,mainOverallParentContainer,newItem,element);
		
		
		// Creates and sets up the element properties that are defined through functions rather than as constants
		// // (certain values are defined as an array of values, 
		// // value is defined by the itemCount number of the item in the list.
		// // EG, number of trials for paradigm phases Blocks list items, take different values )
        if (typeof options.innerHTML === 'function') {
            element.innerHTML = options.innerHTML(itemCount);
        } else if (options.innerHTML) {
            element.innerHTML = options.innerHTML;
        }
        if (typeof options.textContent === 'function') {
            element.textContent = options.textContent(itemCount);
        } else if (options.textContent) {
            element.textContent = options.textContent;
        }
        if (typeof options.value === 'function') {
            element.value = options.value(itemCount);
        } else if (options.value) {
            element.value = options.value;
        } 

		// appends element to item 
        newItem.appendChild(element);
    });
}



