// delete zip and dist
var rimraf = require('rimraf');
rimraf('./dist', function () {
  rimraf('./walrus.zip', function () { console.log('Finished Cleaning...') });
});