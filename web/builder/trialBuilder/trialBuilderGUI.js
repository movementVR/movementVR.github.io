
// Sets up GUI backend behavior through listeners 
function setupGUIListeners(trialBuilderWindow, container){	
	setupClickEvents(container); 
	 	// click + button -> adds element to list
	 	// click 🗑 button -> deletes element 
	
	setupDragEvents(container); 
		// drag list elements -> rearranges their order 
	
	setupDropdownEvents(trialBuilderWindow, container);
		// Left Panel: trial block type dropdowns for each list element
		// Right Panels: Sequence Type dropdown
		// Bottom Row: Overall input source for parameter values (builder, paradigm editor, input file)
	
	setupMutationObservers(trialBuilderWindow, container);
		// Change to DOM nodes/children (add/remove/class change)  
			// --> updates probability label for Right panel (/N, N = number of List Elements)
}
  

////////////////////////////// CLICK EVENTS /////////////////////////////////////
// Sets up Click events (Add & Delete buttons)
function setupClickEvents(container) {
	container.addEventListener('click', (event) => {
		const clickedElement = event.target;  
		// Check class of clicked element and call respective function
		if (clickedElement.matches('.trialbuilderInputsItem.itemDelete')) { 
			deleteElement(clickedElement);  // delete button
		} else if (clickedElement.matches('.trialbuilderInputsTitle.itemAdd')) { 
			addElement(clickedElement);   // add button
		} else if (clickedElement.matches(
			'.trialbuilderInputsItemParent.blocks-panel, .trialbuilderInputsItemElement.blocks-panel, .trialbuilderInputsItem.blocks-panel')) { 
			clickTrialBlock(clickedElement,container); // trial block element in left panel list 
		}	   
	});
	
	// "delete" "🗑" button -> deletes respective list element 
	function deleteElement(clickedElement){  
		// finds list element that is parent to the clicked delete button
		const listElementToDelete = clickedElement.closest('li.trialbuilderInputsItemParent'); 
		listElementToDelete.remove(); // deletes element from list	 
	}	
	
	// "add" "+" button -> adds new element to the list
	function addElement(clickedElement){   
		// finds list that is parent to the clicked add button 
		const listContainer = clickedElement.closest('.trialbuilderPanel')
											.querySelector('ol.trialbuilderInputsListContainer'); 
		// finds the template element 
		const templateItem = listContainer.querySelector('li.trialbuilderInputsItemParent.template');   
		const clonedItem = templateItem.cloneNode(true); // creates a clone of the template element
        // const clonedItem = cloneWithListeners(templateItem); // creates a clone of the template element
		clonedItem.classList.remove('template');
		// adds cloned element to list (at the end but before template)	   
		listContainer.insertBefore(clonedItem, templateItem);  
	} 
	
	 // click trial block element in left panel list -> changes right panel 
	function clickTrialBlock(clickedElement, container){  
		// Selects the clicked Trial Block parent element 
		//	-> calls selectTrialBlock function to handle event 
		const selectedTrialBlockElement = clickedElement.closest('li.trialbuilderInputsItemParent'); 
		selectTrialBlock(selectedTrialBlockElement, container); 	
	}
}
 


 
////////////////////////////// DROPDOWN EVENTS /////////////////////////////////////
// Sets up Dropdown events  
function setupDropdownEvents(trialBuilderWindow, container) {
	// Listen for change events on the container
	container.addEventListener('change', (event) => {
		const dropdownElement = event.target; 
		// Check if the event target is a dropdown with the specified class
		if (dropdownElement.matches('select.trialbuilderInputsItem.itemTrialType.blocks-panel')) {
			trialBlockDropdown(trialBuilderWindow, dropdownElement, container);
		} else if (dropdownElement.matches('select.sequence-type-dropdown')) {
			sequenceTypeDropdown(dropdownElement);  
		}  
	});
	// Function for the Trial Block dropdown (left panel)
	function trialBlockDropdown(trialBuilderWindow, dropdownElement, container) {
		const selectedValue = dropdownElement.value; // Dropdown selected option 
		
		// Adds new dropdown option
		if (selectedValue=='add_option'){			
			 // Asks user input for new trial type name -> sets option value
			const newOptionValue = trialBuilderWindow.prompt("Enter new trial block:",'Trial Name');	 
			newTrialBlockType(trialBuilderWindow, dropdownElement, newOptionValue, container);
		}  
	}	
	
	// Function for the Sequence Type dropdown (right panel)
	function sequenceTypeDropdown(dropdownElement) {
		const sequenceType = dropdownElement.value; // Gets dropdown value -> sequence type
		// adds sequence property to right panel
		const rightPanel = dropdownElement.closest('.trialbuilderPanel.inputs-panel');
		rightPanel.setAttribute('sequence', sequenceType);  		
		// Determine draggable status based on the sequence type
		// True: sequential, blocked, random. False: constant, linear, uniform, normal.
  		const draggable = ['sequential', 'blocked', 'random'].includes(sequenceType); 
		// sets "draggable" property of children List Elements to true or false depending on sequenceType
		const listElements = rightPanel.querySelectorAll('li.trialbuilderInputsItemParent.inputs-panel');
		listElements.forEach(element => {  // loops through List Elements and sets their draggable attribute
	    	element.draggable = draggable; 
		});
	}
	 
}


////////////////////////////// DRAG EVENTS /////////////////////////////////////

// Sets up Dragging events -> click, drag & drop list elements to rearrange order 
function setupDragEvents(container){  
	// Drag Start: 
	// 1) ensures item is a list item
	// 2) tracks + styles dragged item by adding class "dragging" 
	container.addEventListener('dragstart', (event) => {  
		const draggedElement = event.target;
		// Check if the dragged element is an allowed element (class trialbuilderInputsItemParent)
		if (draggedElement && draggedElement.classList.contains('trialbuilderInputsItemParent')) {  
			draggedElement.classList.add('dragging');
			event.dataTransfer.effectAllowed = "move"; // Specifies this is a move/drag operation
		}
	});

	// Drag End: cleans up 'dragging' class from dragged element 
	container.addEventListener('dragend', (event) => {
		const draggedElement = event.target;			
		if (draggedElement && draggedElement.classList.contains('trialbuilderInputsItemParent')) { 
			draggedElement.classList.remove('dragging'); 
		}
	});

	// Drag Over: 
	// 1) ensures we are dragging within list
	// 2) reorders items to reposition dragged item in list according to current mouse position
	container.addEventListener('dragover', (event) => { 

		// gets list ONTO WHICH element is currently being dragged (if any)
		// (event.target for dragover is the "drop target" - i.e., element over which drag is occurring)
		const list = event.target.closest('.trialbuilderInputsListContainer');

		if (list){ // Allow dropping only if: 1) we are dragging over a list ... 
			const draggedElement = list.querySelector('.dragging');
			// ... and 2) the dragged element belongs to this list (no crossover)
			if (draggedElement && draggedElement.parentElement === list) {
				event.preventDefault();  
				// gets "next sibiling" based on current position
				const nextSibiling = getNextSibiling(list, event);  
				// inserts item at correct position 
				if (nextSibiling) { 
					list.insertBefore(draggedElement, nextSibiling);
				} else { // inserts at the end of the list if there are no next sibilings					
					// finds the template element 
					const templateItem = list.querySelector('li.trialbuilderInputsItemParent.template'); 
					// adds to the end of the list - right before template)	   
					list.insertBefore(draggedElement, templateItem);   
				}
			} 
		}


		// Gets next list element wrt current mouse position -> next sibiling for dragged element 
		function getNextSibiling(list, event) {
			const mouseY = event.clientY; // current mouse y position

			// Gets all elements in current list (except the one that is being dragged & the template)
			const listElements = list.querySelectorAll(
							'.trialbuilderInputsItemParent:not(.dragging):not(.template)'); 

			// Initializes closestElement and closestDistance
			let closestElement = null; 
			let closestDistance = Number.POSITIVE_INFINITY; 

			// Loop through list elements to find the closest next sibiling (next = below mouse)
			listElements.forEach((element) => {
				const rect = element.getBoundingClientRect(); // element bounding rectangle  
				const elementCenterY = (rect.top + rect.height / 2); // element center position (vertical) 
				const distance = elementCenterY - mouseY; // Vertical distance mouse - element center

				// 1) distance > 0: Checks that element center is BELOW mouse
				// 2) distance < maxDistance: Checks if element is closer than stored closestElement
				if (distance > 0 && distance < closestDistance) {
					closestDistance = distance;
					closestElement = element;
				}
			}); 
			return closestElement; // returns closest next sibiling, if any
		} 
	}); 
}


 

////////////////////////////// MUTATION OBSERVER (DOM NODE CHANGES) /////////////////////////////////////
// callback whenever there is a change to DOM nodes/children (add/remove/class change...) 
function setupMutationObservers(trialBuilderWindow, container){
	// observer calls target functions (probabilityText) when a DOM change occurs 
	const observer = new MutationObserver((mutationsList) => {  
		probabilityText(trialBuilderWindow, container);
	});

	// Begin observing with options that catch child additions, removals, and subtree modifications.
	observer.observe(container, {
		subtree: true,   // monitors all children, grandchildren, etc... down the hierarchy tree
		childList: true, // detects node changes (add/remove elements) 
		attributes: true, // detect changes in elements attributes as defined by attributeFilter
		attributeFilter: ['class'] // detect changes in elements "class"
	}); 
 
}




 


