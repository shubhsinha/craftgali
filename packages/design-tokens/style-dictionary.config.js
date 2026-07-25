const StyleDictionary = require('style-dictionary');

module.exports = {
  source: ['tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/web/',
      files: [{ destination: 'tokens.css', format: 'css/variables' }],
    },
    flutter: {
      transformGroup: 'flutter',
      buildPath: 'build/flutter/',
      files: [{ destination: 'theme.dart', format: 'flutter/class.dart' }],
    },
    tailwind: {
      transformGroup: 'js',
      buildPath: 'build/',
      files: [{ destination: 'tailwind.tokens.js', format: 'javascript/es6' }],
    },
  },
};
