// Импортируем компоненты

const sliderBanner = () => {
    const $banners = $('.js-banner');

    $banners.each((key, banner) => {
        const slider = $(banner).find('.js-banner-slider');
        const btnNext = $(banner).find('.js-btn-next');
        const btnPrev = $(banner).find('.js-btn-prev');

        $(slider).slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            fade: true,
            adaptiveHeight: true,
            autoplaySpeed: 5000,
            nextArrow: btnNext,
            prevArrow: btnPrev,
        });
    });
};

const sliderLogo = () => {
    const $sliders = $('.js-slider-logo');

    $sliders.each((key, slider) => {
        $(slider).slick({
            slidesToShow: 6,
            slidesToScroll: 1,
            autoplay: true,
            arrows: false,
            autoplaySpeed: 3000,
            responsive: [
                {
                    breakpoint: 719,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 2,
                    },
                },
                {
                    breakpoint: 390,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                    },
                },
            ],
        });
    });
};

sliderLogo();

sliderBanner();
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
