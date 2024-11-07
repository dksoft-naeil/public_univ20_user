document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/search/search") >= 0) getSearch();
});

window.addEventListener("load",() => {  
  setTimeout(()=>{
    window.toolbarHandler();

    
    if (!$('.floating-toolbar').length) return;

     // 클릭 효과
     $('.floating-toolbar .active-btn').on('click', function () {
      if (!$(this).hasClass('check')) {
        $(this).addClass('check');
      } else if ($(this).hasClass('check')) {
        $(this).removeClass('check');
      }
    });

    // sns 공유
    $('.floating-toolbar .share-btn').on('click', function () {
      if (!$(this).hasClass('check')) {
        $(this).addClass('check');
        $('.floating-toolbar .sns-share-box').addClass('show');
      } else {
        $(this).removeClass('check');
        $('.floating-toolbar .sns-share-box').removeClass('show');
        // sns link copy 효과 제거
        clearTimeout(copyTimeOut);
        $('.sns-share-box-item-copy').removeClass('copy');
      }
    });

    // sns link copy
    let copyTimeOut;

    function copyTextShow() {
      $('.sns-share-box-item-copy').removeClass('copy');
      $('.floating-toolbar .share-btn').removeClass('check');
      $('.floating-toolbar .sns-share-box').removeClass('show');
    }

    // sns link copy 버튼 클릭 시
    $('.sns-share-box-item-copy .sns-share-box-btn').on('click', function () {
      if (!$(this).parent('.sns-share-box-item-copy').hasClass('check')) {
        $('.sns-share-box-item-copy').addClass('copy');
        copyTimeOut = setTimeout(copyTextShow, 2000);
      }
    });

    //  sns 공유 닫기
    $('.floating-toolbar .sns-share-box-btn.close').on('click', function () {
      $('.floating-toolbar .share-btn').removeClass('check');
      $('.floating-toolbar .sns-share-box').removeClass('show');
      // sns link copy 효과 제거
      clearTimeout(copyTimeOut);
      $('.sns-share-box-item-copy').removeClass('copy');
    });

    
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
  },100);  
  
});

function getSearch(magazinePage = 0, voicePage=0, communityPage = 0, tab = 0){ 
  
  let u = window.location.href;
  let param;  
  let htmlInput = "";
  let htmlTab = "";
  let htmlListMagazine = "";  
  let htmlListVoice = "";  
  let htmlListPcCommunity = "";  
  let htmlListMobileCommunity = "";  
  let pagingPcMagazine = "";
  let pagingMobileMagazine = "";
  let pagingPcVoice = "";
  let pagingMobileVoice = "";
  let pagingPcCommunity = "";
  let pagingMobileCommunity = "";
  let articleSize = 12;
  let communitySize = 20;

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

  url = baseUrl + "/magazines?state=0,3&offset=0&startDate=" + new Date().toISOString(); 
  if(param.length > 0){
    url += "&keyword=" + param;
  }

  htmlInput = `<div class="input-cover">
                <span class="form-label txt-hidden">검색</span>
                <input type="text" id="searchInner" name="searchInner" title="검색" class="form-input" autocomplete="off" value="${param==null?'검색어 입력 예시':decodeURIComponent(param)}" placeholder="검색하실 글 내용을 입력하세요."  onkeypress="enterSearchKeywordInner(event)"/>
              </div>
              <button type="button" class="search-button" onclick="searchKeywordInner()">
                <i class="icon-box icon-search"></i>
                <span>검색하기</span>
              </button>`;

  document.getElementById('htmlInput').innerHTML = htmlInput;

  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
      response.json().then((response) => {      
      let totalMagazine = response.data.total;   
      let dataMagazine = response.data.magazines;         

      url = baseUrl + "/voices?state=0,3&offset=0&startDate=" + new Date().toISOString(); 
      if(param.length > 0){
        url += "&keyword=" + param;
      }
    
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
          response.json().then((response) => {      
          let totalVoice = response.data.total;   
          let dataVoice = response.data.voices;         
    
          url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&type=0"; 
          if(param.length > 0){
            url += "&keyword=" + param;
          }
        
          fetch(url, headers.json_headers)
          .then((response) => {
            checkError(response.status);
              response.json().then((response) => {      
              let totalCommunityNotice = response.data.total;   
              let dataCommunityNotice = response.data.communities;         

              url = baseUrl + "/communities?state=0,3&startDate=" + new Date().toISOString() + "&type=1"; 
              if(param.length > 0){
                url += "&keyword=" + param;
              }
            
              fetch(url, headers.json_headers)
              .then((response) => {
                checkError(response.status);
                  response.json().then((response) => {      
                  let totalCommunity = response.data.total;   
                  let dataCommunity= response.data.communities;      
                  
                  if(tab === 0){
                    htmlTab = ` <li class="content-tab-menu-box-item ui-tab-item active">
                                <a href="#magazine" class="content-tab-menu-box-btn"  onclick="getSearch(0, 0, 0, 0)">
                                  <span>매거진</span>
                                  <span class="number">(${totalMagazine}건)</span>
                                </a>
                              </li>
                              <li class="content-tab-menu-box-item ui-tab-item">
                                <a href="#twenty" class="content-tab-menu-box-btn"  onclick="getSearch(0, 0, 0, 1)">
                                  <span>글 쓰는 20대</span>
                                  <span class="number">(${totalVoice}건)</span>
                                </a>
                              </li>
                              <li class="content-tab-menu-box-item ui-tab-item">
                                <a href="#community" class="content-tab-menu-box-btn"  onclick="getSearch(0, 0, 0, 2)">
                                  <span>커뮤니티</span>
                                  <span class="number">(${totalCommunityNotice + totalCommunity}건)</span>
                                </a>
                              </li>`;       
                    document.getElementById("magazine").style.display = 'block';                       
                    document.getElementById("twenty").style.display = 'none';
                    document.getElementById("community").style.display = 'none';
                  }else if(tab===1){
                    htmlTab = ` <li class="content-tab-menu-box-item ui-tab-item">
                                <a href="#magazine" class="content-tab-menu-box-btn"  onclick="getSearch(0, 0, 0, 0)">
                                  <span>매거진</span>
                                  <span class="number">(${totalMagazine}건)</span>
                                </a>
                              </li>
                              <li class="content-tab-menu-box-item ui-tab-item active">
                                <a href="#twenty" class="content-tab-menu-box-btn"  onclick="getSearch(0, 0, 0, 1)">
                                  <span>글 쓰는 20대</span>
                                  <span class="number">(${totalVoice}건)</span>
                                </a>
                              </li>
                              <li class="content-tab-menu-box-item ui-tab-item">
                                <a href="#community" class="content-tab-menu-box-btn"  onclick="getSearch(0, 0, 0, 2)">
                                  <span>커뮤니티</span>
                                  <span class="number">(${totalCommunityNotice + totalCommunity}건)</span>
                                </a>
                              </li>`;    
                      document.getElementById("magazine").style.display = 'none';                       
                      document.getElementById("twenty").style.display = 'block';
                      document.getElementById("community").style.display = 'none';
                  }else{
                    htmlTab = ` <li class="content-tab-menu-box-item ui-tab-item">
                                <a href="#magazine" class="content-tab-menu-box-btn"  onclick="getSearch(0, 0, 0, 0)">
                                  <span>매거진</span>
                                  <span class="number">(${totalMagazine}건)</span>
                                </a>
                              </li>
                              <li class="content-tab-menu-box-item ui-tab-item">
                                <a href="#twenty" class="content-tab-menu-box-btn"  onclick="getSearch(0, 0, 0, 1)">
                                  <span>글 쓰는 20대</span>
                                  <span class="number">(${totalVoice}건)</span>
                                </a>
                              </li>
                              <li class="content-tab-menu-box-item ui-tab-item active">
                                <a href="#community" class="content-tab-menu-box-btn"  onclick="getSearch(0, 0, 0, 2)">
                                  <span>커뮤니티</span>
                                  <span class="number">(${totalCommunityNotice + totalCommunity}건)</span>
                                </a>
                              </li>`;    
                    document.getElementById("magazine").style.display = 'none';                       
                    document.getElementById("twenty").style.display = 'none';
                    document.getElementById("community").style.display = 'block';
                  }
                  
                  let numOfPage = totalMagazine/articleSize;

                  for( let i = 0; i<dataMagazine.length; i++){
                    let values = dataMagazine[i];
                    
                    htmlListMagazine+=`<div class="article-info-box">
                      <a href="../magazine/${values?.file2 == null ? 'news':'feature'}.html?id=${values.id}" class="article-info-box-btn">
                        <div class="image-box">
                        ${values.file1?'<img src="'+values.file1+'" alt="썸네일" />':''}
                        </div>
                        <div class="text-box">
                          <div class="subject">${values.title}</div>
                          <div class="text">${values.summary}</div>
                          <div class="info">
                            <div class="writer"><span class="name">${values?.nickname}</span> 에디터</div>
                            <div class="date">${values?.startDate?dateToStrCharacterLength(strToDate(values?.startDate), '.', 10) + '.':''}</div>
                          </div>
                        </div>
                      </a>
                    </div>`;
                  }

                  if(totalMagazine == 0){
                    htmlListMagazine = ` <div class="empty-info-text-box">
                      <div class="empty-info-text">
                        등록된 글이 없습니다.<br />
                        첫 글의 주인공이 되어보세요.
                      </div>
                    </div>
                    <!-- //empty-info-text-box -->
                    <!-- //콘텐츠가 0개 일 경우 노출 문구 -->`;              
                  } else if(totalMagazine >articleSize){
                    pagingPcMagazine =`<button type="button" class="controller prev" ${magazinePage > 0 ? 'onclick="getSearch('+(magazinePage-1)+`,`+ articleSize + ')"' : ''}>이전으로</button>`;
                    pagingMobileMagazine=` <button type="button" class="btn medium bg-g4 prev-btn" ${magazinePage > 0 ? 'onclick="getSearch('+(magazinePage-1)+`,`+ articleSize + ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
                    for ( let j = 0; j< numOfPage; j++){
                      pagingPcMagazine +=`<button type="button" class="paging ${magazinePage === j?'current':''}"  onclick="getSearch(`+j+`,`+ articleSize + `)">` +  (j+1)  + `</button>`                    
                    }             
          
                    pagingPcMagazine +=`<button type="button" class="controller next" ${magazinePage < numOfPage-1 ? 'onclick="getSearch(' + (magazinePage+1) + ',' + articleSize +  ')"' : ''}>다음으로</button>`;
                    pagingMobileMagazine+=`<button type="button" class="btn medium bg-g4 next-btn"  ${magazinePage < numOfPage-1 ? 'onclick="getSearch(' + (magazinePage+1) + ',' + articleSize +  ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;

                  }

                  numOfPage = totalVoice/articleSize;

                  for( let i = 0; i<dataVoice.length; i++){
                    let values = dataVoice[i];
                    
                    htmlListVoice+=`<div class="article-info-box">
                                      <a href="../voice/detail.html?id=${values.id}" class="article-info-box-btn">
                                        <div class="image-box">
                                        ${values.file?'<img src="'+values.file+'" alt="썸네일" />':''}
                                        </div>
                                        <div class="text-box">
                                          <div class="subject">>${values?.title}</div>
                                          <div class="text">${values?.summary}</div>
                                          <div class="info">
                                            <div class="writer"><span class="name">${values?.nickname}</span> 에디터</div>
                                            <div class="date">${values?.createDate?(dateToStrCharacterLength(strToDate(values?.createDate), '.', 10))+'.':''}</div>
                                          </div>
                                        </div>
                                      </a>
                                    </div>`;
                  }

                  if(totalVoice == 0){
                    htmlListVoice = ` <div class="empty-info-text-box">
                      <div class="empty-info-text">
                        등록된 글이 없습니다.<br />
                        첫 글의 주인공이 되어보세요.
                      </div>
                    </div>
                    <!-- //empty-info-text-box -->
                    <!-- //콘텐츠가 0개 일 경우 노출 문구 -->`;              
                  }else if(totalVoice >articleSize){
                    pagingPcVoice =`<button type="button" class="controller prev" ${voicePage > 0 ? 'onclick="getSearch('+(voicePage-1)+`,`+ articleSize + ')"' : ''}>이전으로</button>`;
                    pagingMobileVoice=` <button type="button" class="btn medium bg-g4 prev-btn" ${voicePage > 0 ? 'onclick="getSearch('+(voicePage-1)+`,`+ articleSize + ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
                    for ( let j = 0; j< numOfPage; j++){
                      pagingPcVoice +=`<button type="button" class="paging ${voicePage === j?'current':''}"  onclick="getSearch(`+j+`,`+ articleSize + `)">` +  (j+1)  + `</button>`                    
                    }             
          
                    pagingPcVoice +=`<button type="button" class="controller next" ${voicePage < numOfPage-1 ? 'onclick="getSearch(' + (voicePage+1) + ',' + articleSize +  ')"' : ''}>다음으로</button>`;
                    pagingMobileVoice+=`<button type="button" class="btn medium bg-g4 next-btn"  ${voicePage < numOfPage-1 ? 'onclick="getSearch(' + (voicePage+1) + ',' + articleSize +  ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;

                  }

                  numOfPage = totalCommunity/communitySize;

                  htmlListPcCommunity=`<div class="txt-hidden">커뮤니티 검색 목록</div>
                  <div class="data-table-box-standard">
                    <div class="number">번호</div>
                    <div class="category">카테고리</div>
                    <div class="topic">제목</div>
                    <div class="like">좋아요</div>
                    <div class="read">읽음</div>
                    <div class="date">게시일</div>
                  </div>
                  <ul class="data-table-box-list" id="htmlListPcCommunity">                     `;                    

                  for( let i = 0; i<dataCommunityNotice.length; i++){
                    let values = dataCommunityNotice[i];
                    
                    htmlListPcCommunity+=` <li class="data-table-box-item">
                                          <a href="../community/detail.html?id=${values.id}" class="data-table-box-link notice">
                                            <div class="number">공지</div>
                                            <div class="category">${values.category==0?'연애':values.category==1?'진로':values.category==2?'일상':'우리 학교'}</div>
                                            <div class="topic image">
                                              <div class="text">
                                                ${values.title}<span class="info">${values.fileExists === 1?'<i class="icon-box icon-photo">이미지</i>':''} ${values.commentCount>0 ? '(' + numberWithCommas(values.commentCount) + ')' : ''}</span>
                                              </div>
                                            </div>
                                            <div class="like">${numberWithCommas(values.likeCount)}</div>
                                            <div class="read">${numberWithCommas(values.showCount)}</div>
                                            <div class="date">${values?.createDate?dateToStrCharacterLength(strToDate(values?.createDate), '.', 16):''}</div>
                                          </a>
                                        </li>`;
                  
                    htmlListMobileCommunity+=`<li class="data-table-box-item">
                                                <a href="../community/detail.html?id=${values.id}" class="data-table-box-link notice">
                                                  <div class="category-box">
                                                    <span class="label">카테고리</span>
                                                    <span class="text">${values.category==0?'연애':values.category==1?'진로':values.category==2?'일상':'우리 학교'}</span>
                                                  </div>
                                                  <div class="title-box image">
                                                    <div class="title">[공지] ${values.title}</div>
                                                    <span class="info">${values.fileExists === 1?'<i class="icon-box icon-photo">이미지</i>':''} ${values.commentCount>0 ? '(' + numberWithCommas(values.commentCount) + ')' : ''}</span>
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

                  for( let i = 0; i<dataCommunity.length; i++){
                    let values = dataCommunity[i];
                    
                    htmlListPcCommunity+=` <li class="data-table-box-item">
                                          <a href="../community/detail.html?id=${values.id}" class="data-table-box-link">
                                            <div class="number">${values.id}</div>
                                            <div class="category">${values.category==0?'연애':values.category==1?'진로':values.category==2?'일상':'우리 학교'}</div>
                                            <div class="topic image">
                                              <div class="text">
                                                ${values.title}<span class="info">${values.fileExists === 1?'<i class="icon-box icon-photo">이미지</i>':''} ${values.commentCount>0 ? '(' + numberWithCommas(values.commentCount) + ')' : ''}</span>
                                              </div>
                                            </div>
                                            <div class="like">${numberWithCommas(values.likeCount)}</div>
                                            <div class="read">${numberWithCommas(values.showCount)}</div>
                                            <div class="date">${values?.createDate?dateToStrCharacterLength(strToDate(values?.createDate), '.', 16):''}</div>
                                          </a>
                                        </li>`;
                            
                    htmlListMobileCommunity+=`<li class="data-table-box-item">
                                        <a href="../community/detail.html?id=${values.id}" class="data-table-box-link">
                                          <div class="category-box">
                                            <span class="label">카테고리</span>
                                            <span class="text">${values.category==0?'연애':values.category==1?'진로':values.category==2?'일상':'우리 학교'}</span>
                                          </div>
                                          <div class="title-box image">
                                            <div class="title">${values.title}</div>
                                            <span class="info">${values.fileExists === 1?'<i class="icon-box icon-photo">이미지</i>':''} ${values.commentCount>0 ? '(' + numberWithCommas(values.commentCount) + ')' : ''}</span>
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

                  if((totalCommunityNotice + totalCommunity) > 0 ){
                    htmlListPcCommunity +='</ul>';
                  }

                  if(totalCommunityNotice + totalCommunity == 0){
                    htmlListPcCommunity = ` 
                    <div class="empty-info-text-box">
                      <div class="empty-info-text">
                        등록된 글이 없습니다.<br />
                        첫 글의 주인공이 되어보세요.
                      </div>
                    </div>
                    <!-- //empty-info-text-box -->
                    <!-- //콘텐츠가 0개 일 경우 노출 문구 -->
                 `;  
                    htmlListMobileCommunity = `  <div class="empty-info-text-box">
                      <div class="empty-info-text">
                        등록된 글이 없습니다.<br />
                        첫 글의 주인공이 되어보세요.
                      </div>
                    </div>
                    <!-- //empty-info-text-box -->
                    <!-- //콘텐츠가 0개 일 경우 노출 문구 -->`;              
                  }else if(totalCommunity >articleSize){
                    pagingPcCommunity =`<button type="button" class="controller prev" ${communityPage > 0 ? 'onclick="getSearch('+(communityPage-1)+`,`+ articleSize + ')"' : ''}>이전으로</button>`;
                    pagingMobileCommunity=` <button type="button" class="btn medium bg-g4 prev-btn" ${communityPage > 0 ? 'onclick="getSearch('+(communityPage-1)+`,`+ articleSize + ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
                    for ( let j = 0; j< numOfPage; j++){
                      pagingPcCommunity +=`<button type="button" class="paging ${communityPage === j?'current':''}"  onclick="getSearch(`+j+`,`+ articleSize + `)">` +  (j+1)  + `</button>`                    
                    }             
          
                    pagingPcCommunity +=`<button type="button" class="controller next" ${communityPage < numOfPage-1 ? 'onclick="getSearch(' + (communityPage+1) + ',' + articleSize +  ')"' : ''}>다음으로</button>`;
                    pagingMobileCommunity+=`<button type="button" class="btn medium bg-g4 next-btn"  ${communityPage < numOfPage-1 ? 'onclick="getSearch(' + (communityPage+1) + ',' + articleSize +  ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;

                  }

                  document.getElementById('htmlTab').innerHTML  = htmlTab;        
                  
                  document.getElementById('htmlListMagazine').innerHTML  = htmlListMagazine;                  
                  document.getElementById('pagingPcMagazine').innerHTML  = pagingPcMagazine; 
                  document.getElementById('pagingMobileMagazine').innerHTML  = pagingMobileMagazine;  

                  document.getElementById('htmlListVoice').innerHTML  = htmlListVoice;                  
                  document.getElementById('pagingPcVoice').innerHTML  = pagingPcVoice; 
                  document.getElementById('pagingMobileVoice').innerHTML  = pagingMobileVoice;  

                  document.getElementById('htmlListPcCommunity').innerHTML  = htmlListPcCommunity;                  
                  document.getElementById('htmlListMobileCommunity').innerHTML  = htmlListMobileCommunity;         
                  document.getElementById('pagingPcCommunity').innerHTML  = pagingPcCommunity; 
                  document.getElementById('pagingMobileCommunity').innerHTML  = pagingMobileCommunity;  
 
                })                    
              }).catch(error => console.log(error));
            
            })                    
          }).catch(error => console.log(error));
        
        })                    
      }).catch(error => console.log(error));
    
    })                    
  }).catch(error => console.log(error));

  // document.getElementById('htmlInput').innerHTML  = htmlInput;  
}


function searchKeywordInner(){

  console.log(document.getElementById('searchInner').value)
  if(document.getElementById('searchInner')?.value?.length > 0){
    location.href=`../search/search.html?search=${document.getElementById('searchInner')?.value}`;
  }else{
     location.href=`../search/search.html?search=`;
  }
} 

function enterSearchKeywordInner(e){
  if(e.keyCode==13){
    searchKeywordInner()
  }    
}