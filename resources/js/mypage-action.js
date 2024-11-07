document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/mypage/community-detail") >= 0) getCommunity();
  else if(window.location.pathname.indexOf("/mypage/community-update") >= 0) getCommunityUpdate();
  else if(window.location.pathname.indexOf("/mypage/detail") >= 0) getVoice();
  else if(window.location.pathname.indexOf("/mypage/mypage") >= 0) get();
  else if(window.location.pathname.indexOf("/mypage/qna") >= 0) getQna();
  else if(window.location.pathname.indexOf("/mypage/report") >= 0) getReport();
  else if(window.location.pathname.indexOf("/mypage/schedule") >= 0) getScheduleUpdate(); 
  else if(window.location.pathname.indexOf("/mypage/advice") >= 0) getVoiceAdvice();
  else if(window.location.pathname.indexOf("/mypage/webzine-detail") >= 0) getStory();
  else if(window.location.pathname.indexOf("/mypage/webzine-register") >= 0) getStoryRegister();
  else if(window.location.pathname.indexOf("/mypage/update-profile") >= 0) getUpdateProfile();
  else if(window.location.pathname.indexOf("/mypage/update-password") >= 0) getUpdatePassword();
  else if(window.location.pathname.indexOf("/mypage/update") >= 0) getVoiceUpdate();
});

var voiceIds = [];
var voiceIdsSubmit = [];

var isCheckPassword = false

window.addEventListener("load",() => {
  setTimeout(()=>{   
    if(window.location.pathname.indexOf("/mypage/mypage") >= 0){
      var accordionContainer = $('.accordion-container');
      if (!accordionContainer.length) return;
      $('body').on('click', '.accordion-header', function () {
        var $this = $(this);
        var _speed = $this.closest('.accordion-container').attr('data-speed');
        _speed = _speed ? parseInt(_speed) : 200;
        accordionFn($this, _speed);
      });

      function accordionFn(el, speed) {
        speed = speed ? speed : 200;
        // 컨테이너에 solo 클래스가 있으면 각각 토글됨
        if (el.closest('.accordion-container').hasClass('solo')) {
          el.closest('.accordion-list').toggleClass('active').find('.accordion-body').stop().slideToggle(speed);
        } else {
          el.closest('.accordion-list').toggleClass('active').find('.accordion-body').stop().slideToggle(speed).closest('.accordion-list').siblings('.accordion-list').removeClass('active').find('.accordion-body').slideUp(speed);
        }
      }
    }

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
  
   

  },2000);
});

function popupCancel(tab, type, magazineFlagType, magazinePage, voiceFlagType, voicePage, storyPage,  communityFlagType, communityPage, reportPage,  qnaPage){
  if(tab === 'magazine'){       
    document.getElementById('infoAlertPopup-btn').innerHTML = `<button type="button" class="btn btn-close popup-close">취소</button><button type="button" class="btn btn-ok popup-close" onclick="cancelMagazineLike( ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage},${storyPage},  ${communityFlagType}, ${communityPage}, ${reportPage},  ${qnaPage})">완료</button>`
    document.getElementById('infoPopup-btn').innerHTML = ` <button type="button" class="btn btn-ok popup-close" onclick="layerPopup.closeAllPopup()">확인</button>`
    document.getElementById('infoAlertPopup-btn1').innerHTML = `<button type="button" class="btn btn-close popup-close">취소</button><button type="button" class="btn btn-ok popup-close" onclick="cancelMagazineSave( ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage},${storyPage},  ${communityFlagType}, ${communityPage}, ${reportPage},  ${qnaPage})">완료</button>`

    if(type == 0){
      layerPopup.openPopup('infoAlertPopup');    
    }else{
      layerPopup.openPopup('infoAlertPopup1');    
    }
    
  }else if(tab === 'voice'){

    document.getElementById('infoAlertPopup-btn').innerHTML = `<button type="button" class="btn btn-close popup-close">취소</button><button type="button" class="btn btn-ok popup-close" onclick="cancelVoiceLike( ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage},${storyPage},  ${communityFlagType}, ${communityPage}, ${reportPage},  ${qnaPage})">완료</button>`
    document.getElementById('infoPopup-btn').innerHTML = ` <button type="button" class="btn btn-ok popup-close" onclick="layerPopup.closeAllPopup()">확인</button>`
    document.getElementById('infoAlertPopup-btn1').innerHTML = `<button type="button" class="btn btn-close popup-close">취소</button><button type="button" class="btn btn-ok popup-close" onclick="cancelVoiceSave( ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage},${storyPage},  ${communityFlagType}, ${communityPage}, ${reportPage},  ${qnaPage})">완료</button>`

    if(type == 0){
      layerPopup.openPopup('infoAlertPopup');    
    }else{
      layerPopup.openPopup('infoAlertPopup1');    
    }

  }else if(tab === 'community'){

  }
}

function cancelMagazineLike(magazineFlagType,magazinePage,voiceFlagType,voicePage,storyPage,communityFlagType,communityPage,reportPage,qnaPage){
  let meInfo = JSON.parse(window.localStorage.getItem('me'));
  let magazineSize = 12
  url = baseUrl + "/magazines?state=0,3&flagUserId="+meInfo.id+"&flagType=0&offset=" + (magazinePage*magazineSize) + "&limit=" + magazineSize + "&startDate=" + new Date().toISOString(); 
 
  fetch(url, headers.json_headers)
  .then((response) => {
  checkError(response.status);
  response.json().then((response) => {
      let data = response.data.magazines;
                                   
      for( let i = 0;  i < data.length ; i++){        
        if(document.getElementById(`magazine-like-${data[i].id}`).checked === true){

          url = baseUrl + "/magazine-flag";  
      
          let params = {
            magazineId: data[i].id,
            commentId: 0,
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
              get(0, magazineFlagType,magazinePage,voiceFlagType,voicePage,storyPage,communityFlagType,communityPage,reportPage,qnaPage);
              layerPopup.openPopup('infoPopup');
            }).catch(error => {if(error.message === '401') logout() });
            
            } catch (error) {
              console.error("Error:", error);
            }      
          }
      
          post(requestPost);
        }
      }       
    })                    
  }).catch(error => console.log(error));
}


function cancelVoiceLike(magazineFlagType,magazinePage,voiceFlagType,voicePage,storyPage,communityFlagType,communityPage,reportPage,qnaPage){
  let meInfo = JSON.parse(window.localStorage.getItem('me'));
  let magazineSize = 12
  url = baseUrl + "/voices?state=0,3&flagUserId="+meInfo.id+"&flagType=0&offset=" + (magazinePage*magazineSize) + "&limit=" + magazineSize + "&startDate=" + new Date().toISOString(); 

  fetch(url, headers.json_headers)
  .then((response) => {
  checkError(response.status);
  response.json().then((response) => {
      let data = response.data.voices;
                                   
      for( let i = 0;  i < data.length ; i++){        
        if(document.getElementById(`voice-like-${data[i].id}`).checked === true){

          url = baseUrl + "/voice-flag";  
      
          let params = {
            voiceId: data[i].id,
            commentId: 0,
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
              get(0, magazineFlagType,magazinePage,voiceFlagType,voicePage,storyPage,communityFlagType,communityPage,reportPage,qnaPage);
              layerPopup.openPopup('infoPopup');
            }).catch(error => {if(error.message === '401') logout() });
            
            } catch (error) {
              console.error("Error:", error);
            }      
          }
      
          post(requestPost);
        }
      }       
    })                    
  }).catch(error => console.log(error));
}

function cancelCommunityLike(magazineFlagType,magazinePage,voiceFlagType,voicePage,storyPage,communityFlagType,communityPage,reportPage,qnaPage){

  let meInfo = JSON.parse(window.localStorage.getItem('me'));  
  url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&flagUserId="+meInfo.id+"&flagType=0"; 
 
  fetch(url, headers.json_headers)
  .then((response) => {
  checkError(response.status);
  response.json().then((response) => {
      let data = response.data.communities;
                                   
      for( let i = 0;  i < data.length ; i++){             
        if(document.getElementById(`community-like-${data[i].id}`) && (document.getElementById(`community-like-${data[i].id}`).checked === true || document.getElementById(`community-like2-${data[i].id}`).checked === true)){          
          url = baseUrl + "/community-flag";  
      
          let params = {
            communityId: data[i].id,
            commentId: 0,
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
              get(0, magazineFlagType,magazinePage,voiceFlagType,voicePage,storyPage,communityFlagType,communityPage,reportPage,qnaPage);
              layerPopup.openPopup('infoPopup');
            }).catch(error => {if(error.message === '401') logout() });
            
            } catch (error) {
              console.error("Error:", error);
            }      
          }
      
          post(requestPost);
        }
      }       
    })                    
  }).catch(error => console.log(error));
}

function getNoti(page){      
  /// notification
  let meInfo = JSON.parse(window.localStorage.getItem('me'));
  let size = 10;
  url = baseUrl + "/notifications?state=0,3&userId=" + meInfo?.id + "&offset=" + (page*size) + "&limit=" + size + "&startDate=" + new Date().toISOString();

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
        let data = response.data.notifications;  
        let total = response.data.total > 100 ? 100 : response.data.total;  
        let htmlNoti = "";
        let pagingPc = "";
        let pagingMobile = "";
        let numOfPage = total/size;

        for( let i = 0;  i < data.length ; i++){
            let values = data[i];

            let title = values.content.substring(0, values.content.indexOf(']')+1);
            let text = values.content.substring(values.content.indexOf(']')+1);

            htmlNoti += `<div class="info-content-box-item">
          <div class="mark-icon">
            <i class="icon-box ${values.category==1?'alert-icon-pencil-plus':values.category==2?'alert-icon-article':values.category==3?'alert-icon-camera':values.category==4?'alert-icon-calendar':values.category==5?'alert-icon-gift':values.category==6?'alert-icon-coins':values.category==7?'alert-icon-headphones':'alert-icon-bell'}">아이콘</i>
          </div>
          <div class="info-box">
            <div class="text"><strong>${title}</strong>${text.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />")}</div>
            <div class="row-box">
              <div class="date">${values?.startDate && dateToStrCharacterLength(strToDate(values?.startDate), '.', 16)}</div>                
            </div>
          </div>
        </div>`
        }

        if(total >size){
            pagingPc =`<button type="button" class="controller prev" ${page > 0 ? 'onclick="getNoti('+(page-1)+ ')"' : ''}>이전으로</button>`;
            pagingMobile=` <button type="button" class="btn medium bg-g4 prev-btn" ${page > 0 ? 'onclick="getNoti('+(page-1)+')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
            for ( let j = 0; j< numOfPage; j++){
              pagingPc +=`<button type="button" class="paging ${page === j?'current':''}" onclick="getNoti(`+j+ `)">` +  (j+1)  + `</button>`                    
            }             
  
            pagingPc +=`<button type="button" class="controller next" ${page < numOfPage-1 ? 'onclick="getNoti(' + (page+1) + ')"' : ''}>다음으로</button>`;
            pagingMobile+=`<button type="button" class="btn medium bg-g4 next-btn"  ${page < numOfPage-1 ? 'onclick="getNoti('+(page+1)+ ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;
                                   }
                          
        document.getElementById('html-noti').innerHTML  = htmlNoti;       
        document.getElementById('pagingPc').innerHTML  = pagingPc;   
        document.getElementById('pagingMobile').innerHTML  = pagingMobile;     
      })                    
    }).catch(error => console.log(error));

  layerPopup.openPopup('userInfoAlertPopup');
  document.getElementById('noti-area').innerHTML = `<div class="text">
                        <button type="button" class="alarm-btn" onclick="getNoti(${page})">
                          <span class="underline-text">알림</span>                          
                        </button>
                      </div>
                      <div class="number">0</div>`;
}

function cancelMagazineSave(magazineFlagType,magazinePage,voiceFlagType,voicePage,storyPage,communityFlagType,communityPage,reportPage,qnaPage){
  let meInfo = JSON.parse(window.localStorage.getItem('me'));
  let magazineSize = 12
  url = baseUrl + "/magazines?state=0,3&flagUserId="+meInfo.id+"&flagType=1&offset=" + (magazinePage*magazineSize) + "&limit=" + magazineSize + "&startDate=" + new Date().toISOString(); 
  fetch(url, headers.json_headers)
  .then((response) => {
  checkError(response.status);
  response.json().then((response) => {
      let data = response.data.magazines;
                                   
      for( let i = 0;  i < data.length ; i++){        
        if(document.getElementById(`magazine-save-${data[i].id}`).checked === true){

          url = baseUrl + "/magazine-flag";  
      
          let params = {
            magazineId: data[i].id,
            commentId: 0,
            state : 1,
            type : 1
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
              get(0, magazineFlagType,magazinePage,voiceFlagType,voicePage,storyPage,communityFlagType,communityPage,reportPage,qnaPage);
              layerPopup.openPopup('infoPopup');
            }).catch(error => {if(error.message === '401') logout() });
            
            } catch (error) {
              console.error("Error:", error);
            }      
          }
      
          post(requestPost);
        }
      }       
    })                    
  }).catch(error => console.log(error));
}

function cancelVoiceSave(magazineFlagType,magazinePage,voiceFlagType,voicePage,storyPage,communityFlagType,communityPage,reportPage,qnaPage){
  let meInfo = JSON.parse(window.localStorage.getItem('me'));
  let magazineSize = 12
  url = baseUrl + "/voices?state=0,3&flagUserId="+meInfo.id+"&flagType=1&offset=" + (magazinePage*magazineSize) + "&limit=" + magazineSize + "&startDate=" + new Date().toISOString(); 
  fetch(url, headers.json_headers)
  .then((response) => {
  checkError(response.status);
  response.json().then((response) => {
      let data = response.data.voices;
                                   
      for( let i = 0;  i < data.length ; i++){        
        if(document.getElementById(`voice-save-${data[i].id}`).checked === true){

          url = baseUrl + "/voice-flag";  
      
          let params = {
            voiceId: data[i].id,
            commentId: 0,
            state : 1,
            type : 1
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
              get(0, magazineFlagType,magazinePage,voiceFlagType,voicePage,storyPage,communityFlagType,communityPage,reportPage,qnaPage);
              layerPopup.openPopup('infoPopup');
            }).catch(error => {if(error.message === '401') logout() });
            
            } catch (error) {
              console.error("Error:", error);
            }      
          }
      
          post(requestPost);
        }
      }       
    })                    
  }).catch(error => console.log(error));
}

function cancelCommunitySave(magazineFlagType,magazinePage,voiceFlagType,voicePage,storyPage,communityFlagType,communityPage,reportPage,qnaPage){

  let meInfo = JSON.parse(window.localStorage.getItem('me'));  
  url = baseUrl + "/communities?state=0,3&flagUserId="+meInfo.id+"&flagType=1&startDate=" + new Date().toISOString(); 
  fetch(url, headers.json_headers)
  .then((response) => {
  checkError(response.status);
  response.json().then((response) => {
      let data = response.data.communities;
                                   
      for( let i = 0;  i < data.length ; i++){        
        if(document.getElementById(`community-save-${data[i].id}`) && (document.getElementById(`community-save-${data[i].id}`).checked === true || document.getElementById(`community-save2-${data[i].id}`).checked === true)){

          url = baseUrl + "/community-flag";  
      
          let params = {
            communityId: data[i].id,
            commentId: 0,
            state : 1,
            type : 1
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
              get(0, magazineFlagType,magazinePage,voiceFlagType,voicePage,storyPage,communityFlagType,communityPage,reportPage,qnaPage);
              layerPopup.openPopup('infoPopup');
            }).catch(error => {if(error.message === '401') logout() });
            
            } catch (error) {
              console.error("Error:", error);
            }      
          }
      
          post(requestPost);
        }
      }       
    })                    
  }).catch(error => console.log(error));
}

function changeMobile(){
  let phone = document.getElementById("phone").value;

  if(phone >= 9) {
    let numbers = phone.replace(/[^0-9]/g, "")
          .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
    document.getElementById("phone").value = numbers;
  }
}

function postProfile(){
  let meInfo = JSON.parse(window.localStorage.getItem('me'));

  if(document.getElementById("nickname").value.length == 0 ){
    layerPopup.openPopup('popup9');   
  }else if(document.getElementById("email").value.length == 0 ){
    layerPopup.openPopup('popup10');   
  }else if(document.getElementById("phone").value.length == 0 ){
    layerPopup.openPopup('popup11');   
  }else{
    url = baseUrl + "/schools?name=" + document.getElementById('schoolid').value;  

    fetch(url, headers.json_headers)
    .then((response) => {
        checkError(response.status);
        response.json().then((response) => {
          
          url = baseUrl + "/user"; 
          let params = {
            id : meInfo.id,            
            nickname : document.getElementById("nickname").value,
            email : document.getElementById("email").value,
            instagramUrl :(document.getElementById("instargram")?.value?document.getElementById("instargram")?.value:''),
            youtubeUrl :(document.getElementById("youtube").value?document.getElementById("youtube")?.value:''),
            byLine :document.getElementById("byline-radio-0").checked?0:document.getElementById("byline-radio-1").checked?1:document.getElementById("byline-radio-2").checked?2:3,
            mobile : document.getElementById("phone").value.replaceAll('-', ''),
            schoolId : response.data.schools[0].id,
            schoolEmail :document.getElementById("schoolmail").value,
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
              
            }).catch(error => {if(error.message === '401') logout() });
            
            } catch (error) {
              console.error("Error:", error);
            }      
          }

          post(requestPost);

          if(isCroppedFileModified){

            url = baseUrl + "/user/upload-profile-image"; 

            let formData = new FormData();
            formData.append('userId', meInfo.id);
            if(croppedFile) formData.append("file", croppedFile, croppedFile.name);

            async function post(request) {
              try {
                await fetch(request).then(response => {
                    if(response.status === 200) {  // No content    
                      console.log('success profile image uploading.');
                    }
                }); 
              } catch (error) {
                console.error("Error:", error);
              }}
              
              const profileRequest = new Request(url, {
                  method: "POST",
                  headers: headers.form_headers.headers,
                  body:formData,
              });
              
              post(profileRequest);
          }
        })                    
      }).catch(error => console.log(error));
  }
}

function getUpdateProfile(){
  let url = baseUrl + "/users/me";  

  let htmlMe = "";
  let htmlId = "";
  let htmlName = "";
  let htmlYear = "";
  let htmlMonth = "";
  let htmlDate = "";
  let htmlNickname = "";
  let htmlEmail = "";
  let htmlInsta = "";
  let htmlYoutube = "";
  let htmlByLine = "";
  let htmlMobile = "";

  fetch(url, headers.json_headers)
  .then((response) => {
      checkError(response.status);
      response.json().then((meInfo) => {  
    
      window.localStorage.setItem('me',JSON.stringify(meInfo.data.user))
      let data = meInfo.data.user;  

      let loginType = window.localStorage.getItem("loginType")
      htmlMe+= loginType === 'email' ?
          `<div class="user-info-alert-box">
            <i class="icon-box icon-mail-round"></i>
            <div class="text-box">
              ${data.nickname}님은<br class="pc-show" />
              <span class="underline-text">이메일 로그인 회원</span>입니다.
            </div>
          </div>` :
        loginType === 'naver' ?
          `<div class="user-info-alert-box">
            <i class="icon-box icon-naver-round"></i>
            <div class="text-box">
              ${data.nickname}님은<br class="pc-show" />
              <span class="underline-text">네이버 로그인 회원</span>입니다.
            </div>
          </div>` :
        loginType === 'kakao' ?
          `<i class="icon-box icon-kakao-round"></i>
          <div class="text-box">
            ${data.nickname}님은<br class="pc-show" />
            <span class="underline-text">카카오 로그인 회원</span>입니다.
          </div>` : '';
                    
      htmlId+=`<label for="id" class="form-label">아이디</label>
        <input type="text" id="id" name="id" title="아이디" class="form-input" autocomplete="off" readonly value="${data.loginId}" />`;  

      htmlName+=`<label for="name" class="form-label">이름</label>
                      <input type="text" id="name" name="name" title="이름" class="form-input" autocomplete="off" readonly value="${data.name}" />`;     
                      
      htmlYear+=`<option value="">년 선택</option> `;
      let thisYear = new Date().getFullYear() -19;
      for(let i = thisYear; i >=1955  ; i--){
        if(data?.birth?.substring(0,4) == i) htmlYear+= `<option value="${i}" selected>${i}년</option> `;
        else htmlYear+= `<option value="${i}">${i}년</option> `;        
      }

      htmlMonth+=`<option value="">월 선택</option> `;
      for(let i = 1; i <=12  ; i++){
        if(Number(data?.birth?.substring(4,6)) == i) htmlMonth+= `<option value="${i}" selected>${i}월</option> `;
        else htmlMonth+= `<option value="${i.toString().padStart(2, '0')}">${i}월</option> `;        
      }

      htmlDate+=`<option value="">일 선택</option> `;     
      for(let i = 1; i <=31  ; i++){
        if(Number(data?.birth?.substring(6,8)) == i) htmlDate+= `<option value="${i}" selected>${i}일</option> `;
        else htmlDate+= `<option value="${i.toString().padStart(2, '0')}">${i}일</option> `;        
      }

      htmlNickname+=`<input type="text" id="nickname" name="nickname" title="닉네임" class="form-input" autocomplete="off" value="${data.nickname}" maxlength="12"/>
                        <button type="button" class="btn medium bg-wh" onclick="checkNickname()">중복 확인</button>`;    
                    
      htmlEmail+=`<label for="email" class="form-label">이메일</label>
                      <input type="text" id="email" name="email" title="이메일" class="form-input" autocomplete="off" value="${data.email}" />
                      <div class="form-guide-text font">※ 수신 가능한 이메일 주소를 정확히 입력하셔야 대학내일의 주요 공지를 받아보실 수 있습니다.</div>`;

      htmlInsta+=`<label for="instargram" class="form-label">인스타그램(선택)</label>
                      <input type="text" id="instargram" name="instargram" title="인스타그램" class="form-input" autocomplete="off" value="${data.instagramUrl?data.instagramUrl:''}" />
                    `;
      
      htmlYoutube+=`<label for="instargram" class="form-label">유튜브(선택)</label>
                      <input type="text" id="youtube" name="instargram" title="유튜브" class="form-input" autocomplete="off" value="${data.youtubeUrl?data.youtubeUrl:''}" />
                    `;

      htmlByLine+=`<div class="selector-cover radio">
                      <label class="label">
                        <input type="radio" name="byline-radio" id="byline-radio-0" ${data.byLine == 0?'checked' :''} />
                        <span class="selector-text">
                            <span class="selector"></span>
                        공개 안함
                        </span>
                      </label>
                    </div>
                    <div class="selector-cover radio">
                      <label class="label">
                        <input type="radio" name="byline-radio" id="byline-radio-1"  ${data.byLine == 1?'checked' :''}/>
                        <span class="selector-text">
                            <span class="selector"></span>
                        이메일
                        </span>
                      </label>
                    </div>
                    <div class="selector-cover radio">
                      <label class="label">
                        <input type="radio" name="byline-radio" id="byline-radio-2" ${data.byLine == 2?'checked' :''}/>
                        <span class="selector-text">
                            <span class="selector"></span>
                        인스타그램
                        </span>
                      </label>
                    </div>
                    <div class="selector-cover radio">
                      <label class="label">
                        <input type="radio" name="byline-radio" id="byline-radio-3" ${data.byLine == 3?'checked' :''}/>
                        <span class="selector-text">
                            <span class="selector"></span>
                        유튜브
                        </span>
                      </label>
                    </div>`;   
                
      htmlMobile += `<input type="text" id="phone" name="phone" title="연락처" class="form-input" autocomplete="off" value="${data.mobile?data.mobile:''}" onchange="changeMobile()"/>
                        <button type="button" class="btn medium bg-wh" onclick="getCodesMobile()">연락처 인증</button>`;
           
      document.getElementById('htmlMe').innerHTML  = htmlMe;   
      document.getElementById('htmlId').innerHTML  = htmlId;   
      document.getElementById('htmlName').innerHTML  = htmlName;   
      document.getElementById('htmlYear').innerHTML  = htmlYear; 
      document.getElementById('htmlMonth').innerHTML  = htmlMonth;  
      document.getElementById('htmlDate').innerHTML  = htmlDate;   
      document.getElementById('htmlNickname').innerHTML = htmlNickname; 
      document.getElementById('htmlEmail').innerHTML = htmlEmail; 
      document.getElementById('htmlInsta').innerHTML = htmlInsta; 
      document.getElementById('htmlYoutube').innerHTML = htmlYoutube; 
      document.getElementById('htmlByLine').innerHTML = htmlByLine; 
      document.getElementById('htmlMobile').innerHTML = htmlMobile; 
      document.getElementById('schoolmail').value = data.schoolEmail;    
      
      if(data.profilePath) sendFileToDropzone(cropDropzone,data.profilePath);

      if(data.schoolId > 0){
        url = baseUrl + "/schools?id=" + data.schoolId;  
      
        fetch(url, headers.json_headers)
        .then((response) => {
            checkError(response.status);
            response.json().then((response) => {
            
            let data = response.data.schools;             
           
            document.getElementById('schoolid').value = data[0].name; 
            
          })                    
        }).catch(error => console.log(error));
      }
     
    })                    
  }).catch(error => console.log(error));

  /// drop foile //////////////////////////////////////////////////////////////////////////
  const sendFileToDropzone = async (dropzone, url) => {
    if(!url) return;
    const response = await fetch(url);
    const data = await response.blob();
    const ext = url.split(".").pop(); 
    const metadata = {type: `image/${ext}`};
    const filename = url.split("/").pop();
    var file = new File([data], filename, metadata);

    dropzone.emit("addedfile", file, true);   
    dropzone.emit("thumbnail", file, url);
    dropzone.emit("accept", file);
    dropzone.emit("complete", file);
  };
}

function getUpdatePassword(){
  isCheckPassword = false;

  let loginType = window.localStorage.getItem("loginType");
  let meInfo = JSON.parse(window.localStorage.getItem('me'));

  let htmlMe = loginType === 'email' ?
      `<div class="user-info-alert-box">
        <i class="icon-box icon-mail-round"></i>
        <div class="text-box">
          ${meInfo.nickname}님은<br class="pc-show" />
          <span class="underline-text">이메일 로그인 회원</span>입니다.
        </div>
      </div>` :
      loginType === 'naver' ?
      `<div class="user-info-alert-box">
        <i class="icon-box icon-naver-round"></i>
        <div class="text-box">
          ${meInfo.nickname}님은<br class="pc-show" />
          <span class="underline-text">네이버 로그인 회원</span>입니다.
        </div>
      </div>` :
      loginType === 'kakao' ?
      `<i class="icon-box icon-kakao-round"></i>
      <div class="text-box">
        ${meInfo.nickname}님은<br class="pc-show" />
        <span class="underline-text">카카오 로그인 회원</span>입니다.
      </div>` : '';

      document.getElementById('htmlMe').innerHTML = htmlMe;   
}

function onCheckPassword1(){
  isCheckPassword = false;
  let password1 = $('#password1').val();
  let password2 = $('#password2').val();

  let valid_num = /[0-9]/;	                          // 숫자 
  let valid_eng = /[a-zA-Z]/;	                        // 문자 
  let valid_spc = /[~!@#$%^&*()+,-./;?\'\"_{}\[\]]/;  // 특수문자 
  //let unvalid_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;             // 한글체크
  let unvalid_chars = /[^a-zA-Z0-9~!@#$%^&*()+,-./;?\'\"_{}\[\]]/;
  if(!valid_num.test(password1) || !valid_eng.test(password1) || !valid_spc.test(password1) || unvalid_chars.test(password1) || password1.length < 8){
    return document.getElementById("pw-valid1").innerHTML = "※ 사용 할 수 없는 비밀 번호 입니다.";
  }
  else {
    document.getElementById("pw-valid1").innerHTML = "";
    
    if(password2.length > 0 && password1 !== password2){
      document.getElementById("pw-valid2").innerHTML = "※ 비밀번호가 일치하지 않습니다.";
    }
    else document.getElementById("pw-valid2").innerHTML = "";
  }
}

function onCheckPassword2(){
  let password1 = $('#password1').val();
  let password2 = $('#password2').val();

  if(password1 !== password2){
    document.getElementById("pw-valid2").innerHTML = "※ 비밀번호가 일치하지 않습니다.";
    isCheckPassword = false;
  }else{
    document.getElementById("pw-valid2").innerHTML = "";
    isCheckPassword = true;
  }
}

function postChangePassword(){
  if(document.getElementById("currentPassword").value.length == 0){
    document.getElementById("alertMessage").innerHTML = "<strong>현재 비밀번호를 입력해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('alertPopup', true);"; 
    return;     
  }
  if(document.getElementById("password1").value.length == 0 || document.getElementById("password2").value.length == 0 ){
    document.getElementById("alertMessage").innerHTML = "<strong>비밀번호를 입력해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('alertPopup', true);"; 
    return;     
  }
  if(document.getElementById("password1").value != document.getElementById("password2").value ){
    document.getElementById("alertMessage").innerHTML = "<strong>비밀번호가 일치하지 않습니다.</strong>";
    location.href= "javascript:layerPopup.openPopup('alertPopup', true);";
    return;      
  }

  let url = baseUrl + "/user/change-password";
  
  let params = {
    currentPassword: $("#currentPassword").val(),
    newPassword: $("#password2").val()
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
      .then(response => {    
        if(response.result === 'ok'){
          $("#currentPassword").val('');
          $("#password1").val('')
          $("#password2").val('')
          isCheckPassword = false;
          document.getElementById("alertMessage").innerHTML = "<strong>비밀번호가 변경 되었습니다.</strong>";
          location.href= "javascript:layerPopup.openPopup('alertPopup', true);";
        }
      }).catch(error => { 
        console.error("Error:", error);
      });
    } catch (error) {
      console.error("Error:", error);
    }      
  }

  post(requestPost);

}

function postCodeConfirmPhone(){
  let url = baseUrl + "/code/confirm";  
  let checknumber = document.getElementById("checkphone").value;
  
  if(checknumber.length > 0){
    let params = {
      target: document.getElementById("phone").value.replaceAll("-", "").replace(".", ""),
      type: 0,
      key: checknumber,
      client_id : client_id,
      client_secret :client_secret,
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
      .then(response => {    
        if(response.result === 'ok'){
            document.getElementById("alertPopupMessage").innerHTML = "<strong>연락처가 인증되었습니다.</strong>";
            document.getElementById('checkphone-button').innerHTML = '인증완료';
            document.getElementById('checkphone-button').disabled= true;
            location.href= "javascript:layerPopup.openPopup('alertPopup', true);";      
        }
      }).catch(error => { 
        document.getElementById("alertPopupMessage").innerHTML = "<strong>올바른 인증 번호를 입력해 주세요.</strong>";
        location.href= "javascript:layerPopup.openPopup('alertPopup', true);";     
        document.getElementById("checkphone").value = "";
      });
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
}

function postCodeConfirm(){
  let url = baseUrl + "/code/confirm";  
  let checknumber = document.getElementById("checknumber").value;

  if(checknumber.length > 0){
    let params = {
      target: document.getElementById("schoolmail").value,
      type: 1,
      key: checknumber,
      client_id : client_id,
      client_secret :client_secret,
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
      .then(response => {    
        if(response.result === 'ok'){
            url = baseUrl + "/schools?domain=" + document.getElementById("schoolmail").value.substring(document.getElementById("schoolmail").value.indexOf('@')+1, document.getElementById("schoolmail").value.length);  
          
            fetch(url, headers.json_headers)
            .then((response) => {
                checkError(response.status);
                response.json().then((response) => {
                
                let data = response.data.schools;             

                if(data.length > 0){
                  document.getElementById('schoolid').value = data[0].name;          
                  layerPopup.openPopup('popup4');
                  document.getElementById('checkschool-button').innerHTML = '인증완료';
                  document.getElementById('checkschool-button').disabled= true;                 
                }else{                  
                  layerPopup.openPopup('popup5');  
                }     
                
              })                    
            }).catch(error => console.log(error));
        }
        
      }).catch(error => { 
        layerPopup.openPopup('popup5');     
      });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
}

function getCodesMobile(){

  let url = baseUrl + "/code/generate";  
  
  if(document.getElementById("phone").value.length > 0){
    let params = {
      target: (document.getElementById("phone").value.replace('-', '').replace('-', '')),
      type: 0,
      client_id : client_id,
      client_secret :client_secret,
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
      .then(response => {
        document.getElementById("alertPopupMessage").innerHTML = "<strong>입력하신 연락처로</br>인증 번호가 발송되었습니다.</strong>";
        location.href= "javascript:layerPopup.openPopup('alertPopup', true);";    
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
}

function getCodesSchool(){
  let url = baseUrl + "/code/generate";  
  
  if(document.getElementById("schoolmail").value.length > 0){
    let params = {
      target: document.getElementById("schoolmail").value,
      type: 1,
      client_id : client_id,
      client_secret :client_secret,
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
      .then(response => {
        document.getElementById('popup3-text').innerHTML = `<strong>
        ${document.getElementById("schoolmail").value}로</br>인증 번호가 발송되었습니다.</br>받지 못하셨다면, 스팸함도 확인해 주세요.
      </strong>`;
        layerPopup.openPopup('popup3');   
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
}

function checkNickname(){
  let url = baseUrl + "/user/exists";  
  let nickname = document.getElementById("nickname").value;
  let client_id = '';
  let client_secret = '';
  let meInfo = JSON.parse(window.localStorage.getItem('me'));
  if(nickname.length > 0 && meInfo.nickname != nickname){
    let params = {
      nickname: nickname,
      client_id: client_id,
      client_secret: client_secret
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
      .then(response => {
        if(response.data.exists){
          layerPopup.openPopup('popup2');
          document.getElementById("nickname").value = '';
        }else if(checkBanWord(nickname)){
          document.getElementById("alertMessage").innerHTML = "<strong>올바르지 않은 닉네임입니다.<br />다른 닉네임을 입력해 주세요.</strong>";
          layerPopup.openPopup('popup1');
          document.getElementById("nickname").value = '';
        }else{
          document.getElementById("alertMessage").innerHTML = " 사용할 수 있는 닉네임 입니다.";
          layerPopup.openPopup('popup1');
        }
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
}

function get(page = 0, magazineFlagType = 0, magazinePage = 0, voiceFlagType = -1, voicePage = 0, storyPage = 0, communityFlagType=-1, communityPage=0, reportPage = 0, qnaPage = 0, date = null){ 
    /// me info
    let url = baseUrl + "/users/me";  
    let meInfo = JSON.parse(window.localStorage.getItem('me'));
    let htmlMe = "";
    fetch(url, headers.json_headers)
    .then((response) => {
     checkError(response.status);
      response.json().then((meInfo) => {
        let data = meInfo.data.user;  
        window.localStorage.setItem('me',JSON.stringify(meInfo.data.user))
       
        htmlMe+=`<div class="profile-box user-profile-box">
                  <div class="image">                    
                    ${data?.profilePath > 0 ? '<img src="'+data.profilePath+'" alt="프로필 이미지" />' : ''}
                  </div>
                  <div class="info">
                    <div class="nickname">${data.nickname}</div>
                    <div class="state-box">                      
                      <div class="member-state${data?.schoolId > 0 ? ' check' : ''}">                      
                        <i class="icon-box icon-check"></i>                        
                        <span>대학교 ${data?.schoolId > 0 ? '' : '미' }인증 회원</span>
                      </div>
                      <div class="edit-info">
                        <a href="../mypage/update-profile.html" class="edit-btn">
                          <i class="icon-box icon-edit"></i>
                          <span>내 정보 수정</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- //user-profile-box -->
                <div class="user-check-state-box">
                  <div class="user-check-state-box-item">
                    <div class="mark-box like">
                      <i class="icon-box"></i>
                    </div>
                    <div class="text-box">
                      <div class="text">좋아요 누른 글</div>
                      <div class="number">${numberWithCommas(data.activity.likeCount)}</div>
                    </div>
                  </div>
                  <div class="user-check-state-box-item">
                    <div class="mark-box bookmark">
                      <i class="icon-box"></i>
                    </div>
                    <div class="text-box">
                      <div class="text">저장한 글</div>
                      <div class="number">${numberWithCommas(data.activity.saveCount)}</div>
                    </div>
                  </div>
                  <div class="user-check-state-box-item">
                    <div class="mark-box schedule">
                      <i class="icon-box"></i>
                    </div>
                    <div class="text-box">
                      <div class="text">내 일정</div>
                      <div class="number">${numberWithCommas(data.activity.scheduleCount)}</div>
                    </div>
                  </div>
                  <div class="user-check-state-box-item">
                    <div class="mark-box alarm">
                      <i class="icon-box"></i>
                    </div>
                    <div class="text-box" id="noti-area">
                      <div class="text">
                        <button type="button" class="alarm-btn" onclick="getNoti(${page})">
                          <span class="underline-text">알림</span>
                          <!-- 새롭게 도착한 알림 메시지를 레이어 팝업을 통해 확인하지 않았다면 "N" 아이콘 노출 -->
                          ${data.activity.notificationCount > 0 ? '<i class="icon-new">N</i>' : ''}
                        </button>
                      </div>
                      <div class="number">${data.activity.notificationCount}</div>
                    </div>
                  </div>
                </div>
                <!-- //user-check-state-box -->
                <div class="user-write-point-box">
                  <div class="point-box">
                    <div class="mark-box">
                      <div class="icon-box icon-coin"></div>
                    </div>
                    <div class="text-box">
                      <div class="text">
                        나의 포인트
                        <!-- 지급 신청 -->
                        <button type="button" class="btn small bg-wh round point-btn" onclick="layerPopup.openPopup('pointInfoAlertPopup', true)" id="post-point"><i class="icon-box icon-wallet"></i>입금 신청</button>
                        <!-- 입금 대기 중 -->
                        <!-- <button type="button" class="btn small bg-wh round point-btn" disabled><i class="icon-box icon-wallet"></i>입금 대기 중</button> -->
                      </div>
                      <div class="point">${data.point}P</div>
                    </div>
                  </div>
                </div>`;      
                
        document.getElementById('html-me').innerHTML  = htmlMe;  
      })                    
    }).catch(error => console.log(error));         
   
  /// mission //////////////////////////////////////////////////////////////////////////
  url = baseUrl + "/missions?userId=" + meInfo.id
  
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let data = response.data.missions;  
      let task = response.data.tasks;    


      document.getElementById("mission-voice").innerHTML = `<div class="label">기본</div>
                    <!-- 미션 클리어 시 clear 클래스 추가 -->
                    <div class="mission-icon${data[0]?.voiceCount >= task?.voice ? ' clear' : ''}">
                        <div class="no-clear">기본 미션 미달성</div>
                        <div class="clear">기본 미션 달성</div>
                    </div>
                    <div class="text-box">
                        <div class="title">글 쓰는 20대</div>
                        <div class="mission">글쓰기 ${task?.voice}회</div>
                    </div>`;
      document.getElementById("community-voice").innerHTML = `<div class="label">기본</div>
                    <!-- 미션 클리어 시 clear 클래스 추가 -->
                    <div class="mission-icon${data[0]?.communityCount >= task?.community ? ' clear' : ''}">
                        <div class="no-clear">기본 미션 미달성</div>
                        <div class="clear">기본 미션 달성</div>
                    </div>
                    <div class="text-box">
                        <div class="title">커뮤니티</div>
                        <div class="mission">글쓰기 ${task?.community}회</div>
                    </div>`;
      document.getElementById("report-voice").innerHTML =  `<div class="label">기본</div>
                <!-- 미션 클리어 시 clear 클래스 추가 -->
                <div class="mission-icon${data[0]?.reportCount >= task?.report ? ' clear' : ''}">
                    <div class="no-clear">기본 미션 미달성</div>
                    <div class="clear">기본 미션 달성</div>
                </div>
                <div class="text-box">
                    <div class="title">알려주기</div>
                    <div class="mission">이슈 제보 ${task?.report}회</div>
                </div>`;
      document.getElementById("report-post-voice").innerHTML =  `<div class="label">도전</div>
                    <!-- 미션 클리어 시 clear 클래스 추가 -->
                    <div class="mission-icon challenge${data[0]?.postVoiceCount >= task?.postVoice ? ' clear' : ''}">
                        <div class="no-clear">도션 미션 미달성</div>
                        <div class="clear">도전 미션 달성</div>
                    </div>
                    <div class="text-box">
                        <div class="title">캠퍼스 에디터</div>
                        <div class="mission">
                        글 쓰는 20대<br class="mobile-show" />
                          기사 발행 ${task?.postVoice}회
                        </div>
                    </div>`;
      document.getElementById("report-post-report").innerHTML =  `<div class="label">도전</div>
                    <!-- 미션 클리어 시 clear 클래스 추가 -->
                    <div class="mission-icon challenge${data[0]?.postReportCount >= task?.postReport ? ' clear' : ''}">
                        <div class="no-clear">도션 미션 미달성</div>
                        <div class="clear">도전 미션 달성</div>
                    </div>
                    <div class="text-box">
                        <div class="title">크롤러</div>
                        <div class="mission">
                        제보 내용<br class="mobile-show" />
                          기사 발행 ${task?.postReport}회
                        </div>
                    </div>`;
    
                  })                    
                }).catch(error => console.log(error));

  /// magazine  //////////////////////////////////////////////////////////////////////////
  let magazineSize = 12;
  url = baseUrl + "/magazines?state=0,3&flagUserId="+meInfo.id+"&flagType=0&offset=0&limit=12&startDate=" + new Date().toISOString();     
  fetch(url, headers.json_headers)
  .then((response) => {
  checkError(response.status);
  response.json().then((response) => {
      let totalLike = response.data.total;

      url = baseUrl + "/magazines?state=0,3&flagUserId="+meInfo.id+"&flagType=1&offset=0&limit=12&startDate=" + new Date().toISOString();     
      fetch(url, headers.json_headers)
      .then((response) => {
      checkError(response.status);
      response.json().then((response) => {            
          let totalSave = response.data.total;             
                      
          document.getElementById('magazine-tab1').innerHTML  = `<a href="#magazineFavorite" class="content-tab-menu-box-btn" onclick="get(${page}, 0,  `+(magazinePage)+ `);">
                      <span>좋아요 누른 글</span>
                      <span class="number">(${totalLike})</span>
                    </a>`;                  
          document.getElementById('magazine-tab2').innerHTML  = `<a href="#magazineBookmark" class="content-tab-menu-box-btn" onclick="get(${page}, 1,  `+(magazinePage)+ `);">
                      <span>저장한 글</span>
                      <span class="number">(${totalSave})</span>
                    </a>`;          
          if(totalLike > 0) document.getElementById('magazine-like-cancel').innerHTML = `<button type="button" class="btn icon-btn small round bg-black fw700" onclick="popupCancel('magazine', 0, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage}, ${storyPage}, ${communityFlagType}, ${communityPage}, ${reportPage}, ${qnaPage})"><i class="icon-box icon-like-cancle"></i>좋아요 취소</button>`
          if(totalSave > 0) document.getElementById('magazine-save-cancel').innerHTML = `<button type="button" class="btn icon-btn small round bg-black fw700" onclick="popupCancel('magazine', 1, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage}, ${storyPage}, ${communityFlagType}, ${communityPage}, ${reportPage}, ${qnaPage})"><i class="icon-box icon-bookmark-cancle"></i>저장 취소</button>`
          })

      }).catch(error => console.log(error));
    })                    
  }).catch(error => console.log(error));

  url = baseUrl + "/magazines?state=0,3&flagUserId="+meInfo.id+"&flagType=0&offset=" + (magazinePage*magazineSize) + "&limit=" + magazineSize + "&startDate=" + new Date().toISOString(); 

  let _magazineDate = document.getElementById('magazine-date');
  let magazineDate = (_magazineDate.options[_magazineDate.selectedIndex]).value;    

  let _magazineCategory = document.getElementById('magazine-category');
  let magazineCategory = (_magazineCategory.options[_magazineCategory.selectedIndex]).value;    

  if(magazineCategory !== null && magazineCategory !== ""){
      url += "&category="+magazineCategory;    
  }
  if(magazineDate !== null && magazineDate !== ""){
      let start = new Date();
      start.setFullYear(magazineDate);
      start.setMonth(0);
      start.setDate(1);
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);

      let end = new Date();
      end.setFullYear(magazineDate);
      end.setMonth(11);
      end.setDate(31);
      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);
      
      url += "&startCreateDate="+start.toISOString();    
      url += "&endCreateDate="+end.toISOString();    
  }

  fetch(url, headers.json_headers)
  .then((response) => {
  checkError(response.status);
  response.json().then((response) => {
      let magazine = "";
      let data = response.data.magazines;
      let total = response.data.total;
      let numOfPage = total/magazineSize;
      let pagingPCMagazine = "";
      let pagingMobileMagazine = ""; 
                                  
      for( let i = 0;  i < data.length ; i++){
        let values = data[i];
          magazine+=`<div class="article-info-box">
              <a href="../magazine/feature.html?id=${values.id}" class="article-info-box-btn">
                  <div class="selector-cover checkbox square solo">
                  <label class="label">
                      <input type="checkbox"  id="magazine-like-${values.id}" />
                      <span class="selector-text">
                          <span class="selector"></span>
                      </span>
                  </label>
                  </div>
                  <div class="image-box">
                  ${values.file1?'<img src="'+values.file1+'" alt="썸네일" />':''}
                  </div>
                  <div class="text-box">
                  <div class="subject">${values.title}</div>
                  <div class="text">${values.summary}</div>
                  <div class="info">
                      <div class="writer"><span class="name">${values.nickname}</span> 에디터</div>
                      <div class="date">${values.startDate ? dateToStrCharacterLength(strToDate(values?.startDate), '.', 10) : dateToStrCharacterLength(strToDate(values?.lastDate), '.', 10)}</div>
                  </div>
                  </div>
              </a>
              </div>`;    
      }       

      if(magazineFlagType ==0 && total >magazineSize){
        pagingPCMagazine =`<button type="button" class="controller prev" ${magazinePage > 0 ? 'onclick="get('+page+ ',' + magazineFlagType +  ',' + (magazinePage-1) +')"' : ''}>이전으로</button>`;
        pagingMobileMagazine=` <button type="button" class="btn medium bg-g4 prev-btn" ${magazinePage > 0 ? 'onclick="get(' + page + ',' + magazineFlagType + ',' +(magazinePage-1) +')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`;
        for ( let j = 0; j< numOfPage; j++){
          pagingPCMagazine +=`<button type="button" class="paging ${magazinePage === j?'current':''}"  onclick="get(${page},  ${magazineFlagType}, `+(j)+`)">` +  (j+1)  + `</button>`;
        }             

        pagingPCMagazine +=`<button type="button" class="controller next" ${magazinePage < numOfPage-1 ? 'onclick="get(' + (page) + ',' + magazineFlagType+ ',' + (magazinePage+1) + ')"' : ''}>다음으로</button>`;
        pagingMobileMagazine+=`<button type="button" class="btn medium bg-g4 next-btn"  ${magazinePage < numOfPage-1 ? 'onclick="get(' + (page) + ',' + magazineFlagType+ ',' + (magazinePage+1) + ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;
                  
        document.getElementById('pagingPCMagazine').innerHTML  = pagingPCMagazine; 
        document.getElementById('pagingMobileMagazine').innerHTML  = pagingMobileMagazine; 
      }

      let magazineLikeNoData = '';
      if(total==0){
        magazineLikeNoData = `<a href="../magazine/magazine.html" class="empty-link-btn">
                      <i class="icon-box icon-plus-square">+</i>
                      <div class="text">
                        재미있게 읽은 글에<br />
                          ‘좋아요’를 눌러 주세요.
                      </div>
                    </a>`;  
        document.getElementById('pagination-box-magazine').style.display = 'none';
        
      }

      document.getElementById('magazine-grid').innerHTML  = magazine;  
      document.getElementById('magazineLikeNoData').innerHTML  = magazineLikeNoData;  

    })                    
  }).catch(error => console.log(error));
  
  url = baseUrl + "/magazines?state=0,3&flagUserId="+meInfo.id+"&flagType=1&offset=" + (magazinePage*magazineSize) + "&limit=" + magazineSize + "&startDate=" + new Date().toISOString(); 
          
  let _magazineDateSave = document.getElementById('magazine-date-save');
  magazineDate = (_magazineDateSave.options[_magazineDateSave.selectedIndex]).value;    

  let _magazineCategorySave = document.getElementById('magazine-category-save');
  magazineCategory = (_magazineCategorySave.options[_magazineCategorySave.selectedIndex]).value;    

  if(magazineCategory !== null && magazineCategory !== ""){
      url += "&category="+magazineCategory;    
  }
  if(magazineDate !== null && magazineDate !== ""){
      let start = new Date();
      start.setFullYear(magazineDate);
      start.setMonth(0);
      start.setDate(1);
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);

      let end = new Date();
      end.setFullYear(magazineDate);
      end.setMonth(11);
      end.setDate(31);
      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);
      
      url += "&startCreateDate="+start.toISOString();    
      url += "&endCreateDate="+end.toISOString();    
  }

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
        let magazineSave = "";
        let data = response.data.magazines;
        let total = response.data.total;
        let numOfPage = total/magazineSize;
        let pagingPCMagazine = "";
        let pagingMobileMagazine = ""; 
                                    
        for( let i = 0;  i < data.length ; i++){
          let values = data[i];
            magazineSave+=`<div class="article-info-box">
                    <a href="../magazine/feature.html?id=${values.id}" class="article-info-box-btn">
                      <div class="selector-cover checkbox square solo">
                        <label class="label">
                          <input type="checkbox"   id="magazine-save-${values.id}" />
                          <span class="selector-text">
                              <span class="selector"></span>
                          </span>
                        </label>
                      </div>
                      <div class="image-box">
                      ${values.file1?'<img src="'+values.file1+'" alt="썸네일" />':''}
                      </div>
                      <div class="text-box">
                        <div class="subject">${values.title}</div>
                        <div class="text">${values.summary}</div>
                        <div class="info">
                          <div class="writer"><span class="name">${values.nickname}</span> 에디터</div>
                          <div class="date">${dateToStrCharacterLength(strToDate(values?.startDate), '.', 10)}</div>
                        </div>
                      </div>
                    </a>
                  </div>`;    

        }       

       
        if(magazineFlagType ==1 && total >magazineSize){
          pagingPCMagazine =`<button type="button" class="controller prev" ${magazinePage > 0 ? 'onclick="get('+page+','+magazineFlagType+','+(magazinePage-1)+ ')"' : ''}>이전으로</button>`;
          pagingMobileMagazine=` <button type="button" class="btn medium bg-g4 prev-btn" ${magazinePage > 0 ? 'onclick="get('+page+','+magazineFlagType+','+(magazinePage-1)+ ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
          for ( let j = 0; j< numOfPage; j++){
            pagingPCMagazine +=`<button type="button" class="paging ${magazinePage === j?'current':''}"  onclick="get(${page},${magazineFlagType}, `+(j)+ `)">` +  (j+1)  + `</button>`                    
          }             

          pagingPCMagazine +=`<button type="button" class="controller next" ${magazinePage < numOfPage-1 ? 'onclick="get(' + (page) + ',' + magazineFlagType+ ',' + (magazinePage+1) + ')"' : ''}>다음으로</button>`;
          pagingMobileMagazine+=`<button type="button" class="btn medium bg-g4 next-btn"  ${magazinePage < numOfPage-1 ? 'onclick="get(' + (page) + ',' + magazineFlagType+ ',' + (magazinePage+1) + ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;

          document.getElementById('pagingPCMagazineSave').innerHTML  = pagingPCMagazine; 
          document.getElementById('pagingMobileMagazineSave').innerHTML  = pagingMobileMagazine;  
        
        }

        let magazineSaveNoData = '';
        if(total==0){
          magazineSaveNoData = ` <a href="../magazine/magazine.html" class="empty-link-btn">
                        <i class="icon-box icon-plus-square">+</i>
                        <div class="text">
                          관심 있는 글을 저장하고<br />
                            나중에 다시 꺼내 보세요.
                        </div>
                      </a>`;  
          document.getElementById('pagination-box-magazine').style.display = 'none';
        }
     
        document.getElementById('magazine-grid-save').innerHTML  = magazineSave;                         
        document.getElementById('magazineSaveNoData').innerHTML  = magazineSaveNoData;  
      })                    
    }).catch(error => console.log(error));

  /// voice  //////////////////////////////////////////////////////////////////////////
  url = baseUrl + "/voices?state=0,2,3,4,5,6,7,8,9,10,11&userId="+meInfo.id+"&offset=0&limit=12";     
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
     response.json().then((response) => {
      let total = response.data.total;

      url = baseUrl + "/voices?state=0,3&flagUserId="+meInfo.id+"&flagType=0&offset=0&limit=12&startDate=" + new Date().toISOString();     
      fetch(url, headers.json_headers)
      .then((response) => {
      checkError(response.status);
       response.json().then((response) => {
          let totalLike = response.data.total;

          url = baseUrl + "/voices?state=0,3&flagUserId="+meInfo.id+"&flagType=1&offset=0&limit=12&startDate=" + new Date().toISOString();         
          fetch(url, headers.json_headers)
          .then((response) => {
          checkError(response.status);
          response.json().then((response) => {
              let totalSave = response.data.total;             
                              
              document.getElementById('voice-tab1').innerHTML  = ` <a href="#twentyVoiceWriting" class="content-tab-menu-box-btn"  onclick="get(${page},  ${magazineFlagType},  `+(magazinePage)+ `,-1,${voicePage})">
                        <span>내가 쓴 글</span>
                        <span class="number">(${total})</span>
                      </a>`;                          
              document.getElementById('voice-tab2').innerHTML  = `<a href="#twentyVoiceFavorite" class="content-tab-menu-box-btn"  onclick="get(${page},   ${magazineFlagType},  `+(magazinePage)+ `,0,${voicePage})">
                        <span>좋아요 누른 글</span>
                        <span class="number">(${totalLike})</span>
                      </a>`;                          
              document.getElementById('voice-tab3').innerHTML  = `<a href="#twentyVoiceBookmark" class="content-tab-menu-box-btn"  onclick="get(${page},  ${magazineFlagType},  `+(magazinePage)+`,1,${voicePage})">
                        <span>저장한 글</span>
                        <span class="number">(${totalSave})</span>
                      </a>`;            
                      
                      
              if(totalLike > 0) document.getElementById('voice-like-cancel').innerHTML = `<button type="button" class="btn icon-btn small round bg-black fw700" onclick="popupCancel('voice', 0, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage}, ${storyPage}, ${communityFlagType}, ${communityPage}, ${reportPage}, ${qnaPage})"><i class="icon-box icon-like-cancle"></i>좋아요 취소</button>`
              if(totalSave > 0) document.getElementById('voice-save-cancel').innerHTML = `<button type="button" class="btn icon-btn small round bg-black fw700" onclick="popupCancel('voice', 1, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage}, ${storyPage}, ${communityFlagType}, ${communityPage}, ${reportPage}, ${qnaPage})"><i class="icon-box icon-bookmark-cancle"></i>저장 취소</button>`
                
                    })                    
                  }).catch(error => console.log(error));

                })                    
              }).catch(error => console.log(error));

            })                    
          }).catch(error => console.log(error));

  url = baseUrl + "/voices?userId="+meInfo.id+"&offset=" + (voicePage*magazineSize) + "&limit=" + magazineSize; 
  let _voiceDate = document.getElementById('voice-date');
  let voiceDate = (_voiceDate.options[_voiceDate.selectedIndex]).value;    

  let _voiceCategory = document.getElementById('voice-category');
  let voiceCategory = (_voiceCategory.options[_voiceCategory.selectedIndex]).value;    
  $('#voice-date').attr('onchange', `get(${page}, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage})`)
  $('#voice-category').attr('onchange', `get(${page}, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage})`)

  if(voiceCategory){
    url += '&state=' + voiceCategory;
    if(voiceCategory == 3){
      url += '&status=waiting';
    }else if(voiceCategory == '0,3'){
      url += '&status=ongoing';
    }
  }else{
    url += '&state=0,2,3,4,5,6,7,8,9,10,11';
  }

  if(voiceDate !== null && voiceDate !== ""){
      let start = new Date();
      start.setFullYear(voiceDate);
      start.setMonth(0);
      start.setDate(1);
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);
      
      url += "&startDate="+start.toISOString();    
  }

  fetch(url, headers.json_headers)
  .then((response) => {
  checkError(response.status);
  response.json().then((response) => {
      let voice = "";
      let data = response.data.voices;
      let total = response.data.total;
      let numOfPage = total/magazineSize;
      let pagingPCVoice = "";
      let pagingMobileVoice = ""; 
                                  
      for( let i = 0;  i < data.length ; i++){
        let values = data[i];
        if(values.state==6){
          voice+=`<div class="article-info-box">
                        <a href="javascript:  layerPopup.openPopup('acceptAdvicePopup');" class="article-info-box-btn">
                          <div class="state-label black">수정(첨삭)제안</div>
                          <div class="image-box">
                          ${values.file?'<img src="'+values.file+'" alt="썸네일" />':''}
                          </div>
                          <div class="text-box">
                            <div class="subject">${values.title}</div>
                            <div class="text">${values.summary}</div>
                            <div class="date">${dateToStrCharacterLength(strToDate(values?.startDate), '.', 16)}</div>
                          </div>
                        </a>
                      </div>`;    

          document.getElementById('btn').innerHTML = `<button type="button" class="btn btn-close" onclick="layerPopup.closeAllPopup();layerPopup.openPopup('acceptAdvicePopup1')">거절</button>
            <button type="button" class="btn btn-ok popup-close" onclick="acceptAdvice(${values.id}, 7);location.href='../mypage/mypage.html'">수락</button>`
           document.getElementById('btn2').innerHTML = `<button type="button" class="btn btn-ok popup-close"  onclick="acceptAdvice(${values.id}, 8);location.href='../mypage/mypage.html?#twentyVoice';">확인</button>`
        }else if(values.state==9){
          voice+=`<div class="article-info-box">
                        <a href="../mypage/advice.html?id=${values.id}" class="article-info-box-btn">
                          <div class="state-label black">수정(첨삭)중</div>
                          <div class="image-box">
                          ${values.file?'<img src="'+values.file+'" alt="썸네일" />':''}
                          </div>
                          <div class="text-box">
                            <div class="subject">${values.title}</div>
                            <div class="text">${values.summary}</div>
                            <div class="date">${dateToStrCharacterLength(strToDate(values?.startDate), '.', 16)}</div>
                          </div>
                        </a>
                      </div>`;    

          document.getElementById('btn').innerHTML = `<button type="button" class="btn btn-close" onclick="layerPopup.closeAllPopup();layerPopup.openPopup('acceptAdvicePopup1', true)">거절</button>
            <button type="button" class="btn btn-ok popup-close" onclick="acceptAdvice(${values.id}, 7)">수락</button>`
           document.getElementById('btn2').innerHTML = `<button type="button" class="btn btn-ok popup-close"  onclick="acceptAdvice(${values.id}, 5)">확인</button>`
        }else{
              voice+=`<div class="article-info-box">
            <a href="../mypage/detail.html?id=${values.id}" class="article-info-box-btn">
              <div class="state-label${(values.state==0 || values.state==3 || values.state==4 || values.state==7 || values.state==9|| values.state==10|| values.state==11)?' black':''}">${values.state==0?'발행 완료':values.state==2?'작성 완료':(values.state==3 && values.status == 'waiting')?'발행 대기':values.state==3?'발행 완료':values.state==4?'임시 저장':values.state==5?'작성 완료':values.state==7?'수정(첨삭)중':values.state==8?'작성 완료':values.state==9?'수정(첨삭)중':'수정(첨삭)중'}</div>
              <div class="image-box">
              ${values.file?'<img src="'+values.file+'" alt="썸네일" />':''}
              </div>
              <div class="text-box">
                <div class="subject">${values.title}</div>
                <div class="text">${values.summary || ''}</div>
                <div class="date">${dateToStrCharacterLength(strToDate(values?.startDate), '.', 16)}</div>
              </div>
            </a>
          </div>`;    
        }
          
      }       


      if((voiceFlagType ==-1) && (total >magazineSize)){   
        pagingPCVoice =`<button type="button" class="controller prev" ${voicePage > 0 ? 'onclick="get('+page+ ',' + magazineFlagType + ',' + (magazinePage)+ ',' + voiceFlagType + ',' + (voicePage-1) + ')"' : ''}>이전으로</button>`;
        pagingMobileVoice=` <button type="button" class="btn medium bg-g4 prev-btn" ${voicePage > 0 ? 'onclick="get('+page+ ',' + magazineFlagType + ',' + (magazinePage)+ ',' + voiceFlagType + ',' + (voicePage-1) + ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
        for ( let j = 0; j< numOfPage; j++){
          pagingPCVoice +=`<button type="button" class="paging ${voicePage === j?'current':''}"  onclick="get(${page}, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${j})">` +  (j+1)  + `</button>`                    
        }                     

        pagingPCVoice +=`<button type="button" class="controller next" ${voicePage < numOfPage-1 ? 'onclick="get(' + (page) + ',' + magazineFlagType+ ',' + (magazinePage)+ ',' + (voiceFlagType)+ ',' + (voicePage+1) + ')"' : ''}>다음으로</button>`;
        pagingMobileVoice+=`<button type="button" class="btn medium bg-g4 next-btn"  ${voicePage < numOfPage-1 ? 'onclick="get(' +  (page) + ',' + magazineFlagType+ ',' + (magazinePage)+ ',' + (voiceFlagType)+ ',' + (voicePage+1) + ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;
      }

      document.getElementById('pagingPCVoice').innerHTML  = pagingPCVoice; 
      document.getElementById('pagingMobileVoice').innerHTML  = pagingMobileVoice;  

      let voiceNoData = '';
      if(total==0){
        voiceNoData = `<a href="javascript:goRegisterBase('voice')" class="empty-link-btn">
                        <i class="icon-box icon-plus-square">+</i>
                        <div class="text">
                          이달의 주제를 확인하고<br />
                            여러분의 생각을 글로 남겨 보세요.
                        </div>
                      </a>`;  
      }

      document.getElementById('voice-grid').innerHTML  = voice;  
      document.getElementById('voiceNoData').innerHTML  = voiceNoData;  

    })              
  }).catch(error => console.log(error));

  url = baseUrl + "/voices?state=0,3&flagUserId="+meInfo.id+"&flagType=0&offset=" + (voicePage*magazineSize) + "&limit=" + magazineSize; 
     
  let _voiceDateLike = document.getElementById('voice-date-like');
  voiceDate = (_voiceDateLike.options[_voiceDateLike.selectedIndex]).value;    

  if(voiceDate !== null && voiceDate !== ""){
      let start = new Date();
      start.setFullYear(voiceDate);
      start.setMonth(0);
      start.setDate(1);
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);

      url += "&startDate="+start.toISOString();    
  }
  // url=baseUrl +"/magazines?limit=3";
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let voiceLike = "";
      let data = response.data.voices;
      let total = response.data.total;
      let numOfPage = total/magazineSize;
      let pagingPCVoice = "";
      let pagingMobileVoice = ""; 
                                  
      for( let i = 0;  i < data.length ; i++){
        let values = data[i];
          voiceLike+=`<div class="article-info-box">
                        <a href="../mypage/detail.html?id=${values.id}" class="article-info-box-btn">
                          <div class="selector-cover checkbox square solo">
                            <label class="label">
                              <input type="checkbox"  id="voice-like-${values.id}"/>
                              <span class="selector-text">
                                  <span class="selector"></span>
                              </span>
                            </label>
                          </div>
                          <div class="image-box">
                          ${values.file?'<img src="'+values.file+'" alt="썸네일" />':''}
                          </div>
                          <div class="text-box">
                            <div class="subject">${values.title}</div>
                            <div class="text">${values.summary}</div>
                            <div class="info">
                              <div class="writer"><span class="name">${values.nickname}</span> 에디터</div>
                              <div class="date">${dateToStrCharacterLength(strToDate(values?.startDate), '.', 16)}</div>
                            </div>
                          </div>
                        </a>
                      </div>`;    

      }       

    
      if(voiceFlagType ==0 && total >magazineSize){
        pagingPCVoice =`<button type="button" class="controller prev" ${voicePage > 0 ? 'onclick="get('+page+ ',' + magazineFlagType + ',' + (magazinePage)+ ',' + voiceFlagType + ',' + (voicePage-1) + ')"' : ''}>이전으로</button>`;
        pagingMobileVoice=` <button type="button" class="btn medium bg-g4 prev-btn" ${voicePage > 0 ? 'onclick="get('+page+ ',' + magazineFlagType + ',' + (magazinePage)+ ',' + voiceFlagType + ',' + (voicePage-1) + ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
        for ( let j = 0; j< numOfPage; j++){
          pagingPCVoice +=`<button type="button" class="paging ${voicePage === j?'current':''}"  onclick="get(${page}, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType} ,`+(j)+ `)">` +  (j+1)  + `</button>`                    
        }             

        pagingPCVoice +=`<button type="button" class="controller next" ${voicePage < numOfPage-1 ? 'onclick="get(' + (page) + ',' + magazineFlagType+ ',' + (magazinePage)+ ',' + (voiceFlagType)+ ',' + (voicePage+1) + ')"' : ''}>다음으로</button>`;
        pagingMobileVoice+=`<button type="button" class="btn medium bg-g4 next-btn"  ${voicePage < numOfPage-1 ? 'onclick="get(' +  (page) + ',' + magazineFlagType+ ',' + (magazinePage)+ ',' + (voiceFlagType)+ ',' + (voicePage+1) + ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;
      
        document.getElementById('pagingPCVoiceLike').innerHTML  = pagingPCVoice; 
        document.getElementById('pagingMobileVoiceLike').innerHTML  = pagingMobileVoice;  

      }

      let voiceLikeNoData = '';
      if(total==0){
        voiceLikeNoData = `<a href="../voice/voice.html" class="empty-link-btn">
                        <i class="icon-box icon-plus-square">+</i>
                        <div class="text">
                          재미있게 읽은 글에<br />
                            ‘좋아요’를 눌러 주세요.
                        </div>
                      </a>`;  
      }
  
      document.getElementById('voice-grid-like').innerHTML  = voiceLike;                         
      document.getElementById('voiceLikeNoData').innerHTML  = voiceLikeNoData;  
    })                    
  }).catch(error => console.log(error));

  url = baseUrl + "/voices?state=0,3&flagUserId="+meInfo.id+"&flagType=1&offset=" + (voicePage*magazineSize) + "&limit=" + magazineSize; 
          
  let _voiceDateSave = document.getElementById('voice-date-save');
  voiceDate = (_voiceDateSave.options[_voiceDateSave.selectedIndex]).value;    

  if(voiceDate !== null && voiceDate !== ""){
      let start = new Date();
      start.setFullYear(voiceDate);
      start.setMonth(0);
      start.setDate(1);
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);
      
      url += "&startDate="+start.toISOString();          
  }
  // url=baseUrl +"/magazines?limit=3";
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
        let voiceSave = "";
        let data = response.data.voices;
        let total = response.data.total;
        let numOfPage = total/magazineSize;
        let pagingPCVoice = "";
        let pagingMobileVoice = ""; 
                                    
        for( let i = 0;  i < data.length ; i++){
          let values = data[i];
            voiceSave+=`<div class="article-info-box">
                          <a href="../mypage/detail.html?id=${values.id}" class="article-info-box-btn">
                            <div class="selector-cover checkbox square solo">
                              <label class="label">
                                <input type="checkbox"  id="voice-save-${values.id}" />
                                <span class="selector-text">
                                    <span class="selector"></span>
                                </span>
                              </label>
                            </div>
                            <div class="image-box">
                            ${values.file?'<img src="'+values.file+'" alt="썸네일" />':''}
                            </div>
                            <div class="text-box">
                              <div class="subject">${values.title}</div>
                              <div class="text">${values.summary}</div>
                              <div class="info">
                                <div class="writer"><span class="name">${values.nickname}</span> 에디터</div>
                                <div class="date">${dateToStrCharacterLength(strToDate(values?.startDate), '.', 16)}</div>
                              </div>
                            </div>
                          </a>
                        </div>`;    

        }       

      
        if(voiceFlagType ==1 && total >magazineSize){
          pagingPCVoice=`<button type="button" class="controller prev"  ${voicePage > 0 ? 'onclick="get('+page+ ',' + magazineFlagType + ',' + (magazinePage)+ ',' + voiceFlagType + ',' + (voicePage-1) + ')"' : ''}>이전으로</button>`;
          pagingMobileVoice=` <button type="button" class="btn medium bg-g4 prev-btn"  ${voicePage > 0 ? 'onclick="get('+page+ ',' + magazineFlagType + ',' + (magazinePage)+ ',' + voiceFlagType + ',' + (voicePage-1) + ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
          for ( let j = 0; j< numOfPage; j++){
            pagingPCVoice +=`<button type="button" class="paging ${voicePage === j?'current':''}"  onclick="get(${page}, ${magazineFlagType}, ${magazinePage},${voiceFlagType},`+(j)+ `)">` +  (j+1)  + `</button>`                    
          }             

          pagingPCVoice +=`<button type="button" class="controller next" ${voicePage < numOfPage-1 ? 'onclick="get(' + (page) + ',' + magazineFlagType+ ',' + (magazinePage)+ ',' + (voiceFlagType)+ ',' + (voicePage+1) + ')"' : ''}>다음으로</button>`;
          pagingMobileVoice+=`<button type="button" class="btn medium bg-g4 next-btn"  ${voicePage < numOfPage-1 ? 'onclick="get(' +  (page) + ',' + magazineFlagType+ ',' + (magazinePage)+ ',' + (voiceFlagType)+ ',' + (voicePage+1) + ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;
               
          document.getElementById('pagingPCVoiceSave').innerHTML  = pagingPCVoice; 
          document.getElementById('pagingMobileVoiceSave').innerHTML  = pagingMobileVoice;  
        }

        let voiceSaveNoData = '';
        if(total==0){
          voiceSaveNoData = ` <a href="../voice/voice.html" class="empty-link-btn">
                        <i class="icon-box icon-plus-square">+</i>
                        <div class="text">
                          관심 있는 글을 저장하고<br />
                            나중에 다시 꺼내 보세요.
                        </div>
                      </a>`;  
        }
    
        document.getElementById('voice-grid-save').innerHTML  = voiceSave;                         
        document.getElementById('voiceSaveNoData').innerHTML  = voiceSaveNoData;  
      })                    
    }).catch(error => console.log(error));

  /// story  //////////////////////////////////////////////////////////////////////////


  // 대학생이 만든 매거진
  url = baseUrl + "/mains?state=0,3&category=2&startDate=" + new Date().toISOString();    
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let data = response.data.mains;         

      let mainStoryId = data[0]?.story?.id;

      let storySize = 10;
      url = baseUrl + "/stories?state=0,2&userId="+meInfo.id+"&offset=" + (storyPage*storySize) + "&limit=" + storySize;
              
      let _storyDate = document.getElementById('story-date');
      let storyDate = (_storyDate.options[_storyDate.selectedIndex]).value;    

      if(storyDate !== null && storyDate !== ""){
          let start = new Date();
          start.setFullYear(storyDate);
          start.setMonth(0);
          start.setDate(1);
          start.setHours(0);
          start.setMinutes(0);
          start.setSeconds(0);

          let end = new Date();
          end.setFullYear(storyDate);
          end.setMonth(11);
          end.setDate(31);
          end.setHours(23);
          end.setMinutes(59);
          end.setSeconds(59);
          
          url += "&startCreateDate="+start.toISOString();    
          url += "&endCreateDate="+end.toISOString();    
      }
      // url=baseUrl +"/magazines?limit=3";
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((response) => {
            let story = "";
            let data = response.data.stories;
            let total = response.data.total;
            let numOfPage = total/storySize;
            let pagingPCStory = "";
            let pagingMobileStory = ""; 
                                        
            for( let i = 0;  i < data.length ; i++){
              let values = data[i];
                story+=`<div class="webzine-info-box">
                            <a href="../mypage/webzine-detail.html?id=${values.id}" class="webzine-info-box-link"></a>
                            <div class="image-box">
                            ${values.workFile?'<img src="'+values.workFile+'" alt="썸네일" />':values.file?'<img src="'+values.file+'" alt="썸네일" />':values.cover?'<img src="'+values.cover+'" alt="썸네일" />':''}
                            </div>
                            <div class="info-content">
                            ${mainStoryId == values.id ? '<div class="label-text">메인 웹진</div>' : ''}
                              <div class="text-box">
                                <div class="subject">${values.title}</div>
                                <div class="text">${values.summary}</div>
                                <div class="date">${dateToStrCharacterLength(strToDate(values.createDate), '.', 16)}</div>
                              </div>                          
                            ${mainStoryId != values.id ? '<div class="btn-box"><a href="../mypage/webzine-register.html?id=' + values.id + '" class="btn icon-btn small round bg-wh"><i class="icon-box icon-edit-dark"></i>수정하기</a><button type="button" class="btn icon-btn small round bg-wh" onclick="postStoryDeleteConfirm('+ values.id +')"><i class="icon-box icon-trash"></i>삭제하기</button></div>' : ''}
                      </div>
                      </div>  `;    
            }       
          
            if( total >storySize){
              pagingPCStory =`<button type="button" class="controller prev" ${storyPage > 0 ? 'onclick="get('+page+','+ magazineFlagType+','+ magazinePage+','+ voiceFlagType+','+ voicePage+','+ (storyPage-1) + ')"' : ''}>이전으로</button>`;
              pagingMobileStory=` <button type="button" class="btn medium bg-g4 prev-btn" ${storyPage > 0 ? 'onclick="get('+page+','+ magazineFlagType+','+ magazinePage+','+ voiceFlagType+','+ voicePage+','+ (storyPage-1) + ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
              for ( let j = 0; j< numOfPage; j++){
                pagingPCStory +=`<button type="button" class="paging ${storyPage === j?'current':''}"  onclick="get(${page}, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType} ,${voicePage} ,`+(j)+ `)">` +  (j+1)  + `</button>`                    
              }             

              pagingPCStory +=`<button type="button" class="controller next" ${storyPage < numOfPage-1 ? 'onclick="get(' + (page) + ',' + magazineFlagType+ ',' + (magazinePage)+ ',' + (voiceFlagType)+ ',' + (voicePage)+ ',' + (storyPage+1) + ')"' : ''}>다음으로</button>`;
              pagingMobileStory+=`<button type="button" class="btn medium bg-g4 next-btn"  ${storyPage < numOfPage-1 ? 'onclick="get(' +  (page) + ',' + magazineFlagType+ ',' + (magazinePage)+ ',' + (voiceFlagType)+ ',' + (voicePage)+ ',' + (storyPage+1) + ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;
            
              document.getElementById('pagingPCStory').innerHTML  = pagingPCStory; 
              document.getElementById('pagingMobileStory').innerHTML  = pagingMobileStory;  
            
            }

            let nodata = '';
            if(total==0){
              nodata = `<a href="../mypage/webzine-register.html" class="empty-link-btn">
                            <i class="icon-box icon-plus-square">+</i>
                            <div class="text">직접 작성한 글로<br />나만의 매거진을 만들어 보세요.</div>
                          </a>`;  
              document.getElementById('pagination-box-story').style.display = 'none';
            }
        
            document.getElementById('story-grid').innerHTML  = story;                         
            document.getElementById('storyNoData').innerHTML  = nodata;  
          })                    
        }).catch(error => console.log(error));
      })                    
    }).catch(error => console.log(error));

  /// community //////////////////////////////////////////////////////////////////////////
  let communitySize = 20;
  url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&userId="+meInfo.id;
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
        let total = response.data.total;

        url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&flagUserId="+meInfo.id+"&flagType=0";     
        fetch(url, headers.json_headers)
        .then((response) => {
        checkError(response.status);
      response.json().then((response) => {
            let totalLike = response.data.total;

            url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&flagUserId="+meInfo.id+"&flagType=1";     
            fetch(url, headers.json_headers)
            .then((response) => {
            checkError(response.status);
      response.json().then((response) => {
            
              let totalSave = response.data.total;
                                    
              document.getElementById('community-tab1').innerHTML  = `<a href="#communityWriting" class="content-tab-menu-box-btn" onclick="get(${page},  ${magazineFlagType},`+(magazinePage)+ `, ${voiceFlagType}, ${voicePage}, ${storyPage}, -1, 0)">
                      <span>내가 쓴 글</span>
                      <span class="number">(${total})</span>
                    </a>`;                          
              document.getElementById('community-tab2').innerHTML  =  `<a href="#communityFavorite" class="content-tab-menu-box-btn"  onclick="get(${page},  ${magazineFlagType},`+(magazinePage)+ `, ${voiceFlagType}, ${voicePage}, ${storyPage}, 0, 0)">
                      <span>좋아요 누른 글</span>
                      <span class="number">(${totalLike})</span>
                    </a>`;                          
              document.getElementById('community-tab3').innerHTML  = `<a href="#communityBookmark" class="content-tab-menu-box-btn"  onclick="get(${page},  ${magazineFlagType},`+(magazinePage)+ `, ${voiceFlagType}, ${voicePage}, ${storyPage}, 1, 0)">
                      <span>저장한 글</span>
                      <span class="number">(${totalSave})</span>
                    </a>`;            
                    
              if(totalLike > 0) $('#community-like-cancel-button').attr('onclick', "layerPopup.openPopup('infoAlertPopup');");
              if(totalSave > 0) $('#community-save-cancel-button').attr('onclick', "layerPopup.openPopup('infoAlertPopup1');");
            })     
          
            document.getElementById('infoAlertPopup-btn').innerHTML = `<button type="button" class="btn btn-close popup-close">취소</button><button type="button" class="btn btn-ok popup-close" onclick="cancelCommunityLike( ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage},${storyPage},  ${communityFlagType}, ${communityPage}, ${reportPage},  ${qnaPage})">완료</button>`
            document.getElementById('infoPopup-btn').innerHTML = ` <button type="button" class="btn btn-ok popup-close" onclick="layerPopup.closeAllPopup()">확인</button>`
            document.getElementById('infoAlertPopup-btn1').innerHTML = `<button type="button" class="btn btn-close popup-close">취소</button><button type="button" class="btn btn-ok popup-close" onclick="cancelCommunitySave( ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage},${storyPage},  ${communityFlagType}, ${communityPage}, ${reportPage},  ${qnaPage})">완료</button>`
  
                }).catch(error => console.log(error));

              })                    
            }).catch(error => console.log(error));
          })                    
        }).catch(error => console.log(error));

  url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&userId="+meInfo.id+"&offset=" + (communityPage*communitySize) + "&limit=" + communitySize + "&type=0"; 

  let _communityDate = document.getElementById('community-date');
  let communityDate = (_communityDate.options[_communityDate.selectedIndex]).value;    

  let _communityCategory = document.getElementById('community-category');
  let communityCategory = (_communityCategory.options[_communityCategory.selectedIndex]).value;    

  $('#community-date').attr('onchange', `get(${page}, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage}, ${storyPage}, ${communityFlagType}, 0)`)
  $('#community-category').attr('onchange', `get(${page}, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage}, ${storyPage}, ${communityFlagType}, 0)`)

  if(communityCategory !== null && communityCategory !== ""){
      url += "&category="+communityCategory;    
  }

  if(communityDate !== null && communityDate !== ""){
      let start = new Date();
      start.setFullYear(communityDate);
      start.setMonth(0);
      start.setDate(1);
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);

      let end = new Date();
      end.setFullYear(communityDate);
      end.setMonth(11);
      end.setDate(31);
      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);
      
      url += "&startCreateDate="+start.toISOString();    
      url += "&endCreateDate="+end.toISOString();    
  }

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
        let community = "";
        let communityMobile = "";
        let dataRanking = response.data.communities;
        let totalRanking = response.data.total;
        let numOfPage = totalRanking/communitySize;
        let pagingPCCommunity = "";
        let pagingMobileCommunity = ""; 

        url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&userId="+meInfo.id+"&offset=" + (communityPage*communitySize) + "&limit=" + communitySize + "&type=1"; 
      
         _communityDate = document.getElementById('community-date');
         communityDate = (_communityDate.options[_communityDate.selectedIndex]).value;    
      
         _communityCategory = document.getElementById('community-category');
         communityCategory = (_communityCategory.options[_communityCategory.selectedIndex]).value; 

        if(communityCategory !== null && communityCategory !== ""){
            url += "&category="+communityCategory;    
        }
        if(communityDate !== null && communityDate !== ""){
            let start = new Date();
            start.setFullYear(communityDate);
            start.setMonth(0);
            start.setDate(1);
            start.setHours(0);
            start.setMinutes(0);
            start.setSeconds(0);
      
            let end = new Date();
            end.setFullYear(communityDate);
            end.setMonth(11);
            end.setDate(31);
            end.setHours(23);
            end.setMinutes(59);
            end.setSeconds(59);
            
            url += "&startCreateDate="+start.toISOString();    
            url += "&endCreateDate="+end.toISOString();    
        }
      
        fetch(url, headers.json_headers)
        .then((response) => {
        checkError(response.status);
        response.json().then((response) => {
            let community = "";
            let communityMobile = "";
            let data = response.data.communities;
            let total = response.data.total;
            let numOfPage = total/communitySize;
            let pagingPCCommunity = "";
            let pagingMobileCommunity = ""; 

            if(totalRanking + total > 0){
              community += `<div class="txt-hidden">커뮤니티 내가 쓴 글</div>
                          <div class="data-table-box-standard">
                            <div class="number">번호</div>
                            <div class="category">카테고리</div>
                            <div class="topic">제목</div>
                            <div class="like">좋아요</div>
                            <div class="read">읽음</div>
                            <div class="date">게시일</div>
                          </div>
                          <ul class="data-table-box-list">`
            }

            for( let i = 0;  i < dataRanking.length ; i++){
              let values = dataRanking[i];
          
            community+=`<li class="data-table-box-item">
                              <a href="../mypage/community-detail.html?id=${values.id}" class="data-table-box-link">
                                <div class="number">${values.id}</div>
                                <div class="category">${values.category==2?'일상':values.category==0?'연애':values.category==1?'진로':'우리 학교'}</div>
                                <div class="topic image">
                                  <div class="text">
                                    [공지] ${values.title}<span class="info">${values.file1 != null ? '<i class="icon-box icon-photo">이미지</i>' : ''} (${numberWithCommas(values.commentCount)})<span> 
                                  </div>
                                </div>
                                <div class="like">${numberWithCommas(values.likeCount)}</div>
                                <div class="read">${numberWithCommas(values.showCount)}</div>
                                <div class="date">${dateToStrCharacterLength(strToDate(values?.createDate), '.', 16)}</div>
                              </a>
                            </li>`;
            communityMobile+= `<li class="data-table-box-item">
                              <a href="../mypage/community-detail.html?id=${values.id}" class="data-table-box-link notice">
                                <div class="category-box">
                                  <span class="label">카테고리</span>
                                  <span class="text">${values.category==2?'일상':values.category==0?'연애':values.category==1?'진로':'우리 학교'}</span>
                                </div>
                                <div class="title-box image">
                                  <div class="title">[공지] ${values.title}</div>
                                  <span class="info">${values.file1 != null ? '<i class="icon-box icon-photo">이미지</i>':''} (${numberWithCommas(values.commentCount)})</span>
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
                                    <span class="number">${dateToStrCharacterLength(strToDate(values?.createDate), '.', 16)}</span>
                                  </div>
                                </div>
                              </a>
                            </li>`;
        }       
                              
        for( let i = 0;  i < data.length ; i++){
          let values = data[i];
          
            community+=`<li class="data-table-box-item">
                              <a href="../mypage/community-detail.html?id=${values.id}" class="data-table-box-link">
                                <div class="number">${values.id}</div>
                                <div class="category">${values.category==2?'일상':values.category==0?'연애':values.category==1?'진로':'우리 학교'}</div>
                                <div class="topic image">
                                  <div class="text">
                                    ${values.title}<span class="info">${values.file1 != null ? '<i class="icon-box icon-photo">이미지</i>' : ''} (${numberWithCommas(values.commentCount)})<span> 
                                  </div>
                                </div>
                                <div class="like">${numberWithCommas(values.likeCount)}</div>
                                <div class="read">${numberWithCommas(values.showCount)}</div>
                                <div class="date">${dateToStrCharacterLength(strToDate(values?.createDate), '.', 16)}</div>
                              </a>
                            </li>`;
            communityMobile+= `<li class="data-table-box-item">
                              <a href="../mypage/community-detail.html?id=${values.id}" class="data-table-box-link">
                                <div class="category-box">
                                  <span class="label">카테고리</span>
                                  <span class="text">${values.category==2?'일상':values.category==0?'연애':values.category==1?'진로':'우리 학교'}</span>
                                </div>
                                <div class="title-box image">
                                  <div class="title">${values.title}</div>
                                  <span class="info">${values.file1 != null ? '<i class="icon-box icon-photo">이미지</i>':''} (${numberWithCommas(values.commentCount)})</span>
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
                                    <span class="number">${dateToStrCharacterLength(strToDate(values?.createDate), '.', 16)}</span>
                                  </div>
                                </div>
                              </a>
                            </li>`;
        }       

        if(communityFlagType ==-1 && (totalRanking + total) >communitySize){
          pagingPCCommunity =`<button type="button" class="controller prev" ${communityPage > 0 ? 'onclick="get('+page+','+ magazineFlagType+','+ magazinePage+','+ voiceFlagType+','+ voicePage+','+ (storyPage-1) + ',' + communityFlagType + ',' + (communityPage-1) + ')"' : ''}>이전으로</button>`;
          pagingMobileCommunity=` <button type="button" class="btn medium bg-g4 prev-btn" ${communityPage > 0 ? 'onclick="get('+page+','+ magazineFlagType+','+ magazinePage+','+ voiceFlagType+','+ voicePage+','+ (storyPage-1) + ',' + communityFlagType + ',' + (communityPage-1) + ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
          for ( let j = 0; j< numOfPage; j++){
            pagingPCCommunity +=`<button type="button" class="paging ${communityPage === j?'current':''}"  onclick="get(${page}, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage}, ${storyPage}, ${communityFlagType}, ${j})">` +  (j+1)  + `</button>`                    
          }             

          pagingPCCommunity +=`<button type="button" class="controller next" ${communityPage < numOfPage-1 ? 'onclick="get(' + (page) + ',' + magazineFlagType+ ',' + (magazinePage)+ ',' + (voiceFlagType)+ ',' + (voicePage)+ ',' + (storyPage)+ ',' + (communityFlagType)+ ',' + (communityPage+1) + ')"' : ''}>다음으로</button>`;
          pagingMobileCommunity+=`<button type="button" class="btn medium bg-g4 next-btn"  ${communityPage < numOfPage-1 ? 'onclick="get(' +  (page) + ',' + magazineFlagType+ ',' + (magazinePage)+ ',' + (voiceFlagType)+ ',' + (voicePage)+ ',' + (storyPage)+ ',' + (communityFlagType)+ ',' + (communityPage+1) + ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;
        
          document.getElementById('pagingPCCommunity').innerHTML  = pagingPCCommunity; 
          document.getElementById('pagingMobileCommunity').innerHTML  = pagingMobileCommunity;  
        
        }

        let communityNoData = '';      
        if(totalRanking + total==0){
          communityNoData = `<a href="../community/register.html" class="empty-link-btn">
                          <i class="icon-box icon-plus-square">+</i>
                          <div class="text">
                            이용자들과 나누고 싶은 이야기를<br />
                              자유롭게 써주세요.
                          </div>
                        </a>`;  
          document.getElementById('communityExists').style.display = 'none';
        }else{
          community+='</ul>';
          document.getElementById('communityExists').style.display = 'block';
        }
        

        document.getElementById('community-grid').innerHTML  = community;  
        document.getElementById('community-grid-mobile').innerHTML  = communityMobile;  
        document.getElementById('communityNoData').innerHTML  = communityNoData;  

      })                    
    }).catch(error => console.log(error));

  })                    
}).catch(error => console.log(error));
  url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&flagUserId="+meInfo.id+"&flagType=0&offset=" + (communityPage*communitySize) + "&limit=" + communitySize + "&type=0"; 
  
  let _communityDateLike = document.getElementById('community-date-like');
  communityDate = (_communityDateLike.options[_communityDateLike.selectedIndex]).value;    

  let _communityCategoryLike = document.getElementById('community-category-like');
  communityCategory = (_communityCategoryLike.options[_communityCategoryLike.selectedIndex]).value;    

  $('#community-date-like').attr('onchange', `get(${page}, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage}, ${storyPage}, ${communityFlagType}, 0)`)
  $('#community-category-like').attr('onchange', `get(${page}, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage}, ${storyPage}, ${communityFlagType}, 0)`)

  if(communityCategory !== null && communityCategory !== ""){
      url += "&category="+communityCategory;    
  }
  if(communityDate !== null && communityDate !== ""){
      let start = new Date();
      start.setFullYear(communityDate);
      start.setMonth(0);
      start.setDate(1);
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);

      let end = new Date();
      end.setFullYear(communityDate);
      end.setMonth(11);
      end.setDate(31);
      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);
      
      url += "&startCreateDate="+start.toISOString();    
      url += "&endCreateDate="+end.toISOString();    
  }

  // url=baseUrl +"/magazines?limit=3";
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
        let communityLike = "";
        let dataRanking = response.data.communities;
        let totalRanking = response.data.total;
        let numOfPage = totalRanking/communitySize;
        let pagingPCCommunity = "";
        let pagingMobileCommunity = "";
        
    url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&flagUserId="+meInfo.id+"&flagType=0&offset=" + (communityPage*communitySize) + "&limit=" + communitySize + "&type=1"
  
    _communityDateLike = document.getElementById('community-date-like');
    communityDate = (_communityDateLike.options[_communityDateLike.selectedIndex]).value;    
  
    _communityCategoryLike = document.getElementById('community-category-like');
    communityCategory = (_communityCategoryLike.options[_communityCategoryLike.selectedIndex]).value; 

    if(communityCategory !== null && communityCategory !== ""){
        url += "&category="+communityCategory;    
    }
    if(communityDate !== null && communityDate !== ""){
        let start = new Date();
        start.setFullYear(communityDate);
        start.setMonth(0);
        start.setDate(1);
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);

        let end = new Date();
        end.setFullYear(communityDate);
        end.setMonth(11);
        end.setDate(31);
        end.setHours(23);
        end.setMinutes(59);
        end.setSeconds(59);
        
        url += "&startCreateDate="+start.toISOString();    
        url += "&endCreateDate="+end.toISOString();    
    }

    // url=baseUrl +"/magazines?limit=3";
    fetch(url, headers.json_headers)
    .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
        let communityLike = "";
        let communityLikeMobile = "";

        let data = response.data.communities;
        let total = response.data.total;
        let numOfPage = total/communitySize;
        let pagingPCCommunity = "";
        let pagingMobileCommunity = "";

        if(totalRanking + total > 0){
          communityLike += `<div class="txt-hidden">커뮤니티 좋아요 누른 글</div>
                          <div class="data-table-box-standard">
                            <div class="data-check-box">
                              <div class="selector-cover checkbox square solo">
                                <label class="label">
                                  <input type="checkbox"   />
                                  <span class="selector-text">
                                      <span class="selector"></span>
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div class="category">카테고리</div>
                            <div class="topic">제목</div>
                            <div class="like">좋아요</div>
                            <div class="read">읽음</div>
                            <div class="date">게시일</div>
                          </div>
                          <ul class="data-table-box-list" >
                        `
        }
        
        for( let i = 0;  i < dataRanking.length ; i++){
          let values = dataRanking[i];
          communityLike+=`<li class="data-table-box-item">
                              <a href="javascript:void(0);" class="data-table-box-link">
                                <div class="data-check-box">
                                  <div class="selector-cover checkbox square solo">
                                    <label class="label">
                                      <input type="checkbox"  id="community-like-${values.id}" />
                                      <span class="selector-text">
                                          <span class="selector"></span>
                                      </span>
                                    </label>
                                  </div>
                                </div>
                                <div class="category">${values.category==2?'일상':values.category==0?'연애':values.category==1?'진로':'우리 학교'}</div>
                                <div class="topic image">
                                  <div class="text">
                                    [공지] ${values.title}<span class="info">${values.file1 != null ?'<i class="icon-box icon-photo">이미지</i>':''} (${numberWithCommas(values.commentCount)})</span>
                                  </div>
                                </div>
                                <div class="like">${numberWithCommas(values.likeCount)}</div>
                                <div class="read">${numberWithCommas(values.showCount)}</div>
                                <div class="date">${dateToStrCharacterLength(strToDate(values?.createDate), '.', 16)}</div>
                              </a>
                            </li>`;   

          communityLikeMobile+=`<li class="data-table-box-item">
                              <a href="javascript:void(0);" class="data-table-box-link notice">
                                <div class="category-box">
                                  <span class="label">카테고리</span>
                                  <span class="text">${values.category==2?'일상':values.category==0?'연애':values.category==1?'진로':'우리 학교'}</span>
                                </div>
                                <div class="title-box image">
                                  <div class="title">[공지] ${values.title}</div>
                                  <span class="info">${values.file1 != null ?'<i class="icon-box icon-photo">이미지</i>':''} (${numberWithCommas(values.commentCount)})</span>
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
                                    <span class="number">${dateToStrCharacterLength(strToDate(values?.createDate), '.', 16)}</span>
                                  </div>
                                </div>
                                <div class="data-check-box">
                                  <div class="selector-cover checkbox square solo">
                                    <label class="label">
                                      <input type="checkbox"  id="community-like2-${values.id}" />
                                      <span class="selector-text">
                                          <span class="selector"></span>
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </a>
                            </li>`;   
        }

                                    
        for( let i = 0;  i < data.length ; i++){
          let values = data[i];
            communityLike+=`<li class="data-table-box-item">
            <a href="javascript:void(0);" class="data-table-box-link">
              <div class="data-check-box">
                <div class="selector-cover checkbox square solo">
                  <label class="label">
                    <input type="checkbox"  id="community-like-${values.id}" />
                    <span class="selector-text">
                        <span class="selector"></span>
                    </span>
                  </label>
                </div>
              </div>
              <div class="category">${values.category==2?'일상':values.category==0?'연애':values.category==1?'진로':'우리 학교'}</div>
              <div class="topic image">
                <div class="text">
                  ${values.title}<span class="info">${values.file1 != null ?'<i class="icon-box icon-photo">이미지</i>':''} (${numberWithCommas(values.commentCount)})</span>
                </div>
              </div>
              <div class="like">${values.likeCount}</div>
              <div class="read">${values.showCount}</div>
              <div class="date">${dateToStrCharacterLength(strToDate(values?.createDate), '.', 16)}</div>
            </a>
          </li>`;   

          communityLikeMobile+=`<li class="data-table-box-item">
            <a href="javascript:void(0);" class="data-table-box-link">
              <div class="category-box">
                <span class="label">카테고리</span>
                <span class="text">${values.category==2?'일상':values.category==0?'연애':values.category==1?'진로':'우리 학교'}</span>
              </div>
              <div class="title-box image">
                <div class="title">${values.title}</div>
                <span class="info">${values.file1 != null ?'<i class="icon-box icon-photo">이미지</i>':''} (${numberWithCommas(values.commentCount)})</span>
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
                  <span class="number">${dateToStrCharacterLength(strToDate(values?.createDate), '.', 16)}</span>
                </div>
              </div>
              <div class="data-check-box">
                <div class="selector-cover checkbox square solo">
                  <label class="label">
                    <input type="checkbox"  id="community-like2-${values.id}"/>
                    <span class="selector-text">
                        <span class="selector"></span>
                    </span>
                  </label>
                </div>
              </div>
            </a>
          </li>`;   

        }       
    
        if(communityFlagType ==-1 && total >communitySize){
          pagingPCCommunity =`<button type="button" class="controller prev" ${communityPage > 0 ? 'onclick="get('+page+','+ magazineFlagType+','+ magazinePage+','+ voiceFlagType+','+ voicePage+','+ (storyPage-1) + ',' + communityFlagType + ',' + (communityPage-1) + ')"' : ''}>이전으로</button>`;
          pagingMobileCommunity=` <button type="button" class="btn medium bg-g4 prev-btn" ${communityPage > 0 ? 'onclick="get('+page+','+ magazineFlagType+','+ magazinePage+','+ voiceFlagType+','+ voicePage+','+ (storyPage-1) + ',' + communityFlagType + ',' + (communityPage-1) + ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
          for ( let j = 0; j< numOfPage; j++){
            pagingPCCommunity +=`<button type="button" class="paging ${communityPage === j?'current':''}"  onclick="get(${page}, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage}, ${storyPage}, ${communityFlagType}, ${j})">` +  (j+1)  + `</button>`                    
          }             

          pagingPCCommunity +=`<button type="button" class="controller next" ${communityPage < numOfPage-1 ? 'onclick="get(' + (page) + ',' + magazineFlagType+ ',' + (magazinePage)+ ',' + (voiceFlagType)+ ',' + (voicePage)+ ',' + (storyPage)+ ',' + (communityFlagType)+ ',' + (communityPage+1) + ')"' : ''}>다음으로</button>`;
          pagingMobileCommunity+=`<button type="button" class="btn medium bg-g4 next-btn"  ${communityPage < numOfPage-1 ? 'onclick="get(' +  (page) + ',' + magazineFlagType+ ',' + (magazinePage)+ ',' + (voiceFlagType)+ ',' + (voicePage)+ ',' + (storyPage)+ ',' + (communityFlagType)+ ',' + (communityPage+1) + ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;
                
          document.getElementById('pagingPCCommunity').innerHTML  = pagingPCCommunity; 
          document.getElementById('pagingMobileCommunity').innerHTML  = pagingMobileCommunity;  
        
        }

        let communityLikeNoData = '';
        if(totalRanking + total==0){
          communityLikeNoData = `<a href="../community/list-all.html" class="empty-link-btn">
                          <i class="icon-box icon-plus-square">+</i>
                          <div class="text">
                            재미있게 읽은 글에<br />
                              ‘좋아요’를 눌러 주세요.
                          </div>
                        </a>`;  
          document.getElementById('communityLikeExists').style.display = 'none';
        }else{
          communityLike+='</ul>';
          document.getElementById('communityLikeExists').style.display = 'block';
        
        }
    
        document.getElementById('community-grid-like').innerHTML  = communityLike;  
        document.getElementById('community-grid-like-mobile').innerHTML  = communityLikeMobile;                         
        document.getElementById('communityLikeNoData').innerHTML  = communityLikeNoData;  
      })                    
    }).catch(error => console.log(error));
  })                    
}).catch(error => console.log(error));

  url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&flagUserId="+meInfo.id+"&flagType=1&offset=" + (communityPage*communitySize) + "&limit=" + communitySize + "&type=0"; 
    
  let _communityDateSave = document.getElementById('community-date-save');
  communityDate = (_communityDateSave.options[_communityDateSave.selectedIndex]).value;    

  let _communityCategorySave = document.getElementById('community-category-save');
  communityCategory = (_communityCategorySave.options[_communityCategorySave.selectedIndex]).value;    

  $('#community-date-save').attr('onchange', `get(${page}, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage}, ${storyPage}, ${communityFlagType}, 0)`)
  $('#community-category-save').attr('onchange', `get(${page}, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage}, ${storyPage}, ${communityFlagType}, 0)`)


  if(communityCategory !== null && communityCategory !== ""){
      url += "&category="+communityCategory;    
  }
  if(communityDate !== null && communityDate !== ""){
      let start = new Date();
      start.setFullYear(communityDate);
      start.setMonth(0);
      start.setDate(1);
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);

      let end = new Date();
      end.setFullYear(communityDate);
      end.setMonth(11);
      end.setDate(31);
      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);
      
      url += "&startCreateDate="+start.toISOString();    
      url += "&endCreateDate="+end.toISOString();    
  }

  // url=baseUrl +"/magazines?limit=3";
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
        let communityLike = "";
        let dataRanking = response.data.communities;
        let totalRanking = response.data.total;
        let numOfPage = totalRanking/communitySize;
        let pagingPCCommunity = "";
        let pagingMobileCommunity = "";

    
    _communityDateSave = document.getElementById('community-date-save');
    communityDate = (_communityDateSave.options[_communityDateSave.selectedIndex]).value;    
  
    _communityCategorySave = document.getElementById('community-category-save');
    communityCategory = (_communityCategorySave.options[_communityCategorySave.selectedIndex]).value;    
        
    url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&flagUserId="+meInfo.id+"&flagType=1&offset=" + (communityPage*communitySize) + "&limit=" + communitySize + "&type=1"; 
    if(communityCategory !== null && communityCategory !== ""){
        url += "&category="+communityCategory;    
    }
    if(communityDate !== null && communityDate !== ""){
        let start = new Date();
        start.setFullYear(communityDate);
        start.setMonth(0);
        start.setDate(1);
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);

        let end = new Date();
        end.setFullYear(communityDate);
        end.setMonth(11);
        end.setDate(31);
        end.setHours(23);
        end.setMinutes(59);
        end.setSeconds(59);
        
        url += "&startCreateDate="+start.toISOString();    
        url += "&endCreateDate="+end.toISOString();    
    }

    // url=baseUrl +"/magazines?limit=3";
    fetch(url, headers.json_headers)
    .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
        let communitySave = "";
        let communitySaveMobile = "";

        let data = response.data.communities;
        let total = response.data.total;
        let numOfPage = total/communitySize;
        let pagingPCCommunity = "";
        let pagingMobileCommunity = "";

        if(totalRanking + total > 0){
          communitySave += `<div class="txt-hidden">커뮤니티 저장한 글</div>
                            <div class="data-table-box-standard">
                              <div class="data-check-box">
                                <div class="selector-cover checkbox square solo">
                                  <label class="label">
                                    <input type="checkbox"   />
                                    <span class="selector-text">
                                        <span class="selector"></span>
                                    </span>
                                  </label>
                                </div>
                              </div>
                              <div class="category">카테고리</div>
                              <div class="topic">제목</div>
                              <div class="like">좋아요</div>
                              <div class="read">읽음</div>
                              <div class="date">게시일</div>
                            </div>
                            <ul class="data-table-box-list" >                          
                          `
        }
        
        for(let i=0; i < dataRanking.length ; i++){
          let values = dataRanking[i];
          communitySave+=`<li class="data-table-box-item">
                              <a href="javascript:void(0);" class="data-table-box-link">
                                <div class="data-check-box">
                                  <div class="selector-cover checkbox square solo">
                                    <label class="label">
                                      <input type="checkbox"  id="community-save-${values.id}" />
                                      <span class="selector-text">
                                          <span class="selector"></span>
                                      </span>
                                    </label>
                                  </div>
                                </div>
                                <div class="category">${values.category==2?'일상':values.category==0?'연애':values.category==1?'진로':'우리 학교'}</div>
                                <div class="topic image">
                                  <div class="text">
                                    [공지] ${values.title}<span class="info">${values.file1 != null ? '<i class="icon-box icon-photo">이미지</i>':''} (${numberWithCommas(values.commentCount)})</span>
                                  </div>
                                </div>
                                <div class="like">${numberWithCommas(values.likeCount)}</div>
                                <div class="read">${numberWithCommas(values.showCount)}</div>
                                <div class="date">${dateToStrCharacterLength(strToDate(values?.createDate), '.', 16)}</div>
                              </a>
                            </li>`;   

          communitySaveMobile+=`<li class="data-table-box-item">
                              <a href="javascript:void(0);" class="data-table-box-link notice">
                                <div class="category-box">
                                  <span class="label">카테고리</span>
                                  <span class="text">${values.category==2?'일상':values.category==0?'연애':values.category==1?'진로':'우리 학교'}</span>
                                </div>
                                <div class="title-box image">
                                  <div class="title">[공지] ${values.title}</div>
                                  <span class="info">${values.file1 != null ?'<i class="icon-box icon-photo">이미지</i>':''} (${numberWithCommas(values.commentCount)})</span>
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
                                    <span class="number">${dateToStrCharacterLength(strToDate(values?.createDate), '.', 16)}</span>
                                  </div>
                                </div>
                                <div class="data-check-box">
                                  <div class="selector-cover checkbox square solo">
                                    <label class="label">
                                      <input type="checkbox"   id="community-save2-${values.id}" />
                                      <span class="selector-text">
                                          <span class="selector"></span>
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </a>
                            </li>`;   
        }

        for( let i = 0;  i < data.length ; i++){
          let values = data[i];
            communitySave+=`<li class="data-table-box-item">
            <a href="javascript:void(0);" class="data-table-box-link">
              <div class="data-check-box">
                <div class="selector-cover checkbox square solo">
                  <label class="label">
                    <input type="checkbox"   id="community-save-${values.id}"  />
                    <span class="selector-text">
                        <span class="selector"></span>
                    </span>
                  </label>
                </div>
              </div>
              <div class="category">${values.category==2?'일상':values.category==0?'연애':values.category==1?'진로':'우리 학교'}</div>
              <div class="topic image">
                <div class="text">
                  ${values.title}<span class="info">${values.file1 != null ?'<i class="icon-box icon-photo">이미지</i>':''} (${numberWithCommas(values.commentCount)})</span>
                </div>
              </div>
              <div class="like">${numberWithCommas(values.likeCount)}</div>
              <div class="read">${numberWithCommas(values.showCount)}</div>
              <div class="date">${dateToStrCharacterLength(strToDate(values?.createDate), '.', 16)}</div>
            </a>
          </li>`;   

          communitySaveMobile+=`<li class="data-table-box-item">
            <a href="javascript:void(0);" class="data-table-box-link">
              <div class="category-box">
                <span class="label">카테고리</span>
                <span class="text">${values.category==2?'일상':values.category==0?'연애':values.category==1?'진로':'우리 학교'}</span>
              </div>
              <div class="title-box image">
                <div class="title">${values.title}</div>
                <span class="info">${values.file1 != null ?'<i class="icon-box icon-photo">이미지</i>':''} (${numberWithCommas(values.commentCount)})</span>
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
                  <span class="number">${dateToStrCharacterLength(strToDate(values?.createDate), '.', 16)}</span>
                </div>
              </div>
              <div class="data-check-box">
                <div class="selector-cover checkbox square solo">
                  <label class="label">
                    <input type="checkbox"   id="community-save2-${values.id}"  />
                    <span class="selector-text">
                        <span class="selector"></span>
                    </span>
                  </label>
                </div>
              </div>
            </a>
          </li>`;   

        }       
    
        if(communityFlagType ==-1 && total >communitySize){
          pagingPCCommunity =`<button type="button" class="controller prev" ${communityPage > 0 ? 'onclick="get('+page+','+ magazineFlagType+','+ magazinePage+','+ voiceFlagType+','+ voicePage+','+ (storyPage-1) + ',' + communityFlagType + ',' + (communityPage-1) + ')"' : ''}>이전으로</button>`;
          pagingMobileCommunity=` <button type="button" class="btn medium bg-g4 prev-btn" ${communityPage > 0 ? 'onclick="get('+page+','+ magazineFlagType+','+ magazinePage+','+ voiceFlagType+','+ voicePage+','+ (storyPage-1) + ',' + communityFlagType + ',' + (communityPage-1) + ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
          for ( let j = 0; j< numOfPage; j++){
            pagingPCCommunity +=`<button type="button" class="paging ${communityPage === j?'current':''}"  onclick="get(${page}, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType}, ${voicePage}, ${storyPage}, ${communityFlagType}, ${j})">` +  (j+1)  + `</button>`                    
          }             

          pagingPCCommunity +=`<button type="button" class="controller next" ${communityPage < numOfPage-1 ? 'onclick="get(' + (page) + ',' + magazineFlagType+ ',' + (magazinePage)+ ',' + (voiceFlagType)+ ',' + (voicePage)+ ',' + (storyPage)+ ',' + (communityFlagType)+ ',' + (communityPage+1) + ')"' : ''}>다음으로</button>`;
          pagingMobileCommunity+=`<button type="button" class="btn medium bg-g4 next-btn"  ${communityPage < numOfPage-1 ? 'onclick="get(' +  (page) + ',' + magazineFlagType+ ',' + (magazinePage)+ ',' + (voiceFlagType)+ ',' + (voicePage)+ ',' + (storyPage)+ ',' + (communityFlagType)+ ',' + (communityPage+1) + ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;
                
          document.getElementById('pagingPCCommunity').innerHTML  = pagingPCCommunity; 
          document.getElementById('pagingMobileCommunity').innerHTML  = pagingMobileCommunity;  
        
        }

        let communitySaveNoData = '';
        if(totalRanking + total==0){
          communitySaveNoData = `<a href="../community/list-all.html" class="empty-link-btn">
                            <i class="icon-box icon-plus-square">+</i>
                            <div class="text">
                              관심 있는 글을 저장하고<br />
                                나중에 다시 꺼내 보세요.
                            </div>
                          </a>`;  
        document.getElementById('communitySaveExists').style.display = 'none';
        }else{
          document.getElementById('communitySaveExists').style.display = 'block';
          communitySave+='</ul>';
        }

        document.getElementById('community-grid-save').innerHTML  = communitySave;  
        document.getElementById('community-grid-save-mobile').innerHTML  = communitySaveMobile;                         
        document.getElementById('communitySaveNoData').innerHTML  = communitySaveNoData;  
      })                    
    }).catch(error => console.log(error));

  })                    
}).catch(error => console.log(error));

  /// 캘린더  //////////////////////////////////////////////////////////////////////////
  let now = new Date();
  let startTime = new Date();
  let endTime = new Date();

  startTime.setDate(1);
  startTime.setHours(0);
  startTime.setMinutes(0);
  startTime.setSeconds(0);
  endTime.setHours(23);
  endTime.setMinutes(59);
  endTime.setSeconds(59);

  if(date === null){
    endTime.setDate(getDaysInMonth(now.getFullYear(), now.getMonth()-1));        
  }else{
    startTime.setFullYear(date.getFullYear());
    startTime.setMonth(date.getMonth());

    endTime.setFullYear(date.getFullYear());
    endTime.setMonth(date.getMonth());
    endTime.setDate(getDaysInMonth(date.getFullYear(), date.getMonth()));
  }

  url = baseUrl + "/schedules?state=0,3,4,5&userId="+meInfo.id+"&startTime=" + startTime.toISOString()+ "&endTime=" + endTime.toISOString(); 

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {       
      let data = response.data.schedules;
      let total = response.data.total;
      let commentData = [];
      let htmlDaily = '';
      let htmlPaging = ''; 
    

      for(let i=0; i<data.length; i++){
        url = baseUrl + "/schedule-comments?state=0&scheduleId="+data[i].id;    
        fetch(url, headers.json_headers)
        .then((response) => {
          checkError(response.status);
            response.json().then((response) => { 
              
              response.data.comments.map((i)=>commentData.push(i));            

              if(i == (data.length - 1)){
                for(let h=1; h<=31 ; h++){                    
                  let header = 1;              
                  let isExists = 0;          

                  for(let i=0; i<data.length; i++){
                    let headerComment = 1;
                    let isExistsComment = 0;   
                      
                    if(h == Number(data[i].startTime.toString().substring(8,10))){            
                      
                      isExists = 1
                      if(header == 1){
                        let date = new Date();
                        date.setMonth(data[i].startTime.toString().substring(5,7)-1);
                        date.setDate(data[i].startTime.toString().substring(8,10));                      

                        htmlDaily += `<div class="daily-content-box ${data[i].category==0?'univ':data[i].category==1?'twenty':'account'}">                    
                                  <div class="daily-content-box-date">${(date.getMonth()+1).toString().padStart(2, '0') +  '.' + date.getDate().toString().padStart(2, '0') + '(' + (date.getDay()==0?'일':date.getDay()==1?'월':date.getDay()==2?'화':date.getDay()==3?'수':date.getDay()==4?'목':date.getDay()==5?'금':'토')})</div>`;

                        header = 0;
                      }

                      htmlDaily += `<div class="content-box">
                                      <div class="label-text">${data[i].state == 0 ? '캘린더 등록 완료' :data[i].state == 3 ? '캘린더 등록 완료' :data[i].state == 4? '캘린더 등록 신청 중':'캘린더 미게시'}</div>                             
                                       ${data[i].file?'<div class="thumbnail-image"><img src="'+data[i].file+'" alt="썸네일 이미지" /></div>':''}
                                      <div class="title">
                                        ${data[i].title}
                                      </div>
                                      <div class="date-box"><i class="icon">🗓️</i> ${dateToStrCharacterLength(strToDate(data[i].startTime), '.', 16)} ~ ${dateToStrCharacterLength(strToDate(data[i].endTime), '.', 16)}</div>
                                      <div class="text-box">${data[i].content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />")}</div>
                                      <div class="comment-content-box accordion-container accordion-list" data-speed="200">
                                        <div class="comment-content-box-header accordion-header"><i class="icon-box icon-arrow-round">화살표</i><span class="underline">${data[i].commentCount > 0 ? data[i].commentCount + '명의 댓글이 있습니다.' : '여러분의 생각은 어때요?'}</span></div>
                                          <div class="comment-content-box-body accordion-body">`;
                                      
                      for(let j=0;j<commentData.length;j++){
                        if(commentData[j].scheduleId == data[i].id){
                          isExistsComment = 1;
                          if(headerComment == 1){
                            htmlDaily+=` <div class="comment-list-box">`
                            headerComment = 0;
                          }

                          htmlDaily+=`        <div class="comment-list-box-item ${meInfo?.id == data[i]?.userId ? 'comment-list-box-item-user':''}">
                                                  <!-- 프로필 이미지가 있을경우 img 추가 없다면 이름 첫 글자 -->
                                                <div class="profile-image">${commentData[j].nickname.substring(0,1)}</div>
                                                <div class="comment-box">
                                                  <div class="info-box">
                                                    <div class="name">${commentData[j].nickname}</div>
                                                    <div class="date">${dateToStr(strToDate(commentData[j].lastDate.substring(0,16)))}</div>
                                                    <div class="like-box">
                                                      <!-- active-btn 클래스 추가 상태에서 like-btn 클릭 시 효과 적용 -->
                                                      <button type="button" class="active-btn like-btn ${commentData[j].isLiked ===1 ? 'check':''}" onclick="${commentData[j].isLiked==1? 'postFlagCancelSchedule('+data[i].id+',' + commentData[j].id+')' : 'postFlagSchedule('+data[i].id+',' + commentData[j].id+')'}">
                                                        <i class="icon-box icon-like">좋아요</i>
                                                      </button>
                                                      <span class="number">${numberWithCommas(commentData[j].likeCount)}</span>
                                                    </div>
                                                  </div>
                                                  <div class="comment">${commentData[j].content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />")}</div>
                                                </div>
                                              </div>
                                              `
                        }

                        if(commentData.length-1 == j && isExistsComment == 1){
                          htmlDaily += `</div>`;                            
                        }
                      }
                                              
                      htmlDaily += `        <div class="comment-input-box comment-input-box-active">
                                              <div class="textarea-box">
                                                <textarea  id="comment-input-${(data[i].id)}" class="form-textarea full sm" placeholder="댓글을 입력해 주세요."></textarea>
                                                <label for="" class="info-text">다른 사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현이나 다른 사람의 권리를 침해하는 내용은 강제 삭제될 수 있습니다.</label>
                                              </div>
                                              <button type="button" class="btn" onclick="postCommentSchedule(${(data[i].id)})">댓글 쓰기</button>
                                            </div>
                                          </div>
                                        </div> 
                                        ${data[i].state !== 0 ? `<div class="edit-btn-box"><a href="../mypage/schedule.html?=` + (data[i].id) + `" class="btn icon-btn small round bg-wh"><i class="icon-box icon-edit-dark"></i>수정</a><button type="button" class="btn icon-btn small round bg-wh"  onclick="popupScheduleDelete(${data[i].id})"><i class="icon-box icon-trash"></i>삭제</button></div>`:``}
                                        <!-- //edit-btn-box -->
                                      </div>`;

                    }            
                  }
          
                  if(isExists == 1){
                    htmlDaily += ` </div>
                              </div>`;
                  }
                }             
                
                document.getElementById('htmlDaily').innerHTML  = htmlDaily + htmlPaging;              
              }            
            })                    
          }).catch(error => console.log(error));
      
      } 
        
      if(total == 0){ 
        document.getElementById('htmlDaily').innerHTML  = `<div class="empty-info-text-box">
                        <a href="../schedule/register.html" class="empty-link-btn">
                          <i class="icon-box icon-plus-square">+</i>
                          <div class="text">공유하고 싶은 일정을 등록해 주세요.</div>
                        </a>
                      </div>`;         
        } 
      })                    
    }).catch(error => console.log(error));

  /// report  //////////////////////////////////////////////////////////////////////////
  let reportSize = 12;
  url = baseUrl + "/reports?state=0,2,3&userId="+meInfo.id+"&offset=" + (reportPage*reportSize) + "&limit=" + reportSize;
          
  let _reportDate = document.getElementById('report-date');
  let reportDate = (_reportDate.options[_reportDate.selectedIndex]).value;    

  if(reportDate !== null && reportDate !== ""){
      let start = new Date();
      start.setFullYear(reportDate);
      start.setMonth(0);
      start.setDate(1);
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);

      let end = new Date();
      end.setFullYear(reportDate);
      end.setMonth(11);
      end.setDate(31);
      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);
      
      url += "&startCreateDate="+start.toISOString();    
      url += "&endCreateDate="+end.toISOString();    
  }

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
        let report = "";
        let data = response.data.reports;
        let total = response.data.total;
        let numOfPage = total/reportSize;
        let pagingPCReport = "";
        let pagingMobileReport = ""; 
                                    
        for( let i = 0;  i < data.length ; i++){
          let values = data[i];
          report+=` <div class="article-content-box-report-item">
                        <a href="../mypage/report.html?id=${values.id}" class="article-content-box-report-link">
                          ${values.state===0 ? '<div class="label-text">기사 발행</div>':''}
                          <div class="title">${values.title}</div>
                          <div class="date">${dateToStrCharacterLength(strToDate(values?.lastDate), '.', 16)}</div>
                        </a>
                      </div>`;    
        }       
      
        if( total > reportSize){
          pagingPCReport =`<button type="button" class="controller prev"  ${reportPage > 0 ? 'onclick="get(' + page + ',' +magazineFlagType+ ',' +magazinePage+ ',' +voiceFlagType+ ',' +voicePage+ ',' +storyPage+ ',' +communityFlagType+ ',' +communityPage+ ',' +(reportPage-1) + ')"' : ''}>이전으로</button>`;
          pagingMobileReport=` <button type="button" class="btn medium bg-g4 prev-btn" ${reportPage > 0 ? 'onclick="get(' + page + ',' +magazineFlagType+ ',' +magazinePage+ ',' +voiceFlagType+ ',' +voicePage+ ',' +storyPage+ ',' +communityFlagType+ ',' +communityPage+ ',' +(reportPage-1) + ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
          for ( let j = 0; j< numOfPage; j++){
            pagingPCReport +=`<button type="button" class="paging ${reportPage === j?'current':''}"  onclick="get(${page}, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType} ,${voicePage}, ${storyPage},  ${communityFlagType}, ${communityPage}, `+(j)+ `)">` +  (j+1)  + `</button>`                    
          }             

          pagingPCReport +=`<button type="button" class="controller next" ${reportPage < numOfPage-1 ? 'onclick="get(' + (page) + ',' + magazineFlagType+ ',' + (magazinePage)+ ',' + (voiceFlagType)+ ',' + (voicePage)+ ',' + (storyPage)+ ',' + (communityFlagType)+ ',' + (communityPage)+ ',' + (reportPage+1)  + ')"' : ''}>다음으로</button>`;
          pagingMobileReport+=`<button type="button" class="btn medium bg-g4 next-btn"  ${reportPage < numOfPage-1 ? 'onclick="get(' +  (page) + ',' + magazineFlagType+ ',' + (magazinePage)+ ',' + (voiceFlagType)+ ',' + (voicePage)+ ',' + (storyPage)+ ',' + (communityFlagType)+ ',' + (communityPage)+ ',' + (reportPage+1)  + ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;

          document.getElementById('pagingPCReport').innerHTML  = pagingPCReport; 
          document.getElementById('pagingMobileReport').innerHTML  = pagingMobileReport;  
        
        }

        let nodata = '';
        if(total==0){
          nodata = `<a href="../report/report.html" class="empty-link-btn">
                          <i class="icon-box icon-plus-square">+</i>
                          <div class="text">
                            대학내일에 소개하고 싶은 소식을 알려주시면<br />
                              사례금을 드려요!
                          </div>
                        </a>`;  
          document.getElementById('pagination-box-report').style.display = 'none';
        }

        document.getElementById('report-grid').innerHTML  = report;                         
        document.getElementById('reportNoData').innerHTML  = nodata;  
      })                    
    }).catch(error => console.log(error));


  //// qna  //////////////////////////////////////////////////////////////////////////
  url = baseUrl + "/qnas?state=0,2&userId="+meInfo.id+"&offset=" + (qnaPage*reportSize) + "&limit=" + reportSize;
          
  let _qnaDate = document.getElementById('qna-date');
  let qnaDate = (_qnaDate.options[_qnaDate.selectedIndex]).value;    

  if(qnaDate !== null && qnaDate !== ""){
      let start = new Date();
      start.setFullYear(qnaDate);
      start.setMonth(0);
      start.setDate(1);
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);

      let end = new Date();
      end.setFullYear(qnaDate);
      end.setMonth(11);
      end.setDate(31);
      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);
      
      url += "&startCreateDate="+start.toISOString();    
      url += "&endCreateDate="+end.toISOString();    
  }

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
        let qna = "";
        let data = response.data.qnas;
        let total = response.data.total;
        let numOfPage = total/reportSize;
        let pagingPCQna = "";
        let pagingMobileQna = ""; 
                                    
        for( let i = 0;  i < data.length ; i++){
          let values = data[i];
          qna+=` <div class="article-content-box-report-item">
                          <a href="../mypage/qna.html?id=${values.id}" class="article-content-box-report-link">
                          ${values.state== 2 ? '<div class="label-text">답변 완료</div>':''}
                            <div class="title"> ${values.title}</div>
                            <div class="date">${dateToStrCharacterLength(strToDate(values?.lastDate), '.', 16)}</div>
                          </a>
                        </div>`;    
        }       
      
        if( total > reportSize){
          pagingPCQna =`<button type="button" class="controller prev" ${qnaPage > 0 ? 'onclick="get(' + page + ',' + magazineFlagType+ ',' + magazinePage+ ',' + voiceFlagType+ ',' + voicePage+ ',' + storyPage+ ',' + communityFlagType+ ',' + communityPage+ ',' + reportPage+ ',' + (qnaPage-1) + ')"' : ''}>이전으로</button>`;
          pagingMobileQna=` <button type="button" class="btn medium bg-g4 prev-btn" ${qnaPage > 0 ? 'onclick="get(' + page + ',' + magazineFlagType+ ',' + magazinePage+ ',' + voiceFlagType+ ',' + voicePage+ ',' + storyPage+ ',' + communityFlagType+ ',' + communityPage+ ',' + reportPage+ ',' + (qnaPage-1) + ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
          for ( let j = 0; j< numOfPage; j++){
            pagingPCQna +=`<button type="button" class="paging ${qnaPage === j?'current':''}"  onclick="get(${page}, ${magazineFlagType}, ${magazinePage}, ${voiceFlagType} ,${voicePage}, ${storyPage},  ${communityFlagType}, ${communityPage},${reportPage},   `+(j)+ `)">` +  (j+1)  + `</button>`                    
          }             
        
          pagingPCQna +=`<button type="button" class="controller next" ${qnaPage < numOfPage-1 ? 'onclick="get(' + (page) + ',' + magazineFlagType+ ',' + (magazinePage)+ ',' + (voiceFlagType)+ ',' + (voicePage)+ ',' + (storyPage)+ ',' + (communityFlagType)+ ',' + (communityPage)+ ',' + (reportPage)+ ',' + (qnaPage+1)  + ')"' : ''}>다음으로</button>`;
          pagingMobileQna+=`<button type="button" class="btn medium bg-g4 next-btn"  ${qnaPage < numOfPage-1 ? 'onclick="get(' +  (page) + ',' + magazineFlagType+ ',' + (magazinePage)+ ',' + (voiceFlagType)+ ',' + (voicePage)+ ',' + (storyPage)+ ',' + (communityFlagType)+ ',' + (communityPage)+ ',' + (reportPage)+ ',' + (qnaPage+1)  + ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;
         
          document.getElementById('pagingPCQna').innerHTML  = pagingPCQna; 
          document.getElementById('pagingMobileQna').innerHTML  = pagingMobileQna;  
        }

        let nodata = '';
        if(total==0){
          nodata = `<a href="../notice/register.html" class="empty-link-btn">
                          <i class="icon-box icon-plus-square">+</i>
                          <div class="text">
                            대학내일에 궁금한 내용은<br />
                              언제든지 문의해 주세요.
                          </div>
                        </a>`;  
          document.getElementById('pagination-box-qna').style.display = 'none';
        }

        document.getElementById('qna-grid').innerHTML  = qna;                         
        document.getElementById('qnaNoData').innerHTML  = nodata;  
      })                    
    }).catch(error => console.log(error));
    
  // banner  //////////////////////////////////////////////////////////////////////////
  url = baseUrl + "/banners?category=1&state=0,3&offset=0&limit=999&startDate=" + new Date().toISOString()+ "&endDate=" + new Date().toISOString();   
  fetch(url, headers.json_headers)
  .then((response) => {
      checkError(response.status);
      response.json().then((response) => {
        let html= "";
        
        let data = response.data.banners;

        if(data.length > 0){
          let index =  Math.floor(Math.random() * ((data.length)));

          html=`<a href="${data[index].href}" target="_blank" class="banner-link" onclick="get(${page})"></a>
            <div class="banner">
            ${data[index].file1?'<img src="'+data[index].file1+'" class="pc-show" alt="광고 배너" />':''}
            ${data[index].file2?'<img src="'+data[index].file2+'" class="mobile-show" alt="광고 배너" />':''}
            </div>`;          
        }    

        document.getElementById('banners').innerHTML  = html;                    
      })                    
    }).catch(error => console.log(error));
}

function getVoice(page=1){     
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
  
  let url = baseUrl + "/voices?id=" + id; 

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {      

      let data = response.data.voices; 
      let asideHtml ="";     
      let html ="";     

      asideHtml += `<div class="profile-box">
                <div class="image">
                  ${data[0].profilePath != null ? '<img src="'+data[0].profilePath+'" alt="프로필 이미지" />' : ''}
                </div>
                <div class="info">
                  <div class="nickname"><span class="name">${data[0].nickname}</span> 에디터</div>
                  <div class="address">${data[0].email}</div>
                </div>
              </div>
              <div class="info-box">
                <div class="flow">
                  <span>20’s voice</span>
                </div>
                <div class="keyword">
                  <span class="label">키워드</span>
                  <span class="text">${data[0]?.subject?.words || ''}</span>
                </div>
                <div class="subject">
                  <span class="label">주제</span>
                  <span class="text">${data[0]?.subject?.wordsInfo || ''}</span>
                </div>
                <div class="date">
                  <span class="label">작성일</span>
                  <span class="text">${dateToStrCharacterLength(strToDate(data[0]?.lastDate), '.', 16)}</span>
                </div>
                <div class="views">
                  <span class="label">조회수</span>
                  <span class="text">${numberWithCommas(data[0].showCount)}</span>
                </div>
                <div class="likes">
                  <span class="label">좋아요</span>
                  <span class="text">${numberWithCommas(data[0].likeCount)}</span>
                </div>
              </div>`;

      html += ` <div class="article-detail-info-box">
      <div class="article-label-info-box">
        <div class="flow">
          <span>20’s voice</span>
        </div>
        <div class="article-label-box-item">
          ${data[0].state==0?'<div class="state-box"><i class="icon-box icon-document"></i>발행 완료</div>'
            :data[0].state==2?'<div class="state-box"><i class="icon-box icon-circle-check"></i>작성 완료</div>'
            :(data[0].state==3 && data[0].status == 'waiting') ?'<div class="state-box"><i class="icon-box icon-document"></i>발행 대기</div>'
            :(data[0].state==3) ?'<div class="state-box"><i class="icon-box icon-document"></i>발행 완료</div>'
            :data[0].state==4?'<div class="state-box"><i class="icon-box icon-save"></i>임시 저장</div>'
            :data[0].state==5?'<div class="state-box"><i class="icon-box icon-circle-check"></i>작성 완료</div>'
            :data[0].state==6?'<div class="state-box"><i class="icon-box icon-circle-check"></i>수정(첨삭)중</div>'
            :data[0].state==7?'<div class="state-box"><i class="icon-box icon-circle-check"></i>수정(첨삭)중</div>'
            :data[0].state==8?'<div class="state-box"><i class="icon-box icon-circle-check"></i>작성 완료</div>'
            :'<div class="state-box"><i class="icon-box icon-twinkle"></i>수정(첨삭)중</div>'}
        </div>
      </div>
      <div class="article-report-title">${data[0].title}</div>
      <div class="article-report-summary">${data[0]?.summary  || ''}</div>
      <div class="profile-box">
        <div class="image">
          <!-- 프로필 사진 등록시 image-thumb 추가  -->
          ${data[0].profilePath != null ? '<img src="'+data[0].profilePath+'" alt="프로필 이미지" />' : ''}
        </div>
        <div class="info">
          <div class="nickname"><span class="name">${data[0].nickname}</span> 에디터</div>
          <div class="address">${data[0].email}</div>
        </div>
      </div>
      <div class="info-box info-box-full">
        <div class="keyword">
          <span class="label">키워드</span>
          <span class="text">${data[0]?.subject?.words || ''}/span>
        </div>
        <div class="subject">
          <span class="label">주제</span>
          <span class="text">${data[0]?.subject?.wordsInfo || ''}</span>
        </div>
      </div>
      <div class="info-box">
        <div class="date">
          <span class="label">작성일</span>
          <span class="text">${dateToStrCharacterLength(strToDate(data[0]?.lastDate), '.', 16)}</span>
        </div>
        <div class="views">
          <span class="label">조회수</span>
          <span class="text">${numberWithCommas(data[0].showCount)}</span>
        </div>
        <div class="likes">
          <span class="label">좋아요</span>
          <span class="text">${numberWithCommas(data[0].likeCount)}</span>
        </div>
      </div>
    </div>
    <!-- //article-detail-info-box -->
    <div class="article-report-content editor-content-box">
      <!-- 링크 포함 텍스트 -->
      <div>
      ${data[0]?.content?.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />")  || ''}
      </div>
      <!-- //링크 포함 텍스트 -->
    </div>
    <!-- //article-report-content -->
   `;

    for(let i=0;i<data[0]?.tags?.split(',').length;i++){
      if(i==0){
      html+=' <div class="tag-box">'
      }
      if(data[0]?.tags.split(',')[i].trim() === '애드벌토리얼'){
        html+=`<span class="fc-red">#${data[0]?.tags.split(',')[i].trim()}</span>`;
      }else{
        html+=`<span>#${data[0]?.tags.split(',')[i].trim()}</span>`;
      }    
      if(i==data[0]?.tags?.split(',').length -1){
        html+=' </div>'
      }           
    }   
    
    html+=`
    <div class="banner-content-box">
      <div class="banner-box">`;
       
      
      // 배너
      url = baseUrl + "/banners?category=1&state=0,3&offset=0&limit=999&startDate=" + new Date().toISOString()+ "&endDate=" + new Date().toISOString();   
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
    response.json().then((response) => {
   
          let data = response.data.banners;

          if(data.length > 0){
            let index =  Math.floor(Math.random() * ((data.length)));

            html+=`<a href="${data[index].href}" target="_blank" class="banner-link" onclick="getVoice()"></a>
              <div class="banner">
              ${data[index].file1?'<img src="'+data[index].file1+'" class="pc-show" alt="광고 배너" />':''}
              ${data[index].file2?'<img src="'+data[index].file2+'" class="mobile-show" alt="광고 배너" />':''}
              </div>
            </div>
          </div>`;          
          }         
          document.getElementById('asideHtml').innerHTML  = asideHtml;
          document.getElementById('html').innerHTML  = html;
        })                    
      }).catch(error => console.log(error));

    let halfBox = "";
    if(data[0].state == 4){
        halfBox +=`<button type="button" class="btn bg-wh delete-btn" onclick="layerPopup.openPopup('popup');">삭제</button> <a href="../mypage/update.html?id=${id}" class="btn bg-wh edit-btn">수정</a>`
    }else if(data[0].state == 5 || data[0].state == 8){
        halfBox +=`<button type="button" class="btn bg-wh delete-btn" onclick="layerPopup.openPopup('popup0-1');">삭제</button> <a href="../mypage/update.html?id=${id}" class="btn bg-wh edit-btn">수정</a>`
    }else if(data[0].state == 10 || data[0].state == 11){
      halfBox +=`<button type="button" class="btn bg-black write-btn pc-show" disabled>수정(첨삭)요청 중</button>`
    }else if(data[0].state == 3 && data[0].status == 'waiting'){
      halfBox +=`<button type="button" class="btn bg-black write-btn pc-show" disabled>발행 대기 중</button>`
    }

    document.getElementById('halfBox').innerHTML  = halfBox;    
    document.getElementById('btn-popup').innerHTML  = `<button type="button" class="btn btn-close popup-close">취소</button>
    <button type="button" class="btn btn-ok popup-close" onclick="postVoiceDelete(${data[0].id})">확인</button>`
     document.getElementById('btn-popup0-1').innerHTML  = `<button type="button" class="btn btn-close popup-close">취소</button>
    <button type="button" class="btn btn-ok popup-close" onclick="postVoiceDelete(${data[0].id})">확인</button>`
 ;    

 if(data[0]?.state == 0 || (data[0]?.state == 3 || data[0]?.status == 'ongoing')){
 
 let size = 20;
 url = baseUrl + "/voice-comments?state=0&voiceId="+id+"&offset=0&limit=" + (page*size);  

 fetch(url, headers.json_headers)
 .then((response) => {
   checkError(response.status);
   response.json().then((response) => {
     let data = response.data?.comments;     
     let total = response.data.total;             
     let meInfo = JSON.parse(window.localStorage.getItem('me'));
            
    let comments= "";               
    let commentsButton="";   

    for(let i=0;i< page*size && i<total;i++){
      if(meInfo?.id == data[i]?.userId){
        comments+=`<div class="comment-list-box-item comment-list-box-item-user">
            <div class="profile-image">
            ${data[i].nickname.substring(0,1)}`;
      }else{
        comments+=`<div class="comment-list-box-item" >
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
            <div class="date">${data[i]?.startDate?dateToStrCharacterLength(strToDate(data[i]?.startDate), '.', 16):dateToStrCharacterLength(strToDate(data[i]?.lastDate), '.', 16)}</div>
            <div class="like-box">
              <button type="button" class="active-btn like-btn ${data[i].isLiked === 1 ? 'check' : ''}" onclick="postVoiceFlag(${id},${data[i].id},${page})">
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
              <button type="button" class="add-btn" onclick="getVoice(${(page+1)})"><i class="icon-box icon-arrow-black-down">화살표</i><span class="underline">더보기</span></button>
            </div>`
    }  

    commentsButton = ` 
      <div class="textarea-box">
        <textarea  id="comment-input" class="form-textarea full sm" placeholder="댓글을 입력해 주세요."></textarea>
        <label for="" class="info-text">다른 사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현이나 다른 사람의 권리를 침해하는 내용은 강제 삭제될 수 있습니다.</label>
      </div>
      <button type="button" class="btn" onclick="postVoiceComment(${(id)}, ${(page)})">댓글 쓰기</button>
      `;
      
    document.getElementById('commentsTotal').innerHTML  = '댓글 '+total+'개';       
    document.getElementById('comments').innerHTML  = comments;   
    document.getElementById('comments-button').innerHTML  = commentsButton;   
  
  })                    
  }).catch(error => console.log(error));
 }else{
  document.getElementById('commentsArea').style.display= 'none'
 }
     
})                    
}).catch(error => console.log(error));


}

function getVoiceUpdate(){     
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
  
  let url = baseUrl + "/voices?id=" + id; 

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {      

      let data = response.data.voices;     
            
      if(data[0].file) sendFileToDropzone(cropDropzone,data[0].file);
      
      document.getElementById('subject-words').innerHTML = data[0].subject.words;
      document.getElementById('subject-wordsInfo').innerHTML = data[0].subject.wordsInfo;
      document.getElementById('title').value  = data[0].title;    
      document.getElementById('desctext').value  = data[0].summary;    
      editorInstance.html.insert(data[0].content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />"));    
      document.getElementById('tagname').value  = data[0].tags; 
      document.getElementById('check-radio01').checked  = true; 
      
      document.getElementById('toolbar').innerHTML  = `<a href="../mypage/detail.html?id=${id}" class="btn bg-g4 cancel-btn">취소</a>
                  <button type="button" class="btn bg-wh save-btn" onclick="postVoiceTemp(${id}, 4)">임시 저장</button>
                  <button type="button" class="btn bg-black write-btn" onclick="postVoiceSave(${id}, 5)">작성하기</button>`; 
      document.getElementById('writeBtn').innerHTML  = `<a href="../mypage/detail.html?id=${id}" class="btn bg-g4 cancel-btn">취소</a>
                  <div class="half-box">
                    <button type="button" class="btn bg-wh save-btn" onclick="postVoiceTemp(${id}, 4)">임시 저장</button>
                    <button type="button" class="btn bg-black write-btn" onclick="postVoiceSave(${id}, 5)">작성하기</button>
                  </div>`; 
                })                    
              }).catch(error => console.log(error));

  
  /// drop foile //////////////////////////////////////////////////////////////////////////
  const sendFileToDropzone = async (dropzone, url) => {
    if(!url) return;
    const response = await fetch(url);
    const data = await response.blob();
    const ext = url.split(".").pop(); 
    const metadata = {type: `image/${ext}`};
    const filename = url.split("/").pop();
    var file = new File([data], filename, metadata);

    dropzone.emit("addedfile", file, true);   
    dropzone.emit("thumbnail", file, url);
    dropzone.emit("accept", file);
    dropzone.emit("complete", file);
  };
}

function popupScheduleDelete(id) {
  document.getElementById('popup-html').innerHTML = `<button type="button" class="btn btn-ok popup-close" onclick="postScheduleDelete(${id})">확인</button>`;
  layerPopup.openPopup('infoPopup1');
}

function postFlagSchedule(id, commentId) {
  let url = baseUrl + "/schedule-flag/register";    
 
  let params = {
    scheduleId: id,
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
      get();
    }).catch(error => {if(error.message === '401') logout() });
    
    } catch (error) {
      console.error("Error:", error);
    }      
  }

  post(requestPost);
}

function postFlagCancelSchedule(id, commentId) {
  let url = baseUrl + "/schedule-flag";    
 
  let params = {
    scheduleId: id,
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
      get();
    }).catch(error => {if(error.message === '401') logout() });
    
    } catch (error) {
      console.error("Error:", error);
    }      
  }

  post(requestPost);
}

function getVoiceAdvice(){     
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
  
  let url = baseUrl + "/voices?id=" + id; 
  
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {      

      let data = response.data.voices;           
      if(data[0].file) sendFileToDropzone(cropDropzone,data[0].file);   
      document.getElementById('subject-words').innerHTML = data[0].subject.words;
      document.getElementById('subject-wordsInfo').innerHTML = data[0].subject.wordsInfo;
      document.getElementById('title').value  = data[0].title;    
      document.getElementById('desctext').value  = data[0].summary;    
      editorInstance.html.insert(data[0].content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />"));
      document.getElementById('tagname').value  = data[0].tags; 
          
      document.getElementById('toolbar').innerHTML  = `<a href="../schedule/schedule.html" class="btn bg-g4 cancel-btn">취소</a>
      <button type="button" class="btn bg-wh save-btn" onclick="postVoiceTemp(${id}, ${data[0].state})">임시 저장</button><button type="button" class="btn bg-black write-btn" onclick="postVoice(${id}, 10)">수정(첨삭) 요청하기</button>
      <!-- <button type="button" class="btn bg-black write-btn" disabled>수정(첨삭) 요청 중</button> -->
      <!-- <button type="button" class="btn bg-black write-btn" disabled>발행 대기 중</button> -->`; 
      document.getElementById('writeBtn').innerHTML  = `<button type="button" class="btn bg-wh save-btn" onclick="postVoiceTemp(${id},  ${data[0].state})">임시 저장</button><button type="button" class="btn bg-black write-btn" onclick="postVoice(${id}, 10)">수정(첨삭) 요청하기</button>
        <!-- <button type="button" class="btn bg-black write-btn" disabled>수정(첨삭) 요청 중</button> -->
        <!-- <button type="button" class="btn bg-black write-btn" disabled>발행 대기 중</button> -->`; 
      })                    
    }).catch(error => console.log(error));

  /// drop foile //////////////////////////////////////////////////////////////////////////
  const sendFileToDropzone = async (dropzone, url) => {
    if(!url) return;
    const response = await fetch(url);
    const data = await response.blob();
    const ext = url.split(".").pop(); 
    const metadata = {type: `image/${ext}`};
    const filename = url.split("/").pop();
    var file = new File([data], filename, metadata);

    dropzone.emit("addedfile", file, true);   
    dropzone.emit("thumbnail", file, url);
    dropzone.emit("accept", file);
    dropzone.emit("complete", file);
  };

  url= baseUrl + "/voice-advices?voiceId=" + id; 
  
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {      

      let data = response.data.advices;  
      let htmlAdvice = "";         

      for(let i=0;i<data.length;i++){   
        htmlAdvice+=`<div class="editing-comment-box-item">
                  <div class="writer">${data[i].nickname} 에디터</div>
                  <div class="date">${dateToStrCharacterLength(strToDate(data[i]?.lastDate), '.', 16)}</div>
                  <div class="comment-box">
                    <div class="info-text">${data[i].title}</div>
                    <div class="text-box">
                    ${data[i].content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />")}
                    </div>
                  </div>
                </div>`; 
      }

      if(data[0].part.indexOf('2') > -1){        
        document.getElementById('part2').style.display = 'block';        
      }
      if(data[0].part.indexOf('4') > -1){        
        document.getElementById('part4').style.display = 'block';        
      }
      if(data[0].part.indexOf('6') > -1){        
        document.getElementById('part6').style.display = 'block';        
      }

      document.getElementById('htmlAdvice').innerHTML  = htmlAdvice; 
    })                    
  }).catch(error => console.log(error));
}

function getStory(){   
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

  let htmlContent = '';

  url = baseUrl + `/stories?id=${id}`;    
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {                                
      let data = response.data.stories;         
      for(let i=0;i<data.length;i++){
        htmlContent=`<div class="webzine-info-box">
              <div class="image-box">
              ${data[i].file?'<img src="'+data[i].file+'" alt="썸네일" />':''}
              </div>
              <div class="info-content">
                <div class="text-box">
                  <div class="subject">${data[i]?.title}</div>
                  <div class="text">${data[i]?.summary}</div>
                  <div class="date pc-show">${dateToStrCharacterLength(strToDate(data[i]?.createDate), '.', 16)}</div>
                </div>
                <div class="writer-info">
                  <div class="profile-box">
                    <div class="image">
                     ${data[i]?.profilePath != null ? '<img src="'+data[i]?.profilePath+'" alt="프로필 이미지" />' : ''}
                    </div>
                    <div class="info">
                      <div class="nickname">${data[i]?.nickname}</div>
                      <div class="address">${data[i]?.email}</div>
                    </div>
                    <div class="like pc-show">
                      <span class="label">좋아요</span>
                      <span class="number">${numberWithCommas(data[i]?.likeCount)}</span>
                    </div>
                  </div>
                  <!-- mobile -->
                  <div class="info-box mobile-show">
                    <div class="date">
                      <span class="label">작성일</span>
                      <span class="text">${dateToStrCharacterLength(strToDate(data[i]?.createDate), '.', 16)}</span>
                    </div>
                    <div class="likes">
                      <span class="label">좋아요</span>
                      <span class="text">${numberWithCommas(data[i]?.likeCount)}</span>
                    </div>
                  </div>
                  <div class="btn-box">
                   <a href="../mypage/webzine-register.html?id=${id}" class="btn icon-btn small round bg-wh"><i class="icon-box icon-edit-dark"></i>수정하기</a>
                     <button type="button" class="btn icon-btn small round bg-wh" onclick="postStoryDeleteConfirm(${id}, '../mypage/mypage.html')"><i class="icon-box icon-trash"></i>삭제하기</button>
                  
                  </div>
                </div>
              </div>
            </div>`

            let voiceHtml = "";
            // let pagingPc = "";
            // let pagingMobile ="";

            let idString = "";

            if(data[i].voiceId1 !=null){
              idString += data[i].voiceId1;
              if(data[i].voiceId2 !=null){
                idString += ',' + data[i].voiceId2;
                if(data[i].voiceId3 !=null){
                  idString += ',' +data[i].voiceId3;
                  if(data[i].voiceId4 !=null){
                    idString += ',' +data[i].voiceId4;
                    if(data[i].voiceId5 !=null){
                      idString += ',' +data[i].voiceId5;
                      if(data[i].voiceId6 !=null){
                        idString += ',' +data[i].voiceId6;
                        if(data[i].voiceId7 !=null){
                          idString += ',' +data[i].voiceId7;
                          if(data[i].voiceId8 !=null){
                            idString += ',' +data[i].voiceId8;
                            if(data[i].voiceId9 !=null){
                              idString += ',' +data[i].voiceId9;
                              if(data[i].voiceId10 !=null){
                                idString += ',' +data[i].voiceId10;
                              }
                            }                            
                          }                          
                        }                       
                      }                      
                    }                   
                  }                
                }                
              } 

              url = baseUrl + `/voices?id=${idString}`;    
              fetch(url, headers.json_headers)
              .then((response) => {
                checkError(response.status);
                response.json().then((response) => {                                
                  let data = response.data.voices;
                  for( let i = 0;  i<data.length; i++){
                    // console.log('${values.title}'+ JSON.stringify(values))
                    let values = data[i]

                    voiceHtml+=`<div class="article-info-box">
                  <a href="../voice/detail.html?id=${values.id}" class="article-info-box-btn">
                    <div class="image-box">
                    ${values.file?'<img src="'+values.file+'" alt="썸네일" />':''}
                    </div>
                    <div class="text-box">
                      <div class="subject">${values?.title}</div>
                      <div class="text">${values?.summary}</div>
                      <div class="date">${dateToStrCharacterLength(strToDate(values?.createDate), '.', 16)}</div>
                    </div>
                  </a>
                </div>`;                                
                  }                         
                  document.getElementById('voice').innerHTML  = voiceHtml; 
                })                    
              }).catch(error => console.log(error));
            }   
         document.getElementById('story-content').innerHTML  = htmlContent;              
      }   
    })                    
  }).catch(error => console.log(error));
}

function getStoryRegister(page=0, state = 99){
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

  $("#voice-state-button99").attr('onclick', "getStoryRegister("+page+", 99)");
  $("#voice-state-button5").attr('onclick', "getStoryRegister("+page+", 5)");
  $("#voice-state-button0").attr('onclick', "getStoryRegister("+page+", 0)");

  let meInfo = JSON.parse(window.localStorage.getItem("me"));

  if(id?.length > 0){
  let url = baseUrl + "/stories?id="+id;
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
      response.json().then((response) => {
      let data = response.data.stories;                        

      if(data.length > 0){
        let coverFile = data[0]?.cover?.substring(data[0]?.cover?.indexOf('/images/'));
 
        if(data[0].file != null){
          document.getElementById("createThumbnail").checked = true;
          $('.create-thumbnail-box').addClass('show');
          sendFileToDropzone(cropDropzone,data[0].file);

        }else if(coverFile == document.getElementById("cover-image-1").src.substring(document.getElementById("cover-image-1").src.indexOf('/images/'))){
         document.getElementById("radio-thumb-1").checked = true;
        }else if(coverFile == document.getElementById("cover-image-2").src.substring(document.getElementById("cover-image-2").src.indexOf('/images/'))){
          document.getElementById("radio-thumb-2").checked = true;
        }else if(coverFile== document.getElementById("cover-image-3").src.substring(document.getElementById("cover-image-3").src.indexOf('/images/'))){
          document.getElementById("radio-thumb-3").checked = true;
        }else if(coverFile == document.getElementById("cover-image-4").src.substring(document.getElementById("cover-image-4").src.indexOf('/images/'))){
          document.getElementById("radio-thumb-4").checked = true;
        }      
        document.getElementById("title").value = data[0].title;
        document.getElementById("title2").innerHTML = data[0].title;
        document.getElementById("desctext").value = data[0].summary;
        if(data[0].state == 0){
          document.getElementById('check-radio01').checked = true;
          document.getElementById('check-radio02').checked = false;        
        }else{
          document.getElementById('check-radio01').checked = false;
          document.getElementById('check-radio02').checked = true;
        }

        if(voiceIdsSubmit.length == 0){
          voiceIdsSubmit.push(data[0].voiceId1);
          if(data[0].voiceId2 != null) voiceIdsSubmit.push(data[0].voiceId2);
          if(data[0].voiceId3 != null) voiceIdsSubmit.push(data[0].voiceId3);
          if(data[0].voiceId4 != null) voiceIdsSubmit.push(data[0].voiceId4);
          if(data[0].voiceId5 != null) voiceIdsSubmit.push(data[0].voiceId5);
          if(data[0].voiceId6 != null) voiceIdsSubmit.push(data[0].voiceId6);
          if(data[0].voiceId7 != null) voiceIdsSubmit.push(data[0].voiceId7);
          if(data[0].voiceId8 != null) voiceIdsSubmit.push(data[0].voiceId8);
          if(data[0].voiceId9 != null) voiceIdsSubmit.push(data[0].voiceId9);
          if(data[0].voiceId10 != null) voiceIdsSubmit.push(data[0].voiceId10);
        }

        voiceIds = voiceIdsSubmit;
      }      

      let size = 10;
      url = baseUrl + "/voices?offset=" + (page*size) + "&limit=" + size + "&userId="+meInfo.id;
      if(state == 5){
        url += '&state=5'
      }else if(state == 0){
        url += '&state=0,3&startDate=' + new Date().toISOString();
      }else{
        url += '&state=0,3,5&startDate=' + new Date().toISOString();
      }

      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
          response.json().then((response) => {
          let data = response.data.voices; 
          let total = response.data.total;    
          let numOfPage = total/size;
          let popup ="";     
          let pagingPc ="";     
          let pagingMobile ="";     

          for(let i=0;i<data.length;i++){
            popup += `<div class="article-info-box">
                      <div class="selector-cover checkbox square solo line">
                        <label class="label">
                          <input type="checkbox"  id="popup-check-${data[i].id}" ${voiceIds.indexOf(data[i].id) > -1 ? 'checked' : ''} onclick="checkIds(${data[i].id})"/>
                          <span class="selector-text">
                          <span class="selector"></span>
                          </span>
                        </label>
                      </div>
                      <div class="article-info-box-btn">
                        <div class="image-box">
                        ${data[i].file?'<img src="'+data[i].file+'" alt="썸네일" />':''}
                        </div>
                        <div class="text-box">
                          <div class="subject">${data[i].title}</div>
                          <div class="text">${data[i].summary}</div>
                          <div class="date">${data[i].startDate?dateToStrCharacterLength(strToDate(data[i].startDate), '.', 16):dateToStrCharacterLength(strToDate(data[i].lastDate), '.', 16)}</div>
                        </div>
                      </div>
                    </div>`;
          }

          if(total >size){
            pagingPc =`<button type="button" class="controller prev" ${page > 0 ? 'onclick="getStoryRegister('+(page-1)+', '+state + ')"' : ''}>이전으로</button>`;
            pagingMobile=` <button type="button" class="btn medium bg-g4 prev-btn" ${page > 0 ? 'onclick="getStoryRegister('+(page-1)+', '+state + ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
            for ( let j = 0; j< numOfPage; j++){
              pagingPc +=`<button type="button" class="paging ${page === j?'current':''}"  onclick="getStoryRegister(`+j+`, `+state + `)">` +  (j+1)  + `</button>`                            
            }             
            
            pagingPc +=`<button type="button" class="controller next" ${page < numOfPage-1 ? 'onclick="getStoryRegister(' + (page+1) +', '+state + ')"' : ''}>다음으로</button>`;
            pagingMobile+=`<button type="button" class="btn medium bg-g4 next-btn"  ${page < numOfPage-1 ? 'onclick="getStoryRegister(' + (page+1) +', '+state + ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;
          }
          

          document.getElementById('popup').innerHTML  = popup;   
          document.getElementById('pagingPc').innerHTML  = pagingPc;   
          document.getElementById('pagingMobile').innerHTML  = pagingMobile;  
          document.getElementById('popup-btn').innerHTML = `<button type="button" class="btn btn-ok popup-close" onclick="layerPopup.closeAllPopup();voiceIdsSubmit = voiceIds;getStoryRegister(0)">선택완료</button>
                                                        <button type="button" class="btn btn-close popup-close" onclick="layerPopup.closeAllPopup();voiceIds = voiceIdsSubmit;">닫기</button>` 
                                                      })                    
                                                    }).catch(error => console.log(error));
      let html =""; 
      let htmlBtn =""; 
      if(voiceIdsSubmit?.length > 0){
        let url = baseUrl + "/voices?id="+voiceIdsSubmit.join();
        fetch(url, headers.json_headers)
        .then((response) => {
          checkError(response.status);
            response.json().then((response) => {
            let data = response.data.voices;      
                        

            for(let i=0;i<data.length;i++){
        
              if(i===0){
                html += `<div class="article-content-column-box">`
              }
              html += `<div class="article-info-box">
                            <div class="article-info-box-btn">
                              <a href="javascript:void(0);" class="article-info-box-link"></a>
                              <div class="image-box">
                              ${data[i].file?'<img src="'+data[i].file+'" alt="썸네일" />':''}
                              </div>
                              <div class="text-box">
                                ${data[i].state == 0 ? '<div class="label-text">글 쓰는 20대 발행</div>' : ''}
                                <div class="subject">${data[i].title}</div>
                                <div class="text">${data[i].summary}</div>
                                <div class="date">${data[i].startDate?dateToStrCharacterLength(strToDate(data[i].startDate), '.', 16):dateToStrCharacterLength(strToDate(data[i].lastDate), '.', 16)}</div>
                                <button type="button" class="btn icon-btn small round bg-wh delete-btn" onclick="deleteSubmit(${data[i].id});")"><i class="icon-box icon-trash"></i>삭제하기</button>
                              </div>
                            </div>
                          </div>`;
              if(i===data.length -1){
                html += ` </div>
                        <div class="btn-wrap">
                          <button type="button" class="btn medium bg-g4 full" onclick="voiceIds = voiceIdsSubmit;layerPopup.openPopup('magazineIncludedPopup', true)">글 담기</button>
                        </div>`
              }

              document.getElementById('voice').innerHTML  = html; 
            }               
          })                    
        }).catch(error => console.log(error));

        htmlBtn = `<a href="../mypage/mypage.html" class="btn bg-g4 cancel-btn">취소</a> `;
        htmlBtn += `<button type="button" class="btn bg-black write-btn" onclick="postStory(${id}, '${voiceIdsSubmit.join()}')">수정하기</button>`;
        document.getElementById('toolbar').innerHTML = htmlBtn;
        document.getElementById('btn').innerHTML = htmlBtn;
        
      }else{
        html = `<div class="article-content-column-box">
                  <div class="empty-info-text-box">
                  <button type="button" class="empty-link-btn" onclick="layerPopup.openPopup('magazineIncludedPopup')">
                    <i class="icon-box icon-plus-square">+</i>
                    <span class="text">웹진에 수록할 글을 담아주세요.</span>
                  </button>
                </div>
              </div>
            `;
          document.getElementById('voice').innerHTML  = html; 
      } 

    })                    
  }).catch(error => console.log(error));

  }else{      

    let size = 10;
    url = baseUrl + "/voices?offset=" + (page*size) + "&limit=" + size + "&userId="+meInfo.id;;
    if(state == 5){
      url += '&state=5'
    }else if(state == 0){
      url += '&state=0,3&startDate=' + new Date().toISOString();
    }else{
      url += '&state=0,3,5&startDate=' + new Date().toISOString();
    }

    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
        response.json().then((response) => {
        let data = response.data.voices; 
        let total = response.data.total;    
        let numOfPage = total/size;
        let popup ="";     
        let pagingPc ="";     
        let pagingMobile ="";     

        for(let i=0;i<data.length;i++){
          popup += `<div class="article-info-box">
                    <div class="selector-cover checkbox square solo line">
                      <label class="label">
                        <input type="checkbox"   id="popup-check-${data[i].id}" ${voiceIds?.indexOf(data[i].id) > -1 ? 'checked' : ''} onclick="checkIds(${data[i].id})"/>
                        <span class="selector-text">
                        <span class="selector"></span>
                        </span>
                      </label>
                    </div>
                    <div class="article-info-box-btn">
                      <div class="image-box">
                      ${data[i].file?'<img src="'+data[i].file+'" alt="썸네일" />':''}
                      </div>
                      <div class="text-box">
                        <div class="subject">${data[i].title}</div>
                        <div class="text">${data[i].summary}</div>
                        <div class="date">${data[i].startDate?dateToStrCharacterLength(strToDate(data[i].startDate), '.', 16):dateToStrCharacterLength(strToDate(data[i].lastDate), '.', 16)}</div>
                      </div>
                    </div>
                  </div>`;
        }

        if(total >size){
          pagingPc =`<button type="button" class="controller prev" ${page > 0 ? 'onclick="getStoryRegister('+(page-1)+', ' + state + ')"' : ''}>이전으로</button>`;
          pagingMobile=` <button type="button" class="btn medium bg-g4 prev-btn" ${page > 0 ? 'onclick="getStoryRegister('+(page-1)+', ' + state + ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
         
          for ( let j = 0; j< numOfPage; j++){
           pagingPc +=`<button type="button" class="paging ${page === j?'current':''}"  onclick="getStoryRegister(`+j+ `, ` + state + `)">` +  (j+1)  + `</button>`                                
          }             

          pagingPc +=`<button type="button" class="controller next" ${page < numOfPage-1 ? 'onclick="getStoryRegister(' + (page+1) + ', ' + state + ')"' : ''}>다음으로</button>`;
          pagingMobile+=`<button type="button" class="btn medium bg-g4 next-btn"  ${page < numOfPage-1 ? 'onclick="getStoryRegister(' + (page+1) + ', ' + state +')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;
        }
        

        document.getElementById('popup').innerHTML  = popup;   
        document.getElementById('pagingPc').innerHTML  = pagingPc;   
        document.getElementById('pagingMobile').innerHTML  = pagingMobile;  
        document.getElementById('popup-btn').innerHTML = `<button type="button" class="btn btn-ok popup-close" onclick="layerPopup.closeAllPopup();voiceIdsSubmit = voiceIds;getStoryRegister(0)">선택완료</button>
                                                        <button type="button" class="btn btn-close popup-close" onclick="layerPopup.closeAllPopup();voiceIds = voiceIdsSubmit;">닫기</button>` 
                                                      })                    
                                                    }).catch(error => console.log(error));

    let html =""; 
    let htmlBtn =""; 
    if(voiceIdsSubmit?.length > 0){
      let url = baseUrl + "/voices?id="+voiceIdsSubmit.join();
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
          response.json().then((response) => {
          let data = response.data.voices;      

          for(let i=0;i<data.length;i++){
      
            if(i===0){
              html += `<div class="article-content-column-box">`
            }
            html += `<div class="article-info-box">
                          <div class="article-info-box-btn">
                            <a href="javascript:void(0);" class="article-info-box-link"></a>
                            <div class="image-box">
                            ${data[i].file?'<img src="'+data[i].file+'" alt="썸네일" />':''}
                            </div>
                            <div class="text-box">
                              ${data[i].state == 0 ? '<div class="label-text">글 쓰는 20대 발행</div>' : ''}
                              <div class="subject">${data[i].title}</div>
                              <div class="text">${data[i].summary}</div>
                              <div class="date">${data[i].startDate?dateToStrCharacterLength(strToDate(data[i].startDate), '.', 16):dateToStrCharacterLength(strToDate(data[i].lastDate), '.', 16)}</div>
                              <button type="button" class="btn icon-btn small round bg-wh delete-btn" onclick="deleteSubmit(${data[i].id});")"><i class="icon-box icon-trash"></i>삭제하기</button>
                            </div>
                          </div>
                        </div>`;
            if(i===data.length -1){
              html += ` </div>
                      <div class="btn-wrap">
                        <button type="button" class="btn medium bg-g4 full" onclick="layerPopup.openPopup('magazineIncludedPopup', true)">글 담기</button>
                      </div>`
            }

            document.getElementById('voice').innerHTML  = html; 
          }               
        })                    
      }).catch(error => console.log(error));

      htmlBtn = `<a href="../mypage/mypage.html" class="btn bg-g4 cancel-btn">취소</a> `;
      htmlBtn += `<button type="button" class="btn bg-black write-btn" onclick="postStory(${id}, '${voiceIdsSubmit.join()}')">수정하기</button>`;
      document.getElementById('toolbar').innerHTML = htmlBtn;
      document.getElementById('btn').innerHTML = htmlBtn;
      
    }else{
      html = `<div class="article-content-column-box">
                <div class="empty-info-text-box">
                <button type="button" class="empty-link-btn" onclick="layerPopup.openPopup('magazineIncludedPopup')">
                  <i class="icon-box icon-plus-square">+</i>
                  <span class="text">웹진에 수록할 글을 담아주세요.</span>
                </button>
              </div>
            </div>
          `;
        document.getElementById('voice').innerHTML  = html; 
    } 

    htmlBtn = `<a href="../mypage/mypage.html" class="btn bg-g4 cancel-btn">취소</a> `;
    htmlBtn += `<button type="button" class="btn bg-black write-btn" onclick="postStoryRegister('${voiceIdsSubmit.join()}')">만들기</button>`;
    document.getElementById('toolbar').innerHTML = htmlBtn;
    document.getElementById('btn').innerHTML = htmlBtn;
  }
  
  document.getElementById("nickname").innerHTML = JSON.parse(window.localStorage.getItem("me")).nickname

  /// drop foile //////////////////////////////////////////////////////////////////////////
  const sendFileToDropzone = async (dropzone, url) => {
    if(!url) return;
    const response = await fetch(url);
    const data = await response.blob();
    const ext = url.split(".").pop(); 
    const metadata = {type: `image/${ext}`};
    const filename = url.split("/").pop();
    var file = new File([data], filename, metadata);

    dropzone.emit("addedfile", file, true);   
    dropzone.emit("thumbnail", file, url);
    dropzone.emit("accept", file);
    dropzone.emit("complete", file);
  };
}

function checkIds(id){    
  if(document.getElementById(`popup-check-${id}`).checked)
  {
    voiceIds.push(id);
  }else{
    voiceIds.splice(voiceIds.indexOf(id), 1)
  }
}

function deleteSubmit(id){      
  voiceIdsSubmit.splice(voiceIdsSubmit.indexOf(id), 1);
  getStoryRegister(0);
}

function getCommunity(page = 1){     
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
  
  url = baseUrl + "/communities?offset=0&id=" + id; 

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
            
      htmlAside += ` <div class="flow">
                <span>${data[0]?.category==0?'💕 연애':data[0]?.category==1?'✈️ 진로':data[0]?.category==2?'☀️ 일상':'🏫 '+data[0]?.schoolName}</span>
              </div>
              <div class="info-box">
                <div class="writer">
                  <span class="label">작성자</span>
                  <span class="text">${data[0]?.penName}</span>
                </div>
                <div class="date">
                  <span class="label">게시일</span>
                  <span class="text">${data[0]?.startDate?dateToStrCharacterLength(strToDate(data[0]?.startDate), '.', 16):dateToStrCharacterLength(strToDate(data[0]?.lastDate), '.', 16)}</span>
                </div>
                <div class="views">
                  <span class="label">조회수</span>
                  <span class="text">${numberWithCommas(data[0]?.showCount)}</span>
                </div>
                <div class="likes">
                  <span class="label">좋아요</span>
                  <span class="text">${numberWithCommas(data[0]?.likeCount)}</span>
                </div>
              </div>`;

      htmlTitle += `<div class="flow">
                <span>${data[0]?.category==0?'💕 연애':data[0]?.category==1?'✈️ 진로':data[0]?.category==2?'☀️ 일상':'🏫 우리 학교'}</span>
              </div>
              <div class="article-label-box">
                <div class="article-label-box-item">${data[0].rank !== null?'🔥 지금 많이 보는 글':''}</div>
              </div>
              <div class="article-report-title">
                <span class="article-label-text"><strong>${data[0].rank !== null?'🔥 지금 많이 보는 글':''}</strong></span>
                ${data[0]?.title}
              </div>
              <div class="nickname-box">${data[0]?.penName}</div>
              <div class="info-box">
                <div class="date">
                  <span class="label">게시일</span>
                  <span class="text">${data[0]?.startDate?dateToStrCharacterLength(strToDate(data[0]?.startDate), '.', 16):dateToStrCharacterLength(strToDate(data[0]?.lastDate), '.', 16)}</span>
                </div>
                <div class="views">
                  <span class="label">조회수</span>
                  <span class="text">${numberWithCommas(data[0]?.showCount)}</span>
                </div>
                <div class="likes">
                  <span class="label">좋아요</span>
                  <span class="text">${numberWithCommas(data[0]?.likeCount)}</span>
                </div>
              </div>`;
     
      document.getElementById('htmlAside').innerHTML  = htmlAside;
      document.getElementById('htmlTitle').innerHTML  = htmlTitle;
      document.getElementById('htmlContent').innerHTML  = htmlContent;
    })                    
  }).catch(error => console.log(error));
  url = baseUrl + "/banners?category=1&state=0,3&offset=0&limit=999&startDate=" + new Date().toISOString()+ "&endDate=" + new Date().toISOString(); 
    
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let data = response.data.banners;        
      let banners= "";    
      
      if(data.length > 0){
        let index =  Math.floor(Math.random() * (data.length));               

        banners=`<a href="${data[index]?.href}" target="_blank" class="banner-link" onclick="getCommunity(${(page)})"></a>
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
  let meInfo = JSON.parse(window.localStorage.getItem('me'));
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let data = response.data?.comments;     
      let total = response.data.total;             
   
      // url = baseUrl + "/users/me";  

      // fetch(url, headers.json_headers)
      // .then((response) => {
      //  checkError(response.status);
      //   response.json().then((response) => {
      //     let userId = response.data.user.id;               
          let comments= "";               
          let commentsButton="";   

          for(let i=0;i< page*size && i<total;i++){
            if(meInfo?.id == data[i]?.userId){
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
                    <button type="button" class="active-btn like-btn ${data[i].isLiked === 1 ? 'check' : ''}" onclick="${data[i].isLiked==1? 'postCommunityFlagCancel('+id + ',' + data[i].id + ',' + page+')' : 'postCommunityFlag('+id+',' +  data[i].id+ ',' + page+')'}">
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
                    <button type="button" class="add-btn" onclick="getCommunity(${(page+1)}, ${(magazinePage)})"><i class="icon-box icon-arrow-black-down">화살표</i><span class="underline">더보기</span></button>
                  </div>`
          }  


          commentsButton = `<div class="textarea-box">
              <textarea  id="comment-input" class="form-textarea full sm" placeholder="댓글을 입력해 주세요."></textarea>
              <label for="" class="info-text">다른 사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현이나 다른 사람의 권리를 침해하는 내용은 강제 삭제될 수 있습니다.</label>
            </div>
            <button type="button" class="btn" onclick="postCommunityComment(${(id)}, ${(page)})">댓글 쓰기</button>`;
            
          document.getElementById('commentsTotal').innerHTML  = '댓글 '+total+'개';       
          document.getElementById('comments').innerHTML  = comments;   
          document.getElementById('comments-button').innerHTML  = commentsButton;     
        })                    
      }).catch(error => console.log(error));
  
  //   });
  //  }).catch(error => {if(error.message === '401') logout() });

  // url = baseUrl + "/users/me"; 
    
  // fetch(url, headers.json_headers)
  // .then((response) => {
  //  checkError(response.status);
  //   response.json().then((response) => {
  //     let data = response.data.user;        
      let commentsPenName= "";    
      
      if(meInfo.nickname){
        commentsPenName = `<input type="text" id="nickname" name="nickname" title="닉네임" class="form-input" autocomplete="off" placeholder="닉네임(12자 이내로 입력)" value="${meInfo?.nickname}"  maxlength="12"/>`;
      }  
      document.getElementById('comments-penName').innerHTML  = commentsPenName;               
  //   });
  //  }).catch(error => {if(error.message === '401') logout() });

  document.getElementById('communityDetailBtn').innerHTML = ` <button type="button" class="btn bg-wh delete-btn" onclick="postCommunityDelete(${id})">삭제</button>
                <a href="../mypage/community-update.html?id=${id}" class="btn bg-black write-btn">수정하기</a>`

}

function getCommunityUpdate(){     
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
  
  url = baseUrl + "/communities?offset=0&id=" + id; 

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {

      let data = response.data.communities;
      
      // console.log( data[0].category)
      document.getElementById('selectBox').value = data[0].category;    
      document.getElementById('writer').value  = data[0].penName;
      document.getElementById('title').value  = data[0].title;
      editorInstance.html.insert(data[0].content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />"));
      document.getElementById('toolbarBtn').innerHTML  =`<button type="button" class="btn bg-g4 cancel-btn" onclick="location.href='../mypage/community-detail.html?id=${data[0].id}'">취소</button>
                  <button type="button" class="btn bg-black write-btn" onclick="postCommunity(${id})">수정하기</button>`;
      document.getElementById('writeBtn').innerHTML  =`<button type="button" class="btn bg-g4 cancel-btn"  onclick="location.href='../mypage/community-detail.html?id=${data[0].id}'">취소</button>
                  <button type="button" class="btn bg-black write-btn" onclick="postCommunity(${id})">수정하기</button>`;
        
                })                    
              }).catch(error => console.log(error));

}

function getScheduleUpdate(){     
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
  
  url = baseUrl + "/schedules?offset=0&id=" + id; 

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {      

      let data = response.data.schedules; 
      document.getElementById('selectBox').value = data[0].category;    
      document.getElementById('selectBoxOfficial').innerHTML = data[0].officialId;    
      document.getElementById('date-switch01').innerHTML = data[0].isAllDay;    
      document.getElementById('datePicker01').value  = data[0].startTime;
      document.getElementById('datePicker02').value  = data[0].endTime;
      document.getElementById('subjectText').value  = data[0].title;
      document.getElementById('editor').value  =data[0].content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />");
      document.getElementById('uploadImage').value  =data[0].file;
      document.getElementById('toolbarBtn').innerHTML  =`<a href="../mypage/mypage.html" class="btn bg-g4 cancel-btn">취소</a>
                  <button type="button" class="btn bg-wh delete-btn" onclick="postScheduleDelete(${id}, '../mypage/mypage.html')">삭제</button>
                  <button type="button" class="btn bg-black write-btn" onclick="postSchedule(${id})">수정하기</button>`;      
      document.getElementById('writeBtn').innerHTML  =`<button type="button" class="btn bg-wh save-btn" onclick="postScheduleDelete(${id}, '../mypage/mypage.html')">삭제</button>
                    <button type="button" class="btn bg-black write-btn" onclick="postSchedule(${id})">수정하기</button>`;
                  })                    
                }).catch(error => console.log(error));
}

function getReport(){     
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
  
  url = baseUrl + "/reports?id=" + id; 

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {      

      let data = response.data.reports; 
      let html ="";     

      html += `<div class="title-box">
            ${data[0].state == 0 ? '<div class="label-text">기사 발행</div>':''}
            <div class="title">${data[0].title}</div>
            <div class="date">${dateToStrCharacterLength(strToDate(data[0]?.lastDate), '.', 16)}</div>
          </div>
          <div class="report-content-box">
            ${data[0].content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />")}
          </div>`;
      if(data[0].file1){
        html+= `<div class="file-content-box">
        ${data[0].file1 ? '<div class="file-item"><div class="image"><img src="'+ data[0].file1+'"}" /></div><div class="text underline-text">'+data[0].file1.substring(data[0].file1.lastIndexOf('/')+1, data[0].file1.length)+'</div></div>':''}
        ${data[0].file2 ? '<div class="file-item"><div class="image"><img src="'+ data[0].file2+'"}" /></div><div class="text underline-text">'+data[0].file2.substring(data[0].file2.lastIndexOf('/')+1, data[0].file2.length)+'</div></div>':''}
        ${data[0].file3 ? '<div class="file-item"><div class="image"><img src="'+ data[0].file3+'"}" /></div><div class="text underline-text">'+data[0].file3.substring(data[0].file3.lastIndexOf('/')+1, data[0].file3.length)+'</div></div>':''}
        ${data[0].file4 ? '<div class="file-item"><div class="image"><img src="'+ data[0].file4+'"}" /></div><div class="text underline-text">'+data[0].file4.substring(data[0].file4.lastIndexOf('/')+1, data[0].file4.length)+'</div></div>':''}
        ${data[0].file5 ? '<div class="file-item"><div class="image"><img src="'+ data[0].file5+'"}" /></div><div class="text underline-text">'+data[0].file5.substring(data[0].file5.lastIndexOf('/')+1, data[0].file5.length)+'</div></div>':''}
       </div>`;
      }     
          
      if(data[0].answer){
        html += `<div class="answer-content-box">
        <div class="answer-text"><i class="icon-box icon-answer"></i>답변</div>
        <div class="text-box">
        ${data[0].answer?data[0]?.answer?.replaceAll('\r\n',"<br />")?.replaceAll('\n',"<br />"):''}
        </div>
      </div>`;
      } 
      html += `        
          <div class="btn-wrap">
            <a href="../mypage/mypage.html" class="btn medium bg-g4 full">이전</a>
          </div>`;
     
      document.getElementById('html').innerHTML  = html;
    })                    
  }).catch(error => console.log(error));


}

function postCommentSchedule(id) {
  let url = baseUrl + "/schedule-comment/register";  
  let comment_input = document.getElementById("comment-input-" + id).value;

  if(checkBanWord(comment_input)){
    layerPopup.openPopup('loginInfoPopup7')    
  }else{
    if(comment_input.length > 0){
      let params = {
        scheduleId: id,
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
          get();
        }).catch(error => {if(error.message === '401') logout() });
        
        } catch (error) {
          console.error("Error:", error);
        }      
      }
  
      post(requestPost);
    }
  }
}

function getQna(){     
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
  
  url = baseUrl + "/qnas?state=0,2&offset=0&id=" + id; 

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {      

      let data = response.data.qnas; 
      let html ="";     

      html += `<div class="title-box">
            ${data[0]?.state ==2 ? '<div class="label-text">답변 완료</div>' :''}              
            <div class="title">${data[0].title}</div>
            <div class="date">${dateToStrCharacterLength(strToDate(data[0].lastDate), '.', 10) + '. ' + dateToStrCharacterLength(strToDate(data[0].lastDate), '.', 16).substring(11,16)}</div>
          </div>
          <div class="report-content-box">
            ${data[0].content.replaceAll('\r\n', '</br>').replaceAll('\n', '</br>')}
          </div>`
      if(data[0].file1){
        html += `<div class="file-content-box">
          ${data[0].file1 ? '<div class="file-item"><div class="image"><img src="'+ data[0].file1+'"}" /></div><div class="text underline-text">'+data[0].file1.substring(data[0].file1.lastIndexOf('/')+1, data[0].file1.length)+'</div></div>':''}
          ${data[0].file2 ? '<div class="file-item"><div class="image"><img src="'+ data[0].file2+'"}" /></div><div class="text underline-text">'+data[0].file2.substring(data[0].file2.lastIndexOf('/')+1, data[0].file2.length)+'</div></div>':''}
          ${data[0].file3 ? '<div class="file-item"><div class="image"><img src="'+ data[0].file3+'"}" /></div><div class="text underline-text">'+data[0].file3.substring(data[0].file3.lastIndexOf('/')+1, data[0].file3.length)+'</div></div>':''}
          ${data[0].file4 ? '<div class="file-item"><div class="image"><img src="'+ data[0].file4+'"}" /></div><div class="text underline-text">'+data[0].file4.substring(data[0].file4.lastIndexOf('/')+1, data[0].file4.length)+'</div></div>':''}
          ${data[0].file5 ? '<div class="file-item"><div class="image"><img src="'+ data[0].file5+'"}" /></div><div class="text underline-text">'+data[0].file5.substring(data[0].file5.lastIndexOf('/')+1, data[0].file5.length)+'</div></div>':''}
         </div>`;
      }
          
      if(data[0].answer){
        html+=`<div class="answer-content-box">
            <div class="answer-text"><i class="icon-box icon-answer"></i>답변</div>
            <div class="text-box">
            ${data[0].answer.replaceAll('\r\n', '</br>').replaceAll('\n', '</br>')}
            </div>
          </div>`;
      }
      html+=`<div class="btn-wrap">
            <a href="../mypage/mypage.html" class="btn medium bg-g4 full">이전</a>
          </div>`;
     
      document.getElementById('html').innerHTML  = html;
    })                    
  }).catch(error => console.log(error));

}

function postVoiceComment(id, page) {
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
        getVoice(page);
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
}

function postVoiceFlag(id, commentId, page) {
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
      getVoice(page);
    }).catch(error => {if(error.message === '401') logout() });
    
    } catch (error) {
      console.error("Error:", error);
    }      
  }

  post(requestPost);
}

function postVoiceDelete(id) {
  let url = baseUrl + "/voice";  

  
    let params = {
      id: id,
      state : 1
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

      }).catch(error => {if(error.message === '401') logout() });
        layerPopup.openPopup('popup1')
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  
}

function postPoint() {
  let url = baseUrl + "/point";  

  let params = {
    userId: JSON.parse(window.localStorage.getItem('me')).id,
    state : 0
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
      document.getElementById("post-point").innerHTML = '<i class="icon-box icon-wallet"></i>입금 대기 중';
      document.getElementById("post-point").disabled = true;
      layerPopup.openPopup('pointInfoAlertPopup1');

    }).catch(error => {if(error.message === '401') logout() });
      
    } catch (error) {
      console.error("Error:", error);
    }      
  }

  post(requestPost);  
 
}

function postVoiceTemp(id, state) {
  let url = baseUrl + "/voice";  

  let formData = new FormData();
  formData.append('id' , id);
  formData.append('state' , state);
  formData.append('title' , document.getElementById('title').value);
  formData.append('summary' , document.getElementById('desctext').value);
  formData.append('content' , editorInstance.html.get());
  formData.append('tags' , document.getElementById("tagname").value);

  if(croppedFile != null){
    formData.append('file', croppedFile, croppedFile.name);
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
      layerPopup.openPopup('popup');

    }).catch(error => {if(error.message === '401') logout() });
    
    } catch (error) {
      console.error("Error:", error);
    }      
  }

  post(requestPost);  
}


function postVoiceSave(id, state) {

  let tagname = []; 
  let tagnameValid = true;
  
  tagname = document.getElementById('tagname').value.split(',');
  tagname.map((i) => i.length > 10 && (tagnameValid=false))

  if(croppedFile ===null){
    layerPopup.openPopup('popup2');
  }else if(document.getElementById('title').value.length === 0 || document.getElementById('desctext').value.length === 0){
    layerPopup.openPopup('popup3');
  }else if(editorInstance.html.get().length === 0 ){
    layerPopup.openPopup('popup4');
  }else if(document.getElementById("tagname").value.length === 0 ){
    layerPopup.openPopup('popup5');
  }else if(!tagnameValid){
    layerPopup.openPopup('popup8');
  }else if(document.getElementById("check-radio01").checked === false ){
    layerPopup.openPopup('popup6');
  }else{
    let url = baseUrl + "/voice";  

    let formData = new FormData();
    formData.append('id' , id);
    formData.append('state' , state);
    formData.append('title' , document.getElementById('title').value);
    formData.append('summary' , document.getElementById('desctext').value);
    formData.append('content' , editorInstance.html.get());
    formData.append('tags' , document.getElementById("tagname").value);
  
    if(croppedFile != null){
      formData.append('file', croppedFile, croppedFile.name);
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
        layerPopup.openPopup('popup1');
  
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }
  
    post(requestPost);  
  }
 
}

function postVoice(id, state) {  
  let tagname = []; 
  let tagnameValid = true;
  
  tagname = document.getElementById('tagname').value.split(',');
  tagname.map((i) => i.length > 10 && (tagnameValid=false))

  if(croppedFile ===null){
    layerPopup.openPopup('popup2');
  }else if(document.getElementById('title').value.length === 0 || document.getElementById('desctext').value.length === 0){
    layerPopup.openPopup('popup3');
  }else if(editorInstance.html.get().length === 0 ){
    layerPopup.openPopup('popup4');
  }else if(document.getElementById("tagname").value.length === 0 ){
    layerPopup.openPopup('popup5');
  }else if(!tagnameValid){
    layerPopup.openPopup('popup8');
  }else{
  
    let url = baseUrl + "/voice";  

    let formData = new FormData();
    formData.append('id' , id);
    formData.append('state' , state);
    formData.append('title' , document.getElementById('title').value);
    formData.append('summary' , document.getElementById('desctext').value);
    formData.append('content' , editorInstance.html.get());
    formData.append('tags' , document.getElementById("tagname").value);

    if(croppedFile != null){
      formData.append('file', croppedFile, croppedFile.name);
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


        if(document.getElementById("question").value.length > 0){
          url = baseUrl + "/voice-question/register";  

          params = {
            voiceId: id,   
            content :  document.getElementById("question").value,
          }

          const requestPost2 = new Request(url, {
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
              location.href='../mypage/detail.html?id=' + id;
            }).catch(error => {if(error.message === '401') logout() });
            
            } catch (error) {
              console.error("Error:", error);
            }      
          }
          post(requestPost2);
        }else{
          location.href='../mypage/detail.html?id=' + id;
        }
        

      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }

  
}

function acceptAdvice(id, state) {
  let url = baseUrl + "/voice";  

  let params = {
    id: id,
    state : state,   
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
      if(state === 7){
        get()
      }
      

    }).catch(error => {if(error.message === '401') logout() });
    
    } catch (error) {
      console.error("Error:", error);
    }      
  }

  post(requestPost);
  
}

function postStoryRegister(idString) {
  if(!document.getElementById('createThumbnail').checked
    && !document.getElementById('radio-thumb-1').checked
    && !document.getElementById('radio-thumb-2').checked
    && !document.getElementById('radio-thumb-3').checked
    && !document.getElementById('radio-thumb-4').checked
  ){  
    document.getElementById("infoPopupMessage").innerHTML = ` <strong>대표 이미지 디자인을 선택해 주세요.</strong>`;  
    return location.href= "javascript:layerPopup.openPopup('infoPopup', true);";
  }else if(document.getElementById('createThumbnail').checked && !croppedFile){
    document.getElementById("infoPopupMessage").innerHTML = ` <strong>대표 이미지를 등록해 주세요.</strong>`;  
    return  location.href= "javascript:layerPopup.openPopup('infoPopup', true);";
  }else if(document.getElementById('title').value.length == 0){
    document.getElementById("infoPopupMessage").innerHTML = ` <strong>제목을 작성해 주세요.</strong>`;  
    return  location.href= "javascript:layerPopup.openPopup('infoPopup', true);";
  }else if(document.getElementById('desctext').value.length == 0){
    document.getElementById("infoPopupMessage").innerHTML = ` <strong>한 줄 소개를 작성해 주세요.</strong>`;  
    return  location.href= "javascript:layerPopup.openPopup('infoPopup', true);";
  }else if(idString.length == 0){
    document.getElementById("infoPopupMessage").innerHTML = ` <strong>매거진 수록 글을 선택해 주세요.</strong>`;  
    return location.href= "javascript:layerPopup.openPopup('infoPopup', true);";
  }

  var sotoryCoverFile = null;

  const register = () => {
    let url = baseUrl + "/story/register";    

    let formData = new FormData();
    formData.append('state', document.getElementById('check-radio01').checked?0:2); 
    formData.append('title' , document.getElementById('title').value);
    formData.append('summary' , document.getElementById('desctext').value);
    formData.append('voiceIds' , idString.split(',').map(Number));

    if(document.getElementById('createThumbnail').checked){
      if (croppedFile) formData.append('files', croppedFile, croppedFile.name);
    }else{
      let relativeUrl = null;
      if(document.getElementById('radio-thumb-1').checked){
        relativeUrl = document.getElementById('cover-image-1').src;
      }else if(document.getElementById('radio-thumb-2').checked){
        relativeUrl = document.getElementById('cover-image-2').src;
      }else if(document.getElementById('radio-thumb-3').checked){
        relativeUrl = document.getElementById('cover-image-3').src;
      }else if(document.getElementById('radio-thumb-4').checked){
        relativeUrl = document.getElementById('cover-image-4').src;
      }
      formData.append('cover' , '../../..' + relativeUrl.substring(relativeUrl.indexOf('/resources/images')));
    } 
    
    if (sotoryCoverFile) formData.append('files', sotoryCoverFile, sotoryCoverFile.name);

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
        document.getElementById("infoPopupMessage").innerHTML = ` <strong>대학생이 만든 매거진이 완성되었습니다.</br>지금까지 만든 대학생이 만든 매거진은</br>마이페이지에서 확인해 주세요.</strong>`;        
        $('#infoPopupButton').attr('onclick', 'location.href="../mypage/mypage.html#webZine"')
        location.href= "javascript:layerPopup.openPopup('infoPopup', true);";
      }).catch(error => {if(error.message === '401') logout() });
        
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
  
  const makeStoryCover = async () =>{
     //캔버스 크기 설정 (434 * 618)
    var width = 434, height = 618;
    var added_width = 376, added_height = 390;
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext("2d");
    context.globalCompositeOperation = "source-over";

    // background => original size 1308 * 1860
    var title = $('#title').val();
    var nickname = $('#nickname').text();

    // 백그라운드 썸네일 이미지 생성
    var tempImage = new Image(); //drawImage 메서드에 넣기 위해 이미지 객체화
    tempImage.src = '../../../resources/images/webzine/webzine-create-thumbnail.png'; //data-uri를 이미지 객체에 주입
    tempImage.onload = function () {

      //백그라운드 이미지를 캔버스에 그리기
      context.drawImage(this, 0, 0, width, height);

      // 표지 읽기
      var tempImage2 = new Image(); //drawImage 메서드에 넣기 위해 이미지 객체화
      tempImage2.src = $('#image').attr('src'); //data-uri를 이미지 객체에 주입
      tempImage2.onload = function () {  

        //표지를  캔버스에 그리기
        context.drawImage(this, width - added_width, 30, added_width, added_height);

        // 제목 쓰기
        context.font = '700 30px SUIT';
        context.lineWidth = 31.7;
        context.textBaseline = 'bottom';

        let letters1 = null, letters2 = null;
        for(let i=1; i<title.length; i++){
          if(letters1 === null) {
            if(context.measureText(title.substring(0,i)).width >= 340)
              letters1 = i;
          }
          else if(letters2 === null) {
            if(context.measureText(title.substring(0,i)).width >= 780){ 
              letters2 = i; 
              break;
            }
          }
        }

        if(letters1 === null){
          context.fillText(title, width - added_width, 30 + added_height + 102, added_width);
        }
        else if(letters1 !==null && letters2 === null){
          context.fillText(title.substring(0,letters1), width - added_width, 30 + added_height + 68, added_width);
          context.fillText(title.substring(letters1, title.length), width - added_width, 30 + added_height + 102, added_width);
        }
        else{
          context.fillText(title.substring(0,letters1), width - added_width, 30 + added_height + 32, added_width);
          context.fillText(title.substring(letters1,letters2), width - added_width, 30 + added_height + 68, added_width);
          context.fillText(title.substring(letters2, title.length), width - added_width, 30 + added_height + 102, added_width);
        }

        // 글쓴이
        context.font = '14px SUIT';
        //context.lineWidth = 30.7;
        context.fillText(nickname, width - added_width, 170 + added_height);

        // 수정 이미지 저장
        let imgSrc = canvas.toDataURL();
        const binary = atob(imgSrc.split(',')[1]);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }

        sotoryCoverFile = new File([new Uint8Array(array)], 'magazine_cover.png', {type: 'image/png'});

        register();

        /*
        //캔버스에 그린 이미지를 다시 data-uri 형태로 변환
        var dataURI = canvas.toDataURL("image/jpeg");
        //썸네일 이미지 보여주기
        document.querySelector('#preview').src = dataURI;
        */

      };
    };
  }

  makeStoryCover();
}

function postStory(id, idString) {
  if(!document.getElementById('createThumbnail').checked
    && !document.getElementById('radio-thumb-1').checked
    && !document.getElementById('radio-thumb-2').checked
    && !document.getElementById('radio-thumb-3').checked
    && !document.getElementById('radio-thumb-4').checked
  ){  
    document.getElementById("infoPopupMessage").innerHTML = ` <strong>대표 이미지 디자인을 선택해 주세요.</strong>`;  
    return location.href= "javascript:layerPopup.openPopup('infoPopup', true);";
  }else if(document.getElementById('createThumbnail').checked && !croppedFile){
    document.getElementById("infoPopupMessage").innerHTML = ` <strong>대표 이미지를 등록해 주세요.</strong>`;  
    return location.href= "javascript:layerPopup.openPopup('infoPopup', true);";
  }else if(document.getElementById('title').value.length == 0){
    document.getElementById("infoPopupMessage").innerHTML = ` <strong>제목을 작성해 주세요.</strong>`;  
    return location.href= "javascript:layerPopup.openPopup('infoPopup', true);";
  }else if(document.getElementById('desctext').value.length == 0){
    document.getElementById("infoPopupMessage").innerHTML = ` <strong>한 줄 소개를 작성해 주세요.</strong>`;  
    return location.href= "javascript:layerPopup.openPopup('infoPopup', true);";
  }else if(idString.length == 0){
    document.getElementById("infoPopupMessage").innerHTML = ` <strong>매거진 수록 글을 선택해 주세요.</strong>`;  
    return location.href= "javascript:layerPopup.openPopup('infoPopup', true);";
  }

  var sotoryCoverFile = null;

  const register = () => {
    let url = baseUrl + "/story";    
    
    let formData = new FormData();
    
    formData.append('id', id); 
    formData.append('state', document.getElementById('check-radio01').checked?0:2); 
    formData.append('title' , document.getElementById('title').value);
    formData.append('summary' , document.getElementById('desctext').value);
    formData.append('voiceIds' , idString.split(',').map(Number));

    if(document.getElementById('createThumbnail').checked){
      if (croppedFile) formData.append('files', croppedFile, croppedFile.name);
    }else{
      let relativeUrl = '';
      if(document.getElementById('radio-thumb-1').checked){
        relativeUrl = document.getElementById('cover-image-1').src;
      }else if(document.getElementById('radio-thumb-2').checked){
        relativeUrl = document.getElementById('cover-image-2').src;
      }else if(document.getElementById('radio-thumb-3').checked){
        relativeUrl = document.getElementById('cover-image-3').src;
      }else if(document.getElementById('radio-thumb-4').checked){
        relativeUrl = document.getElementById('cover-image-4').src;
      }

      formData.append('cover' , '../../..' + relativeUrl.substring(relativeUrl.indexOf('/resources/images'))); 
    }

    if (sotoryCoverFile) formData.append('files', sotoryCoverFile, sotoryCoverFile.name);
  
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
        document.getElementById("infoPopupMessage").innerHTML = ` <strong>대학생이 만든 매거진이 완성되었습니다.</br>지금까지 만든 대학생이 만든 매거진은</br>마이페이지에서 확인해 주세요.</strong>`;        
        location.href= "javascript:layerPopup.openPopup('infoPopup', true);";
      }).catch(error => {if(error.message === '401') logout() });
        
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }

  const makeStoryCover = async () =>{
      //캔버스 크기 설정 (434 * 618)
    var width = 434, height = 618;
    var added_width = 376, added_height = 390;

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext("2d");
    context.globalCompositeOperation = "source-over";

    // background => original size 1308 * 1860
    var title = $('#title').val();
    var nickname = $('#nickname').text();

    // 백그라운드 썸네일 이미지 생성
    var tempImage = new Image(); //drawImage 메서드에 넣기 위해 이미지 객체화
    tempImage.src = '../../../resources/images/webzine/webzine-create-thumbnail.png'; //data-uri를 이미지 객체에 주입
    tempImage.onload = function () {

      //백그라운드 이미지를 캔버스에 그리기
      context.drawImage(this, 0, 0, width, height);

      // 표지 읽기
      var tempImage2 = new Image(); //drawImage 메서드에 넣기 위해 이미지 객체화
      tempImage2.src = $('#image').attr('src'); //data-uri를 이미지 객체에 주입
      tempImage2.onload = function () {  

        //표지를  캔버스에 그리기
        context.drawImage(this, width - added_width, 30, added_width, added_height);

        // 제목 쓰기
        context.font = '700 30px SUIT';
        context.lineWidth = 31.7;
        context.textBaseline = 'bottom';

        let letters1 = null, letters2 = null;
        for(let i=1; i<title.length; i++){
          if(letters1 === null) {
            if(context.measureText(title.substring(0,i)).width >= 340)
              letters1 = i;
          }
          else if(letters2 === null) {
            if(context.measureText(title.substring(0,i)).width >= 780){ 
              letters2 = i; 
              break;
            }
          }
        }

        if(letters1 === null){
          context.fillText(title, width - added_width, 30 + added_height + 102, added_width);
        }
        else if(letters1 !==null && letters2 === null){
          context.fillText(title.substring(0,letters1), width - added_width, 30 + added_height + 68, added_width);
          context.fillText(title.substring(letters1, title.length), width - added_width, 30 + added_height + 102, added_width);
        }
        else{
          context.fillText(title.substring(0,letters1), width - added_width, 30 + added_height + 32, added_width);
          context.fillText(title.substring(letters1,letters2), width - added_width, 30 + added_height + 68, added_width);
          context.fillText(title.substring(letters2, title.length), width - added_width, 30 + added_height + 102, added_width);
        }

        // 글쓴이
        context.font = '14px SUIT';
        //context.lineWidth = 30.7;
        context.fillText(nickname, width - added_width, 170 + added_height);

        // 수정 이미지 저장
        let imgSrc = canvas.toDataURL();
        const binary = atob(imgSrc.split(',')[1]);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }

        sotoryCoverFile = new File([new Uint8Array(array)], 'magazine_cover.png', {type: 'image/png'});

        register();

        /*
        //캔버스에 그린 이미지를 다시 data-uri 형태로 변환
        var dataURI = canvas.toDataURL("image/jpeg");
        //썸네일 이미지 보여주기
        document.querySelector('#preview').src = dataURI;
        */

      };
    };
  }

  makeStoryCover();
}

function postStoryDeleteConfirm(id, next = '') {  
  document.getElementById("infoTextPopupTitle").innerHTML = `<strong>매거진을 삭제하시겠어요?</br>삭제하면 되돌릴 수 없습니다.</strong>`;        
  document.getElementById("infoTextPopupMessage").innerHTML = `※ 원본 글은 삭제되지 않습니다.`;       
  document.getElementById("infoTextPopupButton").innerHTML = `<button type="button" class="btn btn-close popup-close">취소</button>
            <button type="button" class="btn btn-ok popup-close"  onclick="postStoryDelete(${id}, '${next}')">확인</button>`;       
  location.href= "javascript:layerPopup.openPopup('infoTextPopup', true);";
}

function postStoryDelete(id, next = '') {
  let url = baseUrl + "/story";  

    let formData = new FormData();
    formData.append('id', id);
    formData.append('state', 1);

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
        document.getElementById("loginInfoPopup7Message").innerHTML = `<strong>매거진이 삭제되었어요.</strong>`;               
          
        if(next.length > 0){
          document.getElementById("loginInfoPopup7Button").innerHTML = `<button type="button" class="btn btn-ok popup-close" onclick="location.href='${next}'">확인</button>`;        
        }else{
          document.getElementById("loginInfoPopup7Button").innerHTML = `<button type="button" class="btn btn-ok popup-close" onclick="get()">확인</button>`;        
        }
        
        location.href= "javascript:layerPopup.openPopup('loginInfoPopup7', true);";
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);

}

function postCommunity(id) {
  let url = baseUrl + "/community";  

  let category = document.getElementById("selectBox").value;
  let nickname = document.getElementById("writer").value;
  let title = document.getElementById("title").value;
  let content = document.getElementById("editor").value;

  document.getElementById("popup-base-message").innerHTML = '<strong>수정이 완료되었어요.</strong>';
  $("#popup-base-ok").attr('onclick', "location.href='../mypage/community-detail.html?id=" + id+"'");  
  
  let params = {
    id: id,
    category : category,
    penName : nickname,
    title : title,
    content : content
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
      
      layerPopup.openPopup('popup-base')
      
    }).catch(error => {if(error.message === '401') logout() }); 
    
    } catch (error) {
      console.error("Error:", error);
    }      
  }

  post(requestPost);
  
}

function postCommunityDelete(id) {
  let url = baseUrl + "/community";  

  
    let params = {
      id: id,
      state : 1
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
        location.href='../mypage/mypage.html';
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  
}

function postCommunityComment(id, page) {
  let url = baseUrl + "/community-comment/register";  
  let comment_input = document.getElementById("comment-input").value;
  let nickname = document.getElementById("nickname").value;
  
  if(comment_input.length > 0){
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
        getCommunity(page);
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
}

function postCommunityFlag(id, commentId, page) {
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
      getCommunity(page);
    }).catch(error => {if(error.message === '401') logout() });
    
    } catch (error) {
      console.error("Error:", error);
    }      
  }

  post(requestPost);
}

function postCommunityFlagCancel(id, commentId, page) {
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
      getCommunity(page);
    }).catch(error => {if(error.message === '401') logout() });
    
    } catch (error) {
      console.error("Error:", error);
    }      
  }

  post(requestPost);
}

function postScheduleDelete(id, location='') {

  let url = baseUrl + "/schedule";  
  
    let params = {
      id: id,
      state : 1
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
        if(location == ''){
          layerPopup.openPopup('infoPopup2');
        }else{    
          location.href = location;      
        }
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);

}

function postSchedule(id) {
  let url = baseUrl + "/schedule";

  let formData = new FormData();
  formData.append('category', document.getElementById("selectBox").value);
  formData.append('officialId', document.getElementById("selectBoxOfficial").value);
  formData.append('isAllDay', document.getElementById("date-switch01").value);
  formData.append('startTime', document.getElementById("datePicker01").value);
  formData.append('endTime', document.getElementById("datePicker02").value);
  formData.append('title', document.getElementById("subjectText").value);
  formData.append('content', document.getElementById("editor").value);
  // formData.append('file', document.getElementById("uploadImage").src, document.getElementById("uploadImage").src.substring(document.getElementById("uploadImage").src.lastIndexOf('/')+1, document.getElementById("uploadImage").src.length));

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
        location.href='../mypage/mypage.html';
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  
}
