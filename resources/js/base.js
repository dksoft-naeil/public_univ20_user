var baseUrl =  ""
var appPath = "";
var adminPath = "";

var client_id = '';
var client_secret = '';

var accessToken = '';
var refreshToken = '';
var accessTokenGuest = '';

var isLogined = null;
var header;

if(!accessToken || !refreshToken) {
    isLogined = false;
   window.localStorage.setItem('', accessTokenGuest);
    headers = { 
        json_headers: { headers:  {
            "Content-Type": "application/json", 
            "Authorization": 'Bearer ' + accessTokenGuest
        }},
        form_headers: { headers:  {
            "Authorization": 'Bearer ' + accessTokenGuest
        }}
    };
}else{
    headers = { 
        json_headers: { headers:  {
            "Content-Type": "application/json", 
            "Authorization": 'Bearer ' + accessToken
        }},
        form_headers: { headers:  {
            "Authorization": 'Bearer ' + accessToken
        }}
    };
}


let loginHtml = "";
let loginHtmlMobile = "";

document.addEventListener("DOMContentLoaded", () => {
    accessToken =window.localStorage.getItem("accessToken");
    refreshToken =window.localStorage.getItem("refreshToken");
    if(!accessToken || !refreshToken) {
        isLogined = false;
        //if(window.location.pathname.indexOf("/login/login") < 0) window.location.href='../login/login.html';
    } 
    else isLogined = true;

    // let meInfo = JSON.parse(window.localStorage.getItem('me'));

    if( document.getElementById('login') !== null){
        if(!accessToken || accessTokenGuest == accessToken){
            loginHtml = `<div class="menu-box-item">
                    <a href="#" onclick="href='../login/login.html'">로그인</a>
                    </div>
                    <div class="menu-box-item">
                    <button type="button" class="dark-mode-btn">
                        <i class="icon-box icon-moon"></i>
                        <i class="icon-box icon-sun"></i>
                       
                    </button>
                    </div>
                    <div class="menu-box-item">
                    <button type="button" class="search-control-btn">
                        <i class="icon-box icon-search-black"></i>
                        <i class="icon-box icon-search-white"></i>
                        
                    </button>
                    </div>`;
        }else{
            loginHtml = `<div class="menu-box-item">
                    <a href="#" onclick="href='../mypage/mypage.html'">마이페이지</a>
                    </div>
                    <!-- 로그인 후 -->
                    <div class="menu-box-item">
                    <button type="button" onclick="logout()">로그아웃</button>
                    </div>
                    <!-- //로그인 후 -->
                    <div class="menu-box-item">
                    <button type="button" class="dark-mode-btn">
                        <i class="icon-box icon-moon"></i>
                        <i class="icon-box icon-sun"></i>
                       
                    </button>
                    </div>
                    <div class="menu-box-item">
                    <button type="button" class="search-control-btn">
                        <i class="icon-box icon-search-black"></i>
                        <i class="icon-box icon-search-white"></i>
                       
                    </button>
                    </div>`;
        }

        document.getElementById('login').innerHTML = loginHtml;  
    }

    if( document.getElementById('loginMobile') !== null){       
        if(!accessToken || accessTokenGuest == accessToken){            
            loginHtmlMobile = `<div class="user-info">
                당신을 위한 라이프 매거진<br />
            UNIV20
              </div>
              <div class="user-menu">
                <div class="user-menu-left">
                  <a href="../login/login.html" class="btn login-btn">로그인</a>
                </div>
                <div class="user-menu-right">
                  <button type="button" class="dark-mode-btn">
                    <i class="icon-box icon-moon"></i>
                    <i class="icon-box icon-sun"></i>
                    
                  </button>
                </div>
              </div>`;
        }else{
            let meInfo = JSON.parse(window.localStorage.getItem('me'));           
           
            loginHtmlMobile = ` <div class="user-info">
                <span class="nickname">${meInfo.nickname}</span>님을 위한<br />
            라이프 매거진 UNIV20
              </div>
              <div class="user-menu">
                <div class="user-menu-left">
                  <button type="button" class="btn logout-btn"  onclick="logout()">로그아웃</button>
                  <a href="../mypage/mypage.html" class="btn">마이페이지</a>
                </div>
                <div class="user-menu-right">
                  <button type="button" class="dark-mode-btn">
                    <i class="icon-box icon-moon"></i>
                    <i class="icon-box icon-sun"></i>
                    
                  </button>
                </div>
              </div>`
        }
      
        document.getElementById('loginMobile').innerHTML = loginHtmlMobile;  
    }

    if( document.getElementById('login-box') !== null){       
        if(!accessToken || accessTokenGuest == accessToken){            
            document.getElementById('login-box').innerHTML = `<div class="login-box-item">
              <a href="../login/login.html" class="login-btn"><i class="icon-box icon-login"></i>로그인</a>
            </div>`;
        }else{
            document.getElementById('login-box').innerHTML = `<div class="login-box-item">
              <button type="button" class="mobile-menu-btn">
                <span class="profile-box">
                  <!-- 프로필 사진 등록시 image-thumb 클래스 추가, img 추가  -->
                  <!-- <div class="image image-thumb"> -->
                    <span class="image">
                      <!-- <img src="../../../resources/images/" alt="프로필 이미지" /> -->
                   </span>
                   <!-- //프로필 사진 등록시 image-thumb 클래스 추가, img 추가  -->  
                </span>
              </button>
            </div>
            <div class="menu-box">
              <div class="menu-box-item">
                <a href="javascript:goRegisterBase('voice')" class="menu-box-btn"><i class="icon-box header-icon-pencil"></i>글쓰기</a>
              </div>
              <div class="menu-box-item">
                <a href="javascript:goRegisterBase('report')" class="menu-box-btn"><i class="icon-box header-icon-volume"></i>대학내일에<br />
              알려주기</a>
              </div>
              <div class="menu-box-item">
                <a href="javascript:goRegisterBase('proposal')" class="menu-box-btn"><i class="icon-box header-icon-camera"></i>표지모델 신청</a>
              </div>
              <div class="menu-box-item">
                <a href="../mypage/mypage.html" class="menu-box-btn"><i class="icon-box header-icon-user"></i>마이페이지</a>
              </div>
              <div class="menu-box-item menu-logout">
                <button type="button" class="menu-box-btn" onclick="logout()"><i class="icon-box header-icon-logout"></i>로그아웃</button>
              </div>
            </div>`
        }      
    }

    document.getElementById("mobile-menu").innerHTML = ` <li class="all-menu-item">
              <a href="javascript:goRegisterBase('voice')" class="all-menu-btn">글쓰기</a>
            </li>
            </li>
            <li class="all-menu-item">
              <a href="javascript:goRegisterBase('report')" class="all-menu-btn">대학내일에 알려주기</a>
            </li>
            <li class="all-menu-item">
              <a href="javascript:goRegisterBase('proposal')" class="all-menu-btn">표지모델 신청</a>
            </li>
            <li class="all-menu-item">
              <button type="button" class="all-menu-btn sub-menu-box-btn">매거진</button>
              <div class="sub-menu-box">
                <ul class="sub-menu-list">
                  <li class="sub-menu-item">
                    <a href="../magazine/magazine.html" class="sub-menu-btn">- 전체</a>
                  </li>
                  <li class="sub-menu-item">
                    <a href="../magazine/magazine.html" class="sub-menu-btn">- 캠퍼스</a>
                  </li>
                  <li class="sub-menu-item">
                    <a href="../magazine/magazine.html" class="sub-menu-btn">- 라이프스타일</a>
                  </li>
                  <li class="sub-menu-item">
                    <a href="../magazine/magazine.html" class="sub-menu-btn">- 커리어</a>
                  </li>
                </ul>
              </div>
            </li>
            <li class="all-menu-item">
              <a href="../voice/voice.html" class="all-menu-btn">글 쓰는 20대</a>
            </li>
            <li class="all-menu-item">
              <a href="../community/community.html" class="all-menu-btn">커뮤니티</a>
            </li>
            <li class="all-menu-item">
              <a href="../schedule/schedule.html" class="all-menu-btn">캘린더</a>
            </li>`;

    document.getElementById("mobile-menu-footer").innerHTML = `<a href="../notice/faq.html" class="add-btn">자주 묻는 질문</a>
            <a href="../notice/register.html" class="add-btn" id="qna-base1">문의/신고하기</a>
          `;

    $("#search-button-base1").attr('onclick', "searchKeyword()");
    $("#search-button-base2").attr('onclick', "searchKeyword()");
    $("#searchKeyword1").attr('onkeypress', "enterSearchKeyword(event)");
    $("#searchKeyword2").attr('onkeypress', "enterSearchKeyword(event)");
    
    $("#qna-base1").attr('href', "javascript:goFaqRegister()");
    $("#qna-base2").attr('href', "javascript:goFaqRegister()");
    $("body").append(`<div class="layer-popup full-scroll info-content-popup" id="popup-base">
                        <div class="popup-container small">
                          <div class="popup-header">
                            <div class="popup-title txt-hidden">
                              <strong>알림</strong>
                            </div>
                          </div>
                          <div class="popup-content">
                            <div class="popup-inner">
                              <div class="info-content-box">
                                <div class="text-box" id="popup-base-message">
                                  <strong>
                                 
                                  </strong>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="popup-footer">
                            <div class="btn-area" id="popup-base-ok">
                              <button type="button" class="btn btn-ok popup-close">확인</button>
                            </div>
                          </div>
                        </div>
                      </div>`);
    

    //error
    if(window.location.pathname.indexOf("/error/error") >= 0 ){
      let code = window.location.search.split('=')[1];
      console.log('error code => ' + code);
      if(code === '400')  $(".text")?.text("400 - 잘못된 요청 입니다.");
      else if(code === '403') $(".text")?.text("403 - 액세서가 거부 되었습니다.");
      else if(code === '404') $(".text")?.text("404 - 요청하신 페이지를 찾을 수 없습니다.");
      else if(code === '409') $(".text")?.text("409 - 요청하신 페이지를 찾을 수 없습니다.");
      else if(code === '500') $(".text")?.text("409 - 서버에 예상치 못한 문제가 발생하였습니다.");    
      else $(".text")?.text((code ? (code + " - ") : "") + "알수 없는 문제가 발생했습니다.");
  }

});

function goFaqRegister(){
  if(window.localStorage.getItem("me")){
    location.href=`../notice/register.html`;
  }else{
    document.getElementById("popup-base-message").innerHTML = '<strong>로그인 후 문의/신고를 하실 수 있어요.</strong>';
    $("#popup-base-ok").attr('onclick', "location.href='../login/login.html'");  
    layerPopup.openPopup('popup-base')
  }    
}

function searchKeyword(){
  if(document.getElementsByName('search')[0]?.value.length > 0){
    location.href=`../search/search.html?search=${document.getElementsByName('search')[0]?.value}`;
  }else if(document.getElementsByName('search')[1]?.value.length > 0){
    location.href=`../search/search.html?search=${document.getElementsByName('search')[1]?.value}`;
  }else{
     location.href=`../search/search.html?search=`;
  }
} 

function enterSearchKeyword(e){
  if(e.keyCode==13){
    searchKeyword()
  }    
}

function logout(){
   window.sessionStorage.clear();
//    window.localStorage.clear();
    window.localStorage.setItem('accessToken', '');
    window.localStorage.setItem('refreshToken', '');
    window.localStorage.setItem('me', '');    
    window.location.href='../main/main.html';
}

function checkError(status){
  if(status === 400) window.location.href = '../error/error.html?code=' + status;
  else if(status === 401) logout();
  else if(status === 403) logout();
  //else if(status === 404) window.location.href = '../error/error.html?code=' + status;
  //else if(status === 409) window.location.href = '../error/error.html?code=' + status;
  else if(status === 500) window.location.href = '../error/error.html?code=' + status;
}

function goRegisterBase(menu){
  if(!window.localStorage.getItem('me') && menu == 'report'){      
    document.getElementById("popup-base-message").innerHTML = '<strong>흥미로운 이야기를 제보하려면<br />로그인해 주세요.</strong>';
    $("#popup-base-ok").attr('onclick', "location.href='../login/login.html'");  
    layerPopup.openPopup('popup-base');   
  }else if(!window.localStorage.getItem('me') && menu == 'proposal'){      
    document.getElementById("popup-base-message").innerHTML = '<strong>대학내일 표지모델에 도전하려면<br />로그인해 주세요.</strong>';
    $("#popup-base-ok").attr('onclick', "location.href='../login/login.html'");  
    layerPopup.openPopup('popup-base');    
  }else if(!window.localStorage.getItem('me')){      
    document.getElementById("popup-base-message").innerHTML = '<strong>로그인 후 글을 쓰실 수 있어요.</strong>';
    $("#popup-base-ok").attr('onclick', "location.href='../login/login.html'");  
    layerPopup.openPopup('popup-base');    
  }else if(JSON.parse(window.localStorage.getItem('me')).schoolId== null && (menu == 'voice' || menu == 'proposal')){
    document.getElementById("popup-base-message").innerHTML = '<strong>대학생 인증 후 글을 쓰실 수 있어요.</strong>';
    $("#popup-base-ok").attr('onclick', "location.href='../mypage/update-profile.html'");
    layerPopup.openPopup('popup-base');  
  }else{
    if(menu == 'voice') location.href = '../voice/register.html';
    else if(menu == 'proposal') location.href = '../proposal/proposal.html';
    else if(menu == 'report') location.href = '../report/report.html';
  }      
}