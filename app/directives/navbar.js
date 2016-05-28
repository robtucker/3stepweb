function Link ($scope, $element) {
    console.log('testing 123');
    /*
    $scope.isAuthenticated = function() {
        return Auth.check();
    };

    $scope.showLoginPrompt = function () {
        $loginModal.open();
    };
    */
}

var directive = /*@ngInject*/ function(){
    return {
        restrict: "E",
        templateUrl: "templates/navbar/navbar.html",
        link: Link
    };
};

module.exports = directive;