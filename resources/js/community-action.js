document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/community/detail") >= 0) getDetail();
  else if(window.location.pathname.indexOf("/community/community") >= 0) get();
  else if(window.location.pathname.indexOf("/community/list-all") >= 0) getListAll();
  else if(window.location.pathname.indexOf("/community/list") >= 0) getList();
  else if(window.location.pathname.indexOf("/community/register") >= 0) getCreate();
  else if(window.location.pathname.indexOf("/community/search") >= 0) getSearch();
});

window.addEventListener("load",() => {  
  setTimeout(()=>{
    if (!$('.comment-input-box').length) return;

    // focus
    $('.comment-input-box-active .form-textarea').on('focus', function (e) {
      if (!$(this).closest('.textarea-box').hasClass('show')) {
        $(this).closest('.textarea-box').addClass('show');
      }
    });

    // keyup
    $('.comment-input-box-active .form-textarea').on('keyup', function () {
      $(this).closest('.textarea-box').addClass('writing');

      if ($(this).val().length == 0) {
        $(this).closest('.textarea-box').removeClass('writing');
      }
    });

    // 다른 부분 클릭 시 제거
    $('body').click(function (e) {
      if ($(e.target).parents('.comment-input-box-active').length < 1 && $(e.target).attr('class') !== 'comment-input-box-active') {
        $('.textarea-box').removeClass('show');
      }
    });

    window.scrollToolbar()
  },1000);  
  
});

function postFlagFloating(type, state) {
  let u = window.location.href;
  let id;
  let category;
  if(u.indexOf("?") > 0){
      path = u.substr(0 , u.indexOf("?"));        
      query = u.substr(u.indexOf("?") + 1);
      var pair = query.split('=');
      id = pair[1].indexOf('&') > -1 ? pair[1].substring(0, pair[1].indexOf('&')) :  pair[1];
      category = pair[2]?.length > 0 ? pair[2] : null ;
  }
  // console.log('num' + id)
  if ( id === null){
    id = sessionStorage.getItem('id');
  }

  if( !window.localStorage.getItem("me") || window.localStorage.getItem("me").length == 0){
    document.getElementById("popup-base-message").innerHTML = `<strong>로그인 후 '댓글 좋아요' 하실 수 있어요.</strong>`;    
    layerPopup.openPopup('popup-base'); 
  }else if(state == 0){
    let url = baseUrl + "/community-flag/register";    
 
    let params = {
      communityId: id,
      commentId: 0,
      type : type
    }
    const requestPost = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
    });
  
    async function post(request) {
      try {
      await fetch(request)
      .then(response => {
        if(!response.ok){throw new Error(response.status)}
          return response.json();        
      })
      .then(data => {
          if(type==0){        
          document.getElementById("likeCountAside").innerHTML = Number(document.getElementById("likeCountAside").innerHTML) + 1;
          document.getElementById("likeCountTitle").innerHTML = Number(document.getElementById("likeCountTitle").innerHTML) + 1;
          document.getElementById('floating-like').innerHTML = `<button class="floating-toolbar-btn active-btn like-btn check" onclick="postFlagFloating(0, 1)"><i class="icon-box icon-like"></i>좋아요</button>`;
        }else{
          layerPopup.openPopup('loginInfoPopup6');
          document.getElementById('floating-save').innerHTML = `<button class="floating-toolbar-btn active-btn save-btn check" onclick="postFlagFloating(1, 1)"><i class="icon-box icon-bookmark"></i>저장하기</button>`; 
   
        }      
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }
  
    post(requestPost);
  }else{
    let url = baseUrl + "/community-flag";    
 
    let params = {
      communityId: id,
      commentId: 0,
      state : state,
      type : type
    }
    const requestPost = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
    });
  
    async function _post(request) {
      try {
      await fetch(request)
      .then(response => {
        if(!response.ok){throw new Error(response.status)}
          return response.json();        
      })
      .then(data => {   
        if(type==0){        
          document.getElementById("likeCountAside").innerHTML = Number(document.getElementById("likeCountAside").innerHTML) + (state==0?1:-1);
          document.getElementById("likeCountTitle").innerHTML = Number(document.getElementById("likeCountTitle").innerHTML) + (state==0?1:-1);
          document.getElementById('floating-like').innerHTML = `<button class="floating-toolbar-btn active-btn like-btn ${state== 0 ? 'check' :''}" onclick="postFlagFloating(0, ${state== 0?1:0})"><i class="icon-box icon-like"></i>좋아요</button>`;
        }else{
          document.getElementById('floating-save').innerHTML = `<button class="floating-toolbar-btn active-btn save-btn ${state== 0 ? 'check' :''}" onclick="postFlagFloating(1, ${state== 0?1:0})"><i class="icon-box icon-bookmark"></i>저장하기</button>`; 
        }
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }
  
    _post(requestPost);
  }
 
}

function get(){  
  let meInfo = '';
  
  if(window?.localStorage?.getItem('me'))
  {
    meInfo = JSON?.parse(window?.localStorage?.getItem('me'));
  }
   
  let url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&isRanking=1&offset=0&limit=5&sort=popularity";    

  if(meInfo.length > 0){
    url += "&schoolId=" + meInfo?.schoolId;
  }
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let ranking= "";      
      let data = response.data.communities;
     
      for(let i=0; i<data.length ; i++){
        ranking+=`<div class="swiper-slide">
          <div class="best-topic-box">
            <a href="../community/detail.html?id=${data[i]?.id}&isRanking=1" class="best-topic-box-link">
              <div class="number"><em>${i+1}</em></div>
              <div class="subject">${data[i]?.title}</div>
              <div class="info-box">
                <div class="read">
                  <span class="label">읽음</span>
                  <span class="count">${unitNumberWithCommas(data[i]?.showCount)}</span>
                </div>
                <div class="comment">
                  <span class="label">댓글</span>
                  <span class="count">${unitNumberWithCommas(data[i]?.commentCount)}</span>
                </div>
                <div class="like">
                  <span class="label">좋아요</span>
                  <span class="count">${unitNumberWithCommas(data[i]?.likeCount)}</span>
                </div>
              </div>
            </a>
          </div>
        </div>`;         
      }      
      document.getElementById('date').innerHTML  = `${new Date().getFullYear()}. ${new Date().getMonth()+1}. ${new Date().getDate()}. ${new Date().getHours()}:00 기준`;          
      document.getElementById('ranking').innerHTML  = ranking;          
    })                    
  }).catch(error => console.log(error));

  // 일상
  url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&category=2&offset=0&limit=10&type=0"; 

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {      
      let more= "";      
      let dataNotice = response.data.communities;
      let totalNotice = response.data.total;
        
        url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&category=2&offset=0&limit="+(10-totalNotice)+"&type=1";    

        fetch(url, headers.json_headers)
        .then((response) => {
          checkError(response.status);
    response.json().then((response) => {      
            let list= "";
            let data = response.data.communities;

            more += `<div class="title">
                      <strong>☀️ 일상</strong>
                    </div>
                    <a href="../community/list.html?category=2" class="add-more-btn">더보기 <i class="icon-box icon-arrow-right-black">화살표</i></a>`;

            if(dataNotice.length > 0 || data.length > 0){
              list += `<ul class="topic-list">
                  <!-- 이미지가 포함된 게시물에 a태그에 image 클래스 추가, 공지일 경우 li태그에 notice 클래스 추가 -->`;

              for(let i = 0; i<dataNotice.length ; i++){
                list+=`<li class="topic-item notice">
                  <a href="../community/detail.html?id=${dataNotice[i]?.id}&isRanking=0" class="topic ${dataNotice[i].fileExists === 1?'image':''}">
                    <span class="subject">[공지] ${dataNotice[i]?.title}</span>
                    <span class="comment">(${numberWithCommas(dataNotice[i]?.commentCount)})</span>
                  </a>
                </li>`;                        
              }

              for(let i = 0; i<data.length; i++){               
                list+=`<li class="topic-item">
                      <a href="../community/detail.html?id=${data[i]?.id}&isRanking=0" class="topic ${data[i].fileExists === 1?'image':''}">
                        <span class="subject">${data[i]?.title}</span>
                        <span class="comment">(${numberWithCommas(data[i]?.commentCount)})</span>
                      </a>
                    </li>`;                          
              }

              list += `</ul>`;
            }else{
              list += `<div class="info-text">
                          등록된 글이 없습니다.<br />
                            첫 글의 주인공이 되어보세요.
                        </div>`;
            }                 
                  
            document.getElementById('more2').innerHTML  = more;         
            document.getElementById('list2').innerHTML  = list;          
          })                    
        }).catch(error => console.log(error));
      })                    
    }).catch(error => console.log(error));

  // 연애
  url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&category=0&offset=0&limit=10&type=0"; 
     
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {      
      let more= "";      
      let dataNotice = response.data.communities;
      let totalNotice = response.data.total;
        
        url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&category=0&offset=0&limit="+(10-totalNotice)+"&type=1";    

        fetch(url, headers.json_headers)
        .then((response) => {
          checkError(response.status);
    response.json().then((response) => {      
            let list= "";
            let data = response.data.communities;

            more += `<div class="title">
                      <strong>💕 연애</strong>
                    </div>
                    <a href="../community/list.html?category=0" class="add-more-btn">더보기 <i class="icon-box icon-arrow-right-black">화살표</i></a>`;

            if(dataNotice.length > 0 || data.length > 0){
              list += `<ul class="topic-list">
                  <!-- 이미지가 포함된 게시물에 a태그에 image 클래스 추가, 공지일 경우 li태그에 notice 클래스 추가 -->`;

              for(let i = 0; i<dataNotice.length ; i++){               
              list+=`<li class="topic-item notice">
                  <a href="../community/detail.html?id=${dataNotice[i]?.id}&isRanking=0" class="topic ${dataNotice[i].fileExists === 1?'image':''}">
                    <span class="subject">[공지] ${dataNotice[i]?.title}</span>
                    <span class="comment">(${numberWithCommas(dataNotice[i]?.commentCount)})</span>
                  </a>
                </li>`;                   
              }

              for(let i = 0; i<data.length; i++){                
                list+=`<li class="topic-item">
                        <a href="../community/detail.html?id=${data[i]?.id}&isRanking=0" class="topic ${data[i].fileExists === 1?'image':''}">
                          <span class="subject">${data[i]?.title}</span>
                          <span class="comment">(${numberWithCommas(data[i]?.commentCount)})</span>
                        </a>
                      </li>`;                  
              }
              list += `</ul>`;
            }else{
              list += `<div class="info-text">
                          등록된 글이 없습니다.<br />
                            첫 글의 주인공이 되어보세요.
                        </div>`;
            }                 
                  
            document.getElementById('more0').innerHTML  = more;         
            document.getElementById('list0').innerHTML  = list;          
          })                    
        }).catch(error => console.log(error));
      })                    
    }).catch(error => console.log(error));

  // 진로
  url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&category=1&offset=0&limit=10&type=0";   
   
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {      
      let more= "";      
      let dataNotice = response.data.communities;
      let totalNotice = response.data.total;
        
        url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&category=1&offset=0&limit="+(10-totalNotice)+"&type=1";  

        fetch(url, headers.json_headers)
        .then((response) => {
          checkError(response.status);
    response.json().then((response) => {      
            let list= "";
            let data = response.data.communities;

            more += `<div class="title">
                      <strong>✈️ 진로</strong>
                    </div>
                    <a href="../community/list.html?category=1" class="add-more-btn">더보기 <i class="icon-box icon-arrow-right-black">화살표</i></a>`;

            if(dataNotice.length > 0 || data.length > 0){
              list += `<ul class="topic-list">
                  <!-- 이미지가 포함된 게시물에 a태그에 image 클래스 추가, 공지일 경우 li태그에 notice 클래스 추가 -->`;

              for(let i = 0; i<dataNotice.length ; i++){                
                list+=`<li class="topic-item notice">
                    <a href="../community/detail.html?id=${dataNotice[i]?.id}&isRanking=0" class="topic ${dataNotice[i].fileExists === 1?'image':''}">
                      <span class="subject">[공지] ${dataNotice[i]?.title}</span>
                      <span class="comment">(${numberWithCommas(dataNotice[i]?.commentCount)})</span>
                    </a>
                  </li>`;                                       
              }

              for(let i = 0; i<data.length; i++){               
                list+=`<li class="topic-item">
                        <a href="../community/detail.html?id=${data[i]?.id}&isRanking=0" class="topic ${data[i].fileExists === 1?'image':''}">
                          <span class="subject">${data[i]?.title}</span>
                          <span class="comment">(${numberWithCommas(data[i]?.commentCount)})</span>
                        </a>
                      </li>`;  
              }

              list += `</ul>`;
            }else{
              list += `<div class="info-text">
                          등록된 글이 없습니다.<br />
                            첫 글의 주인공이 되어보세요.
                        </div>`;
            }                 
                  
            document.getElementById('more1').innerHTML  = more;         
            document.getElementById('list1').innerHTML  = list;          
          })                    
        }).catch(error => console.log(error));
      })                    
    }).catch(error => console.log(error));

  // 우리 학교
  url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&category=3&offset=0&limit=10&type=0";    
  
  if(meInfo.length > 0){
    url += "&schoolId=" + meInfo?.schoolId;
  }

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {      
      let more= "";      
      let dataNotice = response.data.communities;
      let totalNotice = response.data.total;
        
        url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&category=3&offset=0&limit="+(10-totalNotice)+"&type=1"; 
          
        if(meInfo.length > 0){
          url += "&schoolId=" + meInfo?.schoolId;
        }

        fetch(url, headers.json_headers)
        .then((response) => {
          checkError(response.status);
    response.json().then((response) => {      
            let list= "";
            let data = response.data.communities;

            if(!window.localStorage.getItem('me')){
              
              more += `<div class="title">
              <strong>🏫 우리 학교</strong>
            </div>
            <a href="javascript:layerPopup.openPopup('loginInfoPopup')" class="add-more-btn">더보기 <i class="icon-box icon-arrow-right-black">화살표</i></a>`;
            }else if(!window.localStorage.getItem('me') || JSON.parse(window.localStorage.getItem('me'))?.schoolId== null){
              more += `<div class="title">
              <strong>🏫 우리 학교</strong>
            </div>
            <a href="javascript:layerPopup.openPopup('loginInfoPopup2')" class="add-more-btn">더보기 <i class="icon-box icon-arrow-right-black">화살표</i></a>`;
            }else{
              more += `<div class="title">
              <strong>🏫 우리 학교</strong>
            </div>
            <a href="../community/list.html?category=3&schoolId=${meInfo.schoolId}" class="add-more-btn">더보기 <i class="icon-box icon-arrow-right-black">화살표</i></a>`;
            }      

            if((dataNotice.length > 0 || data.length > 0 ) && meInfo?.schoolId != null){
              list += `<ul class="topic-list">`;

              for(let i = 0; i<dataNotice.length ; i++){                    
                list+=`<li class="topic-item notice">
                    <a href="../community/detail.html?id=${dataNotice[i]?.id}&isRanking=0" class="topic ${dataNotice[i].fileExists === 1?'image':''}">
                      <span class="subject">[공지] ${dataNotice[i]?.title}</span>
                      <span class="comment">(${numberWithCommas(dataNotice[i]?.commentCount)})</span>
                    </a>
                  </li>`;      
              }

              for(let i = 0; i<data.length; i++){                
                list+=`<li class="topic-item">
                      <a href="../community/detail.html?id=${data[i]?.id}&isRanking=0" class="topic ${data[i].fileExists === 1?'image':''}">
                        <span class="subject">${data[i]?.title}</span>
                        <span class="comment">(${numberWithCommas(data[i]?.commentCount)})</span>
                      </a>
                    </li>`;                             
              }  
  
              list += `</ul>`;
            }else{
              list += `<div class="info-text">
                          우리 학교 커뮤니티는<br />
                      대학생 인증 후 이용할 수 있어요.
                        </div>`;
            }                 
                  
            document.getElementById('more3').innerHTML  = more;         
            document.getElementById('list3').innerHTML  = list;          
          })                    
        }).catch(error => console.log(error));
      })                    
    }).catch(error => console.log(error));

  // 배너
  url = baseUrl + "/banners?category=6&state=0,3&offset=0&limit=999&startDate=" + new Date().toISOString() + "&endDate=" + new Date().toISOString();         
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let html= "";
      
      let data = response.data.banners;

      if(data.length > 0){
        let index =  Math.floor(Math.random() * ((data.length)));
                          
        html=`<a href="${data[index].href}" target="_blank" class="banner-link" onclick="get()"></a>
          <div class="banner">          
            ${data[index].file1?'<img src="'+data[index].file1+'" class="pc-show" alt="광고 배너" />':''}
            ${data[index].file2?'<img src="'+data[index].file2+'" class="mobile-show" alt="광고 배너" />':''}
          </div>`;          
      }    

      document.getElementById('banners').innerHTML  = html;                    
    })                    
  }).catch(error => console.log(error));

}

function search(){
  if(!window.localStorage.getItem('me')){      
    layerPopup.openPopup('loginInfoPopup4');
  }else{
    let param = document.getElementById("search-keyword").value;  
    window.location.href='../community/search.html?param='+param;
  }      
}

function enterSearch(e){
  if(e.keyCode==13){
    search()
  }    
}

function goRegister(category=""){
  if(!window.localStorage.getItem('me') ){      
    layerPopup.openPopup('loginInfoPopup');
  }else{
    window.location.href='../community/register.html?category=' + category;
  }   
}

function enterGoList(e){
  if(e.keyCode==13){
    goList()
  }    
}

function goList(){
  if(!window.localStorage.getItem('me')){      
    layerPopup.openPopup('loginInfoPopup4');
  }else{
    getList();
  }   
}

function goListAll(){
  if(!window.localStorage.getItem('me')){      
    layerPopup.openPopup('loginInfoPopup4');
  }else{
    getListAll();
  }   
}

function enterGetSearch(e){
  if(e.keyCode==13){
    getSearch()
  }    
}


function getSearch(page = 0, size = 20, category = 2){ 
  let meInfo = '';
  
  if(window.localStorage.getItem('me')){
    meInfo= JSON.parse(window.localStorage.getItem('me'));
  } 

  if(!window.localStorage.getItem('me')){      
    layerPopup.openPopup('loginInfoPopup4');
  }else{
    let u = window.location.href;
    let param;  
    let htmlInput = "";
    let htmlTab = "";
    let htmlListPc = "";
    let htmlListMobile = "";
    let pagingPc = "";
    let pagingMobile = "";
    let url = "";

    if(u.indexOf("?") > 0){
        path = u.substr(0 , u.indexOf("?"));        
        query = u.substr(u.indexOf("?") + 1);
        var pair = query.split('=');
        param = pair[1].indexOf('#') > -1 ? pair[1].substring(0, pair[1].indexOf('#')) :  pair[1];
    }

    if ( param === null){
      param = sessionStorage.getItem('param');
    }

    param = document?.getElementById("search-keyword")?.value?.length > 0 ?document.getElementById("search-keyword").value : param; 

    htmlInput = `<div class="input-cover" >
                  <span class="form-label txt-hidden">검색</span>
                  <input type="text" id="search-keyword" name="search" title="검색" class="form-input" autocomplete="off" value="${param==null?'검색어 입력 예시':decodeURIComponent(param)}" placeholder="검색하실 글 내용을 입력하세요." onkeypress="enterGetSearch(event)"/>
                </div>
                <button type="button" class="search-button" onclick="getSearch()">
                  <i class="icon-box icon-search"></i>
                  <span>검색하기</span>
                </button>
                  `;

    url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&category=2&offset=0&type=0"; 
    if(param.length > 0){
      url += "&keyword=" + param;
    }

    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
    response.json().then((response) => {      
        let totalNotice2 = response.data.total;   
        let dataNotice2 = response.data.communities;         

        url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&category=2&offset=0&type=1"; 
        if(param.length > 0){
          url += "&keyword=" + param;
        }
      
        fetch(url, headers.json_headers)
        .then((response) => {
          checkError(response.status);
    response.json().then((response) => {      
            let total2 = response.data.total;   
            let data2 = response.data.communities;         
      
            url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&category=0&offset=0&type=0"; 
            if(param.length > 0){
              url += "&keyword=" + param;
            }
          
            fetch(url, headers.json_headers)
            .then((response) => {
              checkError(response.status);
    response.json().then((response) => {      
                let totalNotice0 = response.data.total;   
                let dataNotice0 = response.data.communities;         
                url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&category=0&offset=0&type=1"; 
                if(param.length > 0){
                  url += "&keyword=" + param;
                }
              
                fetch(url, headers.json_headers)
                .then((response) => {
                  checkError(response.status);
    response.json().then((response) => {      
                    let total0 = response.data.total;   
                    let data0= response.data.communities;         
              
                    url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&category=1&offset=0&type=0"; 
                    if(param.length > 0){
                      url += "&keyword=" + param;
                    }
                  
                    fetch(url, headers.json_headers)
                    .then((response) => {
                      checkError(response.status);
    response.json().then((response) => {      
                        let totalNotice1 = response.data.total;   
                        let dataNotice1 = response.data.communities;         
                        url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&category=1&offset=0&type=1"; 
                        if(param.length > 0){
                          url += "&keyword=" + param;
                        }
                      
                        fetch(url, headers.json_headers)
                        .then((response) => {
                          checkError(response.status);
    response.json().then((response) => {      
                            let total1 = response.data.total;   
                            let data1 = response.data.communities;         
                      
                            url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&category=3&offset=0&type=0&schoolId=" + meInfo.schoolId; 
                            if(param.length > 0){
                              url += "&keyword=" + param;
                            }
                          
                            fetch(url, headers.json_headers)
                            .then((response) => {
                              checkError(response.status);
    response.json().then((response) => {      
                                let totalNotice3 = response.data.total;   
                                let dataNotice3 = response.data.communities;         
                          
                                url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&category=3&offset=0&type=1&schoolId=" + meInfo.schoolId; 
                                if(param.length > 0){
                                  url += "&keyword=" + param;
                                }
                              
                                fetch(url, headers.json_headers)
                                .then((response) => {
                                  checkError(response.status);
    response.json().then((response) => {      
                                    let total3 = response.data.total;   
                                    let data3 = response.data.communities;       
                                    
                                    if(category===2){
                                      htmlTab = ` <li class="content-tab-menu-box-item active">
                                      <a href="#magazine" class="content-tab-menu-box-btn" onclick="getSearch(0, 20, 2)">
                                        <span>☀️ 일상</span>
                                        <span class="number">(${numberWithCommas(totalNotice2 + total2)}건)</span>
                                      </a>
                                    </li>
                                    <li class="content-tab-menu-box-item">
                                      <a href="#magazine" class="content-tab-menu-box-btn" onclick="getSearch(0, 20, 0)">
                                        <span>💕 연애</span>
                                        <span class="number">(${numberWithCommas(totalNotice0 + total0)}건)</span>
                                      </a>
                                    </li>
                                    <li class="content-tab-menu-box-item">
                                      <a href="#twenty" class="content-tab-menu-box-btn" onclick="getSearch(0, 20, 1)">
                                        <span>✈️ 진로</span>
                                        <span class="number">(${numberWithCommas(totalNotice1 + total1)}건)</span>
                                      </a>
                                    </li>
                                    <li class="content-tab-menu-box-item">
                                      <a href="#community" class="content-tab-menu-box-btn" onclick="getSearch(0, 20, 3)">
                                        <span>🏫 우리 학교</span>
                                        <span class="number">(${numberWithCommas(totalNotice3 + total3)}건)</span>
                                      </a>
                                    </li>`;
                                    }else if(category===0){
                                      htmlTab = ` <li class="content-tab-menu-box-item">
                                      <a href="#magazine" class="content-tab-menu-box-btn" onclick="getSearch(0, 20, 2)">
                                        <span>☀️ 일상</span>
                                        <span class="number">(${numberWithCommas(totalNotice2 + total2)}건)</span>
                                      </a>
                                    </li>
                                    <li class="content-tab-menu-box-item active">
                                      <a href="#magazine" class="content-tab-menu-box-btn" onclick="getSearch(0, 20, 0)">
                                        <span>💕 연애</span>
                                        <span class="number">(${numberWithCommas(totalNotice0 + total0)}건)</span>
                                      </a>
                                    </li>
                                    <li class="content-tab-menu-box-item">
                                      <a href="#twenty" class="content-tab-menu-box-btn" onclick="getSearch(0, 20, 1)">
                                        <span>✈️ 진로</span>
                                        <span class="number">(${numberWithCommas(totalNotice1 + total1)}건)</span>
                                      </a>
                                    </li>
                                    <li class="content-tab-menu-box-item">
                                      <a href="#community" class="content-tab-menu-box-btn" onclick="getSearch(0, 20, 3)">
                                        <span>🏫 우리 학교</span>
                                        <span class="number">(${numberWithCommas(totalNotice3 + total3)}건)</span>
                                      </a>
                                    </li>`;
                                    }else if(category===1){
                                      htmlTab = ` <li class="content-tab-menu-box-item">
                                      <a href="#magazine" class="content-tab-menu-box-btn" onclick="getSearch(0, 20, 2)">
                                        <span>☀️ 일상</span>
                                        <span class="number">(${numberWithCommas(totalNotice2 + total2)}건)</span>
                                      </a>
                                    </li>
                                    <li class="content-tab-menu-box-item">
                                      <a href="#magazine" class="content-tab-menu-box-btn" onclick="getSearch(0, 20, 0)">
                                        <span>💕 연애</span>
                                        <span class="number">(${numberWithCommas(totalNotice0 + total0)}건)</span>
                                      </a>
                                    </li>
                                    <li class="content-tab-menu-box-item active">
                                      <a href="#twenty" class="content-tab-menu-box-btn" onclick="getSearch(0, 20, 1)">
                                        <span>✈️ 진로</span>
                                        <span class="number">(${numberWithCommas(totalNotice1 + total1)}건)</span>
                                      </a>
                                    </li>
                                    <li class="content-tab-menu-box-item">
                                      <a href="#community" class="content-tab-menu-box-btn" onclick="getSearch(0, 20, 3)">
                                        <span>🏫 우리 학교</span>
                                        <span class="number">(${numberWithCommas(totalNotice3 + total3)}건)</span>
                                      </a>
                                    </li>`;
                                    }else if(category===3){
                                      htmlTab = ` <li class="content-tab-menu-box-item">
                                      <a href="#magazine" class="content-tab-menu-box-btn" onclick="getSearch(0, 20, 2)">
                                        <span>☀️ 일상</span>
                                        <span class="number">(${numberWithCommas(totalNotice2 + total2)}건)</span>
                                      </a>
                                    </li>
                                    <li class="content-tab-menu-box-item">
                                      <a href="#magazine" class="content-tab-menu-box-btn" onclick="getSearch(0, 20, 0)">
                                        <span>💕 연애</span>
                                        <span class="number">(${numberWithCommas(totalNotice0 + total0)}건)</span>
                                      </a>
                                    </li>
                                    <li class="content-tab-menu-box-item">
                                      <a href="#twenty" class="content-tab-menu-box-btn" onclick="getSearch(0, 20, 1)">
                                        <span>✈️ 진로</span>
                                        <span class="number">(${numberWithCommas(totalNotice1 + total1)}건)</span>
                                      </a>
                                    </li>
                                    <li class="content-tab-menu-box-item active">
                                      <a href="#community" class="content-tab-menu-box-btn" onclick="getSearch(0, 20, 3)">
                                        <span>🏫 우리 학교</span>
                                        <span class="number">(${numberWithCommas(totalNotice3 + total3)}건)</span>
                                      </a>
                                    </li>`;
                                    }                               
                                    
                                    let dataNotice;
                                    let data;
                                    let total;                                  

                                    if(category==0){
                                      dataNotice = dataNotice0;
                                      data = data0;
                                      total = total0 + totalNotice0;
                                    }else if(category==1){
                                      dataNotice = dataNotice1;
                                      data = data1;
                                      total = total1+ totalNotice1;
                                    }else if(category==2){
                                      dataNotice = dataNotice2;
                                      data = data2;
                                      total = total2 + totalNotice2;
                                    }else if(category==3){
                                      dataNotice = dataNotice3;
                                      data = data3;
                                      total = total3 + totalNotice3;
                                    }

                                    let numOfPage = total/size;

                                    for(let i=0;i<dataNotice.length;i++){                                  
                                      htmlListPc+=`<li class="data-table-box-item">
                                      <a href="../community/detail.html?id=${dataNotice[i]?.id}&isRanking=0" class="data-table-box-link notice" >
                                        <div class="number">공지</div>
                                        <div class="topic image">
                                          <div class="text">
                                            ${dataNotice[i].title}<span class="info">${dataNotice[i].fileExists === 1?'<i class="icon-box icon-photo">이미지</i>':''} ${dataNotice[i]?.commentCount>0 ? '(' + numberWithCommas(dataNotice[i]?.commentCount) + ')' : ''}</span>
                                          </div>
                                        </div>
                                        <div class="like">${numberWithCommas(dataNotice[i].likeCount)}</div>
                                        <div class="read">${numberWithCommas(dataNotice[i].showCount)}</div>
                                        <div class="date">${dataNotice[i]?.createDate?dateToStrCharacterLength(strToDate(dataNotice[i]?.createDate), '.', 16):''}</div>
                                      </a>
                                    </li>`;

                                    htmlListMobile+=`<li class="data-table-box-item">
                                      <a href="../community/detail.html?id=${dataNotice[i]?.id}&isRanking=0" class="data-table-box-link">
                                        <div class="category-box">
                                          <span class="label">카테고리</span>
                                          <span class="text">${category==0?'연애':category==1?'진로':category==2?'일상':'우리 학교'}</span>
                                        </div>
                                        <div class="title-box image">
                                          <div class="title">[공지] ${dataNotice[i].title}</div>
                                          <span class="info">${dataNotice[i].fileExists === 1?'<i class="icon-box icon-photo">이미지</i>':''} ${dataNotice[i]?.commentCount>0 ? '(' + numberWithCommas(dataNotice[i]?.commentCount) + ')' : ''}</span>
                                        </div>
                                        <div class="info-box">
                                          <div class="read">
                                            <span class="label">읽음</span>
                                            <span class="number">${numberWithCommas(dataNotice[i].showCount)}</span>
                                          </div>
                                          <div class="like">
                                            <span class="label">좋아요</span>
                                            <span class="number">${numberWithCommas(dataNotice[i].likeCount)}</span>
                                          </div>
                                          <div class="date">
                                            <span class="label">게시일</span>
                                            <span class="number">${dataNotice[i]?.createDate?dateToStrCharacterLength(strToDate(dataNotice[i]?.createDate), '.', 16):''}</span>
                                          </div>
                                        </div>
                                      </a>
                                    </li>`;
                                    }                                     

                                    for( let i = 0; i<data.length; i++){
                                      let values = data[i];
                                      
                                      htmlListPc+=`<li class="data-table-box-item">
                                        <a href="../community/detail.html?id=${values?.id}&isRanking=0" class="data-table-box-link">
                                          <div class="number">${values.id}</div>
                                          <div class="topic image">
                                            <div class="text">
                                              ${values.title}<span class="info">${values.fileExists === 1?'<i class="icon-box icon-photo">이미지</i>':''} ${values?.commentCount>0 ? '(' + numberWithCommas(values?.commentCount) + ')' : ''}</span>
                                            </div>
                                          </div>
                                          <div class="like">${numberWithCommas(values.likeCount)}</div>
                                          <div class="read">${numberWithCommas(values.showCount)}</div>
                                          <div class="date">${values?.createDate?dateToStrCharacterLength(strToDate(values?.createDate), '.', 16):''}</div>
                                        </a>
                                      </li>`;

                                      htmlListMobile+=`<li class="data-table-box-item">
                                        <a href="../community/detail.html?id=${values?.id}&isRanking=0" class="data-table-box-link">
                                          <div class="category-box">
                                            <span class="label">카테고리</span>
                                            <span class="text">${category==0?'연애':category==1?'진로':category==2?'일상':'우리 학교'}</span>
                                          </div>
                                          <div class="title-box image">
                                            <div class="title"> ${values.title}</div>
                                            <span class="info">${values.fileExists === 1?'<i class="icon-box icon-photo">이미지</i>':''} ${values?.commentCount>0 ? '(' + numberWithCommas(values?.commentCount) + ')' : ''}</span>
                                          </div>
                                          <div class="info-box">
                                            <div class="read">
                                              <span class="label">읽음</span>
                                              <span class="number">${numberWithCommas(values.showCount)}</span>
                                            </div>
                                            <div class="like">
                                              <span class="label">좋아요</span>
                                              <span class="number">${numberWithCommas(values.likeCount)}</span>
                                            </div>
                                            <div class="date">
                                              <span class="label">게시일</span>
                                              <span class="number">${values?.createDate?dateToStrCharacterLength(strToDate(values?.createDate), '.', 16):''}</span>
                                            </div>
                                          </div>
                                        </a>
                                      </li>`;                                    
                                    }

                                    if(total >size){
                                      pagingPc =`<button type="button" class="controller prev" ${page > 0 ? 'onclick="getSearch('+(page-1)+','+ size + ')"' : ''}>이전으로</button>`;
                                      pagingMobile=` <button type="button" class="btn medium bg-g4 prev-btn" ${page > 0 ? 'onclick="getSearch('+(page-1)+','+ size + ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
                                      for ( let j = 0; j< numOfPage; j++){
                                        pagingPc +=`<button type="button" class="paging ${page === j?'current':''}" onclick="getSearch(`+j+`,`+ size + `)">` +  (j+1)  + `</button>`                    
                                      }             
                            
                                      pagingPc +=`<button type="button" class="controller next" ${page < numOfPage-1 ? 'onclick="getSearch(' + (page+1) + ',' +  size + ')"' : ''}>다음으로</button>`;
                                      pagingMobile+=`<button type="button" class="btn medium bg-g4 next-btn"  ${page < numOfPage-1 ? 'onclick="getSearch('+(page+1)+','+ size + ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;
                                    }
                                    
                                    if(total> 0){
                                      document.getElementById('data-table').style.display = "block";
                                      document.getElementById('data-table-no').style.display = "none";
                                      document.getElementById('htmlListPc').innerHTML  = htmlListPc;
                                      document.getElementById('htmlListMobile').innerHTML  = htmlListMobile;
                                      document.getElementById('pagingPc').innerHTML  = pagingPc; 
                                      document.getElementById('pagingMobile').innerHTML  = pagingMobile;  
                                    } 
                                    else {
                                      document.getElementById('data-table').style.display = "none";
                                      document.getElementById('data-table-no').style.display = "block";
                                      htmlListPc = ` <li class="data-table-box-item">
                                                  <!-- 콘텐츠가 0개 일 경우 노출 문구 -->
                                                  <div class="empty-info-text-box">
                                                    <div class="empty-info-text">
                                                      등록된 글이 없습니다.<br />
                                                      첫 글의 주인공이 되어보세요.
                                                    </div>
                                                  </div>
                                                  <!-- //empty-info-text-box -->
                                                  <!-- //콘텐츠가 0개 일 경우 노출 문구 -->
                                                </li>`;              
                                              
                                      $(".data-table-box-standard").css("display", "none");

                                      htmlListMobile = `<li class="data-table-box-item">
                                        <!-- 콘텐츠가 0개 일 경우 노출 문구 -->
                                        <div class="empty-info-text-box">
                                          <div class="empty-info-text">
                                            등록된 글이 없습니다.<br />
                                            첫 글의 주인공이 되어보세요.
                                          </div>
                                        </div>
                                        <!-- //empty-info-text-box -->
                                        <!-- //콘텐츠가 0개 일 경우 노출 문구 -->
                                      </li>`

                                      document.getElementById('htmlListPcNo').innerHTML  = htmlListPc;
                                      document.getElementById('htmlListMobileNo').innerHTML  = htmlListMobile;
                                      
                                    }

                                    document.getElementById('htmlTab').innerHTML  = htmlTab;        
                                   
                                  
                                  })                    
                                }).catch(error => console.log(error));
                              
                              })                    
                            }).catch(error => console.log(error));
                          })                    
                        }).catch(error => console.log(error));
                      })                    
                    }).catch(error => console.log(error));
                  
                  })                    
                }).catch(error => console.log(error));
              
              })                    
            }).catch(error => console.log(error));
          
          })                    
        }).catch(error => console.log(error));
      
      })                    
    }).catch(error => console.log(error));



    
    document.getElementById('htmlInput').innerHTML  = htmlInput;  
  }

      
}


function getCreate() {
  let meInfo = JSON.parse(window.localStorage.getItem('me'));
 
  let u = window.location.href;
  let category;
  if(u.indexOf("?") > 0){
      path = u.substr(0 , u.indexOf("?"));        
      query = u.substr(u.indexOf("?") + 1);
      var pair = query.split('=');
      category = pair[1].indexOf('&') > -1 ? pair[1].substring(0, pair[1].indexOf('&')) :  pair[1];
  }
  // console.log('num' + id)
  if ( category === null){
    category = sessionStorage.getItem('category');
  }

  document.getElementById('selectBox').innerHTML = `<option value="" ${category=="" ? 'selected' : ''}>선택</option>
                                                    <option value="0"  ${category=="0" ? 'selected' : ''}>연애</option>
                                                    <option value="1"  ${category=="1" ? 'selected' : ''}>진로</option>
                                                    <option value="2"  ${category=="2" ? 'selected' : ''}>일상</option>
                                                    ${meInfo.schoolId ? '<option value="3" '+(category==3 ? 'selected' : '')+'>우리 학교</option>':''}`;
  document.getElementById('comments-penName').innerHTML  = `<label for="writer" class="form-label txt-hidden">닉네임</label>
                    <input type="text" id="writer" name="writer" title="닉네임" class="form-input" autocomplete="off" placeholder="12자 이내로 입력해 주세요." value="${meInfo?.nickname}"  maxlength="12"/>`; 
}

function post() {
  let meInfo = JSON.parse(window.localStorage.getItem('me'));
  let url = baseUrl + "/community/register";  
  let selectBox = document.getElementById('selectBox');
  let category = (selectBox.options[selectBox.selectedIndex]).value;    

  let writer = document.getElementById("writer").value;
  let title = document.getElementById("title").value;
  let editor = document.getElementById("editor").value;

  if(writer.length === 0){
    layerPopup.openPopup('loginInfoPopup');
  }else if(category ==  ''){
    layerPopup.openPopup('loginInfoPopup1');
  }else if(title.length === 0){
    layerPopup.openPopup('loginInfoPopup2');
  }else if(editor.length === 0){
    layerPopup.openPopup('loginInfoPopup3');
  }else{
    let fileExists = 0;
    
    if(editor.indexOf('<img') > 0){
      fileExists = 1;
    }

    let params = {
      type : 1,
      state : 0,
      category : category,
      penName : writer,
      title : title,
      content: editor, 
      fileExists : fileExists, 
      schoolId : (category ==3? meInfo.schoolId : null)   
    }
    const requestPost = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
    });

    async function post(request) {
      try {
      await fetch(request)
      .then(response => {
        checkError(response.status);
          return response.json();        
      })
      .then(data => {       
        $('#popup4-button').attr("onclick", `location.href='../community/detail.html?id=${data.data.community.id}'`);        
        setTimeout(()=> {
          layerPopup.openPopup('loginInfoPopup4');          
        }, 500);
      }).catch(error => {if(error.message === '401') logout() });     
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
}


function getList(page = 0, size = 20){     

  let meInfo = '';
  if(window.localStorage.getItem('me')){
    meInfo = JSON.parse(window.localStorage.getItem('me'));
  } 


  let u = window.location.href;
  let category;
  if(u.indexOf("?") > 0){
      path = u.substr(0 , u.indexOf("?"));        
      query = u.substr(u.indexOf("?") + 1);
      var pair = query.split('=');
      category = pair[1].indexOf('&') > -1 ? pair[1].substring(0, pair[1].indexOf('&')) :  pair[1];
  }
  // console.log('num' + id)
  if ( category === null){
    category = sessionStorage.getItem('category');
  }

  $('#go-register-a1').attr('href', 'javascript:goRegister('+category+')');
  $('#go-register-a2').attr('href', 'javascript:goRegister('+category+')');

  let param = document.getElementById("search-keyword").value; 

  let sort = document.getElementById('sort');
  let _sort = (sort.options[sort.selectedIndex]).value;    
       
  url = baseUrl + "/schools?id=" + (meInfo.schoolId || "");    

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
response.json().then((response) => {  

      let htmlCategory= category==0?"💕 연애": category==1?"✈️ 진로": category==2?"☀️ 일상": ("🏫 "+ response?.data?.schools[0]?.name);  
                              
      url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&offset=0&type=0&category=" + category; 

      if(param.length > 0){
        url += "&keyword=" + param;
      }

      if(category ==3){
        url += "&schoolId=" + meInfo.schoolId;
      }

      // if ( _filterCategory !== null){   
      //   url +='&category='+ _filterCategory;
      // }

      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
response.json().then((response) => {            
            
            let dataPc= "";   
            let dataMobile= "";   
            let pagingPc= "";         
            let pagingMobile= "";         
            let dataNotice = response.data.communities;  
            let totalNotice = response.data.total;
            
            for( let i = 0;  i < dataNotice.length; i++){
              dataPc += `<li class="data-table-box-item">
                        <a href="../community/detail.html?id=${dataNotice[i]?.id}&isRanking=0" class="data-table-box-link notice">
                          <div class="number">공지</div>                 
                          <div class="topic image">
                            <div class="text">
                            ${dataNotice[i]?.title}<span class="info">${dataNotice[i].fileExists === 1?'<i class="icon-box icon-photo">이미지</i>':''} ${dataNotice[i]?.commentCount>0 ? '(' + numberWithCommas(dataNotice[i]?.commentCount) + ')' : ''}</span>
                            </div>
                          </div>
                          <div class="like">${numberWithCommas(dataNotice[i]?.likeCount)}</div>
                          <div class="read">${numberWithCommas(dataNotice[i]?.showCount)}</div>
                          <div class="date">${dataNotice[i]?.startDate?dateToStrCharacterLength(strToDate(dataNotice[i]?.startDate), '.', 16):dateToStrCharacterLength(strToDate(dataNotice[i]?.createDate), '.', 16)}</div>
                        </a>
                      </li>`;
              dataMobile += `<li class="data-table-box-item">
                          <a href="../community/detail.html?id=${dataNotice[i]?.id}&isRanking=0" class="data-table-box-link notice">
                            <div class="category-box">
                              <span class="label">카테고리</span>
                              <span class="text">${dataNotice[i]?.category === 0 ? '연애' :dataNotice[i]?.category === 1 ? '진로' : dataNotice[i]?.category === 2 ? '일상' : '우리학교'}</span>
                            </div>
                            <div class="title-box image">
                              <div class="title">[공지] ${dataNotice[i]?.title}</div>
                              <span class="info">${dataNotice[i].fileExists === 1?'<i class="icon-box icon-photo">이미지</i>':''} ${dataNotice[i]?.commentCount>0 ? '(' + numberWithCommas(dataNotice[i]?.commentCount) + ')' : ''}</span>
                            </div>
                            <div class="info-box">
                              <div class="read">
                                <span class="label">읽음</span>
                                <span class="number">${numberWithCommas(dataNotice[i]?.showCount)}</span>
                              </div>
                              <div class="like">
                                <span class="label">좋아요</span>
                                <span class="number">${numberWithCommas(dataNotice[i]?.likeCount)}</span>
                              </div>
                              <div class="date">
                                <span class="label">게시일</span>
                                <span class="number">${dataNotice[i]?.startDate?dateToStrCharacterLength(strToDate(dataNotice[i]?.startDate), '.', 16):dateToStrCharacterLength(strToDate(dataNotice[i]?.createDate), '.', 16)}</span>
                              </div>
                            </div>
                          </a>
                        </li>`;                  
            }
                  
            url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&offset="+(page*size)+"&limit="+size+"&type=1&category=" + category+"&sort=" + (_sort==0?"recent":"popularity");  
      
            if(param.length > 0){
              url += "&keyword=" + param;
            }
            if(category ==3){
              url += "&schoolId=" + meInfo.schoolId;
            }
      
            fetch(url, headers.json_headers)
            .then((response) => {
              checkError(response.status);
              response.json().then((response) => {      
              
              let dataCommunity = response.data.communities;       
              let total = response.data.total;      
              let numOfPage = total/size;                                        
      
              for( let i = 0; i<dataCommunity.length; i++){
      
                let values = dataCommunity[i];
      
                dataPc += `<li class="data-table-box-item">
                  <a href="../community/detail.html?id=${values?.id}&isRanking=0" class="data-table-box-link">
                    <div class="number">${values?.id}</div>          
                    <div class="topic image">
                      <div class="text">
                      ${values?.title}<span class="info">${values.fileExists === 1?'<i class="icon-box icon-photo">이미지</i>':''} ${values?.commentCount>0 ? '(' + numberWithCommas(values?.commentCount) + ')' : ''}</span>
                      </div>
                    </div>
                    <div class="like">${numberWithCommas(values?.likeCount)}</div>
                    <div class="read">${numberWithCommas(values?.showCount)}</div>
                    <div class="date">${values?.startDate?dateToStrCharacterLength(strToDate(values?.startDate), '.', 16):dateToStrCharacterLength(strToDate(values?.createDate), '.', 16)}</div>
                  </a>
                </li>`;
      
                dataMobile += `<li class="data-table-box-item">
                          <a href="../community/detail.html?id=${values?.id}&isRanking=0" class="data-table-box-link">
                            <div class="category-box">
                              <span class="label">카테고리</span>
                              <span class="text">${values?.category === 0 ? '연애' :values?.category === 1 ? '진로' : values?.category === 2 ? '일상' : '우리학교'}</span>
                            </div>
                            <div class="title-box image">
                              <div class="title">${values?.title}</div>
                              <span class="info">${values.fileExists === 1?'<i class="icon-box icon-photo">이미지</i>':''} ${values?.commentCount>0 ? '(' + numberWithCommas(values?.commentCount) + ')' : ''}</span>
                            </div>
                            <div class="info-box">
                              <div class="read">
                                <span class="label">읽음</span>
                                <span class="number">${numberWithCommas(values?.showCount)}</span>
                              </div>
                              <div class="like">
                                <span class="label">좋아요</span>
                                <span class="number">${numberWithCommas(values?.likeCount)}</span>
                              </div>
                              <div class="date">
                                <span class="label">게시일</span>
                                <span class="number">${values?.startDate?dateToStrCharacterLength(strToDate(values?.startDate), '.', 16):dateToStrCharacterLength(strToDate(values?.createDate), '.', 16)}<</span>
                              </div>
                            </div>
                          </a>
                        </li>`;
              }
      
              if(totalNotice+total >size){
                pagingPc =`<button type="button" class="controller prev"  ${page > 0 ? 'onclick="getList('+(page-1)+','+ size + ')"' : ''}>이전으로</button>`;
                pagingMobile=` <button type="button" class="btn medium bg-g4 prev-btn"  ${page > 0 ? 'onclick="getList('+(page-1)+','+ size + ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
                for ( let j = 0; j< numOfPage; j++){
                  pagingPc +=`<button type="button" class="paging ${page === j?'current':''}" onclick="getList(`+j+`,`+ size + `)">` +  (j+1)  + `</button>`                    
                }             
      
                pagingPc +=`<button type="button" class="controller next" ${page < numOfPage-1 ? 'onclick="getList(' + (page+1) + ',' +  size + ')"' : ''}>다음으로</button>`;
                pagingMobile+=`<button type="button" class="btn medium bg-g4 next-btn"  ${page < numOfPage-1 ? 'onclick="getList('+(page+1)+','+ size + ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;
             }else if(totalNotice + total == 0){
                dataPc = ` <li class="data-table-box-item">
                <!-- 콘텐츠가 0개 일 경우 노출 문구 -->
                <div class="empty-info-text-box">
                  <div class="empty-info-text">
                    등록된 글이 없습니다.<br />
                    첫 글의 주인공이 되어보세요.
                  </div>
                </div>
                <!-- //empty-info-text-box -->
                <!-- //콘텐츠가 0개 일 경우 노출 문구 -->
              </li>`;              
             
              $(".data-table-box-standard").css("display", "none");

              dataMobile = `<li class="data-table-box-item">
                <!-- 콘텐츠가 0개 일 경우 노출 문구 -->
                <div class="empty-info-text-box">
                  <div class="empty-info-text">
                    등록된 글이 없습니다.<br />
                    첫 글의 주인공이 되어보세요.
                  </div>
                </div>
                <!-- //empty-info-text-box -->
                <!-- //콘텐츠가 0개 일 경우 노출 문구 -->
              </li>`
              }

            document.getElementById('htmlCategory').innerHTML  = htmlCategory;
            document.getElementById('dataPc').innerHTML  = dataPc;
            document.getElementById('dataMobile').innerHTML  = dataMobile;
            document.getElementById('pagingPc').innerHTML  = pagingPc; 
            document.getElementById('pagingMobile').innerHTML  = pagingMobile;  
          })                    
        }).catch(error => console.log(error));

      })                    
    }).catch(error => console.log(error));
  })                    
}).catch(error => console.log(error));

}

function enterGetListAll(e){
  if(e.keyCode==13){
    getListAll()
  }    
}

function getListAll(page = 0, size = 20){   
  let meInfo = "";
  
  if(window.localStorage.getItem('me') && window.localStorage.getItem('me').length > 0){
    meInfo = JSON.parse(window.localStorage.getItem('me'));  
  }
 
  let param = document.getElementById("search-keyword").value;    
  let category = document.getElementById('category');
  let _filterCategory = (category.options[category.selectedIndex]).value === '' ? null : (category.options[category.selectedIndex]).value ;    
  url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&offset=0&type=0"; 
    
  if(param.length > 0){
    url += "&keyword=" + param;
  }

  if ( _filterCategory !== null){   
    url +='&category='+ _filterCategory;    
  }

  if(_filterCategory ==3 && meInfo.length > 0){
    url += "schoolId=" + meInfo.schoolId;
  }

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {      
      let dataPc= "";   
      let dataMobile= "";   
      let pagingPc= "";         
      let pagingMobile= "";         
      let dataNotice = response.data.communities;  
      let totalNotice = response.data.total;
      
      for( let i = 0;  i < dataNotice.length; i++){     
        dataPc += `<li class="data-table-box-item">
          <a href='../community/detail.html?id=${dataNotice[i]?.id}&isRanking=1' class="data-table-box-link notice">
            <div class="number">공지</div>
            <div class="category">${dataNotice[i]?.category === 0 ? '연애' :dataNotice[i]?.category === 1 ? '진로' : dataNotice[i]?.category === 2 ? '일상' : '우리학교'}</div>
            <div class="topic image">
              <div class="text">
              ${dataNotice[i]?.title}<span class="info">${dataNotice[i].fileExists === 1?'<i class="icon-box icon-photo">이미지</i>':''} ${dataNotice[i]?.commentCount>0 ? '(' + numberWithCommas(dataNotice[i]?.commentCount) + ')' : ''}</span>
              </div>
            </div>
            <div class="like">${numberWithCommas(dataNotice[i]?.likeCount)}</div>
            <div class="read">${numberWithCommas(dataNotice[i]?.showCount)}</div>
            <div class="date">${dataNotice[i]?.startDate?dateToStrCharacterLength(strToDate(dataNotice[i]?.startDate), '.', 16):dateToStrCharacterLength(strToDate(dataNotice[i]?.lastDate), '.', 16)}</div>
          </a>
        </li>`;
        
        dataMobile += `<li class="data-table-box-item">
          <a href='../community/detail.html?id=${dataNotice[i]?.id}&isRanking=1' class="data-table-box-link notice">
            <div class="category-box">
              <span class="label">카테고리</span>
              <span class="text">${dataNotice[i]?.category === 0 ? '연애' :dataNotice[i]?.category === 1 ? '진로' : dataNotice[i]?.category === 2 ? '일상' : '우리학교'}</span>
            </div>
            <div class="title-box image">
              <div class="title">[공지] ${dataNotice[i]?.title}</div>
              <span class="info"><${dataNotice[i].fileExists === 1?'<i class="icon-box icon-photo">이미지</i>':''}  ${dataNotice[i]?.commentCount>0 ? '(' + numberWithCommas(dataNotice[i]?.commentCount) + ')' : ''}</span>
            </div>
            <div class="info-box">
              <div class="read">
                <span class="label">읽음</span>
                <span class="number">${numberWithCommas(dataNotice[i]?.showCount)}</span>
              </div>
              <div class="like">
                <span class="label">좋아요</span>
                <span class="number">${numberWithCommas(dataNotice[i]?.likeCount)}</span>
              </div>
              <div class="date">
                <span class="label">게시일</span>
                <span class="number">${dataNotice[i]?.startDate?dateToStrCharacterLength(strToDate(dataNotice[i]?.startDate), '.', 16):dateToStrCharacterLength(strToDate(dataNotice[i]?.lastDate), '.', 16)}</span>
              </div>
            </div>
          </a>
        </li>`;
        }     

      url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&offset="+(page*size)+"&limit="+size+"&type=1&isRanking=1&sort=popularity";
      
      if(param.length > 0){
        url += "&keyword=" + param;
      }
    
      if ( _filterCategory !== null){   
        url +='&category='+ _filterCategory;        
      }

      if(_filterCategory ==3 && meInfo.length > 0){
        url += "schoolId=" + meInfo.schoolId;
      }

      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((response) => {      
        
        let dataCommunity = response.data.communities;          
        let total = response.data.total;       
        let numOfPage = total/size;

        for( let i = 0; i<dataCommunity.length; i++){

          let values = dataCommunity[i];

          dataPc += `<li class="data-table-box-item">
            <a href='../community/detail.html?id=${values?.id}&isRanking=1' class="data-table-box-link">
              <div class="number">${values?.id}</div>
              <div class="category">${values?.category === 0 ? '연애' :values?.category === 1 ? '진로' : values?.category === 2 ? '일상' : '우리학교'}</div>
              <div class="topic image">
                <div class="text">
                ${values?.title}<span class="info">${values.fileExists === 1?'<i class="icon-box icon-photo">이미지</i>':''} ${values?.commentCount>0 ? '(' + numberWithCommas(values?.commentCount) + ')' : ''}</span>
                </div>
              </div>
              <div class="like">${numberWithCommas(values?.likeCount)}</div>
              <div class="read">${numberWithCommas(values?.showCount)}</div>
              <div class="date">${values?.startDate?dateToStrCharacterLength(strToDate(values?.startDate), '.', 16):dateToStrCharacterLength(strToDate(values?.lastDate), '.', 16)}</div>
            </a>
          </li>`;

          dataMobile += `<li class="data-table-box-item">
                    <a href='../community/detail.html?id=${values?.id}&isRanking=1' class="data-table-box-link">
                      <div class="category-box">
                        <span class="label">카테고리</span>
                        <span class="text">${values?.category === 0 ? '연애' :values?.category === 1 ? '진로' : values?.category === 2 ? '일상' : '우리학교'}</span>
                      </div>
                      <div class="title-box image">
                        <div class="title">${values?.title}</div>
                        <span class="info">${values.fileExists === 1?'<i class="icon-box icon-photo">이미지</i>':''} ${values?.commentCount>0 ? '(' + numberWithCommas(values?.commentCount) + ')' : ''}</span>
                      </div>
                      <div class="info-box">
                        <div class="read">
                          <span class="label">읽음</span>
                          <span class="number">${numberWithCommas(values?.showCount)}</span>
                        </div>
                        <div class="like">
                          <span class="label">좋아요</span>
                          <span class="number">${numberWithCommas(values?.likeCount)}</span>
                        </div>
                        <div class="date">
                          <span class="label">게시일</span>
                          <span class="number">${values?.startDate?dateToStrCharacterLength(strToDate(values?.startDate), '.', 16):dateToStrCharacterLength(strToDate(values?.lastDate), '.', 16)}</span>
                        </div>
                      </div>
                    </a>
                  </li>`;
        }

        if(total+totalNotice >size){
          pagingPc =`<button type="button" class="controller prev" ${page > 0 ? 'onclick="getListAll('+(page-1)+','+ size + ')"' : ''}>이전으로</button>`;
          pagingMobile=` <button type="button" class="btn medium bg-g4 prev-btn" ${page > 0 ? 'onclick="getListAll('+(page-1)+','+ size + ')' : ''}"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
          for ( let j = 0; j< numOfPage; j++){
            pagingPc +=`<button type="button" class="paging ${page === j?'current':''}" onclick="getListAll(`+j+`,`+ size + `)">` +  (j+1)  + `</button>`                    
          }             

          pagingPc +=`<button type="button" class="controller next" ${page < numOfPage-1 ? 'onclick="getListAll(' + (page+1) + ',' +  size + ')"' : ''}>다음으로</button>`;
          pagingMobile+=`<button type="button" class="btn medium bg-g4 next-btn"  ${page < numOfPage-1 ? 'onclick="getListAll('+(page+1)+','+ size + ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;
       }else if(total+totalNotice == 0){
          dataPc = `<li class="data-table-box-item">
                    <!-- 콘텐츠가 0개 일 경우 노출 문구 -->
                    <div class="empty-info-text-box">
                      <div class="empty-info-text">
                        등록된 글이 없습니다.<br />
                        첫 글의 주인공이 되어보세요.
                      </div>
                    </div>`;

          $(".data-table-box-standard").css("display", "none");

          dataMobile = `<li class="data-table-box-item">
                    <!-- 콘텐츠가 0개 일 경우 노출 문구 -->
                    <div class="empty-info-text-box">
                      <div class="empty-info-text">
                        등록된 글이 없습니다.<br />
                        첫 글의 주인공이 되어보세요.
                      </div>
                    </div>
                    <!-- //empty-info-text-box -->
                    <!-- //콘텐츠가 0개 일 경우 노출 문구 -->
                  </li>`;
        }
        
        document.getElementById('date').innerHTML  =  `${new Date().getFullYear()}. ${new Date().getMonth()+1}. ${new Date().getDate()}. ${new Date().getHours()}:00 기준`;
        document.getElementById('dataPc').innerHTML  = dataPc;
        document.getElementById('dataMobile').innerHTML  = dataMobile;
        document.getElementById('pagingPc').innerHTML  = pagingPc; 
        document.getElementById('pagingMobile').innerHTML  = pagingMobile;  

      })                    
    }).catch(error => console.log(error));
  })                    
}).catch(error => console.log(error));
}


function getDetail(page = 1){     
  let u = window.location.href;
  let id;

  if(u.indexOf("?") > 0){
      path = u.substr(0 , u.indexOf("?"));        
      query = u.substr(u.indexOf("?") + 1);
      var pair = query.split('=');
      id = pair[1].indexOf('&') > -1 ? pair[1].substring(0, pair[1].indexOf('&')) :  pair[1];
  }

  if ( id === null){
    id = sessionStorage.getItem('id');
  }
  
  url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&offset=0&id=" + id; 

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {      

      let data = response.data.communities; 
      let htmlAside ="";     
      let htmlContent=data[0]?.content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />");
      let htmlTitle="";
      // let dataPc= "";   
      // let dataMobile= "";   

      if(response.data.total == 0){
        document.getElementById("popup-base-message").innerHTML = '<strong>비공개 처리된 글입니다.</strong>';
        $("#popup-base-ok").attr('onclick', 'history.back(); return false;');  
        layerPopup.openPopup('popup-base');    
      }else{
        htmlAside += ` <div class="flow">
                <span>${data[0]?.category==0?'💕 연애':data[0]?.category==1?'✈️ 진로':data[0]?.category==2?'☀️ 일상':'🏫 ' + data[0]?.schoolName}</span>
              </div>
              <div class="info-box">
                <div class="writer">
                  <span class="label">작성자</span>
                  <span class="text">${data[0].penName != null?data[0].penName:data[0].nickname}</span>
                </div>
                <div class="date">
                  <span class="label">게시일</span>
                  <span class="text">${data[0].createDate?dateToStrCharacterLength(strToDate(data[0]?.createDate), '.', 16):''}</span>
                </div>
                <div class="views">
                  <span class="label">조회수</span>
                  <span class="text">${numberWithCommas(data[0]?.showCount)}</span>
                </div>
                <div class="likes">
                  <span class="label">좋아요</span>
                  <span class="text" id="likeCountAside">${numberWithCommas(data[0]?.likeCount)}</span>
                </div>
              </div>`;

        htmlTitle += `<div class="flow">
                  <span>${data[0]?.category==0?'💕 연애':data[0]?.category==1?'✈️ 진로':data[0]?.category==2?'☀️ 일상':'🏫 ' + data[0]?.schoolName}</span>
                </div>
                <div class="article-label-box">
                  <div class="article-label-box-item">${data[0].rank !== null ? '🔥 지금 많이 보는 글' : ''}</div>
                </div>
                <div class="article-report-title">
                  <span class="article-label-text"><strong>${data[0].rank !== null ? '🔥 지금 많이 보는 글' : ''}</strong></span>
                  ${data[0]?.title}
                </div>
                <div class="nickname-box">${data[0].penName != null?data[0].penName:data[0].nickname}</div>
                <div class="info-box">
                  <div class="date">
                    <span class="label">게시일</span>
                    <span class="text">${data[0]?.createDate?dateToStrCharacterLength(strToDate(data[0]?.createDate), '.', 16):''}</span>
                  </div>
                  <div class="views">
                    <span class="label">조회수</span>
                    <span class="text">${numberWithCommas(data[0]?.showCount)}</span>
                  </div>
                  <div class="likes">
                    <span class="label" id="likeCountTitle">좋아요</span>
                    <span class="text">${numberWithCommas(data[0]?.likeCount)}</span>
                  </div>
                </div>`;
      
        document.getElementById('htmlAside').innerHTML  = htmlAside;
        document.getElementById('htmlTitle').innerHTML  = htmlTitle;
        document.getElementById('htmlContent').innerHTML  = htmlContent;
        document.getElementById('floating-like').innerHTML = `<button class="floating-toolbar-btn active-btn like-btn ${data[0]?.isLiked > 0 ? 'check':''}" onclick="postFlagFloating(0, ${data[0].isLiked > 0 ? 1 : 0})"><i class="icon-box icon-like"></i>좋아요</button>`;
        document.getElementById('floating-save').innerHTML = `<button class="floating-toolbar-btn active-btn save-btn ${data[0]?.isSaved > 0 ? 'check':''}" onclick="postFlagFloating(1, ${data[0].isSaved > 0 ? 1 : 0})"><i class="icon-box icon-bookmark"></i>저장하기</button>`; 
      
      }

      })                    
  }).catch(error => console.log(error));
  url = baseUrl + "/banners?category=7&state=0,3&offset=0&limit=999&startDate=" + new Date().toISOString()+ "&endDate=" + new Date().toISOString(); 
    
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let data = response.data.banners;        
      let banners= "";    
      
      if(data.length > 0){
        let index =  Math.floor(Math.random() * (data.length));               

        banners=`<a href="${data[index]?.href}" target="_blank" class="banner-link" onclick="getDetail(${(page)})"></a>
          <div class="banner">
          ${data[index].file1?'<img src="'+data[index].file1+'" class="pc-show" alt="광고 배너" />':''}
          ${data[index].file2?'<img src="'+data[index].file2+'" class="mobile-show" alt="광고 배너" />':''}
          </div>`;  
      }
  
      document.getElementById('banners').innerHTML  = banners;        
    })                    
  }).catch(error => console.log(error));
  let size = 20;
  url = baseUrl + "/community-comments?state=0&communityId="+id+"&offset=0&limit=" + (page*size);  

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let data = response.data?.comments;     
      let total = response.data.total;             

      url = baseUrl + "/users/me";  

      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
    response.json().then((response) => {
          let userId = response.data.user.id;               
          let comments= "";               
          let commentsButton="";   

          for(let i=0;i< page*size && i<total;i++){
            if(userId == data[i]?.userId){
              comments+=`<div class="comment-list-box-item comment-list-box-item-user">
                  <!-- 프로필 이미지가 있을경우 img 추가 없다면 이름 첫 글자 -->
                  <div class="profile-image">
                  ${data[i].nickname.substring(0,1)}`;
            }else{
              comments+=`<div class="comment-list-box-item" >
                <!-- 프로필 이미지가 있을경우 img 추가 없다면 이름 첫 글자 -->
                <div class="profile-image">
                ${data[i].nickname.substring(0,1)}`;
            }
                 
            if(data[i].profilePath){
              comments+=`<img src="${data[i].profilePath}" alt="" />`;
            }                        
           
          
            comments+=`</div>
              <div class="comment-box">
                <div class="info-box">
                  <div class="name">${data[i].penName}
                    <!-- 본인 닉네임을 그대로 사용한 댓글 영역 작성자 옆에는 "인증 아이콘" 노출 -->`;
            if(data[i].penName == data[i].nickname){
              comments+=`<i class="icon-box icon-small-check"></i>`;
            } 
            
            comments+=`</div>
                  <div class="date">${data[i]?.startDate?dateToStrCharacterLength(strToDate(data[i]?.startDate), '.', 16):dateToStrCharacterLength(strToDate(data[i]?.lastDate), '.', 16)}</div>
                  <div class="like-box">
                    <!-- active-btn 클래스 추가 상태에서 like-btn 클릭 시 효과 적용 -->
                    <button type="button" class="active-btn like-btn ${data[i].isLiked === 1 ? 'check' : ''}" onclick="${data[i].isLiked==1? 'postFlagCancelDetail('+id+',' + data[i].id+',' + page+')' : 'postFlagDetail('+id+',' + data[i].id+',' + page+')'}">
                      <i class="icon-box icon-like">좋아요</i>
                    </button>
                    <span class="number">${numberWithCommas(data[i].likeCount)}</span>
                  </div>
                </div>
                <div class="comment">${data[i].content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />")}</div>
              </div>
            </div>`;                       
            
          }
         
          if(total > page*size){
            comments+=` <div class="btn-wrap">
                    <button type="button" class="add-btn" onclick="getDetail(${(page+1)})"><i class="icon-box icon-arrow-black-down">화살표</i><span class="underline">더보기</span></button>
                  </div>`
          }  

          commentsButton = `<div class="textarea-box">
              <textarea  id="comment-input" class="form-textarea full sm" placeholder="댓글을 입력해 주세요." onclick="checkPopup('loginInfoPopup')"></textarea>
              <label for="" class="info-text">다른 사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현이나 다른 사람의 권리를 침해하는 내용은 강제 삭제될 수 있습니다.</label>
            </div>
            <button type="button" class="btn" onclick="postDetail(${(id)}, ${(page)})">댓글 쓰기</button>`;
            
          document.getElementById('commentsTotal').innerHTML  = '댓글 '+total+'개';       
          document.getElementById('comments').innerHTML  = comments;   
          document.getElementById('comments-button').innerHTML  = commentsButton;     
        })                    
      }).catch(error => console.log(error));
  
    })                    
  }).catch(error => console.log(error));

  url = baseUrl + "/users/me"; 
    
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let data = response.data.user;        
      let commentsPenName= "";    
      
      if(data.nickname){
        commentsPenName = `<input type="text" id="nickname" name="nickname" title="닉네임" class="form-input" autocomplete="off" placeholder="닉네임(12자 이내로 입력)" value="${data?.nickname}"  onclick="checkPopup('loginInfoPopup')"  maxlength="12"/>`;
      }  
      document.getElementById('comments-penName').innerHTML  = commentsPenName;               
    })                    
  }).catch(error => console.log(error));
}

function checkPopup(popup){
  if(!window.localStorage.getItem('me')){      
    layerPopup.openPopup(popup);
  }  
}

function cancelRegister(){
  let selectBox = document.getElementById('selectBox');
  let category = (selectBox.options[selectBox.selectedIndex]).value;    
  
  let title = document.getElementById("title").value;
  let editor = document.getElementById("editor").value;

  if(category == '' && title.length === 0 && editor.length === 0 ){
    location.href='../community/community.html';
  }else{
    layerPopup.openPopup('writeCancelPopup');
  }
}


function postDetail(id, page) {
  let url = baseUrl + "/community-comment/register";  
  let comment_input = document.getElementById("comment-input").value;
  let nickname = document.getElementById("nickname").value;

  if(nickname.length === 0){   
    layerPopup.openPopup('loginInfoPopup2');
  }else if(comment_input.length === 0){ 
    layerPopup.openPopup('loginInfoPopup3');
  }else if(checkBanWord(comment_input)){
    layerPopup.openPopup('loginInfoPopup7');
  }else if(checkBanWord(nickname)){
    layerPopup.openPopup('loginInfoPopup8');
  }else{
    let params = {
      communityId: id,
      penName : nickname,
      content: comment_input
    }
    const requestPost = new Request(url, {
      method: "POST",
      headers: headers.json_headers.headers,
      body: JSON.stringify(params),
    });

    async function post(request) {
      try {
      await fetch(request)
      .then(response => {
        if(!response.ok){throw new Error(response.status)}
          return response.json();        
      })
      .then(data => {
        getDetail(page);
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
}

function postFlagDetail(id, commentId, page) {
  let url = baseUrl + "/community-flag/register";    
 
  let params = {
    communityId: id,
    commentId: commentId,
    type : 0
  }
  const requestPost = new Request(url, {
    method: "POST",
    headers: headers.json_headers.headers,
    body: JSON.stringify(params),
  });

  async function post(request) {
    try {
    await fetch(request)
    .then(response => {
      if(!response.ok){throw new Error(response.status)}
        return response.json();        
    })
    .then(data => {
      getDetail(page);
    }).catch(error => {if(error.message === '401') logout() });
    
    } catch (error) {
      console.error("Error:", error);
    }      
  }

  post(requestPost);
}

function postFlagCancelDetail(id, commentId, page) {
  let url = baseUrl + "/community-flag";    
 
  let params = {
    communityId: id,
    commentId: commentId,
    state : 1,
    type : 0
  }
  const requestPost = new Request(url, {
    method: "POST",
    headers: headers.json_headers.headers,
    body: JSON.stringify(params),
  });

  async function post(request) {
    try {
    await fetch(request)
    .then(response => {
      if(!response.ok){throw new Error(response.status)}
        return response.json();        
    })
    .then(data => {
      getDetail(page);
    }).catch(error => {if(error.message === '401') logout() });
    
    } catch (error) {
      console.error("Error:", error);
    }      
  }

  post(requestPost);
}

function shareX() {
  let u = window.location.href;
  window.open("https://twitter.com/share?url=" + u);
}

function clipboard(){
  navigator.clipboard.writeText(window.location.href);
}