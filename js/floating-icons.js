/* =========================================================
   KEYPO FLOATING ICONS — smooth animation + drag
   Keep this behaviour in this file only. Do not duplicate it in script.js.
========================================================= */
(() => {
    const section = document.querySelector('#download.download');
    if (!section) return;

    const iconLayer = section.querySelector('.floating-icons');
    const icons = Array.from(section.querySelectorAll('.float-item'));
    if (!iconLayer || icons.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    // Give every icon its own gentle, buoyant path so they do not move in sync.
    // Only compositor-friendly transform/opacity properties animate.
    icons.forEach((icon, index) => {
        icon.draggable = false;

        const direction = index % 2 === 0 ? 1 : -1;
        const drift = 11 + (index % 4) * 2.5;
        const lift = 23 + (index % 4) * 5;
        const swayBack = 7 + (index % 3) * 2;
        const settleTilt = direction * (2 + (index % 3) * 1.25);

        icon.style.setProperty('--duration', `${7.4 + (index % 6) * 0.78}s`);
        icon.style.setProperty('--drift', `${direction * drift}px`);
        icon.style.setProperty('--drift-back', `${direction * -swayBack}px`);
        icon.style.setProperty('--float-y', `${-lift}px`);
        icon.style.setProperty('--float-y-soft', `${-Math.round(lift * 0.38)}px`);
        icon.style.setProperty('--tilt', `${settleTilt}deg`);
        // Keep a little diagonal energy on entry instead of standing perfectly upright.
        icon.style.setProperty('--pop-start-rotate', `${-direction * (11 + (index % 3) * 3)}deg`);
        icon.style.setProperty('--pop-peak-rotate', `${direction * (5 + (index % 2) * 3)}deg`);

        // Two K logos join the early wave and keep a more playful tilted float.
        if (icon.classList.contains('app-logo-k')) {
            icon.style.setProperty('--duration', '8.1s');
            icon.style.setProperty('--drift', '19px');
            icon.style.setProperty('--drift-back', '-12px');
            icon.style.setProperty('--float-y', '-34px');
            icon.style.setProperty('--float-y-soft', '-13px');
            icon.style.setProperty('--tilt', '-7deg');
            icon.style.setProperty('--pop-start-rotate', '-27deg');
            icon.style.setProperty('--pop-peak-rotate', '13deg');
        } else if (icon.classList.contains('app-logo-k-two')) {
            icon.style.setProperty('--duration', '9.6s');
            icon.style.setProperty('--drift', '-17px');
            icon.style.setProperty('--drift-back', '11px');
            icon.style.setProperty('--float-y', '-29px');
            icon.style.setProperty('--float-y-soft', '-12px');
            icon.style.setProperty('--tilt', '8deg');
            icon.style.setProperty('--pop-start-rotate', '25deg');
            icon.style.setProperty('--pop-peak-rotate', '-12deg');
        }

        icon.addEventListener('dragstart', (event) => {
            event.preventDefault();
        });

        // Match the animation name in style.css: @keyframes keypoIconPop.
        icon.addEventListener('animationend', (event) => {
            if (event.target !== icon || event.animationName !== 'keypoIconPop') return;
            icon.classList.remove('is-entering');
            icon.classList.add('is-floating');
        });
    });

    let hasRevealed = false;

    const revealIcons = () => {
        if (hasRevealed) return;
        hasRevealed = true;

        icons.forEach((icon, index) => {
            // 모든 아이콘에 동일한 순차 등장 효과 적용
            icon.style.setProperty(
                '--enter-delay',
                `${Math.min(index * 0.065, 0.95)}s`
            );

            if (prefersReducedMotion) {
                icon.classList.add('is-floating');
            } else {
                icon.classList.add('is-entering');
            }
        });
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            revealIcons();
            observer.disconnect();
        }, { threshold: 0.18 });
        observer.observe(section);
    } else {
        revealIcons();
    }

    // Drag an icon with the mouse or touch. left/top are updated only during drag.
    icons.forEach((icon) => {
        let pointerId = null;
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;

        icon.addEventListener('pointerdown', (event) => {
            if (event.pointerType === 'mouse' && event.button !== 0) return;
            if (!icon.classList.contains('is-entering') && !icon.classList.contains('is-floating')) return;

            event.preventDefault();
            pointerId = event.pointerId;
            startX = event.clientX;
            startY = event.clientY;
            startLeft = icon.offsetLeft;
            startTop = icon.offsetTop;

            icon.classList.add('is-dragging');
            if (typeof icon.setPointerCapture === 'function') {
                icon.setPointerCapture(pointerId);
            }
        });

        icon.addEventListener('pointermove', (event) => {
            if (!icon.classList.contains('is-dragging') || event.pointerId !== pointerId) return;

            const maxLeft = Math.max(0, iconLayer.clientWidth - icon.offsetWidth);
            const maxTop = Math.max(0, iconLayer.clientHeight - icon.offsetHeight);
            const nextLeft = Math.min(maxLeft, Math.max(0, startLeft + event.clientX - startX));
            const nextTop = Math.min(maxTop, Math.max(0, startTop + event.clientY - startY));

            icon.style.left = `${nextLeft}px`;
            icon.style.top = `${nextTop}px`;
        });

        const stopDragging = (event) => {
            if (event.pointerId !== pointerId) return;
            icon.classList.remove('is-dragging');
            if (typeof icon.hasPointerCapture === 'function' && icon.hasPointerCapture(pointerId)) {
                icon.releasePointerCapture(pointerId);
            }
            pointerId = null;
        };

        icon.addEventListener('pointerup', stopDragging);
        icon.addEventListener('pointercancel', stopDragging);
        icon.addEventListener('lostpointercapture', () => {
            icon.classList.remove('is-dragging');
            pointerId = null;
        });
    });
})();
