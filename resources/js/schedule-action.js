document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/schedule/schedule") >= 0) get();
  else if (window.location.pathname.indexOf("/schedule/register") >= 0) getRegister();
});

window.addEventListener("load",() => {
  setTimeout(()=>{   
if(window.location.pathname.indexOf("/schedule/schedule") >= 0){
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

},2000);
});


function goRegister(){
  if(!window.localStorage.getItem('me')){      
    layerPopup.openPopup('loginInfoPopup');
  }else{
    window.location.href='../schedule/register.html';
  }   
}


function get(type,date = new Date()){ 

  let startTime = new Date(date);
  let endTime = new Date(date);
   
  startTime.setDate(1);
  startTime.setHours(0);
  startTime.setMinutes(0);
  startTime.setSeconds(0);

  endTime.setDate(getDaysInMonth(date.getFullYear(), date.getMonth()));
  endTime.setHours(23);
  endTime.setMinutes(59);
  endTime.setSeconds(59);

  let switch01 = document.getElementById("pick-switch01").checked;
  let switch02 = document.getElementById("pick-switch02").checked;
  let switch03 = document.getElementById("pick-switch03").checked;
  let moSwitch01 = document.getElementById("pick-mo-switch01").checked;
  let moSwitch02 = document.getElementById("pick-mo-switch02").checked;
  let moSwitch03 = document.getElementById("pick-mo-switch03").checked;

  let official = document.getElementById("official").value;
  
  if (type === 'pc-play'){
    document.getElementById("pick-mo-switch01").checked = document.getElementById("pick-switch01").checked;
    moSwitch01 = document.getElementById("pick-switch01").checked;
  } else  if (type === 'mobile-play'){
    document.getElementById("pick-switch01").checked =  document.getElementById("pick-mo-switch01").checked;
    switch01 = document.getElementById("pick-mo-switch01").checked;
  }

  if (type === 'pc-share'){
    document.getElementById("pick-mo-switch02").checked = document.getElementById("pick-switch02").checked;
    moSwitch02 = document.getElementById("pick-switch02").checked;
  } else  if (type === 'mobile-share'){
    document.getElementById("pick-switch02").checked =  document.getElementById("pick-mo-switch02").checked;
    switch02 = document.getElementById("pick-mo-switch02").checked;
  }

  if (type === 'pc-apply'){
    document.getElementById("pick-mo-switch03").checked = document.getElementById("pick-switch03").checked;
    moSwitch03 = document.getElementById("pick-switch03").checked;
  } else  if (type === 'mobile-apply'){
    document.getElementById("pick-switch03").checked =  document.getElementById("pick-mo-switch03").checked;
    switch03 = document.getElementById("pick-mo-switch03").checked;
  }
  console.log('type ====>' + type);
  console.log('switch01 ====>' + switch01);
  console.log('switch02 ====>' + switch02);
  console.log('switch03 ====>' + switch03);
  console.log('moSwitch01 ====>' + moSwitch01);
  console.log('moSwitch02 ====>' + moSwitch02);
  console.log('moSwitch03 ====>' + moSwitch03);

  let url = baseUrl + "/schedules?state=0,3&startDate=" + new Date().toISOString() + "&startTime=" + startTime.toISOString() + "&endTime=" + endTime.toISOString();  
  //let url = baseUrl + "/schedules"
  if(switch01 || switch02 || switch03 || moSwitch01 || moSwitch02 || moSwitch03){
    url += '&category=';
    if(switch01 || moSwitch01){
      url+='0,';
    }
    if(switch02 || moSwitch02){
      url+='1,';
    }
    if(switch03 || moSwitch03){
      url+='2,';
    }
    url = url.substring(0, url.length-1);
  } else {
    url += '&category=null';
  }

  if(official.length > 0){
    url += "&officialId=" +official;
  }
   
  let initialMonth = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-01`

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {       
      let data = response.data.schedules;
      let commentData = [];

      let scriptText = '';
      let htmlDaily = '';

      if(response.data.total > 0){

        for(let i=0;i<data.length;i++){

          scriptText+=`{
            display: 'block',
            accountName: '${data[i].officialId}',
            schedulePick: '${data[i].category==0?'univ':data[i].category==1?'twenty':data[i].category==2?'account':'promotion'}',
            scheduleTitle: '${data[i].title.replaceAll("'", "&#39;" )}',
            scheduleInfoText: '${data[i].content.replaceAll('\r\n', '</br>').replaceAll("'", "&#39;" )}',
            backgroundColor:  '#${data[i].category==0?'FFD9D9':data[i].category==1?'E7F8F2':data[i].category==2?'D2F0FF':'F3EEFE'}',
            start: '${dateToStr(strToDate(data[i].startTime))}',
            end: '${dateToStr(strToDate(data[i].endTime))}',
          },`;     

          url = baseUrl + "/schedule-comments?state=0&scheduleId="+data[i].id;    
          fetch(url, headers.json_headers)
          .then((response) => {
            checkError(response.status);
            response.json().then((response) => {       
              
              response.data.comments.map((i)=>commentData.push(i));
  
              if(i == (data.length - 1)){
                for(let h=1; h<=31;h++){
                  let header = 1;
                  let isExists = 0;
  
                  for(let i=0; i<data.length; i++){
                    let headerComment = 1;
                    let isExistsComment = 0;
  
                    if(h == Number(dateToStr(strToDate(data[i].startTime)).toString().substring(8,10)) && Number(dateToStr(strToDate(data[i].startTime)).toString().substring(5,7)) == (date.getMonth()+1) ){
                      isExists = 1;
                      if(header ==1){
                        let date = new Date(data[i].startTime);
        
                        htmlDaily += `<div class="daily-content-box ${data[i].category==0?'univ':data[i].category==1?'twenty':'account'}">                    
                                    <div class="daily-content-box-date">${dateToStrCharacterLength(strToDate(data[i].startTime), '.', 10).substring(5,10) + '(' + (date.getDay()==0?'일':date.getDay()==1?'월':date.getDay()==2?'화':date.getDay()==3?'수':date.getDay()==4?'목':date.getDay()==5?'금':'토')})</div>`;
  
                        header = 0;
                      }
   
                      htmlDaily += ` <div class="content-box">
                                      <div class="label">
                                        <i class="icon-box"></i>
                                        <span>${data[i].category==0?'놀자':data[i].category==1?'공유하자':'신청하자'}</span>
                                      </div>
                                      ${data[i].file != null?`<div class="thumbnail-image">
                                        <img src="${data[i].file}" alt="썸네일 이미지" />
                                        </div>`:''}
                                      <div class="title">${data[i].title}</div>
                                      <div class="date-box"><i class="icon">🗓️</i> ${dateToStr(strToDate(data[i].startTime)).substring(0,16)} ~ ${dateToStr(strToDate(data[i].endTime)).substring(0,16)}</div>
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
  
                          htmlDaily+=`<div class="comment-list-box-item ${window.localStorage.getItem("me") && JSON.parse(window.localStorage.getItem("me")).id == commentData[j].userId ? ' comment-list-box-item-user':''}">
                            <div class="profile-image">${commentData[j].nickname.substring(0,1)}</div>
                            <div class="comment-box">
                              <div class="info-box">
                                <div class="name">${commentData[j].nickname}</div>
                                <div class="date">${dateToStr(strToDate(commentData[j].lastDate.substring(0,16)))}</div>
                                <div class="like-box">
                                  <!-- active-btn 클래스 추가 상태에서 like-btn 클릭 시 효과 적용 -->
                                  <button type="button" class="active-btn like-btn ${commentData[j].isLiked ===1 ? 'check' : ''}">
                                    <i class="icon-box icon-like">좋아요</i>
                                  </button>
                                  <span class="number">${numberWithCommas(commentData[j].likeCount)}</span>
                                </div>
                              </div>
                              <div class="comment">${commentData[j].content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />")}</div>
                            </div>
                          </div>`
                        }
  
                        if(commentData.length-1 == j && isExistsComment == 1){
                          htmlDaily += `</div>`;                            
                        }
                      }
                      
                      htmlDaily += `<div class="comment-input-box comment-input-box-active">
                            <div class="textarea-box">
                              <textarea  id="comment-${data[i].id}" class="form-textarea full sm" placeholder="댓글을 입력해 주세요."></textarea>
                              <label for="" class="info-text">다른 사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현이나 다른 사람의 권리를 침해하는 내용은 강제 삭제될 수 있습니다.</label>
                            </div>
                            <button type="button" class="btn" onclick="postCommentSchedule(${data[i].id})">댓글 쓰기</button>
                          </div>
                        </div>
                      </div>
                      <!-- //comment-content-box -->
                    </div>
                  `;
                 
                    }
                  }
                  
                  if(isExists == 1){                  
                    htmlDaily += `  </div> 
                                  </div>
                              </div>`;
                  }
                }   
  
                document.getElementById('htmlDaily').innerHTML  = htmlDaily;    
              }            
            })                    
          }).catch(error => console.log(error));
        }      

      }else{
        document.getElementById('htmlDaily').innerHTML  = htmlDaily;    
      }
     

      const script = document.createElement("script"),
      text = document.createTextNode( `
        // fullcalendar 라이브러리 참고 - https://fullcalendar.io/docs/getting-started
        $(document).ready(function() {
        let windowWidth = $(window).width();
        let checkValue = false;
        let mobileWidth = 960;

        // FullCalendar
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
          schedulerLicenseKey: '0282912382-fcs-1701247693',

          headerToolbar: {
            left: 'prev',
            center: 'title',
            right: 'next',
          },

          // 보여지는 고정 월, 날짜
          initialDate: '${initialMonth}',
          editable: false, // 기존에 입력 되어 있는 event를 드래그로 움직일 수 있도록 해주는 설정
          selectable: false, // 달력 날짜를 드래그 해서 여러 날짜를 지정할 수 있다.
          businessHours: false,
          navLinks: false, // 달력 내부의 날짜 (숫자) 클릭 가능하게
          dayMaxEvents: 3, //더보기 표기 갯수
          // aspectRatio: 1.18, //비율 유지 가로 세로 비율
          // weekNumbers: true, //달력 가장 왼쪽으로 오늘이 몇번째 주인지를 숫자로 보여준다.

          initialView: 'dayGridMonth',
          locale: 'ko', // 한글 여부
          fixedWeekCount: false, //height fix 풀기
          contentHeight: 'auto',
          windowResizeDelay: 10,
          // contentHeight: 680,

          // 일정 El 커스텀
          eventContent: function(obj) {
            var item = document.createElement('div');
            item.className = 'fc-schedule-content ' + obj.event.extendedProps.schedulePick;
            item.innerHTML = "<div class='schedule-info'><div class='schedule-title'>" + obj.event.extendedProps.scheduleTitle + '</div></div>';
            var arrayOfDomNodes = [item];
            return {
              domNodes: arrayOfDomNodes
            };
          },

          // 일정 일 텍스트 제거
          dayCellContent: function(info) {
            var number = document.createElement('a');
            number.classList.add('fc-daygrid-day-number');
            number.innerHTML = info.dayNumberText.replace('일', '');
            if (info.view.type === 'dayGridMonth') {
              return {
                html: number.outerHTML,
              };
            }
            return {
              domNodes: [],
            };
          },

          // 더 보기 +
          moreLinkContent: function(obj) {
            var objNumber = obj.num + 1;
            //더보기 표기
            return '+' + objNumber;
          },

          // 더 보기 버튼 생성시
          moreLinkDidMount: function(obj) {
            moreLinkHideEvent();
          },

          // 더 보기 클릭시
          moreLinkClick: function() {
            calendar.setOption(moreLinkClickEvent());
            return 'function';
            // 모바일은 click 불가
          },

          // 일정 클릭시 발생하는 이벤트
          eventClick: function(obj) {
            const viewBoxWrap = $('.calendar-info-box .view-box-wrap');
            const label = $('.calendar-info-box .label');
            const title = $('.calendar-info-box .title');
            const text = $('.calendar-info-box .text');
            const date = $('.calendar-info-box .date');
            let iconName;
            let labelName;
            let startDate, endDate;

            if (windowWidth <= mobileWidth) {
              // Mobile
             // alert('모바일에서 일정 바 클릭');
            } else {
              // PC
              // 시간 불필요 요소 제거
              var start = obj.event.startStr;
              var end = obj.event.endStr;
              startDate = start.replaceAll('-', '.').replace('T', ' ').replace('+09:00', '');
              endDate = end.replaceAll('-', '.').replace('T', ' ').replace('+09:00', '');

              if (startDate.split(':').length - 1 > 0) {
                startDate = startDate.substring(startDate.lastIndexOf(':'), 2);
                endDate = endDate.substring(endDate.lastIndexOf(':'), 2);
              }

              if (obj.event.extendedProps.schedulePick == 'univ') {
                iconName = 'icon-univ';
                labelName = '놀자';
              } else if (obj.event.extendedProps.schedulePick == 'twenty') {
                iconName = 'icon-smile';
                labelName = '공유하자';
              } else if (obj.event.extendedProps.schedulePick == 'account') {
                iconName = 'icon-check';
                labelName = obj.event.extendedProps.accountName;
              } else if (obj.event.extendedProps.schedulePick == 'promotion') {
                iconName = 'icon-promotion';
                labelName = 'Promotion';
              }

              // calendarInfoBoxView
              calendarInfoBoxView();
              viewBoxWrap.attr('class', 'view-box-wrap');
              viewBoxWrap.addClass(obj.event.extendedProps.schedulePick);
              label.html('<i class="icon-box ' + iconName + '"></i>' + labelName);
              title.text(obj.event.extendedProps.scheduleTitle.replaceAll('&#39;', "'" ));
              text.text(obj.event.extendedProps.scheduleInfoText.replaceAll('&#39;', "'" ).replaceAll('</br>', ""));

              if (startDate == '' || endDate == '') {
                if (!startDate == '') {
                  date.text(startDate);
                } else {
                  date.text(endDate);
                }
              } else {
                date.text(startDate + ' ~ ' + endDate);
              }
            }
          },

          events: [${scriptText}
          ],

          // render 호출 후
          eventDidMount: function() {
            moreLinkRenderEvent();
            moreLinkHideEvent();
          },

          // windowResize
          windowResize: function() {
            windowWidth = $(window).width();

            if (windowWidth <= mobileWidth && checkValue == false) {
              // Mobile
              moreLinkRenderEvent();
              moreLinkHideEvent();
              checkValue = true;
            } else {
              // PC
              moreLinkRenderEvent();
              moreLinkHideEvent();
              checkValue = false;
            }
          },

          eventAdd: function(obj) {
            // 이벤트가 추가되면 발생하는 이벤트
            console.log(obj);
          },
          eventChange: function(obj) {
            // 이벤트가 수정되면 발생하는 이벤트
            console.log(obj);
          },
          eventRemove: function(obj) {
            // 이벤트가 삭제되면 발생하는 이벤트
            console.log(obj);
          },

          // date 영역 클릭 시
          dateClick: function(info) {
            // 모바일
            if (windowWidth <= mobileWidth) {
              // $('.fc-day').removeClass('fc-day-cover');
              // $(info.dayEl).addClass('fc-day-cover');
             // alert('모바일에서 일정 클릭');
            }
          },
        });
        calendar.render();

        // calendarInfoBoxView
        function calendarInfoBoxView() {
          $('.calendar-info-box .info-text').addClass('hide');
          $('.calendar-info-box .view-box').addClass('show');
        }

        // moreLinkRenderEvent
        function moreLinkRenderEvent() {
          // more 표시 개수
          if ($(window).width() <= mobileWidth) {
            // Mobile
            calendar.setOption('dayMaxEvents', 4);
          } else {
            // PC
            calendar.setOption('dayMaxEvents', 3);
          }       
        }

        // moreLinkHideEvent
        function moreLinkHideEvent() {
          $('.fc-daygrid-event-harness').removeClass('hide');

          setTimeout(() => {
            $('.fc-daygrid-more-link').each(function(i, el) {
              $(el)
                .closest('.fc-daygrid-day-events')
                .find('.fc-daygrid-event-harness')
                .not('.fc-daygrid-event-harness-abs')
                .eq(calendar.currentData.calendarOptions.dayMaxEvents - 1)
                .addClass('hide');
              $(el)
                .closest('.fc-daygrid-day-events')
                .find('.fc-daygrid-event-harness.fc-daygrid-event-harness-abs')
                .eq(calendar.currentData.calendarOptions.dayMaxEvents - 1)
                .addClass('hide');
            });
          }, 100);
        }

        // moreLinkClickEvent 더보기 클릭시 이벤트
        function moreLinkClickEvent() {
          // PC
          if ($(window).width() > mobileWidth) {
            $('.tab-box-btn.daily').click();
          }
        }

        // 탭 메뉴 월간 캘린더 보이기
        function monthlyViewEvent() {
          $('.calender-box-title h2').text('월간 캘린더');
          $('.calender-box-content .monthly-box').addClass('show');
          $('.calender-box-content .daily-box').removeClass('show');
           get( calendar.getDate());
          calendar.render();
        }

        // 탭 메뉴 일간 캘린더 보이기
        function dailyViewEvent() {
          $('.calender-box-title h2').text('일간 캘린더');
          $('.calender-box-content .daily-box').addClass('show');
          $('.calender-box-content .monthly-box').removeClass('show');
           get( calendar.getDate());
          calendar.render();
        }
          
        $('.fc-next-button').off('click').on('click', function() {      
         console.log( calendar.getDate())
        get( calendar.getDate());
       
        });
        
         $('.fc-prev-button').off('click').on('click', function() {
       
           console.log(calendar.getDate())
          get( calendar.getDate());
         });

        // 탭 메뉴
        $('.celender-info-box-tab .tab-box-btn').off('click').on('click', function() {    
          $('.tab-box-btn').parent('.tab-box').removeClass('active');
          $(this).parent('.tab-box').addClass('active');

          // monthly, daily show
          if ($(this).hasClass('monthly')) {
            monthlyViewEvent();
          } else {
            dailyViewEvent();
          }
        });

        
      });`);
    
    script.appendChild(text);
    document.body.appendChild(script);

         
  })                    
}).catch(error => console.log(error));

  url = baseUrl + "/officials?state=0"; 
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {       
      let data = response.data.officials;     
      let html = `<option value="" ${official == "" ? 'selected' : ''}>전체</option>`;

      for(let i=0;i<data.length;i++){                  
        html+=` <option value="${data[i].id}" ${official == data[i].id ? 'selected' : ''}>${data[i].name}</option>`;
      }

      document.getElementById('official').innerHTML  = html;  

    })                    
  }).catch(error => console.log(error));
}

function getRegister(){ 
  let meInfo = JSON.parse(window.localStorage.getItem('me'));
  if(meInfo.officialId != null){
    document.getElementById('category').innerHTML = ` <select id="selectBox" name="select" class="form-select" onchange="getCategory()">
                      <option value="">선택</option>
                      <option value="1">공유하자</option>
                      <option value="2">신청하자</option>
                    </select>               
                    `     
  }else{
    document.getElementById('category').innerHTML = ` <select id="selectBox" name="select" class="form-select">
                      <option value="">선택</option>
                      <option value="1">공유하자</option>
                    </select>
                    `    
  }


 
}


function postCommentSchedule(id) {
  let url = baseUrl + "/schedule-comment/register";  
  let comment_input = document.getElementById("comment-" + id).value;

  if(checkBanWord(comment_input)){
    document.getElementById('loginInfoPopup7Message').innerHTML = `<strong>
              올바르지 않은 댓글 내용입니다.</br>다시 입력해 주세요.
            </strong>`;
    layerPopup.openPopup('loginInfoPopup7');    
  }else if(comment_input.length == 0){
    document.getElementById('loginInfoPopup7Message').innerHTML = `<strong>
              댓글을 작성해 주세요.
            </strong>`;
    layerPopup.openPopup('loginInfoPopup7');    
  }else{
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

function getCategory(){
  console.log(document.getElementById("selectBox").value)

  if(document.getElementById("selectBox").value == 2){
    let url = baseUrl + "/officials?state=0"; 
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((response) => {       
        let data = response.data.officials;     
        let html = `<select id="selectBox" name="select" class="form-select" onchange="getCategory()">
                      <option value="">선택</option>
                      <option value="1" ${document.getElementById("selectBox").value == 1?'selected':''}>공유하자</option>
                      <option value="2" ${document.getElementById("selectBox").value == 2?'selected':''}>신청하자</option>
                    </select>
                    <select name="select" class="form-select" id="html">
                      <option value="">회사/학교 선택</option>`;

        for(let i=0;i<data.length;i++){                  
          html+=` <option value="${data[i].id}">${data[i].name}</option>`;
        }

        document.getElementById('category').innerHTML  = html + '</select>';  

      })                    
    }).catch(error => console.log(error));
  }else{
    document.getElementById('category').innerHTML = ` <select id="selectBox" name="select" class="form-select" onchange="getCategory()">
                      <option value="">선택</option>
                      <option value="1" ${document.getElementById("selectBox").value == 1?'selected':''}>공유하자</option>
                      <option value="2" ${document.getElementById("selectBox").value == 2?'selected':''}>신청하자</option>
                    </select>               
                    `     
  }
     
}

function postSchedule() {

  if(document.getElementById("datePicker01").value.length ===0 || document.getElementById("datePicker02").value.length === 0 ){
    layerPopup.openPopup('popup');
  }else if(document.getElementById('subjectText').value.length === 0){
    layerPopup.openPopup('popup1');
  }else if(document.getElementById('content-textarea').value.length === 0){
    layerPopup.openPopup('popup2');
  }else{
    let url = baseUrl + "/schedule/register";    
    
    let formData = new FormData();
    
    formData.append('state', 4); 
    formData.append('category', document.getElementById("selectBox").value); 
    if(JSON.parse(window.localStorage.getItem("me"))?.schoolId > 0){
      formData.append('schoolId', JSON.parse(window.localStorage.getItem("me"))?.schoolId);
    }    
    if(document.getElementById("selectBox").value == 2){
      formData.append('officialId',document.getElementById("html").value); 
    }
    formData.append('startTime', document.getElementById("datePicker01").value);
    formData.append('endTime', document.getElementById("datePicker02").value);
    formData.append('isAllDay', (document.getElementById("date-switch01").checked == true?1:0));
    formData.append('title' , document.getElementById('subjectText').value);
    formData.append('content' , document.getElementById('content-textarea').value);

    if (croppedFile) formData.append('file', croppedFile, croppedFile.name);
    
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

function postScheduleCancel() {
  if(document.getElementById("selectBox").value.length > 0
  || document.getElementById("datePicker01").value.length > 0 
  || document.getElementById("datePicker02").value.length > 0
  || document.getElementById('subjectText').value.length > 0
  || document.getElementById('content-textarea').value.length > 0
  || croppedFile !== null){
    layerPopup.openPopup('popup4');  
  }else{
    location.href='../schedule/schedule.html';
  }
}
