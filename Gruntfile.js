module.exports = function(grunt) {

	require('jit-grunt')(grunt);
	require('time-grunt')(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				jshintrc: true,
				reporter: require('jshint-stylish')
			},
			all: {
				src: [
					'Gruntfile.js',
					'src/js/app.js',
					'src/js/model.js',
					'src/js/map.js'
				]
			}
		},

		clean: {
			build: {
				src: ['dist/']
			}
		},

		copy: {
			build: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**', '!**/*js', '!**/*css'],
					dest: 'dist/'
				}]
			}
		},

		uglify: {
			build: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: ['**/*.js'],
						dest: 'dist/'
					}
				]
			}
		},

		cssmin: {
			build: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: ['**/*.css'],
						dest: 'dist/'
					}
				]
			}
		},

		htmlmin: {
			build: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: ['**/*.html'],
						dest: 'dist/'
					}
				]
			}
		},

		imagemin: {
			options: {
				optimizationLevel: 7,
 			},
			build: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: ['**/*.{png,jpg,gif}'],
						dest: 'dist/'
					}
				]
			}
		}

	});

	grunt.registerTask('build', [
		'clean',
		'jshint',
		'copy',
		'uglify',
		'htmlmin',
		'cssmin',
//		'imagemin'
	]);

	grunt.registerTask('default',['build']);

};