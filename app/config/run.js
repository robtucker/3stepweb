'use strict';

var run = /*@ngInject*/ function($rootScope, AppGlobals) {

    // change page title based on state
    $rootScope.$on('$stateChangeSuccess', function(event, toState)  {
        $rootScope.pageTitle = '';

        if ( toState.title ) {
            $rootScope.pageTitle += toState.title;
            $rootScope.pageTitle += ' \u2014 ';
        } else {
            $rootScope.pageTitle += AppGlobals.appTitle;
        }
    });

};

module.exports = run;