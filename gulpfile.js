"use strict";

const { src, dest, parallel, series, watch } = require("gulp");
const pug = require("gulp-pug");
const browserSync = require("browser-sync");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const notify = require("gulp-notify");
const del = require("del");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;

function scripts() {
  return src('./src/js/index.js')
      .pipe(webpackStream({
          output: {
              filename: 'index.js'
          },
          module: {
              rules: [
                  {
                      test: /\.m?js$/,
                      exclude: /node_modules/,
                      use: {
                          loader: 'babel-loader',
                          options: {
                              presets: [
                                  ['@babel/preset-env', { targets: "defaults" }]
                              ]
                          }
                      }
                  }
              ]
          }
      }))
      .pipe(sourcemaps.init())
      .pipe(uglify().on('error', notify.onError()))
      .pipe(sourcemaps.write('.'))
      .pipe(dest('./dist/js/'))
      .pipe(browserSync.stream())
}

function fonts() {
  src("./src/fonts/**.ttf")
    .pipe(ttf2woff())
    .pipe(dest("./dist/fonts/"));
  return src("./src/fonts/**.ttf")
    .pipe(ttf2woff2())
    .pipe(dest("./dist/fonts/"));
}

function pugRender() {
  return src("src/*.pug")
  .pipe(pug())
  .pipe(dest("dist"));
}

function styles() {
  return src(["./src/sass/**/*.sass", "./src/sass/**/*.scss"])
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on("error", notify.onError()))
    .pipe(rename({ suffix: ".min" }))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(
      cleanCSS({
        level: 2,
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest("./dist/css/"))
    .pipe(browserSync.stream());
}

function imgRefactor() {
  return src("./src/images/**")
    .pipe(dest("./dist/images/"));
}

function clean() {
  return del("dist/*");
}

function watchFiles() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });

  watch(["src/sass/**/*.sass", "src/sass/**/*.scss"], styles);
  watch("src/index.pug", pugRender);
  watch("dist/*.html").on("change", browserSync.reload);
  watch('./src/js/**/*.js', scripts);
}

exports.default = series(clean, parallel(fonts, scripts, imgRefactor), pugRender, styles, watchFiles);
