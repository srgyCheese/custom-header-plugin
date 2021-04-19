const gulp = require('gulp')
const {src, dest} = gulp
const uglify = require('gulp-uglify-es').default
const rename = require('gulp-rename')
const babel = require('gulp-babel')
const del = require('del')

const clean = () => {
    return del('./dist/*')
}

const js = () => {
    return src('./src/stretchyHeader.js')
            .pipe(babel({
                presets: ["@babel/preset-env"],
                plugins: ["@babel/plugin-proposal-class-properties"]
            }))
            .pipe(uglify())
            .pipe(
                rename({
                    extname: '.min.js'
                })
            )
            .pipe(dest('./dist'))
}

const build = gulp.series(clean, js)

exports.build = build
exports.default = build