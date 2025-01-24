 



function processdata(inputarray){
		console.log("process data");		
		console.log(inputarray[0]);
		console.log(inputarray);
		
	}
 	


const upload = async (event) => {
  
    // Convert the FileList into an array and iterate
    let files = Array.from(event.target.files).map(file => {

        // Define a new file reader
        let reader = new FileReader();

        // Create a new promise
        return new Promise(resolve => {

            // Resolve the promise after reading file
            reader.onload = () => resolve(reader.result);

            // Read the file as a text
            reader.readAsArrayBuffer(file);

        });

    });

    // At this point you'll have an array of results
    let res = await Promise.all(files);
	console.log("here");
	console.log(res);
	for (i=0;i<res.length;i++){
		console.log(i);
		floatarray = new  Float32Array(res[i]);
		console.log(floatarray);
		console.log( new  Float32Array(res[i]));
	}
  
}
    

