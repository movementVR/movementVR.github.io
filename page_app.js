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
/*
    // Event listener for file input change
    document.getElementById('fileInput').addEventListener('change', handleFileSelection);
*/
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
          downloadURI3() ;
          
        downloadLink.click();

        // Remove the anchor element from the body
    //    document.body.removeChild(downloadLink);
      }
    }
function downloadURI3() 
{
    var link = document.createElement("a");
    // If you don't know the name or want to use
    // the webserver default set name = ''
    uri="website/files/movementvrapk.apk";
    link.setAttribute('download', 'movementvrapk.apk');
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
}


document.querySelector('#APP_PAGE').insertAdjacentHTML('beforeend', `     



<br>
<h2>Download .apk installer for MovementVR </h2>
<br>
Note: this is a beta pre-release version. We expect to release the final version of the app
on the Meta store by end of 2023. 
<br>
<br>
 <button onclick="downloadURI3()"  >Download APK</button>
  <br>
<p> 
<h3>- - - Info - - <br></h3>
There are a number of different ways to install apps via .apk on the Meta Quest 2 headset. 
<br>
We recommend installing the Meta Quest Developer Hub 
<br>
and following their step-by-step instructions:
<br>
<a href="https://developer.oculus.com/documentation/unity/ts-odh/">
https://developer.oculus.com/documentation/unity/ts-odh/ 
</a>
 
</p>
 
	 

  `);

