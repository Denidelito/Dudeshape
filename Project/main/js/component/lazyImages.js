const lazyImages = document.querySelectorAll('img[data-src],source[srcset]');
const windowHeight = document.documentElement.clientHeight;

const lazyImagesPosition = [];

if (lazyImages.length > 0) {
    lazyImages.forEach((img) => {
        if (img.dataset.src || img.dataset.srcset) {
            lazyImagesPosition.push(img.getBoundingClientRect().top + pageYOffset);
            lazyScrollCheck();
        }
    });
}

window.addEventListener('scroll', lazyScroll);

/** Описание функции* */
function lazyScroll() {
    if (document.querySelectorAll('img[data-src], source[srcset]').length > 0) {
        lazyScrollCheck();
    }
}

/** Проверка картинки на видимость* */
function lazyScrollCheck() {
    const imgIndex = lazyImagesPosition.findIndex((item) => pageYOffset > item - windowHeight);
    if (imgIndex >= 0) {
        if (lazyImages[imgIndex].dataset.src) {
            lazyImages[imgIndex].src = lazyImages[imgIndex].dataset.src;
            lazyImages[imgIndex].removeAttribute('data-src');
        } else if (lazyImages[imgIndex].dataset.srcset) {
            lazyImages[imgIndex].srcset = lazyImages[imgIndex].dataset.srcset;
            lazyImages[imgIndex].removeAttribute('data-srcset');
        }

        delete lazyImagesPosition[imgIndex]
    }
}
