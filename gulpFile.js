const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const uglify = require('gulp-uglify-es').default;
// const imagemin = require('gulp-imagemin');
const del = require('del');


gulp.task('css', function(done){
    console.log('minifying css..........');
    gulp.src('./assets/scss/**/*.scss')  // where the sass file stroed
    // pipe call the middleware
    .pipe(sass())        // convert to css
    .pipe(cssnano())     // compress css i.e minification of css
    .pipe(gulp.dest('./assets.css'))  // stored compress file in this destination
    
    gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done()
})

gulp.task('js', function(done){
    console.log('minifying js..........');
    
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done()
})

// gulp.task('images', function(done){
//     console.log('minifying images..........');
    
//     gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
//     .pipe(imagemin())
//     .pipe(rev())
//     .pipe(gulp.dest('./public/assets'))
//     .pipe(rev.manifest({
//         cwd: 'public',
//         merge: true
//     }))
//     .pipe(gulp.dest('./public/assets'));
//     done()
// })


// empty the public public/asset directory
gulp.task('clean:asset',function(done){
    del.sync('./public/assets');
    done();
});

gulp.task('build',gulp.series('clean:asset','css','js'), function(done){
    console.log('building assets');
    done();
})