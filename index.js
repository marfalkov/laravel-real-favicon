const fs = require('fs');
const path = require('path');
const realFavicon = require('gulp-real-favicon');
const shell = require('shelljs');

const generatorConfig = require('../../../resources/favicon/config/generator.json');
const options = require('../../../resources/favicon/config/options.json');

options.publicPath = "public",
options.blade = "resources/views/partials/favicon.blade.php",
options.inputPath = "./resources/favicon/original";
options.dataFilePath = "./resources/favicon/temp";
options.dataFile = "faviconData.json";
options.configPath = "./resources/favicon/config/generator.json";
options.inputFile = "*.{jpg,png,svg}";

const _includeString = "@include('partials.favicon')"

async function insertIncludeIntoAppBlade() {
    try {
        // read contents of the file
        const data = fs.readFileSync(options.appBlade, 'UTF-8');
        // let soup = new JSSoup(data, false);
        if ( data.includes(_includeString) ) {
            console.log(_includeString+' already exist in '+options.appBlade+'. nothing to do.')
            shell.exit(0);
        } else {
            // split the contents by new line
            const lines = data.split(/\r?\n/);
            let content = []
            let metaTagIndexes = []
            // print all lines
            lines.forEach((line, index) => {
                content.push(line)
                if ( line.includes('<meta') ) {
                    metaTagIndexes.push(
                        index
                    )
                }
            });
            content.splice( 
                metaTagIndexes[metaTagIndexes.length-1]+1,
                0,
                '        '+_includeString )
            result = ''
            content.forEach(
                (line) => {
                    result += line+'\n'
                }
            )
            fs.writeFile(path.normalize(options.appBlade), result, (error) => {
                if (error) {
                    console.error(err);
                    shell.exit(1);
                } else {
                    console.log(_includeString+' inserted into: ' + options.appBlade);
                    shell.exit(0);
                }
            });
        }
    } catch (err) {
        console.error(err);
        shell.exit(1);
    }
}

async function _generateFavicon(_path) {
    let dataFilePath = options.dataFilePath + '/' + options.dataFile;
    let destinationPath = options.publicPath;
    let config = generatorConfig;
    
    shell.mkdir('-p', path.dirname(dataFilePath));
    
    config.masterPicture = _path;
    config.dest = destinationPath;
    config.iconsPath = options.output;
    config.markupFile = dataFilePath;
    
    console.log('Generating favicons. This may take a while...');

    try {
        realFavicon.generateFavicon(config, () => {
    
            shell.mkdir('-p', path.dirname(options.blade));
        
            let html = JSON.parse(
                fs.readFileSync(dataFilePath)
            ).favicon.html_code;

            const regex = /(href\s*=\s*(?:"|')(.*?)(?:"|'))/ig;
            html = html.replace(regex, `href="{{ asset('$2') }}"`);
        
            fs.writeFile(path.normalize(options.blade), html, (error) => {
                if (error) {
                    console.error(err);
                    shell.exit(1);
                } else {
                    console.log('Favicons generated! the blade partial: ' + options.blade );
                    insertIncludeIntoAppBlade();
                }
            });
        });
    } catch (error) {
        console.error(error);
        shell.exit(1);
    }
}

async function getSourceImage() {
    try {
        shell.mkdir('-p', path.dirname(options.inputPath));

        const files = fs.readdirSync(options.inputPath);

        let firstImageWithPath = null
        let idx = 0;

        if ( files.length ) {
            do {
                const file = files[idx]
                if ( file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.svg') ) {
                    firstImageWithPath = options.inputPath+'/'+file
                }
                idx = idx + 1;
            } while ( firstImageWithPath === null || idx === files.length-1 )
        }

        if ( firstImageWithPath !== null ) {
            await _generateFavicon(firstImageWithPath);
        } else {
            console.error('Could not find the source image in '+options.inputPath+' with .jpg, .png, or .svg extension.');
            console.error('Make sure it is there and run npm generate-favicon again!');
            shell.exit(1);
        }
    } catch (error) {
        console.error(error);
        shell.exit(1);
    }
    
}

getSourceImage()