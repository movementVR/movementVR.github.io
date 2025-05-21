function defInstallPaths() {
	// Paths Definitions 
	const installPaths = { 
		installApkPath: "web/app/movementvr.apk",
	};
	return installPaths;
}



async function selectDirectory() {
      try {
        // Open the file picker to select a directory
        const directoryHandle = await window.showDirectoryPicker();

        // Create or open a CSV file in the selected directory
        const fileHandle = await directoryHandle.getFileHandle('example.csv', { create: true });

        // Create a writable stream to the file
        const writable = await fileHandle.createWritable();

        // CSV content to be written
        const csvContent = 'Name, Age\nJohn Doe, 30\nJane Doe, 25';

        // Write the CSV content to the file
        await writable.write(csvContent);

        // Close the writable stream
        await writable.close();

        alert('CSV file saved successfully!');
      } catch (error) {
        console.error('Error selecting directory or saving file:', error);
      }
    }



  function selectFolder() {
      // Trigger the file input click programmatically
      document.getElementById('fileInput').click();
    }
 
    function handleFileSelection(event) {
      const fileInput = event.target;
      const selectedFile = fileInput.files[0];

      if (selectedFile) {
        // Create a data URI for the CSV content (replace with your CSV content)
      //  const csvContent = 'Name, Age\nJohn Doe, 30\nJane Doe, 25';
  //      const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);

        // Create an anchor element and set its attributes
        const downloadLink = document.createElement('a');
    //    downloadLink.href = dataUri;
  //      downloadLink.download = 'example.csv';

        // Append the anchor element to the body and trigger a click event
   //     document.body.appendChild(downloadLink);
          downloadMovementVR_APK() ;
          
        downloadLink.click();

        // Remove the anchor element from the body
    //    document.body.removeChild(downloadLink);
      }
    }
function downloadMovementVR_APK() 
{
    var link = document.createElement("a"); 
	uri=defInstallPaths().installApkPath;
    link.setAttribute('download', 'movementvr.apk');
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

