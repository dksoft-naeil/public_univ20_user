document.addEventListener("DOMContentLoaded", () => {
  if(accessToken && refreshToken) login(refreshToken);
  if(window.location.pathname.indexOf("/login/login") >= 0) getLogin();
});

/// 로그인 로그아웃 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function login(refreshToken = null) {
  // event.preventDefault();
  let url = baseUrl + "/oauth/token";
  let grant_type = refreshToken ? 'refresh_token' : 'password';
  let login_username = document.getElementById("id").value;;
  let login_password = document.getElementById("password").value;;

  let params = {
      grant_type: grant_type,
      username: login_username,
      password: login_password,
      refresh_token: refreshToken,
      client_id: client_id,
      client_secret: client_secret
  }
  const loginRequest = new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",  
    },
    body: JSON.stringify(params),
  });

  async function post(request) {
    try {
     await fetch(request)
     .then(response => {
        return response.json();        
     })
     .then(data => {

      let authToken = data;

      if(authToken.message == 'resource_not_found'){
        document.getElementById("warningId").innerHTML = '※ 아이디가 일치하지 않습니다.';
      }else if(authToken.message == 'authorization_required'){
        document.getElementById("warningPassword").innerHTML = '※ 비밀번호가 일치하지 않습니다.';
      }else{
        window.localStorage.setItem('accessToken', authToken.access_token);
        window.localStorage.setItem('refreshToken', authToken.refresh_token);       
        window.localStorage.setItem('loginType', 'email');
        //window.localStorage.setItem('loginPwd', login_password);
        getMeInfo(authToken.access_token);      
        isLogined = true;

        if(document.getElementById('checkbox-id').checked == true){
          window.localStorage.setItem('loginId', login_username);
        }else{
          window.localStorage.setItem('loginId', '');
        }
      }
     
    })
    
    } catch (error) {
      console.error("Error:", error);
    }      
  }

  post(loginRequest);
}

function authSNS(type='NAVER' /* NAVER , KAKAO */){
  univAccount.authSNS('UNIV20',type,'LOGIN','./login.html',window.location.origin.indexOf('localhost') >= 0 || window.location.origin.indexOf('dev') >= 0);
}

function snsLogin(snsType, loginId, naeilAuthGuid) {
  // event.preventDefault();
  let url = baseUrl + "/oauth/naeil-sns/token";

  let params = {
      loginId: loginId,
      naeilAuthGuid: naeilAuthGuid,
      client_id: client_id,
      client_secret: client_secret
  }
  const loginRequest = new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",  
    },
    body: JSON.stringify(params),
  });

  async function post(request) {
    try {
     await fetch(request)
     .then(response => {
        return response.json();        
     })
     .then(data => {
      console.log(data);
      let authToken = data;
      console.log('authToken' + JSON.stringify(authToken));

      if(authToken.message == 'resource_not_found'){
        document.getElementById("warningId").innerHTML = '※ 아이디가 일치하지 않습니다.';
      }else if(authToken.message == 'authorization_required'){
        document.getElementById("warningPassword").innerHTML = '※ 비밀번호가 일치하지 않습니다.';
      }else{
        window.localStorage.setItem('accessToken', authToken.access_token);
        window.localStorage.setItem('refreshToken', authToken.refresh_token);
        //window.localStorage.setItem('loginPwd', login_password);
        window.localStorage.setItem('loginType', snsType.toLowerCase());
        getMeInfo(authToken.access_token);      
        isLogined = true;

        if(document.getElementById('checkbox-id').checked == true){
          window.localStorage.setItem('loginId', login_username);
        }else{
          window.localStorage.setItem('loginId', '');
        }
      }
    })
    } catch (error) {
      console.error("Error:", error);
    }      
  }

  post(loginRequest);
}

function enterLogin(e){
  if(e.keyCode==13){
    login()
  }
}

function getMeInfo(access_token) {
  let url = baseUrl + "/users/me";
  let header = { headers : {
    "Content-Type": "application/json", 
    "Authorization": 'Bearer ' + access_token}};    
  fetch(url,header)
  .then((response) => {
    checkError(response.status);
      response.json().then((meInfo) => {
        window.localStorage.setItem('me',JSON.stringify(meInfo.data.user))
        location.href='../main/main.html';
      })                    
    }).catch(error => console.log(error));
}

function getLogin(){
  if(window.location.href.indexOf("?") > 0){
    const url = new URL(window.location.href);
    const params = url.searchParams;

    if(params.get('result') && params.get('param')){
      let decString = '{data: decrypt string}';
      let response = JSON.parse(decString);

      // login
      if(response?.ReturnUrl.indexOf('login') >=0 ){
        if(response.AuthResult === 200){
          snsLogin(response.AuthGB, response.LoginID, response.UserGuid);
        }
        else {
          if(confirm('가입내역이 없습니다. 회원가입으로 이동하시겠습니까?'));
            window.location.href = '../join/sso.html';
        }
      }

      // join
      if(response?.ReturnUrl.indexOf('join') >=0 ){
        if(response.AuthResult === 200){
          window.location.href = '../join/create-info.html?sid=' + response.AuthSessionID; // + '&loginId=' + response.LoginID + '&name=' + response.Name + '&email=' + response.Email;
        }
        else if(response.AuthResult === 500){
          alert('이미 가입된 회원입니다. 로그인을 진행합니다.');
          setTimeout(() => {
            snsLogin(response.AuthGB, response.LoginID, response.UserGuid);
          }, 1000);
        }
        else{
          window.location.href = '../join/sso.html?error=' + response.AuthResult;
        }
      }
    }
  }
  else{
    
    let loginType = window.localStorage.getItem("loginType");

    if(loginType){
      if (window.localStorage.getItem("loginType") === 'email'){
        $("#emailLoginLabel").show();
        $("#naverLoginLabel").hide();
        $("#kakaoLoginLabel").hide();
      }
      else if (window.localStorage.getItem("loginType") === 'naver'){
        $("#emailLoginLabel").hide();
        $("#naverLoginLabel").show();
        $("#kakaoLoginLabel").hide();
  
      }
      else if (window.localStorage.getItem("loginType") === 'kakao'){
        $("#emailLoginLabel").hide();
        $("#naverLoginLabel").hide();
        $("#kakaoLoginLabel").show();
      }else{
        $("#emailLoginLabel").hide();
        $("#naverLoginLabel").hide();
        $("#kakaoLoginLabel").hide();
      }
    }else{
      $("#emailLoginLabel").hide();
      $("#naverLoginLabel").hide();
      $("#kakaoLoginLabel").hide();
    }
    
    if(window.localStorage.getItem('loginId')){
      document.getElementById("id").value = window.localStorage.getItem('loginId');
      document.getElementById("checkbox-id").checked = true;
    }
  }
}