angular.module('3stepweb').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){

        $stateProvider
            .state('root', {
                abstract: true,
                template: '<ui-view/>'
            })
            .state('index', {
                parent: 'root',
                url: '/',
                templateUrl: 'index.html'
            })
            .state('about', {
                parent: 'root',
                url: 'about',
                template: '<ui-view/>'
            })
            .state('showcase', {
                parent: 'root',
                url: 'showcase/{client}',
                template: '<ui-view/>'
            })
    }]);