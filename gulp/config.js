var dest = './www';
var src = './src';

module.exports = {
  sass: {
    src: src + '/styles/**/*.{sass,scss,css}',
    dest: dest + '/styles',
    settings: {
      indentedSyntax: false, // Enable .sass syntax?
      imagePath: '/images' // Used by the image-url helper
    }
  },
  less: {
    src: src + '/styles/**/*.less',
    dest: dest + '/styles'
  },
  browserify: {
    settings: {
      transform: ['babelify']
    },
    src: src + '/js/index.jsx',
    dest: dest + '/js',
    outputName: 'index.js',
  },
  "main-bower-files": {
    dest: dest + '/js',
  },
  html: {
    src: 'src/index.html',
    dest: dest
  },
  images: {
    src: src + '/images/**/*.*',
    dest: dest + '/images'
  },
  watch: {
    src: 'src/**/*.*',
    tasks: ['build']
  }
};
