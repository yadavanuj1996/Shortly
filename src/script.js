async function copyPageUrl(shortenedLink,copyBtnId) {
  try {
    await navigator.clipboard.writeText(shortenedLink);
    document.getElementById(copyBtnId).innerHTML="Copied!";
    document.getElementById(copyBtnId).classList.add("copied-button");
    console.log('Page URL copied to clipboard '+copyBtnId);
    setTimeout(function(){ 
      document.getElementById(copyBtnId).innerHTML="Copy";
      document.getElementById(copyBtnId).classList.remove("copied-button"); 
      
     }, 3000);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}


let loadCurrentLinks = () => {
 
  let hashids = localStorage.getItem("hashDetails");
 if(hashids === null)
    return;
  
  document.getElementById("present-links").innerHTML="";
  
  let hashidsData = hashids.split(",");
  for (let i = 0; i < hashidsData.length; i++) {
    fetch(`https://rel.ink/api/links/${hashidsData[i]}/`)
      .then(response => response.json())
      .then(data => {
        console.log("Success:", data);
        let copyURL=`https://rel.ink/${data.hashid}`;
        document.getElementById("present-links").insertAdjacentHTML(
          "beforeend",
          ` <div class="link-details col-12 row col-md-10 offset-md-1">
       <div class="col-md-6 no-xs-padding">
        <p class="long-link">${data.url}</p>
        </div>
       <div class="col-md-4 no-xs-padding">
         <p class="short-link">https://rel.ink/${data.hashid}</p>
        </div>
       <div class="col-md-2 no-xs-padding">
          <button id="${data.hashid}" class="theme-cyan copy-btn" onclick="copyPageUrl('${copyURL}','${data.hashid}')">Copy</button>
        </div>
      </div>`
        );
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
 
};

if (localStorage.getItem("hashDetails")==="" || localStorage.getItem("hashDetails")=== null) {
  localStorage.setItem("hashDetails", "");
}
else {
  loadCurrentLinks();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("shorten-it-btn").addEventListener("click", () => {
    
    fetch("https://rel.ink/api/links/", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: document.getElementById("search-textbox").value
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log("Success:", data.hashid);
        if (data.hashid) {
          document
            .getElementById("search-textbox")
            .classList.remove("invalid-url");
          document
            .getElementById("search-textbox")
            .classList.remove("placeholder-color");
          document
            .getElementById("invalid-link-notification")
            .classList.remove("invlaid-notification");
          document
            .getElementById("search-textbox")
            .classList.remove("reduce-height");
          document
            .getElementById("search-bar-elements")
            .classList.remove("no-bottom-padding");

          let temp = localStorage.getItem("hashDetails");
          console.log('temp is '+temp);
          if(temp===null || temp.indexOf(data.hashid)>-1){
               document.getElementById("search-textbox").value = "";return;
            
             }
          else if (temp === "") {
            temp = data.hashid;
           
          } 
          else {
            temp = temp + "," + data.hashid;
          }

          localStorage.setItem("hashDetails", temp);
          console.log("flag"+ ' '+localStorage.getItem("hashDetails"));
          loadCurrentLinks();
      }
      else {
          document
            .getElementById("search-textbox")
            .classList.add("invalid-url");
          document
            .getElementById("search-textbox")
            .classList.add("placeholder-color");
          document
            .getElementById("invalid-link-notification")
            .classList.add("invlaid-notification");
          document
            .getElementById("search-textbox")
            .classList.add("reduce-height");
          document
            .getElementById("search-bar-elements")
            .classList.add("no-bottom-padding");
        }

        document.getElementById("search-textbox").value = "";
      })
      .catch(error => {
        console.error("Error:", error);
      });
  });
});
