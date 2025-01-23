// This file contains the functions for the copy-pasting of the parameter definition block
// from the main trial builder window to the paradigm pop-uo window (right column)


function populateInheritedInput(inheritedWidthsDataManager,trialExpandWindow,htmlContent,mainOverallParentContainer,inputsItemParentContainer,inheritedInputParentContainer){ 
    
	let [inputContainer,inputContainerInner] = createTrialExpandInputs(trialExpandWindow,htmlContent,inheritedInputParentContainer); 
    inheritedInputWidthSetupAll(trialExpandWindow,inheritedWidthsDataManager,inputsItemParentContainer);
	
}

 
function inheritedInputWidthSetupAll(trialExpandWindow,inheritedWidthsDataManager,singleInputsItemParentContainer = null) {
	const heightOKButton=trialExpandWindow.document.getElementById('button-container').offsetHeight;
	requestAnimationFrame(() => {
        setTimeout(function () {  
			
            const allMainContainerInputs = trialExpandWindow.document.querySelectorAll('.trialexpandMainContainerInputs');
       
            let selectedMainContainerInputs;
            let allItemsInList;
            
            if (singleInputsItemParentContainer == null) {
                selectedMainContainerInputs = allMainContainerInputs[0];
                allItemsInList = selectedMainContainerInputs.querySelectorAll('.trialexpandInputsItemParent');
            
            } else {
				if (!inheritedWidthsDataManager.isEmptyElements()){ 
					selectedMainContainerInputs =singleInputsItemParentContainer.closest('.trialexpandMainContainerInputs');
			 
					allItemsInList=[singleInputsItemParentContainer]; 
				} else {					
                	allItemsInList=[];
				}
			}
 
	 		allItemsInList.forEach(function (inputsItemParentContainer) {

                ///// 0) Variable definition and initialization 
                const inputsWidthOffset = 5; // 5
                const inputcolumnOffset = 10; // 10
                const inputcolumnContainerOffset = 5;
                const tabcontentOffset = 10;
                const nameWidthOffset = 5;
                const mainParentWidthOffset = 10;
                
                const inheritedInputParentContainer = inputsItemParentContainer.querySelector('.trialexpandInputsItemInheritedInputs');
                const inputContainer = inputsItemParentContainer.querySelector('.trialexpandInputsItemInheritedInputs-OuterContainer');
                const inputContainerInner = inputsItemParentContainer.querySelector('.trialexpandInputsItemInheritedInputs-InnerContainer');

                ///// 1) Gets previously computed values if available
                let nameWidthPre = NaN;
                let inputsWidthPre = NaN;

                // Check if dataManager is empty (i.e., it's the first element)
                if (!inheritedWidthsDataManager.isEmptyElements()) { 
                    // Use the stored values from inheritedWidthsDataManager for subsequent elements
                    nameWidthPre = inheritedWidthsDataManager.getNameWidth();
                    inputsWidthPre = inheritedWidthsDataManager.getInputsWidth();   
                }  		
			 
				
				 ///// 2) Sets widths of name/inputs elements (computes and stores new widths if appropriate) 
                const inputcolumn_inputs = inputContainer.querySelectorAll('inputs'); 
                const inputsWidth = findSetMaxInputsWidthTrialExpand(inputcolumn_inputs, inputsWidthOffset, inputsWidthPre);
                const inputcolumn_names = inputContainer.querySelectorAll('name, namenote, subname');
               
			 
				
				const nameWidth = findSetMaxInputsWidthTrialExpand(inputcolumn_names, nameWidthOffset, nameWidthPre);
 				// if this is the first element, it stores the widths 
                if (inheritedWidthsDataManager.isEmptyElements()) {
                    inheritedWidthsDataManager.setWidths(nameWidth, inputsWidth); 
                }  
                
                 
				///// 3A) Sets widths of other elements - Part of inputcolumn 
                const tabcontent = inputContainer.querySelectorAll('.tabcontent'); // overall container  
                const inputcolumnContainer = inputContainer.querySelectorAll('.form-control'); // container for inputcolumn alone       
                const inputcolumn = inputContainer.querySelectorAll('inputcolumn'); // inputcolumn 
                const inputcolumn_trialexpandbtn = inputContainer.querySelectorAll('.trialexpandbtn, .trialexpandbtn-label');
                const figurecolumn = inputContainer.querySelectorAll('figurecolumn');
               
				const inputcolumnWidth = nameWidth + inputsWidth + inputcolumnOffset;
                inputcolumn[0].style.width = `${inputcolumnWidth}px`;
                const inputcolumContainerWidth = inputcolumnWidth + inputcolumnContainerOffset; 
                inputcolumnContainer[0].style.width = `${inputcolumContainerWidth}px`;
                figurecolumn[0].style.width = `${0}px`;
                const tabcontentWidth = inputcolumContainerWidth + tabcontentOffset;
				tabcontent[0].style.width = `${tabcontentWidth}px`;
                inputContainer.style.width = `${tabcontentWidth}px`;
				
				
				///// 3B) Sets widths of other elements - Trial Expand Containers. Stores values upon first call
               // const originalInheritedInputWidth = inheritedInputParentContainer.offsetWidth;
                //const originalInputsItemParentWidth = inputsItemParentContainer.offsetWidth;
				let originalInheritedInputWidth;
                let originalInputsItemParentWidth; 
                if (inheritedWidthsDataManager.isEmptyOriginal()) {
					originalInheritedInputWidth = inheritedInputParentContainer.offsetWidth;
					originalInputsItemParentWidth = inputsItemParentContainer.offsetWidth; 
                    inheritedWidthsDataManager.setOriginal(originalInheritedInputWidth, 
														   originalInputsItemParentWidth); 
                } else {
                    originalInheritedInputWidth = inheritedWidthsDataManager.getOriginalInherited();
                    originalInputsItemParentWidth = inheritedWidthsDataManager.getOriginalItemParent();  
				} 
				
				
                const newInheritedInputWidth = tabcontentWidth;  
                inheritedInputParentContainer.style.width = `${newInheritedInputWidth}px`; 
                const updatedInputsItemParentWidth = originalInputsItemParentWidth + (newInheritedInputWidth - originalInheritedInputWidth);
				inputsItemParentContainer.style.width = `${updatedInputsItemParentWidth}px`;
				 
			  
				
				///// 4) During the main setup, updates window and main container sizes  
				if (inheritedWidthsDataManager.isEmptyParent()) {  
                    const originalMainParentWidth = selectedMainContainerInputs.offsetWidth;
                    const originalWindowWidth = trialExpandWindow.innerWidth;
                    const blockParentContainerWidth = trialExpandWindow.document.querySelector('.trialexpandMainContainerBlocks').offsetWidth;
					
					/////// !!!!
					const computedContainerOffsetWidth = (newInheritedInputWidth - originalInheritedInputWidth);
             
                    var updatedMainParentWidth = originalMainParentWidth + computedContainerOffsetWidth;
                    var updatedMainWindowWidth = originalWindowWidth;
                    if ((blockParentContainerWidth + updatedMainParentWidth) < originalWindowWidth) {
                        updatedMainWindowWidth = blockParentContainerWidth + updatedMainParentWidth;
                    } else {
                        updatedMainParentWidth = updatedMainWindowWidth - blockParentContainerWidth;
                    }
					var updatedOverallMainParentWidth = updatedMainWindowWidth + mainParentWidthOffset;
                    const windowWidthOffset = 2 * (trialExpandWindow.outerWidth - trialExpandWindow.innerWidth);
					updatedMainWindowWidth=updatedMainWindowWidth + mainParentWidthOffset + windowWidthOffset;
					const updatedMainWindowHeight = trialExpandWindow.innerHeight;
					const updatedMainParentHeight = updatedMainWindowHeight - 100 - heightOKButton;
					    
					// Stores sizes 
					inheritedWidthsDataManager.setParentSize(updatedMainParentWidth, updatedMainParentHeight); 
					
					
					//updates window and blocks container 
                    trialExpandWindow.document.querySelector('.trialexpandMainContainer').style.width = `${updatedOverallMainParentWidth}px`;
                    trialExpandWindow.resizeTo(updatedMainWindowWidth,updatedMainWindowHeight);
                    trialExpandWindow.document.querySelector('.trialexpandMainContainerBlocks').style.height = `${updatedMainParentHeight}px`;
                
					
				} 
				
				
                ///// 5) If it's the first item in the list, update the title row + current inputs container as well
	   			if (inputsItemParentContainer === selectedMainContainerInputs.querySelectorAll('.trialexpandInputsItemParent')[0]) { 
						 
					//CONTAINER 
					
                    const updatedMainParentWidth = inheritedWidthsDataManager.getParentWidth();  
                    const updatedMainParentHeight = inheritedWidthsDataManager.getParentHeight();  
					selectedMainContainerInputs.style.width = `${updatedMainParentWidth}px`;
					selectedMainContainerInputs.style.height = `${updatedMainParentHeight}px`; 

					// TITLE ELEMENT
					const allInputsChildrenElements = inputsItemParentContainer.querySelectorAll('.trialexpandInputsItem');
                    const inheritedElementIndex = Array.prototype.indexOf.call(allInputsChildrenElements, inheritedInputParentContainer);

					const titlesParentContainer = selectedMainContainerInputs.querySelector('.trialexpandInputsTitleParent');
                    const allTitlesChildrenElements = titlesParentContainer.querySelectorAll('.trialexpandInputsTitle');
                    const inheritedElementTitle = allTitlesChildrenElements[inheritedElementIndex];

                    inheritedElementTitle.style.width = `${newInheritedInputWidth}px`;
                    titlesParentContainer.style.width = `${updatedInputsItemParentWidth}px`; 
					
							
						
				}
  
				 
            });

        }, 50);
    });
}
  
 
// Function to create navigation tabs
function createTrialExpandInputs(trialExpandWindow,htmlContent,inheritedInputParentContainer) {   
    const [inputContainer,inputContainerInner] = createTrialExpandInputsWrapper(trialExpandWindow,inheritedInputParentContainer); 	 
	inputContainerInner.innerHTML = htmlContent;  
    return [inputContainer,inputContainerInner];
}

function createTrialExpandInputsWrapper(trialExpandWindow,inheritedInputParentContainer){
    let form = document.createElement('form'); // Create the form element
    form.className = 'tabcontent';
    let formControlDiv = document.createElement('div');        // Create the div with class 'form-control'
    formControlDiv.className = 'form-control';
    let inputColumn = document.createElement('inputcolumn');   // Create the inputcolumn element
    formControlDiv.appendChild(inputColumn);        // Append inputColumn to the form control div
    let figureColumn = document.createElement('figurecolumn');  // Create the figurecolumn element 
    form.appendChild(formControlDiv);     // Append formControlDiv and figureColumn to the form
    form.appendChild(figureColumn);
        
    let inputContainer =  document.createElement('div'); 
    inputContainer.className = "trialexpandInputsItemInheritedInputs-OuterContainer"; 
    inheritedInputParentContainer.appendChild(inputContainer); 
    inputContainer.appendChild(form); 
    
    let inputContainerInner =  document.createElement('div'); 
    inputContainerInner.className = "trialexpandInputsItemInheritedInputs-InnerContainer"; 
    inputColumn.appendChild(inputContainerInner);
    
    return [inputContainer,inputContainerInner];
}



function findSetMaxInputsWidthTrialExpand(inputcolumn_Elements,widthOffset,widthPre){      
    // finds inputs max 
    let maxWidth = 0; 
    // Finds width
    inputcolumn_Elements.forEach(input => {  
        // Remove right margin from the last input element of each <inputs> container
        const lastInputElement = input.children[input.children.length - 1]; 
        if (lastInputElement) {
            lastInputElement.style.marginRight = '0';             
        }
        
        // computes the max width  
        let originalWidth = input.offsetWidth;  
        input.style.width = 'auto';          
        let inputWidth = input.offsetWidth;  
        if (inputWidth > originalWidth) {
            inputWidth = originalWidth;   
        }
        if (inputWidth > maxWidth) {
            maxWidth = inputWidth;   
        }
    }); 
 
    let actualWidth; 
    if (isNaN(widthPre)){
        actualWidth = maxWidth+widthOffset; 
    }else{
        actualWidth=widthPre; 
    }
     
    
    inputcolumn_Elements.forEach(input => {
        input.style.width = `${actualWidth}px`;
        input.style.marginTop='2px';
        input.style.marginBottom='2px';
        input.style.paddingTop='0px'; 
    });   
    return actualWidth;
}




