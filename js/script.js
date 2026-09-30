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

$(function () {

    function pickScrollMotion() {

        /* -------------------------
           PICK MAIN
        ------------------------- */

        $('.pick-main').each(function () {

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


        /* -------------------------
           PICK CARDS
        ------------------------- */

        $('.pick-cards').each(function () {

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


    $(window).on('scroll', function () {
        pickScrollMotion();
    });

    pickScrollMotion();

});



/* =========================
   VALUE - SCROLL MOTION
========================= */

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

    $(window).on('scroll', function () {
        valueScrollMotion();
    });

    valueScrollMotion();

});


$(document).ready(function () {

    const line1 = "챙길 게 많을수록,";
    const line2 = "관리는 편해야 하니까.";

    let i = 0;
    let j = 0;


    // 커서 생성
    function addCursor(target) {

        $(".hero-title-cursor").remove();

        $(target).append(
            '<span class="hero-title-cursor"></span>'
        );
    }


    // 첫 번째 줄 타이핑
    function typeLine1() {

        if (i < line1.length) {

            $("#hero-line1").text(
                line1.substring(0, i + 1)
            );

            addCursor("#hero-line1");

            i++;

            setTimeout(typeLine1, 100);

        } else {

            // 첫 번째 줄 완성 후 커서 유지
            addCursor("#hero-line1");

            setTimeout(function () {

                $(".hero-title-cursor").remove();

                typeLine2();

            }, 700);
        }
    }


    // 두 번째 줄 타이핑
    function typeLine2() {

        if (j < line2.length) {

            const text = line2.substring(0, j + 1);

            // '관리'만 블루
            if (text.length <= 2) {

                $("#hero-line2").html(
                    '<span class="hero-blue">' +
                    text +
                    '</span>'
                );

            } else {

                $("#hero-line2").html(
                    '<span class="hero-blue">관리</span>' +
                    text.substring(2)
                );
            }

            addCursor("#hero-line2");

            j++;

            setTimeout(typeLine2, 100);

        } else {

            // 두 번째 줄 완성
            addCursor("#hero-line2");


            // 커서 잠깐 깜빡임
            setTimeout(function () {

                // 커서 제거
                $(".hero-title-cursor").remove();


                // 설명문 등장
                $(".hero-description").addClass("show");


                // 설명문 등장 후 버튼 등장
                setTimeout(function () {

                    $(".hero-buttons").addClass("show");

                }, 500);

            }, 500);
        }
    }


    // 타이핑 시작
    typeLine1();

});




