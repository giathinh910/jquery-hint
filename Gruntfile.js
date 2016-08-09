module.exports = function (grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    var config = {

        /* Path variables
         -------------------------------------------*/
        src: 'src',
        src_less: '<%= src %>/less',

        dist: 'dist',

        /* Watch
         -------------------------------------------*/
        watch: {
            options: {
                spawn: false
            },
            grunt: {
                files: ['Gruntfile.js']
            },
            less: {
                files: ['<%= src %>/**/*.less'],
                tasks: ['less']
            },
            jsmin: {
                files: [
                    '<%= dist_js %>/*.js',
                ],
                tasks: ['uglify']
            },
            cssmin: {
                files: [
                    '<%= src %>/*.css',
                ],
                tasks: ['cssmin']
            },
        },

        browserSync: {
            bsFiles: {
                src: [
                    "<%= dist %>/*.css",
                ]
            },
            options: {
                watchTask: true,
                proxy: "http://localhost/",
                port: 4000,
                ui: false,
                // logLevel: "debug",
                // tunnel: true
            }
        },

        /* CSS Min
         -------------------------------------------*/
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= dist %>',
                    src: ['tb.hint.css'],
                    dest: '<%= dist %>',
                    ext: '.min.css'
                }]
            }
        },

        /* Uglify
         -------------------------------------------*/
        uglify: {
            dist: {
                files: {
                    '<%= dist_js %>/tb.hint.min.js': ['<%= dist_js %>/tb.hint.js']
                }
            }
        },

        /* LESS
         -------------------------------------------*/
        less: {
            development: {
                options: {
                    paths: ["less"]
                },
                files: {
                    "<%= dist %>/tb.hint.css": "<%= src_less %>/style.less"
                }
            }
        },
    };

    grunt.initConfig(config);
    grunt.registerTask('default', ['browserSync', 'watch']);
};
