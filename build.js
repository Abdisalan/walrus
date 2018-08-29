// create dist folder and copy things over
var fs = require('fs');
var rimraf = require('rimraf');
var copyfiles = require('copyfiles');
var zipFolder = require('zip-folder');

var dir = './dist';

console.log('Removing dist...');
rimraf(dir, function () {

  console.log('Creating new dist and copying files...');
  copyfiles([
    'background.js',
    'content-script.js',
    'popup.js',
    '*.html',
    '*.json',
    './images/*',
    'dist'
  ], function () { console.log('Copied Files...') });
});
