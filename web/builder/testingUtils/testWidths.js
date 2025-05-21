
/* testWidths: single grid
Add to click tab as follows:
// 4) Loads the New Tab HTML Content from file 
			const filePath = builderPaths.builderParametersPath(tabName); 
			await loadHTML(filePath, tabpanelContainer, false);  
			await testWidthsV(staticBuilderWindow,tabpanelContainer);

			// 5) Sets up the New Tab Parameters Form
			builderPopupInputsSetup(staticBuilderWindow);
			
			// no  POST needed */
async function testWidths(staticBuilderWindow,container){

	// 1. Gets and clears form container
	const form = container.querySelector('.param-form');
	form.innerHTML='';

	// 2. List of parameter file paths
	const parameters = [
	"parameters/birdAnimations.html",
	"parameters/birdAppearance.html",
	"parameters/birdChange.html",
	"parameters/birdPerch.html",
	"parameters/birdSounds.html",
	"parameters/builderDownloadInstructions.html",
	"parameters/flowBreak.html",
	"parameters/flowFeedback.html",
	"parameters/flowGeneralFailurePlate.html",
	"parameters/flowGeneralFailureTime.html",
	"parameters/flowHome.html",
	"parameters/flowIntertrial.html",
	"parameters/flowOverallStart.html",
	"parameters/flowPlateContact.html",
	"parameters/flowPlateLiftTargetSuccess.html",
	"parameters/handRecording.html",
	"parameters/handTracking.html",
	"parameters/homeFeedback.html",
	"parameters/homeMesh.html",
	"parameters/homePosition.html",
	"parameters/messageBreak.html",
	"parameters/messageFeedback.html",
	"parameters/messageGeneralTrialNumber.html",
	"parameters/messageHome.html",
	"parameters/messageIntertrial.html",
	"parameters/messagePlateContact.html",
	"parameters/messagePlateLift.html",
	"parameters/messagesOverallEnd.html",
	"parameters/messagesOverallStart.html",
	"parameters/perturbationMagnitude.html",
	"parameters/perturbationOrigin.html",
	"parameters/perturbationSchedule.html",
	"parameters/perturbationSmoothing.html",
	"parameters/plateFeedback.html",
	"parameters/plateGrape.html",
	"parameters/plateHome.html",
	"parameters/plateObject.html",
	"parameters/plateStand.html",
	"parameters/targetFeedback.html",
	"parameters/targetMesh.html",
	"parameters/targetPosition.html"
	];

	// 3. Loop through each parameter file, load the content, parse it, and extract the fieldset(s)
	for (const paramPath of parameters) {
		// Extract the base file name (e.g. "birdAnimations" from "parameters/birdAnimations.html")
		const fileName = paramPath.split('/').pop().replace('.html', '');
		
		// Construct the URL for fetching the HTML content
		const url = `web/builder/parameters/${fileName}.html`;  
		const response = await fetch(url); 
		const htmlText = await response.text();

		// Create a temporary container to parse the fetched HTML
		const tempDiv = staticBuilderWindow.document.createElement("div");
		tempDiv.innerHTML = htmlText;

		// Find all fieldset elements with the class "trial-builder-group"
		const fieldsets = tempDiv.querySelectorAll('fieldset.trial-builder-group');
		fieldsets.forEach(fieldset => {
			// Append each found fieldset into the created form
			form.appendChild(fieldset);
		}); 
	}
	
	// 4. Sets up inputs and Gets Style -> columns widths
	builderPopupInputsSetup(staticBuilderWindow);  

	const style = window.getComputedStyle(form);
	// Get grid-template-columns e.g. "100px 200px 300px"
	const templateColumns = style.getPropertyValue('grid-template-columns');
	const columns = templateColumns.split(' ')
				  .map(col => col.trim())
				  .filter(col => col.length > 0);

	console.log(templateColumns);	
	console.log(columns);
	
	// Currently 158.531px 378.688px 40px

  
} 	

/* testWidthSeparatePrep+testWidthSeparateAssess: individual grids
Add to click tab as follows:
// 4) Loads the New Tab HTML Content from file 
			const filePath = builderPaths.builderParametersPath(tabName); 
			await loadHTML(filePath, tabpanelContainer, false);  
			await testWidthsV2(staticBuilderWindow,tabpanelContainer);

			// 5) Sets up the New Tab Parameters Form
			builderPopupInputsSetup(staticBuilderWindow);
			
			 testWidthPost(staticBuilderWindow);*/


async function testWidthSeparatePrep(staticBuilderWindow,container){

	// 1. Gets and clears container
	container.innerHTML='';
	container.style.flexDirection = 'column';

	// 2. List of parameter file paths
	const parameters = [
	"parameters/birdAnimations.html",
	"parameters/birdAppearance.html",
	"parameters/birdChange.html",
	"parameters/birdPerch.html",
	"parameters/birdSounds.html",
	"parameters/builderDownloadInstructions.html",
	"parameters/flowBreak.html",
	"parameters/flowFeedback.html",
	"parameters/flowGeneralFailurePlate.html",
	"parameters/flowGeneralFailureTime.html",
	"parameters/flowHome.html",
	"parameters/flowIntertrial.html",
	"parameters/flowOverallStart.html",
	"parameters/flowPlateContact.html",
	"parameters/flowPlateLiftTargetSuccess.html",
	"parameters/handRecording.html",
	"parameters/handTracking.html",
	"parameters/homeFeedback.html",
	"parameters/homeMesh.html",
	"parameters/homePosition.html",
	"parameters/messageBreak.html",
	"parameters/messageFeedback.html",
	"parameters/messageGeneralTrialNumber.html",
	"parameters/messageHome.html",
	"parameters/messageIntertrial.html",
	"parameters/messagePlateContact.html",
	"parameters/messagePlateLift.html",
	"parameters/messagesOverallEnd.html",
	"parameters/messagesOverallStart.html",
	"parameters/perturbationMagnitude.html",
	"parameters/perturbationOrigin.html",
	"parameters/perturbationSchedule.html",
	"parameters/perturbationSmoothing.html",
	"parameters/plateFeedback.html",
	"parameters/plateGrape.html",
	"parameters/plateHome.html",
	"parameters/plateObject.html",
	"parameters/plateStand.html",
	"parameters/targetFeedback.html",
	"parameters/targetMesh.html",
	"parameters/targetPosition.html"
	];

	// 3. Loop through each parameter file, load the content, parse it, and extract the fieldset(s)
	for (const paramPath of parameters) {
		// Extract the base file name (e.g. "birdAnimations" from "parameters/birdAnimations.html")
		const fileName = paramPath.split('/').pop().replace('.html', '');
		
		// Construct the URL for fetching the HTML content
		const url = `web/builder/parameters/${fileName}.html`;  
		const response = await fetch(url); 
		const htmlText = await response.text();

		// Create a temporary container to parse the fetched HTML
		const tempDiv = staticBuilderWindow.document.createElement("div");
		tempDiv.innerHTML = htmlText;

		// Find all fieldset elements with the class "trial-builder-group"
		const fieldsets = tempDiv.querySelectorAll('fieldset.trial-builder-group');
		fieldsets.forEach(fieldset => { 
			// creates one form per fieldset
			const form = staticBuilderWindow.document.createElement("form");
			form.className = 'param-form'; 
			container.appendChild(form);
			// Append each found fieldset into the created form
			form.appendChild(fieldset);
			form.setAttribute('filename',fileName);
			
		}); 
	} 
} 	

function testWidthSeparateAssess(staticBuilderWindow){
	
	// 4. Gets the widths		
	// Global variables to store maximum widths (in pixels)
	let maxCol1Width = 0;
	let maxCol2Width = 0;
	let maxColWidth = 0;
	let maxCol1File = '';
	let maxCol2File = '';
	let maxColFile = '';
	let count=0;	  
  	let storeArray = []; // Create one array to store both the width and the corresponding file name
	
	// Get all inputgrid elements in the current document fragment
	staticBuilderWindow.document.querySelectorAll('.param-form').forEach(form => {	 

		const style = window.getComputedStyle(form);
		// Get grid-template-columns e.g. "100px 200px 300px"
		const templateColumns = style.getPropertyValue('grid-template-columns');
		const columns = templateColumns.split(' ')
					  .map(col => col.trim())
					  .filter(col => col.length > 0);
		
		const htmlFileName = form.getAttribute('filename');
		
		// If there are at least two columns, parse the widths
		if (columns.length >= 2) { 
			// Try to extract a numeric pixel value from each column definition.
			// This works if your column widths are defined as fixed values like "100px".
			const col1Width = parseFloat(columns[0]);
			const col2Width = parseFloat(columns[1]);
			const colWidth = col1Width + col2Width;

			if (!isNaN(col1Width) && col1Width > maxCol1Width) {
				maxCol1Width = col1Width;
				maxCol1File = htmlFileName;
			}
			if (!isNaN(col2Width) && col2Width > maxCol2Width) {
				maxCol2Width = col2Width;
				maxCol2File = htmlFileName;
			}
			if (!isNaN(colWidth) && colWidth > maxColWidth) {
				maxColWidth = colWidth;
				maxColFile = htmlFileName;
			}
			   
			// Store the total max width and file together as an object
		    storeArray.push({
				width: colWidth,
				file: htmlFileName
		    });
		
		} else{
			
			console.log('!NOT!'+htmlFileName);
		}
		count++; 
	});
	
	// Sort the combined array in descending order based on width
	storeArray.sort((a, b) => b.width - a.width);	 
  	console.log("All widths:", storeArray);		 
  	console.log(storeArray);
	
	
	// Log the maximum widths found so far (these accumulate across loaded files)
	console.log("Count:", count );
	console.log("1st Max:", maxCol1Width + "px, ",maxCol1File);
	console.log("2nd Max:", maxCol2Width + "px, ",maxCol2File); 
	console.log("Tot Max:", maxColWidth + "px, ",maxColFile); 
	

	
	
	// 1st Max: 240px,  perturbationSmoothing
	// 2nd Max: 382.854px,  flowHome
	// Tot Max: 524.479px,  handTracking
		 
		
		// Currently 158.531px 378.688px 40px
/* 1st Max: 158.531px,  flowGeneralFailurePlate
 2nd Max: 378.688px,  perturbationSmoothing
 Tot Max: 516.094px,  flowGeneralFailurePlate*/
}
