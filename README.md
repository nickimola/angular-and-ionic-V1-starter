# Angular & Ionic (v1) Starter 

### What's used
* [Angular v1](https://angularjs.org/)
* [Ionic Framework v1](http://ionicframework.com/docs/v1/)
* [Cordova](https://cordova.apache.org/)
* [Gulp](http://gulpjs.com/)

Pre Processors:
* [Coffeescript](http://coffeescript.org/)
* [Less](http://lesscss.org/)


## Getting Started
* Clone this repository `git clone git@bitbucket.org:nickimola/ionic-app-starter.git`.
* Navigate inside the repository just cloned `cd ionic-app-starter`.
* Install the global npm modules `npm install -g bower yo`
* Install the local npm modules `npm install`.
* Install bower modules `bower install`.
* Prepare the app by adding the right values to `info.json` (located in the root of the project).
* Run `gulp init` to initialize the app so that it uses the properties from _info.json_ (modified in the step above) .
* Start a live reload server by running `ionic serve` (check the [ionic CLI](https://ionicframework.com/docs/cli/#commands) for the full documentation).
* Open the browser and navigate to the right address, you should see a "Hello World" screen.

## The project's structure
The structure of the project is quite simple.

There are two main folders in the project:
* `src` - this contains all the files that you can safely edit
* `www` - this contains all the compiled files and will be served in the browser.

The `src` folder's structure is the following:

* `app` - contains `app.coffee` (to bootstrap the app) and `variables.less` (to create all your less variables to be used in the whole project)
* `assets` - contains all the assets required by your app (fonts, img, etc)
* `directives` - contains all the directives that you need in your app 
* `sections` - contains all the pages (sections) of your app.

Everytime you add something inside the `assets` folder, you need to stop the live reload and run `gulp build`. This will re-compile all the files as well as mirroring the `assets` folder inside `www`, making your newly added assets available in the browser.

> NOTE: Do not edit any files outside the `src` folder, as this will likely be replaced during the compiling process or simply not included in the app.

#### Add new section (page) to the app

`scaffolt -g scaffolt-generators section {pageName}`

#### Add new directive to the app

`scaffolt -g scaffolt-generators directive {directiveName}`

> Note: All the automated templates are located inside `scaffolt-generators` and they use handlebars to generate files. Feel free to add your own if needed or modify the exeisting ones if required.

## Build
#### Build for development
`gulp build` - This will build the app NOT minified

#### Build for production
`gulp build-p` - This will build the app minified

> Note: 
> * All the files with extension `*.less` will be compiled to `style.css`
> * All the files with extension `*.coffee` will be compiled to `app.js`> 
> * All the files with extension `*.tpl.html` will be compiled to a javascript file called `templates.js` which is used by angular's `ngAnnotate` to cache the templates.
> * All the files inside `assets/` will be copied from `src` to `www` with the same folder structure 
