var es = require('event-stream');
var _ = require("lodash");
var vfs = require('vinyl-fs');
var through2 = require('through2');
var gutil = require('gulp-util');
var jsGraph = require('js-graph-imports');
var PLUGIN_NAME = 'gulp-js-inheritance';

var stream;

function gulpJsInheritance(options) {
    options = options || {};

    var files = [];
    var filesPaths = [];
    var graph;

    function writeStream(currentFile) {
        if (currentFile && currentFile.contents.length) {
            files.push(currentFile);
        }
    }

    function check(_filePaths) {
        _.forEach(_filePaths, function(filePath) {
            filesPaths = _.union(filesPaths, [filePath]);
            if (graph.index && graph.index[filePath]) {
                var fullpaths = graph.index[filePath].importedBy;

                if (options.debug) {
                    console.log('File', filePath);
                    console.log(' - importedBy', fullpaths);
                }
                filesPaths = _.union(filesPaths, fullpaths);
            }
            if (fullpaths)
                return check(fullpaths);
        });
        return true;
    }

    function endStream() {
        if (files.length) {

            graph = jsGraph.parseDir(options.dir, options);

            check(_.pluck(files, 'path'));

            vfs.src(filesPaths)
                .pipe(es.through(
                    function(f) {
                        stream.emit('data', f);
                    },
                    function() {
                        stream.emit('end');
                    }
                ));
        } else {
            stream.emit('end');
        }
    }

    stream = es.through(writeStream, endStream);

    return stream;
};

module.exports = gulpJsInheritance;
