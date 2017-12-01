angular.module('myApp', ['ionic', 'menuController', 'homeController'])
.run()
.config [
  '$stateProvider',
  '$urlRouterProvider',
  ($stateProvider, $urlRouterProvider) ->
# ui-router views definitions
#
# Relative (Always refers to the parent)
# '' = unnamed view in parent template
# 'viewName' = 'viewName' view in parent template
#
# Absolute (Uses the "@" symbol)
# '@' = unnamed view in index.html
# 'view1@view2' = "view1' in "view2"
# 'view1@' = "view1' in "index.html"
# '@view1' = unnamed view in in "view1"
    $stateProvider.state('app',
      cache: false
      url: '/app'
      abstract: true
      views: {
        '@': {templateUrl: './sections/menu/menu.tpl.html', controller: 'menuCtrl'}
      }
    ).state('app.home',
      cache: false
      url: '/home'
      views: {
        'main@app': {templateUrl: './sections/home/home.tpl.html', controller: 'homeCtrl'}
      }
    )

    $urlRouterProvider.otherwise 'app/home'
]