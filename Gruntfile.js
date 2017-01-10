module.exports = function(grunt) {
  "use strict";
  require( 'load-grunt-tasks' )( grunt );

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      build: {
        dot: true,
        src: "build/**/*"
      },
      dist: {
        dot: true,
        src: "dist/**/*"
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        createTag: false,
        commit: false,
        push: false
      }
    },
    copy: {
      build: {
        files: [{
          expand: true,
          cwd: 'src/qcjson/',
          src: ['**/*.js'],
          dest: 'build/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'build/',
          src: '*.min.js',
          dest: 'dist/'
        }]
      }
    },
    uglify: {
      options: {
        mangle: false,
        banner: '/*! <%= pkg.name %> <%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy/mm/dd HH:MM:ss Z") %> | ' +
          '(c)<%= grunt.template.today("yyyy") %> Genome Research Ltd */\n'
      },
      build: {
        files: [
          {
            expand: true,   // Enable dynamic expansion.
            cwd: 'build/',  // Src matches are relative to this path.
            src: ['*.js'],  // Actual pattern(s) to match.
            dest: 'build/', // Destination path prefix.
            ext: '.min.js'  // Dest filepaths will have this extension.
          }
        ]
      },
    },
    jsonlint: {
      pkg: {
        src: ['package.json', '.jscsrc', '.jshintrc']
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'src/qcjson/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    jscs: {
      main: [ 'Gruntfile.js',
              'src/qcjson/**/*.js'
      ],
      options: {
        config: '.jscsrc'
      }
    },
    qunit: {
      options: {
        timeout: 5000,
        console: true
      },
      all: ['test/test.html']
    },
    watch: {
      js: {
        files:[
          'package.json',
          'Gruntfile.js',
          '.jshintrc',
          '.jscsrc',
          'src/qcjson/**/*.js',
          'src/bamcheck/**/*.js',
          'test/*.js',
          'test/qcjson/*.js',
          'test/bamcheck/*.js',
          'test/test.html'
        ],
        tasks: [
          'test'
        ]
      }
    }
  });

  grunt.registerTask('lint', ['jsonlint', 'jshint', 'jscs']);
  grunt.registerTask('build', ['clean:build', 'copy:build', 'uglify:build']);
  grunt.registerTask('test', ['lint', 'build', 'qunit']);
  grunt.registerTask('prepdist', ['clean:dist', 'test', 'copy:dist']);
  grunt.registerTask('default', ['test']);
};
