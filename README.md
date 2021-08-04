# laravel-real-favicon
favicon generation using realfavicongenerator.net

## What does this package do?
### 1.
Upon installation it creates a new entry in your `package.json`'s `scripts` section:
```json

{
  "scripts": {
    "generate-favicon": "node node_modules/@marfalkov/laravel-real-favicon/index.js"
  },
}

```
### 2.
Once your single source image file is ready it will generate your favicons from it.

### 3.
It generates a partial in `resources/views/partials/favicon.blade.php`
### 4.
It inserts an include after your meta tags into `resources/views/app.blade.php`:
```php

@include('partials.favicon')

```
## The reasoning behind this package

When do you need to generate favicons for a site? Probably when you are in the early stage of development and have the original favicon source file ready. Then later when you want to change the favicon. A laravel mix task is not an ideal solution for this purpose, so I decided to  take a different approach. This task is a perfect match for an npm script that you can use only when you need it, instead of polluting your `webpack.mix.js`.

## Usage:
### 1.
```console

npm install --save-dev @marfalkov/laravel-real-favicon

```
### 2.
Put your single favicon source image file with .jpg, .png or .svg extension to `/resources/favicon/original/`

### 3.
 - Make sure you have an `app.blade.php` in `resources/views`
 - If you wish to have your main layout elsewhere or name other than `app.blade.php` you can change it in `resources/favicon/config/options.json`
### 4.
```console

npm run generate-favicon

```
### 5.
Enjoy your generated favicons!

## Credits

[shelljs](https://www.npmjs.com/package/shelljs "shelljs")

[npm-add-script](https://www.npmjs.com/package/npm-add-script "npm-add-script")

[gulp-real-favicon](https://www.npmjs.com/package/gulp-real-favicon "gulp-real-favicon")

## TODO's
- clean up code
- write test

License: [MIT](https://opensource.org/licenses/MIT "The MIT License")
