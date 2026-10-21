
/* =========================================================
   COMPANY IMAGE SLIDER
========================================================= */
$(function () {
    var $images = $('.company-image img');
    var current = 0;

    if ($images.length === 0) return;

    $images.hide();
    $images.eq(0).show();

    setInterval(function () {
        var next = (current + 1) % $images.length;

        $images.eq(current).stop(true, true).fadeOut(1200);
        $images.eq(next).stop(true, true).fadeIn(1200);

        current = next;
    }, 2500);
});


/* =========================================================
   PICK SCROLL MOTION
========================================================= */
$(function () {
    function pickScrollMotion() {
        $('.pick-main, .pick-cards').each(function () {
            var $this = $(this);
            var sectionTop = $this.offset().top;
            var sectionBottom = sectionTop + $this.outerHeight();
            var scrollTop = $(window).scrollTop();
            var windowHeight = $(window).height();

            if (
                sectionTop < scrollTop + windowHeight * 0.8 &&
                sectionBottom > scrollTop
            ) {
                $this.addClass('show');
            } else {
                $this.removeClass('show');
            }
        });
    }

    $(window).on('scroll', pickScrollMotion);
    pickScrollMotion();
});


/* =========================================================
   VALUE SCROLL MOTION
========================================================= */
$(function () {
    function valueScrollMotion() {
        $('.value').each(function () {
            var $this = $(this);
            var sectionTop = $this.offset().top;
            var sectionBottom = sectionTop + $this.outerHeight();
            var scrollTop = $(window).scrollTop();
            var windowHeight = $(window).height();

            if (
                sectionTop < scrollTop + windowHeight * 0.8 &&
                sectionBottom > scrollTop
            ) {
                $this.addClass('show');
            } else {
                $this.removeClass('show');
            }
        });
    }

    $(window).on('scroll', valueScrollMotion);
    valueScrollMotion();
});


/* =========================================================
   HERO TYPING
========================================================= */
$(document).ready(function () {
    const line1 = '챙길 게 많을수록,';
    const line2 = '관리는 편해야 하니까.';

    let i = 0;
    let j = 0;

    function addCursor(target) {
        $('.hero-title-cursor').remove();
        $(target).append('<span class="hero-title-cursor"></span>');
    }

    function typeLine1() {
        if (i < line1.length) {
            $('#hero-line1').text(line1.substring(0, i + 1));
            addCursor('#hero-line1');

            i++;
            setTimeout(typeLine1, 100);
        } else {
            addCursor('#hero-line1');

            setTimeout(function () {
                $('.hero-title-cursor').remove();
                typeLine2();
            }, 700);
        }
    }

    function typeLine2() {
        if (j < line2.length) {
            const text = line2.substring(0, j + 1);

            if (text.length <= 2) {
                $('#hero-line2').html(
                    '<span class="hero-blue">' + text + '</span>'
                );
            } else {
                $('#hero-line2').html(
                    '<span class="hero-blue">관리</span>' +
                    text.substring(2)
                );
            }

            addCursor('#hero-line2');

            j++;
            setTimeout(typeLine2, 100);
        } else {
            addCursor('#hero-line2');

            setTimeout(function () {
                $('.hero-title-cursor').remove();

                $('.hero-description').addClass('show');

                setTimeout(function () {
                    $('.hero-buttons').addClass('show');
                }, 500);
            }, 500);
        }
    }

    typeLine1();
});


/* =========================================================
   KEYPO APP VIDEO SEGMENTS

   최초 진입:
   - 영상 전체 재생
   - 기능 선택 상태 없음

   기능 클릭:
   - 선택한 기능 구간만 반복

   서비스 메뉴 클릭:
   - 기능 선택 상태 초기화
   - 영상 0초부터 전체 재생

   기능별 반복 구간:
   내 아이템          2.25 ~ 6초
   스마트 알림        6.35 ~ 9.25초
   반품·교환·A/S     10.20 ~ 16.25초
   스마트 렌즈       17.00 ~ 24.50초
========================================================= */
(() => {
    const appSection = document.querySelector('#service.app');

    if (!appSection) {
        console.warn(
            'KEYPO 영상: #service.app 섹션을 찾지 못했습니다.'
        );
        return;
    }

    const phoneScreen = appSection.querySelector('.phone-screen');

    let video =
        appSection.querySelector('#keypo-app-video') ||
        appSection.querySelector('.phone-screen video');


    /* 영상 요소가 없으면 생성 */
    if (!video && phoneScreen) {
        video = document.createElement('video');
        video.id = 'keypo-app-video';
        phoneScreen.appendChild(video);
    }

    if (!video) {
        console.warn(
            'KEYPO 영상: .phone-screen 영역을 찾지 못했습니다.'
        );
        return;
    }


    /* 영상 경로가 HTML에 없을 때만 기본 경로 사용 */
    if (
        !video.getAttribute('src') &&
        !video.querySelector('source[src]')
    ) {
        video.src = './video/app-demo.mp4';
    }


    /* 기본 영상 설정 */
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.controls = false;

    Object.assign(video.style, {
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    });


    /* =====================================================
       기능별 반복 구간
    ===================================================== */
    const defaultSegments = [
        { start: 2.25, end: 6 },       // 내 아이템
        { start: 6.35, end: 9.25 },    // 스마트 알림
        { start: 10.20, end: 16.25 },  // 반품·교환·A/S
        { start: 17.00, end: 24.50 }   // 스마트 렌즈
    ];

    const features = Array.from(
        appSection.querySelectorAll('.app-features .feature')
    );

    if (features.length === 0) {
        console.warn(
            'KEYPO 영상: .app-features 안에서 .feature 항목을 찾지 못했습니다.'
        );
        return;
    }


    /* =====================================================
       기능 초기화
       HTML에 기존 영상 시간이 있어도 JS 설정을 우선 적용
    ===================================================== */
    appSection.classList.remove('has-user-selected-feature');

    features.forEach((feature, index) => {
        const segment = defaultSegments[index];

        if (segment) {
            feature.dataset.videoStart = String(segment.start);
            feature.dataset.videoEnd = String(segment.end);
        }

        feature.classList.remove('is-active');
        feature.setAttribute('aria-pressed', 'false');

        if (
            feature.tagName !== 'BUTTON' &&
            !feature.hasAttribute('role')
        ) {
            feature.setAttribute('role', 'button');
        }

        if (
            feature.tagName !== 'BUTTON' &&
            !feature.hasAttribute('tabindex')
        ) {
            feature.setAttribute('tabindex', '0');
        }
    });


    /* =====================================================
       재생 상태
    ===================================================== */
    let activeSegment = null;
    let pendingSegment = null;
    let initialised = false;

    let segmentMonitorId = null;
    let isRestartingSegment = false;


    /* 선택한 기능 강조 표시 */
    function setActiveFeature(activeFeature) {
        features.forEach((feature) => {
            const isActive = feature === activeFeature;

            feature.classList.toggle('is-active', isActive);
            feature.setAttribute('aria-pressed', String(isActive));
        });
    }


    /* 영상 재생 */
    function safePlay() {
        const request = video.play();

        if (request && typeof request.catch === 'function') {
            request.catch((error) => {
                console.warn(
                    'KEYPO 영상 재생에 실패했습니다. ' +
                    '영상 경로와 파일명을 확인하세요.',
                    error
                );
            });
        }
    }


    /* 구간 반복 감시 중지 */
    function stopSegmentMonitor() {
        if (segmentMonitorId !== null) {
            cancelAnimationFrame(segmentMonitorId);
            segmentMonitorId = null;
        }
    }


    /* =====================================================
       서비스 메뉴 클릭 시 전체 영상 처음부터 재생
    ===================================================== */
    function resetToFullVideo() {
        // 선택 구간 상태 초기화
        activeSegment = null;
        pendingSegment = null;
        isRestartingSegment = false;

        // 이전 기능의 반복 감시 중지
        stopSegmentMonitor();

        // 기능 선택 스타일 해제
        appSection.classList.remove('has-user-selected-feature');

        features.forEach((feature) => {
            feature.classList.remove('is-active');
            feature.setAttribute('aria-pressed', 'false');
        });

        // 전체 영상 반복 모드로 변경
        video.loop = true;

        // 영상이 준비되었으면 즉시 0초부터 재생
        if (video.readyState >= 1) {
            video.currentTime = 0;
            safePlay();
        } else {
            // 메타데이터가 아직 준비되지 않았다면 로드 후 처음부터 재생
            video.addEventListener(
                'loadedmetadata',
                function restartFullVideo() {
                    video.currentTime = 0;
                    safePlay();
                },
                { once: true }
            );
        }
    }


    /* =====================================================
       구간 종료 감지
       종료 지점보다 약 0.18초 먼저 시작 시간으로 복귀
    ===================================================== */
    function restartCurrentSegment() {
        if (
            !activeSegment ||
            video.seeking ||
            isRestartingSegment
        ) {
            return;
        }

        isRestartingSegment = true;

        video.currentTime = activeSegment.start;

        if (video.paused) {
            safePlay();
        }
    }


    function checkSegmentBoundary() {
        if (!activeSegment || video.paused || video.ended) {
            return;
        }

        if (video.seeking || isRestartingSegment) {
            return;
        }

        const safeEnd = activeSegment.end - 0.18;

        if (video.currentTime >= safeEnd) {
            restartCurrentSegment();
        }
    }


    function monitorSegmentPlayback() {
        checkSegmentBoundary();

        if (activeSegment) {
            segmentMonitorId = requestAnimationFrame(
                monitorSegmentPlayback
            );
        } else {
            segmentMonitorId = null;
        }
    }


    function startSegmentMonitor() {
        stopSegmentMonitor();

        segmentMonitorId = requestAnimationFrame(
            monitorSegmentPlayback
        );
    }


    /* 반복 이동이 끝나면 재생 상태 복구 */
    video.addEventListener('seeked', () => {
        isRestartingSegment = false;

        if (activeSegment && video.paused) {
            safePlay();
        }
    });


    /* 보조 구간 종료 감지 */
    video.addEventListener('timeupdate', checkSegmentBoundary);


    /* =====================================================
       선택한 영상 구간 재생
    ===================================================== */
    function playSegment(segment) {
        if (
            !Number.isFinite(video.duration) ||
            video.readyState < 1
        ) {
            pendingSegment = segment;
            return;
        }

        const start = Math.max(0, Number(segment.start));
        const end = Math.min(video.duration, Number(segment.end));

        if (
            !Number.isFinite(start) ||
            !Number.isFinite(end) ||
            start >= video.duration ||
            end <= start
        ) {
            console.warn(
                'KEYPO 영상 구간이 영상 길이와 맞지 않습니다.',
                segment,
                '영상 길이:',
                video.duration
            );
            return;
        }

        activeSegment = { start, end };
        pendingSegment = null;
        isRestartingSegment = false;

        // 전체 반복 대신 선택 구간 반복
        video.loop = false;

        // 구간 시작점으로 이동 후 재생
        video.currentTime = start;
        safePlay();

        // 구간 종료 감시 시작
        startSegmentMonitor();
    }


    /* =====================================================
       기능 선택
    ===================================================== */
    function selectFeature(feature) {
        const start = Number(feature.dataset.videoStart);
        const end = Number(feature.dataset.videoEnd);

        if (
            !Number.isFinite(start) ||
            !Number.isFinite(end) ||
            start < 0 ||
            end <= start
        ) {
            return;
        }

        appSection.classList.add('has-user-selected-feature');

        setActiveFeature(feature);
        playSegment({ start, end });
    }


    /* 기능 클릭 및 키보드 조작 */
    features.forEach((feature) => {
        feature.addEventListener('click', () => {
            selectFeature(feature);
        });

        if (feature.tagName !== 'BUTTON') {
            feature.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    selectFeature(feature);
                }
            });
        }
    });


    /* =====================================================
       SERVICE MENU CLICK
       상단의 서비스 메뉴를 누르면 전체 영상을 0초부터 재생
    ===================================================== */
    const serviceLinks = document.querySelectorAll(
        'a[href="#service"], a[href$="#service"]'
    );

    serviceLinks.forEach((link) => {
        link.addEventListener('click', () => {
            resetToFullVideo();
        });
    });


    /* =====================================================
       영상 종료 처리
    ===================================================== */
    video.addEventListener('ended', () => {
        if (!activeSegment) {
            // 기능 미선택 상태: 전체 영상을 처음부터 반복
            video.currentTime = 0;
            safePlay();
            return;
        }

        // 선택 구간이 끝나면 해당 구간의 시작으로 복귀
        isRestartingSegment = true;
        video.currentTime = activeSegment.start;
        safePlay();
    });


    /* =====================================================
       영상 메타데이터 로드
    ===================================================== */
    function handleMetadataLoaded() {
        if (initialised) return;

        initialised = true;

        // 로딩 중 기능을 선택했다면 해당 구간을 재생
        if (pendingSegment) {
            const segment = pendingSegment;
            pendingSegment = null;
            playSegment(segment);
            return;
        }

        // 최초 진입: 기능 선택 없음 + 전체 영상 반복
        appSection.classList.remove('has-user-selected-feature');

        features.forEach((feature) => {
            feature.classList.remove('is-active');
            feature.setAttribute('aria-pressed', 'false');
        });

        activeSegment = null;
        video.loop = true;
        isRestartingSegment = false;

        if (video.currentTime > 0.05) {
            video.currentTime = 0;
        }

        safePlay();
    }


    video.addEventListener('loadedmetadata', handleMetadataLoaded);


    /* 영상 로드 오류 */
    video.addEventListener('error', () => {
        console.error(
            'KEYPO 영상 파일을 읽지 못했습니다. ' +
            'HTML의 영상 경로와 파일명을 확인하세요.',
            video.error
        );
    });


    /* 메타데이터가 이미 로드된 경우 */
    if (video.readyState >= 1) {
        handleMetadataLoaded();
    }

})();


/* =========================================================
   KEYPO APP SECTION SCROLL REVEAL
   - app-info: 요소별 순차 등장
   - app-features: 기능별 제목과 설명 순차 등장
   - 첫 번째 내 아이템 등장 시 핸드폰과 영상도 함께 등장
   - 화면을 벗어나면 숨겨서 위아래 스크롤 시 반복
========================================================= */
(() => {
    const appSection = document.querySelector('#service.app');

    if (!appSection) return;

    const appInfo = appSection.querySelector('.app-info');

    const features = Array.from(
        appSection.querySelectorAll('.app-features .feature')
    );

    const phoneScreen = appSection.querySelector('.phone-screen');

    /*
      핸드폰 외부 프레임을 찾고,
      정확한 클래스가 없으면 화면의 부모 요소를 사용합니다.
    */
    const phoneTarget = phoneScreen
        ? (
            phoneScreen.closest(
                '.phone-mockup, .phone-frame, .phone-device, ' +
                '.phone-container, .phone-wrapper, .phone-wrap, ' +
                '.app-phone, .phone'
            ) || phoneScreen.parentElement || phoneScreen
        )
        : null;

    /* -------------------------------------------------------
       1. app-info 텍스트
    ------------------------------------------------------- */
    const infoItems = appInfo
        ? Array.from(appInfo.children)
        : [];

    infoItems.forEach((item, index) => {
        item.classList.add('app-info-reveal-item');

        item.style.setProperty(
            '--app-reveal-delay',
            `${index * 120}ms`
        );
    });

    /* -------------------------------------------------------
       2. 기능별 텍스트 준비
       제목과 설명은 기능 단위로 함께 나타납니다.
    ------------------------------------------------------- */
    features.forEach((feature, index) => {
        feature.classList.add('app-feature-reveal');

        feature.dataset.appRevealIndex = String(index);

        feature.style.setProperty(
            '--app-reveal-delay',
            `${index * 150}ms`
        );
    });

    /* -------------------------------------------------------
       3. 핸드폰 목업과 영상 준비
    ------------------------------------------------------- */
    if (phoneTarget && !appSection.contains(phoneTarget) === false) {
        phoneTarget.classList.add('app-phone-reveal');
    }

    /*
      같은 요소에 기존 숨김/등장 클래스를 중복해서
      사용하지 않도록 전용 IntersectionObserver를 만듭니다.
    */
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const element = entry.target;
                const isVisible = entry.isIntersecting;

                element.classList.toggle(
                    'is-scroll-visible',
                    isVisible
                );

                /*
                  첫 번째 기능인 '내 아이템'의 등장 시점에
                  핸드폰 목업과 영상도 함께 표시합니다.
                */
                if (
                    element.classList.contains('app-feature-reveal') &&
                    element.dataset.appRevealIndex === '0' &&
                    phoneTarget
                ) {
                    phoneTarget.classList.toggle(
                        'is-scroll-visible',
                        isVisible
                    );
                }
            });
        },
        {
            threshold: 0.18
        }
    );

    /* app-info의 각 요소를 개별적으로 관찰 */
    infoItems.forEach((item) => {
        observer.observe(item);
    });

    /* 기능별 제목·설명은 기능 단위로 관찰 */
    features.forEach((feature) => {
        observer.observe(feature);
    });
})();