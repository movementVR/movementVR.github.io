// DEFINITIONS OF STYLE AND CONTENT 
// FOR TWO PANELS OF PARADIGM POPUP WINDOW


function getTrialExpandDefinitions(inputSet) {
    ///////////////////////////////////// VARS BLOCKS PANEL /////////////////////////////////////////    
    var containerOffsetWidth_Blocks = 20; 
    // Define widths for each column
    var widthPercents_Blocks = {
        Order: [15, 0],
        TrialType: [150, 5],
        RepeatsText: [10, 2],
        Repeats: [40, 20],
        Delete: [10, 5],
        Drag: [10, 0]
    };
    // Define titles:   
    var titleConfigs_Blocks = { 
        Order: '',
        TrialType: '<b><span style="font-size: 1.2em;">Trial Blocks</span></b>',
        RepeatsText: '',
        Repeats: '',
        Delete: '',
        Drag: ''
    };
    // Define items in each input in list
    var inputItems_Blocks = {
        Order: ['span', { textContent: (itemCount) => `${itemCount}` }],
        TrialType: ['select', { populateTrialType: true }],
        RepeatsText: ['span', { innerHTML: '<span style="text-align: right; font-size: 1.2em;">&times;</span>' }],
        Repeats: ['input', { type: 'number', min: 1, value: 1 }],
        Delete: ['span', { innerHTML: '&#128465;' }],
        Drag: ['span', { innerHTML: '&#9776;' }]
    };
    // Define Initial items in list
    h = "adaptationParadigm";
    const r1 = Number(loadSpecificInputValue(h, "trialScript,paradigmBaseline"));
    const r2 = Number(loadSpecificInputValue(h, "trialScript,paradigmGradual")) + Number(loadSpecificInputValue(h, "trialScript,paradigmFullPerturbation"));
    const r3 = Number(loadSpecificInputValue(h, "trialScript,paradigmWashout"));
    
    var defaultInputItems_Blocks = [
        {
            TrialType: "Baseline Trial",
            Repeats: r1
        },
        {
            TrialType: "Learning Trial",
            Repeats: r2
        },
        {
            TrialType: "Washout Trial",
            Repeats: r3
        }
    ];
    var containerClass_Blocks = 'trialexpandMainContainerBlocks';

    ///////////////////////////////////// VARS INPUTS PANEL /////////////////////////////////////////
    var containerOffsetWidth_Inputs = 5;
    // Define widths for each column
    var widthPercents_Inputs = {
        Order: [20, 0],
        InheritedInputs: [620, 20],
        Probability: [40, 2],
        ProbabilityText: [10, 20],
        Delete: [10, 10],
        Drag: [10, 10]
    };
    // Define titles:   
    var titleConfigs_Inputs = { 
        Order: '',
        InheritedInputs: '',
        Probability:'<span style="display: inline-block; text-align: center; line-height: 1; ">probability weight</span>',
        ProbabilityText: '',
        Delete: '',
        Drag: ''
    };
    // Define items in each input in list
    var inputItems_Inputs = {
        Order: ['span', { textContent: (itemCount) => `${itemCount}` }],
        InheritedInputs: ['div', { populateInheritedInput: true }],
        Probability: ['input', { type: 'number', min: 0, value: 1 }],
        ProbabilityText:  ['span', { textContent: (itemsTotal) => `/${itemsTotal}` }], 
        Delete: ['span', { innerHTML: '&#128465;' }],
        Drag: ['span', { innerHTML: '&#9776;' }]
    }; 
	var defaultInputItems_Inputs = [
        {
            Probability: 1,
        },
    ];
    var containerClass_Inputs = 'trialexpandMainContainerInputs';

    /////// RETURN /////////

    if (inputSet === "Inputs") {
        return {
            containerOffsetWidth: containerOffsetWidth_Inputs,
            widthPercents: widthPercents_Inputs,
            titleConfigs: titleConfigs_Inputs,
            inputItems: inputItems_Inputs,
            defaultInputItems: defaultInputItems_Inputs,
            mainSubContainerClass: containerClass_Inputs
        };
    } else if (inputSet === "Blocks") {
        return {
            containerOffsetWidth: containerOffsetWidth_Blocks,
            widthPercents: widthPercents_Blocks,
            titleConfigs: titleConfigs_Blocks,
            inputItems: inputItems_Blocks,
            defaultInputItems: defaultInputItems_Blocks,
            mainSubContainerClass: containerClass_Blocks
        };
    } else {
        return null;  // Return null if the inputSet is invalid
    }
}



function  getInheritedWidthsDataManager(){

	const inheritedWidthsDataManager = {
		nameWidth: null,
		inputsWidth: null,
		parentWidth: null,
		parentHeight: null,
		originalInherited: null,
		originalItemParent: null,
		setWidths(nameWidth, inputsWidth) {
			this.nameWidth = nameWidth;
			this.inputsWidth = inputsWidth;
		},
		setParentSize(parentWidth, parentHeight) {
			this.parentWidth = parentWidth;
			this.parentHeight = parentHeight;
		},
		setOriginal(originalInherited, originalItemParent) {
			this.originalInherited = originalInherited;
			this.originalItemParent = originalItemParent;
		},
		getNameWidth() {
			return this.nameWidth;
		},
		getInputsWidth() {
			return this.inputsWidth;
		},
		getParentWidth() {
			return this.parentWidth;
		},
		getParentHeight() {
			return this.parentHeight;
		},
		getOriginalInherited() {
			return this.originalInherited;
		},
		getOriginalItemParent() {
			return this.originalItemParent;
		},
		isEmptyElements() {
			return this.nameWidth === null || this.inputsWidth === null;
		},
		isEmptyParent() {
			return this.parentWidth === null || this.parentHeight === null;
		},
		isEmptyOriginal() {
			return this.originalInherited === null || this.originalItemParent === null;
		} 
	};
	return inheritedWidthsDataManager;
}
    
function getTrialTypeManager(){
    const {
        containerOffsetWidth, 
        widthPercents, 
        titleConfigs, 
        inputItems, 
        defaultInputItems,
        mainSubContainerClass
    } = getTrialExpandDefinitions('Blocks');
    
    const trialTypeManager = {
        options: defaultInputItems.map(item => item.TrialType),
        newOptionDefault: '<add new trial type>',
        newOptionPrompt:'Enter new Trial Type:',
		inputTypes:{								//  N, ChangeN, Prob, Labels,			  Rotate Label							
			 Constant: 	['Constant', 					1,	0,		0,	  [''],						0	],
			 Linear: 	['Linear Interpolation', 		2,  0,      0,    ['first','last'],			1	],
			 Sequential:['Sequential',	 				3,	1,		0,	  ['1','2','3'],			0	],				
			 Random: 	['Random Samples', 				3,	1,		1,	  ['1','2','3'],			0	],	
			 Blocked: 	['Blocked Random Samples', 		3,	1,		0,	  ['1','2','3'],			0	],	
			 Uniform: 	['Uniform Random Values', 		2,  0,      0,    ['min','max'],			1	],
			 Normal: 	['Normal Random Values', 		2,  0,      0,    ['&mu;','&sigma;&sup2;'], 0	],
		},		
        inheritedHTML: '', // Initially empty
        addOption(newOption) {
            this.options.push(newOption);
        },
        getOptions() {
            return this.options;
        },
		getInputTypes(){
			return this.inputTypes;	
		},
        setInheritedHTML(value) {
            this.inheritedHTML = value;
        }, 
        getInheritedHTML() {
            return this.inheritedHTML;
        }
    };
    return trialTypeManager;
}

