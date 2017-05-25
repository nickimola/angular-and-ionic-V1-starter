var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var templateCache = require('gulp-angular-templatecache');
var cssnano = require('gulp-cssnano');
var less = require('gulp-less');
var path = require('path');
var runSequence = require('gulp-run-sequence');
var copy = require('gulp-copy');
var del = require('del');
var mainBowerFiles = require('main-bower-files');
var fs = require('fs');
var xml2js = require('xml2js');
var colors = require('colors');
var exec = require('gulp-exec');
// To init the app
var pkg = require('./info.json');

colors.setTheme({
    success: 'green',
    warn: 'yellow',
    info: 'blue',
    error: 'red',
    customDebug: 'magenta'
});

// File paths required for all the following gulp tasks to work. - DO NOT change this unless necessary
var dests = {
    css: './www/css',
    js: './www/js',
    fonts: './www/assets/fonts',
    root: './www'
};
var staticCopy = {
    rootContent: ['./src/index.html', './src/assets/**/*'],
    ionicFonts: ['./bower_components/ionic/fonts/*']
};
var paths = {
    sass: ["./scss/ionic.app.scss"],
    coffee: ['./src/**/*.coffee'],
    less: ['./src/**/*.less'],
    templates: ['./src/**/**/*.tpl.html']
};


/************************************************
 * IONIC
 * - before serving, compile using build-develop
 * - after serving, start watching for changes
 ************************************************/
gulp.task('serve:before', ['build']);
gulp.task('serve:after', ['watch']);

/***********************************
 * VARIOUS TASKS
 ************************************/
gulp.task('watch', function () {

    gulp.watch(paths.sass, ['compile-sass']);
    gulp.watch(paths.coffee, ['compile-coffee', 'unify-templates']);
    gulp.watch(paths.less, ['compile-less']);
    gulp.watch(paths.templates, ['unify-templates']);

});

/********************************************************************************************************************************************************************************************
 * BUILD PROCESS FOR DEVELOPMENT
 *********************************************************************************************************************************************************************************************/

/*************************************************************
 * Handle bower components and vendor files (js and css files
 *************************************************************/
gulp.task('concat-bower-css', function () {
    return gulp.src(mainBowerFiles({filter: /.*\.css/}))
        .pipe(concat('bower.css'))
        .pipe(gulp.dest(dests.css))
});
gulp.task('concat-bower-js', function () {
    return gulp.src(mainBowerFiles({filter: /.*\.js/}))
        .pipe(concat('bower.js'))
        .pipe(gulp.dest(dests.js))
});
gulp.task('handle-bower', ['concat-bower-css', 'concat-bower-js'], function () {
    console.log(colors.success('>>>>>>>>>>>>>>>>>>> Bower files successfully merged'));
});

/******************************************************************
 Compile all coffeescript, LESS, SASS and templates files together
 ******************************************************************/
gulp.task('compile-sass', function (done) {
    gulp.src(paths.sass)
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(concat('bower.css'))
        .pipe(gulp.dest(dests.css))
        .on('end', done);
});
gulp.task('compile-coffee', function (done) {
    gulp.src(paths.coffee)
        .pipe(coffee({bare: true})
            .on('error', gutil.log.bind(gutil, 'Coffee Error')))
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(dests.js))
        .on('end', done)
});
gulp.task('compile-less', function () {
    gulp.src(paths.less)
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(dests.css));
});
gulp.task('unify-templates', function () {
    return gulp.src(paths.templates)
        .pipe(templateCache('templates.js', {module: 'nickAppCV', root: './'}))
        .pipe(ngAnnotate())
        .pipe(gulp.dest(dests.js));
});
gulp.task('compiling-files', [
    'compile-sass',
    'compile-coffee',
    'compile-less',
    'unify-templates'], function () {
    return console.log(colors.success(">>>>>>>>>>>>>>>>>>> Files compiled successfully"));
});

/**********************************
 Copy static elements to www folder
 ***********************************/
gulp.task('copy-static-elements-to-root', function () {
    return gulp.src(staticCopy.rootContent)
        .pipe(copy(dests.root, {prefix: 1}));
});
gulp.task('copy-ionic-fonts', function () {
    return gulp.src(staticCopy.ionicFonts)
        .pipe(copy(dests.fonts, {prefix: 4}));
});
gulp.task('copy-favicon', function () {
    return gulp.src('./src/favicon.ico')
        .pipe(copy(dests.root, {prefix: 1}));
});
gulp.task('copying-to-www', ['copy-static-elements-to-root', 'copy-ionic-fonts', 'copy-favicon'], function () {
    return console.log(colors.success(">>>>>>>>>>>>>>>>>>> Files copied successfully"));
});

/********
 * Build
 ********/
gulp.task('build', ['handle-bower'], function () {
    runSequence('compiling-files', 'copying-to-www')
});


/********************************************************************************************************************************************************************************************
 * BUILD PROCESS FOR PRODUCTION
 *********************************************************************************************************************************************************************************************/
/*************************************************************
 * Handle bower components and vendor files (js and css files
 *************************************************************/
gulp.task('concat-bower-css-production', function () {
    return gulp.src(mainBowerFiles({filter: /.*\.css/}))
        .pipe(concat('bower.css'))
        .pipe(cssnano())
        .pipe(gulp.dest(dests.css))
});
gulp.task('concat-bower-js-production', function () {
    return gulp.src(mainBowerFiles({filter: /.*\.js/}))
        .pipe(concat('bower.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dests.js))
});
gulp.task('handle-bower-production', ['concat-bower-css-production', 'concat-bower-js-production'], function () {
    console.log(colors.success('>>>>>>>>>>>>>>>>>>> Bower files successfully merged'));
});

/******************************************************************
 Compile all coffeescript, LESS, SASS and templates files together
 ******************************************************************/
gulp.task('compile-sass-production', function (done) {
    gulp.src(paths.sass)
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(concat('bower.css'))
        .pipe(cssnano())
        .pipe(gulp.dest(dests.css))
        .on('end', done);
});
gulp.task('compile-less-production', function () {
    gulp.src(paths.less)
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(cssnano())
        .pipe(gulp.dest(dests.css));
});
gulp.task('compile-coffee-production', function (done) {
    gulp.src(paths.coffee)
        .pipe(coffee({bare: true})
            .on('error', gutil.log.bind(gutil, 'Coffee Error')))
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dests.js))
        .on('end', done)
});
gulp.task('unify-templates-production', function () {
    return gulp.src(paths.templates)
        .pipe(templateCache('templates.js', {module: 'hgApp', root: './'}))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest(dests.js));
});

gulp.task('compiling-files-production', [
    'compile-sass-production',
    'compile-less-production',
    'compile-coffee-production',
    'unify-templates-production'], function () {
    return console.log(colors.success(">>>>>>>>>>>>>>>>>>> Files compiled successfully"));
});

/**********************************
 Copy static elements to www folder
 ***********************************/
gulp.task('copy-static-elements-to-root-production', function () {
    return gulp.src(staticCopy.rootContent)
        .pipe(copy(dests.root, {prefix: 1}));
});
gulp.task('copy-ionic-fonts-production', function () {
    return gulp.src(staticCopy.ionicFonts)
        .pipe(copy(dests.fonts, {prefix: 4}));
});
gulp.task('copy-favicon-production', function () {
    return gulp.src('./src/favicon.ico')
        .pipe(copy(dests.root, {prefix: 1}));
});
gulp.task('copying-to-www-production', ['copy-static-elements-to-root-production', 'copy-ionic-fonts-production', 'copy-favicon-production'], function () {
    return console.log(colors.success(">>>>>>>>>>>>>>>>>>> Files copied successfully"));
});

/***********
 * Build
 ***********/
gulp.task('build-p', ['handle-bower-production'], function () {
    runSequence('increment-version-number', 'compiling-files-production', 'copying-to-www-production')
});


/******************************
 Utilities
 ******************************/
var add = gutil.env.add;
var name = gutil.env.name;
var commandToExecute = 'scaffolt -g scaffolt-generators ' + add + " " + name;

gulp.task('scaffolt', function () {
    exec(commandToExecute, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    })
    console.log(colors.success(">>>>>>>>>>>>>>>>>>> Command executed: " + commandToExecute));
});

/********************************************************************
 Init required files to use details from info.json file
 ******************************************************************/
function string_src(filename, string) {
    var src = require('stream').Readable({ objectMode: true })
    src._read = function () {
        this.push(new gutil.File({
            cwd: "",
            base: "",
            path: filename,
            contents: new Buffer(string)
        }))
        this.push(null)
    }
    return src
}

gulp.task('increment-version-number', function () {
    fs.readFile('config.xml', 'utf8', function (err, data) {

        var timestamp = (function () {
            var now = new Date();
            var year = now.getUTCFullYear().toString().substring(2, 4);
            var month = ("0" + (now.getUTCMonth() + 1)).slice(-2);
            var day = ("0" + now.getUTCDate()).slice(-2);
            var hours = ("0" + now.getUTCHours()).slice(-2);
            var min = ("0" + now.getUTCMinutes()).slice(-2);
            return year.toString() + month.toString() + day.toString() + hours.toString() + min.toString();
        })();


        if (err) {
            return console.log(colors.error(err));
        }

        // Get XML
        var xml = data;

        // Parse XML to JS Obj
        xml2js.parseString(xml, function (err, result) {
            if (err) {
                return console.log(colors.error(err));
            }

            // Get JS Obj
            var obj = result;

            // ios-CFBundleVersion doen't exist in config.xml
            if (typeof obj['widget']['$']['ios-CFBundleVersion'] === 'undefined') {
                obj['widget']['$']['ios-CFBundleVersion'] = timestamp;
            }

            // android-versionCode doen't exist in config.xml
            if (typeof obj['widget']['$']['android-versionCode'] === 'undefined') {
                obj['widget']['$']['android-versionCode'] = timestamp;
            }

            // Increment build numbers (separately for iOS and Android)
            obj['widget']['$']['ios-CFBundleVersion'] = timestamp;
            obj['widget']['$']['android-versionCode'] = timestamp;

            // Build XML from JS Obj
            var builder = new xml2js.Builder();
            var xml = builder.buildObject(obj);

            // Write config.xml
            fs.writeFile('config.xml', xml, function (err) {
                if (err) {
                    return console.log(colors.error(err));
                }

                console.log(colors.success('>>>>>>>>>>>>>>>>>>> Build number successfully incremented - ' + timestamp));
            });

        });
    });
});

gulp.task('init-config', function () {
    fs.readFile('config.xml', 'utf8', function (err, data) {
        var author = pkg.author;
        var appName = pkg.appName;
        var appDescription = pkg.appDescription;
        var appId = pkg.appID;
        var appVersion = pkg.appVersion;
        if (err) {
            return console.log(colors.error(err));
        }
        // Get XML
        var xml = data;
        // Parse XML to JS Obj
        xml2js.parseString(xml, function (err, result) {
            if (err) {
                return console.log(colors.error(err));
            }
            // Get JS Obj
            var obj = result;
            var authorDetails = obj['widget']['author'][0]['$'];
            obj['widget']['$']['id'] = appId;
            obj['widget']['$']['version'] = appVersion;
            obj['widget']['name'] = appName;
            obj['widget']['description'] = appDescription;
            obj['widget']['author'][0]['_'] = author.name;
            authorDetails['email'] = author.email;
            authorDetails['href'] = author.website;

            // Build XML from JS Obj
            var builder = new xml2js.Builder();
            var xml = builder.buildObject(obj);

            // Write config.xml
            fs.writeFile('config.xml', xml, function (err) {
                if (err) {
                    return console.log(colors.error(err));
                }
                console.log(colors.success('>>>>>>>>>>>>>>>>>>> Config file xuccessfully setup'));
            });

        });
    });
});

gulp.task('init-ionic', function () {
    var obj =  '{"name":"' + pkg.appName + '","app_id":"' + pkg.appID + '","documentRoot": "www","gulpStartupTasks": ["watch"]}';
    return string_src("ionic.config.json", obj)
        .pipe(gulp.dest('./'))
});

gulp.task("init-bower", function() {
    var bower = require('./bower.json');
    //cycle through each otential property on our base object
    for (var prop in bower) {
        if(prop == 'name'){
            bower[prop] = pkg.appName;
            console.log(bower);
        }
    }
    return string_src("bower.json", JSON.stringify(bower))
        .pipe(gulp.dest('./'))
});

gulp.task("init-package", function() {
    var bower = require('./package.json');
    //cycle through each otential property on our base object
    for (var prop in bower) {
        if(prop == 'name'){
            bower[prop] = pkg.appName;
            console.log(bower);
        }
        if(prop == 'description'){
            bower[prop] = pkg.appDescription;
            console.log(bower);
        }
        if(prop == 'version'){
            bower[prop] = pkg.appVersion;
            console.log(bower);
        }
    }
    return string_src("package.json", JSON.stringify(bower))
        .pipe(gulp.dest('./'))
});

gulp.task("init", function (){
    runSequence('init-package', 'init-bower', 'init-ionic', 'init-config')
});