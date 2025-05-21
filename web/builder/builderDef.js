function defBuilderPaths() {
	// Paths Definitions 
	const builderPaths = {
		builderIconPath: (imgName) => `web/img/gameobjects/${imgName}.png`,
		builderParametersPath: (fileName) => `web/builder/parameters/${fileName}.html`,
		builderTrialPath: (fileName) => `web/builder/trialBuilder/${fileName}.html`,
		builderHelpModalsPath: (fileName) => `web/builder/modals/${fileName}.html`,
		builderHelpCsvPath: `web/builder/helpAndDefault/parametersHelpDefault.csv`,
		builderDefaultCsvPath: `web/builder/helpAndDefault/parametersHelpDefault.csv`,
	};
	return builderPaths;
}


// Definition for the main builder page
function defBuilderLayout( ) {  
    let baseRow=1;
    const btnsColValue="8 / span 2";
    
    // Row Block - Phase Name
      const blockDataPhaseTitle = [
        { text: "trial sequence:",  title: "", class: "description trial-sequence", gridColumn: 1, gridRow: "1 / span 2" },
        { text: "intertrial", onclick: "intertrial", title: "time interval between trials", class: "name-block trial-sequence", gridColumn: 2, gridRow: "1 / span 2"  },
        { text: "home position", onclick: "home position", title: "return hands to home position", class: "name-block trial-sequence", gridColumn: 3, gridRow: "1 / span 2"  },
        { text: "plate contact", onclick: "plate contact", title: "make contact with the plate", class: "name-block trial-sequence", gridColumn: 4, gridRow: "1 / span 2"  },
        { text: "plate lift", onclick: "plate lift",   title: "lift the plate towards the target", class: "name-block trial-sequence", gridColumn: 5, gridRow: "1 / span 2"  },
        { text: "feedback", onclick: "feedback",   title: "receive feedback on trial success or failure", class: "name-block trial-sequence", gridColumn: 6, gridRow: "1 / span 2"  },
        { text: "break", onclick: "break",  title: "take a resting break", class: "name-block trial-sequence", gridColumn: 7, gridRow: "1 / span 2"  },
       ];         
    
	
      const blockDataPhaseEdit = [
        { text: "edit transitions", onclick: "edit transitions",title: "edit phase transitions", class: "button edit-transitions", gridColumn: btnsColValue, gridRow:   1},
        { text: "edit instructions",onclick: "edit instructions",  title: "edit messages", class: "button edit-instructions", gridColumn: btnsColValue, gridRow:   2},
     ];   
     
    baseRow=baseRow+2; 
    
    //Row Block - Game Objects Names  
    const blockDataGameObjectsName = [ 
		{ text: "reinforcement", onclick: "reinforcement", img: "feedback", title: "feedback message, colors, bird change", class: "name-block game-object", gridColumn:1, gridRow: 1+baseRow },
		{ text: "bird", onclick: "bird", img: "bird", title: "bird appearance, sequence, animations...", class: "name-block game-object", gridColumn: 1, gridRow: 2+baseRow },
		{ text: "target", onclick: "target", img: "target", title: "target position, apperance, success conditions, local feedback", class: "name-block game-object", gridColumn: 1, gridRow: 3+baseRow },
		{ text: "plate", onclick: "plate", img: "plate", title: "plate, grape, stand position, apperance, feedback", class: "name-block game-object", gridColumn: 1, gridRow: 4+baseRow },
		{ text: "hand home", onclick: "hand home", img: "home", title: "hand home position, apperance, conditions", class: "name-block game-object", gridColumn: 1, gridRow: 5+baseRow },
		{ text: "hands & perturbation", onclick: "hands & perturbation", img: "hands", title: "hand tracking and perturbation", class: "name-block game-object", gridColumn: 1, gridRow: 6+baseRow },
		{ text: "workspace", onclick: "workspace", img: "workspace", title: "allowed workspace region for plate", class: "name-block game-object", gridColumn: 1, gridRow: 7+baseRow },
	];

		// Row Block - Game Objects
	const blockDataGameObjects = [       
		{ text: "", onclick: "reinforcement", title: "feedback message, colors, bird change", class: "bar-block", gridColumn: 6, gridRow: 1+baseRow },
		{ text: "", onclick: "bird", title: "bird appearance, sequence, animations...", class: "bar-block", gridColumn: "2 / span 6", gridRow: 2+baseRow },
		{ text: "", onclick: "target", title: "target position, apperance, success conditions, local feedback", class: "bar-block", gridColumn: "2 / span 6", gridRow: 3+baseRow },
		{ text: "", onclick: "plate", title: "plate, grape, stand position, apperance, feedback", class: "bar-block", gridColumn: "4 / span 2", gridRow: 4+baseRow },
		{ text: "", onclick: "hand home", title: "hand home position, apperance, conditions", class: "bar-block", gridColumn: 3, gridRow: 5+baseRow },
		{ text: "", onclick: "hands & perturbation", title: "hand tracking and perturbation", class: "bar-block", gridColumn: "2 / span 6", gridRow: 6+baseRow },
		{ text: "", onclick: "workspace", title: "allowed workspace region for plate", class: "bar-block", gridColumn: "2 / span 6", gridRow: 7+baseRow },
	];
     
    
    // Grid Blocks
    const nCol=7;
    const nRows=10; 
    const blockDashedGrid = [ 
        { text: "", onclick: "", title: "", class: "line dashedHorizontal", gridColumn: `1 / span ${nCol}`, gridRow: 1+baseRow },
        { text: "", onclick: "", title: "", class: "line dashedHorizontal", gridColumn: `1 / span ${nCol}`, gridRow: 2+baseRow },
        { text: "", onclick: "", title: "", class: "line dashedHorizontal", gridColumn: `1 / span ${nCol}`, gridRow: 3+baseRow },
        { text: "", onclick: "", title: "", class: "line dashedHorizontal", gridColumn: `1 / span ${nCol}`, gridRow: 4+baseRow },
        { text: "", onclick: "", title: "", class: "line dashedHorizontal", gridColumn: `1 / span ${nCol}`, gridRow: 5+baseRow },
        { text: "", onclick: "", title: "", class: "line dashedHorizontal", gridColumn: `1 / span ${nCol}`, gridRow: 6+baseRow },
        { text: "", onclick: "", title: "", class: "line dashedHorizontal", gridColumn: `1 / span ${nCol}`, gridRow: 7+baseRow },
      ];
    
     const blockSolidGrid = [ 
        { text: "", onclick: "", title: "", class: "line solidVertical", gridColumn: 1, gridRow: `1 / span ${nRows}`},
        { text: "", onclick: "", title: "", class: "line solidVertical", gridColumn: 2, gridRow: `1 / span ${nRows}`},
        { text: "", onclick: "", title: "", class: "line solidVertical", gridColumn: 3, gridRow: `1 / span ${nRows}`},
        { text: "", onclick: "", title: "", class: "line solidVertical", gridColumn: 4, gridRow: `1 / span ${nRows}`},
        { text: "", onclick: "", title: "", class: "line solidVertical", gridColumn: 5, gridRow: `1 / span ${nRows}`},
        { text: "", onclick: "", title: "", class: "line solidVertical", gridColumn: 6, gridRow: `1 / span ${nRows}`},
        { text: "", onclick: "", title: "", class: "line solidVertical", gridColumn: 7, gridRow: `1 / span ${nRows}`},
        { text: "", onclick: "", title: "", class: "line solidHorizontal", gridColumn: `1 / span ${nCol+2}`, gridRow: "1 / span 2"},  
      ];
      
    baseRow=4;  
    // Quick Links
      const blockDataQuickLinks = [
          { text: "quick links:",  title: "", class: "description quick-links", gridColumn: 8, gridRow: baseRow },        
          { text: "reaching task", onclick: "reaching task",title: "basic parameters of the task", class: "button quick-links", gridColumn: btnsColValue, gridRow: baseRow+1},
          { text: "motor adaptation", onclick: "motor adaptation",title: "adaptation perturbation and paradigm", class: "button quick-links", gridColumn: btnsColValue, gridRow: baseRow+2},
          { text: "reinforcement", onclick: "reinforcement", title: "feedback for reinforcement learning", class: "button quick-links", gridColumn: btnsColValue, gridRow: baseRow+3},
          { text: "paradigm", onclick: "paradigm",title: "paradigm start / end and adaptation phases", class: "button quick-links", gridColumn: btnsColValue, gridRow: baseRow+4},          
          { text: "kinematics", onclick: "kinematics",title: "hand tracking and data recording", class: "button quick-links", gridColumn: btnsColValue, gridRow: baseRow+5},
       ];         
    
     
    const builderConfig = [ ...blockSolidGrid, ...blockDashedGrid,
                       ...blockDataPhaseTitle,  ...blockDataPhaseEdit,
                       ...blockDataGameObjects, ...blockDataGameObjectsName,
                       ...blockDataQuickLinks,
                      ]; 

 	return builderConfig;
}
 


// Definition for the builder popup window tabs
function defBuilderPopupTabs( ) { 
	// Central variable for image path
	const baseImgPath = 'web/img/gameobjects/';   
	
	// Tabs Definitions 
	const builderPopupTabsConfig = {
			"edit transitions": {   /// TOP ROW -> EDIT TRANSITIONS
				title: "Edit Transitions",
				icon: ``,
				tabs: {
                    "1 Intertrial": 'flowIntertrial',
                    "2 Home Position": 'flowHome', 
                    "3 Plate Contact": 'flowPlateContact', 
                    "4 Plate Lift": 'flowPlateLiftTargetSuccess',
                    "5 Feedback": 'flowFeedback',        
                    "6 Break": 'flowBreak',
                    "Falls & Workspace": 'flowGeneralFailurePlate',    
                    "Time Limits": 'flowGeneralFailureTime',    
                    "Paradigm Start": 'flowOverallStart',
                }
			},
			"edit instructions": {    /// TOP ROW -> EDIT INSTRUCTIONS
				title: "Edit Instructions",
				icon: `${baseImgPath}feedback.png`,
				tabs: {
                    "1 Intertrial": 'messageIntertrial',
                    "2 Home Position": 'messageHome', 
                    "3 Plate Contact": 'messagePlateContact',   
                    "4 Plate Lift": 'messagePlateLift',
                    "5 Feedback": 'messageFeedback',        
                    "6 Break": 'messageBreak',
                    "Trial Number": 'messageGeneralTrialNumber',
                    "Paradigm Start": 'messagesOverallStart',
                    "Paradigm End": 'messagesOverallEnd',
                }
			},
			"reinforcement": { ///  MAIN -> Feedback MSG  +  QUICK LINKS -> REINFORCEMENT
				title: "Reinforcement",
				icon: `${baseImgPath}feedback.png`,
				tabs: {
                    "Message": 'messageFeedback',     
                    "Target": 'targetFeedback',
                    "Plate": 'plateFeedback',  
                    "Bird": 'birdChange',    
                }
			},   
			"bird": { ///  MAIN -> BIRD
				title: "Bird",
				icon: `${baseImgPath}bird.png`,
				tabs: {
                    "Appearance": 'birdAppearance',
                    "Swapping": 'birdChange',
                    "Animation": 'birdAnimations',
                    "Sound": 'birdSounds',
                    "Perch": 'birdPerch'   
                }
			}, 
			"target":{ ///  MAIN -> TARGET
				title: "Target",
				icon: `${baseImgPath}target.png`,
				tabs: {
                    "Position": 'targetPosition',
                    "Visual Mesh": 'targetMesh',   
                    "Success Criteria": 'flowPlateLiftTargetSuccess',  
                    "Feedback": 'targetFeedback',               
                }
			},      
			"plate":{ ///  MAIN -> PLATE
				title: "Plate",
				icon: `${baseImgPath}plate.png`,
				tabs: {
                    "Starting Position": 'plateHome',
                    "Appearance & Physics": 'plateObject',    
                    "Feedback": 'plateFeedback',
                    "Grape": 'plateGrape',    
                    "Stand": 'plateStand',                          
                }
			},
			"hand home":{ ///  MAIN -> HAND HOME
				title: "Hand Home",
				icon: `${baseImgPath}home.png`,
				tabs: {
                    "Home Position": 'homePosition',
                    "Criteria": 'flowHome', 
                    "Visual Mesh": 'homeMesh',
                    "Feedback": 'homeFeedback'                    
                }
			},  
			"hands & perturbation": {  /// MAIN -> HANDS
				title: "Hands & Perturbation",
				icon: `${baseImgPath}hands.png`,
				tabs: {
                    "Tracking": 'handTracking',
                    "Recording": 'handRecording',
                    "Perturbation Schedule": 'perturbationSchedule',
                    "Perturbation Magnitude": 'perturbationMagnitude',
                    "Perturbation Smoothing": 'perturbationSmoothing',
                    "Perturbation Origin": 'perturbationOrigin'              
                }
			},      
			"workspace":{   /// MAIN -> WORKSPACE
				title: "Workspace",
				icon: `${baseImgPath}workspace.png`,
				tabs: {
                    "Workspace": 'flowGeneralFailurePlate',   
                    "Trial Number": 'messageGeneralTrialNumber'                     
                }
			}, 
			"reaching task": { /// QUICK LINKS -> REACHING TASK 
				title: "Reaching Task",
				icon: ``,
				tabs: {
                    "Plate Starting Position": 'plateHome',
                    "Target Position": 'targetPosition',
                    "Hands Home Position": 'homePosition', 
                    "Success Criteria": 'flowPlateLiftTargetSuccess', 
                    "Workspace": 'flowGeneralFailurePlate',
                }
			},
			"motor adaptation": { /// QUICK LINKS -> MOTOR ADAPTATION 
				title: "Motor Adaptation",
				icon: ``,
				tabs: {
                    "Paradigm": 'perturbationSchedule',
                    "Gain": 'perturbationMagnitude',
                    "Smoothing": 'perturbationSmoothing',
                    "Origin": 'perturbationOrigin'              
                }
			}, 
			"paradigm":{    /// QUICK LINKS -> PARADIGM
				title: "Paradigm",
				icon: ``,
				tabs: {
                    "Paradigm Start Time": 'flowOverallStart',
                    "Paradigm Start Msg": 'messagesOverallStart',
                    "Paradigm End Msg": 'messagesOverallEnd',
                    "Adaptation Phases": 'perturbationSchedule',     
                    "Trial Number": 'messageGeneralTrialNumber'    
                }
			},
			"kinematics": {    /// QUICK LINKS -> KINEMATICS
				title: "Kinematics",
				icon: `${baseImgPath}hands.png`,
				tabs: {
                    "Hand Tracking": 'handTracking',
                    "Data Recording": 'handRecording'
                }
			}, 	
			"intertrial": {   /// TOP ROW PHASES -> INTERTRIAL
				title: "Intertrial",
				icon: ``,
				tabs: {
					"Intertrial Message": 'messageIntertrial', 
					"Intertrial Interval": 'flowIntertrial', 
				}
			},
			"home position": {   /// TOP ROW PHASES -> HOME
				title: "Home Position",
				icon: `${baseImgPath}home.png`,
				tabs: {
					"Home Position Message": 'messageHome', 
                    "Home Position": 'homePosition',
                    "Criteria": 'flowHome', 
                    "Visual Mesh": 'homeMesh',
                    "Feedback": 'homeFeedback'      
				}
			},
			"plate contact": {   /// TOP ROW PHASES -> PLATE CONTACT
				title: "Plate Contact",
				icon: `${baseImgPath}plate.png`,
				tabs: {
					"Plate Contact Message": 'messagePlateContact', 
                    "Starting Position": 'plateHome',
					"Plate Contact Flow": 'flowPlateContact', 
                    "Appearance & Physics": 'plateObject',    
                    "Grape": 'plateGrape',    
                    "Stand": 'plateStand',      
				}
			},
			"plate lift": {   /// TOP ROW PHASES -> PLATE LIFT
				title: "Plate Lift",
				icon: `${baseImgPath}plate.png`,
				tabs: {
					"Plate Lift Message": 'messagePlateLift', 
					"Plate Lift Flow Success": 'flowPlateLiftTargetSuccess', 
                    "Plate Lift Falls": 'flowGeneralFailurePlate',   
				}
			},
			"feedback": {   /// TOP ROW PHASES -> FEEDBACK
				title: "Feedback",
				icon: `${baseImgPath}feedback.png`,
				tabs: {
					"Feedback Message": 'messageFeedback', 
					"Feedback Flow": 'flowFeedback',   
                    "Target": 'targetFeedback',
                    "Plate": 'plateFeedback',  
                    "Bird": 'birdChange',    
				}
			}, 		
			"break": {   /// TOP ROW PHASES -> BREAK
				title: "Break",
				icon: ``,
				tabs: {
					"Break Message": 'messageBreak', 
					"Break Flow": 'flowBreak', 
				}
			}
	};

 	return builderPopupTabsConfig;
}


 




// Definition for the builder popup window 
function defBuilderPopupWindow(){  
	const builderStaticWindowConfig = {
		width: 800,
		height: 450,
		sizeUnits: 'px',
		left: -5,
		top: -5,
		positionUnits:'+%',
	};     
	return builderStaticWindowConfig;
}

// Definition for the builder help window 
function defBuilderHelpWindow(){  
	const builderStaticWindowConfig = defBuilderPopupWindow();
	const builderCatalogWindowConfig = {
	/*	width: builderStaticWindowConfig.width,
		height: builderStaticWindowConfig.height,
		sizeUnits: builderStaticWindowConfig.sizeUnits,
		left: 5,
		top: 5,
		positionUnits:'+%',*/
			width: 95,
		height: 90,
		sizeUnits: '%',
		left: 0,
		top: 0,
		positionUnits:'+%',
	};
	return builderCatalogWindowConfig;
} 
// Definition for the builder trial expand window
function defBuilderTrialExpandWindow(){   
	const builderTrialWindowConfig = {
		width: 1050,//1150,
		height: 520,
		sizeUnits: 'px',
		left: -20,
		top: -50,
		positionUnits:'+px',
	};
	return builderTrialWindowConfig;
}

// Definition for the builder help window 
function defBuilderTooltip(){   
	const builderTooltipConfig = {
		widthPercentRemaining: 90, // tooltip bubble width, as percent of remaining width (of param-form container)
		spaceTopMinPx: 6, // min space at the top of the bubble in px (wrt param-form container)
	};
	return builderTooltipConfig;
}
 

