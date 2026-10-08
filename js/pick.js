(() => {
    "use strict";

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealItems = document.querySelectorAll(".reveal");

    /* =========================================
       SCROLL REVEAL
       화면에 들어오면 등장
       화면에서 나가면 다시 숨김
       → 위/아래 스크롤 모두 재생
    ========================================= */

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealItems.forEach((item) => {
            item.classList.add("is-visible");
        });
    } else {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                    } else {
                        entry.target.classList.remove("is-visible");
                    }
                });
            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -7% 0px"
            }
        );

        revealItems.forEach((item) => {
            revealObserver.observe(item);
        });
    }

    /* =========================================
       INTERNAL ANCHOR NAVIGATION
       #feature-story, #journal 등
       부드럽게 이동
    ========================================= */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const id = link.getAttribute("href");

            if (!id || id === "#") return;

            const target = document.querySelector(id);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });
})();