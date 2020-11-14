var loadNpmTasks = function (grunt) {
    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
}

var initConfig = function (grunt) {
    var account = require('./account.json');
    var branch = grunt.option('branch') || account.branch;
    var email = grunt.option('email') || account.email;
    var password = grunt.option('password') || account.password;
    var ptr = grunt.option('ptr') ? true : account.ptr;

    grunt.initConfig({
        screeps: {
            options: {
                email: email,
                password: password,
                branch: branch,
                ptr: ptr
            },
            dist: {
                src: ['dist/*.js']
            }
        },

        clean: {
            'dist': ['dist']
        },

        copy: {
            screeps: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: '**',
                    dest: 'dist/',
                    filter: 'isFile',
                    rename: function (dest, src) {
                        return dest + src.replace(/\//g, '_');
                    }
                }],
            }
        },
    });
}

var registerReplaceTask = function (grunt) {
    let ReplaceImports = function (abspath, rootdir, subdir, filename) {
        if (abspath.match(/.js$/) == null) {
            return;
        }
        let file = grunt.file.read(abspath);
        let updatedFile = '';

        let lines = file.split('\n');
        for (let line of lines) {
            // Compiler: IgnoreLine
            if ((line).match(/[.]*\/\/ Compiler: IgnoreLine[.]*/)) {
                continue;
            }
            let reqStr = line.match(/(?:require\(["'])([^_a-zA-Z0-9]*)([^"']*)/);
            if (reqStr && reqStr != "") {
                let reqPath = subdir ? subdir.split('/') : []; // relative path
                let upPaths = line.match(/\.\.\//gi);
                if (upPaths) {
                    for (let i in upPaths) {
                        reqPath.splice(reqPath.length - 1);
                    }
                } else {
                    let isRelative = line.match(/\.\//gi);
                    if (!isRelative || isRelative == "") {
                        // absolute path
                        reqPath = [];
                    }
                }

                let rePathed = "";
                if (reqPath && reqPath.length > 0) {
                    while (reqPath.length > 0) {
                        rePathed += reqPath.shift() + "_";
                    }
                }
                line = line.replace(/require\(['"]([\.\/]*)([^"']*)./, "require\('" + rePathed + "$2'").replace(/\//gi, '_');
            }

            updatedFile += (line + '\n');
        }

        grunt.file.write((rootdir + '/' + (subdir ? subdir + '/' : '') + filename), updatedFile);
    };

    grunt.registerTask('replace', 'Replaces file paths with _', function () {
        grunt.file.recurse('./dist', ReplaceImports);
    });
}

var setDefaultTask = function (grunt) {
    grunt.registerTask('default', ['clean', 'copy:screeps', 'replace']);
}

module.exports = function (grunt) {
    loadNpmTasks(grunt);
    initConfig(grunt);
    registerReplaceTask(grunt);
    setDefaultTask(grunt);
}

