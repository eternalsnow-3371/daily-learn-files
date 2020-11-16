const loadNpmTasks = function(grunt) {
  grunt.loadNpmTasks('grunt-screeps');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-eslint');
};

const initConfig = function(grunt) {
  let account = null;
  try {
    account = require('./conf/account.json'); // eslint-disable-line global-require
  } catch (err) {
    grunt.fail.fatal('ERROR! Can not find conf/account.json, create it after conf/account.example.json!');
  }
  const branch = grunt.option('branch') || account.branch;
  const email = grunt.option('email') || account.email;
  const password = grunt.option('password') || account.password;
  const ptr = grunt.option('ptr') ? true : account.ptr;

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
      dist: ['dist'],
      copy: ['copy']
    },

    copy: {
      screeps: {
        files: [{
          expand: true,
          cwd: 'copy/',
          src: '**',
          dest: 'dist/',
          filter: 'isFile',
          rename: function(dest, src) {
            return dest + src.replace(/\//g, '_');
          }
        }]
      }
    },

    jsbeautifier: {
      modify: {
        src: ['src/**/*.js', 'Gruntfile.js'],
        options: {
          config: './conf/.jsbeautifyrc'
        }
      },
      verify: {
        src: ['src/**/*.js', 'Gruntfile.js'],
        options: {
          mode: 'VERIFY_ONLY',
          config: './conf/.jsbeautifyrc'
        }
      }
    },

    eslint: {
      options: {
        configFile: 'conf/.eslintrc'
      },
      target: ['src/**/*.js', 'Gruntfile.js']
    }
  });
};

const registerReplaceTask = function(grunt) {
  const ReplaceImports = function(abspath, rootdir, subdir, filename) {
    const file = grunt.file.read(abspath);
    let updatedFile = '';

    const lines = file.split('\n');
    for (let line of lines) {
      // Compiler: IgnoreLine
      if ((line).match(/[.]*\/\/ Compiler: IgnoreLine[.]*/)) {
        continue;
      }
      const reqStr = line.match(/(?:require\(["'])([^_a-zA-Z0-9]*)([^"']*)/);
      if (reqStr && reqStr !== '') {
        let reqPath = subdir ? subdir.split('/') : []; // relative path
        const upPaths = line.match(/\.\.\//gi);
        if (upPaths) {
          const pathLevels = Object.keys(upPaths);
          for (let i = 0; i < pathLevels.length; i += 1) {
            reqPath.splice(reqPath.length - 1);
          }
        } else {
          const isRelative = line.match(/\.\//gi);
          if (!isRelative || isRelative === '') {
            // absolute path
            reqPath = [];
          }
        }

        let rePathed = '';
        if (reqPath && reqPath.length > 0) {
          while (reqPath.length > 0) {
            rePathed += reqPath.shift() + '_';
          }
        }

        line = line.replace(/require\(['"]([./]*)([^"']*)./, "require('" + rePathed + "$2'").replace(/\//gi, '_');
      }

      updatedFile += (line + '\n');
    }

    grunt.file.write((rootdir + '/' + (subdir ? subdir + '/' : '') + filename), updatedFile);
  };

  grunt.registerTask('replace', 'Replaces file paths with _', () => {
    grunt.file.copy('./src', './copy');
    grunt.file.recurse('./copy', ReplaceImports);
  });
};

const setUpdateTimeTask = function(grunt) {
  grunt.registerTask('code_update_check', 'Add update_time.js for code-update-check.', () => {
    grunt.file.delete('./dist/update_time.js');
    grunt.file.write('./dist/update_time.js', 'global.SCRIPT_UPDATE_TIME = ' + (new Date()).getTime() + ';\n\n');
  });
};

const setDefaultTask = function(grunt) {
  grunt.registerTask('default', ['clean', 'replace', 'copy:screeps', 'code_update_check', 'clean:copy']);
};

const setPushTask = function(grunt) {
  grunt.registerTask('push', ['clean', 'replace', 'copy:screeps', 'code_update_check', 'clean:copy', 'screeps']);
};

const setJsBeautifyTask = function(grunt) {
  grunt.registerTask('check', ['jsbeautifier:verify']);
  grunt.registerTask('format', ['jsbeautifier:modify']);
};

module.exports = function(grunt) {
  loadNpmTasks(grunt);
  initConfig(grunt);
  registerReplaceTask(grunt);
  setUpdateTimeTask(grunt);
  setDefaultTask(grunt);
  setPushTask(grunt);
  setJsBeautifyTask(grunt);
};
