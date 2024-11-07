document.addEventListener("DOMContentLoaded", () => {
  if(window.location.pathname.indexOf("/magazine/feature") >= 0) getDetail();
  else if(window.location.pathname.indexOf("/magazine/magazine") >= 0) get();
  else if(window.location.pathname.indexOf("/magazine/news") >= 0) getDetailNews();    
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
  },2000);
});

function get(page = 0, size = 12, category=null){
  // let size = 10
  let url = baseUrl + "/magazines?state=0,3&isRanking=1&sort=popularity&offset=0&limit=2&startDate=" + new Date().toISOString();     
  if(category !== null){
    url += "&category="+category;    
  } 
  
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((response) => {
        let tab= "";
        let gridPc= "";
        let gridMobile= "";
        let data = response.data.magazines;

        tab = `<li class="content-tab-menu-box-item ${category===null?'active':''}">
                <button type="button" class="content-tab-menu-box-btn" onclick="get(${page},${size})">
                  <span>전체 보기</span>
                </button>
                <!-- <a href="javascript:void(0);" class="content-tab-menu-box-btn">
                    <span>전체</span>
                  </a> -->
              </li>
              <li class="content-tab-menu-box-item ${category===0?'active':''}">
                <button type="button" class="content-tab-menu-box-btn" onclick="get(${page},${size}, 0)">
                  <span>캠퍼스</span>
                </button>
              </li>
              <li class="content-tab-menu-box-item ${category===1?'active':''}">
                <button type="button" class="content-tab-menu-box-btn" onclick="get(${page},${size}, 1)">
                  <span>라이프스타일</span>
                </button>
              </li>
              <li class="content-tab-menu-box-item ${category===2?'active':''}">
                <button type="button" class="content-tab-menu-box-btn" onclick="get(${page},${size}, 2)">
                  <span>커리어</span>
                </button>
              </li>`;          

        for( let i = 0;  i <data.length; i++){
        //   // console.log('${values.title}'+ JSON.stringify(values))
          gridPc+=`<div class="article-info-box">
                <a href="../magazine/feature.html?id=${data[i].id}&category=${data[i].category}" class="article-info-box-btn">
                  <div class="image-box">
                    ${data[i].file1?'<img src="'+data[i].file1+'" alt="썸네일" />':''}
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
          gridMobile+=`<div class="swiper-slide">
                  <div class="article-info-box">
                    <a href="../magazine/feature.html?id=${data[i].id}&category=${data[i].category}" class="article-info-box-btn">
                      <div class="image-box">
                        ${data[i].file1?'<img src="'+data[i].file1+'" alt="썸네일" />':''}
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
                  </div>
                </div>`;    
          
        }          
        document.getElementById('tab').innerHTML  = tab;   
        document.getElementById('grid-pc').innerHTML  = gridPc;     
        document.getElementById('grid-mobile').innerHTML  = gridMobile;          

      })                    
    }).catch(error => console.log(error));

  // 배너
  url = baseUrl + "/banners?category=2&state=0,3&offset=0&limit=999&startDate=" + new Date().toISOString()+ "&endDate=" + new Date().toISOString();     
  fetch(url, headers.json_headers)
  .then((response) => {
    checkError(response.status);
    response.json().then((response) => {
      let html= "";
      
      let data = response.data.banners;       
      
      if(data.length > 0){
        let index =  Math.floor(Math.random() * (data.length));
                          
        html=`<a href="${data[index].href}" target="_blank" class="banner-link" onclick="get()"></a>
          <div class="banner">
          ${data[index].file1?'<img src="'+data[index].file1+'" class="pc-show" alt="광고 배너" />':''}
          ${data[index].file2?'<img src="'+data[index].file2+'" class="mobile-show" alt="광고 배너" />':''}
          </div>`;  
      }
      
      document.getElementById('banners').innerHTML  = html;                    
    })                    
  }).catch(error => console.log(error));

  url = baseUrl + "/magazines?state=0,3&isRanking=0&offset=" + (page*size) + "&limit=" + size + "&startDate=" + new Date().toISOString();   
  if(category !== null){
    url += "&category="+category;    
  }  
  
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((response) => {
        let grid= "";
        let pagingPc= "";     
        let pagingMobile="";     
        let data = response.data.magazines;
        let total = response.data.total;    
        let numOfPage = total/size;

        for( let i = 0;  i < data.length ; i++){
        // console.log('${values.title}'+ JSON.stringify(values))
          let values = data[i];
          grid+=`<div class="article-info-box">
              <a href="../magazine/feature.html?id=${values?.id}&category=${data[i].category}" class="article-info-box-btn">
                <div class="image-box">
                ${values.file1?'<img src="'+values.file1+'" alt="썸네일" />':''}
                </div>
                <div class="text-box">
                  <div class="subject">${values?.title}</div>
                  <div class="text">${values?.summary}</div>
                  <div class="info">
                    <div class="writer"><span class="name">${values?.nickname}</span> 에디터</div>
                    <div class="date">${values?.startDate?dateToStrCharacterLength(strToDate(values?.startDate), '.', 10):''}</div>
                  </div>
                </div>
              </a>
            </div>`;
        }    

        if(total >size){
          pagingPc =`<button type="button" class="controller prev" ${page > 0 ? 'onclick="get('+(page-1)+','+ size +','+ category + ')"' : ''}>이전으로</button>`;
          pagingMobile=` <button type="button" class="btn medium bg-g4 prev-btn" ${page > 0 ? 'onclick="get('+(page-1)+','+ size +','+ category + ')"' : ''}><i class="icon-box icon-arrow-prev"></i> 이전 페이지</button>`
          
          let j = 0;
          for ( j = 0; j< numOfPage; j++){
            pagingPc +=`<button type="button" class="paging ${page === j?'current':''}" onclick="get(`+j+`,`+ size + `,` + category +  `)">` +  (j+1)  + `</button>`
          }      

          pagingPc +=`<button type="button" class="controller next" ${page < numOfPage-1 ? 'onclick="get(' + (page+1) + ',' +  size +','+ category+ ')"' : ''}>다음으로</button>`;
          pagingMobile+=`<button type="button" class="btn medium bg-g4 next-btn"  ${page < numOfPage-1 ? 'onclick="get('+(page+1)+','+ size+','+ category + ')"' : ''}>다음 페이지 <i class="icon-box icon-arrow-next"></i></button>`;
        }
        
        document.getElementById('grid').innerHTML  = grid;     
        document.getElementById('pagingPc').innerHTML  = pagingPc; 
        document.getElementById('pagingMobile').innerHTML  = pagingMobile;              
      })                    
    }).catch(error => console.log(error));
}

function getDetail(page=1, magazinePage=1){
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

  // let size = 10
  let url = baseUrl + "/magazines?id=" + id;    
  
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((response) => {
        let gridAside= "";       
        let gridArticle= "";       
        let gridArticleDetail= "";       
        let tags= "";      
        let data = response.data.magazines;
       
        gridAside+=`<div class="profile-box">
              <div class="image">
                <!-- 프로필 사진 등록시 image-thumb 추가  -->`;
        if(data[0]?.profilePath > 0){
          gridAside+=`<span class="image-thumb">
                      <img src="${data[0]?.profilePath}" />
                    </span>`
        }
        gridAside+=`</div>
              <div class="info">
                <div class="nickname"><span class="name">${data[0]?.nickname}</span> 에디터</div>
                <div class="address">${data[0]?.email}</div>
              </div>
            </div>
            <div class="info-box">
              <div class="flow">
                <span>매거진</span>
                <i class="icon-box icon-arrow-flow-right">></i>
                <span>${data[0]?.category === 0 ? '캠퍼스' : data[0]?.category === 1 ? '라이프스타일' : '커리어'}</span>
              </div>
              <div class="date">
                <span class="label">작성일</span>
                <span class="text">${data[0]?.startDate?dateToStrCharacterLength(strToDate(data[0]?.startDate), '.', 10):''}</span>
              </div>              
            </div>`;

        gridArticle+=`<div class="flow">
              <span>매거진</span>
              <i class="icon-box icon-arrow-flow-right">></i>
              <span>${data[0]?.category === 0 ? '캠퍼스' : data[0]?.category === 1 ? '라이프스타일' : '커리어'}</span>
            </div>
            <div class="article-report-title">${data[0]?.title}</div>
            <div class="article-report-summary">${data[0]?.summary}</div>
            <div class="profile-box">
              <div class="image">`;

        if(data[0]?.profilePath > 0){
          gridArticle+=`<img src="${data[0]?.profilePath}" alt="프로필 이미지" />`
        }
              
        gridArticle+=`</div>
              <div class="info">
                <div class="nickname"><span class="name">${data[0]?.nickname}</span> 에디터</div>
                <div class="address">${data[0]?.email}</div>
              </div>
            </div>
            <div class="info-box">
              <div class="date">
                <span class="label">작성일</span>
                <span class="text">${data[0]?.startDate?dateToStrCharacterLength(strToDate(data[0]?.startDate), '.', 10):''}</span>
              </div>              
            </div>`;
            
        gridArticleDetail+=`<!-- 링크 포함 텍스트 -->
            <div>
              ${data[0]?.content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />")}
            </div>
            <!-- //링크 포함 텍스트 -->

            <!-- 공백 -->
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <!-- //공백 -->

            <!-- 유튜브 영상 캡션글 -->`;

         if(data[0]?.youtubeUrl != null){
          gridArticleDetail+=`<div class="iframe-video-box">
              <div class="video">
                <iframe id="youtube" src="${data[0]?.youtubeUrl}" frameborder="0" allowfullscreen="" allow="accelerometer" scrolling="no"></iframe>
              </div>            
            </div>
          <!-- 유튜브 영상 캡션글 -->            

          <!-- 공백 -->
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <!-- //공백 -->`;
        }

        if(data[0]?.instagramUrl != null){              
          gridArticleDetail+=`<!-- 인스타그램 캡션글 -->
            <div class="iframe-instar-box">
              <div class="instar">
                <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="${data[0]?.instagramUrl}" data-instgrm-version="14" style="background: #fff; border: 0; border-radius: 3px; box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.5), 0 1px 10px 0 rgba(0, 0, 0, 0.15); margin: 1px; max-width: 540px; min-width: 326px; padding: 0; width: 99.375%; width: -webkit-calc(100% - 2px); width: calc(100% - 2px)">
                  <div style="padding: 16px">
                    <a href="${data[0]?.instagramUrl}" style="background: #ffffff; line-height: 0; padding: 0 0; text-align: center; text-decoration: none; width: 100%" target="_blank">
                      <div style="display: flex; flex-direction: row; align-items: center">
                        <div style="background-color: #f4f4f4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px"></div>
                        <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center">
                          <div style="background-color: #f4f4f4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px"></div>
                          <div style="background-color: #f4f4f4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px"></div>
                        </div>
                      </div>
                      <div style="padding: 19% 0"></div>
                      <div style="display: block; height: 50px; margin: 0 auto 12px; width: 50px">
                        <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink">
                          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                              <g>
                                <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </div>
                      <div style="padding-top: 8px">
                        <div style="color: #3897f0; font-family: Arial, sans-serif; font-size: 14px; font-style: normal; font-weight: 550; line-height: 18px">Instagram에서 이 게시물 보기</div>
                      </div>
                      <div style="padding: 12.5% 0"></div>
                      <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center">
                        <div>
                          <div style="background-color: #f4f4f4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px)"></div>
                          <div style="background-color: #f4f4f4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px"></div>
                          <div style="background-color: #f4f4f4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px)"></div>
                        </div>
                        <div style="margin-left: 8px">
                          <div style="background-color: #f4f4f4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px"></div>
                          <div style="width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div>
                        </div>
                        <div style="margin-left: auto">
                          <div style="width: 0px; border-top: 8px solid #f4f4f4; border-right: 8px solid transparent; transform: translateY(16px)"></div>
                          <div style="background-color: #f4f4f4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px)"></div>
                          <div style="width: 0; height: 0; border-top: 8px solid #f4f4f4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px)"></div>
                        </div>
                      </div>
                      <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px">
                        <div style="background-color: #f4f4f4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px"></div>
                        <div style="background-color: #f4f4f4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px"></div>
                      </div>
                    </a>
                    <p style="color: #c9c8cd; font-family: Arial, sans-serif; font-size: 14px; line-height: 17px; margin-bottom: 0; margin-top: 8px; overflow: hidden; padding: 8px 0 7px; text-align: center; text-overflow: ellipsis; white-space: nowrap">
                      <a href="${data[0]?.instagramUrl}" style="color: #c9c8cd; font-family: Arial, sans-serif; font-size: 14px; font-style: normal; font-weight: normal; line-height: 17px; text-decoration: none" target="_blank">${data[0].nickname}님의 공유 게시물</a>
                    </p>
                  </div>
                </blockquote>
                <script async src="//www.instagram.com/embed.js"></script>
              </div>
             
            </div>
            <!-- //인스타그램 캡션글 -->
            <!-- 공백 -->
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <!-- //공백 -->`;
        }

        let header = 1;
        let footer = 0;
        for(let i=0;i<data[0]?.tags?.split(',').length;i++){
          if(data[0]?.tags?.split(',')[i].length > 0 ){
            footer = 1;
            if(header===1){
              tags+=`<div class="tag-box">`;
              header = 0;
            }  
            
            if(data[0]?.tags.split(',')[i].trim() === '애드벌토리얼'){
              tags+=`<span class="fc-red">#${data[0]?.tags.split(',')[i].trim()}</span>`;
            }else{
              tags+=`<span>#${data[0]?.tags.split(',')[i].trim()}</span>`;
            }  
          }
                       
          if(i === data[0]?.tags?.split(',').length -1 && footer == 1){
            tags+=`</div>`;  
          }        
        }    

        document.getElementById('gridAside').innerHTML  = gridAside; 
        document.getElementById('gridArticle').innerHTML  = gridArticle;
        document.getElementById('gridArticleDetail').innerHTML  = gridArticleDetail;
        document.getElementById('tags').innerHTML  = tags;
        document.getElementById('floating-like').innerHTML = `<button class="floating-toolbar-btn active-btn like-btn ${data[0]?.isLiked  > 0 ? 'check':''}" onclick="postFlagFloating(0, 'feature', ${data[0].isLiked > 0 ? 1 : 0})"><i class="icon-box icon-like"></i>좋아요</button>`;
        document.getElementById('floating-save').innerHTML = `<button class="floating-toolbar-btn active-btn save-btn ${data[0]?.isSaved  > 0 ? 'check':''}" onclick="postFlagFloating(1, 'feature', ${data[0].isSaved > 0 ? 1 : 0})"><i class="icon-box icon-bookmark"></i>저장하기</button>`;
      })                    
   
      url = baseUrl + "/banners?category=3&state=0,3&offset=0&limit=999&startDate=" + new Date().toISOString()+ "&endDate=" + new Date().toISOString();       
    
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((response) => {
          let data = response.data.banners;        
          let banners= "";    
          
          if(data.length > 0){
            let index =  Math.floor(Math.random() * (data.length));               

            banners=`<a href="${data[index]?.href}" target="_blank" class="banner-link" onclick="getDetail(${(page)}, ${(magazinePage)})"></a>
              <div class="banner">
              ${data[index].file1?'<img src="'+data[index].file1+'" class="pc-show" alt="광고 배너" />':''}
              ${data[index].file2?'<img src="'+data[index].file2+'" class="mobile-show" alt="광고 배너" />':''}
              </div>`;  
          }
      
          document.getElementById('banners').innerHTML  = banners;        
        })                    
      }).catch(error => console.log(error));
      let size = 20;
      url = baseUrl + "/magazine-comments?state=0&magazineId="+id+"&offset=0&limit=" + (page*size);  

      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((response) => {
          let data = response.data.comments;     
          let total = response.data.total;             
         
          let meInfo = '';
          
          if(window.localStorage.getItem('me')){
            meInfo = JSON.parse(window.localStorage.getItem('me'));
          }
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
                  
                if(window.localStorage.getItem('me')){
                comments+=`</div>
                  <div class="comment-box">
                    <div class="info-box">
                      <div class="name">${data[i].nickname}</div>
                      <div class="date">${data[i]?.lastDate?dateToStrCharacterLength(strToDate(data[i]?.lastDate), '.', 16):''}</div>
                      <div class="like-box">
                        <!-- active-btn 클래스 추가 상태에서 like-btn 클릭 시 효과 적용 -->
                        <button type="button" class="active-btn like-btn ${data[i].isLiked===1 ? 'check' : ''}" onclick="${data[i].isLiked==1? 'postFlagCancel('+id+',' + data[i].id+',' + page+')' : 'postFlag('+id+',' + data[i].id+',' + page+')'}">
                          <i class="icon-box icon-like">좋아요</i>
                        </button>
                        <span class="number">${numberWithCommas(data[i].likeCount)}</span>
                      </div>
                    </div>
                    <div class="comment">${data[i].content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />")}</div>
                  </div>
                </div>`; 
                }else{
                  comments+=`</div>
                  <div class="comment-box">
                    <div class="info-box">
                      <div class="name">${data[i].nickname}</div>
                      <div class="date">${data[i]?.lastDate?dateToStrCharacterLength(strToDate(data[i]?.lastDate), '.', 16):''}</div>
                      <div class="like-box">
                        <!-- active-btn 클래스 추가 상태에서 like-btn 클릭 시 효과 적용 -->
                        <button type="button" class="active-btn like-btn ${data[i].isLiked===1 ? 'check' : ''}" onclick="javascript:layerPopup.openPopup('loginInfoPopup')">
                          <i class="icon-box icon-like">좋아요</i>
                        </button>
                        <span class="number">${numberWithCommas(data[i].likeCount)}</span>
                      </div>
                    </div>
                    <div class="comment">${data[i].content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />")}</div>
                  </div>
                </div>`; 
                }                       
               
              }
             
              if(total > page*size){
                comments+=` <div class="btn-wrap">
                        <button type="button" class="add-btn" onclick="getDetail(${(page+1)}, ${(magazinePage)})"><i class="icon-box icon-arrow-black-down">화살표</i><span class="underline">더보기</span></button>
                      </div>`
              }  


              if(window.localStorage.getItem('me')){
                commentsButton = `<div class="textarea-box">
                <textarea  id="comment-input" class="form-textarea full sm" placeholder="댓글을 입력해 주세요."></textarea>
                <label for="" class="info-text">다른 사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현이나 다른 사람의 권리를 침해하는 내용은 강제 삭제될 수 있습니다.</label>
              </div>
              <button type="button" class="btn" onclick="post(${(id)}, ${(page)})">댓글 쓰기</button>`;
                }else{
                  commentsButton = `<div class="textarea-box">
                  <textarea  id="comment-input" class="form-textarea full sm" placeholder="댓글을 입력해 주세요."></textarea>
                  <label for="" class="info-text">다른 사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현이나 다른 사람의 권리를 침해하는 내용은 강제 삭제될 수 있습니다.</label>
                </div>
                <button type="button" class="btn"  onclick="javascript:layerPopup.openPopup('loginInfoPopup2')">댓글 쓰기</button>`;
                }      
                
              document.getElementById('commentsTotal').innerHTML  = '댓글 '+total+'개';       
              document.getElementById('comments').innerHTML  = comments;   
              document.getElementById('comments-button').innerHTML  = commentsButton;     
            })                    
          }).catch(error => console.log(error));
      
      //   });
      // });

      magizineSize = 4;
      url = baseUrl + "/magazines?state=0,3&isRanking=0&offset=0&limit="+(magazinePage*magizineSize+1)+"&startDate=" + new Date().toISOString();  

      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((response) => {
          let data = response.data.magazines;     
          let total = response.data.total;               
          let article= "";    
          let articlePaging= "";    
          let viewCount = 0;        

          for(let i=0;i< data.length ;i++){
            if(data[i].id != id){
            article+=`<div class="article-info-box">
                <a href="../magazine/feature.html?id=${data[i].id}&category=${data[i].category}" class="article-info-box-btn">
                  <div class="image-box">
                  ${data[i].file1?'<img src="'+data[i].file1+'" alt="썸네일" />':''}
                  </div>
                  <div class="text-box">
                    <div class="subject">${data[i]?.title}</div>
                    <div class="text">${data[i]?.summary}</div>
                    <div class="info">
                      <div class="writer"><span class="name">${data[i]?.nickname}</span> 에디터</div>
                      <div class="date">${data[i]?.startDate?dateToStrCharacterLength(strToDate(data[i]?.startDate), '.', 10)+'.':''}</div>
                    </div>
                  </div>
                </a>
              </div>`;  
              viewCount++;
            }

            if(viewCount == (magazinePage*magizineSize)){
              break;              
            }            
          }
      
          if(total > magazinePage*magizineSize){
            articlePaging+=`<button type="button" class="btn medium border full" onclick="getDetail(${(page)}, ${(magazinePage+1)})">더보기</button>`;
          }  

          document.getElementById('article').innerHTML  = article;        
          document.getElementById('articlePaging').innerHTML  = articlePaging;        
        })                    
      }).catch(error => console.log(error));
      
    }).catch(error => console.log(error));
}


function getDetailNews(page=1, magazinePage=1){
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

  // let size = 10
  let url = baseUrl + "/magazines?id=" + id;    
  
    fetch(url, headers.json_headers)
    .then((response) => {
      checkError(response.status);
      response.json().then((response) => {
        let gridAside= "";       
        let gridArticle= "";       
        let gridArticleDetail= ""; 
        let gridArticleDetailText="";      
        let tags= "";      
        let data = response.data.magazines;
       
        gridAside+=`<div class="profile-box">
              <div class="image">
                <!-- 프로필 사진 등록시 image-thumb 추가  -->`;
        if(data[0]?.profilePath > 0){
          gridAside+=`<span class="image-thumb">
                      <img src="${data[0]?.profilePath}" />
                    </span>`
        }
        gridAside+=`</div>
              <div class="info">
                <div class="nickname"><span class="name">${data[0]?.nickname}</span> 에디터</div>
                <div class="address">${data[0]?.email}</div>
              </div>
            </div>
            <div class="info-box">
              <div class="flow">
                <span>매거진</span>
                <i class="icon-box icon-arrow-flow-right">></i>
                <span>${data[0]?.category === 0 ? '캠퍼스' : data[0]?.category === 1 ? '라이프스타일' : '커리어'}</span>
              </div>
              <div class="date">
                <span class="label">작성일</span>
                <span class="text">${data[0]?.startDate?dateToStrCharacterLength(strToDate(data[0]?.startDate), '.', 10):''}</span>
              </div>              
            </div>`;

        gridArticle+=`<div class="flow">
              <span>매거진</span>
              <i class="icon-box icon-arrow-flow-right">></i>
              <span>${data[0]?.category === 0 ? '캠퍼스' : data[0]?.category === 1 ? '라이프스타일' : '커리어'}</span>
            </div>
            <div class="article-report-title">${data[0]?.title}</div>
            <div class="article-report-summary">${data[0]?.summary}</div>
            <div class="profile-box">
              <div class="image">`;

        if(data[0]?.profilePath > 0){
          gridArticle+=`<img src="${data[0]?.profilePath}" alt="프로필 이미지" />`
        }
              
        gridArticle+=`</div>
              <div class="info">
                <div class="nickname"><span class="name">${data[0]?.nickname}</span> 에디터</div>
                <div class="address">${data[0]?.email}</div>
              </div>
            </div>
            <div class="info-box">
              <div class="date">
                <span class="label">작성일</span>
                <span class="text">${data[0]?.startDate?dateToStrCharacterLength(strToDate(data[0]?.startDate), '.', 10):''}</span>
              </div>              
            </div>`;

        if(data[0]?.file1 != null){
          gridArticleDetail+=`<img src="${data[0]?.file1}" alt="" />`;
          }
            
        gridArticleDetailText+=data[0]?.content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />");
         
        let header = 1;
        let footer = 0;
        for(let i=0;i<data[0]?.tags?.split(',').length;i++){
          if(data[0]?.tags?.split(',')[i].length > 0 ){
            footer = 1;
            if(header===1){
              tags+=`<div class="tag-box">`;
              header = 0;
            }  
            
            if(data[0]?.tags.split(',')[i].trim() === '애드벌토리얼'){
              tags+=`<span class="fc-red">#${data[0]?.tags.split(',')[i].trim()}</span>`;
            }else{
              tags+=`<span>#${data[0]?.tags.split(',')[i].trim()}</span>`;
            }  
          }
                       
          if(i === data[0]?.tags?.split(',').length -1 && footer == 1){
            tags+=`</div>`;  
          }        
        }       

        document.getElementById('gridAside').innerHTML  = gridAside; 
        document.getElementById('gridArticle').innerHTML  = gridArticle;
        document.getElementById('gridArticleDetail').innerHTML  = gridArticleDetail;
        document.getElementById('gridArticleDetailText').innerHTML  = gridArticleDetailText;
        document.getElementById('tags').innerHTML  = tags;
        document.getElementById('floating-like').innerHTML = `<button class="floating-toolbar-btn active-btn like-btn ${data[0]?.isLiked  > 0 ? 'check':''}" onclick="postFlagFloating(0, 'news', ${data[0].isLiked > 0 ? 1 : 0})"><i class="icon-box icon-like"></i>좋아요</button>`;
        document.getElementById('floating-save').innerHTML = `<button class="floating-toolbar-btn active-btn save-btn ${data[0]?.isSaved  > 0  ? 'check':''}" onclick="postFlagFloating(1, 'news', ${data[0].isSaved > 0 ? 1 : 0})"><i class="icon-box icon-bookmark"></i>저장하기</button>`;

      })

      url = baseUrl + "/banners?category=3&state=0,3&offset=0&limit=999&startDate=" + new Date().toISOString()+ "&endDate=" + new Date().toISOString();       
    
      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((response) => {
          let data = response.data.banners;        
          let banners= "";    
          
          if(data.length > 0){
            let index =  Math.floor(Math.random() * (data.length));               

            banners=`<a href="${data[index]?.href}" target="_blank" class="banner-link" onclick="getDetail(${(page)}, ${(magazinePage)})"></a>
              <div class="banner">
              ${data[index].file1?'<img src="'+data[index].file1+'" class="pc-show" alt="광고 배너" />':''}
              ${data[index].file2?'<img src="'+data[index].file2+'" class="mobile-show" alt="광고 배너" />':''}
              </div>`;  
          }
      
          document.getElementById('banners').innerHTML  = banners;        
        })                    
      }).catch(error => console.log(error));

      let size = 20;
      url = baseUrl + "/magazine-comments?state=0&magazineId="+id+"&offset=0&limit=" + (page*size);  

      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((response) => {
          let data = response.data.comments;     
          let total = response.data.total;             
         
          let meInfo = '';
          
          if(window.localStorage.getItem('me')){
            meInfo = JSON.parse(window.localStorage.getItem('me'));
          }
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
                  
                if(window.localStorage.getItem('me')){
                comments+=`</div>
                  <div class="comment-box">
                    <div class="info-box">
                      <div class="name">${data[i].nickname}</div>
                      <div class="date">${data[i]?.lastDate?dateToStrCharacterLength(strToDate(data[i]?.lastDate), '.', 16):''}</div>
                      <div class="like-box">
                        <!-- active-btn 클래스 추가 상태에서 like-btn 클릭 시 효과 적용 -->
                        <button type="button" class="active-btn like-btn ${data[i].isLiked===1 ? 'check' : ''}" onclick="${data[i].isLiked==1? 'postFlagCancel('+id+',' + data[i].id+',' + page+')' : 'postFlag('+id+',' + data[i].id+',' + page+')'}">
                          <i class="icon-box icon-like">좋아요</i>
                        </button>
                        <span class="number">${numberWithCommas(data[i].likeCount)}</span>
                      </div>
                    </div>
                    <div class="comment">${data[i].content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />")}</div>
                  </div>
                </div>`; 
                }else{
                  comments+=`</div>
                  <div class="comment-box">
                    <div class="info-box">
                      <div class="name">${data[i].nickname}</div>
                      <div class="date">${data[i]?.lastDate?dateToStrCharacterLength(strToDate(data[i]?.lastDate), '.', 16):''}</div>
                      <div class="like-box">
                        <!-- active-btn 클래스 추가 상태에서 like-btn 클릭 시 효과 적용 -->
                        <button type="button" class="active-btn like-btn ${data[i].isLiked===1 ? 'check' : ''}" onclick="javascript:layerPopup.openPopup('loginInfoPopup')">
                          <i class="icon-box icon-like">좋아요</i>
                        </button>
                        <span class="number">${numberWithCommas(data[i].likeCount)}</span>
                      </div>
                    </div>
                    <div class="comment">${data[i].content.replaceAll('\r\n',"<br />").replaceAll('\n',"<br />")}</div>
                  </div>
                </div>`; 
                }                       
               
              }
             
              if(total > page*size){
                comments+=` <div class="btn-wrap">
                        <button type="button" class="add-btn" onclick="getDetail(${(page+1)}, ${(magazinePage)})"><i class="icon-box icon-arrow-black-down">화살표</i><span class="underline">더보기</span></button>
                      </div>`
              }  


              if(window.localStorage.getItem('me')){
                commentsButton = `<div class="textarea-box">
                <textarea  id="comment-input" class="form-textarea full sm" placeholder="댓글을 입력해 주세요."></textarea>
                <label for="" class="info-text">다른 사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현이나 다른 사람의 권리를 침해하는 내용은 강제 삭제될 수 있습니다.</label>
              </div>
              <button type="button" class="btn" onclick="post(${(id)}, ${(page)})">댓글 쓰기</button>`;
                }else{
                  commentsButton = `<div class="textarea-box">
                  <textarea  id="comment-input" class="form-textarea full sm" placeholder="댓글을 입력해 주세요."></textarea>
                  <label for="" class="info-text">다른 사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현이나 다른 사람의 권리를 침해하는 내용은 강제 삭제될 수 있습니다.</label>
                </div>
                <button type="button" class="btn"  onclick="javascript:layerPopup.openPopup('loginInfoPopup2')">댓글 쓰기</button>`;
                }      
                
              document.getElementById('commentsTotal').innerHTML  = '댓글 '+total+'개';       
              document.getElementById('comments').innerHTML  = comments;   
              document.getElementById('comments-button').innerHTML  = commentsButton;     
            })                    
          }).catch(error => console.log(error));
      
      //   });
      // });

      magizineSize = 4;
      url = baseUrl + "/magazines?state=0,3&isRanking=0&offset=0&limit="+(magazinePage*magizineSize+1)+"&startDate=" + new Date().toISOString();  

      fetch(url, headers.json_headers)
      .then((response) => {
        checkError(response.status);
        response.json().then((response) => {
          let data = response.data.magazines;     
          let total = response.data.total;               
          let article= "";    
          let articlePaging= "";
          let viewCount = 0;
          
          for(let i=0;i< data.length;i++){
            if(data[i].id != id){
              article+=`<div class="article-info-box">
                <a href="../magazine/${data[i]?.file2 == null ? 'news':'feature'}.html?id=${data[i].id}&category=${data[i].category}" class="article-info-box-btn">
                  <div class="image-box">
                  ${data[i].file1?'<img src="'+data[i].file1+'" alt="썸네일" />':''}
                  </div>
                  <div class="text-box">
                    <div class="subject">${data[i]?.title}</div>
                    <div class="text">${data[i]?.summary}</div>
                    <div class="info">
                      <div class="writer"><span class="name">${data[i]?.nickname}</span> 에디터</div>
                      <div class="date">${data[i]?.startDate?dateToStrCharacterLength(strToDate(data[i]?.startDate), '.', 10)+'.':''}</div>
                    </div>
                  </div>
                </a>
              </div>`;  
              viewCount++;
            }

            if(viewCount == (magazinePage*magizineSize)){
              break;              
            }    
          }
      
          if(total > magazinePage*magizineSize){
            articlePaging+=`<button type="button" class="btn medium border full" onclick="getDetail(${(page)}, ${(magazinePage+1)})">더보기</button>`;
          }  

          document.getElementById('article').innerHTML  = article;        
          document.getElementById('articlePaging').innerHTML  = articlePaging;        
        })                    
      }).catch(error => console.log(error));
      
    }).catch(error => console.log(error));
}

function post(id, page) {
  let url = baseUrl + "/magazine-comment/register";  
  let comment_input = document.getElementById("comment-input").value;

  if(checkBanWord(comment_input)){
    layerPopup.openPopup('loginInfoPopup7')    
  }else{
    if(comment_input.length > 0){
      let params = {
        magazineId: id,
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
}

function postFlag(id, commentId, page) {
  let url = baseUrl + "/magazine-flag/register";    
 
  let params = {
    magazineId: id,
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


function postFlagCancel(id, commentId, page) {
  let url = baseUrl + "/magazine-flag";    
 
  let params = {
    magazineId: id,
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


function postFlagFloating(type, menu, state) {
  if(!window.localStorage.getItem('me')){      
    if(type=0) layerPopup.openPopup('loginInfoPopup');
    else  layerPopup.openPopup('loginInfoPopup3');
  }else{
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

    if(state == 0){

      let url = baseUrl + "/magazine-flag/register";    

      let params = {
        magazineId: id,
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
            document.getElementById('floating-like').innerHTML = `<button class="floating-toolbar-btn active-btn like-btn ${state == 0? 'check':''}" onclick="postFlagFloating(0, '${menu}', ${state == 0 ? 1 : 0})"><i class="icon-box icon-like"></i>좋아요</button>`;
          }else{
            document.getElementById('floating-save').innerHTML = `<button class="floating-toolbar-btn active-btn save-btn ${state == 0 ? 'check':''}" onclick="postFlagFloating(1, '${menu}', ${state == 0 ? 1 : 0})"><i class="icon-box icon-bookmark"></i>저장하기</button>`;
            layerPopup.openPopup('loginInfoPopup6');
          }
        }).catch(error => {if(error.message === '401') logout() });
        
        } catch (error) {
          console.error("Error:", error);
        }      
      }

      post(requestPost);
    }else{
      let url = baseUrl + "/magazine-flag";    

      let params = {
        magazineId: id,
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
            document.getElementById('floating-like').innerHTML = `<button class="floating-toolbar-btn active-btn like-btn ${state == 0? 'check':''}" onclick="postFlagFloating(0, '${menu}', ${state == 0 ? 1 : 0})"><i class="icon-box icon-like"></i>좋아요</button>`;
          }else{
            document.getElementById('floating-save').innerHTML = `<button class="floating-toolbar-btn active-btn save-btn ${state == 0 ? 'check':''}" onclick="postFlagFloating(1, '${menu}', ${state == 0 ? 1 : 0})"><i class="icon-box icon-bookmark"></i>저장하기</button>`;
          }
        }).catch(error => {if(error.message === '401') logout() });
        
        } catch (error) {
          console.error("Error:", error);
        }      
      }

      _post(requestPost);
    }
    }
}

function shareX() {
  let u = window.location.href;
  window.open("https://twitter.com/share?url=" + u);
}

function clipboard(){
  navigator.clipboard.writeText(window.location.href);
}