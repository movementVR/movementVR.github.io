
function popupTabSetup(newWindow,htmlFileName){ 
    populateTabValues(newWindow,htmlFileName);
    colorInputsSetup(newWindow);
    setInputsWidth(newWindow);
}


function setInputsWidth(newWindow){ 
  //  setInputsWidthCore(newWindow);
    setTimeout(function() {setInputsWidthCore(newWindow);}, 10);
 //   setTimeout(function() {setInputsWidthCore(newWindow);}, 50);
  //  setTimeout(function() {setInputsWidthCore(newWindow);}, 100);
}

function setInputsWidthCore(newWindow){ 
    const addedOffset0=5;
    const addedOffset=10; 
    const addedOffset2=5;
    const addedOffset3=10;
    const addedOffset4=100;
    
    
    newWindow.document.querySelectorAll('.expand-button').forEach(button => {
        button.click();
    });
    
    const inputs = newWindow.document.querySelectorAll('inputs');  
    let maxWidth = 0;
 
    // Finds width
    inputs.forEach(input => { 
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
 
   
    const name = newWindow.document.querySelectorAll('name'); 
    const inputcolumn = newWindow.document.querySelectorAll('inputcolumn'); 
    const figurecolumn = newWindow.document.querySelectorAll('figurecolumn'); 
    const formcontr = newWindow.document.querySelectorAll('.form-control'); 
    const tabcont = newWindow.document.querySelectorAll('.tabcontent'); 
    const overcont = newWindow.document.querySelectorAll('.contentcontainerclass'); 
   // inputcolumn[0].style.width = `${name[0].offsetWidth+maxWidth+addedOffset}px`;
      
    const nameWidth=name[0].offsetWidth;
    const tabcontWidth=tabcont[0].offsetWidth;
    
    inputs.forEach(input => {
        input.style.width = `${maxWidth+addedOffset0}px`;
    }); 
    
    inputcolumn[0].style.width = `${nameWidth+maxWidth+addedOffset}px`;
     
    formcontr[0].style.width = `${nameWidth+maxWidth+addedOffset+addedOffset2}px`;
    
    figurecolumn[0].style.width = `${tabcontWidth- formcontr[0].offsetWidth - addedOffset3}px`;
//    figurecolumn[0].style.height =`${overcont[0].offsetHeight - addedOffset4}px`;
    
    
    const fimg = newWindow.document.querySelectorAll('img');  
    if (fimg.length === 0) { 
        figurecolumn[0].style.backgroundColor='inherit';
    }


    newWindow.document.querySelectorAll('.expand-button').forEach(button => {
        button.click();
    });
    

}




function populateTabValues(newWindow,htmlFileName){   
    
//        const allTrialDesignForms=getAllTrialDesignForms();
        // Populate the current form with stored values
        if (allTrialDesignForms[htmlFileName]) {
            const storedForm = allTrialDesignForms[htmlFileName];
            const currentForm = newWindow.document.forms[0];
            for (let i = 0; i < storedForm.elements.length; i++) {
                const storedElement = storedForm.elements[i];
                const currentElement = currentForm.elements[storedElement.name];
                if (currentElement) { 
                    currentElement.value = storedElement.value;
                }
            }
        }
}

