document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/join/auth") >= 0) getAuth();
  else if(window.location.pathname.indexOf("/join/create-info") >= 0) getCreateInfo();
});

let sid = null;
let isCheckLoginId = false;
let isCheckPassword= false;
let isCheckNickname = false;
let isCheckPhone = false;

function getAuth(){  
  let key = '';
  let email= '';
  
  if(window.location.href.indexOf("?") > 0){
    const url = new URL(window.location.href);
    const params = url.searchParams;

    if(params.get('key') && params.get('email')){
      key = params.get('key')
      email = params.get('email')
    }
    else if(params.get('error')){
      alert('회원의 정보가 미확인 됩니다.');
      return;
    }
  }  

  if( email == window.localStorage.getItem("authEmail")){
    let url = baseUrl + "/code/confirm";      
  
    let params = {
      target: email,
      type: 2,
      key: key,
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
          location.href="../join/create-info.html?key="+key+"&email=" + email
        }
        
      }).catch(error => {  });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
}

function authSNS(type='NAVER' /* NAVER , KAKAO */){
  if(document.getElementById('checkbox').checked == false){
    document.getElementById("alertMessage").innerHTML = "<strong>동의해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('alertPopup', true);";
  }else{
    univAccount.authSNS('UNIV20',type,'SIGN','../join/create-info.html',window.location.origin.indexOf('localhost') >= 0 || window.location.origin.indexOf('dev') >= 0);
  }
}

function checkPw(){
  let password1 = $('#password1').val();
  let password2 = $('#password2').val();

  let valid_num = /[0-9]/;	                          // 숫자 
  let valid_eng = /[a-zA-Z]/;	                        // 문자 
  let valid_spc = /[~!@#$%^&*()+,-./;?\'\"_{}\[\]]/;  // 특수문자 
  //let unvalid_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;             // 한글체크
  let unvalid_chars = /[^a-zA-Z0-9~!@#$%^&*()+,-./;?\'\"_{}\[\]]/;
  if(!valid_num.test(password1) || !valid_eng.test(password1) || !valid_spc.test(password1) || unvalid_chars.test(password1) || password1.length < 8){
    return document.getElementById("pw-valid").innerHTML = "※ 사용 할 수 없는 비밀 번호 입니다.";
  }
  else {
    document.getElementById("pw-valid").innerHTML = "";
  }

  if(password1.length > 0 && password2.length > 0 && password1 !== password2){
    ocument.getElementById("pw-valid").innerHTML = "※ 비밀번호가 일치하지 않습니다.";
    isCheckPassword = false;
  }else{
    document.getElementById("pw-valid").innerHTML = "";
    isCheckPassword = true;
  }
} 

function postCodeGenerate() {  
  console.log(window.location.pathname.substring(0,5))
  document.getElementById("warning").innerHTML = "";
  let id = document.getElementById('id').value;
  let email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if(id.length == 0){
    document.getElementById("alertMessage").innerHTML = "<strong>아이디(이메일)를 입력해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('alertPopup', true);";
  }else if(!email_regex.test(id)){
    document.getElementById("warning").innerHTML = "※ 올바르지 않은 이메일 형식입니다.";
  }else{
    let url = baseUrl + "/user/exists";  
    
    let params = {
      loginId: id,      
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

        if(response.data.exists == true){
          document.getElementById("warning").innerHTML = "※ 이미 가입되어 있는 이메일 주소입니다.";
        }else{
          if(document.getElementById('checkbox').checked == false){
            document.getElementById("alertMessage").innerHTML = "<strong>동의해 주세요.</strong>";
            location.href= "javascript:layerPopup.openPopup('alertPopup', true);";
          }else{
            let url = baseUrl + "/code/generate";  
            
            let params = {
              target: id,
              type: 2,      
              callbackUrl : appPath + '/html/views/join/auth.html',
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
                window.localStorage.setItem('authEmail', id);
                
                document.getElementById("mailInfoAlertMessage").innerHTML = "<strong>" + id.substring(0, 1) + '****' + id.substring(5, id.length)+ "(으)로<br />인증 메일이 발송되었습니다.</strong>";
                location.href= "javascript:layerPopup.openPopup('mailInfoAlertPopup', true);";
              }).catch(error => {if(error.message === '401') logout() });
              
              } catch (error) {
                console.error("Error:", error);
              }      
            }
        
            post(requestPost);
          }
        }      

      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
}

function getCreateInfo() {  
  let htmlYear = "";
  let htmlMonth = "";
  let htmlDate = "";
  
  if(window.location.href.indexOf("?") > 0){
    const url = new URL(window.location.href);
    const params = url.searchParams;

    // general
    if(params.get('key') && params.get('email')){
    
      document.getElementById("idForm").innerHTML = '<label for="id" class="form-label">아이디(이메일)</label>'
        + '<input type="text" id="id" name="id" title="아이디" class="form-input" autocomplete="off" readonly value="univ20official@univ.me" />';

      $('#id').attr('value', params.get('email'));
      $('#email').attr('value', params.get('email'));
      isCheckLoginId = true;
    }

    // sns 
    else if(params.get('sid')){
      document.getElementById("idForm").innerHTML ='<label for="id" class="form-label">아이디(이메일)</label>'
        + '<div class="form-btn-with-container">'
        + '<input type="text" id="id" name="id" title="아이디" class="form-input" autocomplete="off" placeholder="univ20@univ.me" onchange="onCheckLoginId()"/>'
        + '<button type="button" class="btn medium bg-wh" onclick="checkLoginId()">중복 확인</button>'
        + '</div>'
        + '<div class="form-guide-text font warning" id="id-valid"></div>';

      sid = params.get('sid');
      isCheckLoginId = false;
    }
  }  

  htmlYear+=`<option value="">생년</option> `;
  let thisYear = new Date().getFullYear() -19;
  for(let i = thisYear; i >=1955  ; i--){
    htmlYear+= `<option value="${i}">${i}년</option> `;        
  }

  htmlMonth+=`<option value="">월</option> `;
  for(let i = 1; i <=12  ; i++){
    htmlMonth+= `<option value="${i.toString().padStart(2, '0')}">${i}월</option> `;        
  }

  htmlDate+=`<option value="">일</option> `;     
  for(let i = 1; i <=31  ; i++){
    htmlDate+= `<option value="${i.toString().padStart(2, '0')}">${i}일</option> `;        
  }

  document.getElementById('htmlYear').innerHTML  = htmlYear; 
  document.getElementById('htmlMonth').innerHTML  = htmlMonth;  
  document.getElementById('htmlDate').innerHTML  = htmlDate;   

}

function onCheckLoginId(){
  let loginId = document.getElementById("id").value;
  let email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if(!email_regex.test(loginId))
    document.getElementById("id-valid").innerHTML = "※ 올바르지 않은 이메일 형식입니다.";
  else 
    document.getElementById("id-valid").innerHTML = "";
}

function checkLoginId(){
  isCheckLoginId = false;
  let url = baseUrl + "/user/exists";  
  let loginId = document.getElementById("id").value;
  let client_id = '';
  let client_secret = '';

  let email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if(loginId.length == 0){
    document.getElementById("alertMessage").innerHTML = "<strong>아이디(이메일)를 입력해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('alertPopup', true);";
    return;
  }else if(!email_regex.test(loginId)){
    document.getElementById("id-valid").innerHTML = "※ 올바르지 않은 이메일 형식입니다.";
    return;
  }
  
  if(loginId.length > 0){
    let params = {
      loginId: loginId,
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
            document.getElementById("alertMessage").innerHTML = "<strong>이미 사용중인 아이디입니다.<br />다른 아이디을 입력해 주세요.</strong>";
            location.href= "javascript:layerPopup.openPopup('alertPopup', true);";
          }else{
            document.getElementById("alertMessage").innerHTML = "<strong>사용할 수 있는 아이디 입니다.</strong>";          
            location.href= "javascript:layerPopup.openPopup('alertPopup', true);";
            isCheckLoginId = true;
          }
        }).catch(error => {if(error.message === '401') logout() });
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
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
    else document.getElementById("pw-valid").innerHTML = "";
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

function checkNickname(){
  isCheckNickname = false;
  let url = baseUrl + "/user/exists";  
  let nickname = document.getElementById("nickname").value;
  let client_id = '';
  let client_secret = '';
  
  if(nickname.length > 0){
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
          document.getElementById("alertMessage").innerHTML = "<strong>이미 사용중인 닉네임입니다.<br />다른 닉네임을 입력해 주세요.</strong>";
          location.href= "javascript:layerPopup.openPopup('alertPopup', true);";
        }else if(checkBanWord(nickname)){
          document.getElementById("alertMessage").innerHTML = "<strong>올바르지 않은 닉네임입니다.<br />다른 닉네임을 입력해 주세요.</strong>";
          location.href= "javascript:layerPopup.openPopup('alertPopup', true);";
        }else{
          isCheckNickname = true;
          document.getElementById("alertMessage").innerHTML = "<strong>사용할 수 있는 닉네임 입니다.</strong>";          
          location.href= "javascript:layerPopup.openPopup('alertPopup', true);";}
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
}

function getCodesPhone(){
  isCheckPhone = false;
  let url = baseUrl + "/code/generate";  
  let phone = document.getElementById("phone").value;
  
  if(phone.length > 0){
    phone = phone.replaceAll('-', '').replaceAll('.', '');
    let params = {
      target: phone,
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
        document.getElementById("alertMessage").innerHTML = "<strong> " + phone.substring(0, 3) + '-****-' + phone.substring(7)+"로</br>인증 번호가 발송되었습니다.</strong>";      
        location.href= "javascript:layerPopup.openPopup('alertPopup', true);";        
      }).catch(error => {if(error.message === '401') logout() });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
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
            isCheckPhone = true;
            document.getElementById("alertMessage").innerHTML = "<strong>연락처가 인증되었습니다.</strong>";
            document.getElementById('checkphone-button').innerHTML = '인증완료';
            document.getElementById('checkphone-button').disabled= true;
            location.href= "javascript:layerPopup.openPopup('alertPopup', true);";      
        }
      }).catch(error => { 
        document.getElementById("alertMessage").innerHTML = "<strong>올바른 인증 번호를 입력해 주세요.</strong>";
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

function getCodesSchool(){
  let url = baseUrl + "/code/generate";  
  let schoolmail = document.getElementById("schoolmail").value;
  
  if(schoolmail.length > 0){
    let params = {
      target: schoolmail,
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
        document.getElementById("alertMessage").innerHTML = "<strong> " + schoolmail.substring(0, 1) + '****' + schoolmail.substring(5, schoolmail.length)+"로</br>인증 번호가 발송되었습니다.</br>받지 못하셨다면, 스팸함도 확인해 주세요.</strong>";
        location.href= "javascript:layerPopup.openPopup('alertPopup', true);";        
      }).catch(error => {if(error.message === '401') logout() });
      
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
                  document.getElementById("alertMessage").innerHTML = "<strong>학교 메일이 인증되었어요.</strong>";
                  document.getElementById('checkschool-button').innerHTML = '인증완료';
                  document.getElementById('checkschool-button').disabled= true;
                  location.href= "javascript:layerPopup.openPopup('alertPopup', true);";      
                }else{
                  document.getElementById("alertMessage").innerHTML = "<strong>올바른 인증 번호를 입력해 주세요.</strong>";
                  location.href= "javascript:layerPopup.openPopup('alertPopup', true);";    
                }                
              })                    
            }).catch(error => console.log(error));
        }
        
      }).catch(error => { 
        console.log(error)
        document.getElementById("alertMessage").innerHTML = "<strong>올바른 인증 번호를 입력해 주세요.</strong>";
        location.href= "javascript:layerPopup.openPopup('alertPopup', true);";     });
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
}

function postUserRegister() {
  if(document.getElementById("id").value.length === 0){
    document.getElementById("alertMessage").innerHTML = "<strong>아이디를 입력해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('alertPopup', true);";      
    return;
  }

  if(document.getElementById("name").value.length === 0){
    document.getElementById("alertMessage").innerHTML = "<strong>이름을 입력해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('alertPopup', true);";      
    return;
  }
  
  if(document.getElementById("htmlYear")?.value?.length === 0 || document.getElementById("htmlMonth")?.value?.length  === 0|| document.getElementById("htmlDate")?.value?.length === 0 ){
    document.getElementById("alertMessage").innerHTML = "<strong>생년월일을 입력해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('alertPopup', true);"; 
    return;   
  }

  if(document.getElementById("password1").value.length == 0 || document.getElementById("password2").value.length == 0 ){
    document.getElementById("alertMessage").innerHTML = "<strong>비밀번호를 입력해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('alertPopup', true);"; 
    return;     
  }
  else if(document.getElementById("password1").value != document.getElementById("password2").value ){
    document.getElementById("alertMessage").innerHTML = "<strong>비밀번호가 일치하지 않습니다.</strong>";
    location.href= "javascript:layerPopup.openPopup('alertPopup', true);";
    return;      
  }

  if(document.getElementById("nickname").value.length == 0 ){
    document.getElementById("alertMessage").innerHTML = "<strong>닉네임을 입력해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('alertPopup', true);";    
    return;  
  }

  if(document.getElementById("email").value.length == 0 ){
    document.getElementById("alertMessage").innerHTML = "<strong>이메일을 입력해 주세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('alertPopup', true);"; 
    return;     
  }

  if(document.getElementById("phone").value.length == 0 ){
     document.getElementById("alertMessage").innerHTML = "<strong>연락처를 입력해 주세요.</strong>";
     location.href= "javascript:layerPopup.openPopup('alertPopup', true);";    
     return;  
  }

  if(!isCheckLoginId){
    document.getElementById("alertMessage").innerHTML = "<strong>아이디(메일) 중복 확인을 하세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('alertPopup', true);";      
    return;
  }

  if(!isCheckNickname){
    document.getElementById("alertMessage").innerHTML = "<strong>닉네임 중복 확인을 하세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('alertPopup', true);";      
    return;
  }

  if(!isCheckPhone){
    document.getElementById("alertMessage").innerHTML = "<strong>연락처 인증을 하세요.</strong>";
    location.href= "javascript:layerPopup.openPopup('alertPopup', true);";      
    return;
  }

  //check school
  if(document.getElementById('schoolid').value.length > 0){
    let url = baseUrl + "/schools?name=" + document.getElementById('schoolid').value;  

    fetch(url, headers.json_headers)
    .then((response) => {
        checkError(response.status);
        response.json().then((response) => {

          let schoolId = response.data?.schools[0]?.id ? response.data?.schools[0]?.id : null;
          let schoolEmail = response.data?.schools[0]?.id ? document.getElementById("schoolmail").value : null;
          resister(schoolId, schoolEmail);

        })                    
    }).catch(error => console.log(error));
  }
  else resister(null,null);

  function resister(schoolId, schoolEmail){
    let client_id = '';
    let client_secret = '';

    let url = baseUrl + "/user/register"; 
    
    let params = {            
      loginId: document.getElementById("id").value,
      loginPwd: document.getElementById("password2").value,
      snsId: sid,
      name : document.getElementById("name").value,
      birth :document.getElementById("htmlYear").value + document.getElementById("htmlMonth").value + document.getElementById("htmlDate").value,
      nickname : document.getElementById("nickname").value,
      email : document.getElementById("email").value,            
      instagramUrl :(document.getElementById("instargram")?.value?document.getElementById("instargram")?.value:''),
      youtubeUrl :(document.getElementById("youtube").value?document.getElementById("youtube")?.value:''),
      byLine :document.getElementById("byline-radio-0").checked?0:document.getElementById("byline-radio-1").checked?1:document.getElementById("byline-radio-2").checked?2:3,
      mobile : document.getElementById("phone").value.replaceAll('-', ''),
      schoolId : schoolId,
      schoolEmail : schoolEmail,
      client_id : client_id,
      client_secret : client_secret
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
        
        if(croppedFile){
          url = baseUrl + "/user/init-profile-image"; 

          let formData = new FormData();
          formData.append('loginId', document.getElementById("id").value);
          formData.append('name', document.getElementById("name").value);                
          formData.append('client_id', client_id);
          formData.append('client_secret',client_secret);
          if(croppedFile) formData.append("file", croppedFile, croppedFile.name);

          async function post(request) {
            try {
              await fetch(request).then(response => {
                  if(response.status === 200) {  // No content                          
                    location.href="../join/complete.html";
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

        }else{
          location.href="../join/complete.html";
        }

      }).catch(error => {   console.error("Error:", error);});
      
      } catch (error) {
        console.error("Error:", error);
      }      
    }

    post(requestPost);
  }
}