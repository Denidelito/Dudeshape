'use strict';

const path = {
    build: {
        path: './Project/build',
        html: 'Project/build/',
        js: 'Project/build/js/',
        css: 'Project/build/css/',
        img: 'Project/build/img/',
        svg: 'Project/build/img/',
        fonts: 'Project/build/fonts/'
    },
    main: {
        html: 'Project/main/*.html',
        js: 'Project/main/js/main.js',
        scss: 'Project/main/style/main.scss',
        img: 'Project/main/img/**/*.*',
        svg: 'Project/main/icon/**/*.svg',
        fonts: 'Project/main/fonts/**/*.ttf'
    },
    watch: {
        html: 'Project/main/**/*.html',
        js: 'Project/main/js/**/*.js',
        scss: 'Project/main/style/**/*.scss',
        img: 'Project/main/img/**/*.*',
        svg: 'Project/main/icon/**/*.svg',
        fonts: 'Project/main/fonts/**/*.ttf',
    },
    clear: './Project/build/*'
}

import fs from 'fs';
// Gulp
import gulp from 'gulp';
import eslint from 'gulp-eslint';
// сервер для работы и автоматического обновления страниц
import sync from 'browser-sync';
import rigger from 'gulp-rigger'; // модуль для импорта содержимого одного файла в другой
import compilerSass from 'sass';
import gulpSass from 'gulp-sass'; // модуль для компиляции SASS (SCSS) в CSS
import autoprefixer from 'gulp-autoprefixer'; // модуль для автоматической установки автопрефиксов
import cleanCss from 'gulp-clean-css'; // плагин для минимизации CSS
import uglify from 'gulp-uglify-es'; // модуль для минимизации JavaScript
import cache from 'gulp-cache'; // модуль для кэширования
import del from 'del'; // плагин для удаления файлов и каталогов
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin'; // плагин для сжатия PNG, JPEG, GIF изображений
import gifsicle from 'imagemin-gifsicle';
import mozjpeg from 'imagemin-mozjpeg';
import optipng from 'imagemin-optipng';
import svgSprite from 'gulp-svg-sprite';//svg sprite
import ttf2woff from 'gulp-ttf2woff';
import ttf2woff2 from 'gulp-ttf2woff2';
import ttf2eot from 'gulp-ttf2eot';
import notify from 'gulp-notify';

const browserSync = sync.create();
const sass = gulpSass(compilerSass);


gulp.task('eslint', () => {
    return gulp.src(path.main.js)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
});

// запуск сервера
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: path.build.path
        },
        notify: false
    })
});

// сбор html
gulp.task('html:build', () => {
    return gulp.src(path.main.html) // выбор всех html файлов по указанному пути
        .pipe(rigger()) // импорт вложений
        .pipe(gulp.dest(path.build.html)) // выкладывание готовых файлов
        .pipe(browserSync.reload({ stream: true })) // перезагрузка сервера
});

// сбор стилей
gulp.task('css:build', () => {
    return gulp.src(path.main.scss) // получим main.scss
        .pipe(sass({outputStyle: 'expanded'}).on('error', notify.onError())) // scss -> css
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 8 versions'],
            browsers: [
                'Android >= 4',
                'Chrome >= 20',
                'Firefox >= 24',
                'Explorer >= 11',
                'iOS >= 6',
                'Opera >= 12',
                'Safari >= 6',
            ],
        })) // добавим префиксы
        .pipe(gulp.dest(path.build.css))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCss()) // минимизируем CSS
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream()) // перезагрузим сервер
});

// сбор js
gulp.task('js:build', () => {
    return gulp.src(path.main.js) // получим файл main.js
        .pipe(rigger()) // импортируем все указанные файлы в main.js
        .pipe(gulp.dest(path.build.js))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify.default()) // минимизируем js
        .pipe(gulp.dest(path.build.js)) // положим готовый файл
        .pipe(browserSync.reload({ stream: true })) // перезагрузим сервер
});

// перенос шрифтов
gulp.task('fonts:build', (f) => {
    f();
    gulp.src([path.main.fonts])
        .pipe(ttf2woff())
        .pipe(gulp.dest(path.build.fonts));

    gulp.src([path.main.fonts])
        .pipe(ttf2woff2())
        .pipe(gulp.dest(path.build.fonts));

    gulp.src([path.main.fonts])
        .pipe(ttf2eot())
        .pipe(gulp.dest(path.build.fonts));
});

// Создание файла с названием шрифтов
gulp.task('creatFonts:build', (cd) => {
    fs.writeFile('Project/main/style/_fonts.scss', '', cd);

    return fs.readdir('Project/build/fonts/', (err, fonts) => {
        let cFontName;

        fonts.forEach((font, index) => {
            let fontName = font.split('.');
            fontName = fontName[0];
            if (cFontName !== fontName) {
                fs.appendFile('Project/main/style/_fonts.scss', '@include font("' + fontName + '", "' + fontName + '", "400", "normal");', cd);
            }
            cFontName = fontName;
        });
    });
});

// обработка картинок
gulp.task('image:build', () => {
    return gulp.src(path.main.img)
        .pipe(imagemin([
            gifsicle({ interlaced: true }),
            mozjpeg({ quality: 75, progressive: true }),
            optipng({ optimizationLevel: 5 })
        ]))
        .pipe(gulp.dest(path.build.img))
});

// обработка svg
gulp.task('svg:build', (f) => {
    return gulp.src(path.main.svg)
        .pipe(svgSprite({
                mode: {
                    stack: {
                        sprite: "../sprite.svg"  //sprite file name
                    }
                },
            }
        ))
        .pipe(gulp.dest(path.build.svg));
});

// удаление каталога build
gulp.task('clean:build', () => {
    return del(path.clear);
});

// очистка кэша
gulp.task('cache:clear', () => {
    cache.clearAll();
});

// сборка
gulp.task('build',
    gulp.series('clean:build',
        gulp.parallel(
            'html:build',
            'css:build',
            'js:build',
            'fonts:build',
            'image:build',
            'svg:build'
        )
    )
);

// запуск задач при изменении файлов
gulp.task('watch', () => {
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.scss, gulp.series('css:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.js, gulp.series('eslint'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
    gulp.watch(path.watch.svg, gulp.series('svg:build'));
    gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
});

// задача по умолчанию
gulp.task('default', gulp.series(
    'build',
    'creatFonts:build',
    gulp.parallel('browser-sync', eslint, 'watch')
));