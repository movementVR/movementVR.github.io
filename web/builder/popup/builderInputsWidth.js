
function setInputsWidth(newWindow){  
    
      // setTimeout(function() {setInputsWidthCore(newWindow);}, 50);
    
    // Use requestAnimationFrame to ensure DOM updates are completed before running setInputsWidthCore
    requestAnimationFrame(() => {
        setTimeout(function() {setInputsWidthCore(newWindow);}, 50);
        //setInputsWidthCore(newWindow);  // DOM is now fully updated
    });    
     
}

function setInputsWidthCore(newWindow){ 
    // Structure:
    // tabcontent
    //      form-control -> inputcolumn
    //              name
    //              inputs
    //              (button)
    //      figurecolumn
    
    const tabcontent = newWindow.document.querySelectorAll('.tabcontent');   // overall container 
    const inputcolumnContainer = newWindow.document.querySelectorAll('.form-control');  // container for inputcolumn alone
    const inputcolumn = newWindow.document.querySelectorAll('inputcolumn'); // inputcolumn 
    const inputcolumn_name = newWindow.document.querySelectorAll('name');     
    const inputcolumn_inputs = newWindow.document.querySelectorAll('inputs');  
    const inputcolumn_trialexpandbtn = newWindow.document.querySelectorAll('.trialexpandbtn, .trialexpandbtn-label');
    const figurecolumn = newWindow.document.querySelectorAll('figurecolumn'); 
    
    
    const inputsWidthOffset=5;//5
    const inputcolumnOffset=10; //10
    const inputcolumnContainerOffset=5;
    const tabcontentOffset=10;  
    
    // expands all windows    
    expandCollapse(newWindow);
    
    const inputsWidth = findSetMaxInputsWidth(inputcolumn_inputs,inputsWidthOffset);      // set all inputs width to the max input width and returns this value
    const nameWidth=inputcolumn_name[0].offsetWidth;
    const tabcontentWidth=tabcontent[0].offsetWidth;
    const trialexpandbtnWidth=inputcolumn_trialexpandbtn[0].offsetWidth;        
 
   
    // sets the width of all containers 
    inputcolumn[0].style.width = `${nameWidth+inputsWidth+inputcolumnOffset}px`;     
    inputcolumnContainer[0].style.width = `${inputcolumn[0].offsetWidth+inputcolumnContainerOffset}px`;    
    figurecolumn[0].style.width = `${tabcontentWidth- inputcolumnContainer[0].offsetWidth - tabcontentOffset}px`;
    
    // sets figure column background color to none (inherit) if no figure present 
    const fimg = newWindow.document.querySelectorAll('img');  
    if (fimg.length === 0) { 
        figurecolumn[0].style.backgroundColor='inherit';
    }

    // collapses all windows
    expandCollapse(newWindow);

}


function expandCollapse(newWindow){
    newWindow.document.querySelectorAll('.expand-button').forEach(button => {
        button.click();
    });       
}


function findSetMaxInputsWidth(inputcolumn_inputs,inputsWidthOffset){      
    // finds inputs max 
    let maxWidth = 0; 
    // Finds width
    inputcolumn_inputs.forEach(input => { 
        // Remove right margin from the last input element of each <inputs> container
        const lastInputElement = input.children[input.children.length - 1]; 
        if (lastInputElement) {
            lastInputElement.style.marginRight = '0';             
        }
        
        // computes the max width 
        let originalWidth = input.style.width; 
        input.style.width = 'auto';
        const inputWidth = input.offsetWidth;   
        input.style.width = originalWidth;
        if (inputWidth > maxWidth) {
            maxWidth = inputWidth;
        }
    });
    if (maxWidth>400){
        maxWidth=400;
    }
    if (maxWidth<260){
        maxWidth=260;
    }
    
    inputcolumn_inputs.forEach(input => {
        input.style.width = `${maxWidth+inputsWidthOffset}px`;
    });  
    return maxWidth;
}

