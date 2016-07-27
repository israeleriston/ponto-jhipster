/*global module:false*/
module.exports = exports;

function exports(grunt) {

  // Project configuration.
  grunt.initConfig({
    uglify : {
      my_target : {
        files : {
          'architecture-front-end.min.js' : ['front-end/**/*.js']
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);

}
