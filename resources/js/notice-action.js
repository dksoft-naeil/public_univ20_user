document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/notice/detail") >= 0) getNotice();
  else if(window.location.pathname.indexOf("/notice/faq") >= 0) getListFaq();
  else if(window.location.pathname.indexOf("/notice/list") >= 0) getNoticeList(); 
});


function getNoticeList(page=1){
  let size = 10;
  let url = baseUrl + "/notices?state=0,3&offset=0&limit="+(page*size)+"&startDate=" + new Date().toISOString();       
  
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
    response.json().then((response) => {
        let grid= "";
        let paging= "";          
        let data = response.data.notices;
        let total = response.data.total;          
              
        for( let i = 0;  i < page*size && i<total; i++){
        //   // console.log('${values.title}'+ JSON.stringify(values))
        grid+=`<li class="list-post-content-box-item">
              <a href="../notice/detail.html?id=${data[i].id}" class="list-post-content-box-link">
                <div class="title">${data[i].title}</div>
                <div class="date">${dateToStrCharacterLength(strToDate(data[i].startDate), '.', 16)}</div>
              </a>
            </li>`;    
        }          

        if(total > page*size){
            paging = `<button type="button" class="btn medium bg-g4 full" onclick="getNoticeList(${(page+1)})">더보기</button>`;
        }          

        document.getElementById('list-grid').innerHTML  = grid;          
        document.getElementById('list-pagination').innerHTML = paging;          
      })                    
    }).catch(error => console.log(error));
}


function getNotice(){
  let u = window.location.href;
  let id;
  if(u.indexOf("?") > 0){
      path = u.substr(0 , u.indexOf("?"));        
      query = u.substr(u.indexOf("?") + 1);
      var pair = query.split('=');
      id = pair[1].indexOf('&') > -1 ? pair[1].substring(0, pair[1].indexOf('&')) :  pair[1];
  }
  // console.log('num' + id)
  if ( id === null){
    id = sessionStorage.getItem('id');
  }
  let url = baseUrl + "/notices?id="+id+"&offset=0&limit=100";        

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let info= "";
      let content= "";          
      let noticeData = response.data.notices;
      
      if(noticeData.length > 0){
      //   // console.log('${values.title}'+ JSON.stringify(values))
        info+=`<div class="article-report-title">${noticeData[0].title}</div>
              <div class="article-report-date">${dateToStrCharacterLength(strToDate(noticeData[0].startDate), '.', 10) + '. ' + dateToStrCharacterLength(strToDate(noticeData[0].startDate), '.', 16).substring(11, 16)}</div>`;    
        content+=noticeData[0].content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />");
      }    
  
      document.getElementById('htmlInfo').innerHTML  = info;          
      document.getElementById('htmlContent').innerHTML = content;   
    })                    
  }).catch(error => console.log(error));
}

function getListFaq(page=1, category=null){
  let size =7
  let url = baseUrl + "/faqs?state=0&offset=0&limit="+(page*size); 
  
  if(category !== null){
    url += "&category="+category;    
  } 

  
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
    response.json().then((response) => {
        let tab= "";
        let grid= "";
        let paging= "";          
        let data = response.data.faqs;
        let total = response.data.total;          

        tab = `<li class="content-tab-menu-box-item ${category===null?'active':''}">
              <button class="content-tab-menu-box-btn" onclick="getListFaq(${page})">
                <span>전체</span>
              </button>
            </li>
            <li class="content-tab-menu-box-item ${category===0?'active':''}">
              <button class="content-tab-menu-box-btn" onclick="getListFaq(${page}, 0)">
                <span>회원</span>
              </button>
            </li>
            <li class="content-tab-menu-box-item  ${category===1?'active':''}">
              <button class="content-tab-menu-box-btn" onclick="getListFaq(${page}, 1)">
                <span>기사</span>
              </button>
            </li>
            <li class="content-tab-menu-box-item  ${category===2?'active':''}">
              <button class="content-tab-menu-box-btn" onclick="getListFaq(${page}, 2)">
                <span>커뮤니티</span>
              </button>
            </li>`;          
        
        for( let i = 0;  i < page*size && i<data.length; i++){
          grid+=`<div class="list-content-box-accordion-item accordion-list">
              <div class="list-content-box-accordion-header accordion-header">
                <div class="category">${data[i].category===0?'회원':data[i].category===1?'기사':'커뮤니티'}</div>
                <div class="text">${data[i]?.question}</div>
              </div>
              <div class="list-content-box-accordion-body accordion-body">
                <div class="text-box">${data[i]?.answer.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />")}</div>
              </div>
            </div>` 
        }          

        if(total > page*size){
            paging = `<button type="button" class="btn medium bg-g4 full" onclick="getListFaq(${(page+1)}, ${category})">더보기</button>`;
        }
        
        document.getElementById('tab').innerHTML  = tab;      
        document.getElementById('list-grid').innerHTML  = grid;          
        document.getElementById('list-pagination').innerHTML = paging;        
        
      })                    
    }).catch(error => console.log(error));
}

function postQna() {
  if(document.getElementById("category").value.length ===0 ){
    layerPopup.openPopup('popup');
  }else if(document.getElementById('title').value.length === 0){
    layerPopup.openPopup('popup1');
  }else if(document.getElementById('content-textarea').value.length === 0){
    layerPopup.openPopup('popup2');
  }else{

    let url = baseUrl + "/qna/register";    
    
    let formData = new FormData();
    
    formData.append('category', document.getElementById("category").value); 
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
        layerPopup.openPopup('popup3');  
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
}

function postQnaCancel() {
  if(document.getElementById("category").value.length > 0
  || document.getElementById("title").value.length > 0 
  || document.getElementById("content-textarea").value.length > 0
  || files.length > 0){
    layerPopup.openPopup('popup4');  
  }else{
    location.href='../main/main.html';
  }
}