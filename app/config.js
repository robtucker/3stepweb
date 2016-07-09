angular.module('3stepweb', [
    'ui.router',
    '3stepweb.templates'
]);

angular.module('3stepweb').config(['$logProvider', '$locationProvider', '$httpProvider',
    function($logProvider, $locationProvider, $httpProvider){

        $logProvider.debugEnabled(true);

        $locationProvider.html5Mode(true);

        $httpProvider.defaults.paramSerializer = '$httpParamSerializerJQLike';
    }]);
