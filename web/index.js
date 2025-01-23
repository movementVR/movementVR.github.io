
// Tabs definition
const pages = [
    { text: 'HOME', name: 'home'},
    { text: 'INSTALL APP', name: 'install'},
    { text: 'DESIGN PARADIGM', name: 'builder' }, 
    { text: 'EXPORT DATA', name: 'export' }
];
 
document.addEventListener("DOMContentLoaded", function() {  
    
    /* OVERALL TOP NAVIGATION MENU */
    const parentTabContainer = document.createElement('div');
    parentTabContainer.className = 'parenttab';
    document.body.appendChild(parentTabContainer);
    
    
    // Logo
    const logoContainer = document.createElement('span');
    logoContainer.className = 'logocontainer'; 
    parentTabContainer.appendChild(logoContainer);

    const logoImg = document.createElement('img');
    logoImg.src = 'web/img/logo.png';
    logoImg.className = 'logoimg'; 
    logoContainer.appendChild(logoImg);

    // Tabs
    pages.forEach(({ text, name }) => {
        const button = document.createElement('button');
        button.id = name + '_buttonID';
        button.className = 'pagelink';
        button.textContent = text;
        button.onclick = () => openPage(name, button);
        parentTabContainer.appendChild(button);
        populateTabPage(name);
    });  
    document.getElementById('home_buttonID').click();
	
	 if (!sessionStorage.getItem("reloaded")) {
        sessionStorage.setItem("reloaded", "true");
        location.reload();
    }

});
                          
                          
function openPage(name,selectedPageLink) {
    const tabID=name+'_tabID';
    allPages = document.getElementsByClassName("pagecontainer"); // initialized allPages variable 
    for (i = 0; i < allPages.length; i++) {   // "closes" all the pages
            allPages[i].style.display = "none";
    }
    document.getElementById(tabID).style.display = "block";  // opens selected tab

    allPageLinks = document.getElementsByClassName("pagelink");  			
    for (i = 0; i < allPageLinks.length; i++) {   // resets page links font weight
            allPageLinks[i].style.fontWeight = 600; 
    }			
    selectedPageLink.style.fontWeight = 820;

}







function populateTabPage(name){  
    /* creates page container  */ 
    const pageContainer = document.createElement('div');
    pageContainer.className = 'pagecontainer';
    pageContainer.id = name+'_tabID';
    document.body.appendChild(pageContainer);
    const folderPath='web/'+name;
    const htmlFileName=folderPath+'/'+name+'.html'; 
    const jsonPath=folderPath+'/'+name+'.json';  
    const generalJsonPath='web/general/general.json'; 
       
    fetch(htmlFileName) 
        .then(response => response.text())
        .then(html => { 
        const parser = new DOMParser(); // Create a DOMParser instance
        const doc = parser.parseFromString(html, 'text/html'); // Parse the string into a DOM document        
        pageContainer.innerHTML += doc.body.innerHTML; 
        includeFilesFromJson(jsonPath); 
        includeFilesFromJson(generalJsonPath);  
        }); 
} 
 
                  