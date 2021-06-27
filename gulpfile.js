const gulp = require('gulp')
const {src, dest} = gulp
const uglify = require('gulp-uglify-es').default
const rename = require('gulp-rename')
const babel = require('gulp-babel')
const header = require('gulp-header')
const server = require('browser-sync').create();
const del = require('del')
const package = require('./package.json')

const banner = [
    '/**',
    ' * <%= package.name %> - <%= package.description %>',
    ' * @version v<%= package.version %>',
    ' * @author <%= package.author %>',
    ' * @license <%= package.license %>',
    '**/',
    '',
].join('\n')

const clean = () => {
    return del('./dist/*')
}

const js = () => {
    return src('./src/stretchyHeader.js')
            .pipe(babel({
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-proposal-class-properties']
            }))
            .pipe(uglify())
            .pipe(rename({ suffix: '.min' }))
            .pipe(header(banner, {package}))
            .pipe(dest('./dist'))
            .pipe(server.stream())
}

const build = gulp.series(clean, js)

const browserSync = () => {
    server.init({
      server: {
        baseDir: './'
      },
      port: 3000,
      notify: false,
      open: true,
      cors: true,
      ui: false
    })

    gulp.watch('./*/*.js').on('change', build);
}


const watch = gulp.parallel(build, browserSync)

exports.default = watch