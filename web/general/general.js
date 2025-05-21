
// // // FUNCTIONS TO ATTACH SCRIPTS AND STYLES TO WINDOWS // // // 
// Function to attach JS, CSS, HTML files from JSON to a target window
async function includeFilesFromJson(argsArray,targetWindow = window) { 
	//console.log('jsonWrapper In');
	//console.log(argsArray);
	
	pendingEntryScripts=[];
	// loads everything except the entry scripts 
	for (const args of argsArray) { 
		const selection = args.selection || "main";
		const htmlContainer = args.htmlContainer || targetWindow.document.body;
		const jsonPath = args.jsonPath; // required

		//console.log('outerentry'); 
		// Await the full processing of each JSON file.   
		await includeFromJson(jsonPath, targetWindow, selection, htmlContainer,pendingEntryScripts); 
		//console.log('outerexit');
	}
 
	// Once all calls are complete, load all collected entry scripts.
	for (const { url, targetWindow } of pendingEntryScripts) {
		await includeScript(url, targetWindow);
	}
	
	//console.log('jsonWrapper Out'); 
	
	
	async function includeFromJson(jsonPath, targetWindow = window, selection = "main", 
										 htmlContainer = targetWindow.document.body,
										 pendingEntryScripts) { 
		//console.log('jsonin');   
		//console.log(jsonPath)
		const response = await fetch(jsonPath);  // extract data from json file
		const data = await response.json();
		const filePath = data.path; // Containing folder
        
        
        

		// // //  Loads body content (HTML files) // // // 
		// gets array of selected + global html content
		const selectedContents = collectSelectedFiles(data.html,[selection,'global']);  

		// Load HTML files based on selection
		for (const file of selectedContents) {	 
			// Calls loadHTML to load html content (and waits for it to finish before continuing) 
			await loadHTML(filePath + file, htmlContainer, true); 
		}   

  

		
		// // //  Loads scripts (JS files) // // //
		// Loads scripts only for "main" call (primary call in main window) // // //
		// (Handles scripting centrally, not directly in popups + Avoids reloading for secondary calls)
		if (selection == "main") {  
			// gets array of entry scripts, or set variable to [] if there is no such definition in json 
			const entryScripts = collectSelectedFiles(data.scripts,['entry']);
			// Load scripts except the entry scripts
			for (const [category, files] of Object.entries(data.scripts)) { 
				for (const file of files) {					
					if (!entryScripts.includes(file)) { // Check if file is NOT in entryScripts array 
						// console.log('Loading Script '+ file);
						await includeScript(filePath + file, targetWindow); 
					} 
				} 
			}
			// Store all entry scripts to load last  
			for (const entry of entryScripts) {  
				pendingEntryScripts.push({ url: filePath + entry, targetWindow });
			} 
		} 
		// Scoped scripts / libraries are loaded to target popup window  
		const selectedScopedScripts = collectSelectedFiles(data.scopedScripts,[selection,'global']); 
		for (const file of selectedScopedScripts) {  
			includeScript(filePath + file, targetWindow);
		}   
		
		// External scripts / libraries are loaded to target popup window  
		const selectedExternalScripts = collectSelectedFiles(data.externalScripts,[selection,'global']); 
		for (const file of selectedExternalScripts) {  
			includeScript(file, targetWindow);
		}   

		

		// // //  Loads styles (CSS files) // // // 
		// gets array of selected + global css styles with parsed $include 
		const selectedStyles = collectSelectedFiles(data.css,[selection,'global']);
		// Load CSS files based on selection
		for (const file of selectedStyles) { 
			//console.log('Loading Style '+ file);
			includeStyle(filePath + file, targetWindow);
		}   
		
		// External CSS
		const selectedExternalStyles = collectSelectedFiles(data.externalCss,[selection,'global']); 
		for (const file of selectedExternalStyles) {  
			includeStyle(file, targetWindow);
		}   
        
        
		
        // // //  Gets References to iFrames body content (HTML files) // // // 
		// gets array of selected + global html content
		const selectedFrames = collectSelectedFiles(data.modals,[selection,'global']);   
        // Load html to iFrame files based on selection
		for (const fileObj of selectedFrames) {   
            const iframeElement = await loadHTMLFrame(filePath + fileObj.file, fileObj.id, targetWindow); 
			
			// Loads JSON to frame
			const iframeWindow = iframeElement.contentWindow; 
			if (fileObj.selection) {			   
				await includeFromJson(jsonPath, iframeWindow, fileObj.selection);  
			} 
			
		} 
		//console.log('jsonout'); 
		
		
		
		//////////////////// HELPER FUNCTIONS ////////////////////		

		// Helper Function to Return List of Files included in selection + global + $include references //
		function collectSelectedFiles(data,selections,result = []){  
            if(data){ 
                // Iterate through selection + global
                selections.forEach(sel => {   
                    // Iterate through all items (listed css/html/js files or $include objects)
                    data[sel]?.forEach(item => { 
                       
                        if (item && item.$include && data[item.$include]) {  
                            // $include object -> recursively adds files to array
                            collectSelectedFiles(data,[item.$include],result);  
                        } else {
                            // css/html/js file  -> add to array
                            result.push(item); 
                        }  
                    }); 
                });                
            }
			return result; 
		} 

		// Function includes css style from file fileSource 
		// to the doc (if only first argument passsed) or a window (second argument)
		function includeStyle(fileSource, targetWindow) {	
			// Target document <- targetWindow.document if targetWindow exists, document otherwise
			const targetDoc = targetWindow ? targetWindow.document : document;

			// Creates and initializes script elemement
			const cssLink = targetDoc.createElement('link'); // creates link element = reference to external source
			cssLink.rel = 'stylesheet'; // specifies "relationship" = source is a stylesheet for doc/window
			cssLink.type = 'text/css'; // specifies file type = source is a css file
			cssLink.href = fileSource; // file path
			targetDoc.head.appendChild(cssLink);
		}
                                   
                                   
                                   
        
        // function to load an entire HTML file as a iframe (for modals)
        function loadHTMLFrame(fileSource, frameID, targetWindow) {   
            return new Promise((resolve, reject) => {
                const iframeElement = targetWindow.document.createElement('iframe'); 
                iframeElement.src = fileSource; //'error-popup.html'; 
                iframeElement.className="general-iframe"; 	
                iframeElement.id =  frameID;// sets the id = filename 
                iframeElement.style.display="none"; 				 
                targetWindow.document.body.appendChild(iframeElement);  
                
                // Resolve the Promise when the iframe has loaded
                iframeElement.onload = () => {
                    resolve(iframeElement);
                }; 
            });
        } 
	}
							   
	// Function includes js script from file fileSource 
	// to the doc (if only first argument passed) or a window (second argument)
	// Uses Promise to allow to fully load a script before starting to load the next one 
	//   I.e., using await in the calling function: await includeScript(fileSource);
	function includeScript(fileSource, targetWindow) {	 
		return new Promise((resolve) => {

			// Target document <- targetWindow.document if targetWindow exists, document otherwise
			const targetDoc = targetWindow ? targetWindow.document : document;

			// Creates and initializes script elemement
			const scriptElement = targetDoc.createElement('script'); 
			scriptElement.src = fileSource;  

			// Sets up listener to track when script has loaded
			scriptElement.onload = () => {  
				resolve(scriptElement); // Resolve with the script element once it's loaded
			};

			// adds script to document and returns it
			targetDoc.body.appendChild(scriptElement);   

		});
	}
}


// // // FUNCTION TO POPULATE CONTAINERS WITH HTML CONTENT FROM FILES // // // 
// loads html body content from file and loads it onto container 
// How to pass a function to loadHTML:
//		loadHTML(folderName + htmlFileName, targetContainer, addFlag).then(()=>{});  
//      or, if the caller function is async: await loadHTML(...)
function loadHTML(fileSource, targetContainer = window.document.body, addFlag = false) {  
	return new Promise((resolve) => { // 'return' occurs on 'resolve' below (after loading completed) 
		// Load + parse HTML file -> add HTML content to container
		loadFile(fileSource).then(html => {
			const parser = new DOMParser();
			const parsedHtml = parser.parseFromString(html, 'text/html');
			const parsedHtmlBody = parsedHtml.body.innerHTML;
			if (addFlag) { // adds to current body HTML
				targetContainer.insertAdjacentHTML('beforeend', parsedHtmlBody); 
			} else { // replaces innerHTML
				targetContainer.innerHTML = parsedHtmlBody;
			}   
			resolve(); // Waits for HTML to load & initFunction to run (unless async)
		}); 
	});
} 
		



// // // FUNCTIONS TO LOAD FILES (INTERNAL AND EXTERNAL) // // //
// source: URL string (internal) or File object (external) 
async function loadFile(source) { 
    if (typeof source === 'string') {	  // INTERNAL FILE //
        // Load internal file using fetch (source = file path)
        const response = await fetch(source); 
        return await response.text();    
    } else if ((source instanceof File) || (Object.prototype.toString.call(source)=== '[object File]')) { 	  // EXTERNAL FILE //
        // Load external file using FileReader (source = file, from input type=file)    
        return await readFileAsText(source);
    }   

    //helper function: reads a File object as text using FileReader
    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => resolve(event.target.result);
            reader.onerror = event => 
            reject(new Error("File could not be read: " + event.target.error));
            reader.readAsText(file);
        });
    }
}

 

// // // FUNCTIONS TO CREATE AND INITIALIZE NEW POPUP WINDOWS // // // 

// Function creates a new window, using specified size and position
// Size: width, height, sizeUnits = "%" or "px"
// 			 // sizeUnits = "px" -> absolute size in pixel
// 			 // sizeUnits = "%" -> size as % of screen size
// Position: left = 0, top = 0, positionUnits = "%", "px", "+%", or "+px"
// 			 // positionUnits = "%", "px" -> position from top-left corner of screen
// 			 // positionUnits = "+%", "+px" -> position from center of screen
function createWindow({width, height, sizeUnits = "%",
                      left = 0, top = 0, positionUnits = "%"}) {  

    // Reference dimensions: get the dimensions of the screen
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height; 

    // New window size 
    const windowWidth = getMeasure(width, sizeUnits, screenWidth, 0);
    const windowHeight = getMeasure(height, sizeUnits, screenHeight, 0);

    // New window position, if centered
    const windowLeftCentered = (screenWidth - windowWidth) / 2;
    const windowTopCentered = (screenHeight - windowHeight) / 2; 
	 
    // New window position
    const windowLeft = getMeasure(left, positionUnits, screenWidth, windowLeftCentered);
    const windowTop = getMeasure(top, positionUnits, screenHeight, windowTopCentered);

    // Open the window with the calculated size and position	 
	const newWindow = window.open('', '_blank', `
		width=${windowWidth},height=${windowHeight},
		left=${windowLeft},top=${windowTop}
	`);   
	return new Promise((resolve, reject) => {
        robustOnLoad(newWindow, () => {
			// console.log('createWindow OUT');
            resolve(newWindow); // Resolve the promise once the window is fully loaded
        });
    });
	
	 
	
    // Support function to calculate measures that are a percentage of screen size
    function calculatePercentage(value, refSize){
        return Math.round(refSize * (Math.abs(value) > 1 ? value / 100 : value));
    };
    // Support function to calculate size or offset (for both width, height, left, and top)
    function getMeasure(value, units, refSize, centerOffset){
		// size or position relative to top-left screen corner:
        if (units === "px") return value; // measure in pixel
        if (units === "%") return calculatePercentage(value, refSize); // measure in % of screen size
		// position relative to screen center:
        if (units === "+px") return centerOffset + value; // pixel
        if (units === "+%") return centerOffset + calculatePercentage(value, refSize);  // % of screen size 
    };
	
	
	// Support function to return promise once window has loaded
	// (Can be standalone if needed -> move out of this function)
		// Function ensures that a function is run upon loading of a new popup window
		// loadingElement: a new popup window
		// targetFunction: function to be executed upon loading completion
		// How to pass a function to robustOnLoad:
		//		robustOnLoad(myWindow, myFunction.bind(null, 
		//				myFunctionParam1, myFunctionParam2, myFunctionParam3,...));  
	function robustOnLoad(loadingElement,targetFunction){ 
		// Check if the new window is already loaded
		if (loadingElement.document.readyState === 'complete') { 
			// If already loaded, execute modifications immediately
			targetFunction(); 
		} else { 
			// If not loaded, attach a load event listener
			loadingElement.addEventListener('load', targetFunction); 
		}
		// setTimeout(targetFunction,2000);
	} 
	
}
	
// // // GENERAL SETUP FUNCTIONS // // // 
function generalSetup(){
     setupCloneWithListeners();
}

// // // INTERFACE GET FUNCTIONS // // // 
// Function gets the value of a css property as originally defined in the css file
// (original value even if later overridden in js)
function getOriginalStyle(selector, property) {
	// example use:
	// const originalDisplay = getOriginalStyle('.myClass', 'display');
	// console.log(originalDisplay); // Will output the display style like "flex"
	// To check actual current style, use:	console.log(window.getComputedStyle(myElement).display);
    for (const sheet of document.styleSheets) {
        for (const rule of sheet.cssRules || sheet.rules) {
            if (rule.selectorText === selector) {
                return rule.style[property] || null;
            }
        }
    }
    return null;
}


// // // SUPPORT FOR CLONING WITH EVENT LISTENERS  // // // 
// back support for cloning with event listeners
//  Wrap addEventListener to keep a registry on each element
function setupCloneWithListeners() { 
    const origAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, fn, opts) {
        this._clonedListeners ??= [];
        this._clonedListeners.push({ type, fn, opts });
        origAdd.call(this, type, fn, opts);
    };
} 
        
        
//  Deep-clone and re-attach the recorded listeners
function cloneWithListeners(source) {
    const clone = source.cloneNode(true);

    // Breadth-first walk over both trees in parallel
    const q = [[source, clone]];
    while (q.length) {
        const [orig, copy] = q.shift();

        // Copy listeners that were registered through our wrapper
        if (orig._clonedListeners) {
            orig._clonedListeners.forEach(({ type, fn, opts }) =>
                copy.addEventListener(type, fn, opts)
            );
        }

        // Enqueue child pairs
        const origKids = orig.children;
        const copyKids = copy.children;
        for (let i = 0; i < origKids.length; i++) {
            q.push([origKids[i], copyKids[i]]);
        }
    }
    return clone;
}

///// DEBUGGING FUNCTIONS ////
	
function simulateDelayWindow(ms, targetWindow){
	simulateDelay(ms,()=>{
		targetWindow.document.readyState='loading';
	});
}
function simulateDelay(ms,loopFun= () => {}){
	let start = new Date().getTime();
	let end = start;
	while (end < start + ms) {
	  	end = new Date().getTime();
		loopFun();
	} 
}
		
		
		
		

		