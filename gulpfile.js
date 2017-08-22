const gulp =    require('gulp');
const connect = require('gulp-connect');
const concat =  require('gulp-concat');
const babel =   require('gulp-babel');
const uglify =  require('gulp-uglify');
const rename =  require('gulp-rename');

// ----- 创建服务器
gulp.task('webserver', () =>
    connect.server({
        livereload: true,
        port: 2333
    })
);
// -----

// ----- 压缩合并编译 js
gulp.task('minifyjs', () => {
    gulp.src('./src/ES6/*.js')
        .pipe(concat('luckyDraw.js'))    // 合并为 luckyDraw.js        
        .pipe(babel({                    // 编译为 ES5
            presets: ['env']
        }))
        .pipe(uglify())                  // 压缩 js 代码
        .pipe(rename({suffix: '.min'}))  // 重命名

        .pipe(gulp.dest('src/dist'))     // 输出到 dist 文件夹
});
// -----


gulp.task('default', ['webserver'], () => {
    gulp.watch('./src/ES6/*.js', ['minifyjs'])
});




