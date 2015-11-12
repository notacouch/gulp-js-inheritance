# gulp-js-inheritance

> Rebuild a js file with other files that have extended or included those file

Based on
[gulp-sass-inheritance](https://github.com/berstend/gulp-sass-inheritance)

Uses
[js-graph-imports](https://github.com/brnmonteiro/js-graph-imports) for the heavy lifting.

Suport
_partials.js and nested imports.
Import in js:
```js
//import("bar.js")
```


## Install

```shell
npm install gulp-js-inheritance --save
```

## Usage

You can use `gulp-js-inheritance` with `gulp-changed` to only process the files that have changed but also recompile files that import the one that changed.

```js
'use strict';
var gulp = require('gulp');
var jsInheritance = require('gulp-js-inheritance');
var cached = require('gulp-cached');
var gulpif = require('gulp-if');
var gulpif = require('gulp-uglify');
var filter = require('gulp-filter');

gulp.task('js', function() {
    return gulp.src('src/scripts/**/*.js')

      //filter out unchanged scss files, only works when watching
      .pipe(gulpif(global.isWatching, cached('js')))

      //find files that depend on the files that have changed
      .pipe(jsInheritance({dir: 'src/scripts/'}))

      //filter out internal imports (folders and files starting with "_" )
      .pipe(filter(function (file) {
        return !/\/_/.test(file.path) || !/^_/.test(file.relative);
      }))

      //process js files
      .pipe(uglify())

      //save all the files
      .pipe(gulp.dest('dist'));
});
gulp.task('setWatch', function() {
    global.isWatching = true;
});
gulp.task('watch', ['setWatch', 'js'], function() {
    //your watch functions...
});
```


## License

MIT
