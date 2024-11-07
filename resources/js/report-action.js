function checkReport(){
  if(document.getElementById('title').value.length === 0){
    layerPopup.openPopup('Popup2');
  }else if(document.getElementById('content-textarea').value.length === 0){
    layerPopup.openPopup('Popup3');
  }else if(document.getElementById('check-radio02').checked != true){
    layerPopup.openPopup('Popup4');
  }else{
    layerPopup.openPopup('Popup5');
  }
}

  function postReport() {

  let url = baseUrl + "/report/register";    
   
  let formData = new FormData();
  
  formData.append('title' , document.getElementById('title').value);
  formData.append('content' , document.getElementById('content-textarea').value);

  for(let i=0; i<files.length; i++){
    formData.append('files', files[i], files[i].name);
  } 
   
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
      layerPopup.openPopup('Popup6');
    }).catch(error => {if(error.message === '401') logout() });
    
    } catch (error) {
      console.error("Error:", error);
    }      
  }

  post(requestPost);
}

function cancel() {
  if(document.getElementById('title').value.length > 0
      || document.getElementById('content-textarea').value.length > 0
      || files.length > 0){
    layerPopup.openPopup('writeCancelPopup');
  }else{
    location.href = '../main/main.html';
  }
};
