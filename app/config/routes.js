'use strict';

var routes = /*@ngInject*/ function($stateProvider, $urlRouterProvider){

    // INDEX
    $stateProvider
        .state("index", {
            url: "/",
            templateUrl: "index/index.html"
        })
        .state("about", {
            url: "/about",
            templateUrl: "index/about.html"
        })
        .state("terms", {
            url: "/terms",
            templateUrl: "index/terms.html"
        })
        .state("pricing", {
            url: "/pricing",
            templateUrl: "index/pricing.html"
        })
        .state("contact", {
            url: "/contact",
            templateUrl: "index/contact.html"
        });

    // AUTH
    $stateProvider
        .state("signup", {
            url: "/signup",
            templateUrl: "index/index.html"
        })
        .state("login", {
            url: "/login",
            templateUrl: "index/index.html"
        });

    // USERS
    $stateProvider
        .state("user-show", {
            url: "/u/{username}",
            templateUrl: "users/show.html"
        });

    // For any unmatched url, send to /
    $urlRouterProvider.otherwise("/");
};

module.exports = routes;
