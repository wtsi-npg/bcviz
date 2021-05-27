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
        src: ['package.json', '.eslintrc.json']
      }
    },
    eslint: {
      options: {
        configFile: '.eslintrc.json',
      },
      target: [
        'Gruntfile.js',
        'src/qcjson/**/*.js',
        'src/bamcheck/**/*.js'
      ]
    },
    qunit: {
      options: {
        timeout: 5000,
        console: true
      },
      all: ['test/*.html']
    },
  });

  grunt.registerTask('lint', ['jsonlint', 'eslint']);
  grunt.registerTask('build', ['clean:build', 'copy:build', 'uglify:build']);
  grunt.registerTask('test', ['lint', 'build', 'qunit']);
  grunt.registerTask('prepdist', ['clean:dist', 'test', 'copy:dist']);
  grunt.registerTask('default', ['test']);
};
