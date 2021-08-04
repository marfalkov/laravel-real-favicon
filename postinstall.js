var shell = require('shelljs');
var npmAddScript = require('npm-add-script');

shell.cp('-Rn', 'resources/', '../../../');

shell.cd('../../../')

npmAddScript({key: "generate-favicon" , value: "node node_modules/@marfalkov/laravel-real-favicon/index.js" , force: true})

shell.exit(0);
