 
function getAllTabsDefinition( ) { 
   
const allTabsDefinition= {
                "flow": {   /// PHASES
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
                "messages": {
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
                "task": { /// BASIC TASK DEF
                    "Plate Starting Position": 'taskPlateHome',
                    "Target Position": 'taskTargetPosition',
                    "Hands Home Position": 'taskHandHomePosition', 
                    "Success Criteria": 'flowPlateLiftTargetSuccess', 
                    "Workspace": 'flowGeneralFailurePlate',
                },
                "bird": {   /// GAME OBJECTS
                    "Appearance": 'birdAppearance',
                    "Swapping": 'birdChange',
                    "Animation": 'birdAnimations',
                    "Sound": 'birdSounds',
                    "Perch": 'objectPerch'   
                },       
                "plate":{
                    "Starting Position": 'taskPlateHome',
                    "Appearance & Physics": 'objectPlate',    
                    "Feedback": 'feedbackPlate',
                    "Grape": 'objectGrape',    
                    "Stand": 'objectPlateStand',                          
                },
                "target":{
                    "Position": 'taskTargetPosition',
                    "Visual Mesh": 'objectTargetMesh',   
                    "Success Criteria": 'flowPlateLiftTargetSuccess',  
                    "Feedback": 'feedbackTarget',               
                },
                "home":{
                    "Home Position": 'taskHandHomePosition',
                    "Visual Mesh": 'objectHandHomeMesh',
                    "Criteria": 'flowHome', 
                    "Feedback": 'objectHandHomeColor'                    
                },       
                "workspace":{
                    "Workspace": 'flowGeneralFailurePlate',   
                    "Trial Number": 'messageGeneralTrialNumber'                     
                },     
                "paradigm":{   /// PARADIGM AND SYSTEM
                    "Paradigm Start Time": 'flowOverallStart',
                    "Paradigm Start Msg": 'messagesOverallStart',
                    "Paradigm End Msg": 'messagesOverallEnd',
                    "Adaptation Phases": 'adaptationParadigm',       
                }, 
                "adaptation": {
                    "Paradigm": 'adaptationParadigm',
                    "Gain": 'adaptationGainMagnitude',
                    "Smoothing": 'adaptationGainChange',
                    "Origin": 'adaptationGainOrigin'              
                },
                "hands": {
                    "Tracking": 'systemHandTracking',
                    "Recording": 'systemDataSaving',
                    "Perturbation Schedule": 'adaptationParadigm',
                    "Perturbation Magnitude": 'adaptationGainMagnitude',
                    "Perturbation Smoothing": 'adaptationGainChange',
                    "Perturbation Origin": 'adaptationGainOrigin'              
                },
                "feedback": {
                    "Message": 'messageFeedback',     
                    "Target": 'feedbackTarget',
                    "Plate": 'feedbackPlate',  
                    "Bird": 'birdChange',    
                },
                "system": {
                    "Hand Tracking": 'systemHandTracking',
                    "Data Recording": 'systemDataSaving'
                },
                "objects": {   /// TBD
                    "Plate": 'objectPlate',
                    "Plate Stand": 'objectPlateStand', 
                    "Grape": 'objectGrape',   
                    "Target Mesh": 'objectTargetMesh',
                    "Bird Perch": 'objectPerch',  
                    "Home Mesh": 'objectHandHomeMesh',
                    "Home Color Feedback": 'objectHandHomeColor'
                },
                "instructions": {   /// TBD
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
        { text: "intertrial",   title: "time interval between trials", class: "trialGamePhaseBlock", gridColumn: 2, gridRow: "1 / span 2"  },
        { text: "home position", title: "return hands to home position", class: "trialGamePhaseBlock", gridColumn: 3, gridRow: "1 / span 2"  },
        { text: "plate contact",  title: "make contact with the plate", class: "trialGamePhaseBlock", gridColumn: 4, gridRow: "1 / span 2"  },
        { text: "plate lift",  title: "lift the plate towards the target", class: "trialGamePhaseBlock", gridColumn: 5, gridRow: "1 / span 2"  },
        { text: "feedback",  title: "receive feedback on trial success or failure", class: "trialGamePhaseBlock", gridColumn: 6, gridRow: "1 / span 2"  },
        { text: "break", title: "take a resting break", class: "trialGamePhaseBlock", gridColumn: 7, gridRow: "1 / span 2"  },
       ];         
    
    
      const blockDataPhaseEdit = [
        { text: "edit transitions", onclick: "flow", tab: "",title: "edit phase transitions", class: "trialEditBlockTop", gridColumn: btnsColValue, gridRow:   1},
        { text: "edit instructions",onclick: "messages", tab: "",  title: "edit messages", class: "trialEditBlockBottom", gridColumn: btnsColValue, gridRow:   2},
     ];   
    /*
      const blockDataPhaseEdit = [
        { text: "edit transitions", onclick: "flow", tab: "",title: "edit phase transitions", class: "trialEditBlockTop", gridColumn: btnsColValue, gridRow:   1},
        { text: "edit instructions",onclick: "messages", tab: "6 Break",  title: "edit messages", class: "trialEditBlockBottom", gridColumn: btnsColValue, gridRow:   2},
     ];   */
    
    baseRow=baseRow+2; 
    
    //Row Block - Game Objects Names 
  /*  const blockDataGameObjectsName = [ 
        { text: "bird", onclick: "bird", tab: "", title: "bird appearance, sequence, animations...", class: "trialGameObjectNameBlock", gridColumn: 1, gridRow: 1+baseRow },
        { text: "target", onclick: "target", tab: "", title: "target position, apperance, success conditions, local feedback", class: "trialGameObjectNameBlock", gridColumn: 1, gridRow: 2+baseRow },
        { text: "plate", onclick: "plate", tab: "", title: "plate, grape, stand position, apperance, feedback", class: "trialGameObjectNameBlock", gridColumn: 1, gridRow: 3+baseRow },
        { text: "hand home", onclick: "home", tab: "", title: "hand home position, apperance, conditions", class: "trialGameObjectNameBlock", gridColumn: 1, gridRow: 4+baseRow },
        { text: "feedback msg", onclick: "feedback", tab: "", title: "feedback message, colors, bird change", class: "trialGameObjectNameBlock", gridColumn:1, gridRow: 5+baseRow },
        { text: "hands", onclick: "hands", tab: "", title: "hand tracking and perturbation", class: "trialGameObjectNameBlock", gridColumn: 1, gridRow: 6+baseRow },
        { text: "workspace", onclick: "workspace", tab: "", title: "allowed workspace region for plate", class: "trialGameObjectNameBlock", gridColumn: 1, gridRow: 7+baseRow },
      ];*/
    
    const blockDataGameObjectsName = [ 
    { text: "bird", onclick: "bird", img: "bird", tab: "", title: "bird appearance, sequence, animations...", class: "trialGameObjectNameBlock", gridColumn: 1, gridRow: 1+baseRow },
    { text: "target", onclick: "target", img: "target", tab: "", title: "target position, apperance, success conditions, local feedback", class: "trialGameObjectNameBlock", gridColumn: 1, gridRow: 2+baseRow },
    { text: "plate", onclick: "plate", img: "plate", tab: "", title: "plate, grape, stand position, apperance, feedback", class: "trialGameObjectNameBlock", gridColumn: 1, gridRow: 3+baseRow },
    { text: "hand home", onclick: "home", img: "home", tab: "", title: "hand home position, apperance, conditions", class: "trialGameObjectNameBlock", gridColumn: 1, gridRow: 4+baseRow },
    { text: "feedback msg", onclick: "feedback", img: "feedback", tab: "", title: "feedback message, colors, bird change", class: "trialGameObjectNameBlock", gridColumn:1, gridRow: 5+baseRow },
    { text: "hands", onclick: "hands", img: "hands", tab: "", title: "hand tracking and perturbation", class: "trialGameObjectNameBlock", gridColumn: 1, gridRow: 6+baseRow },
    { text: "workspace", onclick: "workspace", img: "workspace", tab: "", title: "allowed workspace region for plate", class: "trialGameObjectNameBlock", gridColumn: 1, gridRow: 7+baseRow },
];

    
    //Row Block - Game Objects
    const blockDataGameObjects = [       
        { text: "", onclick: "bird", tab: "", title: "bird appearance, sequence, animations...", class: "trialGameObjectBlock", gridColumn: "2 / span 6", gridRow: 1+baseRow },
        { text: "", onclick: "target", tab: "", title: "target position, apperance, success conditions, local feedback", class: "trialGameObjectBlock", gridColumn: "2 / span 6", gridRow: 2+baseRow },
        { text: "", onclick: "plate", tab: "", title: "plate, grape, stand position, apperance, feedback", class: "trialGameObjectBlock", gridColumn: "4 / span 2", gridRow: 3+baseRow },
        { text: "", onclick: "home", tab: "", title: "hand home position, apperance, conditions", class: "trialGameObjectBlock", gridColumn: 3, gridRow: 4+baseRow },
        { text: "", onclick: "feedback", tab: "", title: "feedback message, colors, bird change", class: "trialGameObjectBlock", gridColumn: 6, gridRow: 5+baseRow },
        { text: "", onclick: "hands", tab: "", title: "hand tracking and perturbation", class: "trialGameObjectBlock", gridColumn: "2 / span 6", gridRow: 6+baseRow },
        { text: "", onclick: "workspace", tab: "", title: "allowed workspace region for plate", class: "trialGameObjectBlock", gridColumn: "2 / span 6", gridRow: 7+baseRow },
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

 




