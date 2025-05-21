
 

    
    // function checks that all Sequence Types in used Right Panels have been selected 
    function allSequencesSelected(){
    	// Steps through all Left Panel list elements -> checks that right panel sequence type was selected
        const leftPanel = trialBuilderWindow.document.querySelector('.trialbuilderPanel.blocks-panel'); 
        const leftPanelListElements = leftPanel.querySelectorAll('.trialbuilderInputsItemParent:not(.template)'); 	
         for (const element of leftPanelListElements) {  // each element represents a Trial Block (paradigm phase)

            // 1) Parse User Input 
            // Left Panel -> Extracts trial information from left panel phase block
            const trialType = element.querySelector('.trialbuilderInputsItem.itemTrialType').value; 

            // gets Right Panel
            const rightPanelName = 'trialbuilder-right-panel-' + trialType;		  
            const rightPanel = trialBuilderWindow.document.getElementById(rightPanelName); 

            // Right Panel -> Get the selected option from the dropdown menu for this right panel
            const sequenceType = rightPanel.querySelector('#SequenceTypeDropdownMenu').value; 
            console.log(sequenceType);
            if (!sequenceType){
                console.log('aaaa');
                return false;
            }
            
        }
        return true;
    }
