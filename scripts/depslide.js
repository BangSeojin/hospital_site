// 진료과 슬라이더
document.addEventListener('DOMContentLoaded', () => {
    initInfiniteSlide();
});

function initInfiniteSlide() {
    const slideInner = document.querySelector('.slideInner');
    const leftBtn = document.querySelector('.depR_leftBtn');
    const rightBtn = document.querySelector('.depR_rightBtn');

    if (!slideInner || slideInner.children.length === 0) {
        console.warn('슬라이드 요소 없음');
        return;
    }

    const originalItems = Array.from(slideInner.children);
    const ITEM_COUNT = originalItems.length;

    /* ===== 설정 ===== */
    const AUTO_DELAY = 5000;
    const AUTO_STEP = 3;
    const DURATION = 1500;

    function getItemWidth() {
        const item = slideInner.children[0];
        const style = getComputedStyle(item);
        return item.offsetWidth + parseFloat(style.marginRight);
    }

    let itemWidth = getItemWidth();
    let index = ITEM_COUNT;
    let isMoving = false;
    let autoTimer = null;

    /* ===== 복제 ===== */
    const clonesBefore = originalItems.map(el => el.cloneNode(true));
    const clonesAfter = originalItems.map(el => el.cloneNode(true));

    clonesBefore.reverse().forEach(el => slideInner.prepend(el));
    clonesAfter.forEach(el => slideInner.append(el));

    slideInner.style.transition = 'none';
    slideInner.style.transform = `translateX(${-itemWidth * index}px)`;

    function move(step) {
        if (isMoving) return;
        isMoving = true;

        index += step;
        slideInner.style.transition =
            `transform ${DURATION}ms cubic-bezier(0.22, 0.61, 0.36, 1)`;
        slideInner.style.transform =
            `translateX(${-itemWidth * index}px)`;

        slideInner.addEventListener(
            'transitionend',
            () => {
                /* 오른쪽 완전히 벗어난 경우만 보정 */
                if (index >= ITEM_COUNT * 2) {
                    slideInner.style.transition = 'none';
                    index -= ITEM_COUNT;
                    slideInner.style.transform =
                        `translateX(${-itemWidth * index}px)`;
                }

                /* 왼쪽 완전히 벗어난 경우만 보정 */
                if (index < ITEM_COUNT) {
                    slideInner.style.transition = 'none';
                    index += ITEM_COUNT;
                    slideInner.style.transform =
                        `translateX(${-itemWidth * index}px)`;
                }

                isMoving = false;
            },
            { once: true }
        );
    }

    function startAuto() {
        stopAuto();
        autoTimer = setInterval(() => {
            move(AUTO_STEP);
        }, AUTO_DELAY);
    }

    function stopAuto() {
        if (autoTimer) clearInterval(autoTimer);
    }

    rightBtn.addEventListener('click', () => {
        stopAuto();
        move(1);
        startAuto();
    });

    leftBtn.addEventListener('click', () => {
        stopAuto();
        move(-1);
        startAuto();
    });

    window.addEventListener('resize', () => {
        itemWidth = getItemWidth();
        slideInner.style.transition = 'none';
        slideInner.style.transform =
            `translateX(${-itemWidth * index}px)`;
    });

    startAuto();
}
