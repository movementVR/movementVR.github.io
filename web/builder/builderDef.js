 
function getAllTabsDefinition( ) { 
   
const allTabsDefinition= {
                "flow": {   /// TOP ROW -> EDIT TRANSITIONS
                    "1 Intertrial": 'flowIntertrial',
                    "2 Home Position": 'flowHome', 
                    "3 Plate Contact": 'flowPlateContact', 
                    "4 Plate Lift": 'flowPlateLiftTargetSuccess',
                    "5 Feedback": 'flowFeedback',        
                    "6 Break": 'flowBreak',
                    "Falls & Workspace": 'flowGeneralFailurePlate',    
                    "Time Limits": 'flowGeneralFailureTime',    
                    "Paradigm Start": 'flowOverallStart',
                },
                "messages": {    /// TOP ROW -> EDIT INSTRUCTIONS
                    "1 Intertrial": 'messageIntertrial',
                    "2 Home Position": 'messageHome', 
                    "3 Plate Contact": 'messagePlateContact',   
                    "4 Plate Lift": 'messagePlateLift',
                    "5 Feedback": 'messageFeedback',        
                    "6 Break": 'messageBreak',
                    "Trial Number": 'messageGeneralTrialNumber',
                    "Paradigm Start": 'messagesOverallStart',
                    "Paradigm End": 'messagesOverallEnd',
                },
                "feedback": { ///  MAIN -> Feedback MSG  +  QUICK LINKS -> REINFORCEMENT
                    "Message": 'messageFeedback',     
                    "Target": 'targetFeedback',
                    "Plate": 'plateFeedback',  
                    "Bird": 'birdChange',    
                },   
                "bird": { ///  MAIN -> BIRD
                    "Appearance": 'birdAppearance',
                    "Swapping": 'birdChange',
                    "Animation": 'birdAnimations',
                    "Sound": 'birdSounds',
                    "Perch": 'birdPerch'   
                }, 
                "target":{ ///  MAIN -> TARGET
                    "Position": 'targetPosition',
                    "Visual Mesh": 'targetMesh',   
                    "Success Criteria": 'flowPlateLiftTargetSuccess',  
                    "Feedback": 'targetFeedback',               
                },      
                "plate":{ ///  MAIN -> PLATE
                    "Starting Position": 'plateHome',
                    "Appearance & Physics": 'plateObject',    
                    "Feedback": 'plateFeedback',
                    "Grape": 'plateGrape',    
                    "Stand": 'plateStand',                          
                },
                "home":{ ///  MAIN -> HAND HOME
                    "Home Position": 'homePosition',
                    "Criteria": 'flowHome', 
                    "Visual Mesh": 'homeMesh',
                    "Feedback": 'homeFeedback'                    
                },  
                "hands": {  /// MAIN -> HANDS
                    "Tracking": 'handTracking',
                    "Recording": 'handRecording',
                    "Perturbation Schedule": 'perturbationSchedule',
                    "Perturbation Magnitude": 'perturbationMagnitude',
                    "Perturbation Smoothing": 'perturbationSmoothing',
                    "Perturbation Origin": 'perturbationOrigin'              
                },      
                "workspace":{   /// MAIN -> WORKSPACE
                    "Workspace": 'flowGeneralFailurePlate',   
                    "Trial Number": 'messageGeneralTrialNumber'                     
                }, 
                "task": { /// QUICK LINKS -> REACHING TASK 
                    "Plate Starting Position": 'plateHome',
                    "Target Position": 'targetPosition',
                    "Hands Home Position": 'homePosition', 
                    "Success Criteria": 'flowPlateLiftTargetSuccess', 
                    "Workspace": 'flowGeneralFailurePlate',
                },
                "adaptation": { /// QUICK LINKS -> MOTOR ADAPTATION 
                    "Paradigm": 'perturbationSchedule',
                    "Gain": 'perturbationMagnitude',
                    "Smoothing": 'perturbationSmoothing',
                    "Origin": 'perturbationOrigin'              
                }, 
                "paradigm":{    /// QUICK LINKS -> PARADIGM
                    "Paradigm Start Time": 'flowOverallStart',
                    "Paradigm Start Msg": 'messagesOverallStart',
                    "Paradigm End Msg": 'messagesOverallEnd',
                    "Adaptation Phases": 'perturbationSchedule',     
                    "Trial Number": 'messageGeneralTrialNumber'    
                },
                "system": {    /// QUICK LINKS -> KINEMATICS
                    "Hand Tracking": 'handTracking',
                    "Data Recording": 'handRecording'
                }, 	
				"intertrial": {   /// TOP ROW PHASES -> INTERTRIAL
					"Intertrial Message": 'messageIntertrial', 
					"Intertrial Interval": 'flowIntertrial', 
				},
				"phaseHome": {   /// TOP ROW PHASES -> HOME
					"Home Position Message": 'messageHome', 
                    "Home Position": 'homePosition',
                    "Criteria": 'flowHome', 
                    "Visual Mesh": 'homeMesh',
                    "Feedback": 'homeFeedback'      
				},
				"phasePlateContact": {   /// TOP ROW PHASES -> PLATE CONTACT
					"Plate Contact Message": 'messagePlateContact', 
                    "Starting Position": 'plateHome',
					"Plate Contact Flow": 'flowPlateContact', 
                    "Appearance & Physics": 'plateObject',    
                    "Grape": 'plateGrape',    
                    "Stand": 'plateStand',      
				},
				"phasePlateLift": {   /// TOP ROW PHASES -> PLATE LIFT
					"Plate Lift Message": 'messagePlateLift', 
					"Plate Lift Flow Success": 'flowPlateLiftTargetSuccess', 
                    "Plate Lift Falls": 'flowGeneralFailurePlate',   
				},
				"phaseFeedback": {   /// TOP ROW PHASES -> FEEDBACK
					"Feedback Message": 'messageFeedback', 
					"Feedback Flow": 'flowFeedback',   
                    "Target": 'targetFeedback',
                    "Plate": 'plateFeedback',  
                    "Bird": 'birdChange',    
				},
				"phaseBreak": {   /// TOP ROW PHASES -> BREAK
					"Break Message": 'messageBreak', 
					"Break Flow": 'flowBreak', 
				}, 
                "instructions": {   /// BOTTOM ROW ->  INSTRUCTIONS
                    "Download": 'builderDownloadInstructions', 
                },
            };

 return allTabsDefinition;
}


function getBlockData( ) { 
 // Definition of tabs for each trial block 
    
    let baseRow=1;
    const btnsColValue="8 / span 2";
    
    // Row Block - Phase Name
      const blockDataPhaseTitle = [
        { text: "trial sequence:",  title: "", class: "trialDescriptionBlockRight", gridColumn: 1, gridRow: "1 / span 2" },
        { text: "intertrial", onclick: "intertrial", tab: "", title: "time interval between trials", class: "trialGamePhaseBlock", gridColumn: 2, gridRow: "1 / span 2"  },
        { text: "home position", onclick: "phaseHome", tab: "", title: "return hands to home position", class: "trialGamePhaseBlock", gridColumn: 3, gridRow: "1 / span 2"  },
        { text: "plate contact", onclick: "phasePlateContact", tab: "", title: "make contact with the plate", class: "trialGamePhaseBlock", gridColumn: 4, gridRow: "1 / span 2"  },
        { text: "plate lift", onclick: "phasePlateLift", tab: "",   title: "lift the plate towards the target", class: "trialGamePhaseBlock", gridColumn: 5, gridRow: "1 / span 2"  },
        { text: "feedback", onclick: "phaseFeedback", tab: "",   title: "receive feedback on trial success or failure", class: "trialGamePhaseBlock", gridColumn: 6, gridRow: "1 / span 2"  },
        { text: "break", onclick: "phaseBreak", tab: "",  title: "take a resting break", class: "trialGamePhaseBlock", gridColumn: 7, gridRow: "1 / span 2"  },
       ];         
    
    
      const blockDataPhaseEdit = [
        { text: "edit transitions", onclick: "flow", tab: "",title: "edit phase transitions", class: "trialEditBlockTop", gridColumn: btnsColValue, gridRow:   1},
        { text: "edit instructions",onclick: "messages", tab: "",  title: "edit messages", class: "trialEditBlockBottom", gridColumn: btnsColValue, gridRow:   2},
     ];   
     
    baseRow=baseRow+2; 
    
    //Row Block - Game Objects Names  
    const blockDataGameObjectsName = [ 
		{ text: "feedback", onclick: "feedback", img: "feedback", tab: "", title: "feedback message, colors, bird change", class: "trialGameObjectNameBlock", gridColumn:1, gridRow: 1+baseRow },
		{ text: "bird", onclick: "bird", img: "bird", tab: "", title: "bird appearance, sequence, animations...", class: "trialGameObjectNameBlock", gridColumn: 1, gridRow: 2+baseRow },
		{ text: "target", onclick: "target", img: "target", tab: "", title: "target position, apperance, success conditions, local feedback", class: "trialGameObjectNameBlock", gridColumn: 1, gridRow: 3+baseRow },
		{ text: "plate", onclick: "plate", img: "plate", tab: "", title: "plate, grape, stand position, apperance, feedback", class: "trialGameObjectNameBlock", gridColumn: 1, gridRow: 4+baseRow },
		{ text: "hand home", onclick: "home", img: "home", tab: "", title: "hand home position, apperance, conditions", class: "trialGameObjectNameBlock", gridColumn: 1, gridRow: 5+baseRow },
		{ text: "hands & perturbation", onclick: "hands", img: "hands", tab: "", title: "hand tracking and perturbation", class: "trialGameObjectNameBlock", gridColumn: 1, gridRow: 6+baseRow },
		{ text: "workspace", onclick: "workspace", img: "workspace", tab: "", title: "allowed workspace region for plate", class: "trialGameObjectNameBlock", gridColumn: 1, gridRow: 7+baseRow },
	];

		// Row Block - Game Objects
	const blockDataGameObjects = [       
		{ text: "_feedback", onclick: "feedback", img: "_feedback", tab: "", title: "feedback message, colors, bird change", class: "trialGameObjectBlock", gridColumn: 6, gridRow: 1+baseRow },
		{ text: "_bird", onclick: "bird", img: "_bird", tab: "", title: "bird appearance, sequence, animations...", class: "trialGameObjectBlock", gridColumn: "2 / span 6", gridRow: 2+baseRow },
		{ text: "_target", onclick: "target", img: "_target", tab: "", title: "target position, apperance, success conditions, local feedback", class: "trialGameObjectBlock", gridColumn: "2 / span 6", gridRow: 3+baseRow },
		{ text: "_plate", onclick: "plate", img: "_plate", tab: "", title: "plate, grape, stand position, apperance, feedback", class: "trialGameObjectBlock", gridColumn: "4 / span 2", gridRow: 4+baseRow },
		{ text: "_home", onclick: "home", img: "_home", tab: "", title: "hand home position, apperance, conditions", class: "trialGameObjectBlock", gridColumn: 3, gridRow: 5+baseRow },
		{ text: "_hands", onclick: "hands", img: "_hands", tab: "", title: "hand tracking and perturbation", class: "trialGameObjectBlock", gridColumn: "2 / span 6", gridRow: 6+baseRow },
		{ text: "_workspace", onclick: "workspace", img: "_workspace", tab: "", title: "allowed workspace region for plate", class: "trialGameObjectBlock", gridColumn: "2 / span 6", gridRow: 7+baseRow },
	];
    
 

    
 
    
    // Grid Blocks
    const nCol=7;
    const nRows=10; 
    const blockDashedGrid = [ 
        { text: "", onclick: "", tab: "", title: "", class: "trialDashedHorizontalGridBlock", gridColumn: `1 / span ${nCol}`, gridRow: 1+baseRow },
        { text: "", onclick: "", tab: "", title: "", class: "trialDashedHorizontalGridBlock", gridColumn: `1 / span ${nCol}`, gridRow: 2+baseRow },
        { text: "", onclick: "", tab: "", title: "", class: "trialDashedHorizontalGridBlock", gridColumn: `1 / span ${nCol}`, gridRow: 3+baseRow },
        { text: "", onclick: "", tab: "", title: "", class: "trialDashedHorizontalGridBlock", gridColumn: `1 / span ${nCol}`, gridRow: 4+baseRow },
        { text: "", onclick: "", tab: "", title: "", class: "trialDashedHorizontalGridBlock", gridColumn: `1 / span ${nCol}`, gridRow: 5+baseRow },
        { text: "", onclick: "", tab: "", title: "", class: "trialDashedHorizontalGridBlock", gridColumn: `1 / span ${nCol}`, gridRow: 6+baseRow },
        { text: "", onclick: "", tab: "", title: "", class: "trialDashedHorizontalGridBlock", gridColumn: `1 / span ${nCol}`, gridRow: 7+baseRow },
      ];
    
     const blockSolidGrid = [ 
        { text: "", onclick: "", tab: "", title: "", class: "trialSolidVerticalGridBlock", gridColumn: 1, gridRow: `1 / span ${nRows}`},
        { text: "", onclick: "", tab: "", title: "", class: "trialSolidVerticalGridBlock", gridColumn: 2, gridRow: `1 / span ${nRows}`},
        { text: "", onclick: "", tab: "", title: "", class: "trialSolidVerticalGridBlock", gridColumn: 3, gridRow: `1 / span ${nRows}`},
        { text: "", onclick: "", tab: "", title: "", class: "trialSolidVerticalGridBlock", gridColumn: 4, gridRow: `1 / span ${nRows}`},
        { text: "", onclick: "", tab: "", title: "", class: "trialSolidVerticalGridBlock", gridColumn: 5, gridRow: `1 / span ${nRows}`},
        { text: "", onclick: "", tab: "", title: "", class: "trialSolidVerticalGridBlock", gridColumn: 6, gridRow: `1 / span ${nRows}`},
        { text: "", onclick: "", tab: "", title: "", class: "trialSolidVerticalGridBlock", gridColumn: 7, gridRow: `1 / span ${nRows}`},
        { text: "", onclick: "", tab: "", title: "", class: "trialSolidHorizontalGridBlock", gridColumn: `1 / span ${nCol+2}`, gridRow: "1 / span 2"},  
      ];
     
 
    
    baseRow=4;  
    // Quick Links
      const blockDataQuickLinks = [
        { text: "quick links:",  title: "", class: "trialDescriptionBlockCenter", gridColumn: 8, gridRow: baseRow },        
        { text: "reaching task", onclick: "task", tab: "",title: "basic parameters of the task", class: "trialEditBlockQuicklink", gridColumn: btnsColValue, gridRow: baseRow+1},
          { text: "motor adaptation", onclick: "adaptation", tab: "",title: "adaptation perturbation and paradigm", class: "trialEditBlockQuicklink", gridColumn: btnsColValue, gridRow: baseRow+2},
          { text: "reinforcement", onclick: "feedback", tab: "",title: "feedback for reinforcement learning", class: "trialEditBlockQuicklink", gridColumn: btnsColValue, gridRow: baseRow+3},
          { text: "paradigm", onclick: "paradigm", tab: "",title: "paradigm start / end and adaptation phases", class: "trialEditBlockQuicklink", gridColumn: btnsColValue, gridRow: baseRow+4},          
          { text: "kinematics", onclick: "system", tab: "",title: "hand tracking and data recording", class: "trialEditBlockQuicklink", gridColumn: btnsColValue, gridRow: baseRow+5},
       ];         
    
    
    
    const blockData = [ ...blockSolidGrid, ...blockDashedGrid,
                       ...blockDataPhaseTitle,  ...blockDataPhaseEdit,
                       ...blockDataGameObjects, ...blockDataGameObjectsName,
                       ...blockDataQuickLinks,
                      ]; 

 return blockData;
}

 




