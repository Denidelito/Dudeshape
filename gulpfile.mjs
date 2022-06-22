const src = {
    build: {
        path: './Project/build',
        html: 'Project/build/',
        js: 'Project/build/js/',
        css: 'Project/build/css/',
        img: 'Project/build/img/',
        fonts: 'Project/build/fonts/'
    },
    main: {
        html: 'Project/main/*.html',
        js: 'Project/main/js/main.js',
        scss: 'Project/main/style/main.scss',
        img: 'Project/main/img/**/*.*',
        fonts: 'Project/main/fonts/**/*.*'
    },
    watch: {
        html: 'Project/main/**/*.html',
        js: 'Project/main/js/**/*.js',
        scss: 'Project/main/style/**/*.scss',
        img: 'Project/main/img/**/*.*',
        fonts: 'Project/main/fonts/**/*.*',
    },
    clear: './Project/build/*'
}

// Gulp
import gulp from 'gulp';
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
import imagemin from 'gulp-imagemin'; // плагин для сжатия PNG, JPEG, GIF и SVG изображений
import gifsicle from 'imagemin-gifsicle';
import mozjpeg from 'imagemin-mozjpeg';
import optipng from 'imagemin-optipng';
import svgo from 'imagemin-svgo';
import notify from 'gulp-notify';

const browserSync = sync.create();
const sass = gulpSass(compilerSass);

// запуск сервера
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: src.build.path
        },
        notify: false
    })
});

// сбор html
gulp.task('html:build', () => {
    return gulp.src(src.main.html) // выбор всех html файлов по указанному пути
        .pipe(rigger()) // импорт вложений
        .pipe(gulp.dest(src.build.html)) // выкладывание готовых файлов
        .pipe(browserSync.reload({ stream: true })) // перезагрузка сервера
});

// сбор стилей
gulp.task('css:build', () => {
    return gulp.src(src.main.scss) // получим main.scss
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
        .pipe(gulp.dest(src.build.css))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCss()) // минимизируем CSS
        .pipe(gulp.dest(src.build.css))
        .pipe(browserSync.stream()) // перезагрузим сервер
});

// сбор js
gulp.task('js:build', () => {
    return gulp.src(src.main.js) // получим файл main.js
        .pipe(rigger()) // импортируем все указанные файлы в main.js
        .pipe(gulp.dest(src.build.js))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify.default()) // минимизируем js
        .pipe(gulp.dest(src.build.js)) // положим готовый файл
        .pipe(browserSync.reload({ stream: true })) // перезагрузим сервер
});

// перенос шрифтов
gulp.task('fonts:build', () => {
    return gulp.src(src.main.fonts)
        .pipe(gulp.dest(src.build.fonts))
});

// обработка картинок
gulp.task('image:build', () => {
    return gulp.src(src.main.img)
        .pipe(imagemin([
            gifsicle({ interlaced: true }),
            mozjpeg({ quality: 75, progressive: true }),
            optipng({ optimizationLevel: 5 }),
            svgo()
        ]))
        .pipe(gulp.dest(src.build.img))
});

// удаление каталога build
gulp.task('clean:build', () => {
    return del(src.clear);
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
            'image:build'
        )
    )
);

// запуск задач при изменении файлов
gulp.task('watch', () => {
    gulp.watch(src.watch.html, gulp.series('html:build'));
    gulp.watch(src.watch.scss, gulp.series('css:build'));
    gulp.watch(src.watch.js, gulp.series('js:build'));
    gulp.watch(src.watch.img, gulp.series('image:build'));
    gulp.watch(src.watch.fonts, gulp.series('fonts:build'));
});

// задача по умолчанию
gulp.task('default', gulp.series(
    'build',
    gulp.parallel('browser-sync','watch')
));