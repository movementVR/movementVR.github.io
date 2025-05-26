function defBuilderPaths() {
	// Paths Definitions 
	const builderPaths = {
		builderIconPath: (imgName) => `web/img/gameobjects/${imgName}.png`,
		builderParametersPath: (fileName) => `web/builder/parameters/${fileName}.html`,
		builderTrialPath: (fileName) => `web/builder/trialBuilder/${fileName}.html`,
		builderHelpModalsPath: (fileName) => `web/builder/modals/${fileName}.html`,
		builderHelpCsvPath: `web/builder/parameterCatalog/parametersHelp.csv`,
		builderDefaultCsvPath: `web/builder/parameterCatalog/parametersDefault.csv`
	};
	return builderPaths;
}


// Definition for the main builder page
function defBuilderLayout(flatten = false) {  
	let col;
	let row; 
	
	// Top Block, 2 Rows: Trial Flow -> Phase Names
    col = 3; 
	const trialSeqString = "<div class=\"trialsequencetext\"><u>Trial Flow</u></div><div class=\"trialsequenceline\"></div><div class=\"trialsequencearrow\">➤</div>";
    const blockDataPhaseTitle = [
        { text: trialSeqString, onclick: "trial flow",img: "edit", title: "edit trial flow parameters like criteria for transitions", class: "name-block trialsequenceheader",gridRow: 1},
        { text: "intertrial", onclick: "intertrial", title: "time interval between trials", class: "name-block trial-sequence", gridColumn: col++},
        { text: "return home", onclick: "return home", title: "return hands to home position", class: "name-block trial-sequence", gridColumn: col++},
        { text: "start lift", onclick: "start lift", title: "make contact with the plate", class: "name-block trial-sequence", gridColumn: col++},
        { text: "execute lift", onclick: "execute lift",   title: "lift the plate towards the target", class: "name-block trial-sequence", gridColumn: col++},
        { text: "feedback", onclick: "feedback phase",   title: "receive feedback on trial success or failure", class: "name-block trial-sequence", gridColumn: col++},
        { text: "break", onclick: "break",  title: "take a resting break", class: "name-block trial-sequence", gridColumn: col++},
    ];      
	
	
    //Left Column Block: Game Objects Names  
    row=3;
	const gameObjString = "<div class=\"gameobjecttext\">Game Objects</div><div class=\"gameobjectline\"></div>";
    
    const blockDataGameObjectsName = [ 		
        { text: gameObjString,  class: "name-block gameobjectheader",gridCol: 1},		
		{ text: "feedback", onclick: "feedback", img: "feedback", title: "feedback message, colors, bird change", class: "name-block game-object", gridRow: row++ }, 		
		{ text: "bird", onclick: "bird", img: "bird", title: "bird appearance, sequence, animations...", class: "name-block game-object", gridRow: row++ },
		{ text: "target", onclick: "target", img: "target", title: "target position, apperance, success conditions, local feedback", class: "name-block game-object", gridRow: row++ },
		{ text: "plate", onclick: "plate", img: "plate", title: "plate, grape, stand position, apperance, feedback", class: "name-block game-object", gridRow: row++ },
		{ text: "hand home", onclick: "hand home", img: "home", title: "hand home position, apperance, conditions", class: "name-block game-object", gridRow: row++ },
		{ text: "hands & gain", onclick: "hands & gain", img: "hands", title: "hand tracking and perturbation", class: "name-block game-object", gridRow: row++ },
		{ text: "text prompts", onclick: "text prompts", img: "instructions", title: "edit text shown to participants for instructions, feedback...", class: "name-block game-object", gridRow: row++ },
	];
	 

	// Main Grid Block: Bars Showing Game Objects Presence Across Trial Flow
    row=3; 
	const blockDataGameObjects = [ 
	  { text: "", onclick: "feedback", title: "feedback message, colors, bird change", class: "bar-block feedback", gridRow: row++ },
	  { text: "", onclick: "bird", title: "bird appearance, sequence, animations...", class: "bar-block bird", gridRow: row++ },
	  { text: "", onclick: "target", title: "target position, apperance, success conditions, local feedback", class: "bar-block target", gridRow: row++ },
	  { text: "", onclick: "plate", title: "plate, grape, stand position, apperance, feedback", class: "bar-block plate", gridRow: row++ },
	  { text: "", onclick: "hand home", title: "hand home position, apperance, conditions", class: "bar-block hand-home", gridRow: row++ },
	  { text: "", onclick: "hands & gain", title: "hand tracking and perturbation", class: "bar-block hands-perturbation", gridRow: row++ },
	  { text: "", onclick: "text prompts", title: "edit text shown to participants for instructions, feedback...", class: "bar-block instructions", gridRow: row++ }
	];
 
  
    // Quick Links
	row=1;
	const blockDataQuickLinks = [
	  { text: "Quick Links",  title: "", class: "description sideBubblesHeader", gridRow: row++ },        
	  { text: "reaching task", onclick: "reaching task",title: "basic parameters of the task", class: "sideBubbleLink quick-links", gridRow: row++ },
	  { text: "motor adaptation", onclick: "motor adaptation",title: "adaptation perturbation and paradigm", class: "sideBubbleLink quick-links", gridRow: row++ },
	  { text: "reinforcement", onclick: "reinforcement", title: "feedback for reinforcement learning", class: "sideBubbleLink quick-links", gridRow: row++ },
	  { text: "paradigm", onclick: "paradigm",title: "paradigm start / end and adaptation phases", class: "sideBubbleLink quick-links", gridRow: row++ },          
	  { text: "kinematics", onclick: "kinematics",title: "hand tracking and data recording", class: "sideBubbleLink quick-links", gridRow: row++ },
	];    
	
	
	
	
	
	
	
    // Session Management
	row=1;
	const blockDataSessionManagement = [ 
	  { text: "Session Manager",  title: "", class: "description sideBubblesHeader", gridRow: row++ },    
	  { text: "upload parameters",  title: "Import all parameters from .csv file", class: "sideBubbleLink uploadParam", id:"mainBuilderUploadButton", gridRow: row++ },    
	  { text: "save / load session",  title: "Save or Load the complete Builder configuration", class: "sideBubbleLink sessionConfig",id:"mainBuilderSaveLoadButton", gridRow: row++ },     
	  { text: "parameter catalog",  title: "View or download the complete list of parameters and their information (description, location, input type, code name...)", class: "sideBubbleLink parameterCatalog", id:"parameterCatalogBuilderButton", gridRow: row++ },  
	  { text: "",  title: "", class: "hidden", id:"parameterTemplateBuilderButton", gridRow: row++ }, 
	];    
	
	
	
    // Footer 
	row=1;
	const blockDataFooterButtons = [
	  { text: "Help",  title: "Open the interactive guide for the Main Builder", class: "buttonSecondary helpBtn",id:"mainBuilderHelpButton", gridRow: row++ },   
	  { text: "Download",  title: "Download all parameters to .csv file and configure the VR App", class: "buttonMain download",id:"mainBuilderDownloadButton",  gridRow: row++ }, 	      
	];         
	
	

     
    const builderConfigMainGrid = [ 
						   ...blockDataPhaseTitle,                     
						   ...blockDataGameObjects, 
						   ...blockDataGameObjectsName,                     
                      ];                     

	let builderConfig;
	if (flatten) {
		builderConfig = [
			...builderConfigMainGrid,
			...blockDataQuickLinks 
		];
	} else {
		builderConfig = {
			mainGrid: builderConfigMainGrid,
			quickLinks: blockDataQuickLinks,
			sessionManagement: blockDataSessionManagement,
			footerButtons: blockDataFooterButtons
		};
	}
	
	 
 	return builderConfig;
	
	
	
}
 


// Definition for the builder popup window tabs
function defBuilderPopupTabs( ) { 
	// Central variable for image path
	const baseImgPath = 'web/img/gameobjects/';   
	
	// Tabs Definitions 
	const builderPopupTabsConfig = {
			"trial flow": {   /// TOP ROW -> TRIAL FLOW
				title: "Trial Flow",
				icon: ``,
				tabs: {
                    "1 Intertrial": 'flowIntertrial',
                    "2 Return Home": 'flowHome', 
                    "3 Start Lift": 'flowPlateContact', 
                    "4 Execute Lift": 'flowPlateLiftTargetSuccess',
                    "5 Feedback": 'flowFeedback',        
                    "6 Break": 'flowBreak',
                    "Falls & Workspace": 'flowGeneralFailurePlate',    
                    "Time Limits": 'flowGeneralFailureTime',    
                    "Paradigm Start": 'flowOverallStart',
                }
			},
			"feedback": { ///  MAIN -> FEEDBACK
				title: "Feedback",
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
                    "Workspace": 'flowGeneralFailurePlate',                           
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
			"hands & gain": {  /// MAIN -> HANDS
				title: "Hands & Gain",
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
			"text prompts": {    /// TEXT PROMPTS
				title: "Text Prompts",
				icon: `${baseImgPath}instructions.png`,
				tabs: {
                    "1 Intertrial": 'messageIntertrial',
                    "2 Return Home": 'messageHome', 
                    "3 Start Lift": 'messagePlateContact',   
                    "4 Execute Lift": 'messagePlateLift',
                    "5 Feedback": 'messageFeedback',        
                    "6 Break": 'messageBreak',
                    "Trial Number": 'messageGeneralTrialNumber',
                    "Paradigm Start": 'messagesOverallStart',
                    "Paradigm End": 'messagesOverallEnd',
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
			"reinforcement": { /// QUICK LINKS -> FEEDBACK
				title: "Reinforcement",
				icon: `${baseImgPath}feedback.png`,
				tabs: {
                    "Message": 'messageFeedback',     
                    "Target": 'targetFeedback',
                    "Plate": 'plateFeedback',  
                    "Bird": 'birdChange'    
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
			"return home": {   /// TOP ROW PHASES -> HOME
				title: "Return Home",
				icon: `${baseImgPath}home.png`,
				tabs: {
					"Return Home Message": 'messageHome', 
                    "Home Position": 'homePosition',
                    "Criteria": 'flowHome', 
                    "Visual Mesh": 'homeMesh',
                    "Feedback": 'homeFeedback'      
				}
			},
			"start lift": {   /// TOP ROW PHASES -> START LIFT
				title: "Start Lift",
				icon: `${baseImgPath}plate.png`,
				tabs: {
					"Start Lift Message": 'messagePlateContact', 
                    "Plate Starting Position": 'plateHome',
					"Start Lift Flow": 'flowPlateContact', 
                    "Appearance & Physics": 'plateObject',    
                    "Grape": 'plateGrape',    
                    "Stand": 'plateStand',      
				}
			},
			"execute lift": {   /// TOP ROW PHASES -> EXECUTE LIFT
				title: "Execute Lift",
				icon: `${baseImgPath}plate.png`,
				tabs: {
					"Execute Lift Message": 'messagePlateLift', 
					"Success Criteria": 'flowPlateLiftTargetSuccess', 
                    "Failure Criteria Falls": 'flowGeneralFailurePlate',     
                    "Failure Criteria Time": 'flowGeneralFailureTime',    
				}
			},
			"feedback phase": {   /// TOP ROW PHASES -> FEEDBACK
				title: "Feedback Phase",
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
 

