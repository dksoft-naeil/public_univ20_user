document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/voice/register") >= 0) getCreate();
  else if(window.location.pathname.indexOf("/voice/voice") >= 0) getVoice();
  else if(window.location.pathname.indexOf("/voice/detail") >= 0) getVoiceDetail();
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

var _file = null;

function getVoice(page = 0, size = 12){
  // let size = 10
  let url = baseUrl + "/voices?state=0,3&isRanking=1&sort=popularity&offset=0&limit=2&startDate=" + new Date().toISOString();        

  
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
    response.json().then((response) => {        
        let gridPc= "";
        let gridMobile= "";
        let data = response.data.voices;

        for( let i = 0;  i <data.length; i++){
          gridPc+=`<div class="article-info-box">
                  <a href="../voice/detail.html?id=${data[i]?.id}" class="article-info-box-btn">
                    <div class="image-box">
                    ${data[i].file?'<img src="'+data[i].file+'" alt="썸네일" />':''}
                    </div>
                    <div class="text-box">
                      <div class="subject">${data[i]?.title}</div>
                      <div class="text">${data[i]?.summary}</div>
                      <div class="info">
                        <div class="writer"><span class="name">${data[i]?.nickname}</span> 에디터</div>
                        <div class="date">${data[i]?.createDate?(dateToStrCharacterLength(strToDate(data[i]?.createDate), '.', 10)):''}</div>
                      </div>
                    </div>
                  </a>
                </div>`; 
         
          gridMobile+=`<div class="swiper-slide">
                    <div class="article-info-box">
                      <a href="../voice/detail.html?id=${data[i]?.id}" class="article-info-box-btn">
                        <div class="image-box">
                        ${data[i].file?'<img src="'+data[i].file+'" alt="썸네일" />':''}
                        </div>
                        <div class="text-box">
                          <div class="subject">${data[i]?.title}</div>
                          <div class="text">${data[i]?.summary}</div>
                          <div class="info">
                            <div class="writer"><span class="name">${data[i]?.nickname}</span> 에디터</div>
                            <div class="date">${data[i]?.createDate?(dateToStrCharacterLength(strToDate(data[i]?.createDate), '.', 10)):''}</div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>`;
        }          
        document.getElementById('grid-pc').innerHTML  = gridPc;     
        document.getElementById('grid-mobile').innerHTML  = gridMobile;          

      })                    
    }).catch(error => console.log(error));
  // 배너
  url = baseUrl + "/banners?category=4&state=0,3&offset=0&limit=999&startDate=" + new Date().toISOString()+ "&endDate=" + new Date().toISOString();      
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let html= "";
      
      let data = response.data.banners;       
      
      if(data.length > 0){
        let index =  Math.floor(Math.random() * (data.length));
                          
        html=`<a href="${data[index].href}" target="_blank" class="banner-link" onclick="getVoice()"></a>
          <div class="banner">
          ${data[index].file1?'<img src="'+data[index].file1+'" class="pc-show" alt="광고 배너" />':''}
          ${data[index].file2?'<img src="'+data[index].file2+'" class="mobile-show" alt="광고 배너" />':''}
          </div>`;  
      }
      
      document.getElementById('banners').innerHTML  = html;                    
    })                    
  }).catch(error => console.log(error));
  url = baseUrl + "/voices?state=0,3&isRanking=0&offset=" + (page*size) + "&limit=" + size + "&startDate=" + new Date().toISOString();        

  fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((response) => {
        let grid= "";
        let pagingPc= "";     
        let pagingMobile="";     
        let data = response.data.voices;
        let total = response.data.total;    
        let numOfPage = total/size;
              
        for( let i = 0;  i < data.length ; i++){
          let values = data[i];
          grid+=`<div class="article-info-box">
              <a href="../voice/detail.html?id=${values?.id}" class="article-info-box-btn">
                <div class="image-box">
                ${values.file?'<img src="'+values.file+'" alt="썸네일" />':''}
                </div>
                <div class="text-box">
                  <div class="subject">${values?.title}</div>
                  <div class="text">${values?.summary}</div>
                  <div class="info">
                    <div class="writer"><span class="name">${values?.nickname}</span> 에디터</div>
                    <div class="date">${values?.createDate?dateToStrCharacterLength(strToDate(values?.createDate), '.', 10):''}</div>
                  </div>
                </div>
              </a>
            </div>`;
        }    

        if(total >size){        
          pagingPc =`<button type="button" class="controller prev" ${page > 0 ? 'onclick="getVoice('+(page-1)+','+ size + ')"' : ''}>이전으로</button>`;
          pagingMobile=` <button type="button" class="btn medium bg-g4 prev-btn" ${page > 0 ? 'onclick="getVoice('+(page-1)+','+ size + ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
          for ( let j = 0; j< numOfPage; j++){
            pagingPc +=`<button type="button" class="paging ${page === j?'current':''}"  onclick="getVoice(`+j+`,`+ size + `)">` +  (j+1)  + `</button>`                    
          }             

          pagingPc +=`<button type="button" class="controller next" ${page < numOfPage-1 ? 'onclick="getVoice(' + (page+1) + ',' + size +  ')"' : ''}>다음으로</button>`;
          pagingMobile+=`<button type="button" class="btn medium bg-g4 next-btn"  ${page < numOfPage-1 ? 'onclick="getVoice(' + (page+1) + ',' + size +  ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;

        }
        
        document.getElementById('grid').innerHTML  = grid;     
        document.getElementById('pagingPc').innerHTML  = pagingPc; 
        document.getElementById('pagingMobile').innerHTML  = pagingMobile;              
      })                    
    }).catch(error => console.log(error));
}

function getVoiceDetail(page = 1, voicePage=1){

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

  // let size = 10
  let url = baseUrl + "/voices?id=" + id;    

  fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((response) => {     
        let aside= "";
        let article= "";   
        let articleContent= "";
        let tags= "";
        let data = response.data.voices;

        // for( let i = 0;  i <data.length; i++){
        //   // console.log('${values.title}'+ JSON.stringify(values))

        aside += `<div class="profile-box">
                <div class="image">
                  ${data[0].profilePath !== null ? '<img src="'+data[0].profilePath+'" alt="프로필 이미지" />':''}
                </div>
                <div class="info">
                  <div class="nickname"><span class="name">${data[0].nickname}</span> 에디터</div>
                  <div class="address">${data[0].email}</div>
                </div>
              </div>
              <div class="info-box">
                <div class="flow">
                  <span>글 쓰는 20대</span>
                </div>
                <div class="keyword">
                    <span class="label">키워드</span>
                    <span class="text">${data[0].subject.words}</span>
                  </div>
                  <div class="subject">
                    <span class="label">주제</span>
                    <span class="text">${data[0].subject.wordsInfo}</span>
                  </div>
                <div class="date">
                  <span class="label">작성일</span>
                  <span class="text">${dateToStrCharacterLength(strToDate(data[0].lastDate), '.', 10)}</span>
                </div>
                <!-- <div class="views">
                      <span class="label">조회수</span>
                      <span class="text">${numberWithCommas(data[0].showCount)}</span>
                    </div>
                    <div class="likes">
                      <span class="label">좋아요</span>
                      <span class="text">${numberWithCommas(data[0].likeCount)}</span>
                    </div> -->
              </div>`;

        article += ` <div class="flow">
                <span>글 쓰는 20대</span>
              </div>
              <div class="article-report-title">${data[0].title}</div>
              <div class="article-report-summary">${data[0].summary}</div>
              <div class="profile-box">
                <div class="image">
                  ${data[0].profilePath !== null ? '<img src="'+data[0].profilePath+'" alt="프로필 이미지" />':''}
                </div>
                <div class="info">
                  <div class="nickname"><span class="name">${data[0].nickname}</span> 에디터</div>
                  <div class="address">${data[0].email}</div>
                </div>
              </div>
               <div class="info-box info-box-full">
                  <div class="keyword">
                    <span class="label">키워드</span>
                    <span class="text">${data[0].subject.words}</span>
                  </div>
                  <div class="subject">
                    <span class="label">주제</span>
                    <span class="text">${data[0].subject.wordsInfo}</span>
                  </div>
                </div>
              <div class="info-box">
                <div class="date">
                  <span class="label">작성일</span>
                  <span class="text">${dateToStrCharacterLength(strToDate(data[0].lastDate), '.', 10)}</span>
                </div>
                <!-- <div class="views">
                    <span class="label">조회수</span>
                    <span class="text">${numberWithCommas(data[0].showCount)}</span>
                  </div>
                  <div class="likes">
                    <span class="label">좋아요</span>
                    <span class="text">${numberWithCommas(data[0].likeCount)}</span>
                  </div> -->
              </div>`;

        articleContent+=`<!-- 링크 포함 텍스트 -->
              <div>
                 ${data[0]?.content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />")}
              </div>
              <!-- //링크 포함 텍스트 -->

              <!-- 공백 -->
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <!-- //공백 -->`;            

              for(let i=0;i<data[0]?.tags?.split(',').length;i++){
                if(i===0)  tags+=`<div class="tag-box">`
                if(data[0]?.tags.split(',')[i].trim() === '애드벌토리얼'){
                  tags+=`<span class="fc-red">#${data[0]?.tags.split(',')[i].trim()}</span>`;
                }else{
                  tags+=`<span>#${data[0]?.tags.split(',')[i].trim()}</span>`;
                }   
                if(i === data[0]?.tags?.split(',').length -1) tags+=`</div>`;                 
              }    

        document.getElementById('aside').innerHTML  = aside;     
        document.getElementById('article').innerHTML  = article;   
        document.getElementById('articleContent').innerHTML  = articleContent;     
        document.getElementById('tags').innerHTML  = tags;    
        document.getElementById('floating-like').innerHTML = `<button class="floating-toolbar-btn active-btn like-btn ${data[0]?.isLiked > 0 ? 'check':''}" onclick="postFlagFloating(0, ${data[0].isLiked > 0 ? 1 : 0})"><i class="icon-box icon-like"></i>좋아요</button>`;
        document.getElementById('floating-save').innerHTML = `<button class="floating-toolbar-btn active-btn save-btn ${data[0]?.isSaved > 0 ? 'check':''}" onclick="postFlagFloating(1, ${data[0].isSaved > 0 ? 1 : 0})"><i class="icon-box icon-bookmark"></i>저장하기</button>`;   

      })                    
    }).catch(error => console.log(error));

  // 배너
  url = baseUrl + "/banners?category=5&state=0,3&offset=0&limit=999&startDate=" + new Date().toISOString()+ "&endDate=" + new Date().toISOString();      
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let html= "";
      
      let data = response.data.banners;       
      
      if(data.length > 0){
        let index =  Math.floor(Math.random() * (data.length));
                          
        html=`<a href="${data[index].href}" target="_blank" class="banner-link" onclick="getVoice()"></a>
          <div class="banner">
          ${data[index].file1?'<img src="'+data[index].file1+'" class="pc-show" alt="광고 배너" />':''}
          ${data[index].file2?'<img src="'+data[index].file2+'" class="mobile-show" alt="광고 배너" />':''}
          </div>`;  
      }
      
      document.getElementById('banners').innerHTML  = html;                    
    })                    
  }).catch(error => console.log(error));
  let size = 20;
  url = baseUrl + "/voice-comments?state=0&voiceId="+id+"&offset=0&limit=" + (page*size);  

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let data = response.data.comments;     
      let total = response.data.total;             
     
      let meInfo = JSON.parse(window.localStorage.getItem('me'));
      // url = baseUrl + "/users/me";  
      // fetch(url, headers.json_headers)
      // .then((response) => {
      //   response.json().then((response) => {
      //     let userId = response.data.user.id;               
          let comments= "";     
          let commentsButton="";             

          for(let i=0;i< page*size && i<total;i++){
            if( meInfo?.id == data[i]?.userId){
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
                  <div class="name">${data[i].nickname}</div>
                  <div class="date">${data[i]?.startDate?dateToStrCharacterLength(strToDate(data[i]?.startDate), '.', 10):''}</div>
                  <div class="like-box">
                    <!-- active-btn 클래스 추가 상태에서 like-btn 클릭 시 효과 적용 -->
                    <button type="button" class="active-btn like-btn ${data[i].isLiked==1? 'check' : ''}" onclick="${data[i].isLiked==1? 'postFlagCancel('+id+',' + data[i].id+',' + page+','+voicePage+')' : 'postFlag('+id+',' + data[i].id+',' + page+','+voicePage+')'}">
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
                    <button type="button" class="add-btn" onclick="getVoiceDetail(${(page+1)}, ${(voicePage)})"><i class="icon-box icon-arrow-black-down">화살표</i><span class="underline">더보기</span></button>
                  </div>`
          }  

          commentsButton = `<div class="textarea-box">
              <textarea  id="comment-input" class="form-textarea full sm" placeholder="댓글을 입력해 주세요."></textarea>
              <label for="" class="info-text">다른 사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현이나 다른 사람의 권리를 침해하는 내용은 강제 삭제될 수 있습니다.</label>
            </div>
            <button type="button" class="btn" onclick="postComment(${(id)}, ${(page)}, ${(voicePage)})">댓글 쓰기</button>`;
            
          document.getElementById('commentsTotal').innerHTML  = '댓글 '+total+'개';       
          document.getElementById('comments').innerHTML  = comments;   
          document.getElementById('comments-button').innerHTML  = commentsButton;     
        })                    
      }).catch(error => console.log(error));

      voiceSize = 4;
      url = baseUrl + "/voices?state=0,3&isRanking=0&offset=0&limit="+(voicePage*voiceSize+1) + "&startDate=" + new Date().toISOString();          

      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((response) => {
          let data = response.data.voices;     
          let total = response.data.total;               
          let articleBottom= "";    
          let articlePaging= ""; 
          let viewCount = 0;   
          
          for(let i=0;i< data.length;i++){
            if(data[i].id != id){
              articleBottom+=`<div class="article-info-box">
                  <a href="../voice/detail.html?id=${data[i].id}" class="article-info-box-btn">
                    <div class="image-box">
                    ${data[i].file?'<img src="'+data[i].file+'" alt="썸네일" />':''}
                    </div>
                    <div class="text-box">
                      <div class="subject">${data[i]?.title}</div>
                      <div class="text">${data[i]?.summary}</div>
                      <div class="info">
                        <div class="writer"><span class="name">${data[i]?.nickname}</span> 에디터</div>
                        <div class="date">${data[i]?.startDate?dateToStrCharacterLength(strToDate(data[i]?.startDate), '.', 10):''}</div>
                      </div>
                    </div>
                  </a>
                </div>`;  
                viewCount++;                
            }

            if(viewCount == (voicePage*voiceSize)){
              break;              
            }    
          }
      
          if(total > voicePage*voiceSize){
            articlePaging+=`<button type="button" class="btn medium border full" onclick="getVoiceDetail(${(page)}, ${(voicePage+1)})">더보기</button>`;
          }  

          document.getElementById('articleBottom').innerHTML  = articleBottom;        
          document.getElementById('articlePaging').innerHTML  = articlePaging;        
        })                    
      }).catch(error => console.log(error));
  
}

function getCreate(){
  // let size = 10
  let url = baseUrl + "/voice-subjects?state=0,3&offset=0&limit=1&startDate=" + new Date().toISOString() + "&endDate=" + new Date().toISOString();      

  fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((response) => {        
        let grid= "";
        let toolbar= "";
        let half= "";
        let data = response.data.subjects;

        if(data.length > 0){
          grid+=`<!-- 이달의 주제 선택 박스 -->
                <div class="selector-wrapper horizontal">
                  <div class="selector-cover radio">
                    <label class="label">
                      <input type="radio" name="topic01" id="topic01" />
                      <span class="selector-text">
                          <span class="selector"></span>
                      <span class="text-box">
                            <span class="keyword">${data[0]?.words1}</span>
                            ${data[0]?.wordsInfo1}
                      </span>
                      </span>
                    </label>
                  </div>
                  <div class="selector-cover radio">
                    <label class="label">
                      <input type="radio" name="topic01" id="topic02" />
                      <span class="selector-text">
                          <span class="selector"></span>
                      <span class="text-box">
                            <span class="keyword">${data[0]?.words2}</span>
                            ${data[0]?.wordsInfo2}
                      </span>
                      </span>
                    </label>
                  </div>
                  <div class="selector-cover radio">
                    <label class="label">
                      <input type="radio" name="topic01" id="topic03" />
                      <span class="selector-text">
                          <span class="selector"></span>
                      <span class="text-box">
                            <span class="keyword">${data[0]?.words3}</span>
                            ${data[0]?.wordsInfo3}
                      </span>
                      </span>
                    </label>
                  </div>
                </div>`;


        }else{
          grid+=`<!-- 이달의 글감 등록 전 빈 박스 -->
              <div class="empty-box">관리자에서 등록한 글쓰기 주제가 노출되는 영역 입니다. 최대 오십자까지 이곳에 노출됩니다.</div>`;
        }              
        
        toolbar+=`<button type="button" class="btn bg-g4 cancel-btn">취소</button>
        <button type="button" class="btn bg-wh save-btn" onclick="post(4, ${data[0]?.id})">임시 저장</button>
        <button type="button" class="btn bg-black write-btn" onclick="post(5, ${data[0]?.id})">글쓰기 완료</button>
        `;

        half+=`<button type="button" class="btn bg-wh save-btn" onclick="post(4, ${data[0]?.id})">임시 저장</button>
          <button type="button" class="btn bg-black write-btn" onclick="post(5, ${data[0]?.id})">글쓰기 완료</button>
        `;

        document.getElementById('grid').innerHTML  = grid;     
        document.getElementById('toolbar').innerHTML  = toolbar;     
        document.getElementById('half').innerHTML  = half;     
      })                    
    }).catch(error => console.log(error));
}


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

  if(state === 0){
    let url = baseUrl + "/voice-flag/register";    
  
    let params = {
      voiceId: id,
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
          document.getElementById('floating-like').innerHTML = `<button class="floating-toolbar-btn active-btn like-btn ${state == 0 ? 'check':''}" onclick="postFlagFloating(0, ${state == 0 ? 1 : 0})"><i class="icon-box icon-like"></i>좋아요</button>`;
        }else{
          document.getElementById('floating-save').innerHTML = `<button class="floating-toolbar-btn active-btn save-btn ${state == 0 ? 'check':''}" onclick="postFlagFloating(1, ${state == 0 ? 1 : 0})"><i class="icon-box icon-bookmark"></i>저장하기</button>`;   
          layerPopup.openPopup('loginInfoPopup6');
        } 
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }else{
    let url = baseUrl + "/voice-flag";    
  
    let params = {
      voiceId: id,
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
          document.getElementById('floating-like').innerHTML = `<button class="floating-toolbar-btn active-btn like-btn ${state == 0 ? 'check':''}" onclick="postFlagFloating(0, ${state == 0 ? 1 : 0})"><i class="icon-box icon-like"></i>좋아요</button>`;
        }else{
          document.getElementById('floating-save').innerHTML = `<button class="floating-toolbar-btn active-btn save-btn ${state == 0 ? 'check':''}" onclick="postFlagFloating(1, ${state == 0 ? 1 : 0})"><i class="icon-box icon-bookmark"></i>저장하기</button>`;   
        } 
      
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    _post(requestPost);
  }
}

function post(state, subjectId) {

  
  let wordsNum = -1; 
  let tagname = []; 
  let tagnameValid = true;

  if(document.getElementById('topic01')?.checked){
    wordsNum = 0;
  }else if(document.getElementById('topic02')?.checked){
    wordsNum = 1;
  }else if(document.getElementById('topic03')?.checked){
    wordsNum = 2;
  }

  tagname = document.getElementById('tagname').value.split(',');
  tagname.map((i) => i.length > 10 && (tagnameValid=false))

  if(state === 5 && wordsNum === -1){
    layerPopup.openPopup('popup2');
  }else if(croppedFile == null){
    layerPopup.openPopup('popup3');  
  }else if( state === 4 && document.getElementById('title').value.length == 0){
    layerPopup.openPopup('popup4-1');  
  }else if( state === 5 && (document.getElementById('title').value.length === 0 || document.getElementById('desctext').value.length === 0)){
    layerPopup.openPopup('popup4');  
  }else if(state === 5 && document.getElementById('editor').value.length == 0){
    layerPopup.openPopup('popup5');  
  }else if(state === 5 && document.getElementById('tagname').value.length == 0){
    layerPopup.openPopup('popup6');  
  }else if(state === 5 && !tagnameValid){
     layerPopup.openPopup('popup8');  
  }else if(state === 5 && document.getElementById('check-radio01').checked == false){
    layerPopup.openPopup('popup7');  
  }else{
    let formData = new FormData();
    let url = '';

    if(document.getElementById('id').innerHTML.trim() == ''){
      url = baseUrl + "/voice/register";   
    }else{
      url = baseUrl + "/voice";
      formData.append('id', document.getElementById('id').innerHTML); 
    }
  
    formData.append('state', state);
   
    if(subjectId) formData.append('subjectId' , subjectId);
    if(wordsNum > -1) formData.append('wordsNum' , wordsNum);
    formData.append('title' , document.getElementById('title').value);
    if(document.getElementById('desctext').value.length > 0) formData.append('summary' , document.getElementById('desctext').value);
    if(document.getElementById('editor').value.length > 0) formData.append('content' , document.getElementById('editor').value);
    if(document.getElementById('tagname').value.length > 0) formData.append('tags' , document.getElementById('tagname').value);
    
    if(croppedFile) formData.append("file", croppedFile, croppedFile.name);
    
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
        if(state ==4){
          layerPopup.openPopup('popup');  
          document.getElementById('id').innerHTML = data.data.voice.id;
        } 
        else layerPopup.openPopup('popup1');  
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
}


function cancelRegister() {
  if(document.getElementById('editor').value == `<div><h3>본문 제목을 입력해 주세요.</h3>본문 내용을 입력해 주세요.</div><div><br></div><div><img src="../../../resources/images/_temp/editor-image.png" alt=""></div><div><br></div><div>본문 내용을 입력해 주세요.</div>`
      && _file == null
      && document.getElementById('title').value.length == 0
      && document.getElementById('desctext').value.length == 0
      && document.getElementById('tagname').value.length == 0    
    )
  {
    location.href='../voice/voice.html';
  }else{
    layerPopup.openPopup('writeCancelPopup');
  }
}

function postComment(id, page, voicePage) {
  let url = baseUrl + "/voice-comment/register";  
  let comment_input = document.getElementById("comment-input").value;
  
  if(comment_input.length > 0){
    let params = {
      voiceId: id,
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
        getVoiceDetail(page, voicePage);
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
}

function postFlag(id, commentId, page, voicePage) {
  let url = baseUrl + "/voice-flag/register";    
 
  let params = {
    voiceId: id,
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
      getVoiceDetail(page, voicePage);
    }).catch(error => {if(error.message === '401') logout() });
    
    } catch (error) {
      console.error("Error:", error);
    }      
  }

  post(requestPost);
}

function postFlagCancel(id, commentId, page, voicePage) {
  let url = baseUrl + "/voice-flag";    
 
  let params = {
    voiceId: id,
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
      getVoiceDetail(page, voicePage);
    }).catch(error => {if(error.message === '401') logout() });
    
    } catch (error) {
      console.error("Error:", error);
    }      
  }

  post(requestPost);
}

function goRegister(){
  if(!window.localStorage.getItem('me')){
    layerPopup.openPopup('loginInfoPopup');    
  }else if(JSON.parse(window.localStorage.getItem('me')).schoolId== null){
    layerPopup.openPopup('loginInfoPopup2');  
  }else{
    location.href = '../voice/register.html';
  }      
}

function shareX() {
  let u = window.location.href;
  window.open("https://twitter.com/share?url=" + u);
}

function clipboard(){
  navigator.clipboard.writeText(window.location.href);
}
