document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/main/main") >= 0) getMain();
  else if(window.location.pathname.indexOf("/main/detail") >= 0) getDetail();
});

window.addEventListener("load",() => {
  if(window.location.pathname.indexOf("/main/main") >= 0){
  // youtube
  setTimeout(()=>{
    $scrItem = $('.scroll-item');

    // 쇼츠 비디오  
    for (var i = 0; i < $scrItem.length; i++) {
      scrIWidth += $scrItem.eq(i).outerWidth();
    }
    
    $('.drag-scroll-box').css('width', scrIWidth);
    $scrItem.click(function() {
      var _winH = $(window).outerHeight();
      var _sct = $(window).scrollTop();
      var _offset = $('.drag-scroll-box-wrap').offset().top + $('.scroll-item').outerHeight() / 1.2;
        
      var target = $(this);
      itemIndex = target.index();
      if (!target.hasClass('on')) {
        stopVideo();
        unMute(target);
        playVideo(target);
      } else {
        unMute(target);
        
        if (_sct + _winH > _offset + $('.drag-scroll-box-wrap').outerHeight() / 2 == true) {
          stopVideo();
          unMute(target);
          playVideo(target);
        }
      }
      $scrItem.removeClass('on');
      target.addClass('on');
      muCenter(target);
    });

    // 쇼츠 비디오 prev 버튼
    $('.video-content-box .prev-btn').click(function() {
      var target = $('.drag-scroll-box .scroll-item.on');
      var targetPrev = $('.drag-scroll-box .scroll-item.on').prev();
      itemIndex = targetPrev.index();

      if (targetPrev.length > 0) {
        videoControlBtn(targetPrev, itemIndex);
      }
    });

    // 쇼츠 비디오 next 버튼
    $('.video-content-box .next-btn').click(function() {
      var target = $('.drag-scroll-box .scroll-item.on');
      var targetNext = $('.drag-scroll-box .scroll-item.on').next();
      itemIndex = targetNext.index();

      if (targetNext.length > 0) {
        videoControlBtn(targetNext, itemIndex);
      }
 
    });

    // 유튜브 script
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 제보하기 위젯
    window.floatingBoxHandler(); 

    
    if (!$('.floating-box').length) return;

    // 닫기 버튼
    $('.floating-box .close-btn').on('click', function () {
      $(this).closest('.floating-box').removeClass('show');
      $(this).closest('.floating-box').addClass('close');
    });

    // 제보하기 위젯
   
      let endOffset = Math.floor($('#footer').offset().top + $('#footer').innerHeight() / 2 - $(window).innerHeight());

      scrollfloatingFn();

      $(window).on('scroll', function () {
        // close 클래스가 있다면 실행 X
        if (!$('.floating-box-widget').hasClass('close')) {
          scrollfloatingFn();
        }
      });

      function scrollfloatingFn() {
        var _sct = $(window).scrollTop();

        if (_sct > 50) {
          $('.floating-box-widget').addClass('show');
        } else {
          $('.floating-box-widget').removeClass('show');
        }

        if (_sct >= endOffset) {
          $('.floating-box-widget').removeClass('show');
        }
      }
   

    
    window.sliderUpdate();
  },100);
  }
});

function getMain(page=1){ 
  // 하이라이트
  let url = baseUrl + "/mains?state=0&category=0";    
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let html= "";
      
      let data = response.data.mains;
      
      if(data.length > 0){
      
      html=`
      <a href="${data[0]?.link}">
      <div class="image-box">
        ${data[0].file?'<img src="'+data[0].file+'" alt="썸네일" />':''}
          </div>
          <div class="text-box">
            <div class="subject">${data[0]?.title}</div>
            <div class="text">${data[0]?.summary}</div>
          </div></a>`;              

      document.getElementById('mains-highlight').innerHTML = html; 
      //$("#mains-highlight").append(html);
      }          
    })                    
  }).catch(error => console.log(error));
    // 지금 많이 보는 글
    url = baseUrl + "/main/popularities";    
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((response) => {
        let date= "";
        let list= "";
        let data = response.data.popularities;

        date = `${new Date().getFullYear()}. ${new Date().getMonth()+1}. ${new Date().getDate()}. ${new Date().getHours()}:00 기준`;
        
        for(let i = 0; i<data.length ; i++){
        list+=`<div class="number-list-box-item">
                <a href="../community/detail.html?id=${data[i]?.id}&isRanking=1" class="number-list-box-item-btn">
                  <em class="number">${i+1}</em>
                  <div class="text">${data[i]?.title}</div>
                </a>
              </div>`;              
        }          

        document.getElementById('mains-communities-date').innerHTML  = date;          
        document.getElementById('mains-communities-list').innerHTML  = list;          
      })                    
    }).catch(error => console.log(error));

  // 추천! 캠퍼스 에디터 기사
  url = baseUrl + "/mains?state=0&category=1";    
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let html= "";
      let data = response.data.mains;
      
      for( let i = 0;  i < data.length ; i++){
        if(data[i]?.subCategory == 1){
        html+=`<div class="article-info-box">
                <a href="${data[i]?.link}" class="article-info-box-btn">
                  <div class="image-box">
                  ${data[i].voiceMagazine.file?'<img src="'+data[i]?.voiceMagazine?.file+'" alt="썸네일" />':''}
                  </div>
                  <div class="text-box">
                    <div class="subject">
                    ${data[i]?.voiceMagazine?.title}
                    </div>
                    <div class="text">${data[i]?.voiceMagazine?.summary}</div>
                    <div class="info">
                      <div class="writer"><span class="name">${data[i]?.voiceMagazine?.nickname}</span> 캠퍼스 에디터</div>
                      <div class="date">${dateToStrCharacterLength(strToDate(data[i]?.voiceMagazine?.createDate), '.', 10)}</div>
                    </div>
                  </div>
                </a>
              </div>`;     
        }else{
          html+=`<div class="article-info-box">
          <a href="${data[i]?.link}" class="article-info-box-btn">
            <div class="image-box">
            ${data[i].magazine.file?'<img src="'+data[i]?.magazine?.file+'" alt="썸네일" />':''}
            </div>
            <div class="text-box">
              <div class="subject">
              ${data[i]?.magazine?.title}
              </div>
              <div class="text">${data[i]?.magazine?.summary}</div>
              <div class="info">
                <div class="writer"><span class="name">${data[i]?.magazine?.nickname}</span> 캠퍼스 에디터</div>
                <div class="date">${dateToStrCharacterLength(strToDate(data[i]?.magazine?.createDate), '.', 10)}</div>
              </div>
            </div>
          </a>
        </div>`;      
        }    
      }     

      document.getElementById('mains-voice').innerHTML  = html;                  
    })                    
  }).catch(error => console.log(error));

  // 대학생이 만든 매거진
  url = baseUrl + "/mains?state=0,3&category=2&status=ongoing";    
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let htmlTitle= "";
      let htmlThumb= "";
      let htmlContent= "";
      let data = response.data.mains;         

      if(data.length > 0){
        htmlTitle = data[0]?.summary;
        htmlThumb = `<a href="../main/detail.html?id=${data[0]?.linkId}">
            <!-- 웹진 썸네일 통 이미지 영역 -->
            ${data[0].story.workFile?'<img src="'+data[0].story.workFile+'" alt="웹진 썸네일" />':data[0].story.file?'<img src="'+data[0].story.file+'" alt="웹진 썸네일" />':data[0].story.cover?'<img src="'+data[0].story.cover+'" alt="웹진 썸네일" />':''}
          </a>`;

        if(data[0]?.voices.length > 0){
          for(let i=0;i<data[0]?.voices.length;i++){
            htmlContent+= `<div class="swiper-slide">
                <div class="article-info-box">
                  <a href="../voice/detail.html?id=${data[0]?.voices[i].id}" class="article-info-box-btn">
                    <div class="image-box">
                      ${data[0]?.voices[i].file?'<img src="'+data[0]?.voices[i].file+'" alt="썸네일" />':''}
                    </div>
                    <div class="text-box">
                      <div class="subject">${data[0]?.voices[i]?.title}</div>
                      <div class="text">${data[0]?.voices[i]?.summary}</div>
                      <div class="date">${dateToStrCharacterLength(strToDate(data[0]?.voices[i]?.createDate), '.', 10)}</div>
                    </div>
                  </a>
                </div>
              </div>`
          }         
        }
        
        document.getElementById('mains-story-title').innerHTML  = htmlTitle;         
        document.getElementById('mains-story-thumb').innerHTML  = htmlThumb;       
        document.getElementById('mains-story-content').innerHTML  = htmlContent;               
        }
      })                    
    }).catch(error => console.log(error));

  // 캘린더
  let now = new Date();
  let startTime = new Date();
  let d1End  = new Date();
  let d2Start  = new Date();
  let d2End = new Date();
  let d3Start = new Date();
  let endTime = new Date();
  
  startTime.setDate(now.getDate());
  startTime.setHours(0);
  startTime.setMinutes(0);
  startTime.setSeconds(0);

  d1End.setDate(now.getDate());  
  d1End.setHours(23);
  d1End.setMinutes(59);
  d1End.setSeconds(59);

  d2Start.setDate(now.getDate()  + 1);  
  d2Start.setHours(0);
  d2Start.setMinutes(0);
  d2Start.setSeconds(0);

  d2End.setDate(now.getDate()  + 1);  
  d2End.setHours(23);
  d2End.setMinutes(59);
  d2End.setSeconds(59);

  d3Start.setDate(now.getDate()  + 2);  
  d3Start.setHours(0);
  d3Start.setMinutes(0);
  d3Start.setSeconds(0);

  endTime.setDate(now.getDate()+2);
  endTime.setHours(23);
  endTime.setMinutes(59);
  endTime.setSeconds(59);

  url = baseUrl + "/schedules?state=0,3&startDate=" + new Date().toISOString() + "&startTime=" + startTime.toISOString() + "&endTime=" + endTime.toISOString();     
  
  let today = `${new Date().getFullYear()}년 ${new Date().getMonth()+1}월 ${new Date().getDate()}일`

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {       
      let data = response.data.schedules;
      let htmlPcToday= "";
      let htmlMobileToday= "";
      let htmlPc1d= "";
      let htmlMobile1d= "";
      let htmlPc2d= "";
      let htmlMobile2d= "";
      let countToday = 0;
      let count1d = 0;
      let count2d = 0;

      for(let i=0;i<data.length ;i++){
        if(data[i].startTime <= d1End.toISOString() &&  startTime.toISOString() <= data[i].endTime && countToday < 2){
          htmlPcToday += 
              `<a href="../schedule/schedule.html" class="schedule">
                <div class="icon-box ${data[i].category == 0 ?'icon-univ': data[i].category == 1 ?'icon-smile' : 'icon-check'}"></div>
                <div class="text-box">
                  <div class="text">${data[i].title}</div>
                  <div class="time">${data[i].isAllDay==1?'하루종일' : dateToStrHhmm(strToDate(data[i].startTime))}</div>
                </div>
              </a>`;

          htmlMobileToday += `<a href="../schedule/schedule.html" class="schedule">
                            <div class="icon-box ${data[i].category == 0 ?'icon-univ': data[i].category == 1 ?'icon-smile' : 'icon-check'}"></div>
                            <div class="text-box">
                              <div class="text">${data[i].title}</div>
                              <div class="time">${data[i].isAllDay==1?'하루종일' : dateToStrHhmm(strToDate(data[i].startTime))}</div>
                            </div>
                          </a>`;
          countToday++;
        }
        if(data[i].startTime <= d2End.toISOString() &&  d2Start.toISOString() <= data[i].endTime  && count1d < 2){
          htmlPc1d += 
              `<a href="../schedule/schedule.html" class="schedule">
                <div class="icon-box ${data[i].category == 0 ?'icon-univ': data[i].category == 1 ?'icon-smile' : 'icon-check'}"></div>
                <div class="text-box">
                  <div class="text">${data[i].title}</div>
                  <div class="time">${data[i].isAllDay==1?'하루종일' : dateToStrHhmm(strToDate(data[i].startTime))}</div>
                </div>
              </a>`;

          htmlMobile1d += `<a href="../schedule/schedule.html" class="schedule">
                        <div class="icon-box ${data[i].category == 0 ?'icon-univ': data[i].category == 1 ?'icon-smile' : 'icon-check'}"></div>
                        <div class="text-box">
                          <div class="text">${data[i].title}</div>
                          <div class="time">${data[i].isAllDay==1?'하루종일' : dateToStrHhmm(strToDate(data[i].startTime))}</div>
                        </div>
                      </a>`;
          count1d++;
        }
        if(data[i].startTime <= endTime.toISOString() &&  d3Start.toISOString() <= data[i].endTime  && count2d < 2){
          htmlPc2d += 
              `<a href="../schedule/schedule.html" class="schedule">
                <div class="icon-box ${data[i].category == 0 ?'icon-univ': data[i].category == 1 ?'icon-smile' : 'icon-check'}"></div>
                <div class="text-box">
                  <div class="text">${data[i].title}</div>
                  <div class="time">${data[i].isAllDay==1?'하루종일' : dateToStrHhmm(strToDate(data[i].startTime))}</div>
                </div>
              </a>`;

          htmlMobile2d += `<a href="../schedule/schedule.html" class="schedule">
                        <div class="icon-box ${data[i].category == 0 ?'icon-univ': data[i].category == 1 ?'icon-smile' : 'icon-check'}"></div>
                        <div class="text-box">
                          <div class="text">${data[i].title}</div>
                          <div class="time">${data[i].isAllDay==1?'하루종일' : dateToStrHhmm(strToDate(data[i].startTime))}</div>
                        </div>
                      </a>`;
          count2d++;
        }   
        
        if(i == data.length -1){
          if(htmlPcToday.length == 0){
            htmlPcToday += `<div class="schedule">
              <span class="text">등록된 일정이 없습니다.</span>
            </div>`;
            htmlMobileToday += `<div class="schedule">
              <span class="text">등록된 일정이 없습니다.</span>
            </div>`;
          }
          if(htmlPc1d.length == 0){
            htmlPc1d += `<div class="schedule">
                <span class="text">등록된 일정이 없습니다.</span>
              </div>`;
            htmlMobile1d += `<div class="schedule">
                <span class="text">등록된 일정이 없습니다.</span>
              </div>`;
          }
          if(htmlPc2d.length == 0){
            htmlPc2d += `<div class="schedule">
                <span class="text">등록된 일정이 없습니다.</span>
              </div>`;
            htmlMobile2d += `<div class="schedule">
                <span class="text">등록된 일정이 없습니다.</span>
              </div>`;
          }
        }
      }        

      document.getElementById('schedule-date-pc').innerHTML  = today; 
      document.getElementById('schedule-date-mobile').innerHTML  = today; 
      document.getElementById('schedule-today-pc').innerHTML  = htmlPcToday; 
      document.getElementById('schedule-today-mobile').innerHTML  = htmlMobileToday;   
      document.getElementById('schedule-1d-pc').innerHTML  = htmlPc1d; 
      document.getElementById('schedule-1d-mobile').innerHTML  = htmlMobile1d;   
      document.getElementById('schedule-2d-pc').innerHTML  = htmlPc2d; 
      document.getElementById('schedule-2d-mobile').innerHTML  = htmlMobile2d;   
    })                    
  }).catch(error => console.log(error));

  // 최신 기사
  let newsSize =6
  url = baseUrl + "/main/news?offset=0&limit="+(page*newsSize);       

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {       
      let data = response.data.news;
      let total = response.data.total;          

      let html= ""; 
      let paging = "";       
              
      for(let i=0; i<data.length ; i++){
        html += 
            `<div class="article-info-box">
            <a href="../${data[i]?.newsType === 'voice' ? 'voice/detail' : 'magazine/feature'}.html?id=${data[i]?.id}" class="article-info-box-btn">
              <div class="image-box">
              ${data[i].file?'<img src="'+data[i].file+'" alt="썸네일" />':''}
              </div>
              <div class="text-box">
                <div class="subject">${data[i]?.title}</div>
                <div class="text">${data[i]?.summary}</div>
                <div class="info">
                  <div class="writer"><span class="name">${data[i]?.name}</span> 에디터</div>
                  <div class="date">${dateToStrCharacterLength(strToDate(data[i]?.date), '.', 10)}</div>
                </div>
              </div>
            </a>
          </div>`;
      }    
      
      if(total > page*newsSize){
        paging = `<button type="button" class="btn medium bg-g4 full" onclick="getMainMore(${(page+1)})">더보기</button>`;
      }          

      document.getElementById('news').innerHTML  = html; 
      document.getElementById('news-paging').innerHTML  = paging; 
    })                    
  }).catch(error => console.log(error));
  // 배너
  url = baseUrl + "/banners?category=0&state=0,3&offset=0&limit=999&startDate=" + new Date().toISOString()+ "&endDate=" + new Date().toISOString();   
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let html= "";
      
      let data = response.data.banners;

      if(data.length > 0){
        let index =  Math.floor(Math.random() * ((data.length)));

        html=`<a href="${data[index].href}" target="_blank" class="banner-link" onclick="getMain()"></a>
          <div class="banner">
          ${data[index].file1?'<img src="'+data[index].file1+'" class="pc-show" alt="광고 배너" />':''}
          ${data[index].file2?'<img src="'+data[index].file2+'" class="mobile-show" alt="광고 배너" />':''}
          </div>`;          
      }    

      document.getElementById('banners').innerHTML  = html;                    
    })                    
  }).catch(error => console.log(error));
  // 많이 본 대학내일 영상
  url = baseUrl + "/mains?state=0&category=3&status=ongoing";    
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((response) => {

        let htmlContent= "";
        let data = response.data.mains;         
      
        for(let i=0; i<data.length ; i++){     
          htmlContent += `<div class="scroll-item${i==0 ? ' on' : ''}" data-video-id="${data[i].link.substring(data[i].link.lastIndexOf('/')+1)}" onclick="mainShow(${data[i].id})">
            <div class="masking">${data[i].file?'<img src="'+data[i].file+'" alt="cover image" />':''}</div>
            <div class="video-content">
              <div class="player"></div>
            </div>
          </div>`;
        } 
        document.getElementById('mains-youtube').innerHTML  = htmlContent; 
      })                    
    }).catch(error => console.log(error));

  let login = "";

  //console.log('main')
  //console.log(accessTokenGuest)
  //console.log(accessToken)

  if(!accessToken || accessTokenGuest == accessToken){
    login = `<div class="menu-box-item">
              <a href="#" onclick="href='../login/login.html'">로그인</a>
            </div>
            <div class="menu-box-item">
              <button type="button" class="dark-mode-btn">
                <i class="icon-box icon-moon"></i>
                <i class="icon-box icon-sun"></i>
                다크/라이트 모드
              </button>
            </div>
            <div class="menu-box-item">
              <button type="button" class="search-control-btn">
                <i class="icon-box icon-search-black"></i>
                <i class="icon-box icon-search-white"></i>
                검색
              </button>
            </div>`;
  }else{
    login = `<div class="menu-box-item">
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
                다크/라이트 모드
              </button>
            </div>
            <div class="menu-box-item">
              <button type="button" class="search-control-btn">
                <i class="icon-box icon-search-black"></i>
                <i class="icon-box icon-search-white"></i>
                검색
              </button>
            </div>`;
  }
  document.getElementById('login').innerHTML = login;

  if(new Date(window.localStorage.getItem("main-popup")) < new Date()){
    url = baseUrl + "/popups?state=0,3&limit=1&startDate=" + new Date().toISOString()+ "&endDate=" + new Date().toISOString();       
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((response) => {
        let data = response.data.popups;         

        if(data.length > 0 && data[0].category == 0){
          document.getElementById("infoTextPopupTitle").innerHTML = "<strong>" + data[0].title + "</strong>";
          document.getElementById("infoTextPopupMessage").innerHTML = data[0]?.content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />");
          document.getElementById("infoTextPopupButton").innerHTML = `<button type="button" class="btn btn-ok popup-close"  onclick="popupCheck()">확인</button>`
          location.href= "javascript:layerPopup.openPopup('infoTextPopup', true);";
        }else if(data.length > 0){
          document.getElementById("imageTextPopupMessage").innerHTML = "<strong>" + data[0].title + "</strong>";
          document.getElementById("imageTextPopupImg").innerHTML = `<a href='${data[0].href}'><img src="${data[0].file}" alt=""/></a>`;
          document.getElementById("imageTextPopupButton").innerHTML = `<button type="button" class="btn btn-ok popup-close"  onclick="popupCheck()">확인</button>`
          location.href= "javascript:layerPopup.openPopup('imageTextPopup', true);";
        }
      })                    
    }).catch(error => console.log(error));
  }
  
  if(new Date(window.localStorage.getItem("floating-report")) > new Date() && document.getElementById("floating-report")){    
    document.getElementById("floating-report").style.display = 'none';
  }

  if(new Date(window.localStorage.getItem("floating-proposal")) > new Date() && document.getElementById("floating-proposal")){
    document.getElementById("floating-proposal").style.display = 'none';
  }
}

function getMainMore(page=1){ 
  
  // 최신 기사
  let newsSize =6
  url = baseUrl + "/main/news?offset=0&limit="+(page*newsSize);       

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {       
      let data = response.data.news;
      let total = response.data.total;          

      let html= ""; 
      let paging = "";       
              
      for(let i=0; i<data.length ; i++){
        html += 
            `<div class="article-info-box">
            <a href="../${data[i]?.newsType === 'voice' ? 'voice/detail' : 'magazine/feature'}.html?id=${data[i]?.id}" class="article-info-box-btn">
              <div class="image-box">
              ${data[i].file?'<img src="'+data[i].file+'" alt="썸네일" />':''}
              </div>
              <div class="text-box">
                <div class="subject">${data[i]?.title}</div>
                <div class="text">${data[i]?.summary}</div>
                <div class="info">
                  <div class="writer"><span class="name">${data[i]?.name}</span> 에디터</div>
                  <div class="date">${dateToStrCharacterLength(strToDate(data[i]?.date), '.', 10)}</div>
                </div>
              </div>
            </a>
          </div>`;
      }    
      
      if(total > page*newsSize){
        paging = `<button type="button" class="btn medium bg-g4 full" onclick="getMainMore(${(page+1)})">더보기</button>`;
      }          

      document.getElementById('news').innerHTML  = html; 
      document.getElementById('news-paging').innerHTML  = paging; 
    })                    
  }).catch(error => console.log(error));
 
}

function floatingReportClose(){
  if(document.getElementById('checkbox-floating-report').checked){
    let day = new Date();   
    let setDay = new Date(day.setDate(day.getDate()+7)) 

    window.localStorage.setItem("floating-report", setDay);
  }
}

function floatingProposalClose(){
  if(document.getElementById('checkbox-floating-proposal').checked){
    let day = new Date();   
    let setDay = new Date(day.setDate(day.getDate()+7)) 

    window.localStorage.setItem("floating-proposal", setDay);
  }
}

function getDetail(page = 0, size = 10){   
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
        htmlContent+=`<div class="label-text mobile-show">${data[i]?.nickname}의 매거진</div>
            <div class="image-box">
            ${data[i].file?'<img src="'+data[i].file+'" alt="썸네일" />':''}
            </div>
            <div class="info-content">
              <div class="text-box">
                <!-- 닉네임 추가 -->
                <div class="label-text pc-show">${data[i]?.nickname}의 매거진</div>
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
                <div class="btn-box solo">
                  <!-- active-btn 클래스 추가 상태에서 like-btn 클릭 시 효과 적용 -->
                  <!-- check 클래스 추가 시 좋아요 컬러 변경 -->
                  <button type="button" class="btn icon-btn small round bg-wh active-btn${data[i]?.isLiked === 1 ? ' like-btn' : ''}${data[i]?.isLiked === 1 ? ' check' : ''}" onclick="postStoryFlag(${id}, 0, 0)"><i class="icon-box icon-like-medium"></i>좋아요</button>
                </div>
              </div>
            </div>`;

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

              //for(let j=0;j<data[i].voiceId1.length;j++){
              url = baseUrl + `/voices?id=${idString}`;    
              fetch(url, headers.json_headers)
              .then((response) => {
                checkError(response.status);
                response.json().then((response) => {                                
                  let data = response.data.voices;
                  
                  let dataTotal = response.data.total;
                  let numOfPage = dataTotal/size;
                  for( let i = 0;  i < data.length ; i++){
                    // console.log('${values.title}'+ JSON.stringify(values))
                    let values = data[i]

                    voiceHtml+=` <div class="article-info-box">
                    <a href="../voice/detail.html?id=${values.id}" class="article-info-box-btn">
                      <div class="image-box">
                      ${values.file?'<img src="'+values.file+'" alt="썸네일" />':''}
                      </div>
                      <div class="text-box">
                        <div class="label-text">글 쓰는 20대 발행</div>
                        <div class="subject">${values?.title}</div>
                        <div class="text">${values?.summary}</div>
                        <div class="date">${dateToStrCharacterLength(strToDate(values?.createDate), '.', 16)}</div>
                      </div>
                    </a>
                  </div>`;                                
                  }   
                  document.getElementById('mains-voice').innerHTML  = voiceHtml;                       
                
                })                    
              }).catch(error => console.log(error));
            }         
            
            
         // }

         document.getElementById('mains-story-content').innerHTML  = htmlContent;              
     
      // document.getElementById('paging-pc').innerHTML  = pagingPc;    
      // document.getElementById('paging-mobile').innerHTML  = pagingMobile;     
      }    
           
    })                    
  }).catch(error => console.log(error));
  
}


function postStoryFlag(id, commentId, type) {
  let url = baseUrl + "/story-flag/register";    
 
  let params = {
    storyId: id,
    commentId: commentId,
    type :type
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
      getDetail();
    }).catch(error => {if(error.message === '401') logout() });
    
    } catch (error) {
      console.error("Error:", error);
    }      
  }

  post(requestPost);
}

function mainShow(id) {
  let url = baseUrl + "/main/show?id=" +id;    
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {



    })                    
  }).catch(error => console.log(error));
}

function popupCheck(){

  if(document.getElementById("popup-text-check").checked || document.getElementById("popup-image-check").checked){
    let day = new Date();   
    let setDay = new Date(day.setDate(day.getDate()+7)) 

    window.localStorage.setItem("main-popup", setDay);
  }
}