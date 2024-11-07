function checkReport(){
  if(JSON.parse(!window.localStorage.getItem('me') || window.localStorage.getItem('me')).schoolId === null){
    layerPopup.openPopup('Popup8');
  }else if(document.getElementById('studentNumber').value.length === 0){
    layerPopup.openPopup('Popup3');
  }else if(document.getElementById('content-textarea').value.length === 0){
    layerPopup.openPopup('Popup4');
  }else if(files.length=== 0){
    layerPopup.openPopup('Popup5');
  }else if(document.getElementById('check-radio03').checked != true){
    layerPopup.openPopup('Popup6');
  }else{
    postProposal();
  }
}

function postProposal() {
  

      let formData = new FormData();

      formData.append('schoolId' , JSON.parse(window.localStorage.getItem('me')).schoolId);      
      formData.append('studentNumber' , document.getElementById('studentNumber').value);
      formData.append('content' , document.getElementById('content-textarea').value);
      formData.append('snsAccount' , document.getElementById('sns').value);

      for(let i=0; i<files.length; i++){
        formData.append('files', files[i], files[i].name);
      } 

      url = baseUrl + "/proposal/register";    

      const requestPost = new Request(url, {
        method: "POST",
        headers: headers.form_headers.headers,
        body: formData,
      });

      async function post(request) {
        try {
        await fetch(request)
        .then(response => {
          if(!response.ok){throw new Error(response.status)}
            return response.json();        
        })
        .then(data => {
          layerPopup.openPopup('Popup7');
        }).catch(error => {if(error.message === '401') logout() });
        
        } catch (error) {
          console.error("Error:", error);
        }      
      }

      post(requestPost);


  
}

function cancel() {
  if( document.getElementById('studentNumber').value.length > 0
      || document.getElementById('content-textarea').value.length > 0
      || document.getElementById('sns').value.length > 0
      || files.length > 0){
    layerPopup.openPopup('writeCancelPopup');
  }else{
    location.href = '../main/main.html';
  }
};

