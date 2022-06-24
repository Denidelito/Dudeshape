// Импортируем компоненты

const sliderBanner = () => {
    const $sliders = $('.js-banner-slider');

    $sliders.each((key, slider) => {
        $(slider).slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            autoplay: true,
            fade: true,
            adaptiveHeight: true,
            autoplaySpeed: 5000,
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
