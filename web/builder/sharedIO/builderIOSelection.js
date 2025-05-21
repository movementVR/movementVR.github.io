// SCRIPT HANDLING INPUT SOURCE SELECTION
// - Opens Input Source Modal & Handles User Selection
//      -> Opens selected interface (e.g. Trial Builder...) 
//      -> Handles opacity / other display settings dependent on selected Input Source 
//      -> Handles variable assignment to eventually generate appropriate output


// Interface functions
function builderGetSetInputSource(mode, key, source, paramSourceVar = builderSession.parametersSource){ 
    if (!builderSession.parametersSource ||
       (Object.keys(builderSession.parametersSource).length === 0)) return; // makes sure this has been initialized  
     
    const {keyString, keyInput} = getKeyPair(key);  
    if (keyString && keyString in paramSourceVar) {
        // key exists
        if (mode=="get"){
            return paramSourceVar[keyString];  
        } else {
            builderSession.parametersSource[keyString] = source;   
        }
        
    } else {
        // key does not exist: this is key of a helper-input and we must find hidden-input target -> source  
        let helperInputObject;  
        if (keyInput){  
            helperInputObject = keyInput;
        } else {  
            const hiddenContainer = document.getElementById("forms-hidden-copy"); //  hidden copy of all inputs  
            helperInputObject = hiddenContainer.querySelector(`[name="${keyString}"]`);    // helper object    
        }      
        const targetRefNames = helperInputObject.getAttribute('targetRefId').split('/') 
                                .map(id => document.getElementById(id).name);  // list of names from targetRefId 
        
        if (mode=="get"){
            const firstRefSource = paramSourceVar[targetRefNames[0]]; // assumes all have same source
            return firstRefSource;        
        } else { 
            targetRefNames.forEach(name => {
                builderSession.parametersSource[name] = source;   // sets all hidden-input targets to same source
            });  
        } 
    } 
    
    function getKeyPair(key) {
        let name  = null;
        let elem  = null;

        // Input / textarea nodes → return their name attribute 
        if (key && typeof key === 'object' && key.nodeType === 1) {   // element node
            const tag = key.nodeName.toUpperCase();                     // 'INPUT' / 'TEXTAREA'
            if (tag === 'INPUT' || tag === 'TEXTAREA') { 
                elem = key;
                name = key.getAttribute('name') || null; 
            }
        } else if (typeof key === 'string') { // Plain string → return as-is 
            name = key;        
        }

        return { keyString: name, keyInput: elem };
    }
}
 





// Function opens Input Source Modal & redirects to appropriate interface (Trial Builder, File)
async function builderSelectInputSource(staticBuilderWindow,groupName,parameterNames, groupTitle,htmlContent){  
     
	// Creates single group title string
    const groupTitleString = groupTitle // Array of 3: [window name, tab name, group supername (often null)]
      .filter(el => el && el.trim() !== "")  // Keep only non-null strings with non-blank content
      .join(" → "); // adds → in between non-null strings       
    
    // Gets current input sources stored in builderSession
    // (array with one source per parameter, matching parameterNames array)  
    const currentInputSources = {};
    parameterNames.forEach(key => {  
        currentInputSources[key] = builderGetSetInputSource('get', key);
    });
	
	// Frame for Help Guide for Input Source Selection Modal 
	const inputSourceGuide = staticBuilderWindow.document.getElementById('inputSourceGuide'); 
    
    // Gets and opens Input Source Selection Modal 
    const inputSourcePopupFrame = staticBuilderWindow.document.getElementById('inputsource'); 
    inputSourcePopupFrame.contentWindow.openModal(
        groupTitleString, 
        currentInputSources,
        htmlContent,
        setInputsOpacity,
        handleInputSourceResponse,
		inputSourceGuide
    );   
    
     
    
    async function handleInputSourceResponse(response, selectedParameters, unselectedParameters){
        
        // 1) Updates Parameter Source
        // // 1a) creates "backup" Parameter Source Object
        // //   --> if "cancel" pressed on Trial Builder or File Import, reverts parametersSource to backup 
        builderParametersBackupSource = structuredClone(builderSession.parametersSource);
        
        // // 1b) Saves selected Input Source (response) for current Input Group 
        selectedParameters.forEach(key => {
            builderGetSetInputSource('set', key,response); 
        });             
        
        // // 1c) Updates opacity of Static Builder input fields
        setInputsOpacity(staticBuilderWindow);
        
             
        // 2) Opens Appropriate Interface
        switch(response){
                //parameterNames
            case 'staticBuilder': 
                console.log('static builder'); 
                // -> returns to previous window
                builderIOParametersToEditor(staticBuilderWindow); 
                setInputsOpacity(staticBuilderWindow);  
                break;
				
            case 'trialBuilder': 
                console.log('trial builder'); 
				// disables Static Builder
				const disabledWindowModal = staticBuilderWindow.document.getElementById('disabledwindow'); 
				disabledWindowModal.contentWindow.openModal("Close the Trial Builder window to continue.");
                     
                // temporarily add "u" in front of unselected so that it is not picked up by interface
                unselectedParameters.forEach(key => {
                    builderGetSetInputSource('set', key, "u" + builderGetSetInputSource('get', key)); 
                });   
				
				// opens Trial Builder 
                const trialBuilderWindow = await openTrialBuilder(htmlContent,groupTitle);
                
				
				// adds listener to (maybe) save selection + re-enable Static Builder upon closing Trial Builder 
				trialBuilderWindow.addEventListener('beforeunload', () => {	 
                 
                    // Fixes Source Selection
                    if (!trialBuilderWindow.someSaved){ // Cancel Source Selection
                        // reverts to backup selection if "cancel" or "x' was pressed without ever having saved 
                        builderSession.parametersSource = structuredClone(builderParametersBackupSource); 
                    } else {
                        // removes temporary "u" in front of unselected param
                        unselectedParameters.forEach(key => { 
                            builderGetSetInputSource('set', key,builderGetSetInputSource('get', key,'',builderParametersBackupSource)); 
                        });   
                    }
                    
                    // Updates Static Builder inputs values and opacity
                    builderIOParametersToEditor(staticBuilderWindow); 
                    setInputsOpacity(staticBuilderWindow);  
                    
					disabledWindowModal.contentWindow.closeModal();
				});
				
                break;
				
            case 'csvFile':
                console.log('import file');
                builderIOImportFileInterface(staticBuilderWindow, selectedParameters);
                break;
        }
		 
    }
    
}
 
 
 
/////////////////////// ENABLE / DISABLE BASED ON INPUT SOURCE ////////////////////// 
 

////  BUILDER PARAMETERS  //// 

// function changes inputs opacity in builderPopup
function setInputsOpacity(targetBuilderWindow, enabledFlag = false){ 
	
	const allForms = targetBuilderWindow.document.forms; // all forms across tabs
    for (const currentForm of allForms) {

        // Locate all input and textarea elements 
       /* const inputsAndTextareas = currentForm.querySelectorAll('input, textarea'); */
        const inputsAndTextareas = currentForm.querySelectorAll(
                    'input:not(.hidden-input), textarea:not(.hidden-input)'); 
      /*  const inputsAndTextareas = currentForm.querySelectorAll(
                    'input:not(.helper-input), textarea:not(.helper-input)');   */

        // Set values for each input
        inputsAndTextareas.forEach(input => {  
    	    const inputSource = builderGetSetInputSource('get', input); 
			const currentSource = targetBuilderWindow.windowType; 
			
			const label = currentForm.querySelector(`label[for="${input.id}"]`);
            
			if (enabledFlag || inputSource == currentSource){
				enableInput(input,label,currentSource);
			} else {
				disableInput(input,label,inputSource,currentSource);
			}  	
			
			
        });  	
    }
	 
	
	// // SUPPORT FUNCTIONS // //
    
	// support function: Disable input fields & labels 
	function disableInput(input,label,inputSource,currentSource) {		  
		
		// Disable user interaction  
		input.disabled = true;  
        
		// Sets appearance to Not Active
        input.classList.add("disabled-parameter"); 
		if (label){ 	
            label.classList.add("disabled-parameter");
		}
        
        // Adds Explanation: which interface is currently used + how to change it
		if (currentSource=='staticBuilder'){	
            
            const interfaceNames={
                staticBuilder: "Static Builder interface",
                trialBuilder: "Trial Builder interface",
                csvFile: "imported .csv File"
            };    
            
            const titleString = `Parameter is currently set using ${
                    interfaceNames[inputSource] || inputSource
                    }. Change using ⚙.`;

            input.title = titleString;
            if (label){
                label.title = titleString;  
            }
            
		}
		 
	}

	// support function: Re-enable input fields & labels 
	function enableInput(input,label,currentSource) {
	 
		// Re-enables user interaction   
		input.disabled = false;  
		
		// Sets appearance to Active	 
        input.classList.remove("disabled-parameter");        
		if (label){ 
            label.classList.remove("disabled-parameter");
		}
        
        // Removes message
		input.title = ''; 
        if (label){
            label.title = '';  
        }
		 
	} 
	 
	
} 



 
