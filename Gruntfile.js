module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            "glue": {
                files: [
                    {
                        src: [
                            'src/resources/_header.js',
                            'src/glue.js',
                            'src/Instance.js',
                            'src/Listener.js',
                            'src/Nexus.js',
                            'src/Observer.js',
                            'src/resources/_footer.js'
                        ],
                        dest: 'build/glue.js'
                    }
                ]
            },

            "widget": {
                files: [
                    {
                        src: [
                            "src/plugins/widget/resources/_header.js",
                            "src/plugins/widget/List.js",
                            "src/plugins/widget/Dict.js",
                            "src/plugins/widget/Widget.js",
                            "src/plugins/widget/resources/_footer.js"
                        ],
                        dest: 'build/glue.plugin.widget.js'
                    }
                ]
            },

            "model": {
                files: [
                    {
                        src: [
                            "src/plugins/model/resources/_header.js",
                            "src/plugins/model/Model.js",
                            "src/plugins/model/resources/_footer.js"
                        ],
                        dest: 'build/glue.plugin.model.js'
                    }
                ]
            },

            "mustache": {
                files: [
                    {
                        src: [
                            "src/plugins/mustache/Mustache.js",
                        ],
                        dest: 'build/glue.plugin.mustache.js'
                    }
                ]
            }
        },

        uglify: {
            glue: {
                src: 'build/glue.js',
                dest: 'build/glue.min.js'
            },
            widget: {
                src: 'build/glue.plugin.widget.js',
                dest: 'build/glue.plugin.widget.min.js'
            },
            model: {
                src: 'build/glue.plugin.model.js',
                dest: 'build/glue.plugin.model.min.js'
            },
            mustache: {
                src: 'build/glue.plugin.mustache.js',
                dest: 'build/glue.plugin.mustache.min.js'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']);

};