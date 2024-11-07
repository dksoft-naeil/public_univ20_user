// 스크롤바 있는지 체크
$.fn.hasScrollBar = function () {
  return (this.prop('scrollHeight') == 0 && this.prop('clientHeight') == 0) || this.prop('scrollHeight') > this.prop('clientHeight');
};

(function (exports) {
  var $selectric; // 셀렉트릭
  var sliderArr = []; // 슬라이드 배열

  $(document).ready(function () {
    // ------------------------ 공통 함수 실행 -----------------------------//
    // 셀렉트박스
    selectric();
    // 헤더 스크롤감지
    scrollHeader();
    // 아코디언 핸들러
    accordionHandler();
    // input active 핸들러
    inputActiveHandler();
    // 달력
    datePicker();
    // 최상단버튼
    floatBtnTop();
    // 스크롤 애니메이션
    scrollAnimation();
    // 탭 컨텐츠
    tabContentController();
    // 평점 선택
    ratingSelectHandler();
    // 셀렉트박스 float
    selectboxFloat();
    // 폼 관련 스크립트
    formScript();
    // 글자수 표시 및 제한
    textLengthCheck();
    // 헤더 높이 감지 컨텐츠간격
    // contentSpaceFn();
    // 숫자 카운팅
    // numberCounter('.number-count');
    // 매거진, 20's voice 탭 메뉴 효과
    contentTabMenuHandler();
    // 댓글 좋아요 클릭
    commentLikeEvent();
    // 웹진 좋아요 클릭
    webzineLikeEvent();
    // toolbarHanlder 툴바
    toolbarHandler();
    // 다크모드
    darkModeHandler.Handler();
    // selectBoxColorChange
    selectBoxColorChange();
    // floatingBoxHandler
    floatingBoxHandler();
    // commentInfoText
    commentInfoText();
    // scrollToolbar
    // scrollToolbar(); //퍼블만 적용

    // ------------------------ ui 함수 실행 -----------------------------//
    // 슬라이드
    sliderMaker();
  });

  // ------------------------ 모바일 100vh -----------------------------//
  function mobilevh() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  // ------------------------ 코멘트 안내 텍스트 -----------------------------//
  function commentInfoText() {
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
  }

  // ------------------------ 플로팅 박스 -----------------------------//
  function floatingBoxHandler() {
    if (!$('.floating-box').length) return;

    // 닫기 버튼
    $('.floating-box .close-btn').on('click', function () {
      $(this).closest('.floating-box').removeClass('show');
      $(this).closest('.floating-box').addClass('close');
    });

    // 제보하기 위젯
    function scrollWidget() {
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
    }

    scrollWidget();
  }

  // ------------------------ 셀렉트 박스 컬러 채인지 -----------------------------//
  function selectBoxColorChange() {
    if (!$('.select-box-container-box').length) return;

    $('.select-box-container-box .form-select').change(function () {
      if ($(this).find('option:selected').index() > 0 && $(this).hasClass('disable-color')) {
        $(this).removeClass('disable-color');
      } else if ($(this).find('option:selected').index() === 0) {
        $(this).addClass('disable-color');
      }
    });
  }

  // ------------------------ 툴바 -----------------------------//
  function toolbarHandler() {
    if (!$('.floating-toolbar').length) return;

    // 클릭 효과
    $('.floating-toolbar .active-btn')
      .off()
      .on('click', function () {
        if (!$(this).hasClass('check')) {
          $(this).addClass('check');
        } else if ($(this).hasClass('check')) {
          $(this).removeClass('check');
        }
      });

    // sns 공유
    $('.floating-toolbar .share-btn')
      .off()
      .on('click', function () {
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

    // 최상단 이동 버튼
    $('.top-go-btn').on('click', function () {
      $('html, body').stop().animate({scrollTop: 0}, 300);
    });
  }

  // scrollToolbar
  function scrollToolbar() {
    scrollToolbarFn();

    // 스크롤 없는 경우
    if (!$('html').hasScrollBar()) {
      $('.floating-toolbar').addClass('show inside');
    }

    $(window).on('scroll', function () {
      scrollToolbarFn();
    });

    function scrollToolbarFn() {
      let endOffset = Math.floor($('#footer').offset().top + $('#footer').innerHeight() - $(window).innerHeight());
      var _sct = $(window).scrollTop();

      if (_sct >= 0) {
        $('.floating-toolbar').addClass('show');
        $('.floating-toolbar').removeClass('inside');
      } else {
        $('.floating-toolbar').removeClass('show');
      }
      if (_sct >= endOffset) {
        $('.floating-toolbar').removeClass('show');
      }
    }
  }

  // ------------------------ 웹진 좋아요 클릭 -----------------------------//
  function webzineLikeEvent() {
    if (!$('.webzine-info-box').length) return;

    $('.webzine-info-box .active-btn.like-btn').on('click', function () {
      if (!$(this).hasClass('check')) {
        $(this).addClass('check');
      } else if ($(this).hasClass('check')) {
        $(this).removeClass('check');
      }
    });
  }

  // ------------------------ 댓글 좋아요 클릭 -----------------------------//
  function commentLikeEvent() {
    if (!$('.comment-content-box-body').length) return;

    // 댓글 좋아요 클릭
    $('.comment-content-box-body .active-btn.like-btn').on('click', function () {
      if (!$(this).hasClass('check')) {
        $(this).addClass('check');
      } else if ($(this).hasClass('check')) {
        $(this).removeClass('check');
      }
    });
  }

  // ------------------------ 매거진, 20's voice 탭 메뉴 효과 -----------------------------//
  function contentTabMenuHandler() {
    if (!$('.content-tab-menu-box').length) return;

    $('.content-tab-menu-box-btn').on('click', function () {
      $(this).closest('.content-tab-menu-box-list').find('.content-tab-menu-box-item').removeClass('active');
      $(this).parent('.content-tab-menu-box-item').addClass('active');
    });
  }

  // ------------------------ 다크모드 -----------------------------//
  const darkModeHandler = {
    init: function () {
      let _this = this;
      // const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      sessionStorage.setItem('themeCheck', 'true');
      const firstThemeCheck = sessionStorage.getItem('themeCheck');
      const userTheme = sessionStorage.getItem('theme');

      // 처음 접속 시 테마 적용
      if (isDarkMode && firstThemeCheck) {
        _this.changeDark();
        sessionStorage.setItem('themeCheck', 'false');
      }

      // 새로고침 시 테마 적용
      if (userTheme === 'dark') {
        _this.changeDark();
      } else if (userTheme === 'light') {
        _this.changeLight();
      }
    },
    changeDark: function () {
      let _this = this;
      sessionStorage.setItem('theme', 'dark');
      $('html').addClass('dark');

      // if ($('.profile-box').length) {
      //   _this.changeImage(true);
      // }
    },
    changeLight: function () {
      let _this = this;
      sessionStorage.setItem('theme', 'light');
      $('html').removeClass('dark');

      // if ($('.profile-box').length) {
      //   _this.changeImage(false);
      // }
    },
    Handler: function () {
      let _this = this;
      const $darkModeBtn = $('.dark-mode-btn');

      $darkModeBtn.on('click', function () {
        if (!$('html').hasClass('dark')) {
          _this.changeDark();

          $('#header').addClass('duration');
          $('html').addClass('duration');
        } else {
          _this.changeLight();

          $('#header').addClass('duration');
          $('html').addClass('duration');
        }
      });
    },
    // changeImage: function (value) {
    //   // 프로필 이미지
    //   const url = $('.profile-box .image')
    //     .css('background-image')
    //     .replace(/^url\(['"](.+)['"]\)/, '$1');
    //   const urlImageFirst = url.slice(0, url.lastIndexOf('/') + 1);
    //   const urlImageName = url.substring(url.lastIndexOf('/') + 1).slice(0, url.substring(url.lastIndexOf('/') + 1).lastIndexOf('.'));
    //   const urlImageLast = url.slice(url.indexOf('.'));

    //   if (value) {
    //     $('.profile-box .image').css('background-image', 'url(' + urlImageFirst + urlImageName + '-wh' + urlImageLast + ')');
    //   } else {
    //     $('.profile-box .image').css('background-image', 'url(' + urlImageFirst + urlImageName.replace('-wh', '') + urlImageLast + ')');
    //   }
    // },
  };

  // ------------------------ ui 함수 -----------------------------//
  function sliderMaker() {
    // var exampleSlider = sliderInit('.slider-example', {
    //   loop: false,
    //   // slidesPerView: 2
    //   // centeredSlides: true,
    //   // spaceBetween: 30,
    //   // freeMode: true,
    //   // autoplay: {
    //   //   delay: 1000,
    //   //   disableOnInteraction: false,
    //   //   pauseOnMouseEnter: false,
    //   // },
    //   // autoHeight: true,
    //   pagination: {
    //     el: '.swiper-pagination',
    //     clickable: true,
    //   },
    //   navigation: {
    //     nextEl: '.swiper-button-next',
    //     prevEl: '.swiper-button-prev',
    //   },
    //   breakpoints: {
    //     // 모바일에서 -> pc
    //     360: {
    //       slidesPerView: 2,
    //     },
    //     600: {
    //       slidesPerView: 'auto',
    //     },
    //   },
    // });

    var mainScheduleSlider = sliderInit('.schedule-slider-box', {
      loop: false,
      slidesPerView: 1,
      autoHeight: true,
      speed: 300,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    var webzineSlideBox = sliderInit('.webzine-slide-box', {
      slidesPerView: 'auto',
      // slidesPerView: 1.2,
      spaceBetween: 12,
      // autoHeight: true,
      freeMode: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        // 모바일에서 -> pc
        960: {
          slidesPerView: 'auto',
          spaceBetween: 24,
          freeMode: false,
        },
      },
      on: {
        init: function () {
          $('.webzine-slide-box-wrap .swiper-button-prev').addClass('hide');
          $('.webzine-slide-box-wrap .swiper-button-next').removeClass('hide');
        },

        // 시작 위치
        reachBeginning: function () {
          $('.webzine-slide-box-wrap .swiper-button-prev').addClass('hide');
          $('.webzine-slide-box-wrap .swiper-button-next').removeClass('hide');
        },

        // 마지막 위치
        reachEnd: function () {
          $('.webzine-slide-box-wrap .swiper-button-next').addClass('hide');
          $('.webzine-slide-box-wrap .swiper-button-prev').removeClass('hide');
        },
      },
    });

    var articleHalfSlider = sliderInit('.article-half-slider-box', {
      loop: false,
      slidesPerView: 1,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });

    var bestTopicSlider = sliderInit('.best-topic-slider', {
      loop: false,
      slidesPerView: 'auto',
      freeMode: true,

      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
      },

      breakpoints: {
        // 모바일에서 -> pc
        960: {
          freeMode: false,
        },
      },
    });

    var missionBoardSlider = sliderInit('.mission-board-slider', {
      loop: false,
      slidesPerView: 'auto',
      freeMode: true,

      breakpoints: {
        // 모바일에서 -> pc
        960: {
          freeMode: false,
        },
      },
    });

    var editingCommentSlider = sliderInit('.editing-comment-slider', {
      loop: false,
      slidesPerView: 'auto',
    });
  }
  // ------------------------ ui 함수 -----------------------------//

  // ------------------------ 공통 함수(공통함수의 수정이 필요한 경우 공유 후 작업) ---------------------------//

  function formScript() {
    // input 비밀번호 타입변경
    if ($('.btn-type-change').length) {
      $('.btn-type-change').on('click', function () {
        var $typeChange = $(this).closest('.type-change');
        if (!$(this).hasClass('type-text')) {
          $(this).addClass('type-text');
          $typeChange.find('.form-input').attr('type', 'text');
        } else {
          $(this).removeClass('type-text');
          $typeChange.find('.form-input').attr('type', 'password');
        }
      });
    }
  }

  function aTagHandler() {
    $('body').on('mouseover', 'a', function (e) {
      var $link = $(this),
        href = $link.attr('href') || $link.data('href');

      if (!$link.hasClass('no-cursor')) {
        $(this).css({cursor: 'pointer'});
      }
      if (href) {
        // 아이디로 이동하는경우가 아닌경우
        if (href.indexOf('#') !== 0) {
          $link.off('click.chrome');
          $link
            .on('click.chrome', function () {
              if (href !== 'javascript:void(0);') {
                if ($link.attr('target') === '_blank') {
                  window.open(href, '_blank');
                } else {
                  window.location.href = href;
                }
              } else {
                return false;
              }
            })
            .attr('data-href', href)
            .removeAttr('href');
        }
      } else {
        $link.removeAttr('href');
      }
    });
  }

  function inputReadOnlyHandler() {
    // input 최초 readonly 상태만들고 포커스시 readonly 해제 - edge autocomplete 기능 해제를 위함
    $('.form-input').each(function () {
      // 초기에 readonly값이나 disalbed값이 없는경우만
      if (!$(this).prop('readonly') && !$(this).prop('disabled') && !$(this).hasClass('readonly-input')) {
        $(this).off('focus');
        $(this).prop('readonly', true);
        $(this).on('focus', function () {
          $(this).prop('readonly', false);
        });
      }
    });
  }

  // 타겟 외 클릭시 닫기 함수
  function bodyToggleFn(target, element, callback) {
    $('body').on('click', function (e) {
      if ($(e.target).closest(target).length < 1 && $(e.target).closest(element).length < 1) {
        callback();
      }
    });
  }

  // 셀렉트박스 float
  function selectboxFloat() {
    if (!$('.float-select').length) return;
    $(document).on('change', '.float-select', function () {
      if ($(this).val() !== '') {
        $(this).closest('.select-box-container').addClass('active');
      } else {
        $(this).closest('.select-box-container').removeClass('active');
      }
    });
  }

  var popupScrollInit = 0;
  // 팝업 컨트롤러
  var layerPopup = {
    popupArr: [],
    zIndex: 999,
    // 특정 팝업 열기
    openPopup: function (popupId, dimFlag) {
      var $popupEl = $('#' + popupId);
      var _ = this;
      var $closeBtn = $popupEl.find('.popup-close');
      var $popupContainer = $popupEl.find('.popup-container');
      // 팝업 배열에 담기
      _.popupArr.push($popupEl);

      // 팝업 오픈
      $popupEl.addClass('open').css({
        zIndex: _.zIndex + _.popupArr.length,
      });

      // 팝업 위에 팝업띄울때 dim처리
      if (_.popupArr.length > 1) {
        $popupEl.css('background-color', 'rgba(0,0,0,0.5)');
      }

      // body 스크롤 막기
      // html에 스크롤이 있는경우만
      if ($('html').hasScrollBar()) {
        $('body').css('overflow-y', 'scroll');
      }

      if (_.popupArr.length == 1) {
        popupScrollInit = $(window).scrollTop();
        $('#container').css({
          position: 'fixed',
          top: -$(window).scrollTop(),
          left: 0,
          width: '100%',
        });
      } else {
        $('#container').css({
          position: 'fixed',
          top: -popupScrollInit,
          left: 0,
          width: '100%',
        });
      }

      if (!$('.layer-popup-dim').length) {
        // dim없을경우 생성
        $('body').append('<div class="layer-popup-dim"></div>');
      }

      $('.layer-popup-dim').addClass('show');

      // 팝업닫기 눌렀을때
      $closeBtn.off('click');
      $closeBtn.on('click', function (e) {
        e.preventDefault();
        _.closePopup();
      });

      if (!dimFlag) {
        // dim 클릭시 팝업 전부 닫기
        $popupEl.off('click');
        $popupEl.on('click', function (e) {
          if (!$(e.target).closest($popupContainer).length) {
            _.closePopup();
          }
        });
      }
    },
    // 특정 팝업 닫기
    closePopup: function (popupId) {
      var _ = this;
      var $popupEl = popupId ? $('#' + popupId) : _.popupArr[_.popupArr.length - 1];
      $popupEl.removeClass('open');
      _.popupArr = _.popupArr.filter(function (item) {
        return item.attr('id') !== $popupEl.attr('id');
      });
      if (_.popupArr.length === 0) {
        $('.layer-popup-dim').removeClass('show');
        _.popupCloseInit();
      }
    },
    // 모든 팝업 닫기
    closeAllPopup: function () {
      var _ = this;
      for (var i = 0; i < _.popupArr.length; i++) {
        _.popupArr[i].removeClass('open');
      }
      _.popupArr = [];
      _.popupCloseInit();
      $('.layer-popup-dim').removeClass('show');
    },
    // 팝업 닫을때 초기화
    popupCloseInit: function () {
      var scrollPosition = Math.abs($('#container').css('top').split('px')[0]);
      scrollPosition = !scrollPosition ? $(window).scrollTop() : scrollPosition;
      $('#container').removeAttr('style');
      $(window).scrollTop(scrollPosition);
      $('body').removeAttr('style');
    },
  };

  // 모바일 햄버거 메뉴 컨트롤러
  var mobileMenuController = {
    // 메뉴 하나로 열기&닫기 사용시
    toggle: function (btn, menuName, bodyFlag) {
      $(btn).toggleClass('active');
      $(menuName).toggleClass('open');
      // 기본적으로 body스크롤 금지, true줄경우 body스크롤 허용
      if (!bodyFlag) {
        $('body').toggleClass('scroll-disable');
      }
    },
    // 메뉴 열기
    open: function (btn, menuName, bodyFlag) {
      $(btn).addClass('active');
      $(menuName).addClass('open');
      if (!bodyFlag) {
        $('body').addClass('scroll-disable');
      }
    },
    // 메뉴 닫기
    close: function (btn, menuName, bodyFlag) {
      $(btn).removeClass('active');
      $(menuName).removeClass('open');
      if (!bodyFlag) {
        $('body').removeClass('scroll-disable');
      }
    },
  };

  // 스크롤 이동 함수
  function scrollMoveTo(id, between, speed) {
    var _speed = speed ? speed : 300;
    if (id) {
      var _id = id.replace('#', '');
      if (!$('#' + _id).length) return;
      var offset = $('#' + _id).offset().top;
      var _between = between ? between : 0;
      $('html, body').animate({scrollTop: offset - _between}, _speed);
    } else {
      $('html, body').animate({scrollTop: 0}, _speed);
    }
  }

  function scrollHeader() {
    headerScrollFn();
    $(window).on('scroll', function () {
      headerScrollFn();
    });

    function headerScrollFn() {
      var _sct = $(window).scrollTop();
      if (_sct > 0) {
        $('#header').addClass('scroll');
      } else {
        $('#header').removeClass('scroll');
      }
    }

    // 검색창
    $('.search-control-btn').on('click', function () {
      if (!$('.search-bar-view-box').hasClass('show')) {
        $('.search-bar-view-box').addClass('show');
      } else {
        $('.search-bar-view-box').removeClass('show');
      }
    });

    // 검색창 닫기
    $('.search-bar-view-box .close-btn').on('click', function () {
      $('.search-bar-view-box').removeClass('show');
    });

    // 모바일 메뉴
    $('#header .mobile-menu-btn').on('click', function () {
      if (!$(this).closest('.login-box').find('.menu-box').hasClass('show')) {
        $(this).closest('.login-box').find('.menu-box').addClass('show');
      } else {
        $(this).closest('.login-box').find('.menu-box').removeClass('show');
      }
    });

    let windowWidth = $(window).width();
    let mobileWidth = 960;
    let checkValue = false;

    $(window).resize(function () {
      windowWidth = $(window).width();

      if (windowWidth > mobileWidth && !checkValue) {
        $('#header').find('.menu-box').removeClass('show');
        $('.all-menu-container').removeClass('open');
        checkValue = true;
      }
      if (windowWidth < mobileWidth && checkValue) {
        checkValue = false;
      }
    });
  }

  // 슬라이드 생성
  function sliderInit(element, option) {
    if (!$(element).length) return;

    var slider = new Swiper(element, option);
    if (Array.isArray(slider)) {
      for (var i = 0; i < slider.length; i++) {
        sliderArr.push(slider[i]);
      }
    } else {
      sliderArr.push(slider);
    }
    return slider;
  }

  // 슬라이드 update(새로고침)
  function sliderUpdate() {
    if (sliderArr.length) {
      $.each(sliderArr, function (i) {
        sliderArr[i].update();
      });
    }
  }

  function selectric() {
    $selectric = $('.selectric');
    if (!$selectric.length) return;
    $selectric.selectric({
      nativeOnMobile: false,
      onInit: function (event, selectric) {
        var $this = $(this);
        initSelectric($this, selectric);
      },
      onRefresh: function (event, selectric) {
        var $this = $(this);
        initSelectric($this, selectric);
      },
      onChange: function (el, selectric) {
        // 셀렉트릭 작동시 select박스 change 트리거
        $(this).trigger('change');
        // float 라벨 있을경우
        if ($(this)[0].value) {
          $(this).closest('.selectric-container').removeClass('error init-before').addClass('active');
        } else {
          $(this).closest('.selectric-container').removeClass('active');
          initSelectric($(this), selectric);
        }
      },
      onOpen: function (el) {
        $(el).closest('.selectric-container').addClass('open');
      },
      onClose: function (el) {
        $(el).closest('.selectric-container').removeClass('open');
      },
    });

    // 초기 셋팅 함수
    function initSelectric(target, selectric) {
      // 에러 아이콘 생성
      if (!selectric.elements.outerWrapper.find('.icon-error').length) {
        selectric.elements.wrapper.append('<span class="icon-error"></span>');
      }

      // 필수항목일경우
      if (target.hasClass('required') && !target[0].value) {
        selectric.elements.label.append('<span class="required">*</span>');
      }

      // disabled일 경우
      if (target.prop('disabled')) {
        target.closest('.selectric-container').addClass('disabled');
      } else {
        target.closest('.selectric-container').removeClass('disabled');
      }

      // float 라벨 있을경우
      if (target.hasClass('float')) {
        if (target[0].value) {
          target.closest('.selectric-container').addClass('active').removeClass('init-before');
        } else {
          target.closest('.selectric-container').addClass('init-before');
        }
      }
      // erorr일 경우
      if (target.hasClass('error')) {
        target.closest('.selectric-container').addClass('error');
      } else {
        target.closest('.selectric-container').removeClass('error');
      }
    }
  }

  // 셀렉트릭 새로고침
  function refreshSelectric() {
    $selectric.selectric('refresh');
  }

  function accordionHandler() {
    var accordionContainer = $('.accordion-container');
    if (!accordionContainer.length) return;
    $('body').on('click', '.accordion-header', function () {
      var $this = $(this);
      var _speed = $this.closest('.accordion-container').attr('data-speed');
      _speed = _speed ? parseInt(_speed) : 200;
      accordionFn($this, _speed);
    });
  }

  function accordionFn(el, speed) {
    speed = speed ? speed : 200;
    // 컨테이너에 solo 클래스가 있으면 각각 토글됨
    if (el.closest('.accordion-container').hasClass('solo')) {
      el.closest('.accordion-list').toggleClass('active').find('.accordion-body').stop().slideToggle(speed);
    } else {
      el.closest('.accordion-list').toggleClass('active').find('.accordion-body').stop().slideToggle(speed).closest('.accordion-list').siblings('.accordion-list').removeClass('active').find('.accordion-body').slideUp(speed);
    }
  }

  function tabContentController() {
    var $tabs = $('.ui-tab-item');
    if (!$tabs.length) return;
    $tabs.on('click', function (e) {
      e.preventDefault();
      var $tab = $(this);
      var _id = $tab.find('a').attr('href');

      $tab.addClass('active').siblings('.ui-tab-item').removeClass('active');
      $(_id).show().siblings('.ui-tab-content').hide();
    });
  }

  function inputActiveHandler() {
    var $inputs = $('.input-active');
    if (!$inputs.length) return;

    $inputs.each(function () {
      var $this = $(this);
      var $inputcover = $this.closest('.input-cover');
      if ($this.is('[readonly]') && !$this.hasClass('datepicker-input')) {
        $inputcover.removeClass('active');
        $inputcover.addClass('disable-active');
      } else {
        $inputcover.removeClass('disable-active');
        if ($this.val().length) {
          $inputcover.addClass('active');
        }
      }
    });

    $(document).on('focus change', '.input-active', function (e) {
      var $this = $(this);
      var $inputcover = $this.closest('.input-cover');
      if (!$this.is('[readonly]')) {
        $inputcover.addClass('focus');
        $inputcover.addClass('active');
        $inputcover.removeClass('disable-active');
      }
      if ($this.hasClass('datepicker-input')) {
        $inputcover.addClass('active');
      }
    });

    $(document).on('focusout change', '.input-active', function (e) {
      var $this = $(this);
      var $inputcover = $this.closest('.input-cover');
      var setTimeHandle = setTimeout(function () {
        if (!$this.hasClass('open-datepicker')) {
          $inputcover.removeClass('focus');
          clearTimeout(setTimeHandle);
        }
      }, 100);

      if (!$this.val().length) {
        if (!$this.hasClass('open-datepicker')) {
          $inputcover.removeClass('active');
        }
      }
    });
  }

  function datePicker(el) {
    // https://ui.toast.com/tui-date-picker
    var datePickerArr = [];
    const DatePicker = tui.DatePicker;
    DatePicker.localeTexts['customKey'] = {
      titles: {
        // days
        DD: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
        // daysShort
        D: ['일', '월', '화', '수', '목', '금', '토'],
        // months
        MMMM: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        // monthsShort
        MMM: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      },
      titleFormat: 'yyyy년 MMM',
      todayFormat: 'yyyy년 MMMM dd일',
    };

    if (!el) {
      // 모든 datepicker작동시키기
      setDatePicker('.datepicker-input');
    } else {
      // 데이터 직접셋팅의 경우
      return setDateElPicker(el);
    }

    function setDatePicker(item) {
      $(item).each(function () {
        setDate(this);
      });
    }

    function setDateElPicker(item) {
      return setDate(item, true);
    }
    var focusFlag = true;
    function setDate(el, flag) {
      var datePicker;
      var $datePickerContainer = $(el).closest('.datepicker-container');
      var $datePickerWrapper = $datePickerContainer.find('.tui-datepicker-wrapper');
      var $datePickerInput = $datePickerContainer.find('.datepicker-input');
      var timeFlag = $datePickerContainer.hasClass('time') ? true : false;
      var type = 'date';
      var timeFormat = 'yyyy-MM-dd';

      if ($datePickerContainer.hasClass('init-datepicker')) return;
      if ($datePickerContainer.hasClass('time')) {
        // 시간 달력일경우
        timeFormat = 'yyyy-MM-dd HH:mm';
        // 월 달력일경우
      } else if ($datePickerContainer.hasClass('month')) {
        timeFormat = 'yyyy-MM';
        // 년도 달력일경우
      } else if ($datePickerContainer.hasClass('year')) {
        timeFormat = 'yyyy';
      }

      // 월 달력일경우
      if ($datePickerContainer.hasClass('month')) {
        type = 'month';
        // 년도 달력일경우
      } else if ($datePickerContainer.hasClass('year')) {
        type = 'year';
      }

      datePicker = new DatePicker($datePickerWrapper[0], {
        date: '',
        type: type,
        input: {
          element: $datePickerInput[0],
          format: timeFormat,
        },
        timePicker: timeFlag,
        language: 'customKey',
      });
      datePicker.on('open', function (e) {
        $datePickerInput.addClass('open-datepicker');
      });
      datePicker.on('close', function (e) {
        $datePickerInput.removeClass('open-datepicker');
      });

      // 포커스로 달력 열고 닫기
      $datePickerInput.on('focusin', function () {
        datePicker.open();
        focusFlag = true;
        datePicker.setDate(new Date($datePickerInput.val()));
      });
      $datePickerInput.on('focusout', function (e) {
        if (focusFlag) {
          datePicker.close();
        }
      });

      // 달력 클릭시 blur 막기
      $datePickerContainer.find('.tui-datepicker').on('click mousedown', function (event) {
        if ($(event.target).hasClass('tui-timepicker-select')) {
          focusFlag = false;
          return true;
        }
        return false;
      });

      if (flag) {
        $datePickerContainer.addClass('init-datepicker');
        return datePicker;
      }
    }
  }

  function floatBtnTop() {
    $('.float-btn-top').on('click', function () {
      scrollMoveTo();
    });
  }

  function scrollAnimation() {
    // AOS.init();

    if (!$('.scroll-animate').length) return;
    var $element = $('.scroll-animate');
    if (!$element.length) return;
    $element.each(function (i) {
      var $this = $(this);
      var delay = $this.attr('data-delay');
      if (delay) {
        $this.css('animation-delay', delay + 's');
      }
      var setTimeHandler = setTimeout(function () {
        animationFn($this);
        clearTimeout(setTimeHandler);
      }, 400);

      $(window).on('scroll', function () {
        animationFn($this);
      });
    });

    function animationFn(element) {
      var _offset = element.offset().top;
      var _sct = $(window).scrollTop();
      var _windowHeight = $(window).height();
      var setValue = 1.2;

      if (_sct + _windowHeight / setValue >= _offset) {
        var animationName = element.attr('data-animation') || 'fade-in-bottom';

        element.addClass(animationName);
      }
    }
  }

  function textLengthCheck() {
    var $lengthCheckCover = $('.length-check-cover');
    if (!$lengthCheckCover.length) return;
    var $textElement = $lengthCheckCover.find('.length-check-item');
    $textElement.each(function () {
      setTextCount($(this));
    });
    $('body').on('keyup', '.length-check-item', function () {
      setTextCount($(this));
    });

    function setTextCount(el) {
      var _maxLength = el.attr('data-maxLength');
      var _textLength = el.val().length;
      if (_textLength > _maxLength) {
        _textLength = _maxLength;
      }
      el.val(el.val().substr(0, _maxLength));
      el.closest('.length-check-cover')
        .find('.count')
        .text(Number(_textLength).toLocaleString() + '/' + Number(_maxLength).toLocaleString());
    }
  }

  function contentSpaceFn() {
    var $content = $('#content');
    var setTimeHandler = null;
    if (!$('#header').length) return;
    if ($content.hasClass('space')) {
      setTimeHandler = setTimeout(function () {
        var _headerHeight = $('#header').outerHeight();
        $content.css('paddingTop', _headerHeight);
        clearTimeout(setTimeHandler);
      }, 150);
    }
  }

  function ratingSelectHandler() {
    var container = $('.rating-select-container');
    var inputs = container.find('input[type="radio"]');
    var labels = container.find('label');
    inputs.on('change', function () {
      if ($(this).prop('checked')) {
        labels.each(function () {
          $(this).removeClass('checked');
        });
        $(this).next('label').addClass('checked').prevAll('label').addClass('checked');
      }
    });
  }

  // 숫자 카운팅
  let isCountFlag = false;
  function numberCounter(target) {
    var items = $(target);
    if (!items.length) return;
    if (isCountFlag) return;

    isCountFlag = true;
    gsap.to(items, {
      textContent: items.data('number'),
      duration: 1,
      ease: 'power1.in',
      snap: {textContent: 1},
      stagger: {
        each: 1,
        onUpdate: function () {
          items[0].innerHTML = numberWithCommas(Math.ceil(items[0].textContent));
        },
      },
      onComplete: function () {
        isCountFlag = false;
      },
    });
  }

  // 콤마 생성
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // 숫자만 입력
  function onlyNumber(value) {
    return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
  }

  // 숫자 + 마침표만 입력
  function onlyNumberPeriod(value) {
    return value.replace(/[^-\.0-9]/g, '');
  }

  // 폰번호 하이픈 생성
  const autoHyphen = (target) => {
    target.value = target.value.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
  };

  // 달력 년-월-일
  const autoDateHyphen = (target) => {
    target.value = target.value.replace(/[^0-9]/g, '').replace(/^(\d{4})(\d{2})(\d{2})$/, `$1-$2-$3`);
  };

  // 달력 년-월
  const autoDateMonthHyphen = (target) => {
    target.value = target.value.replace(/[^0-9]/g, '').replace(/^(\d{4})(\d{2})$/, `$1-$2`);
  };

  // ------------------------ 공통 함수 ---------------------------//

  // js 함수 외부사용을 위함

  // 팝업함수
  exports.layerPopup = layerPopup;
  // 모바일메뉴
  exports.mobileMenuController = mobileMenuController;
  // 숫자 카운팅
  exports.numberCounter = numberCounter;
  // input 활성화
  exports.inputActiveHandler = inputActiveHandler;
  // 콤마 생성
  exports.numberWithCommas = numberWithCommas;
  // 숫자만 입력
  exports.onlyNumber = onlyNumber;
  // 폰번호 하이픈 생성
  exports.autoHyphen = autoHyphen;
  // 달력 년-월-일
  exports.autoDateHyphen = autoDateHyphen;
  // 달력 년-월
  exports.autoDateMonthHyphen = autoDateMonthHyphen;

  // --- 비동기 실행후 재실행 함수 모음 -- //
  // 슬라이드 업데이트
  exports.sliderUpdate = sliderUpdate;
  // 셀렉트릭 새로고침
  exports.refreshSelectric = refreshSelectric;
  // 셀렉트릭 생성
  exports.selectric = selectric;
  // datepicker
  exports.datePicker = datePicker;
  // darkModeHandler
  exports.darkModeHandler = darkModeHandler;
  // contentTabMenuHandler
  exports.contentTabMenuHandler = contentTabMenuHandler;
  // commentLikeEvent
  exports.commentLikeEvent = commentLikeEvent;
  // webzineLikeEvent
  exports.webzineLikeEvent = webzineLikeEvent;
  // toolbarHandler
  exports.toolbarHandler = toolbarHandler;
  // selectBoxColorChange
  exports.selectBoxColorChange = selectBoxColorChange;
  // floatingBoxHandler
  exports.floatingBoxHandler = floatingBoxHandler;
  // commentInfoText
  exports.commentInfoText = commentInfoText;
  // mobilevh
  exports.mobilevh = mobilevh;
  // accordionHandler
  exports.accordionHandler = accordionHandler;
  // scrollToolbar
  exports.scrollToolbar = scrollToolbar;
  // --- 비동기 실행후 재실행 함수 모음 -- //
})(this);
