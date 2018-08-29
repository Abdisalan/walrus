// zip walrus
var zipFolder = require('zip-folder');
zipFolder('./dist', './walrus.zip', function (err) {
  err ? console.log(err) : console.log('Zipped walrus.zip...');
});