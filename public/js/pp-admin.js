(function(){'use strict'; angular.module('pp.core', [

    // vendors
    'ui.router',
    'ui.bootstrap',
    'ngMessages',
    'MessageCenterModule',
    'LocalStorageModule',
    'oc.lazyLoad',

    // templates
    'templates.core',
    'templates.admin',
    'templates.register',
    'templates.setup',
    'templates.borrower',
    'templates.invite'

]);


angular.module('pp.core').config(
    ['$locationProvider', '$httpProvider', 'AppGlobals', 'localStorageServiceProvider', '$ocLazyLoadProvider',
    function($locationProvider, $httpProvider, AppGlobals, localStorageServiceProvider, $ocLazyLoadProvider){

        $locationProvider.html5Mode(true);
        $httpProvider.defaults.timeout = AppGlobals.HTTP_TIMEOUT;
        localStorageServiceProvider.setStorageType(AppGlobals.STORAGE_TYPE);
        localStorageServiceProvider.setPrefix('pp');

        $httpProvider.interceptors.push('ApiInterceptor');

}]);

angular.module('pp.core').constant('AppGlobals', {
    APP_TITLE: 'PeerPay',
    API_URL: 'http://api2.peerpay.big/api/v1',
    ADMIN_URL: 'http://api2.peerpay.big/api/admin',

    FLASH_TIMEOUT: 8000,
    HTTP_TIMEOUT: 4000,
    SESSION_EXPIRY: 1800,

    //STATES
    STATES : {
        HOME: 'summary',
        FORBIDDEN: '403'
    },

    // CLIENT SETTINGS
    CLIENT_SUSPENDED: 'suspended',

    //STORAGE
    STORAGE_TYPE: 'sessionStorage',
    STORAGE_PREFIX: 'pp',
    STORAGE_KEY: {
        AUTH: 'ppAuth',
        ACCOUNTING: 'ppAccounting',
        BORROWER: 'ppBorrower',
        LENDER: 'ppLender',
        CLIENT: 'ppClient',
        COMPANY: 'ppCompany',
        FORM: 'ppForm',
        INVITE: 'ppInvite',
        NOTIFICATION: 'ppNotification',
        USER: 'ppUser'
    },
    EMAIL_DOMAIN_BLACKLIST: [
        'gmail.com',
        'hotmail.com',
        'hotmail.co.uk'
    ],

    DAYS: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '11',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '31'
    ],

    MONTHS: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '11',
        '11',
        '12'
    ],

    // MESSAGES
    EMAIL_DOMAIN_INVALID: 'Email domain is invalid',
    ACCOUNTING_CALLBACK_METHOD_ERROR: "We couldn't authorize your accounting system",
    INCORRECT_LOGIN: "Incorrect login details, please try again.",
    INVALID_PERMISSIONS: "You do not have the required privileges to access this resource",
    INVALID_ROLE: "You do not have the correct role to access this resource",
    ACCOUNTING_SELF_ASSESSMENT_SUCCESS: "Your risk assessment was successfully posted",
    CLIENT_AUTHORISED: "Client successfully authorised.",
    CLIENT_REJECTED: "Client successfully rejected.",

    FIELD_LABELS: {
        EMAIL_DOMAIN: {
            INDIVIDUAL: 'Private email domain',
            COMPANY: 'email domain'
        }
    },

    PAGE_TITLES: {
        INVITE: {
            BORROWER: {
                'assessment': "Complete Client Risk Profile",
                default: 'Pre-Register Borrower'
            },
            LENDER: {
                'assessment': "Complete Client Risk Profile",
                default: 'Pre-Register Lender'
            }
        }
    }
});

angular.module('pp.core').run(['$window', '$rootScope', '$state', '$location', 'AppGlobals',
    function($window, $rootScope, $state, $location, AppGlobals) {

        //change page title based on state
        $rootScope.$on('$stateChangeSuccess', function(event, toState)  {
            $rootScope.pageTitle = '';

            if ( toState.title ) {
                $rootScope.pageTitle += toState.title;
                $rootScope.pageTitle += ' \u2014 ';
            } else {
                $rootScope.pageTitle += AppGlobals.APP_TITLE;
            }
        });

        $rootScope.$on('$locationChangeSuccess', function() {
            $rootScope.actualLocation = $location.path();
        });

        $rootScope.$on('$stateNotFound',
            function(event, unfoundState, fromState, fromParams){
                console.log('unfound state');
                console.log(unfoundState);
                console.log(unfoundState.to); // "lazy.state"
                console.log(unfoundState.toParams); // {a:1, b:2}
                console.log(unfoundState.options); // {inherit:false} + default options
            })

}]);

// lodash
angular.module('pp.core').constant('_', window._);
angular.module('pp.core').controller('ActivationCtrl', ['$scope', '$state', '$filter', '$uibModal', 'messageCenterService', 'AuthModel', 'NotificationModel',
    function ($scope, $state, $filter, $uibModal, messageCenterService, AuthModel, NotificationModel) {

        NotificationModel.init();
        AuthModel.init();

        $scope.resolveCredentials = function(){

            if(NotificationModel.data.username &&
                NotificationModel.data.password) {
                return true;
            }
            // otherwise get the credentials from the failed login attempt
            if (AuthModel.data.attempt &&
                AuthModel.data.attempt.password &&
                AuthModel.data.attempt.username) {
                NotificationModel.data.username = AuthModel.data.attempt.username;
                NotificationModel.data.password = AuthModel.data.attempt.password;
                NotificationModel.save();
                return true;
            }  else {
                console.log("no credentials found");
                //$state.go('index');
                messageCenterService.add('danger', "We can't find a valid username and password");
            }
            console.log($scope.vm);
            return false;
        }

        $scope.resolveCredentials();
        $scope.vm = NotificationModel.data;

        // $scope.logo = $scope.vm.service_manager.logo || 'img/defaults/logo.jpg';
        $scope.logo = 'img/defaults/logo.jpg';
        $scope.title = 'Welcome to PeerPay';
        $scope.mobileConfirmed = false;

        console.log($scope.vm)

        $scope.getMobileToken = function(form){
            NotificationModel.getMobileToken($scope.vm)
                .then(function(success){
                    console.log(success);
                    NotificationModel.data.mobileToken.tokenId = success.data.data.tokenId;
                    NotificationModel.save();
                    console.log($scope.vm.mobile);
                    if (!$scope.vm.mobileToken.tokenId) {
                        messageCenterService.add("danger", "The token you submitted has been rejected. " +
                        "Please speak to your service manager");
                    }
                    $scope.mobileConfirmed = true;
                });
        };

        $scope.postActivateMobile = function(form) {
            console.log(form);
            NotificationModel.postActivateMobile($scope.vm)
                .then(function(success){
                    console.log(success);
                    if(AuthModel.login(success.data.data[0])){
                        console.log('logged in');
                        $state.go('setup.' + AuthModel.data.client.clientType + '.manage');
                        messageCenterService.add(
                            "success",
                            "Your account was successfully created",
                            { status: messageCenterService.status.next }
                        );
                    } else {
                        $state.go('login');
                        messageCenterService.add(
                            'warning',
                            "Your account was created, but we couldn't log you in. Please log in again.",
                            { status: messageCenterService.status.next }
                        );
                    }
                });
        };

        $scope.resendToken = function($event, type) {
            $event.preventDefault();
            console.log('token resend');
            if(type === 'email') {
                NotificationModel.getEmailToken();
            }
            if(type === 'mobile') {
                NotificationModel.getMobileToken();
            }
        };
    }]);

angular.module('pp.core').controller('AuthCtrl', ['$scope', 'AuthModel', '$state', 'messageCenterService',
    function($scope, AuthModel, $state, messageCenterService) {

        $scope.credentials = {
            username: '',
            password: '',
            remember: false
        };

        $scope.login = function () {
            AuthModel.postLogin($scope.credentials);
        };

        $scope.refreshUser = function() {
            AuthModel.getMe()
                .then(function(success){
                    console.log(success.data.data);
                });
        }

        $scope.cancel = function (form, $event) {
            form.$setPristine();
            $scope.credentials.username = '';
            $scope.credentials.password = '';
            $event.preventDefault();
        }
}]);

angular.module('pp.core').controller('BankAccountCtrl', ['_', '$window', '$scope', '$state', '$stateParams', 'AccountingModel', 'ClientModel', 'AuthModel', 'messageCenterService', 'AppGlobals',
    function (_, $window, $scope, $state, $stateParams, AccountingModel, ClientModel, AuthModel, messageCenterService, AppGlobals) {

        AccountingModel.init();
        $scope.vm = AccountingModel.data;
        $scope.clientType = AuthModel.data.client.clientType;

        $scope.getAuthorization = function(method, state) {
            return AccountingModel.getAuthorization(method, state);
        };

        $scope.getAccounts = function($event, state) {
            $event.preventDefault();
            console.log('getAccounts for state: ' + state);
            console.log($scope.vm);
            if(!AccountingModel.checkCredentials()) {
                return $scope.getAuthorization('getAccounts', state);
            }
            return AccountingModel.getAccounts(state);
        };

        $scope.inputAccount = function($event, form) {
            console.log(form);
            if(form.$valid) {
                $state.go('setup.' + $scope.clientType + '.accounts.authenticate.info');
            }
        };

        $scope.selectAccount = function($event) {
            $event.preventDefault();
            $state.go('setup.' + $scope.clientType + '.accounts.authenticate.info');
        };

        $scope.confirmAccount = function($event) {
            $event.preventDefault();
            $state.go('setup.' + $scope.clientType + '.accounts.authenticate.confirm');
        };

        $scope.returnToSetup = function() {
            $state.go('setup.' + $scope.clientType + '.manage');
        };

        $scope.postBankAuthentication = function($event, form) {
            AccountingModel.postBankAuthentication()
                .then(function(success) {
                    console.log('successfully posted bank test');
                    console.log(success);

                    // this has already been set in the back end
                    // now it just needs to be updated in the front end
                    AuthModel.data.client.clientData.bankAccountTestSent = true;
                    AuthModel.save();

                    $state.go('setup.' + $scope.clientType + '.accounts.sent');

                },function(error){
                    console.log('bank test failed');
                    console.log(error);
                });
        };

        $scope.postBankVerification = function(form) {
            AccountingModel.postBankVerification()
                .then(function(success){
                    console.log('successfully posted bank check');
                    $scope.accountVerified = true;

                    // this has already been set in the back end
                    // now it just needs to be updated in the front end
                    AuthModel.data.client.clientData.bankAccountConfirmed = true;
                    AuthModel.save();

                    $state.go('setup.' + $scope.clientType + '.accounts.success');
                },function(error){
                    console.log('bank check failed');
                    console.log(error);
                });
        };

    }]);

angular.module('pp.core').controller('ConfirmDepositCtrl',
    ['$scope', '$state', 'AuthModel','$uibModal', '$uibModalInstance', 'ClientModel', 'AppGlobals', 'ConfigModel',
    function ($scope, $state, AuthModel, $uibModal, $uibModalInstance, ClientModel, AppGlobals, ConfigModel) {

        /**
         * Handles functionality once user confirms deposit
         *
         * @param  {Object} $event [description]
         * @return {Boolean}
         */
        $scope.confirmDeposit = function ($event) {
            $uibModalInstance.close(true);
        }

        /**
         * Handles cancellation of confirm deposit modal
         *
         * @param  {Object} $event
         */
        $scope.cancelConfirmDeposit = function ($event) {
            $uibModalInstance.dismiss('cancel');
            $event.preventDefault();
        };
    }]);
angular.module('pp.core').controller('InviteClientCtrl',
    ['$scope', '$state', '$stateParams', 'FormModel', 'InviteModel', 'AppGlobals', 'messageCenterService', 'clientType',
    function ($scope, $state, $stateParams, FormModel, InviteModel, AppGlobals, messageCenterService, clientType) {

        var abort = function() {
            //$state.go('summary');
            messageCenterService.add(
                'danger',
                'The client you requested could not be found',
                {status: messageCenterService.status.next}
            );
        };

        var initializeScope = function() {
            // decide whether to load up saved data from the session
            var currentState = $state.current.name;
            if (currentState.indexOf('find') > 0 || currentState.indexOf('individual') > 0) {
                InviteModel.forget();
            }
            InviteModel.data.client.lenderType = $state.current.data.lenderType;

            console.log('type is : ' + clientType);

            //ensure the client type is set on the scope and the model
            $scope.clientType = InviteModel.data.client.clientType = clientType;
            InviteModel.save();
            $scope.vm = InviteModel.data;

            $scope.clientConfirmed = $scope.vm.clientConfirmed;
            $scope.borrowerAssessmentComplete = InviteModel.data.borrowerAssessmentComplete;

            $scope.detailsSubmitButton = "Complete Client Risk Analysis";
            $scope.emailDomainInvalid = AppGlobals.EMAIL_DOMAIN_INVALID;
        };

        var initializeForms = function() {
            // form data
            $scope.forms = undefined;
            if(clientType === 'borrower') {
                FormModel.init();
                var requireOrFail = true;
                FormModel.get('borrowerManagerAssessment', requireOrFail);
                FormModel.get('borrowerDetails', requireOrFail);
                $scope.forms = FormModel.data;
            }
        };

        var initializePageTitle = function() {
            function getPageTitle(page) {
                var titleType = clientType.toUpperCase();
                console.log(titleType);
                return AppGlobals.PAGE_TITLES.INVITE[titleType][page] || AppGlobals.PAGE_TITLES.INVITE[titleType].default;
            }

            $scope.findTitle       = getPageTitle('find');
            $scope.confirmTitle    = getPageTitle('confirm');
            $scope.primaryTitle    = getPageTitle('primary');
            $scope.assessmentTitle = getPageTitle('assessment');
            $scope.individualTitle = getPageTitle('individual');
        };

        initializeScope();
        initializeForms();
        initializePageTitle();


        // Log what ratings being selected
        $scope.rate = function (rating) {
            console.log('Rating Selected: ' + rating);
        }

        $scope.noRating = function () {
            console.log('No rating value: ' + ($scope.vm.ratingPrevent === true ? 0 : 1));
            $scope.vm.client.clientData.borrowerRating = $scope.vm.ratingPrevent === true ? 0 : '1';
        }

        $scope.postFindCompany = function (form) {
            var number = InviteModel.data.find.number;
            form.$setPristine();
            return InviteModel.findCompany(number, clientType);
        };

        $scope.confirmCompany = function ($event) {
            console.log('Confirm company');
            $event.preventDefault();
            InviteModel.data.clientConfirmed = true;
            InviteModel.save();
        };

        $scope.cancelCompanyConfirmation = function ($event) {
            $event.preventDefault();
            if(InviteModel.forget()) {
                //console.log('invite model has been forgotten');
                //console.log(InviteModel.data);
                $state.go('invite.find', {clientType: clientType});
            }
        };

        $scope.updateClient = function ($event, state) {
            $event.preventDefault();

            InviteModel.updateClient()
                .then(function(success) {
                    console.log(success);
                    //if (state == 'assessment') {
                        // Set the stars default value - as clientData get reset just
                        // before assessment the borrowerRating can not be set on the clientData
                        // earlier than when updateClient is called
                        //InviteModel.data.client.clientData.borrowerRating = 1;
                        //InviteModel.save();

                    //}

                    var clientNum = InviteModel.data.client.clientNumber;

                    if (state == 'primary') {
                        return $state.go('invite.user.primary', {clientNumber: clientNum});
                    } else if (state == 'assessment') {
                        return $state.go('invite.client.assessment', {clientNumber: clientNum})
                    } else {
                        throw new Exception("an invalid state was provided");
                    }
                }, function(error) {
                    console.log(error);
                });
        };

        // Boolean to display rating error
        $scope.ratingRequired = false;

        $scope.putAssessment = function(form) {

            // Check rating is undefined - if it is we show rating required
            if (InviteModel.data.client.clientData.borrowerRating == undefined) {
                $scope.ratingRequired = true;
                form.$valid = false;
            } else {
                $scope.ratingRequired = false;
                form.$valid = true;
            }

            if (form.$valid) {

                InviteModel.putAssessment($scope.vm.client.clientName)
                    .then(function(success){
                        InviteModel.data.borrowerAssessmentComplete = true;
                        InviteModel.save();
                        console.log(success);
                        $state.go('invite.client.confirm', {clientNumber: $scope.vm.client.clientNumber});
                        return true;
                    });
                return false;
            }
        };

        $scope.cancelAssessment = function($event) {
            $event.preventDefault();
            $state.go('invite.client.confirm', {clientNumber: $scope.vm.client.clientNumber});
        }
    }]);

angular.module('pp.core').controller('InviteUserCtrl',
    ['$scope', '$state', 'InviteModel', 'messageCenterService', 'AppGlobals', 'clientType',
        function ($scope, $state, InviteModel, messageCenterService, AppGlobals, clientType) {

            $scope.vm = InviteModel.data;

            $scope.postInvitePrimary = function () {
                InviteModel.postInvitePrimary($scope.vm);
            };

            /**
             * @todo fire confirmation model
             */
            $scope.cancelInvitePrimary = function ($event) {
                InviteModel.forget();
                $state.go('summary');
                $event.preventDefault();
            };
        }]);

angular.module('pp.core').controller('NavbarCtrl', ['$scope', '$uibModal', '$state','AuthModel',
    function ($scope, $uibModal, $state, AuthModel) {
        //console.log($scope);

        $scope.showNav = function() {
            //console.log($state);
            if($state.current.name.indexOf('register') !== -1) {
                return false;
            }
            return true;
        };

        $scope.isAuthenticated = false;
        $scope.navCollapsed = true;

        //console.log('Auth status is currently:');
        //console.log($scope.isAuthenticated);

        $scope.$on('login', function(){
            $scope.isAuthenticated = true;
        });

        $scope.$on('logout', function(){
            $scope.isAuthenticated = false;
            $scope.navCollapsed = true;

        });

        $scope.$on('unauthorized', function(){
            $scope.isAuthenticated = false;
        });

        $scope.user = AuthModel.getUser();


        $scope.manage = function() {
            var clientType = AuthModel.data.client.clientType;
            if(clientType == 'borrower' || clientType == 'lender') {
                return $state.go('setup.' + clientType + '.manage');
            }
            $state.go('forbidden');

        }

        $scope.openLoginModal = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'core/modals/login.html',
                //can't use the AuthCtrl here because it has to accept a modal instance as well
                //todo - think of a way round this problem
                controller: ['$scope', 'AuthModel', 'messageCenterService',
                    '$uibModal', '$uibModalInstance', '$state', 'ApiHandler',
                    function($scope, AuthModel, messageCenterService,
                             $uibModal, $uibModalInstance, $state, ApiHandler){
                        $scope.login = function() {
                            AuthModel.postLogin($scope.credentials,
                                //success callback
                                function () {
                                    $uibModalInstance.close();
                                },
                                // error callback
                                function () {
                                    $uibModalInstance.close();
                                }
                            );
                        };
                        $scope.cancel = function($event) {
                            $event.preventDefault();
                            $uibModalInstance.close(false);
                        };

                }]
            });

            modalInstance.result.then(function (result) {
                console.log(result);
            }, function () {
                console.log('dismiss');
            });
        };

        $scope.logoutUser = function() {
            AuthModel.postLogout();
            $scope.isAuthenticated = false;
            $scope.navCollapsed = true;
        }
    }]);
angular.module('pp.core').controller('RegisterCtrl',
    ['$scope', '$state', '$filter', '$uibModal', 'messageCenterService', 'AuthModel', 'invitationData', 'NotificationModel', 'AppGlobals',
    function ($scope, $state, $filter, $uibModal, messageCenterService, AuthModel, invitationData, NotificationModel, AppGlobals) {

        $scope.vm = NotificationModel.data;

        // $scope.logo = $scope.vm.service_manager.logo || 'img/defaults/logo.jpg';
        $scope.logo = 'img/defaults/logo.jpg';
        $scope.title = 'Welcome to PeerPay';
        $scope.mobileConfirmed = false;
        $scope.termsAccepted = false;

        console.log($scope.vm)

        $scope.formatDate = function(date){
              var dateOut = new Date(date);
              return dateOut;
        };

        $scope.acceptInvitation = function(){
            $state.go('register.details');
        };

        $scope.acceptTerms = function(form, $event) {
            $event.preventDefault();

            form.$dirty = true;

            if (form.$valid) {
                $scope.termsType = 'termsUserSignup';

                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'core/modals/terms.html',
                    controller:  'TermsCtrl',
                    scope: $scope,
                    resolve: {
                        TermsData: ['ConfigModel', function (ConfigModel) {
                            ConfigModel.getTerms('termsUserSignup', false);
                            return ConfigModel;
                        }]
                    }
                });

                modalInstance.result.then(function (result) {
                    console.log('Modal result: ' + result);
                    NotificationModel.data.acceptTerms = result;
                    NotificationModel.save();
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }
        };

        $scope.getEmailToken = function(form) {
            NotificationModel.getEmailToken($scope.vm)
                .then(function(success){
                    console.log(success);
                    console.log(NotificationModel.data)
                    NotificationModel.data.emailToken.tokenId = success.data.data.tokenId;
                    NotificationModel.save();
                    $state.go('register.email');
                });
        };

        $scope.getMobileToken = function(form) {
            NotificationModel.getMobileToken($scope.vm)
                .then(function(success){
                    console.log(success);
                    $scope.vm.mobileToken = success.data.data;
                    console.log($scope.vm.mobile);
                    if (!$scope.vm.mobile.tokenId) {
                        messageCenterService.add("danger", "The token you submitted has been rejected. " +
                        "Please speak to your service manager");
                    }
                    $scope.mobileConfirmed = true;
                });
        };

        $scope.postActivateEmail = function(form) {
            NotificationModel.postActivateEmail($scope.vm)
                .then(function(success){
                    console.log("email successfully activated");
                    //$scope.vm.emailToken = success.data.data;
                    $state.go('activate.mobile');
                });
        };

        $scope.postActivateMobile = function(form) {
            NotificationModel.postActivateMobile($scope.vm)
                .then(function(success){
                    console.log(success);
                    if(AuthModel.login(success.data.data[0])){
                        console.log('logged in');
                        $state.go('summary');
                        messageCenterService.add(
                            "success",
                            "Your account was successfully created",
                            { status: messageCenterService.status.next }
                        );
                    } else {
                        $state.go('login');
                        messageCenterService.add(
                            'warning',
                            "Your account was created, but we couldn't log you in. Please log in again.",
                            { status: messageCenterService.status.next }
                        );
                    }
                });
        };

        $scope.resendToken = function($event, type) {
            $event.preventDefault();
            console.log('token resend');
            if(type === 'email') {
                NotificationModel.getEmailToken();
            }
            if(type === 'mobile') {
                NotificationModel.getMobileToken();
            }
        };
}]);

angular.module('pp.core').controller('SetupCtrl',
    ['$scope', '$state', 'AuthModel','$uibModal', 'ClientModel', 'AppGlobals', 'ConfigModel',
    function ($scope, $state, AuthModel, $uibModal, ClientModel, AppGlobals, ConfigModel) {

        console.log($state);
        $scope.vm = AuthModel.data;
        $scope.clientType = AuthModel.data.client.clientType;
        $scope.companyConfirmBtn = (AuthModel.data.client.lenderType != 'individual' ? 'Company Details' : 'Individual Details');
        $scope.domainLabel = (AuthModel.data.client.lenderType == 'individual' ? AppGlobals.FIELD_LABELS.EMAIL_DOMAIN.INDIVIDUAL : AppGlobals.FIELD_LABELS.EMAIL_DOMAIN.COMPANY);
        $scope.config = ConfigModel.data;

        var primary = AuthModel.data.client.primaryUser;
        $scope.normalizedPrimary = primary ? primary.firstName + ' ' + primary.lastName : undefined;

        var clientName = AuthModel.data.client.clientName;

        console.log($scope.vm);

        /**
         * Gets the status of setup step from the scope view model
         * by a given property
         *
         * @param  {String} property - a property that exists within the clientData
         * @return {Boolean}
         */
        $scope.getStepStatus = function (property) {
            return AuthModel.data.client.clientData[property] || false;
        }

        $scope.redirectTo = function (route) {
            $state.go(route);
        }

        //Setup Steps
        var steps = [
            {
                label: 'Company Details Confirmed',
                status: $scope.getStepStatus('companyDetailsConfirmed'),
                confirmKey: 'companyDetailsConfirmed'
            },
            {
                label: 'Manage Lender Risk Profile',
                status: false,
                confirmKey: ''
            },
            {
                label: 'Terms & Conditions Confirmed',
                status: $scope.getStepStatus('tsCsConfirmed'),
                confirmKey: 'tsCsConfirmed'
            },
            {
                label: 'Bank Account Details Entered',
                status: $scope.getStepStatus('bankAccountTestSent'),
                confirmKey: 'bankAccountTestSent'
            },
            {
                label: 'Bank Account Details Confirmed',
                status: $scope.getStepStatus('bankAccountConfirmed'),
                confirmKey: 'bankAccountConfirmed'
            },
            {
                label: 'Authorised & Live',
                status: false,
                confirmKey: 'clientAuthorised'
            }
        ];

        var lenderSteps = [
            {
                label: 'Lender Details Confirmed',
                status: $scope.getStepStatus('companyDetailsConfirmed'),
                confirmKey: 'companyDetailsConfirmed'
            },
            {
                label: 'Manage Lender Risk Profile',
                status: false,
                confirmKey: 'clientCompletedRiskProfile'
            },
            {
                label: 'Terms & Conditions Confirmed',
                status: $scope.getStepStatus('tsCsConfirmed'),
                confirmKey: 'tsCsConfirmed'
            },
            {
                label: 'Bank Account Details Entered',
                status: $scope.getStepStatus('bankAccountTestSent'),
                confirmKey: 'bankAccountTestSent'
            },
            {
                label: 'Bank Account Details Confirmed',
                status: $scope.getStepStatus('bankAccountConfirmed'),
                confirmKey: 'bankAccountConfirmed'
            },
            {
                label: 'Authorised',
                status: false,
                confirmKey: 'clientAuthorised'
            },
            {
                label: 'Deposit confirmed & Live',
                status: false,
                confirmKey: 'depositPaymentConfirmed'
            },
        ];

        //Setup Steps
        $scope.steps = steps;
        $scope.lenderSteps = lenderSteps;

        $scope.invoiceInformation = [
            { label: 'Active customers over the last 12 months', value: '15' },
            { label: '', value: '28' },
            { label: 'Number of invoices currently outstanding', value: '4' },
            { label: 'Number of customers with invoices currently outstanding', value: '1' },
            { label: 'Total amount on invoices currently outstanding', value: '3521.44' },
            { label: 'Number of invoices currently overdue', value: '1' },
            { label: 'Number of customers with invoices currently overdue', value: '1' },
            { label: 'Total amount on invoices currently overdue', value: '522' },
            { label: 'Total amount on overdue invoices in the last 12 months', value: '522' }
        ];

        /**
         * Action to updates user details in /setup/borrower/user
         *
         * @return void
         */
        $scope.saveUserDetails = function () {
            ClientModel.putClient(clientName, AuthModel.data)
                .then(function (success) {
                    console.log('successfully updated client');
                    console.log(success);
                    return $state.go('setup.borrower.manage');

                });
        }

        /**
         * Action for confirmation clients details are correct
         * Sets companyDetailsConfirmed in clientData to true
         *
         * @return void
         */
        $scope.confirmDetailsCorrect = function () {

            // Update the Auth Model
            AuthModel.data.client.clientData.companyDetailsConfirmed = true;
            AuthModel.save();

            // In a toss up whether to have this specific function for setting the flags
            // or just an update on the client api @ash
            ClientModel.putClient(clientName, AuthModel.data.client).then(function (success) {
                if (success.status == 200) {
                    $scope.steps[0].status = true;

                    $state.go('setup.' + $scope.clientType + '.manage');
                }
            });
        }

        /**
         * Confirm Terms and Conditions popup
         * @todo  - Need an angular
         *
         * @param  {Object} $event
         */
        $scope.confirmTerms = function($event) {

            $event.preventDefault();

            $scope.termsType = 'termsBorrowerTsandcs';

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'core/modals/terms-manage.html',
                controller: 'TermsCtrl',
                scope: $scope,
                resolve: {
                    TermsData: ['ConfigModel', function (ConfigModel) {
                        // Sets the terms a specific as context from config table
                        ConfigModel.get('termsBorrowerTsandcs', false);

                        return ConfigModel;
                    }],
                    AuthModel: ['AuthModel', function (AuthModel) {

                        return AuthModel;
                    }]
                }
            });

            modalInstance.result.then(function (result) {
                console.log('Confirm Terms Modal result: ' + result);

                // Response true we change steps to reflect
                if (result) {
                    AuthModel.data.client.clientData.tsCsConfirmed = true;
                    AuthModel.save();

                    // @todo Can probably remove this now as relying on the AuthModel data
                    $scope.steps[2].status = true;
                } else {
                    console.log('Error confirming terms and conditions');
                }

            }, function () {
                console.log('Confirm Modal dismissed at: ' + new Date());
            });
        };

        $scope.confirmTermsOfService = function () {

            AuthModel.data.client.clientData.tsCsConfirmed = true;
            AuthModel.save();

            // @todo - may refactor and have controller in the modal
            ClientModel.putClient(clientName, AuthModel.data.client).then(function (success) {
                if (success.status == 200) {
                    // $scope.lenderSteps[2].status = true;
                    $state.go('setup.lender.manage');
                }
            });
        }

        $scope.cancelTermsOfService = function ($event) {
            $event.preventDefault();
            $state.go('setup.'+AuthModel.data.client.clientType+'.manage');
        }

        /**
         * Confirm Deposit
         */

        $scope.paymentInitiated = function ($event) {
            $event.preventDefault();

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'core/modals/confirm-deposit.html',
                controller: 'ConfirmDepositCtrl',
                scope: $scope
            });

            modalInstance.result.then(function (result) {
                console.log('Confirm Deposit Modal result: ' + result);

                if (result) {

                    // Updates depositPaymentConfirmed flag to true
                    AuthModel.data.client.clientData.depositPaymentConfirmed = true;
                    AuthModel.save();

                    $state.go('setup.lender.manage');
                }

            }, function () {
                console.log('Confirm Deposit Modal dismissed at: ' + new Date());
            });
        }

    }]);

angular.module('pp.core').controller('SummaryCtrl',
    ['$scope', '$state', 'AuthModel','$uibModal', 'ClientModel', 'AppGlobals', '$stateParams',
        function ($scope, $state, AuthModel, $uibModal, ClientModel, AppGlobals, $stateParams) {

            $scope.vm = AuthModel.data;
            $scope.clientType = AuthModel.data.client.clientType;

        }]);

angular.module('pp.core').controller('TermsCtrl', ['$scope', 'NotificationModel','$uibModal', '$uibModalInstance', 'TermsData', 'ClientModel', 'AuthModel', 'AppGlobals',
    function ($scope, NotificationModel, $uibModal, $uibModalInstance, TermsData, ClientModel, AuthModel, AppGlobals) {

        $scope.vm = NotificationModel;

        $scope.vm.config = TermsData.data;

        $scope.acceptTerms = function (form) {
            $uibModalInstance.close(true);
            return $scope.vm.acceptTerms = true;
        }


        /**
         * Handles the acceptance and saving of confirmation T & C's
         * in the management section
         *
         * @param  {Object} form
         */
        $scope.acceptManageTerms = function (form) {

            var clientName = AuthModel.data.client.clientName;
            AuthModel.data.client.clientData.tsCsConfirmed = true;

            // @todo - may refactor and have controller in the modal
            ClientModel.putClient(clientName, AuthModel.data.client).then(function (success) {
                if (success.status == 200) {
                    $uibModalInstance.close(true);
                } else {
                    $uibModalInstance.close(false);
                }
            });
        }

        $scope.cancelTerms = function ($event) {
            $uibModalInstance.dismiss('cancel');
            $event.preventDefault();
        };
    }]);
angular.module('pp.core').directive('autoFocus', function() {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attr, $form) {

            var index = parseInt($attr.tabindex);
            var max = $attr.maxlength;

            $element.on('keyup', function (e) {

                if ($element.val().length > max-1) {

                    var next = angular.element(document.querySelector('[tabindex="' + (index+1) + '"]'));

                    if (next.length > 0) {
                        next[0].focus();
                        return next.triggerHandler('keyup', {which: e.which});
                    } else {
                        return false;
                    }

                    return true;
                }
            });
        }
    };
});
angular.module('pp.core').directive('compareTo', [function() {
    return {
        require: "ngModel",
        restrict: "A",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function($scope, $element, $attr, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == $scope.otherModelValue;
            };

            $scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
}]);

angular.module('pp.core').directive('displayAuthorizeClient', [function() {
    return {
        restrict: 'E',
        scope: {
            clientToAuthorize: '='
        },
        link: function ($scope, $elem, $atts) {

            // Need to rebind parent as click events are in AuthClientCtrl
            $scope.authorize = $scope.$parent;

            console.log('Display Authorise Client Directive:');
            console.log($scope.clientToAuthorize);

            $scope.getAuthorizeClientTemplate = function () {
                var tmpl = "admin/clients/" + $scope.clientToAuthorize.clientType + "/authorize.html";
                console.log("Loading template: " + tmpl);
                return tmpl;
            }
        },
        template: '<div ng-include="getAuthorizeClientTemplate()"></div>'
    };
}]);

angular.module('pp.core').directive('dropdownField', [function() {
    return {
        restrict: 'E',
        templateUrl: 'core/forms/dropdown-field.html',
        link: ['$scope', function ($scope) {
            console.log($scope)
            console.log(ppForm);
        }]
    };
}]);
angular.module('pp.core').directive('emailDomain', ['AppGlobals', function(AppGlobals) {

    /**
     * Blacklist of domains to check email against
     *
     * @type {Array}
     */
    var blackList = AppGlobals.EMAIL_DOMAIN_BLACKLIST;

    /**
     * Regex for validating domain is valid format
     *
     * @type {RegExp}
     */
    var emailRegex = /([A-Za-z0-9-]+\.([A-Za-z]{3,}|[A-Za-z]{2}\.[A-Za-z]{2}|[A-za-z]{2}))\b/;

    return {
        require: "ngModel",
        restrict: "A",
        link: function($scope, $element, $attr, ngModel) {

            console.log('logging blacklists');
            console.log(blackList);
            var emptyObj = {};
            if(emptyObj) {
                console.log('empty obj exists');
            } else {
                console.log('empty obj does not');
            }
            ngModel.$validators.emailDomain = function (modelValue) {

                if (modelValue) {
                    var whiteCheck = ngModel.$isEmpty(modelValue) || emailRegex.test(modelValue);

                    // If lender type attribute is lender we do not do black list check
                    if ($attr.lenderType != 'individual') {
                        var blackCheck = emailBlackList(modelValue);
                        console.log('Domain result: ' + whiteCheck + " " + blackCheck);
                        return whiteCheck && blackCheck;
                    } else {
                        console.log('Individual Domain result: ' + whiteCheck);
                        return whiteCheck;
                    }
                }
            }

            /**
             * Validates domain of email against black list
             *
             * @param  {String} value
             * @return {Boolean}
             */
            function emailBlackList (value) {
                return (blackList.indexOf(value) === -1);
            }
        }
    };
}]);

angular.module('pp.core').directive('ppListener', ['RootHandler', function(RootHandler) {
    return {
        restrict: 'A',
        link: function ($scope) {

            $scope.$on("unauthorized", function(){
                RootHandler.unauthorized(true);
            });

            $scope.$on("forbidden", function(){
                RootHandler.forbidden();
            });

            $scope.$on("redirect", function(event, args){
                console.log(event);
                console.log(args);
                RootHandler.redirect(args.url);

            });
        }
    };
}]);
angular.module('pp.core').directive('headerTitle', [function() {
    return {
        restrict: 'E',
        scope: {
            title: '@title'
        },
        templateUrl: 'core/forms/headerTitle.html'
    };
}]);

angular.module('pp.core').directive('navMenu', [function() {
    return {
        restrict: 'E',
        templateUrl: 'core/navbar/menu.html'
    };
}]);

angular.module('pp.core').directive('ppNavbar', [function() {
    return {
        restrict: 'E',
        controller: 'NavbarCtrl',
        templateUrl: 'core/navbar/default.html'
    };
}]);

angular.module('pp.core').directive('smallerOrEqual', [function() {
    return {
        require: "ngModel",
        restrict: "A",
        scope: {
            otherModelValue: "=smallerOrEqual"
        },
        link: function($scope, $element, $attr, ngModel) {

            ngModel.$validators.smallerOrEqual = function(modelValue) {
                return modelValue <= $scope.otherModelValue;
            };

            $scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
}]);

angular.module('pp.core').directive('starRating', [function() {
    return {
        restrict: 'EA',
        template: '<div class="col-sm-4">' +
        '<ul class="star-rating" ng-class="{readonly: readonly}">' +
            '<li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
            '    <i class="fa fa-star"></i>' +
            '</li>' +
        '</ul>' +
        '</div>',
        scope: {
            ratingValue: '=ngModel',
            max: '=?',
            onRatingSelect: '&?',
            readonly: '=?'
        },
        link: function ($scope, $element, $attributes) {

            if ($scope.max == undefined) {
                $scope.max = 5;
            }

            function updateStars() {
                console.log('Update stars: ' + $scope.ratingValue);
                $scope.stars = [];
                for (var i = 0; i < $scope.max; i++) {
                    $scope.stars.push({
                        filled: i < $scope.ratingValue
                    });
                }
            };

            $scope.toggle = function (index) {
                if ($scope.readonly == undefined || $scope.readonly === false) {
                    $scope.ratingValue = index + 1;
                    $scope.onRatingSelect({
                        rating: index + 1
                    });
                }
            };

            $scope.$watch('ratingValue', function (oldValue, newValue, objectEquality) {
                // newValue doesn't seem to be fired when ratingValue changes to 1 from 0
                // therefore using third argument to grab the ratingValue on the $watch
                $scope.ratingValue = objectEquality.ratingValue;
                updateStars();
            });
        }
    };
}]);

function PermissionsException(message) {
    this.name = 'PermissionsException';
    this.message= message;
}
PermissionsException.prototype = new Error();
PermissionsException.prototype.constructor = PermissionsException;

angular.module('pp.core').filter('sanitize', ['$sce', function($sce) {

    return function (value) {
        return $sce.trustAsHtml(value);
    }
}]);

function AccountingModel(_, AppGlobals, ApiService, $state, localStorageService, messageCenterService, AuthModel, $window) {
    BaseModel.call(this, _, AppGlobals, ApiService, $state, localStorageService, messageCenterService);
    this.state = $state;
    this.window = $window;
    this.user = AuthModel;
    this.setStorageKey('ACCOUNTING');
    this.data = {
        isAuthorized: false,
        credentials: false,
        accounts: {
            available: undefined,
            authenticate: {},
            verify: {}
        },
        invoices: undefined,
        risk: {
            analysis: undefined,
            questionnaire: undefined
        }
    }
};

AccountingModel.prototype = Object.create(BaseModel.prototype);

AccountingModel.$inject = ['_', 'AppGlobals', 'ApiService', '$state', 'localStorageService', 'messageCenterService', 'AuthModel', '$window'];

AccountingModel.prototype.checkCredentials = function() {
    return this.data.isAuthorized;
};

AccountingModel.prototype.getAuthorization = function(method, state) {
    var self = this;
    self.data.credentials = false;
    self.isAuthorized = false;
    self.save();
    return self.api.get('accounting/authorize/' + method + '/' + state)
        .then(function (success) {
            console.log('authoriation received');
            self.data.credentials = success.data.data;
            self.save();
            self.window.location.href = self.data.credentials.redirect_url;
        }, function (error) {
            //todo - fire modal
        });
};

AccountingModel.prototype.getAccounts = function(state) {
    var self = this;

    return self.api.post('accounting/accounts', {state: self.state.current.name})
        .then(function(success){
            console.log(success);
            self.saveAccounts(success, state);
        }, function(error){
            console.log('accounts were not succesfully retrieved');
            console.log(error);
        });
};

AccountingModel.prototype.saveAccounts = function(response, state) {
    console.log('accounts were succesfully retrieved');
    console.log(response);
    this.data.accounts.available = response.data.data;
    this.save();
    this.state.go(state);
}

AccountingModel.prototype.getInvoices = function(state) {
    var self = this;
    return self.api.post('accounting/invoices', {state: self.state.current.name})
        .then(function(success){
            self.saveInvoices(success, state);
        }, function(error){
            console.log('invoices were not succesfully retrieved');
            console.log(error);
        });
};

AccountingModel.prototype.saveInvoices = function(response, state) {
    console.log('invoices were succesfully retrieved');
    console.log(response);
    this.data.accounts.available = response.data.data;
    this.save();
    this.state.go(state);
}

AccountingModel.prototype.getRiskAnalysis = function(state) {
    var self = this;
    return self.api.post('accounting/risk/analysis', {state: self.state.current.name})
        .then(function(success){
            self.saveRiskAnalysis(success, state);
        }, function(error){
            console.log('risk analysis was not succesfully retrieved');
            console.log(error);
        });
};

AccountingModel.prototype.saveRiskAnalysis = function(response, state) {
    this.user.init();
    console.log('risk analysis was succesfully retrieved');
    console.log(response);
    this.user.data.client.clientData.riskAnalysis = response.data.data;
    this.user.save();
    this.data.risk.analysis = response.data.data;
    this.save();
    this.state.go(state);
}

AccountingModel.prototype.postCallback = function(method, credentials) {
    return this.api.post('accounting/callback/' + method, credentials);
};

AccountingModel.prototype.saveCallback = function(response, method, state) {
    var self = this;
    self.data.isAuthorized = true;

    console.log('saving callback for method: ' + method);
    switch(method) {
        case 'getInvoices':
            self.saveInvoices(response, state);
            break;
        case 'getAccounts':
            self.saveAccounts(response, state);
            break;
        case 'getRiskAnalysis':
            self.saveRiskAnalysis(response, state);
            break;
        default:
            console.log('The method you supplied is not valid');
    }
};

// NON XERO ROUTES
AccountingModel.prototype.postBankAuthentication = function() {
    var sortCode = '';
    var self = this;
    Object.keys(self.data.accounts.authenticate.sortCode).sort().forEach(function(key){
        sortCode += self.data.accounts.authenticate.sortCode[key];
    });
    var data = {
        accountNum: self.data.accounts.authenticate.accountNum,
        sortCode: sortCode
    }
    return this.api.post('accounting/accounts/authenticate', data);
};

AccountingModel.prototype.postBankVerification = function() {
    var account = {
        accountNum: this.data.accounts.verify.accountNum,
        sortCode: this.data.accounts.verify.sortCode,
        tokenSecret: this.serializeToken(this.data.accounts.verify.secret)
    };
    return this.api.post('accounting/accounts/verify', account);
};

AccountingModel.prototype.putSelfAssessment = function() {
    var self = this;
    var data = self.user.data.client.clientData.selfAssessment;
    return this.api.post('accounting/risk/assessment', {
        avgOrderSize: data['avgOrderSize'],
        joiningReason: data['joiningReason'],
        expandBusiness: data['expandBusiness']
    });
};

angular.module('pp.core').service('AccountingModel', AccountingModel);

function AuthModel(_, AppGlobals, ApiService, $state, localStorageService, messageCenterService, AppNotifier) {
    BaseModel.call(this, _, AppGlobals, ApiService, $state, localStorageService, messageCenterService, AppNotifier);
    this.setStorageKey('AUTH');
    this.isAuthenticated = false;
    this.errorMessage = "We could not load the auth data";
    this.notifier = AppNotifier;
    this.data = {
        attempt: {},
        client: {},
        profile: {},
        lastKnownState: false
    };
};

AuthModel.prototype = Object.create(BaseModel.prototype);

AuthModel.$inject = ['_', 'AppGlobals', 'ApiService', '$state', 'localStorageService', 'messageCenterService', 'AppNotifier'];

AuthModel.prototype.saveAttempt = function(credentials) {
    this.data.attempt = credentials;
    return this.save();
};

AuthModel.prototype.saveLastKnownState = function(state) {
    this.data.lastKnownState = state;
    this.save();
};

AuthModel.prototype.getLastKnownState = function(state) {
    return this.data.lastKnownState;
}

AuthModel.prototype.login = function(data) {
    if(!this.checkCredentials(data)) {
        return false;
    }
    console.log('saving data to cache: ');
    this.data = _.merge(this.data, data);
    if(this.save()) {
        console.log('login successful');
        this.notifier.notifyLogin(data.token.key);
        return this.isAuthenticated = true;
    }
    return false;
};

AuthModel.prototype.postLogin = function(credentials, successCb, errorCb) {
    var self = this;

    // save credentials - this is primarily used for mobile activation
    // or any situation where the password needs to be resubmitted on the next request
    self.saveAttempt(credentials);

    return self.api.post('auth/login', credentials)
        .then(function(success){
            self.login(success.data.data[0]);
            if(successCb) successCb();

            console.log('checking for last known state');
            var lastKnownState = self.getLastKnownState();
            console.log(lastKnownState);

            if(lastKnownState && lastKnownState.name) {
                self.saveLastKnownState(false);
                return self.state.go(lastKnownState.name, lastKnownState.params);
            }
            return self.goHome();
        }, function(error){
            if (errorCb) errorCb();
            //use the error message from the api handler instead
            /*
            var msg = '';
            if(error.status == 403) {
                msg = "The credentials you submitted were not valid. Please try again.";
            } else {
                msg = "There was a problem logging you in. Please refresh the page.";
            }
            self.flash('danger', msg);
            */
        });
};

AuthModel.prototype.logout = function() {
    if (this.forget()) {
        console.log('data has been forgotten');
        this.isAuthenticated = false;
        this.notifier.notifyLogout();
        return true;
    }
    return false;
};

AuthModel.prototype.postLogout = function() {
    var self = this;

    return self.api.post('auth/logout')
        .then(function(success){
            console.log('successfully logged out of api');
            self.logout();
            self.state.go('index');
        }, function(error){
            self.flash('danger', "There was a problem logging you out. Please refresh the page");
        });
};

AuthModel.prototype.check = function() {

    var userLength = Object.keys(this.data).length;
    if (this.isAuthenticated && userLength) {
        return true;
    }
    // check the session for an existing login
    var user = this.init();

    //console.log('checking user credentials');
    //console.log(this.checkCredentials(user));
    if(user && this.checkCredentials(user)) {
        console.log('setting cached user as auth user');
        // remember to update the notifier
        this.notifier.notifyLogin(user.token.key);
        return this.isAuthenticated = true;
    }
    //console.log('auth check is false');
    return false
};


AuthModel.prototype.getUser = function() {
    var data = this.data || false;
    return data;
};

AuthModel.prototype.checkCredentials = function(data) {
    if (
        !data ||
        !data.username ||
        !data.role ||
        !data.token.key ||
        !data.token.created_at
    ) {
        return false;
    }
    return true;
};

AuthModel.prototype.refreshUser = function(data) {
    var user = this.getUser();
    console.log('existing user is:');
    console.log('User data: ', user);
    console.log('Incoming data: ', data);
    if(!_.isEqual(data, user)) {
        var newUserData = _.merge(user, data);

        if(this.login(newUserData)) {
            console.log('user data refreshed');
            console.log(newUserData);
            return true;
        }
    }
    console.log('user data not refreshed');
    return false;
};

AuthModel.prototype.hasPermission = function(permissions) {
    if(typeof(permissions) == 'string') {
        //console.log('permission is a string');
        return this.data.permissions.indexOf(permissions) !== -1;
    }
    var res = true;
    var self = this;
    permissions.forEach(function(permission) {
        if(self.data.permissions.indexOf(permission) == -1) {
            console.log(permission + ' is false');
            res = false;
        }
    });
    return res;
};


AuthModel.prototype.hasRole = function(allowedRoles) {
    if(typeof(allowedRoles) == 'string') {
        return this.data.role.indexOf(allowedRoles) === 0;
    }
    var res = false;
    var self = this;
    allowedRoles.forEach(function(role) {
        if(self.data.role.indexOf(role) === 0) {
            res = true;
        }
    })
    return res;
};

AuthModel.prototype.getToken = function() {
    return this.data.token.key;
};

AuthModel.prototype.setToken = function(token) {
    return this.data.token.key = token;
};

AuthModel.prototype.getMe = function() {
    return this.api.get('me');
}

angular.module('pp.core').service('AuthModel', AuthModel);

function BaseModel(_, AppGlobals, ApiService, $state, localStorageService, messageCenterService) {
    this.data = {};
    this.globals = AppGlobals;
    this.api = ApiService;
    this.state = $state;
    this.storage = localStorageService;
    this.messageCenter = messageCenterService;
    this.isInitialised = false;
    this.storageKey = undefined;
};

BaseModel.$inject = ['_', 'AppGlobals', 'ApiService', '$state', 'localStorageService', 'messageCenterService'];

BaseModel.prototype.flash = function(type, message, next) {
    var options = {};
    /*
    var options = {
        timeout: this.globals.FLASH_TIMEOUT
    };
    */
    if (next) {
        options['status'] = this.messageCenter.status.next;
    }
    return this.messageCenter.add(type, message, options);
};

BaseModel.prototype.goHome = function() {
    console.log('redirect to home');
    console.log(this.globals.STATES.HOME);
    return this.state.go(this.globals.STATES.HOME);
};

BaseModel.prototype.init = function() {
    if(!this.storageKey) {
        console.log('storage key is not set');
        return false;
    }
    var data = this.getCache();
    if(data && !this.isInitialised) {
        //console.log('previous data found');
        //console.log(data);
        this.data = data;
    }
    return data;
};

BaseModel.prototype.setStorageKey = function(key) {
    this.storageKey = this.globals.STORAGE_KEY[key];
};

BaseModel.prototype.save = function() {
    return this.storage.set(this.storageKey, this.data);
};

BaseModel.prototype.forget = function() {
    this.data = {};
    this.refreshCache();
};

BaseModel.prototype.getCache = function() {
    var data = this.storage.get(this.storageKey);
    //console.log('logging cached data:')
    //console.log(data);
    if(data && !Object.keys(data).length) {
        return false;
    }
    return data;
};

BaseModel.prototype.refreshCache = function() {
    return this.storage.set(this.storageKey, {});
};

BaseModel.prototype.log = function() {
    console.log('logging model data:');
    console.log(this.data);
};

BaseModel.prototype.getLength = function() {
    return Object.keys(this.data).length;
};

// expensive function to check if data object is initialised
// this has been replaced by the simple initialised flag
BaseModel.prototype.isEmpty = function() {
    var isEmpty = true;
    var self=this;
    //console.log('checking if model is empty. length is: ' + this.getLength() );
    var length = this.getLength();
    if(length) {
        Object.keys(self.data).forEach(function(key){
            //console.log('is data object empty:' + key);
            //console.log(typeof(self.data[key]));
            if(
                typeof(self.data[key]) == 'string' ||
                (typeof(self.data[key]) == 'object' && !_.isEmpty(self.data[key])) ||
                (typeof(self.data[key]) == 'array' && self.data[key])
            ) {
                isEmpty = false;
            }
        });
    }
    //console.log('model isEmpty is: ' + isEmpty);
    return isEmpty;
};

BaseModel.prototype.serializeToken = function(obj) {
    var keys = Object.keys(obj).sort();
    var res = '';
    for (var i = 0; i < keys.length; i++) {
        res += obj[keys[i]] + '-';
    }
    return _.trim(res, '-');
};

angular.module('pp.core').service('BaseModel', BaseModel);

function ClientModel(_, AppGlobals, ApiService, $state, localStorageService, messageCenterService) {
    BaseModel.call(this, _, AppGlobals, ApiService, $state, localStorageService, messageCenterService);
    this.setStorageKey('CLIENT');
    this.errorMessage = "We could not load the client data";
};

ClientModel.prototype = Object.create(BaseModel.prototype);

ClientModel.$inject = ['_', 'AppGlobals', 'ApiService', '$state', 'localStorageService', 'messageCenterService'];

ClientModel.prototype.getIndex = function(params) {
    console.log('firing api index route');

    return this.api.get('/client', params);
}

ClientModel.prototype.getByName = function (name) {
    return this.api.get('/client/' + name);
}

ClientModel.prototype.getByNumber = function (number) {
    return this.api.get('/client/number/' + number);
}

ClientModel.prototype.postClient = function (data) {
    return this.api.post('/client', data);
}

ClientModel.prototype.putClient = function (name, data, updateOracle) {
    var oracleRoute = '';
    if (updateOracle) {
        oracleRoute = '/oracle';
    }
    return this.api.put('/client/' + name + oracleRoute, data);
};

/**
 * Admin Related API Methods
 */

ClientModel.prototype.authorizeClient = function (clientName, form) {

    var data = {
        "clientData" : {
            "serviceTransactionAccount" : form.serviceTransactionAccount.$viewValue
        }
    };
    console.log(form)
    // If form has borrowerLimit we include it (Only Borrower has this)
    if (form.hasOwnProperty('borrowerLimit')) {
        console.log('Has borrower limit');
        data.clientData.borrowLimit = form.borrowerLimit.$viewValue;
    }

    return this.api.put("/client/authorize/" + clientName, data, true);
}


ClientModel.prototype.rejectClient = function (clientName, form) {

    var data = {
        "clientData" : {
            "rejectionReason" : form.rejectionReason.$viewValue,
            "additionalRejectionInfo" : form.additionalRejectionInfo.$viewValue
        }
    };

    return this.api.put("/client/reject/" + clientName, data, true);
}


ClientModel.prototype.getClientAuthOptions = function (clientName) {
    return this.api.get("/client/options/" + clientName, false, true);
}

angular.module('pp.core').service('ClientModel', ClientModel);


function CompanyModel(_, AppGlobals, ApiService, $state, localStorageService, messageCenterService) {
    BaseModel.call(this, _, AppGlobals, ApiService, $state, localStorageService, messageCenterService);
    this.setStorageKey('COMPANY');
    this.errorMessage = "We could not load the company data";
};

CompanyModel.prototype = Object.create(BaseModel.prototype);

CompanyModel.$inject = ['_', 'AppGlobals', 'ApiService', '$state', 'localStorageService', 'messageCenterService'];

CompanyModel.prototype.searchByNumber = function (number) {
    return this.api.get('/company/search/' + number);
};

angular.module('pp.core').service('CompanyModel', CompanyModel);


function ConfigModel (_, AppGlobals, ApiService, $state, localStorageService, messageCenterService) {
    BaseModel.call(this, _, AppGlobals, ApiService, $state, localStorageService, messageCenterService);
    this.setStorageKey('CONFIG');
    this.errorMessage = "There was a problem loading the requested config.";
};

ConfigModel.prototype = Object.create(BaseModel.prototype);

ConfigModel.$inject = ['_', 'AppGlobals', 'ApiService', '$state', 'localStorageService', 'messageCenterService'];

ConfigModel.prototype.get = function (name, requireOrFail) {
    var self = this;
    return self.api.get('/configuration/' + name)
        .then(function (success) {

            console.log('saving config: ' + name);
            self.data[name] = success.data.data[0];

        }, function () {

            var flashOptions = {timeout: self.globals.FLASH_TIMEOUT};

            if (requireOrFail) {
                flashOptions.status = self.flash.status.next;
                self.goHome();
            }

            self.messageCenter.add('danger', self.errorMessage, flashOptions);
        });
};

/**
 * Gets Terms from config - rather than setting by context it
 * overwrites the terms in the data property. Reason being theres one terms controller
 * and it's difficult/hassle to pass over which terms property to grab rather than always
 * referencing the 'terms' property for the popup.
 *
 * @todo  - look at refactoring to simplify this maybe integrate with above function?!
 *
 * @param  {String} type           The terms and conditions type
 * @param  {Boolean} requireOrFail
 */
ConfigModel.prototype.getTerms = function (type, requireOrFail) {
    var self = this;
    return self.api.get('/configuration/' + type)
        .then(function (success) {

            console.log('saving config: ' + type);
            self.data['terms'] = success.data.data[0];

        }, function () {
            if (requireOrFail) {
                self.goHome();
            }
            self.flash('danger', self.errorMessage, requireOrFail);

        });
}

angular.module('pp.core').service('ConfigModel', ConfigModel);
function FormModel(_, AppGlobals, ApiService, $state, localStorageService, messageCenterService) {
    BaseModel.call(this, _, AppGlobals, ApiService, $state, localStorageService, messageCenterService);
    this.setStorageKey('FORM');
    this.errorMessage = "There was a problem loading the requested form.";
};

FormModel.prototype = Object.create(BaseModel.prototype);

FormModel.$inject = ['_', 'AppGlobals', 'ApiService', '$state', 'localStorageService', 'messageCenterService'];

FormModel.prototype.get = function(name, requireOrFail) {
    var self = this;
    self.init();
    if(self.data[name]) {
        return self.data[name];
    }
    return self.api.get('/forms/' + name)
        .then(function (success) {
            console.log('successfuly retrieved form:');
            console.log(success);
            //console.log('saving form: ' + name);
            self.data[name] = success.data.data[0];
            self.save();
            return self.data[name];
        });
};

angular.module('pp.core').service('FormModel', FormModel);


function InviteModel(_, AppGlobals, ApiService, $state, localStorageService, messageCenterService) {
    BaseModel.call(this, _, AppGlobals, ApiService, $state, localStorageService, messageCenterService);
    this.setStorageKey('INVITE');
    this.state= $state;
    this.errorMessage = "There was a problem loading the requested form.";
    this.data = {
        find: {
            number: undefined
        },
        clientType: undefined,
        clientConfirmed: false,
        borrowerAssessmentComplete: false,
        // client data as officially created in the db and returned from the api
        // this includes the companies house data and the details form
        client: {
            clientData: {}
        },
        // primary user data
        primary_user: {}
    }
};

InviteModel.$inject = ['_', 'AppGlobals', 'ApiService', '$state', 'localStorageService', 'messageCenterService'];

InviteModel.prototype = Object.create(BaseModel.prototype);

InviteModel.prototype.forget = function() {
    this.data = {
        find: {
            number: undefined
        },
        clientType: undefined,
        clientConfirmed: false,
        borrowerAssessmentComplete: false,
        // client data as officially created in the db and returned from the api
        // includes companies house data, details form, and managerAssessment
        client: {
            clientData: {}
        },
        // primary user data
        primary_user: {}
    };
    this.refreshCache();
    return this.data;
};

InviteModel.prototype.findCompany = function(number, clientType) {
    var self = this;
    if(self.data.client.clientNumber == number) {
        console.log('returning requested company from cache');
        return self.state.go('invite.client.confirm', {clientNumber: self.data.client.clientNumber});
    }
    return this.api.get('/company/search/' + number)
        .then(function(success){
            console.log('company data received from api');
            console.log(success);
            self.data.client = _.extend(
                self.data.client,
                success.data.data[0],
                {clientType: clientType}
            );
            self.save();
            console.log(self.data);
            return self.state.go('invite.client.confirm', {clientNumber: self.data.client.clientNumber});
        }, function(error) {
            self.forget();
            self.state.go('invite.find', {clientType: clientType});
        });
};

InviteModel.prototype.updateClient = function(state) {
    return this.api.put('/client/' + this.data.client.clientName, this.data.client);
};

InviteModel.prototype.abort = function(msg) {
    this.flash('danger', msg, true);
    //return this.state.go('summary');
}

// resolve the client model and figure out the clientType
InviteModel.prototype.resolveClientType = function(number) {
    var self = this;
    self.init();
    var getTypeOrFail = function(client) {
        console.log('returning client from cache');
        if(client.clientStatus == 'confirmed') {
            return self.abort('This client has already been invited');
        }
        return client.clientType;
    };
    if(self.data.client.clientNumber == number) {
        //console.log('returning client from cache');
        //console.log(InviteModel.data);
        return getTypeOrFail(self.data.client);
    }
    console.log('fetching client from api');
    // get the client from the db
    self.api.get('/client/number/' + number)
        .then(function(success){
            console.log(success);
            self.data.client = success.data.data[0];

            // has the borrower assessment been completed?
            var clientType = self.data.client.clientType;
            var assessment = self.data.client.clientData.managerAssessment;
            //console.log(Object.keys(assessment).length);
            if (clientType === 'borrower' && assessment && Object.keys(assessment).length) {
                self.data.borrowerAssessmentComplete = true;
            }
            // not to be confused with the official clientStatus
            // this just indicates that the user is inviting the right client
            self.clientConfirmed = true;
            self.save();
            console.log(self.data);
            return getTypeOrFail(self.data.client);
        }, function(error) {
            console.log(error);
            self.abort("The client you requested could not be found");
        });
};

InviteModel.prototype.putAssessment = function (clientName) {
    var assessment = this.data.client.clientData.managerAssessment;

    var data = {
        "industrySector": assessment.industrySector,
        "knownClientYears": assessment.knownClientYears,
        "turnoverPrevious": assessment.turnoverPrevious,
        "turnoverProjected": assessment.turnoverProjected,
        "avgInvoiceSize": assessment.avgInvoiceSize,
        "daysSalesOutstanding": assessment.daysSalesOutstanding,
        "invoiceFinancePrevious": assessment.invoiceFinancePrevious,
        "invoiceFinanceReplace": assessment.invoiceFinanceReplace,
        "customerBase": assessment.customerBase,
        "customerType": assessment.customerType,
        "borrowerRating": assessment.borrowerRating,
        "expandBusiness": assessment.expandBusiness
    };
    return this.api.put("/borrower/assessment/" + clientName, this.data.client.clientData.managerAssessment);
};

InviteModel.prototype.postInvitePrimary = function() {
    var self = this;

    var email = self.data.primaryUser.emailUsername + '@' + self.data.client.emailDomain;

    var data = _.extend(self.data.primaryUser, {
        clientType: self.data.client.clientType,
        clientName: self.data.client.clientName,
        email: email
    });

    return self.api.post('/auth/invite/primary', data)
        .then(function(success){
            console.log(success);
            if (success.status == 200) {
                self.forget();
                self.goHome();
                self.flash('success', 'The client was successfully invited', true);
            }
        });
    return false;
};

angular.module('pp.core').service('InviteModel', InviteModel);



function NotificationModel(_, AppGlobals, ApiService, $state, localStorageService, messageCenterService, AuthModel) {
    BaseModel.call(this, _, AppGlobals, ApiService, $state, localStorageService, messageCenterService);
    this.user = AuthModel;
    this.setStorageKey('NOTIFICATION');
    this.errorMessage = "We could not load the registration data";
    this.data = {
        // the terms modal pop up
        terms: false,
        // service manager - inviting user
        invitingUser: {},
        // email data
        emailToken: {
            a: '',
            b: '',
            c: '',
            d: ''
        },
        // mobile data
        mobileToken: {
            a: '',
            b: '',
            c: '',
            d: ''
        }
    };
};

NotificationModel.prototype = Object.create(BaseModel.prototype);

NotificationModel.$inject = ['_', 'AppGlobals', 'ApiService', '$state', 'localStorageService', 'messageCenterService', 'AuthModel'];

NotificationModel.prototype.getUserByInviteToken = function(token){
    var self = this;
    console.log('getting token: ' + token);

    return self.api.get('/notification/token/' + token)
        .then(function (success) {
            console.log(success);
            self.data = _.extend(self.data, success.data.data[0]);
            self.save();
            return self.data;
        }, function (error) {
            console.log('error fetching token');
            if(self.user.check()){
               self.user.logout();
            }
            self.state.go('index');
        });
};

NotificationModel.prototype.forget = function() {
    this.data = {
        // the terms modal pop up
        terms: false,
        // service manager - inviting user
        invitingUser: {},
        // email data
        emailToken: {},
        // mobile data
        mobileToken: {}
    };
    this.refreshCache();
};

NotificationModel.prototype.getEmailToken = function() {
    var self = this;

    var data = {
        username: self.data.username,
        email: self.data.email,
        password: self.data.password,
        passwordConfirmation: self.data.passwordConfirmation,
        firstName: self.data.firstName,
        lastName: self.data.lastName,
        acceptTerms: self.data.acceptTerms,
        linkKey: self.data.linkKey
    };
    return self.api.post('/auth/token/email', data);
};


NotificationModel.prototype.getMobileToken = function(vm) {
    var self = this;

    var data = {
        username: self.data.username,
        mobile: self.data.mobile,
        password: self.data.password
    };
    return self.api.post('/auth/token/mobile', data);
};

NotificationModel.prototype.postActivateEmail = function() {
    var self = this;

    console.log('posting email token');
    console.log(self.data);
    var tokenSecret = self.serializeToken(self.data.emailToken.secret);

    console.log(tokenSecret)

    var data = {
        username: self.data.username,
        email: self.data.email,
        password: self.data.password,
        passwordConfirmation: self.data.passwordConfirmation,
        firstName: self.data.firstName,
        lastName: self.data.lastName,
        acceptTerms: self.data.acceptTerms,
        linkKey: self.data.linkKey,
        tokenKey: self.data.emailToken.tokenId,
        tokenSecret: tokenSecret
    };
    return self.api.post('/auth/activate/email/' + tokenSecret, data);
};

NotificationModel.prototype.postActivateMobile = function() {
    var self = this;

    var tokenSecret = self.serializeToken(self.data.mobileToken.secret);

    var data = {
        username: self.data.username,
        password: self.data.password,
        mobile: self.data.mobile,
        linkKey: self.data.linkKey,
        tokenKey: self.data.mobileToken.tokenId,
        tokenSecret: tokenSecret
    };
    return self.api.post('/auth/activate/mobile/' + tokenSecret, data);
};

angular.module('pp.core').service('NotificationModel', NotificationModel);

angular.module('pp.core').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){
        // OAUTH CALLBACK
        $stateProvider
            .state("accounting", {
                url: "/accounting",
                template: "<ui-view/>",
                parent: 'auth'
                //controller: 'AccountingCtrl'
            })
            .state("accounting.callback", {
                url: "/callback",
                template: "<ui-view/>"
            })
            .state("accounting.callback.xero", {
                url: "/xero/:method/:state?oauth_verifier&oauth_token&org",
                template: "<ui-view/>",
                resolve: {
                    callbackData: ['$state', '$stateParams', 'AccountingModel',  'AppGlobals', 'messageCenterService',
                        function($state, $stateParams, AccountingModel, AppGlobals, messageCenterService) {

                            AccountingModel.init();
                            var current = AccountingModel.data.credentials;

                            console.log('current authorization data:');
                            console.log(current);

                            var credentials = {
                                oauth_verifier: $stateParams.oauth_verifier,
                                oauth_token: $stateParams.oauth_token,
                                org: $stateParams.org
                            };
                            credentials.oauth_token_secret = current.oauth_token_secret;

                            console.log('new authorization data:');
                            console.log(credentials);

                            var method = angular.copy($stateParams.method);
                            var state = angular.copy($stateParams.state);
                            console.log('method is: ' + method);
                            console.log('state is: ' + state);

                            return AccountingModel.postCallback(method, credentials)
                                .then(function(success){
                                    return AccountingModel.saveCallback(success, method, state);
                                }, function(error){
                                    console.log('postCallback was not succesfully executed');
                                    console.log(error);
                                    //$state.go($stateParams.state);
                                    messageCenterService.add(
                                        'danger',
                                        AppGlobals.ACCOUNTING_CALLBACK_METHOD_ERROR,
                                        {
                                            status: messageCenterService.status.next,
                                            timeout: AppGlobals.FLASH_TIMEOUT
                                        }
                                    );
                                })
                        }]
                }
            });
    }]);

angular.module('pp.core').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){

        // AUTH MIDDLEWARE
        // abstract routes that function as an auth middleware layer for the front-end
        // use them by specifying the parent property on a route eg. parent: 'guest'
        $stateProvider
            .state('auth', {
                abstract: true,
                template: '<ui-view/>',
                resolve: {
                    AuthUser: ['AuthModel', 'AppNotifier', function(AuthModel, AppNotifier){
                        //console.log('auth middleware triggered');
                        //console.log(AuthModel.check());
                        if(!AuthModel.check()) {
                            console.log('auth middleware failed check');
                            return AppNotifier.notifyUnauthorized()
                        } else {
                            return AuthModel.getUser();
                        }
                    }]
                }
            })
            .state('guest', {
                abstract: true,
                template: '<ui-view/>',
                resolve: {
                    GuestUser: ['AuthModel', '$location', 'messageCenterService', 'AppGlobals',
                        function(AuthModel, $location, messageCenterService, AppGlobals){
                            //console.log('guest middleware triggered');
                            //console.log(AuthModel.check());
                            if(AuthModel.check()) {
                                console.log('Guest middleware failed: logged in user detected');
                                messageCenterService.add(
                                    'danger',
                                    "The route you requested is only available to logged out users",
                                    {
                                        status: messageCenterService.status.next,
                                        timeout: AppGlobals.FLASH_TIMEOUT
                                    }
                                );
                                $location.url('/summary')
                                return false;
                            }
                            //return true;
                        }]
                }
            })
            // enforces logout when accessed
            .state('guest_forced', {
                abstract: true,
                template: '<ui-view/>',
                resolve: {
                    GuestUser: ['AuthModel', 'RootHandler',
                        function(AuthModel, RootHandler){
                            console.log('guest_enforced middleware triggered');
                            console.log(AuthModel.check());
                            if(AuthModel.check()) {
                                RootHandler.unauthorized(true);
                            }
                            return true;
                        }]
                }
            })
            .state("borrower", {
                parent: 'auth',
                abstract: true,
                template: '<ui-view/>',
                resolve: {
                    hasRole: ['AuthModel', 'RootHandler',
                        function(AuthModel,RootHandler) {
                            console.log('checking roles for borrower');
                            if(!AuthModel.hasRole('borrower')) {
                                console.log('borrower check failed');
                                RootHandler.forbidden();
                                return false;
                            }
                            console.log('user has correct role');
                            return true;
                        }]

                }
            })
            .state("lender", {
                parent: 'auth',
                abstract: true,
                template: '<ui-view/>',
                resolve: {
                    hasRole: ['AuthModel', 'RootHandler',
                        function(AuthModel,RootHandler) {
                            if(!AuthModel.hasRole('lender')) {
                                return RootHandler.forbidden();
                            }
                            return true;
                        }]

                }
            })
            .state("manager", {
                parent: 'auth',
                abstract: true,
                template: '<ui-view/>',
                resolve: {
                    hasRole: ['AuthModel', 'RootHandler',
                        function(AuthModel,RootHandler) {
                            if(!AuthModel.hasRole('manager')) {
                                return RootHandler.forbidden();
                            }
                            return true;
                        }]

                }
            })
            .state("provider", {
                parent: 'auth',
                abstract: true,
                template: '<ui-view/>',
                resolve: {
                    hasRole: ['AuthModel', 'RootHandler',
                        function(AuthModel,RootHandler) {
                            if(!AuthModel.hasRole('provider')) {
                                return RootHandler.forbidden();
                            }
                            return true;
                        }]

                }
            });

        // LOGIN AND LOGOUT
        $stateProvider
            .state("login", {
                url: "/login",
                templateUrl: "core/auth/login.html",
                parent: 'guest',
                controller: 'AuthCtrl'
            })
            .state("logout", {
                url: "/logout",
                abstract: true,
                parent: 'auth'
            })
            .state("forbidden", {
                url: "/forbidden",
                templateUrl: "core/abort/403.html"
            });
    }]);

angular.module('pp.core').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){

        // For any unmatched url, send to /
        //$urlRouterProvider.otherwise("/");
    }]);

angular.module('pp.core').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){

        //default transitions
        $urlRouterProvider.when('/invite/user/{clientNumber}', '/invite/user/{clientNumber}/primary');
        $urlRouterProvider.when('/invite/{clientNumber}', '/invite/{clientNumber}/confirm');

        $stateProvider
            .state("invite", {
                abstract: true,
                parent: 'auth',
                url: "/invite",
                template: '<ui-view/>',
                //do not declare ctrl here - as child states need different controllers
                data: {
                    //default lender type
                    lenderType: 'company'
                },
                resolve: {
                    permission: ['AuthModel', 'RootHandler', function(AuthModel, RootHandler) {
                        console.log(AuthModel.data);
                        if(!AuthModel.hasPermission('client.post')) {
                            RootHandler.forbidden();
                        }
                    }]
                }
            })

            // INVITE CLIENTS
            .state("invite.find", {
                url: "/find/{clientType}",
                templateUrl: "invite/company-find.html",
                controller: "InviteClientCtrl", // initializes ctrl to find a client
                resolve: {
                    clientType: ['$stateParams', function($stateParams) {
                        return $stateParams.clientType;
                    }]
                }
            })
            .state("invite.individual", {
                url: "/individual",
                template: "<ui-view/>",
                resolve: {
                    clientType: function() {
                        return 'lender';
                    }
                },
                data: {
                    lenderType: 'individual'
                },
                controller: "InviteClientCtrl" // re-initializes ctrl for an individual
            })
            .state("invite.individual.lender", {
                url: "/lender",
                templateUrl: "invite/lender/individual.html"
            })

            .state("invite.client", {
                url: "/{clientNumber}",
                template: "<ui-view/>",
                controller: "InviteClientCtrl", // re-initializes ctrl to invite a client
                resolve: {
                    clientType: ['InviteModel', '$stateParams', function(InviteModel, $stateParams) {
                        var type = InviteModel.resolveClientType($stateParams.clientNumber);
                        console.log("setting type to: " + type);
                        return type;
                    }]
                }
            })
            .state("invite.client.confirm", {
                url: "/confirm",
                templateUrl: "invite/company-confirm.html"
            })
            .state("invite.client.assessment", {
                url: "/assessment",
                templateUrl: "invite/borrower/assessment.html"
            })

            // INVITE USERS
            .state("invite.user", {
                url: "/user/{clientNumber}",
                template: '<ui-view/>',
                resolve: {
                    permission: ['AuthModel', 'RootHandler', function(AuthModel, RootHandler) {
                        console.log(AuthModel.data);
                        if(!AuthModel.hasPermission('user.post')) {
                            console.log('forbidden');
                            RootHandler.forbidden();
                        }
                    }],
                    clientType: ['InviteModel', '$stateParams', function(InviteModel, $stateParams) {
                        var type = InviteModel.resolveClientType($stateParams.clientNumber);
                        console.log("setting type to: " + type);
                        return type;
                    }]
                }
            })
            .state("invite.user.primary", {
                url: "/primary",
                controller: 'InviteUserCtrl',
                templateUrl: 'invite/invite-primary.html'
            });
    }]);

angular.module('pp.core').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){

        // REGISTER BORROWERS AND LENDERS
        $stateProvider
            .state("register", {
                abstract: true,
                parent: 'guest_forced',
                url: "/register/{token}",
                controller: 'RegisterCtrl',
                template: '<ui-view/>',
                resolve: {
                    invitationData: ['NotificationModel', 'messageCenterService', '$state', '$stateParams',
                        function (NotificationModel, messageCenterService, $state, $stateParams) {
                            var token = $stateParams.token;
                            console.log(token);
                            var cache = NotificationModel.init();

                            console.log('logging notification cache');
                            console.log(cache);
                            if (cache && Object.keys(cache).length && cache.linkKey === token) {
                                console.log('returning cached token');
                                return cache;
                            } else {
                                console.log('getting token from api');
                                return NotificationModel.getUserByInviteToken(token);
                            }

                        }]
                }
            })
            .state("register.accept", {
                url: "/accept",
                templateUrl: "register/accept.html"
            })
            .state("register.details", {
                url: "/details",
                templateUrl: "register/details.html"
            })
            .state("register.email", {
                url: "/email",
                templateUrl: "register/email.html"
            });
        $stateProvider
            .state("activate", {
                abstract: true,
                parent: 'guest_forced',
                controller: 'ActivationCtrl',
                url: '/activate',
                template: '<ui-view/>'
            })
            .state("activate.mobile", {
                url: '/mobile',
                templateUrl: 'register/mobile.html'
            })

    }]);

angular.module('pp.core').config(['$stateProvider',
    function($stateProvider){

        // PRE_REGISTER BORROWERS AND LENDERS
        $stateProvider

            .state("setup", {
                abstract: true,
                parent: 'auth',
                url: "/setup",
                template: '<ui-view/>',
                controller: 'SetupCtrl'
            })

            // SETUP BORROWER
            .state("setup.borrower", {
                abstract: true,
                url: "/borrower",
                templateUrl: "setup/index.html",
                controller: 'SetupCtrl',
                resolve: {
                    permission: ['AuthModel', 'RootHandler', function(AuthModel, RootHandler) {
                        if(!AuthModel.hasPermission(['setup.manage', 'client.put'])) {
                            RootHandler.forbidden();
                        }
                    }],
                    role: ['AuthModel', 'RootHandler', function(AuthModel,RootHandler) {
                            if(!AuthModel.hasRole('borrower')) {
                                return RootHandler.forbidden();
                            }
                            return true;
                        }]
                }
            })

            // Management Page
            .state("setup.borrower.manage", {
                url: "/manage",
                templateUrl: "setup/borrower/manage.html",
                resolve: {
                    authUserData: ['AuthModel', 'ApiHandler', 'messageCenterService',
                        function(AuthModel, ApiHandler, messageCenterService){
                            AuthModel.getMe()
                                .then(function(success){
                                    console.log(success);
                                },function(){
                                    messageCenterService.add('danger', "There was a problem refreshing your data. " +
                                    "Please refresh the page.")
                                })
                    }]
                }
            })

            // Company Details
            .state("setup.borrower.company", {
                url: "/company",
                templateUrl: "setup/company-details.html"
            })

            // Risk Profile
            .state("setup.borrower.risk", {
                url: "/risk",
                templateUrl: "setup/borrower/risk-profile.html",
                controller: "RiskCtrl",
                data: {
                    title: "Please complete the following information to help us work out your borrow levels"
                },
                resolve: {
                    selfAssessment: ['FormModel', function(FormModel) {
                        return FormModel.get('borrowerSelfAssessment');
                    }]
                }
            })
            .state("setup.borrower.risk.start", {
                url: "/start",
                templateUrl: "setup/borrower/risk-start.html",
                data: {
                    title: "Connect to your accounting system to complete your risk assessment"
                },
                onEnter: ['AuthModel', '$state', function(AuthModel, $state){
                    if(AuthModel.data.client.clientData.riskAnalysis) {
                        // a one off redirect for those returning from the manage page
                        $state.go('setup.borrower.risk.questionnaire');
                    }
                }]
            })
            .state("setup.borrower.risk.info", {
                url: "/info",
                templateUrl: "setup/borrower/risk-info.html",
                data: {
                    title: "The following information was retrieved from your accountancy system"
                }
            })
            .state("setup.borrower.risk.questionnaire", {
                url: "/questionnaire",
                templateUrl: "setup/borrower/risk-questionnaire.html",
                data: {
                    title: "Please complete the following information to help us work out your borrow levels"
                }
            })

            // BANK ACCOUNT
            .state("setup.borrower.accounts", {
                url: "/accounts",
                template: "<ui-view/>",
                controller: "BankAccountCtrl"
            })
            .state("setup.borrower.accounts.authenticate", {
                url: "/authenticate",
                templateUrl: "setup/borrower/account-authenticate.html"
            })

            .state("setup.borrower.accounts.authenticate.select", {
                url: "/select",
                templateUrl: "setup/borrower/account-select.html",
                onEnter: ['$state', 'AccountingModel', function($state, AccountingModel) {
                    if(!AccountingModel.data.accounts.available) {
                        $state.go('setup.borrower.accounts.authenticate');
                    }
                }]
            })

            .state("setup.borrower.accounts.authenticate.info", {
                url: "/info",
                templateUrl: "setup/account-info.html",
                onEnter: ['$state', 'AccountingModel', function($state, AccountingModel) {
                    if(!AccountingModel.data.accounts.available) {
                        $state.go('setup.borrower.accounts.authenticate');
                    }
                }]
            })
            .state("setup.borrower.accounts.authenticate.confirm", {
                url: "/confirm",
                templateUrl: "setup/account-confirm.html",
                onEnter: ['$state', 'AccountingModel', function($state, AccountingModel) {
                    if(!AccountingModel.data.accounts.available) {
                        $state.go('setup.borrower.accounts.authenticate');
                    }
                }]
            })
            .state("setup.borrower.accounts.sent", {
                url: "/sent",
                templateUrl: "setup/account-sent.html",
                onEnter: ['$state', 'AccountingModel', function($state, AccountingModel) {
                    if(!AccountingModel.data.accounts.available) {
                        $state.go('setup.borrower.accounts.authenticate');
                    }
                }]
            })
            .state("setup.borrower.accounts.verify", {
                url: "/verify",
                templateUrl: "setup/account-verify.html"
            })
            .state("setup.borrower.accounts.success", {
                url: "/success",
                templateUrl: "setup/account-success.html"
            })

            // User Details
            .state("setup.borrower.user", {
                url: "/user",
                templateUrl: "setup/borrower/user-details.html"
            })

            // SETUP LENDER

            .state("setup.lender", {
                abstract: true,
                url: "/lender",
                templateUrl: "setup/index.html",
                controller: 'SetupCtrl',
                resolve: {
                    permission: ['AuthModel', 'RootHandler', function(AuthModel, RootHandler) {
                        if(!AuthModel.hasPermission(['setup.manage', 'client.put'])) {
                            RootHandler.forbidden();
                        }
                    }],
                    role: ['AuthModel', 'RootHandler', function(AuthModel,RootHandler) {
                        if(!AuthModel.hasRole('lender')) {
                            return RootHandler.forbidden();
                        }
                        return true;
                    }]
                }
            })

            // Management Page
            .state("setup.lender.manage", {
                url: "/manage",
                templateUrl: "setup/lender/manage.html"
            })
            .state("setup.lender.terms", {
                url: "/terms",
                templateUrl: "setup/lender/terms.html",
                resolve: {
                    ConfigModel: ['ConfigModel', function (ConfigModel) {
                        // Sets the terms a specific as context from config table
                        ConfigModel.get('termsLenderTermsOfService', false);
                        ConfigModel.get('termsLenderSophisticatedInvestor', false);

                        return ConfigModel;
                    }]
                }
            })

            //Company Details
            .state("setup.lender.details", {
                url: "/confirm/details/",
                templateUrl: "setup/company-details.html"
            })

            //Lender Risk Profile
            .state("setup.lender.risk", {
                url: "/risk",
                controller: "LenderRiskProfileCtrl",
                templateUrl: "setup/lender/risk-profile.html"
            })

            .state("setup.lender.deposit", {
                url: "/deposit",
                controller: "SetupCtrl",
                "templateUrl": "setup/lender/confirm-deposit.html"
            })


            // Bank Account
            .state("setup.lender.accounts", {
                url: "/accounts",
                template: "<ui-view/>",
                controller: "BankAccountCtrl"
            })
            .state("setup.lender.accounts.authenticate", {
                url: "/authenticate",
                templateUrl: "setup/lender/account-authenticate.html"
            })
            .state("setup.lender.accounts.authenticate.info", {
                url: "/info",
                templateUrl: "setup/account-info.html"
            })
            .state("setup.lender.accounts.authenticate.confirm", {
                url: "/confirm",
                templateUrl: "setup/account-confirm.html"
            })
            .state("setup.lender.accounts.sent", {
                url: "/sent",
                templateUrl: "setup/account-sent.html"
            })
            .state("setup.lender.accounts.verify", {
                url: "/verify",
                templateUrl: "setup/account-verify.html"
            })
            .state("setup.lender.accounts.success", {
                url: "/success",
                templateUrl: "setup/account-success.html"
            });

    }]);

angular.module('pp.core').factory('ApiHandler',
    ['$q', '$injector', '$location', 'messageCenterService', 'AppGlobals', 'AppNotifier',
    function($q, $injector, $location, messageCenterService, AppGlobals, AppNotifier) {

        var service = {};

        service.defaultError = function(error) {
            return service.flashError(error);
        };

        service.addAuthHeader = function(config) {
            config.headers = config.headers || {};
            //console.log('setting request headers');
            //console.log(AppNotifier.getToken());
            if (AppNotifier.check()) {
                config.headers.Authorization = 'Bearer ' + AppNotifier.getToken();
            }
            return config;
        };

        service.handleUnauthorized = function(response) {
            //todo - check the 401 comes from our own api not an external
            AppNotifier.notifyUnauthorized();
        }

        service.handleRedirect = function(response){
            console.log(response);
            var redirectUrl = response.data.redirect_url;

            //is it an external url?
            if(redirectUrl.indexOf('http') == -1) {
                $location.url(redirectUrl);
            }
            AppNotifier.notifyRedirect(redirectUrl);
        };

        service.flashError = function (error) {

            var html = '';
            var customErrors = false;
            var reasonPhrase = false;

            if(error.data && error.data.hasOwnProperty('error')) {
                customErrors = error.data.error;
            }

            if(error.data && error.data.hasOwnProperty('reason_phrase')) {
                reasonPhrase = error.data.reason_phrase;
            }

            if(customErrors) {
                html += "<ul>"
                for(var i=0; i < customErrors.length; i++) {
                    html += "<li>" + customErrors[i] + "</li>";
                }
                html += "</ul>";
            } else if(reasonPhrase){
                html = "<p>" + reasonPhrase + "</p>";
            } else {
                html = "<p>There was a problem with your request. Please refresh the page.</p>";
            }
            messageCenterService.add(
                'danger',
                html,
                {
                    html: true,
                    timeout: AppGlobals.FLASH_TIMEOUT
                });
        };

        return service;

    }]);

angular.module('pp.core').factory('ApiInterceptor',
    ['$window', '$q', '$injector', '$location', 'ApiHandler', 'AppGlobals',
    function ($window, $q, $injector, $location, ApiHandler, AppGlobals){
        return {

            request: function(config){
                config = ApiHandler.addAuthHeader(config);
                //console.log('setting config');
                //console.log(config);

                // pass the promise down the chain
                return config;
            },

            responseError: function (response) {

                console.log('error response detected:');
                console.log(response);

                // -1 CORS ERROR
                if (response.status === -1) {

                    ApiHandler.defaultError(response);
                    //ApiHandler.handleUnauthorized();
                    // pass the promise down the chain
                    return $q.reject(response);


                // 401 UNAUTHORIZED
                } else if (response.status === 401) {
                    console.log('401 detected');
                    // todo - find a way to safely kill the application without passing the promise on
                    // possibly reload the page
                    ApiHandler.handleUnauthorized();

                    return $q.reject(response);

                // 303 REDIRECT
                } else if (response.status === 303) {
                    console.log("303 has been returned from the api");
                    ApiHandler.handleRedirect(response);
                    //not really an error these are intentional redirects

                    return $q.reject(response);
                } else {
                    ApiHandler.defaultError(response);

                    // pass the promise down the chain
                    return $q.reject(response);
                }
            }
        };
    }]);

angular.module('pp.core').factory('ApiService', ['_', '$http', 'AppGlobals',
    function(_, $http, AppGlobals) {

        var service = {};

        service.get = function (endPoint, params, isAdminRoute) {
            var url = this.getApiUrl(endPoint, isAdminRoute);

            var options = {
                url: url,
                method: 'GET',
                params: params
            };

            return this.call(options);
        };

        service.post = function (endPoint, data, isAdminRoute) {
            var url = this.getApiUrl(endPoint, isAdminRoute);

            var options = {
                url: url,
                method: 'POST',
                data: data
            };
            return this.call(options);
        };

        service.put = function (endPoint, data, isAdminRoute) {
            var url = this.getApiUrl(endPoint, isAdminRoute);

            var options = {
                url: url,
                method: 'PUT',
                data: data
            };
            return this.call(options);
        };

        service.call = function(options) {
            console.log(options);

            return $http(options);
        };

        service.getApiUrl = function(slug, isAdminRoute, params) {
            var url = isAdminRoute ? AppGlobals.ADMIN_URL : AppGlobals.API_URL;

            if (slug.charAt(0) != '/') {
                slug = '/' + slug;
            }
            url += slug;
            if (params) {
                url += '?' + service.buildQuery(params);
            }
            if (service.validateUrl(url)){
                return url;
            }
            throw new Exception('Invlaid url: ' + url);
        };

        service.validateUrl = function (url) {
            var urlregex = new RegExp(
                "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$"
            );
            return urlregex.test(url);
        };

        service.buildQuery = function buildQuery(params) {
            var parts = [];
            for (var i in params) {
                if (params.hasOwnProperty(i)) {
                    parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(params[i]));
                }
            }
            return parts.join("&");
        };

        return service;
}]);

/**
 * AppNotifier is required to prevent circular dependencies
 * The ApiInterceptor needs a way of seeing if the user is logged in
 * but it can't depend on any service that itself uses the api (like the AuthModel)
 * otherwise it would end up depending on itself (a circular dependency)
 * this means the ApiInterceptor can only communicate with other services by emitting events
 */
angular.module('pp.core').service('AppNotifier',
    ['$rootScope', function($rootScope){
        var service = {
            isLoggedIn: false,
            sessionToken: false
        };

        service.getToken = function() {
            return this.sessionToken;
        }

        service.saveLogin = function(token) {
            console.log('setting auth notifier');
            this.sessionToken = token;
            this.isLoggedIn = true;
        }

        service.check = function() {
            return this.isLoggedIn ? true : false;
        };

        service.notifyLogin = function(token) {
            this.saveLogin(token);
            $rootScope.$broadcast('login');
        };

        service.notifyLogout = function() {
            $rootScope.$broadcast('logout');
        };

        service.notifyUnauthorized = function() {
            $rootScope.$broadcast('unauthorized');
        };

        service.notifyRedirect = function(url) {
            $rootScope.$broadcast('redirect', {
                url: url
            });
        }

        return service;
    }]);
angular.module('pp.core').service('RootHandler',
    ['$state', '$window', '$timeout', '$location', 'messageCenterService', 'AppGlobals', 'AuthModel',
        function($state, $window, $timeout, $location, messageCenterService, AppGlobals, AuthModel){

            var service = {
                redirectInProgress: false
            };

            service.forbidden = function() {
                $location.url('/forbidden');
                messageCenterService.add(
                    'danger',
                    AppGlobals.INVALID_PERMISSIONS,
                    {
                        status: messageCenterService.status.next,
                        timeout: AppGlobals.FLASH_TIMEOUT
                    });
            };

            service.redirect = function(url, warning) {
                console.log('RootHandler has been instructed to redirect. ');
                $state.href(url);

                if(warning) {
                    messageCenterService.add('danger', warning, {
                        status: messageCenterService.status.next
                    });
                }
            };

            service.unauthorized = function(refresh){
                if(!this.redirectInProgress) {
                    this.redirectInProgress = true;

                    console.log('setting lastKnownState to: ' + $state.current.name);

                    if(AuthModel.check()) {
                        AuthModel.logout();
                    }

                    AuthModel.saveLastKnownState({
                        name: $state.current.name,
                        params: $state.params
                    });

                    if(refresh) {
                        // GO NUCLEAR - kill the application
                        $window.location.href = '/login';
                        console.log('page refreshed');
                    } else {
                        $state.go('login');

                        messageCenterService.add(
                            'danger',
                            'Your session has expired. Please login again.',
                            {
                                status: messageCenterService.status.next,
                                timeout: AppGlobals.FLASH_TIMEOUT
                            }
                        );
                        // prevents a barrage of 401s from firing notifications
                        $timeout(function(){
                            service.redirectInProgress = false;
                        }, 2000)
                    }
                }
            };

            return service;
        }]);

angular.module('pp.admin', [
    'templates.admin',
    'pp.core'
]);

angular.module('pp.admin').config(
    ['$locationProvider', '$httpProvider', 'AppGlobals', 'localStorageServiceProvider', '$ocLazyLoadProvider',
    function($locationProvider, $httpProvider, AppGlobals, localStorageServiceProvider, $ocLazyLoadProvider){

        $ocLazyLoadProvider.config({
            modules: [
                {
                    name: 'templates.admin',
                    files: ['js/temptaes-admin.js']
                },
                {
                    name: 'templates.borrower',
                    files: ['js/templates-borrower.js']
                },
                {
                    name: 'templates.register',
                    files: ['js/templates-register.js']
                },
                {
                    name: 'templates.setup',
                    files: ['js/templates-setup.js']
                },
                {
                    name: 'templates.invite',
                    files: ['js/templates-invite.js']
                }
            ]
        });
}]);

angular.module('pp.admin').constant('AdminGlobals', {
    APP_TITLE: 'PeerPay',
    API_URL: 'http://api2.peerpay.big/api/admin'

});


angular.module('pp.admin').controller('AuthClientCtrl',
    ['$scope', '$state','$uibModal', 'ClientModel', 'AppGlobals', 'ConfigModel', 'FormModel', 'messageCenterService',
    function ($scope, $state, $uibModal, ClientModel, AppGlobals, ConfigModel, FormModel, messageCenterService) {

        $scope.showRiskProfile = false;
        $scope.showRiskAssessment = false;

        var clientToAuthorizeKey = $state.params.clientToAuthorizeKey;

        console.log('AuthClientCtrl client to auth key: ' + clientToAuthorizeKey);

        // If refresh is actioned then redirect
        // Not sure if this will become problematic with wanting to refresh a specific page and not
        // having the id set in the URI?
        if (!clientToAuthorizeKey && clientToAuthorizeKey != 0) {
            console.log(clientToAuthorizeKey);
            $state.go('clients.list');
        }

        // Set the client we want to use from the pendingClients array with our key from the params
        var clientToAuthorize = ClientModel.data.pendingClients.data[clientToAuthorizeKey];
        $scope.clientToAuthorize = clientToAuthorize;

        console.log('Client Loaded:');
        console.log(clientToAuthorize);

        /**
         * Accepts client
         */
        $scope.authorizeClient = function ($event) {
            console.log('Authorise client');

            $event.preventDefault();

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'admin/modals/clients/' + clientToAuthorize.clientType + '/authorize-client.html',
                controller: ['$scope', 'ClientModel', 'FormModel', '$uibModalInstance', function ($scope, ClientModel, FormModel, $uibModalInstance) {

                    var clientName = clientToAuthorize.clientName;

                    ClientModel.getClientAuthOptions(clientName)
                        .then(function (data) {
                            console.log("Retrieving auth options");
                            console.log(data.data);
                            $scope.authOptions = data.data;
                        });

                    /**
                     * Actions the authorisation once user
                     * has pressed the acceptance button
                     */
                    $scope.completeAuthorise = function (form) {

                        ClientModel.authorizeClient(clientName, form)
                            .then(function (success) {

                                // Save the client from within the pendingClients list
                                // so that it updates status on the fly and removes from list
                                clientToAuthorize.clientData['clientAuthorized'] = true;
                                ClientModel.data.pendingClients.data[clientToAuthorizeKey] = clientToAuthorize;
                                ClientModel.save();

                                $uibModalInstance.close(true);

                                $state.go('clients.list');

                                var html = '<p>'+AppGlobals.CLIENT_AUTHORISED+'</p>';
                                messageCenterService.add(
                                    'success',
                                    html,
                                    {
                                        html: true,
                                        timeout: AppGlobals.FLASH_TIMEOUT,
                                        status: messageCenterService.status.next
                                    }
                                );
                            });
                    }

                    $scope.cancelAuthorise = function ($event) {
                        $uibModalInstance.dismiss('cancel');
                        $event.preventDefault();
                    }

                }]
            });

            modalInstance.result.then(function (result) {
                console.log('Confirm Terms Modal result: ' + result);

            }, function () {
                console.log('Confirm Modal dismissed at: ' + new Date());
            });

        }

        /**
         * Rejects client
         */
        $scope.rejectClient = function ($event) {
            console.log('Reject client');

            $event.preventDefault();

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'admin/modals/clients/reject-client.html',
                controller: ['$scope', 'ClientModel', 'FormModel', '$uibModalInstance', function ($scope, ClientModel, FormModel, $uibModalInstance) {

                    var clientName = clientToAuthorize.clientName;

                    FormModel.get('clientReject', true);
                    $scope.forms = FormModel.data;

                    $scope.completeRejection = function (form) {
                        ClientModel.rejectClient(clientName, form)
                            .then(function (success) {

                                // Save the client from within the pendingClients list
                                // so that it updates status on the fly and removes from list
                                clientToAuthorize.clientStatus = AppGlobals.CLIENT_SUSPENDED;
                                ClientModel.data.pendingClients.data[clientToAuthorizeKey] = clientToAuthorize;
                                ClientModel.save();

                                $uibModalInstance.close(true);

                                $state.go('clients.list');

                                var html = '<p>'+AppGlobals.CLIENT_REJECTED+'</p>';
                                messageCenterService.add(
                                    'success',
                                    html,
                                    {
                                        html: true,
                                        timeout: AppGlobals.FLASH_TIMEOUT,
                                        status: messageCenterService.status.next
                                    }
                                );
                            });
                    }

                    $scope.cancelRejection = function ($event) {
                        $uibModalInstance.dismiss('cancel');
                        $event.preventDefault();
                    }

                }]
            });

            modalInstance.result.then(function (result) {
                console.log('Confirm Terms Modal result: ' + result);

            }, function () {
                console.log('Confirm Modal dismissed at: ' + new Date());
            });
        }

        /**
         * Opens risk profile on borrower authorize
         */
        $scope.openRiskProfile = function () {
            $scope.showRiskProfile = true;
        }

        /**
         * Opens risk assessment on borrower authorize
         */
        $scope.openRiskAssessment = function () {
            $scope.showRiskAssessment = true;
        }

        /**
         * Closes risk profile on borrower authorize
         */
        $scope.closeRiskProfile = function () {
            $scope.showRiskProfile = false;
        }

        /**
         * Closes risk assessment on borrower authorize
         */
        $scope.closeRiskAssessment = function () {
            $scope.showRiskAssessment = false;
        }

    }]);


angular.module('pp.admin').controller('ClientCtrl',
    ['$scope', '$state', 'AuthModel','$uibModal', 'ClientModel', 'AppGlobals', 'ConfigModel', 'FormModel',
    function ($scope, $state, AuthModel, $uibModal, ClientModel, AppGlobals, ConfigModel, FormModel) {

        $scope.vm = ClientModel.data;

        console.log(ClientModel)

        $scope.viewClient = function (index) {
            console.log('Client to authorize key: ' + index)
            $state.go('clients.authorize', {clientToAuthorizeKey: index});
        }

    }]);




angular.module('pp.core').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){

        $stateProvider
            .state('admin', {
                parent: 'provider',
                abstract: true,
                template: '<ui-view/>',
                resolve: {
                    permission: ['AuthModel', 'RootHandler', function(AuthModel, RootHandler) {
                        if(!AuthModel.hasPermission(['client.put'])) {
                            RootHandler.forbidden();
                        }
                    }]
                }
            });
    }]);



angular.module('pp.admin').config(['$stateProvider',
    function($stateProvider){

        $stateProvider
            .state("clients", {
                abstract: true,
                parent: 'auth',
                url: "/clients",
                template: '<ui-view/>',
                controller: 'ClientCtrl'
            })

            .state("clients.list", {
                url: "/list",
                templateUrl: "admin/clients/list.html",
                resolve: {
                    pendingClients: ['ClientModel', function(ClientModel){
                        console.log('fetching pending clients');
                        var params = {
                            clientStatus: 'confirmed',
                            clientData: {
                                clientAuthorized: false,
                                bankAccountConfirmed: true
                            }
                        };

                        return ClientModel.getIndex(params)
                            .then(function(success){
                                console.log(success);
                                return ClientModel.data.pendingClients = success.data;
                            }, function(error){
                                console.log(error);
                            });
                    }]
                }
            })

            .state("clients.authorize", {
                url: "/authorize",
                // Seperate controller for Authenicating so that picking up param doesn't get messy
                controller: 'AuthClientCtrl',
                params: {
                    clientToAuthorizeKey: null
                },
                templateUrl: function () {
                    return "admin/clients/authorize.html";
                }
            })
    }]);


angular.module('pp.admin').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){

        // INDEX
        $stateProvider
            .state("index", {
                url: "/",
                parent: 'guest',
                templateUrl: "admin/index/landing.html"
            });

        // HOME
        $stateProvider
            .state("summary", {
                url: "/summary",
                parent: 'auth',
                controller: 'SummaryCtrl',
                templateUrl: 'admin/summary/main.html'
            })
    }]);


angular.module('pp.admin').config(['$stateProvider',
    function($stateProvider){


    }]);


angular.module("templates.admin", []).run(["$templateCache", function($templateCache) {$templateCache.put("admin/clients/authorize.html","<div class=\"container-fluid padding-lg\">\n    <nav class=\"pp-inner-header bg-ppNavyBlue height-fixed-100 padding-y padding-x-lg\">\n        <div class=\"row\">\n            <div class=\"col-md-3 col-xs-12\">\n                <h1 class=\"left text-decoration-none text-color-white\">Authorise Client</h1>\n            </div>\n            <div class=\"col-md-9 col-xs-12\">\n                <a href=\"/clients/list\" class=\"text-color-white right\"><i class=\"fa fa-users text-center block\"></i> Clients List</a>\n            </div>\n        </div>\n    </nav>\n    <div class=\"col-md-12 padding-lg bg-ppLightBlue borderless border-radius-md\">\n        <div class=\"row\">\n            <div class=\"col-md-12\">\n                <div class=\"row margin-bottom-md border-bottom-light\">\n                    <div class=\"col-md-6 col-sm-3\">\n                        <h2>Client Details</h2>\n                    </div>\n                    <div class=\"col-md-6 col-sm-9\">\n                        <div class=\"text-align-right\">\n                            <a href=\"#\" class=\"btn btn-info margin-bottom-xs\" ng-click=\"authorizeClient($event)\">Authorise Client</a>\n                            <a href=\"#\" class=\"btn btn-info margin-bottom-xs\" ng-click=\"rejectClient($event)\">Reject Client</a>\n                        </div>\n                    </div>\n                </div>\n                <display-authorize-client client-to-authorize=\"clientToAuthorize\"></display-authorize-client>\n            </div>\n        </div>\n    </div>\n</div>");
$templateCache.put("admin/clients/list.html","<div class=\"container-fluid padding-lg\">\n    <header-title title=\"New Clients to Authorise\"></header-title>\n    <div class=\"col-md-12 padding-lg bg-ppLightBlue borderless border-radius-md\">\n        <div class=\"row\">\n            <div class=\"col-md-12\">\n                <p>Invoices I am currently Borrowing against</p>\n                <p class=\"text-color-red\" ng-show=\"!vm.pendingClients.data\">No clients available to authorise</p>\n                <div class=\"table-responsive\" ng-show=\"vm.pendingClients.data\">\n                    <table class=\"table table-striped table-bordered table-hover table-condensed\">\n                        <thead>\n                            <tr>\n                                <td class=\"capitalise\">Company Number</td>\n                                <td class=\"capitalise\">Client Name</td>\n                                <td class=\"capitalise\">Client Type</td>\n                                <td class=\"capitalise\">Primary Contact</td>\n                                <td class=\"capitalise\">Requested On</td>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            <tr ng-repeat=\"pendingClient in vm.pendingClients.data\"\n                                ng-show=\"pendingClient.clientStatus != \'suspended\'\n                                        &&\n                                        !pendingClient.clientData.clientAuthorized\"\n                                ng-click=\"viewClient($index)\"\n                            >\n                                <td>{{pendingClient.clientNumber}}</td>\n                                <td>{{pendingClient.clientDesc}}</td>\n                                <td>{{pendingClient.clientType}}</td>\n                                <td>{{pendingClient.primaryUser.firstName + \' \' + pendingClient.primaryUser.lastName}}</td>\n                                <td>{{pendingClient.createDate | date:\'dd MMM yyyy\'}}</td>\n                            </tr>\n                        </tbody>\n                    </table>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>");
$templateCache.put("admin/index/landing.html","<!-- Header -->\n<div class=\"img-handshake img-background-fit\">\n    <div class=\"overlay-dark-4\">\n        <div class=\"row\">\n            <div class=\"col-xs-12\">\n                <div class=\"center-block padding-top-xxl padding-bottom-xxl\">\n                    <h1 class=\"text-color-white margin-bottom-md font-size-xxl\">Peerpay admins</h1>\n                    <h3 class=\"text-color-white margin-bottom-lg font-size-xl\">Login with your admin account</h3>\n                    <a href=\"/login\"><button class=\"btn btn-primary btn-lg\">Login</button></a>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n\n");
$templateCache.put("admin/invoices/authorize.html","<!DOCTYPE html>\n<html>\n<head lang=\"en\">\n    <meta charset=\"UTF-8\">\n    <title></title>\n</head>\n<body>\n\n</body>\n</html>");
$templateCache.put("admin/summary/main.html","<nav class=\"pp-inner-header bg-ppNavyBlue height-fixed-100 padding-y padding-x-lg\">\n    <div class=\"row\">\n        <div class=\"col-md-3 col-xs-12\">\n            <h1 class=\"left text-decoration-none text-color-white\">Summary</h1>\n        </div>\n        <div class=\"col-md-9 col-xs-12\">\n            <a href=\"/clients/list\" class=\"text-color-white right margin-top-xs\"><i class=\"fa fa-users text-center block\"></i> Authorise Clients</a>\n        </div>\n    </div>\n</nav>\n\n<div class=\"col-md-12 padding-lg bg-ppLightBlue borderless border-radius-md\">\n    <div class=\"row\">\n        <div class=\"col-md-3 col-sm-6 col-xs-12\">\n            <div class=\"border-light\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Invoices and Loans</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt>Invoices in Progress</dt>\n                        <dd>2</dd>\n                        <dt>Pending Amount</dt>\n                        <dd>&pound;17,8000.00</dd>\n                        <hr class=\"margin-y-xxs\" />\n                        <dt>Active Loans</dt>\n                        <dd>2</dd>\n                        <dt>Outstanding Amount</dt>\n                        <dd>&pound;52,350.00</dd>\n                        <hr class=\"margin-y-xxs\" />\n                        <dt>Invoices Overdue</dt>\n                        <dd class=\"text-color-red\">3</dd>\n                        <dt>Amount Overdue</dt>\n                        <dd>&pound;10,000.00</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-md-3 col-sm-6 col-xs-12 margin-bottom-sm\">\n            <div class=\"border-light\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Borrowers</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt>Total Active</dt>\n                        <dd>32</dd>\n                        <dt>With Invoices in Progress</dt>\n                        <dd>9</dd>\n                        <dt>With Active Loans</dt>\n                        <dd>12</dd>\n                        <dt>With Overdue Invoices</dt>\n                        <dd class=\"text-color-red\">3</dd>\n                        <dt class=\"margin-top-xs\">In Pre-Registration</dt>\n                        <dd class=\"margin-top-xs\">1</dd>\n                        <dt>In Registration</dt>\n                        <dd>2</dd>\n                        <dt>Awaiting Authorisation</dt>\n                        <dd>5</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-md-3 col-sm-4\">\n            <div class=\"border-light\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Lenders</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt>Total Active</dt>\n                        <dd>45</dd>\n                        <dt>With Active Investments</dt>\n                        <dd>24</dd>\n                        <dt>With Overrun Investments</dt>\n                        <dd>2</dd>\n                    </dl>\n\n                    <dl class=\"margin-y-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt>In Pre-Registration</dt>\n                        <dd>1</dd>\n                        <dt>In Registration</dt>\n                        <dd>2</dd>\n                        <dt>Awaiting Authorisation</dt>\n                        <dd>6</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-md-3 col-sm-8\">\n            <div class=\"border-light\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Payments</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt class=\"border-bottom-light\">Currently</dt>\n                        <dl>\n                            <dt>Invoice payments expected</dt>\n                            <dd>15</dd>\n                            <dt>Deposit payments expected</dt>\n                            <dd>3</dd>\n                            <dt>Overdue Invoice payments</dt>\n                            <dd>4</dd>\n                            <dt>Overude Deposit Payments</dt>\n                            <dd>0</dd>\n                        </dl>\n                        <dt class=\"border-bottom-light\">In Last Hour</dt>\n                        <dl>\n                            <dt>Received Payments</dt>\n                            <dd>7</dd>\n                            <dt>Invoice Payments Received</dt>\n                            <dd>3</dd>\n                            <dt>Deposit Payments Received</dt>\n                            <dd>3</dd>\n                            <dt>Payments not matched</dt>\n                            <dd>1</dd>\n                        </dl>\n                    </dl>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n<div class=\"col-md-12 padding-lg bg-ppLightBlue borderless border-radius-md\">\n    <div class=\"row margin-top-sm\">\n        <div class=\"col-md-6 col-sm-6 col-xs-12\">\n            <div class=\"border-light bg-light-gray\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Attention Needed</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <ul>\n                        <li>There are <a href=\"#\">5</a> invoices waiting to be authorised.</li>\n                        <li>There are <a href=\"#\">11</a> new clients waiting to be authorised.</li>\n                        <li>There are currently <a href=\"#\">3</a> overdue invoices.</li>\n                        <li>We have <a href=\"#\">1</a> payment that cannot be matched.</li>\n                        <li>We have NOT received <a href=\"#\">2</a> lender deposit payments that are expected</li>\n                    </ul>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-md-6 col-sm-6 col-xs-12\">\n            <div class=\"padding-md border-light bg-light-gray\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Invoices and Loans in Progress: By Status</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt>Submitted</dt>\n                        <dd>2</dd>\n                        <dt>Authorised</dt>\n                        <dd>2</dd>\n                        <dt>Loan Accepted</dt>\n                        <dd>2</dd>\n                        <dt>Loan Made</dt>\n                        <dd>2</dd>\n                        <dt>Invoice Paid</dt>\n                        <dd>2</dd>\n                        <dt>Not Matched</dt>\n                        <dd>2</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>");
$templateCache.put("admin/clients/borrower/authorize.html","\n\n                <div class=\"row\">\n                    <div class=\"col-md-6 col-xs-12\">\n                        <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                            <dt>Client Name</dt>\n                            <dd>{{clientToAuthorize.clientName}}</dd>\n                            <dt>Company Description</dt>\n                            <dd>{{clientToAuthorize.clientDesc}}</dd>\n                            <dt>Company Number</dt>\n                            <dd>{{clientToAuthorize.clientNumber}}</dd>\n                            <dt>Client Type</dt>\n                            <dd>{{clientToAuthorize.clientType}}</dd>\n                            <dt>Date of Request</dt>\n                            <!-- @TODO - Format Date -->\n                            <dd>{{clientToAuthorize.createDate}}</dd>\n                            <dt>Requested by</dt>\n                            <dd>{{clientToAuthorize.primaryUser.firstName + \' \' + clientToAuthorize.primaryUser.lastName}}</dd>\n                        </dl>\n                    </div>\n                    <div class=\"col-md-6 col-xs-12\">\n                        <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                            <dt>Address Line 1</dt>\n                            <dd>{{clientToAuthorize.clientData.address.addressLine1}}</dd>\n                            <dt>Address Line 2</dt>\n                            <dd>{{clientToAuthorize.clientData.address.addressLine2}}</dd>\n                            <dt>Town/City</dt>\n                            <dd>{{clientToAuthorize.clientData.address.town}}</dd>\n                            <dt>County</dt>\n                            <dd>{{clientToAuthorize.clientData.address.county}}e</dd>\n                            <dt>Post Code</dt>\n                            <dd>{{clientToAuthorize.clientData.address.postCode}}</dd>\n                            <dt>Country</dt>\n                            <dd>{{clientToAuthorize.clientData.address.country}}</dd>\n                        </dl>\n                    </div>\n                </div>\n\n                <div class=\"row margin-top-md\">\n                    <div class=\"col-md-6 margin-bottom-sm\">\n                        <div class=\"bg-dark-grey\">\n                            <div class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm padding-right-sm\">\n                                <div class=\"row\">\n                                    <p class=\"font-weight-bold col-md-6\">Service Managers Risk Assessment</p>\n                                    <div class=\"col-md-6 text-xs-right\">\n                                        <a href=\"#\" ng-show=\"authorise.showRiskAssessment\" ng-click=\"authorise.closeRiskAssessment()\" class=\"btn btn-info\">Close</a>\n                                    </div>\n                                </div>\n                            </div>\n\n                            <div class=\"padding-x-sm padding-y-sm\">\n                                <div ng-show=\"!authorise.showRiskAssessment\">\n                                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                                        <dt>Risk Level set by Service Manager</dt>\n                                        <dd class=\"capitalised\">Medium</dd>\n                                        <dt>Client Known by Service Manager</dt>\n                                        <dd>{{clientToAuthorize.clientData.managerAssessment.knownClientYears}}</dd>\n                                    </dl>\n                                    <a href=\"#\" class=\"btn btn-info\" ng-click=\"authorise.openRiskAssessment()\">View Assessment</a>\n                                </div>\n                                <div ng-show=\"authorise.showRiskAssessment\">\n                                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                                        <dt>Industry Sector</dt>\n                                        <dd>{{clientToAuthorize.clientData.managerAssessment.industrySector}}</dd>\n                                        <dt>Average Invoice Size</dt>\n                                        <dd>{{clientToAuthorize.clientData.managerAssessment.avgInvoiceSize}}</dd>\n                                        <dt>Known to Service Manager</dt>\n                                        <dd>{{clientToAuthorize.clientData.managerAssessment.knownClientYears}}</dd>\n                                        <dt>Turn Over</dt>\n                                        <dd>&pound;{{clientToAuthorize.clientData.managerAssessment.turnoverPrevious}}</dd>\n                                        <dt>End Customer Profile</dt>\n                                        <dd>{{clientToAuthorize.clientData.managerAssessment.customerBase}}</dd>\n                                        <dt>DSO</dt>\n                                        <dd>{{clientToAuthorize.clientData.managerAssessmnet.daysSalesOutstanding}}</dd>\n                                        <dt>Service Manager Risk Rating</dt>\n                                        <dd>{{clientToAuthorize.clientData.borrowerRating}}</dd>\n                                    </dl>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"col-md-6 margin-bottom-sm\">\n                        <div class=\"bg-dark-grey\">\n                            <div class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm padding-right-sm\">\n                                <div class=\"row\">\n                                    <p class=\"font-weight-bold col-md-6\">Clients own Risk Profile</p>\n                                    <div class=\"col-md-6 text-xs-right\">\n                                        <a href=\"#\" ng-show=\"authorise.showRiskProfile\" ng-click=\"authorise.closeRiskProfile()\" class=\"btn btn-info\">Close</a>\n                                    </div>\n                                </div>\n                            </div>\n\n                            <div class=\"padding-x-sm padding-y-sm\">\n                                <div ng-show=\"!authorise.showRiskProfile\">\n                                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                                        <dt>Active Customers in last 12 months</dt>\n                                        <dd>{{clientToAuthorize.clientData.riskAnalysis.countActiveCustomers}}</dd>\n                                        <dt>Invoices sent in last 12 months</dt>\n                                        <dd>{{clientToAuthorize.clientData.riskAnalysis.countInvoices}}</dd>\n                                    </dl>\n                                    <a href=\"#\" class=\"btn btn-info\" ng-click=\"authorise.openRiskProfile()\">View Risk Profile</a>\n                                </div>\n                                <div ng-show=\"authorise.showRiskProfile\">\n                                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                                        <dt>Reason for borrowing</dt>\n                                        <dd>{{clientToAuthorize.clientData.selfAssessment.joiningReason}}</dd>\n                                        <dt>Average Order Size</dt>\n                                        <dd>{{clientToAuthorize.clientData.selfAssessment.avgOrderSize}}</dd>\n                                        <dt>Invoices sent in last 12 months</dt>\n                                        <dd>{{clientToAuthorize.clientData.riskAnalysis.countInvoices}}</dd>\n                                        <dt>Customers in last 12 months</dt>\n                                        <dd>{{clientToAuthorize.clientData.riskAnalysis.countActiveCustomers}}</dd>\n                                        <dt>Invoices overdue in last 12 months</dt>\n                                        <dd>{{clientToAuthorize.clientData.riskAnalysis.countInvoicesOverdueYearly}}</dd>\n                                        <dt>Customers with invoices due</dt>\n                                        <dd>{{clientToAuthorize.clientData.riskAnalysis.countInvoicesDue}}</dd>\n                                        <dt>Amount due</dt>\n                                        <dd>&pound;{{clientToAuthorize.clientData.riskAnalysis.sumInvoices}}</dd>\n                                        <dt>Customers with overdue invoices</dt>\n                                        <dd>{{clientToAuthorize.clientData.riskAnalysis.sumInvoicesOverdue}}</dd>\n                                        <dt>Amount overdue</dt>\n                                        <dd>&pound;{{clientToAuthorize.clientData.riskAnalysis.sumInvoicesOverdueYearly}}</dd>\n                                    </dl>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"bg-dark-grey\">\n                            <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Additional Details</p>\n                            <div class=\"padding-x-sm padding-y-sm\">\n                                <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                                    <dt>Main Contact name</dt>\n                                    <dd>{{clientToAuthorize.primaryUser.firstName + \' \' + clientToAuthorize.primaryUser.lastName}}</dd>\n                                    <dt>Accountancy System</dt>\n                                    <dd>{{clientToAuthorize.clientData.accountsSystem}}</dd>\n                                </dl>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"bg-dark-grey\">\n                            <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Companies House Information</p>\n                            <div class=\"padding-x-sm padding-y-sm\">\n                                <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                                    <dt>{{clientToAuthorize.clientData.companyType}}</dt>\n                                    <dd>Limited</dd>\n                                    <dt>Company Status</dt>\n                                    <dd>{{clientToAuthorize.companyData.companyStatus}}</dd>\n                                    <dt>Annual Return Status</dt>\n                                    <dd>Up to date</dd>\n                                </dl>\n                            </div>\n                        </div>\n                    </div>\n                </div>");
$templateCache.put("admin/clients/lender/authorize.html","\n\n                <div class=\"row\">\n                    <div class=\"col-md-6 col-xs-12\">\n                        <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                            <dt>Client Name</dt>\n                            <dd>{{clientToAuthorize.clientName}}</dd>\n                            <dt>Company Description</dt>\n                            <dd>{{clientToAuthorize.clientDesc}}</dd>\n                            <dt>Company Number</dt>\n                            <dd>{{clientToAuthorize.clientNumber}}</dd>\n                            <dt>Client Type</dt>\n                            <dd>{{clientToAuthorize.clientType}}</dd>\n                            <dt>Investor Type</dt>\n                            <dd>{{clientToAuthorize.lenderType}}</dd>\n                            <dt>Date of Request</dt>\n                            <!-- @TODO - Format Date -->\n                            <dd>{{clientToAuthorize.createDate | date:\'dd MMM yyyy\'}}</dd>\n                            <dt>Requested by</dt>\n                            <dd>{{clientToAuthorize.primaryUser.firstName + \' \' + clientToAuthorize.primaryUser.lastName}}</dd>\n                        </dl>\n                    </div>\n                    <div class=\"col-md-6 col-xs-12\">\n                        <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                            <dt>Address Line 1</dt>\n                            <dd>{{clientToAuthorize.clientData.address.addressLine1}}</dd>\n                            <dt>Address Line 2</dt>\n                            <dd>{{clientToAuthorize.clientData.address.addressLine2}}</dd>\n                            <dt>Town/City</dt>\n                            <dd>{{clientToAuthorize.clientData.address.town}}</dd>\n                            <dt>County</dt>\n                            <dd>{{clientToAuthorize.clientData.address.county}}e</dd>\n                            <dt>Post Code</dt>\n                            <dd>{{clientToAuthorize.clientData.address.postCode}}</dd>\n                            <dt>Country</dt>\n                            <dd>{{clientToAuthorize.clientData.address.country}}</dd>\n                        </dl>\n                    </div>\n                </div>\n\n                <div class=\"row margin-top-md\">\n                    <div class=\"col-md-6\">\n                        <div class=\"bg-dark-grey\">\n                            <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Lender\'s Risk Profile</p>\n                            <div class=\"padding-x-sm padding-y-sm\">\n                                <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                                    <dt>Amount of available funds</dt>\n                                    <dd>&pound;{{clientToAuthorize.clientData.lenderRiskProfile.availableFundsAmount}}</dd>\n                                    <dt>Funds to be deposited with PeerPay</dt>\n                                    <dd>&pound;{{clientToAuthorize.clientData.lenderRiskProfile.depositAmount}}</dd>\n                                    <dt>Financial year end date</dt>\n                                    <dd>{{clientToAuthorize.clientData.lenderRiskProfile.financialYearEnd}}</dd>\n                                    <dt>Proof of fund availability</dt>\n                                    <dd><a href=\"#\">View this file</a></dd>\n                                </dl>\n                            </div>\n                        </div>\n                        <div class=\"bg-dark-grey margin-top-sm\">\n                            <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Additional Details</p>\n                            <div class=\"padding-x-sm padding-y-sm\">\n                                <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                                    <dt>Main Contain Name</dt>\n                                    <dd>{{clientToAuthorize.primaryUser.firstName + \' \' + clientToAuthorize.primaryUser.lastName}}</dd>\n                                </dl>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"bg-dark-grey\">\n                            <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Funding Preferences</p>\n                            <div class=\"padding-x-sm padding-y-sm\">\n                                <div class=\"table-responsive\">\n                                    <table class=\"table table-condensed borderless\">\n                                        <tr>\n                                            <td><span class=\"capitalised\">Low</span></td>\n                                            <td>{{clientToAuthorize.clientData.lenderRiskProfile.lendSpreadLowPercentage}}%</td>\n                                        </tr>\n                                        <tr>\n                                            <td><span class=\"capitalised\">Medium</span></td>\n                                            <td>{{clientToAuthorize.clientData.lenderRiskProfile.lendSpreadMediumPercentage}}%</td>\n                                        </tr>\n                                        <tr>\n                                            <td><span class=\"capitalised\">High</span></td>\n                                            <td>{{clientToAuthorize.clientData.lenderRiskProfile.lendSpreadHighPercentage}}%</td>\n                                        </tr>\n                                    </table>\n                                </div>\n                                <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                                    <dt>Maximum lend period for <span class=\"capitalised\">low</span></dt>\n                                    <dd>{{clientToAuthorize.clientData.lenderRiskProfile.maxPeriodLowRisk}}</dd>\n                                    <dt>Maximum lend period for <span class=\"capitalised\">medium</span></dt>\n                                    <dd>{{clientToAuthorize.clientData.lenderRiskProfile.maxPeriodMediumRisk}}</dd>\n                                    <dt>Maximum lend period for <span class=\"capitalised\">high</span></dt>\n                                    <dd>{{clientToAuthorize.clientData.lenderRiskProfile.maxPeriodHighRisk}}</dd>\n                                </dl>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n");
$templateCache.put("admin/modals/clients/reject-client.html","<div class=\"modal-header\">\n    <button ng-click=\"cancelRejection($event)\" type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n        <span class=\"sr-only\">Close</span>\n    </button>\n    <h4 class=\"modal-title\">Reject Client</h4>\n</div>\n<form name=\"ppForm\" ng-submit=\"ppForm.$valid && completeRejection(ppForm)\" novalidate>\n    <div class=\"modal-body\">\n\n        <p class=\"font-weight-bold\">You now need to choose the reason you have rejected this borrower request</p>\n\n        <div ng-repeat=\"field in forms.clientReject\">\n            <dropdown-field field=\"field\"></dropdown-field>\n        </div>\n\n        <div class=\"form-group row margin-bottom-md\">\n            <label for=\"additional-rejection-info\"\n                   class=\"col-md-12 form-control-label text-spaced-xs font-weight-bold\">Enter any additional information here</label>\n\n            <div class=\"col-md-12\">\n                <textarea\n                   id=\"additionalRejectionInfo\"\n                   name=\"additionalRejectionInfo\"\n                   class=\"form-control \"\n                   ng-model=\"vm.client.clientData.additionalRejectionInfo\">\n                </textarea>\n            </div>\n        </div>\n\n    </div>\n    <div class=\"modal-footer\">\n        <button class=\"btn btn-secondary\" ng-click=\"cancelRejection($event)\">Cancel</button>\n        <button class=\"btn btn-primary\" type=\"submit\">Complete Rejection</button>\n    </div>\n</form>\n");
$templateCache.put("admin/modals/clients/borrower/authorize-client.html","<div class=\"modal-header\">\n    <button ng-click=\"cancelAuthorise($event)\" type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n        <span class=\"sr-only\">Close</span>\n    </button>\n    <h4 class=\"modal-title\">Authorise Client</h4>\n</div>\n<form name=\"ppForm\" ng-submit=\"ppForm.$valid && completeAuthorise(ppForm)\" novalidate>\n    <div class=\"modal-body\">\n        <p class=\"font-weight-bold\">Now enter a borrow limit and select a service transaction account to complete authorisation of this clients.</p>\n\n        <fieldset class=\"form-group row\">\n            <label for=\"borrowerLimit\" class=\"col-sm-4 control-label\">Client\'s Borrower Limit</label>\n            <div class=\"col-sm-8\">\n                <input type=\"text\" readonly ng-model=\"authOptions.maxCredit\" name=\"borrowerLimit\" />\n            </div>\n        </fieldset>\n\n\n        <fieldset class=\"form-group row\"\n          ng-class=\"{ \'has-error\' : ppForm.$submitted && ppForm.serviceTransactionAccount.$invalid }\">\n            <label for=\"serviceTransactionAccount\" class=\"col-sm-4 control-label\">Service Transaction Account</label>\n            <div class=\"col-sm-8\">\n                <select id=\"serviceTransactionAccount\" name=\"serviceTransactionAccount\" class=\"form-control\"\n                        ng-model=\"authOptions.serviceTransactionAccount\"\n                        ng-options=\"o for o in authOptions.accountList\"\n                        ng-required=\"true\">\n                </select>\n\n                <div ng-show=\"(ppForm.$submitted) && ppForm.serviceTransactionAccount.$invalid\" class=\"text-color-danger\">Service Transaction Account is required</div>\n\n                <div ng-messages=\"ppForm.serviceTransactionAccount.$error\"\n                     ng-if=\"ppForm.$submitted\"\n                     class=\"text-color-danger\"\n                     role=\"alert\">\n                    <div ng-message=\"required\">Service Transaction Account is required</div>\n                </div>\n            </div>\n        </fieldset>\n\n\n    </div>\n    <div class=\"modal-footer\">\n        <button class=\"btn btn-secondary\" ng-click=\"cancelAuthorise($event)\">Cancel</button>\n        <button class=\"btn btn-primary\" type=\"submit\">Complete Authorise</button>\n    </div>\n</form>\n");
$templateCache.put("admin/modals/clients/lender/authorize-client.html","<div class=\"modal-header\">\n    <button ng-click=\"cancelAuthorise($event)\" type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n        <span class=\"sr-only\">Close</span>\n    </button>\n    <h4 class=\"modal-title\">Authorise Client</h4>\n</div>\n<form name=\"ppForm\" ng-submit=\"ppForm.$valid && completeAuthorise(ppForm)\" novalidate>\n    <div class=\"modal-body\">\n        <p class=\"font-weight-bold\">Now select a service transaction account to complete authorisation of this client.</p>\n\n        <fieldset class=\"form-group row\"\n          ng-class=\"{ \'has-error\' : ppForm.$submitted && ppForm.serviceTransactionAccount.$invalid }\">\n            <label for=\"serviceTransactionAccount\" class=\"col-sm-4 control-label\">Service Transaction Account</label>\n            <div class=\"col-sm-8\">\n                <select id=\"serviceTransactionAccount\" name=\"serviceTransactionAccount\" class=\"form-control\"\n                        ng-model=\"authOptions.serviceTransactionAccount\"\n                        ng-options=\"o for o in authOptions.accountList\"\n                        ng-required=\"true\">\n                </select>\n\n                <div ng-show=\"(ppForm.$submitted) && ppForm.serviceTransactionAccount.$invalid\" class=\"text-color-danger\">Service Transaction Account is required</div>\n\n                <div ng-messages=\"ppForm.serviceTransactionAccount.$error\"\n                     ng-if=\"ppForm.$submitted\"\n                     class=\"text-color-danger\"\n                     role=\"alert\">\n                    <div ng-message=\"required\">Service Transaction Account is required</div>\n                </div>\n            </div>\n        </fieldset>\n\n\n    </div>\n    <div class=\"modal-footer\">\n        <button class=\"btn btn-secondary\" ng-click=\"cancelAuthorise($event)\">Cancel</button>\n        <button class=\"btn btn-primary\" type=\"submit\">Complete Authorise</button>\n    </div>\n</form>\n");}]);
angular.module("templates.borrower", []).run(["$templateCache", function($templateCache) {$templateCache.put("borrower/invoices.html","yo");}]);
angular.module("templates.core", []).run(["$templateCache", function($templateCache) {$templateCache.put("core/abort/403.html","<div class=\"container margin-y-lg\">\n    <div class=\"row\">\n        <div class=\"col-md-8 col-md-offset-2\">\n            <h1>Forbidden</h1>\n\n            <p>It looks like you don\'t have the correct permissions to access this resource.</p>\n\n            <a href=\"/summary\" class=\"btn btn-primary\">Go back to the summary page</a>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("core/auth/login.html","<div class=\"container margin-y-lg\">\n    <div class=\"row\">\n        <div class=\"col-md-8 col-md-offset-2\">\n\n            <form name=\"loginForm\" ng-submit=\"loginForm.$valid && login()\" novalidate>\n                <!-- username -->\n                <fieldset class=\"form-group\"\n                          ng-class=\"{ \'has-error\' : loginForm.username.$invalid && loginForm.$submitted }\">\n                    <input type=\"text\"\n                           ng-model=\"credentials.username\"\n                           name=\"username\"\n                           class=\"form-control\"\n                           id=\"loginEmail\"\n                           placeholder=\"Username\"\n                           required>\n\n                    <div ng-messages=\"loginForm.username.$error\"\n                         ng-if=\"loginForm.username.$invalid && loginForm.$submitted\"\n                         class=\"text-color-danger\"\n                         role=\"alert\">\n                        <div ng-message=\"required\">You must enter a username</div>\n                    </div>\n                </fieldset>\n\n                <!-- password -->\n                <fieldset class=\"form-group\"\n                          ng-class=\"{ \'has-error\' : loginForm.password.$invalid && loginForm.$submitted }\">\n                    <input type=\"password\"\n                           ng-model=\"credentials.password\"\n                           name=\"password\"\n                           class=\"form-control\"\n                           id=\"loginPassword\"\n                           placeholder=\"Password\"\n                           required\n                           minlength=\"5\">\n\n                    <div ng-messages=\"loginForm.password.$error\"\n                         ng-if=\"loginForm.username.$invalid && loginForm.$submitted\"\n                         class=\"text-color-danger\"\n                         role=\"alert\">\n                        <div ng-message=\"required\">You must enter a password</div>\n                        <div ng-message=\"minlength\">Your password must be longer than 5 characters</div>\n                    </div>\n                </fieldset>\n\n                <div class=\"checkbox\">\n                    <label>\n                        <input type=\"checkbox\" ng-model=\"credentials.remember\"> Remember me\n                    </label>\n                </div>\n\n                <button class=\"btn btn-secondary\" ng-click=\"cancel(loginForm, $event)\">Cancel</button>\n                <button class=\"btn btn-primary\" type=\"submit\">Login</button>\n\n            </form>\n\n            <a href=\"/apply\">Apply for an account</a>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("core/forms/dropdown-field.html","<fieldset class=\"form-group row\"\n          ng-class=\"{ \'has-error\' : ppForm.$submitted && ppForm[field.name].$invalid }\">\n\n    <label for=\"{{field.name}}\" class=\"col-sm-4 control-label\" ng-show=\"field.label\"><div ng-bind-html=\"field.label | sanitize\"></div></label>\n\n    <div class=\"col-sm-8\">\n        <select id=\"{{field.name}}\" name=\"{{field.name}}\" class=\"form-control\"\n                ng-model=\"vm.client[field.model_namespace][field.model_name]\"\n                ng-options=\"o for o in {{field.options}}\"\n                ng-if=\"!field.nested_model_namespace\"\n                ng-required=\"field.required.value\">\n        </select>\n\n        <select id=\"{{field.name}}\" name=\"{{field.name}}\" class=\"form-control\"\n                ng-model=\"vm.client[field.model_namespace][field.nested_model_namespace][field.model_name]\"\n                ng-options=\"o for o in {{field.options}}\"\n                ng-if=\"field.nested_model_namespace\"\n                ng-required=\"field.required.value\">\n        </select>\n\n        <div ng-show=\"ppForm.$submitted && ppForm[field.name].$invalid\" class=\"text-color-danger\">{{field.required.error_message}}</div>\n\n        <!--\n        <div ng-messages=\"ppForm[field.name].$error\"\n             ng-if=\"ppForm.$submitted\"\n             class=\"text-color-danger\"\n             role=\"alert\">\n            <div ng-message=\"required\">{{field.required.message}}</div>\n        </div>\n        -->\n\n    </div>\n</fieldset>\n");
$templateCache.put("core/forms/headerTitle.html","<nav class=\"pp-inner-header bg-ppNavyBlue height-fixed-100 padding-y padding-x-lg\">\n    <div class=\"col-xs-12\">\n        <h1 class=\"left line-height-80 text-decoration-none text-color-white\">\n            {{title}}\n        </h1>\n    </div>\n</nav>");
$templateCache.put("core/home/home.html","<div class=\"container margin-y-lg\">\n    <div class=\"row\">\n        <div class=\"col-md-8 col-md-offset-2\">\n            <h1>{{user.role}} homepage</h1>\n\n            <p>You are currently logged in</p>\n\n            <p>Your role is: {{user.role}}</p>\n            <p>Available routes:</p>\n            <p><a href=\"/invite/borrower/find\">Invite borrower primary user</a></p>\n            <p><a href=\"/invite/lender/find\">Invite lender company</a></p>\n            <p><a href=\"/invite/lender/individual\">Invite lender individual</a></p>\n            <p><a href=\"/setup/borrower/manage\">Borrower Setup</a></p>\n            <p><a href=\"/setup/lender/manage\">Lender Setup</a></p>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("core/index/about.html","<div class=\"container margin-y-lg\">\n    <div class=\"row\">\n        <div class=\"col-md-8 col-md-offset-2\">\n            <h1>About Peerpay</h1>\n\n            <p>Peerpay is really awesome</p>\n\n            <button href=\"/signup\" class=\"btn\">Sign up</button>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("core/index/contact.html","<div class=\"container margin-y-lg\">\n    <div class=\"row\">\n        <div class=\"col-md-8 col-md-offset-2\">\n            <h1>Contact</h1>\n            <p>Here\'s how to contact us.</p>\n        </div>\n    </div>\n</div>\n\n");
$templateCache.put("core/index/landing.html","<!-- Header -->\n<div class=\"img-handshake img-background-fit\">\n    <div class=\"overlay-dark-4\">\n        <div class=\"row\">\n            <div class=\"col-xs-12\">\n                <div class=\"center-block padding-top-xxl padding-bottom-xxl\">\n                    <h1 class=\"text-color-white margin-bottom-md font-size-xxl\">Welcome to Peerpay</h1>\n                    <h3 class=\"text-color-white margin-bottom-lg font-size-xl\">lorem ipsum</h3>\n                    <a href=\"/about\"><button class=\"btn btn-primary btn-lg\">Request an invite</button></a>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n\n<!-- About -->\n<section id=\"about\">\n  <div class=\"container\">\n    <div class=\"row\">\n      <div class=\"col-md-8 col-md-offset-2 center-block margin-y-lg\">\n        <h2 class=\"about-title padding-bottom-lg\">Lorem ipsum</h2>\n\n        <p class=\"lead about-subtitle\">Companies and individuals lend to vetted, established SME businesses\n            within the closed and safe environment of the Accountancy practice community</p>\n      </div>\n    </div>\n    <!-- /.row -->\n  </div>\n  <!-- /.container -->\n</section>\n\n<!-- Services -->\n<section id=\"services\" class=\"bg-primary\">\n  <div class=\"container\">\n    <div class=\"row center-block margin-y-lg\">\n      <div class=\"col-lg-10 col-lg-offset-1\">\n\n        <h2 class=\"padding-bottom-lg\">PeerPay Services</h2>\n\n        <hr class=\"small\">\n\n        <div class=\"row\">\n\n          <div class=\"col-md-4 col-sm-4\">\n            <div class=\"service-item\">\n              <span class=\"fa-stack fa-4x\">\n                <i class=\"fa fa-circle fa-stack-2x\"></i>\n                <i class=\"fa fa-gbp fa-stack-1x text-primary\"></i>\n              </span>\n              <h4 class=\"padding-bottom-lg\"><strong>Peer-to-Peer Lending</strong></h4>\n              <p class=\"service-options\">Companies and individuals lend to vetted, established SME businesses within the closed and safe\n                environment of the Accountancy practice community</p>\n              <a ng-href=\"#/\" class=\"btn btn-default\">For Borrowers</a>\n            </div>\n          </div>\n\n          <div class=\"col-md-4 col-sm-4\">\n            <div class=\"service-item\">\n              <span class=\"fa-stack fa-4x\">\n                <i class=\"fa fa-circle fa-stack-2x\"></i>\n                <i class=\"fa fa-calculator fa-stack-1x text-primary\"></i>\n              </span>\n              <h4 class=\"padding-bottom-lg\"><strong>Accountancy Practice</strong></h4>\n              <p class=\"service-options\">The service will be managed by Accountancy practices as a value-added service for their own\n                client-base, allowing them to provide professional advice and support to both lenders and borrowers</p>\n              <a ng-href=\"#/\" class=\"btn btn-default\">For Accountants</a>\n            </div>\n          </div>\n\n          <div class=\"col-md-4 col-sm-4\">\n            <div class=\"service-item\">\n              <span class=\"fa-stack fa-4x\">\n                <i class=\"fa fa-circle fa-stack-2x\"></i>\n                <i class=\"fa fa-exchange fa-stack-1x text-primary\"></i>\n              </span>\n              <h4 class=\"padding-bottom-lg\"><strong>Lenders</strong></h4>\n              <p class=\"service-options\">Lenders and borrowers will be matched within a secure closed environment,\n                managed by their common\n                Accountancy practice, all parties having been vetted following strict KYC due diligence rules</p>\n              <a ng-href=\"#/\" class=\"btn btn-default\">For Lenders</a>\n            </div>\n          </div>\n\n        </div>\n\n        <!-- /.row (nested) -->\n      </div>\n      <!-- /.col-lg-10 -->\n    </div>\n    <!-- /.row -->\n  </div>\n  <!-- /.container -->\n</section>\n");
$templateCache.put("core/index/pricing.html","<div class=\"container margin-y-lg\">\n    <div class=\"row\">\n        <div class=\"col-md-8 col-md-offset-2\">\n            <h1>Pricing</h1>\n            <p>There are many ways you can pay us.</p>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("core/index/terms.html","<div class=\"container margin-y-lg\">\n    <div class=\"row\">\n        <div class=\"col-md-8 col-md-offset-2\">\n            <h1>Terms and Conditions</h1>\n            <p>We have many terms and conditions.</p>\n        </div>\n    </div>\n</div>\n\n");
$templateCache.put("core/modals/confirm-deposit.html","<div class=\"modal-header\">\n    <button ng-click=\"closeConfirmDeposit($event)\" type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n        <span class=\"sr-only\">Close</span>\n    </button>\n    <h4 class=\"modal-title\">Final Confirmation</h4>\n</div>\n<form name=\"riskTermsForm\" ng-submit=\"riskTermsForm.$valid && putRiskProfile(riskTermsForm)\" novalidate>\n    <div class=\"modal-body\">\n        <p class=\"card-text\">Please confirm that you have initiated a bank transfer to the value of:</p>\n        <div class=\"form-group row margin-bottom-md\">\n            <div class=\"col-md-12\">\n                <input type=\"input\"\n                   id=\"additionalRejectionInfo\"\n                   name=\"additionalRejectionInfo\"\n                   class=\"form-control \"\n                   ng-model=\"vm.client.clientData.additionalRejectionInfo\"\n                />\n            </div>\n        </div>\n    </div>\n    <div class=\"modal-footer\">\n        <button class=\"btn btn-secondary\" ng-click=\"confirmDeposit($event)\">Confirm Payment</button>\n    </div>\n</form>\n");
$templateCache.put("core/modals/login.html","<div class=\"modal-header\">\n    <button ng-click=\"cancel($event)\" type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n        <span class=\"sr-only\">Close</span>\n    </button>\n    <h4 class=\"modal-title\">Login</h4>\n</div>\n<form name=\"loginForm\" ng-submit=\"loginForm.$valid && login()\" novalidate>\n    <div class=\"modal-body\">\n            <!-- username -->\n            <fieldset class=\"form-group\"\n                      ng-class=\"{ \'has-error\' : loginForm.username.$invalid && loginForm.$submitted }\">\n                <input type=\"text\"\n                       ng-model=\"credentials.username\"\n                       name=\"username\"\n                       class=\"form-control\"\n                       id=\"loginEmail\"\n                       placeholder=\"Username\"\n                       required>\n\n                <div ng-messages=\"loginForm.username.$error\"\n                     ng-if=\"loginForm.username.$invalid && loginForm.$submitted\"\n                     class=\"text-color-danger\"\n                     role=\"alert\">\n                    <div ng-message=\"required\">You must enter a username</div>\n                </div>\n            </fieldset>\n\n            <!-- password -->\n            <fieldset class=\"form-group\"\n                      ng-class=\"{ \'has-error\' : loginForm.password.$invalid && loginForm.$submitted }\">\n                <input type=\"password\"\n                       ng-model=\"credentials.password\"\n                       name=\"password\"\n                       class=\"form-control\"\n                       id=\"loginPassword\"\n                       placeholder=\"Password\"\n                       required\n                       minlength=\"5\">\n\n                <div ng-messages=\"loginForm.password.$error\"\n                     ng-if=\"loginForm.username.$invalid && loginForm.$submitted\"\n                     class=\"text-color-danger\"\n                     role=\"alert\">\n                    <div ng-message=\"required\">You must enter a password</div>\n                    <div ng-message=\"minlength\">Your password must be longer than 5 characters</div>\n                </div>\n            </fieldset>\n\n            <div class=\"checkbox\">\n                <label>\n                    <input type=\"checkbox\"> Remember me\n                </label>\n            </div>\n\n    </div>\n    <div class=\"modal-footer\">\n        <button class=\"btn btn-secondary\" ng-click=\"cancel($event)\">Cancel</button>\n        <button class=\"btn btn-primary\" type=\"submit\">Login</button>\n    </div>\n</form>");
$templateCache.put("core/modals/risk-profile-terms.html","<div class=\"modal-header\">\n    <button ng-click=\"cancelAcceptRisk($event)\" type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n        <span class=\"sr-only\">Close</span>\n    </button>\n    <h4 class=\"modal-title\">PeerPay Execution Only Notice</h4>\n</div>\n<form name=\"riskTermsForm\" ng-submit=\"riskTermsForm.$valid && putRiskProfile(riskTermsForm)\" novalidate>\n    <div class=\"modal-body\">\n        <p class=\"card-text\">\n            I, {{vm.firstName}} {{vm.lastName}} <span ng-show=\"vm.client.clientName\">of {{vm.client.clientName}}</span> , confirm my intention to invest the sum of &pound;{{vm.client.clientData.lenderRiskProfile.depositAmount}}.\n            <br />\n            As a Sophisticated Investor, I agree and confirm that:\n        <ol>\n            <li>I am aware that the transaction is execution only</li>\n            <li>I have not asked for or received advice</li>\n            <li>It is my decision alone to make the investment</li>\n            <li>PeerPay takes no responsibility for the product\'s suitability.</li>\n        </ol>\n        <br />\n        Dated: {{todaysDate | date:\'dd-MM-yyyy\'}}\n        </p>\n    </div>\n    <div class=\"modal-footer\">\n        <button class=\"btn btn-secondary\" ng-disabled=\"true\">Print Notice</button>\n        <button class=\"btn btn-primary\" type=\"submit\">Accept Terms</button>\n    </div>\n</form>\n");
$templateCache.put("core/modals/terms-manage.html","<div class=\"modal-header\">\n    <button ng-click=\"cancelTerms($event)\" type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n        <span class=\"sr-only\">Close</span>\n    </button>\n    <h4 class=\"modal-title\">Terms and Conditions</h4>\n</div>\n<form name=\"termsForm\" ng-submit=\"termsForm.$valid && acceptManageTerms(termsForm)\" novalidate>\n    <div class=\"modal-body\">\n        {{vm.config[$parent.termsType].content}}\n    </div>\n    <div class=\"modal-footer\">\n        <button class=\"btn btn-secondary\" ng-click=\"cancelTerms($event)\">Cancel</button>\n        <button class=\"btn btn-primary\" type=\"submit\">Accept Terms and Conditions</button>\n    </div>\n</form>\n");
$templateCache.put("core/modals/terms.html","<div class=\"modal-header\">\n    <button ng-click=\"cancelTerms($event)\" type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n        <span class=\"sr-only\">Close</span>\n    </button>\n    <h4 class=\"modal-title\">Terms and Conditions</h4>\n</div>\n<form name=\"termsForm\" ng-submit=\"termsForm.$valid && acceptTerms(termsForm)\" novalidate>\n    <div class=\"modal-body\">\n        {{vm.config.terms.content}}\n        <div class=\"checkbox\">\n            <label>\n                <input type=\"checkbox\" name=\"acceptTerms\" ng-model=\"vm.acceptTerms\" required> <strong>I have read and understood the terms</strong>\n            </label>\n        </div>\n        <div ng-messages=\"termsForm.acceptTerms.$error\"\n             ng-if=\"termsForm.$submitted\"\n             class=\"text-color-danger\"\n             role=\"alert\">\n            <div ng-message=\"required\">* Required </div>\n        </div>\n    </div>\n    <div class=\"modal-footer\">\n        <button class=\"btn btn-secondary\" ng-click=\"cancelTerms($event)\">Cancel</button>\n        <button class=\"btn btn-primary\" type=\"submit\">Accept</button>\n    </div>\n</form>\n");
$templateCache.put("core/navbar/breadcrumbs.html","<!DOCTYPE html>\n<html>\n<head lang=\"en\">\n    <meta charset=\"UTF-8\">\n    <title></title>\n</head>\n<body>\n\n</body>\n</html>");
$templateCache.put("core/navbar/default.html","<nav class=\"navbar navbar-light bg-white\">\n\n    <!-- navbar brand -->\n    <a class=\"navbar-brand\" href=\"/\">\n        <i class=\"fa fa-bank text-color-ppNavyBlue padding-right-sm\"></i>\n        Peer<span class=\"font-weight-bold\">Pay</span>\n    </a>\n\n    <!-- logged in version -->\n    <div ng-cloak ng-show=\"isAuthenticated\">\n        <button class=\"dropdown-toggle\n                    pull-xs-right\n                    btn-width\n                    text-color-dark\n                    border-light\n                    border-radius-md\n                    font-size-sm\n                    text-spaced-xs\n                    text-decoration-none\n                    line-height-40\n                    padding-x-lg\n                    margin-left-x-xxs\"\n                type=\"button\"\n                data-toggle=\"collapse\"\n                data-target=\"#exCollapsingNavbar2\"\n                ng-click=\"navCollapsed = !navCollapsed\">\n            &#9776;\n        </button>\n\n        <!-- horizontal menu -->\n        <ul class=\"nav navbar-nav hidden-sm-down\">\n            <li class=\"nav-item\">\n                <a class=\"nav-link\" href=\"/summary\">Summary</a>\n            </li>\n            <li class=\"nav-item\">\n                <a class=\"nav-link\" ng-click=\"manage()\">Manage</a>\n            </li>\n            <li class=\"nav-item\">\n                <a class=\"nav-link\" href=\"#\">Loans</a>\n            </li>\n            <li class=\"nav-item\">\n                <a class=\"nav-link\" href=\"#\">Invoices</a>\n            </li>\n            <li class=\"nav-item\">\n                <a class=\"nav-link\" href=\"#\">Reports</a>\n            </li>\n            <li class=\"nav-item\"  uib-dropdown>\n                <a uib-dropdown-toggle class=\"nav-link\">Invite</a>\n                <div uib-dropdown-menu class=\"nav navbar-nav\" role=\"menu\">\n                    <a class=\"nav-link\" href=\"/invite/find/borrower\">Invite Borrower</a>\n                    <a class=\"nav-link\" href=\"/invite/find/lender\">Invite Lender Company</a>\n                    <a class=\"nav-link\" href=\"/invite/individual/lender\">Invite Lender Individual</a>\n                </div>\n            </li>\n        </ul>\n\n        <!-- vertical menu -->\n        <div class=\"collapse\"\n             ng-init=\"navCollapsed = true\"\n             uib-collapse=\"navCollapsed\">\n\n            <ul class=\"pull-xs-right\">\n                <nav-menu></nav-menu>\n                <li class=\"nav-item\" ng-click=\"logoutUser()\">\n                    <a class=\"nav-link\" href=\"#\">Logout</a>\n                </li>\n            </ul>\n        </div>\n    </div>\n\n\n    <!-- logged out version -->\n    <div ng-cloak ng-show=\"!isAuthenticated\">\n        <ul class=\"nav navbar-nav pull-xs-right\">\n            <li class=\"nav-item \" ng-click=\"openLoginModal()\">\n                <a class=\"nav-link\" href=\"#\">Login</a>\n            </li>\n        </ul>\n    </div>\n\n</nav>");
$templateCache.put("core/navbar/menu.html","<li class=\"nav-item\">\n    <a class=\"nav-link\" href=\"/summary\">Summary</a>\n</li>\n<li class=\"nav-item\">\n    <a class=\"nav-link\" ng-click=\"manage()\">Manage</a>\n</li>\n<li class=\"nav-item\">\n    <a class=\"nav-link\" href=\"#\">Loans</a>\n</li>\n<li class=\"nav-item\">\n    <a class=\"nav-link\" href=\"#\">Invoices</a>\n</li>\n<li class=\"nav-item\">\n    <a class=\"nav-link\" href=\"#\">Reports</a>\n</li>");
$templateCache.put("core/summary/index.html","<div class=\"container-fluid padding-lg\">\n    <ui-view/>\n</div>\n");
$templateCache.put("core/modals/activation/email.html","<div class=\"modal-header\">\n    <button ng-click=\"cancel()\" type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n        <span class=\"sr-only\">Close</span>\n    </button>\n    <h4 class=\"modal-title\">We just sent you an email!</h4>\n    <p>Enter the 12 digit code below</p>\n</div>\n<form name=\"emailActivationForm\" ng-submit=\"emailActivationForm.$valid && postEmailToken()\" novalidate>\n    <div class=\"modal-body\">\n        <!-- email -->\n        <fieldset class=\"form-group\"\n                  ng-class=\"{ \'has-error\' : emailActivationForm.email.$invalid && emailActivationForm.$submitted }\">\n            <input type=\"email\"\n                   ng-model=\"credentials.email\"\n                   name=\"email\"\n                   class=\"form-control\"\n                   id=\"loginEmail\"\n                   placeholder=\"Enter email\"\n                   required>\n\n            <div ng-messages=\"emailActivationForm.email.$error\"\n                 ng-if=\"emailActivationForm.email.$invalid && emailActivationForm.$submitted\"\n                 class=\"text-color-danger\"\n                 role=\"alert\">\n                <div ng-message=\"required\">You must enter an email address</div>\n                <div ng-message=\"email\">Your email address is invalid</div>\n            </div>\n        </fieldset>\n    </div>\n    <div class=\"modal-footer\">\n        <button class=\"btn btn-secondary\" ng-click=\"cancel()\">Cancel</button>\n        <button class=\"btn btn-primary\" type=\"submit\">Login</button>\n    </div>\n</form>");
$templateCache.put("core/modals/activation/mobile.html","<!DOCTYPE html>\n<html>\n<head lang=\"en\">\n    <meta charset=\"UTF-8\">\n    <title></title>\n</head>\n<body>\n\n</body>\n</html>");
$templateCache.put("core/summary/borrower/main.html","<header-title title=\"Summary\"></header-title>\n<div class=\"col-md-12 padding-lg bg-ppLightBlue borderless border-radius-md\">\n    <div class=\"row\">\n        <div class=\"col-md-12\">\n            <p>Invoices I am currently Borrowing against</p>\n            <div class=\"table-responsive\">\n                <table class=\"table table-striped table-bordered table-hover table-condensed\">\n                    <thead>\n                        <tr>\n                            <td class=\"capitalise\">Invoice Number</td>\n                            <td class=\"capitalise\">Invoice Date</td>\n                            <td class=\"capitalise\">Submit Date</td>\n                            <td class=\"capitalise\">Due Date</td>\n                            <td class=\"capitalise\">Customer</td>\n                            <td class=\"capitalise\">Invoice Amount</td>\n                            <td class=\"capitalise\">Estimated Fee</td>\n                            <td class=\"capitalise\">Borrowed Amount</td>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            <td>INV-0OO99199993</td>\n                            <td>23 Nov 15</td>\n                            <td>24 Nov 15</td>\n                            <td class=\"text-color-red\">23 Jan 16</td>\n                            <td>F Bloggs Ltd</td>\n                            <td>&pound;7600.00</td>\n                            <td>&pound;273.60</td>\n                            <td>&pound;6840.00</td>\n                        </tr>\n                        <tr>\n                            <td>INV-0OO99199993</td>\n                            <td>23 Nov 15</td>\n                            <td>24 Nov 15</td>\n                            <td class=\"text-color-red\">23 Jan 16</td>\n                            <td>F Bloggs Ltd</td>\n                            <td>&pound;7600.00</td>\n                            <td>&pound;273.60</td>\n                            <td>&pound;6840.00</td>\n                        </tr>\n                        <tr>\n                            <td>INV-0OO99199993</td>\n                            <td>23 Nov 15</td>\n                            <td>24 Nov 15</td>\n                            <td class=\"text-color-red\">23 Jan 16</td>\n                            <td>F Bloggs Ltd</td>\n                            <td>&pound;7600.00</td>\n                            <td>&pound;273.60</td>\n                            <td>&pound;6840.00</td>\n                        </tr>\n                        <tr>\n                            <td colspan=\"4\"></td>\n                            <td><span class=\"font-weight-bold\">Totals</span></td>\n                            <td>&pound;42532.00</td>\n                            <td>&pound;1231.00</td>\n                            <td>&pound;3231.00</td>\n                        </tr>\n                        <tr>\n                            <td colspan=\"4\"></td>\n                            <td><span class=\"font-weight-bold\">Borrow Limit</span></td>\n                            <td colspan=\"3\" class=\"text-align-right\">&pound;52532.00</td>\n                        </tr>\n                        <tr>\n                            <td colspan=\"4\"></td>\n                            <td><span class=\"font-weight-bold\">Available Amount</span></td>\n                            <td colspan=\"3\" class=\"text-align-right\">&pound;10608.00</td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"col-md-6 col-sm-6\">\n            <div class=\"border-light\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Recent Activity</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <div class=\"table-responsive\">\n                        <table class=\"table table-bordered table-condensed\">\n                            <tr>\n                                <td class=\"bg-grey\">19 Sept</td>\n                                <td>\n                                    <div>\n                                        <p class=\"font-weight-bold\">Loan Offer Declined</p>\n                                        <p>PPWHT-016</p>\n                                    </div>\n                                </td>\n                                <td>Customer F</td>\n                                <td>&pound;6,000.00</td>\n                            </tr>\n                            <tr>\n                                <td class=\"bg-grey\">19 Sept</td>\n                                <td>\n                                    <div>\n                                        <p class=\"font-weight-bold\">Loan Offer Declined</p>\n                                        <p>PPWHT-016</p>\n                                    </div>\n                                </td>\n                                <td>Customer F</td>\n                                <td>&pound;6,000.00</td>\n                            </tr>\n                            <tr>\n                                <td class=\"bg-grey\">19 Sept</td>\n                                <td>\n                                    <div>\n                                        <p class=\"font-weight-bold\">Loan Offer Declined</p>\n                                        <p>PPWHT-016</p>\n                                    </div>\n                                </td>\n                                <td>Customer F</td>\n                                <td>&pound;6,000.00</td>\n                            </tr>\n                        </table>\n                        <p class=\"text-align-right\"><a href=\"#\">View last 30 days activity</a></p>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-md-6 col-sm-6\">\n            <div class=\"padding-md border-light\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">My Invoices</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt>Invoices Submitted <span class=\"font-weight-normal\">Awaiting Response</span></dt>\n                        <dd>2</dd>\n                        <dt>Invoices Authorised <span class=\"font-weight-normal\">Loan Offer Waiting</span></dt>\n                        <dd>1</dd>\n                        <dt>Loan Offer Accept <span class=\"font-weight-normal\">Payment Pending</span></dt>\n                        <dd>1</dd>\n                        <dt>Invoices Not Authorised</dt>\n                        <dd>0</dd>\n                    </dl>\n                    <p class=\"text-align-right\"><a href=\"#\">View all invoices in progress</a></p>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>");
$templateCache.put("core/summary/lender/main.html","<header-title title=\"Summary\"></header-title>\n<div class=\"col-md-12 padding-lg bg-ppLightBlue borderless border-radius-md\">\n    <div class=\"row\">\n        <div class=\"col-md-12\">\n            <p>Active Loan Table</p>\n            <div class=\"table-responsive\">\n                <table class=\"table table-striped table-bordered table-hover table-condensed\">\n                    <thead>\n                        <tr>\n                            <td>Lender Loan ID</td>\n                            <td>Expected Return</td>\n                            <td>Payment Due Date</td>\n                            <td>Loan Amount</td>\n                            <td>Risk Level</td>\n                            <td>Duration</td>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            <td>L-Loan-0024</td>\n                            <td>&pound;53.30</td>\n                            <td>23/10/15</td>\n                            <td>&pound;4,100.00</td>\n                            <td>M</td>\n                            <td>30</td>\n                        </tr>\n                        <tr>\n                            <td>L-Loan-0024</td>\n                            <td>&pound;53.30</td>\n                            <td>23/10/15</td>\n                            <td>&pound;4,100.00</td>\n                            <td>M</td>\n                            <td>50</td>\n                        </tr>\n                        <tr>\n                            <td>L-Loan-0024</td>\n                            <td>&pound;53.30</td>\n                            <td>23/10/15</td>\n                            <td>&pound;4,100.00</td>\n                            <td>M</td>\n                            <td>60</td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"col-md-6 col-sm-6\">\n            <div class=\"border-light\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Investment Snapshot</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <dl class=\"dl-horizontal dl-horizontal--dd-right\">\n                        <dt>Current Funding</dt>\n                        <dd>&pound;40,000.00</dd>\n                        <dt>Available to Loan</dt>\n                        <dd>&pound;1,959.00</dd>\n                        <hr class=\"margin-y-xxs\" />\n                        <dt>Amount on Loan</dt>\n                        <dd>&pound;40,000.00</dd>\n                        <dt>Number of Loans</dt>\n                        <dd>&pound;1,959.00</dd>\n                        <hr class=\"margin-y-xxs\" />\n                        <dt>Amount under offer</dt>\n                        <dd>&pound;31,000.00</dd>\n                        <dt>Open offers</dt>\n                        <dd>2</dd>\n                        <hr class=\"margin-y-xxs\" />\n                        <dt>Loans Overdue</dt>\n                        <dd>2</dd>\n                        <dt>Amount Overude</dt>\n                        <dd>&pound;3,456.12</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-md-6 col-sm-6\">\n            <div class=\"padding-md border-light\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Investor Fund Distribution</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt class=\"capitalise\">Limit</dt>\n                        <dd>&pound;40,000</dd>\n                        <dt class=\"capitalise text-color-red\">High</dt>\n                        <dd>&pound;10,000</dd>\n                        <dt class=\"capitalise text-color-amber\">Medium</dt>\n                        <dd>&pound;5,000</dd>\n                        <dt class=\"capitalise text-color-green\">Low</dt>\n                        <dd>&pound;1,000</dd>\n                    </dl>\n                    <hr />\n                    <p><span class=\"font-weight-bold\">Investment Contract Ends:</span> <time datetime=\"2016-05-31\">31/05/2016</time></p>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>");
$templateCache.put("core/summary/manager/main.html","<header-title title=\"Summary\"></header-title>\n<div class=\"col-md-12 padding-lg bg-ppLightBlue borderless border-radius-md\">\n    <div class=\"row\">\n        <div class=\"col-md-4 col-sm-12 col-xs-12 margin-bottom-sm\">\n            <div class=\"border-light\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Borrowers</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt>Total Registered</dt>\n                        <dd>30</dd>\n                        <dt>Total Active</dt>\n                        <dd>21</dd>\n                        <dt>With invoices in Progress</dt>\n                        <dd>2</dd>\n                        <dt>with no current activity</dt>\n                        <dd>1</dd>\n                        <dt>with Active Loans</dt>\n                        <dd>12</dd>\n                        <dt>With Overdue Invoices</dt>\n                        <dd>3</dd>\n                        <dt>In Pre-Registration</dt>\n                        <dd>3</dd>\n                        <dt>Registration in progress</dt>\n                        <dd>3</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-md-4 col-sm-12 col-xs-12 margin-bottom-sm\">\n            <div class=\"border-light\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Borrowers</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt>Total Registered</dt>\n                        <dd>30</dd>\n                        <dt>Total Active</dt>\n                        <dd>21</dd>\n                        <dt>With Active Investments</dt>\n                        <dd>2</dd>\n                        <dt>with Available Funds</dt>\n                        <dd>1</dd>\n                        <dt>with overrun Investments</dt>\n                        <dd>12</dd>\n                        <dt>In Pre-Registration</dt>\n                        <dd>3</dd>\n                        <dt>Registration in progress</dt>\n                        <dd>3</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-md-4 col-sm-12 col-xs-12 margin-bottom-sm\">\n            <div class=\"border-light\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Borrowers</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt>Total Amount Deposited</dt>\n                        <dd>&pound;315,000.00</dd>\n                        <dt>Amount currently Invested</dt>\n                        <dd>&pound;210,650.00</dd>\n                        <dt>Available to Invest</dt>\n                        <dd>&pound;104,350.00</dd>\n                        <hr class=\"margin-x-sm\" />\n                        <dt>Invoices in Progress</dt>\n                        <dd>30</dd>\n                        <dt>Pending Amount</dt>\n                        <dd>&pound;17,890.00</dd>\n                        <hr class=\"margin-x-sm\" />\n                        <dt>Active Loans</dt>\n                        <dd>32</dd>\n                        <dt>Outstanding Amount</dt>\n                        <dd>&pound;52,890.00</dd>\n                        <hr class=\"margin-x-sm\" />\n                        <dt>Invoices Overude</dt>\n                        <dd>3</dd>\n                        <dt>Amount Overdue</dt>\n                        <dd>&pound;10,190.00</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"row margin-top-sm\">\n        <div class=\"col-md-6 col-sm-6 col-xs-12\">\n            <div class=\"border-light\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Active Loans</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt>Total Active Loans</dt>\n                        <dd>12</dd>\n                        <dt>Amount Loaned</dt>\n                        <dd>&pound;151,650.00</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-md-6 col-sm-6 col-xs-12\">\n            <div class=\"padding-md border-light bg-light-gray\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold text-color-primary\">Late Invoice Payments</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt>Total Overdue</dt>\n                        <dd>3</dd>\n                        <dt>Amount Overdue</dt>\n                        <dd>&pound;24,879.09</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>");
$templateCache.put("core/summary/provider/main.html","<header-title title=\"Summary\"></header-title>\n<div class=\"col-md-12 padding-lg bg-ppLightBlue borderless border-radius-md\">\n    <div class=\"row\">\n        <div class=\"col-md-3 col-sm-6 col-xs-12\">\n            <div class=\"border-light\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Invoices and Loans</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt>Invoices in Progress</dt>\n                        <dd>2</dd>\n                        <dt>Pending Amount</dt>\n                        <dd>&pound;17,8000.00</dd>\n                        <hr class=\"margin-y-xxs\" />\n                        <dt>Active Loans</dt>\n                        <dd>2</dd>\n                        <dt>Outstanding Amount</dt>\n                        <dd>&pound;52,350.00</dd>\n                        <hr class=\"margin-y-xxs\" />\n                        <dt>Invoices Overdue</dt>\n                        <dd class=\"text-color-red\">3</dd>\n                        <dt>Amount Overdue</dt>\n                        <dd>&pound;10,000.00</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-md-3 col-sm-6 col-xs-12 margin-bottom-sm\">\n            <div class=\"border-light\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Borrowers</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt>Total Active</dt>\n                        <dd>32</dd>\n                        <dt>With Invoices in Progress</dt>\n                        <dd>9</dd>\n                        <dt>With Active Loans</dt>\n                        <dd>12</dd>\n                        <dt>With Overdue Invoices</dt>\n                        <dd class=\"text-color-red\">3</dd>\n                        <dt class=\"margin-top-xs\">In Pre-Registration</dt>\n                        <dd class=\"margin-top-xs\">1</dd>\n                        <dt>In Registration</dt>\n                        <dd>2</dd>\n                        <dt>Awaiting Authorisation</dt>\n                        <dd>5</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-md-3 col-sm-4\">\n            <div class=\"border-light\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Lenders</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt>Total Active</dt>\n                        <dd>45</dd>\n                        <dt>With Active Investments</dt>\n                        <dd>24</dd>\n                        <dt>With Overrun Investments</dt>\n                        <dd>2</dd>\n                    </dl>\n\n                    <dl class=\"margin-y-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt>In Pre-Registration</dt>\n                        <dd>1</dd>\n                        <dt>In Registration</dt>\n                        <dd>2</dd>\n                        <dt>Awaiting Authorisation</dt>\n                        <dd>6</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-md-3 col-sm-8\">\n            <div class=\"border-light\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Payments</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt class=\"border-bottom-light\">Currently</dt>\n                        <dl>\n                            <dt>Invoice payments expected</dt>\n                            <dd>15</dd>\n                            <dt>Deposit payments expected</dt>\n                            <dd>3</dd>\n                            <dt>Overdue Invoice payments</dt>\n                            <dd>4</dd>\n                            <dt>Overude Deposit Payments</dt>\n                            <dd>0</dd>\n                        </dl>\n                        <dt class=\"border-bottom-light\">In Last Hour</dt>\n                        <dl>\n                            <dt>Received Payments</dt>\n                            <dd>7</dd>\n                            <dt>Invoice Payments Received</dt>\n                            <dd>3</dd>\n                            <dt>Deposit Payments Received</dt>\n                            <dd>3</dd>\n                            <dt>Payments not matched</dt>\n                            <dd>1</dd>\n                        </dl>\n                    </dl>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n<div class=\"col-md-12 padding-lg bg-ppLightBlue borderless border-radius-md\">\n    <div class=\"row margin-top-sm\">\n        <div class=\"col-md-6 col-sm-6 col-xs-12\">\n            <div class=\"border-light bg-light-gray\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Attention Needed</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <ul>\n                        <li>There are <a href=\"#\">5</a> invoices waiting to be authorised.</li>\n                        <li>There are <a href=\"#\">11</a> new clients waiting to be authorised.</li>\n                        <li>There are currently <a href=\"#\">3</a> overdue invoices.</li>\n                        <li>We have <a href=\"#\">1</a> payment that cannot be matched.</li>\n                        <li>We have NOT received <a href=\"#\">2</a> lender deposit payments that are expected</li>\n                    </ul>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-md-6 col-sm-6 col-xs-12\">\n            <div class=\"padding-md border-light bg-light-gray\">\n                <p class=\"border-bottom-light padding-top-sm padding-bottom-sm padding-left-sm font-weight-bold\">Invoices and Loans in Progress: By Status</p>\n                <div class=\"padding-left-sm padding-right-sm\">\n                    <dl class=\"padding-top-sm dl-horizontal dl-horizontal--dd-right\">\n                        <dt>Submitted</dt>\n                        <dd>2</dd>\n                        <dt>Authorised</dt>\n                        <dd>2</dd>\n                        <dt>Loan Accepted</dt>\n                        <dd>2</dd>\n                        <dt>Loan Made</dt>\n                        <dd>2</dd>\n                        <dt>Invoice Paid</dt>\n                        <dd>2</dd>\n                        <dt>Not Matched</dt>\n                        <dd>2</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>");}]);
angular.module("templates.invite", []).run(["$templateCache", function($templateCache) {$templateCache.put("invite/company-confirm.html","<ui-view> <!-- wrap the whole page in a ui-view so it can be switched out with the assessment page -->\n    <header-title title=\"{{confirmTitle}}\"></header-title>\n    <div class=\"container-fluid padding-lg\">\n        <div class=\"col-md-6 col-md-offset-3 padding-y-xl bg-ppLightBlue borderless border-radius-md\">\n            <form name=\"ppForm\"\n                  ng-submit=\"ppForm.$valid && updateClient()\"\n                  novalidate>\n                <div class=\"form-group row padding-y-lg\" ng-show=\"!clientConfirmed\">\n                    <div class=\"col-md-10 col-md-offset-1\n                          padding-y-lg font-size-md text-spaced-sm text-color-ppNavyBlue\">\n                        Please ensure that the company selected is correct.\n                        <br />If this is the correct company, press Continue with this Company.\n                        <br />Otherwise click Not the Right Company to select another.\n                    </div>\n                </div>\n\n                <div class=\"form-group row margin-bottom-md\">\n                    <label for=\"company-name\"\n                           class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right font-weight-bold\">Company\n                        Name</label>\n\n                    <div class=\"col-md-6\">\n                        <input type=\"text\"\n                               id=\"company-name\"\n                               name=\"company-name\"\n                               placeholder=\"Company Name\"\n                               class=\"form-control \"\n                               ng-model=\"vm.client.clientDesc\" disabled>\n                    </div>\n                </div>\n\n                <div class=\"form-group row\">\n                    <label for=\"company-address-1\"\n                           class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Address</label>\n\n                    <div class=\"col-md-6\">\n                        <input type=\"text\"\n                               id=\"company-address-1\"\n                               name=\"company-address-1\"\n                               placeholder=\"Address Line 1\"\n                               class=\"form-control\"\n                               ng-model=\"vm.client.clientData.address.addressLine1\"\n                               disabled>\n                    </div>\n                </div>\n\n                <div class=\"form-group row\">\n                    <label for=\"company-address-2\"\n                           class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\"></label>\n\n                    <div class=\"col-md-6\">\n                        <input type=\"text\"\n                               id=\"company-address-2\"\n                               name=\"company-address-2\"\n                               placeholder=\"Address Line 2\"\n                               class=\"form-control\"\n                               ng-model=\"vm.client.clientData.address.addressLine2\"\n                               disabled>\n                    </div>\n                </div>\n\n                <div class=\"form-group row\">\n                    <label for=\"address-town\"\n                           class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Town /\n                        City</label>\n\n                    <div class=\"col-md-6\">\n                        <input type=\"text\"\n                               id=\"address-town\"\n                               name=\"address-town\"\n                               placeholder=\"Town/City\"\n                               class=\"form-control \"\n                               ng-model=\"vm.client.clientData.address.town\"\n                               disabled>\n                    </div>\n                </div>\n\n                <div class=\"form-group row\">\n                    <label for=\"address-county\"\n                           class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">County</label>\n\n                    <div class=\"col-md-6\">\n                        <input type=\"text\"\n                               id=\"address-county\"\n                               name=\"address-county\"\n                               placeholder=\"County\"\n                               class=\"form-control \"\n                               ng-model=\"vm.client.clientData.address.county\"\n                               disabled>\n                    </div>\n                </div>\n\n                <div class=\"form-group row\">\n                    <label for=\"post-code\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Post\n                        Code</label>\n\n                    <div class=\"col-md-6\">\n                        <input type=\"text\" id=\"post-code\"\n                               name=\"address-post-code\"\n                               placeholder=\"Post Code\"\n                               class=\"form-control \"\n                               ng-model=\"vm.client.clientData.address.postCode\"\n                               disabled>\n                    </div>\n                </div>\n\n                <div class=\"form-group row margin-bottom-md\">\n                    <label for=\"address-country\"\n                           class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Country</label>\n\n                    <div class=\"col-md-6\">\n                        <input type=\"text\" id=\"address-country\"\n                               name=\"address-country\"\n                               placeholder=\"Country\"\n                               class=\"form-control\"\n                               ng-model=\"vm.client.clientData.address.country\"\n                               disabled>\n                    </div>\n                </div>\n\n                <div class=\"form-group row\">\n                    <label for=\"companyStatus\"\n                           class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Company Status</label>\n\n                    <div class=\"col-sm-6\">\n                        <input type=\"text\"\n                               id=\"companyStatus\"\n                               name=\"companyStatus\"\n                               placeholder=\"Status\"\n                               class=\"form-control\"\n                               ng-model=\"vm.client.clientData.companyStatus\"\n                               disabled>\n                    </div>\n                </div>\n\n                <!-- CONFIRM BUTTONS -->\n                <div class=\"form-group row\" ng-show=\"!vm.clientConfirmed\">\n                    <div class=\"col-md-offset-4 col-md-6\">\n                        <button class=\"btn btn-primary btn-block\" type=\"submit\"\n                                ng-click=\"confirmCompany($event);\"\n                                ng-show=\"vm.client.clientData.companyStatus == \'active\'\">\n                            Continue With This Company\n                        </button>\n                        <button class=\"btn btn-link btn-block btn-sm\" ng-click=\"cancelCompanyConfirmation($event)\">\n                            Not The Right Company\n                        </button>\n                    </div>\n                </div>\n\n                <!-- CLIENT DETAILS FIELDS -->\n                <div ng-cloak ng-show=\"vm.clientConfirmed\">\n                    <div ng-if=\"clientType === \'borrower\'\" class=\"form-group row\">\n                        <label for=\"details_form\"\n                               class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\"></label>\n\n                        <div class=\"col-md-6\">\n\n                            <div id=\"details_form\" ng-repeat=\"field in forms.borrowerDetails\">\n                                <dropdown-field field=\"field\"></dropdown-field>\n                            </div>\n                        </div>\n                    </div>\n\n                    <div class=\"form-group row\"\n                         ng-class=\"{ \'has-error\' : ppForm.emailDomain.$invalid && ppForm.$submitted}\">\n                        <label for=\"emailDomain\"\n                               class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Enter the\n                            Email domain for this Client</label>\n\n                        <div class=\"col-md-6\">\n                            <input type=\"text\" id=\"emailDomain\" name=\"emailDomain\"\n                                   placeholder=\"E-mail Domain\"\n                                   class=\"form-control \"\n                                   ng-model=\"vm.client.emailDomain\"\n                                   email-domain\n                                   required>\n\n                            <div ng-messages=\"ppForm.emailDomain.$error\"\n                                 ng-if=\"ppForm.$submitted\"\n                                 class=\"text-color-danger\"\n                                 role=\"alert\">\n                                <div ng-message=\"required\">An E-mail domain is required.</div>\n                                <div ng-message=\"emailDomain\">{{emailDomainInvalid}}</div>\n                            </div>\n                        </div>\n                    </div>\n\n                    <div class=\"form-group row\" ng-class=\"{ \'has-error\' : ppForm.confirmKYC.$invalid && ppForm.$submitted}\">\n                        <label for=\"confirmKYC\"\n                               class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\"></label>\n\n                        <div class=\"col-md-6\">\n                            <label class=\"checkbox-inline user-output\">\n                                <input id=\"confirmKYC\"\n                                       name=\"confirmKYC\"\n                                       type=\"checkbox\"\n                                       ng-model=\"vm.client.clientData.kycamlCheck\"\n                                       required>\n                                Click here to confirm that KYC and AML checks have been completed for this client\n                            </label>\n\n                            <div ng-messages=\"ppForm.confirmKYC.$error\"\n                                 ng-if=\"ppForm.$submitted\"\n                                 class=\"text-color-danger\"\n                                 role=\"alert\">\n                                <div ng-message=\"required\">* Required.</div>\n                            </div>\n                        </div>\n                    </div>\n\n                    <div class=\"form-group row\">\n                        <div class=\"col-md-offset-4 col-md-6\">\n\n                            <!-- if borrower and assessment is not complete -->\n                            <div ng-show=\"clientType==\'borrower\' && !vm.borrowerAssessmentComplete\">\n                                <button class=\"btn btn-primary btn-block\" ng-click=\"ppForm.$valid && updateClient($event, \'assessment\')\">\n                                    Complete Client Risk Analysis\n                                </button>\n                            </div>\n\n                            <!-- if borrower and assessment is complete -->\n                            <div ng-cloak ng-show=\"clientType==\'borrower\' && vm.borrowerAssessmentComplete\">\n                                <button class=\"btn btn-primary btn-block\" ng-click=\"ppForm.$valid && updateClient($event, \'assessment\')\">\n                                    Edit Client Risk Analysis\n                                </button>\n                                <button class=\"btn btn-primary btn-block\" ng-click=\"ppForm.$valid && updateClient($event, \'primary\')\">\n                                    Invite Primary User\n                                </button>\n                            </div>\n\n                            <!-- if lender -->\n                            <div>\n                                <button ng-cloak ng-show=\"clientType==\'lender\'\"\n                                        class=\"btn btn-primary btn-block\"\n                                        ng-click=\"ppForm.$valid && updateClient($event, \'primary\')\">\n                                    Invite a Primary User\n                                </button>\n                            </div>\n\n                        </div>\n                    </div>\n                </div>\n            </form>\n        </div>\n    </div>\n</ui-view>\n\n");
$templateCache.put("invite/company-find.html","<header-title title=\"{{findTitle}}\"></header-title>\n<div class=\"container-fluid padding-lg\">\n  <div class=\"col-md-6 col-md-offset-3 padding-y-xxl padding-y-xl bg-ppLightBlue borderless border-radius-md vertical-middle\">\n\n          <div class=\"form-group row\">\n              <div class=\"col-xs-10 col-xs-offset-1 font-size-md text-spaced-sm text-color-ppNavyBlue\">\n                  <p class=\"text-center\">Enter a Company Number and click <strong>‘Find Company’.</strong>\n                      <br/>We will try to find the company details at companies house.</p>\n              </div>\n          </div>\n\n          <div class=\"form-group row\">\n              <div class=\"col-xs-6 col-xs-offset-3\">\n                  <form name=\"findCompanyForm\"\n                        ng-submit=\"findCompanyForm.$valid && postFindCompany(findCompanyForm)\"\n                        novalidate>\n\n                      <fieldset class=\"form-group padding-bottom-md\"\n                                ng-class=\"{ \'has-error\' : findCompanyForm.number.$invalid && findCompanyForm.$submitted}\">\n                          <input type=\"text\"\n                                 name=\"number\"\n                                 class=\"form-control\"\n                                 title=\"Enter Company Number\"\n                                 placeholder=\"Company Number\"\n                                 ng-model=\"vm.find.number\"\n                                 required\n                                 minlength=\"5\">\n                      </fieldset>\n\n                      <button type=\"submit\" class=\"btn btn-primary btn-block\">Find Company</button>\n\n                      <div ng-messages=\"findCompanyForm.number.$error\"\n                           ng-if=\"findCompanyForm.$submitted\"\n                           class=\"text-color-danger\"\n                           role=\"alert\">\n                          <div ng-message=\"required\">A company number is required.</div>\n                          <div ng-message=\"minlength\">The company number must be at least 5 digits</div>\n                      </div>\n                  </form>\n              </div>\n          </div>\n\n  </div>\n</div>\n\n");
$templateCache.put("invite/index.html","<!-- <header-title title=\"{{title}}\"></header-title>\n<div class=\"container-fluid padding-lg\"> -->\n    <ui-view/>\n<!-- </div> -->\n");
$templateCache.put("invite/invite-primary.html","<!--Invite Primary Borrower-->\n<header-title title=\"{{primaryTitle}}\"></header-title>\n<div class=\"container-fluid padding-lg\">\n  <div class=\"section\">\n      <form name=\"invitePrimaryForm\"\n            class=\"form\"\n            ng-submit=\"invitePrimaryForm.$valid && postInvitePrimary(invitePrimaryForm)\"\n            novalidate>\n\n          <h4>Setup an Invitation for a Primary User</h4>\n          <br/>\n\n          <fieldset class=\"form-group row\"\n                    ng-class=\"{ \'has-error\' : invitePrimaryForm.clientName.$invalid && invitePrimaryForm.$submitted }\">\n              <label for=\"clientName\" class=\"col-sm-4 control-label\">Client Name</label>\n\n              <div class=\"col-sm-6\">\n                  <input type=\"text\"\n                         id=\"clientName\"\n                         name=\"clientName\"\n                         placeholder=\"Client Name\"\n                         class=\"form-control\"\n                         ng-model=\"vm.client.clientName\"\n                         disabled\n                         required>\n\n                  <div ng-messages=\"invitePrimaryForm.clientName.$error\"\n                       ng-if=\"invitePrimaryForm.clientName.$invalid && invitePrimaryForm.$submitted\"\n                       class=\"text-color-danger\"\n                       role=\"alert\">\n                      <div ng-message=\"required\">* Required </div>\n                  </div>\n              </div>\n          </fieldset>\n\n          <fieldset class=\"form-group row\"\n                    ng-class=\"{ \'has-error\' : invitePrimaryForm.firstName.$invalid && invitePrimaryForm.$submitted }\">\n              <label for=\"firstName\" class=\"col-sm-4 control-label\">First Name</label>\n\n              <div class=\"col-sm-6\">\n                  <input type=\"text\"\n                         id=\"firstName\"\n                         name=\"firstName\"\n                         placeholder=\"First Name\"\n                         class=\"form-control\"\n                         ng-model=\"vm.primaryUser.firstName\" required>\n                  <div ng-messages=\"invitePrimaryForm.firstName.$error\"\n                       ng-if=\"invitePrimaryForm.firstName.$invalid && invitePrimaryForm.$submitted\"\n                       class=\"text-color-danger\"\n                       role=\"alert\">\n                      <div ng-message=\"required\">* Required </div>\n                  </div>\n              </div>\n          </fieldset>\n\n          <fieldset class=\"form-group row\"\n                    ng-class=\"{ \'has-error\' : invitePrimaryForm.lastName.$invalid && invitePrimaryForm.$submitted }\">\n              <label for=\"lastName\" class=\"col-sm-4 control-label\">Last Name</label>\n\n              <div class=\"col-sm-6\">\n                  <input type=\"text\"\n                         id=\"lastName\"\n                         name=\"lastName\"\n                         placeholder=\"Last Name\"\n                         class=\"form-control \"\n                         ng-model=\"vm.primaryUser.lastName\" required>\n                  <div ng-messages=\"invitePrimaryForm.lastName.$error\"\n                       ng-if=\"invitePrimaryForm.lastName.$invalid && invitePrimaryForm.$submitted\"\n                       class=\"text-color-danger\"\n                       role=\"alert\">\n                      <div ng-message=\"required\">* Required </div>\n                  </div>\n              </div>\n          </fieldset>\n\n          <fieldset class=\"form-group row\"\n                    ng-class=\"{ \'has-error\' : invitePrimaryForm.email.$invalid && invitePrimaryForm.$submitted }\">\n              <label for=\"email\" class=\"col-sm-4 control-label\">Client Email Address</label>\n              <div class=\"col-sm-6\">\n                  <div class=\"input-group\">\n                      <input type=\"text\"\n                             id=\"email\"\n                             name=\"email\"\n                             placeholder=\"Client Email Address\"\n                             class=\"form-control \"\n                             ng-model=\"vm.primaryUser.emailUsername\"\n                             required>\n                      <div class=\"input-group-addon\">@</div>\n                      <input type=\"text\"\n                             class=\"form-control\"\n                             ng-model=\"vm.client.emailDomain\"\n                             disabled>\n                  </div>\n                  <div ng-messages=\"invitePrimaryForm.email.$error\"\n                       ng-if=\"invitePrimaryForm.email.$invalid && invitePrimaryForm.$submitted\"\n                       class=\"text-color-danger\"\n                       role=\"alert\">\n                      <div ng-message=\"required\">* Required </div>\n                      <div ng-message=\"email\">Must be a valid email</div>\n                  </div>\n              </div>\n          </fieldset>\n\n          <fieldset class=\"form-group row\">\n              <label class=\"col-sm-4 control-label\"></label>\n\n              <div class=\"col-sm-6 user-output\">\n                  <span>The role for this primary user will be set to Administrator</span>\n              </div>\n          </fieldset>\n\n          <fieldset class=\"form-group row\">\n              <label for=\"send-invitation\" class=\"col-sm-4 control-label\"> </label>\n\n              <div class=\"col-sm-6 reg-buttons\">\n                  <button class=\"btn btn-default\" ng-click=\"cancelInvitePrimary($event)\">\n                      Cancel\n                  </button>\n                  <button id=\"send-invitation\" class=\"btn btn-primary\" type=\"submit\">\n                      Send Invitation\n                  </button>\n              </div>\n          </fieldset>\n      </form>\n  </div>\n</div>");
$templateCache.put("invite/borrower/assessment.html","<header-title title=\"{{assessmentTitle}}\"></header-title>\n<div class=\"container-fluid padding-lg\">\n    <div class=\"row margin-bottom-md\">\n        <div class=\"col-md-12\">\n            <p class=\"text-center\">Tell us a little bit about the client and their customers</p>\n        </div>\n    </div>\n\n    <div class=\"row margin-bottom-md\">\n        <div class=\"col-md-12\">\n\n            <form name=\"ppForm\" novalidate>\n                <div ng-repeat=\"field in forms.borrowerManagerAssessment\">\n                    <dropdown-field field=\"field\" namespace=\"foo\"></dropdown-field>\n                </div>\n                <div>\n                    <p><strong>How would you rate the business as a potential Borrower on the Peerpay service? The higher the score the less likely that this client will incur overdue invoices.</strong></p>\n\n                    <div class=\"margin-bottom-md row\">\n                        <label class=\"col-sm-4\">Borrower rating</label>\n                        <star-rating ng-model=\"vm.client.clientData.borrowerRating\" readonly=\"vm.ratingPrevent\" on-rating-select=\"rate(rating)\"></star-rating>\n                        <div class=\"col-sm-4\">\n                            <label class=\"checkbox-inline\"><input type=\"checkbox\" ng-click=\"noRating()\" ng-model=\"vm.ratingPrevent\" /> Can\'t rate<label>\n                        </div>\n                        <div ng-if=\"ppForm.$submitted\"\n                           class=\"text-color-danger col-md-12 col-sm-12\"\n                           role=\"alert\">\n                          <p ng-show=\"ratingRequired\">Borrower Rating is required</p>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"form-group row\">\n                    <label for=\"invite-primary\" class=\"col-xs-2 control-label\"> </label>\n                    <div class=\"col-xs-8\">\n                        <button class=\"btn btn-default\" ng-click=\"cancelAssessment($event)\">\n                            Cancel\n                        </button>\n                        <button class=\"btn btn-primary\" type=\"submit\" ng-click=\"ppForm.$valid && putAssessment(ppForm)\">\n                            Save\n                        </button>\n                    </div>\n                </div>\n            </form>\n        </div>\n    </div>\n</div>");
$templateCache.put("invite/lender/individual.html","<header-title title=\"{{individualTitle}}\"></header-title>\n<div class=\"container-fluid padding-lg\">\n  <div class=\"col-md-6 col-md-offset-3 padding-y-xl bg-ppLightBlue borderless border-radius-md\">\n      <form name=\"lenderIndividualForm\" ng-submit=\"lenderIndividualForm.$valid && updateClient()\" novalidate>\n          <div class=\"form-group row padding-y-lg\">\n              <div class=\"col-md-10 col-md-offset-1\n                          padding-y-lg font-size-md text-spaced-sm text-color-ppNavyBlue\">\n                  Please complete the following details.\n              </div>\n          </div>\n\n          <div class=\"form-group row margin-bottom-md\" ng-class=\"{ \'has-error\' : lenderIndividualForm.clientName.$invalid && lenderIndividualForm.$submitted}\">\n              <label for=\"clientName\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right font-weight-bold\">Lender Name</label>\n              <div class=\"col-md-6\">\n                  <input type=\"text\" id=\"clientName\" name=\"clientName\"\n                         placeholder=\"Lender name\"\n                         class=\"form-control \"\n                         ng-model=\"vm.client.clientName\"\n                         required>\n                  <div ng-messages=\"lenderIndividualForm.clientName.$error\"\n                       ng-if=\"lenderIndividualForm.$submitted\"\n                       class=\"text-color-danger\"\n                       role=\"alert\">\n                      <div ng-message=\"required\">The lender name is required.</div>\n                  </div>\n              </div>\n          </div>\n\n          <div class=\"form-group row\" ng-class=\"{ \'has-error\' : lenderIndividualForm.companyNumber.$invalid && lenderIndividualForm.$submitted}\">\n              <label for=\"clientNumber\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">NI Number</label>\n              <div class=\"col-md-6\">\n                  <input type=\"text\" id=\"clientNumber\" name=\"clientNumber\"\n                         placeholder=\"NI number\"\n                         class=\"form-control \"\n                         ng-model=\"vm.client.clientNumber\"\n                         required>\n                  <div ng-messages=\"lenderIndividualForm.companyNumber.$error\"\n                       ng-if=\"lenderIndividualForm.$submitted\"\n                       class=\"text-color-danger\"\n                       role=\"alert\">\n                      <div ng-message=\"required\">The NI number is required.</div>\n                  </div>\n              </div>\n          </div>\n\n          <div class=\"form-group row\" ng-class=\"{ \'has-error\' : lenderIndividualForm.addressLine1.$invalid && lenderIndividualForm.$submitted}\">\n              <label for=\"addressLine1\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Address</label>\n              <div class=\"col-md-6\">\n                  <input type=\"text\" id=\"addressLine1\" name=\"addressLine1\"\n                         placeholder=\"address line 1\"\n                         class=\"form-control \"\n                         ng-model=\"vm.client.clientData.address.addressLine1\"\n                         required>\n                  <div ng-messages=\"lenderIndividualForm.addressLine1.$error\"\n                       ng-if=\"lenderIndividualForm.$submitted\"\n                       class=\"text-color-danger\"\n                       role=\"alert\">\n                      <div ng-message=\"required\">The address line is required.</div>\n                  </div>\n              </div>\n          </div>\n\n          <div class=\"form-group row\" ng-class=\"{ \'has-error\' : lenderIndividualForm.addressLine2.$invalid && lenderIndividualForm.$submitted}\">\n              <label for=\"addressLine2\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\"></label>\n              <div class=\"col-md-6\">\n                  <input type=\"text\" id=\"addressLine2\" name=\"addressLine2\"\n                         placeholder=\"address line 2\"\n                         class=\"form-control \"\n                         ng-model=\"vm.client.clientData.address.addressLine2\"\n                         required>\n                  <div ng-messages=\"lenderIndividualForm.addressLine2.$error\"\n                       ng-if=\"lenderIndividualForm.$submitted\"\n                       class=\"text-color-danger\"\n                       role=\"alert\">\n                      <div ng-message=\"required\">The address line is required.</div>\n                  </div>\n              </div>\n          </div>\n\n          <div class=\"form-group row\" ng-class=\"{ \'has-error\' : lenderIndividualForm.town.$invalid && lenderIndividualForm.$submitted}\">\n              <label for=\"town\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Town / City</label>\n              <div class=\"col-md-6\">\n                  <input type=\"text\" id=\"town\" name=\"town\"\n                         placeholder=\"town / city\"\n                         class=\"form-control \"\n                         ng-model=\"vm.client.clientData.address.town\"\n                         required>\n                  <div ng-messages=\"lenderIndividualForm.town.$error\"\n                       ng-if=\"lenderIndividualForm.$submitted\"\n                       class=\"text-color-danger\"\n                       role=\"alert\">\n                      <div ng-message=\"required\">The town/city is required.</div>\n                  </div>\n              </div>\n          </div>\n\n          <div class=\"form-group row\" ng-class=\"{ \'has-error\' : lenderIndividualForm.county.$invalid && lenderIndividualForm.$submitted}\">\n              <label for=\"county\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">County</label>\n              <div class=\"col-md-6\">\n                  <input type=\"text\" id=\"county\" name=\"county\"\n                         placeholder=\"county\"\n                         class=\"form-control \"\n                         ng-model=\"vm.client.clientData.address.county\"\n                         required>\n                  <div ng-messages=\"lenderIndividualForm.county.$error\"\n                       ng-if=\"lenderIndividualForm.$submitted\"\n                       class=\"text-color-danger\"\n                       role=\"alert\">\n                      <div ng-message=\"required\">The county is required.</div>\n                  </div>\n              </div>\n          </div>\n\n          <div class=\"form-group row\" ng-class=\"{ \'has-error\' : lenderIndividualForm.postCode.$invalid && lenderIndividualForm.$submitted}\">\n              <label for=\"postCode\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Post Code</label>\n              <div class=\"col-md-6\">\n                  <input type=\"text\" id=\"postCode\" name=\"postCode\"\n                         placeholder=\"post code\"\n                         class=\"form-control \"\n                         ng-model=\"vm.client.clientData.address.postCode\"\n                         required>\n                  <div ng-messages=\"lenderIndividualForm.postCode.$error\"\n                       ng-if=\"lenderIndividualForm.$submitted\"\n                       class=\"text-color-danger\"\n                       role=\"alert\">\n                      <div ng-message=\"required\">The post code is required.</div>\n                  </div>\n              </div>\n          </div>\n\n          <div class=\"form-group row margin-bottom-md\" ng-class=\"{ \'has-error\' : lenderIndividualForm.country.$invalid && lenderIndividualForm.$submitted}\">\n              <label for=\"country\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Country</label>\n              <div class=\"col-md-6\">\n                  <input type=\"text\" id=\"country\" name=\"country\"\n                         placeholder=\"country\"\n                         class=\"form-control \"\n                         ng-model=\"vm.client.clientData.address.country\"\n                         required>\n                  <div ng-messages=\"lenderIndividualForm.country.$error\"\n                       ng-if=\"lenderIndividualForm.$submitted\"\n                       class=\"text-color-danger\"\n                       role=\"alert\">\n                      <div ng-message=\"required\">The country is required.</div>\n                  </div>\n              </div>\n          </div>\n\n          <div class=\"form-group row\" ng-class=\"{ \'has-error\' : lenderIndividualForm.emailDomain.$invalid && lenderIndividualForm.$submitted}\">\n              <label for=\"emailDomain\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Client E-mail Domain</label>\n              <div class=\"col-md-6\">\n                  <input type=\"text\" id=\"emailDomain\" name=\"emailDomain\"\n                         placeholder=\"E-mail Domain\"\n                         class=\"form-control\"\n                         ng-model=\"vm.client.emailDomain\"\n                         lender-type=\"individual\"\n                         email-domain\n                         required>\n                  <div ng-messages=\"lenderIndividualForm.emailDomain.$error\"\n                       ng-if=\"lenderIndividualForm.$submitted\"\n                       class=\"text-color-danger\"\n                       role=\"alert\">\n                      <div ng-message=\"required\">An E-mail domain is required.</div>\n                      <div ng-message=\"emailDomain\">{{emailDomainInvalid}}</div>\n                  </div>\n              </div>\n          </div>\n\n          <div class=\"form-group row margin-bottom-md\">\n              <label for=\"confirmKYC\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\"></label>\n              <div class=\"col-md-6\">\n                  <label class=\"checkbox-inline user-output\">\n                      <input id=\"confirmKYC\"\n                             name=\"confirmKYC\"\n                             type=\"checkbox\"\n                             ng-model=\"vm.client.kycamlCheck\"\n                             required>\n                      Click here to confirm that KYC and AML checks have been completed for this client\n                  </label>\n                  <div ng-messages=\"lenderIndividualForm.confirmKYC.$error\"\n                       ng-if=\"lenderIndividualForm.$submitted\"\n                       class=\"text-color-danger\"\n                       role=\"alert\">\n                      <div ng-message=\"required\">* Required.</div>\n                  </div>\n              </div>\n          </div>\n\n          <!-- CONFIRM BUTTONS -->\n          <div class=\"form-group row\" ng-show=\"!clientConfirmed\">\n              <div class=\"col-md-offset-4 col-md-6\">\n                  <button class=\"btn btn-primary btn-block\" ng-click=\"lenderIndividualForm.$valid && updateClient($event, \'primary\')\">\n                      Invite Primary User\n                  </button>\n              </div>\n          </div>\n\n      </form>\n\n  </div>\n</div>");}]);
angular.module("templates.modals", []).run(["$templateCache", function($templateCache) {$templateCache.put("modals/clients/borrower/authorize-client.html","<div class=\"modal-header\">\n    <button ng-click=\"cancelAuthorise($event)\" type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n        <span class=\"sr-only\">Close</span>\n    </button>\n    <h4 class=\"modal-title\">Authorise Client</h4>\n</div>\n<form name=\"ppForm\" ng-submit=\"ppForm.$valid && completeAuthorise(ppForm)\" novalidate>\n    <div class=\"modal-body\">\n        <p class=\"font-weight-bold\">Now enter a borrow limit and select a service transaction account to complete authorisation of this client.</p>\n\n        <div ng-repeat=\"field in forms.clientAuthorise\">\n            <dropdown-field field=\"field\"></dropdown-field>\n        </div>\n\n    </div>\n    <div class=\"modal-footer\">\n        <button class=\"btn btn-secondary\" ng-click=\"cancelAuthorise($event)\">Cancel</button>\n        <button class=\"btn btn-primary\" type=\"submit\">Complete Authorise</button>\n    </div>\n</form>\n");
$templateCache.put("modals/clients/borrower/reject-client.html","<div class=\"modal-header\">\n    <button ng-click=\"cancelRejection($event)\" type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n        <span class=\"sr-only\">Close</span>\n    </button>\n    <h4 class=\"modal-title\">Reject Client</h4>\n</div>\n<form name=\"ppForm\" ng-submit=\"ppForm.$valid && completeRejection(ppForm)\" novalidate>\n    <div class=\"modal-body\">\n\n        <p class=\"font-weight-bold\">You now need to choose the reason you have rejected this borrower request</p>\n\n        <div ng-repeat=\"field in forms.clientAuthoriseReject\">\n            <dropdown-field field=\"field\"></dropdown-field>\n        </div>\n\n        <div class=\"form-group row margin-bottom-md\">\n            <label for=\"additional-rejection-info\"\n                   class=\"col-md-12 form-control-label text-spaced-xs font-weight-bold\">Enter any additional information here</label>\n\n            <div class=\"col-md-12\">\n                <textarea\n                   id=\"additionalRejectionInfo\"\n                   name=\"additionalRejectionInfo\"\n                   class=\"form-control \"\n                   ng-model=\"vm.client.clientData.additionalRejectionInfo\">\n                </textarea>\n            </div>\n        </div>\n\n    </div>\n    <div class=\"modal-footer\">\n        <button class=\"btn btn-secondary\" ng-click=\"cancelRejection($event)\">Cancel</button>\n        <button class=\"btn btn-primary\" type=\"submit\">Complete Rejection</button>\n    </div>\n</form>\n");}]);
angular.module("templates.register", []).run(["$templateCache", function($templateCache) {$templateCache.put("register/accept.html","<!--Header-->\n<div id=\"header\">\n    <section class=\"container-fluid bg-primary\">\n        <div class=\"row padding-lg\">\n            <div class=\"col-xs-12\">\n                <!--Title-->\n                <h3>Accept Invite</h3>\n            </div>\n        </div>\n    </section>\n</div>\n\n<div class=\"container-fluid\">\n    <div class=\"row margin-y-lg\">\n        <div class=\"col-sm-4 col-sm-offset-4\">\n            <div class=\"padding-md margin-bottom-md bg-white border-light border-radius-md\">\n                <img ng-src=\"{{logo}}\" class=\"img-background-fit height-max-80\" alt=\"Responsive image\"/>\n            </div>\n\n            <div class=\"text-center\">\n                <h4><strong>{{vm.invitingUser.clientDesc}}</strong> would like you to join PeerPay</h4>\n                <div class=\"margin-x-md margin-y-lg\">\n                    <button ng-click=\"acceptInvitation()\" class=\"btn btn-info btn-lg\">Accept Invitation</button>\n                </div>\n                <p><i>This invitation will expire on {{formatDate(vm.linkExpiry) | date: \'EEEE d MMMM y\'}} at {{formatDate(vm.linkExpiry) | date: \'h:mm a\'}}</i></p>\n            </div>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("register/details.html","<section class=\"container-fluid bg-primary\">\n    <div class=\"row padding-lg\">\n        <div class=\"col-xs-12\">\n            <!--Title-->\n            <h3>Account Setup</h3>\n        </div>\n    </div>\n</section>\n\n<div class=\"container-fluid\">\n    <div class=\"row\">\n        <div class=\"container bg-beige\">\n            <div class=\"row\">\n                <div class=\"col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2 margin-y-lg\">\n                    <h4 class=\"margin-bottom-md\">Please follow the steps below to create your account on PeerPay</h4>\n                </div>\n            </div>\n\n            <div class=\"row\">\n                <div class=\"col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2\">\n\n                    <form name=\"registerDetailsForm\"\n                          ng-submit=\"registerDetailsForm.$valid && getEmailToken(registerDetailsForm)\"\n                          novalidate>\n\n                        <!-- username -->\n                        <fieldset class=\"row\"\n                                  ng-class=\"{ \'has-error\' : registerDetailsForm.username.$invalid && registerDetailsForm.$dirty}\">\n                            <div class=\"col-md-4\">\n                                <div class=\"form-group\">\n                                    <label for=\"username\">Username</label>\n                                </div>\n                            </div>\n                            <div class=\"col-md-4\">\n                                <div class=\"form-group\">\n                                    <input type=\"text\"\n                                           name=\"username\"\n                                           class=\"form-control\"\n                                           id=\"username\"\n                                           ng-model=\"vm.username\"\n                                           placeholder=\"Username\"\n                                           required>\n                                </div>\n                                <div ng-messages=\"registerDetailsForm.username.$error\"\n                                     ng-if=\"registerDetailsForm.$dirty\"\n                                     class=\"text-color-danger\"\n                                     role=\"alert\">\n                                    <div ng-message=\"required\">* Required </div>\n                                </div>\n                            </div>\n\n                            <div class=\"col-md-4\">\n                                <div class=\"form-group\">\n                                    <p class=\"font-size-sm\">This will be used to login and cannot be changed later.</p>\n                                </div>\n                            </div>\n                        </fieldset>\n\n                        <!-- firstName -->\n                        <fieldset class=\"row\"\n                                  ng-class=\"{ \'has-error\' : registerDetailsForm.firstName.$invalid && registerDetailsForm.$dirty}\">\n                            <div class=\"col-md-4\">\n                                <div class=\"form-group\">\n                                    <label for=\"firstName\">First Name</label>\n                                </div>\n                            </div>\n                            <div class=\"col-md-4\">\n                                <div class=\"form-group\">\n                                    <input type=\"text\"\n                                           name=\"firstName\"\n                                           class=\"form-control\"\n                                           id=\"firstName\"\n                                           ng-model=\"vm.firstName\"\n                                           placeholder=\"First Name\"\n                                           required>\n                                </div>\n                                <div ng-messages=\"registerDetailsForm.firstName.$error\"\n                                     ng-if=\"registerDetailsForm.$dirty\"\n                                     class=\"text-color-danger\"\n                                     role=\"alert\">\n                                    <div ng-message=\"required\">* Required </div>\n                                </div>\n                            </div>\n\n                            <div class=\"col-md-4\">\n                                <div class=\"form-group\">\n                                    <p class=\"font-size-sm\">Please ensure your first and last name are correct.</p>\n                                </div>\n                            </div>\n                        </fieldset>\n\n                        <!-- lastName -->\n                        <fieldset class=\"row\"\n                                  ng-class=\"{ \'has-error\' : registerDetailsForm.lastName.$invalid && registerDetailsForm.$dirty}\">\n                            <div class=\"col-md-4\">\n                                <div class=\"form-group\">\n                                    <label for=\"lastName\">Last Name</label>\n                                </div>\n                            </div>\n                            <div class=\"col-md-4\">\n                                <div class=\"form-group\">\n                                    <input type=\"text\"\n                                           name=\"lastName\"\n                                           class=\"form-control\"\n                                           id=\"lastName\"\n                                           ng-model=\"vm.lastName\"\n                                           placeholder=\"Last Name\"\n                                           required>\n                                </div>\n                                <div ng-messages=\"registerDetailsForm.lastName.$error\"\n                                     ng-if=\"registerDetailsForm.$dirty\"\n                                     class=\"text-color-danger\"\n                                     role=\"alert\">\n                                    <div ng-message=\"required\">* Required </div>\n                                </div>\n                            </div>\n                        </fieldset>\n\n                        <!-- email -->\n                        <fieldset class=\"row\">\n                            <div class=\"col-md-4\">\n                                <div class=\"form-group\">\n                                    <label for=\"email\">E-mail</label>\n                                </div>\n                            </div>\n                            <div class=\"col-md-4\">\n                                <div class=\"form-group\">\n                                    <input type=\"text\"\n                                           name=\"email\"\n                                           class=\"form-control\"\n                                           id=\"email\"\n                                           ng-model=\"vm.email\"\n                                           placeholder=\"Email Address\"\n                                           disabled\n                                           required>\n                                </div>\n                            </div>\n                        </fieldset>\n\n\n                        <!-- password -->\n                        <fieldset class=\"row\"\n                                  ng-class=\"{ \'has-error\' : registerDetailsForm.password.$invalid && registerDetailsForm.$dirty}\">\n                            <div class=\"col-md-4\">\n                                <div class=\"form-group\">\n                                    <label for=\"password\">Create Password</label>\n                                </div>\n                            </div>\n                            <div class=\"col-md-4\">\n                                <div class=\"form-group\">\n                                    <input type=\"password\"\n                                           name=\"password\"\n                                           class=\"form-control\"\n                                           id=\"password\"\n                                           placeholder=\"Password\"\n                                           ng-model=\"vm.password\"\n                                           minlength=\"8\"\n                                           maxlength=\"16\"\n                                           ng-pattern=\"/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\\d]){1,})(?=(.*[\\W]){1,})(?!.*\\s).{8,16}$/\"\n                                           required>\n                                </div>\n                                <div ng-messages=\"registerDetailsForm.password.$error\"\n                                     ng-if=\"registerDetailsForm.$dirty\"\n                                     class=\"text-color-danger\"\n                                     role=\"alert\">\n                                    <div ng-message=\"required\">* Required </div>\n                                    <div ng-message=\"minlength\">The password confirmation field must be at least 8 characters </div>\n                                    <div ng-message=\"maxlength\">The password confirmation field should not be more than 16 characters </div>\n                                    <div ng-message=\"pattern\">You must include one uppercase, one number and one special symbol</div>                                </div>\n                            </div>\n                            <div class=\"col-md-4\">\n                                 <div uib-popover=\"The password must be at least 8 characters long and\n                                        contain at least one number and one special character.\"\n                                         popover-trigger=\"mouseenter\"\n                                         popover-animation=\"true\">\n                                     <span class=\"fa fa-info-circle font-size-lg\" ></span>\n                                 </div>\n                                <!--\n                                <div class=\"form-group\">\n                                    <p class=\"font-size-sm\">Must be at least 8 characters long and\n                                        contain at least one number.</p>\n                                </div>\n                                -->\n                            </div>\n                        </fieldset>\n\n                        <!-- confirm password -->\n                        <fieldset class=\"row\"\n                                  ng-class=\"{ \'has-error\' : registerDetailsForm.passwordConfirmation.$invalid && !registerDetailsForm.$dirty}\">\n                            <div class=\"col-md-4\">\n                                <div class=\"form-group\">\n                                    <label for=\"passwordConfirmation\">Confirm Password</label>\n                                </div>\n                            </div>\n                            <div class=\"col-md-4\">\n                                <div class=\"form-group\">\n                                    <input type=\"password\"\n                                           name=\"passwordConfirmation\"\n                                           class=\"form-control\"\n                                           id=\"passwordConfirmation\"\n                                           placeholder=\"Password\"\n                                           ng-model=\"vm.passwordConfirmation\"\n                                           minlength=\"8\"\n                                           maxlength=\"16\"\n                                           ng-pattern=\"/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\\d]){1,})(?=(.*[\\W]){1,})(?!.*\\s).{8,16}$/\"\n                                           required\n                                           compare-to=\"vm.password\">\n                                </div>\n                                <div ng-messages=\"registerDetailsForm.passwordConfirmation.$error\"\n                                     ng-if=\"registerDetailsForm.$dirty\"\n                                     class=\"text-color-danger\"\n                                     role=\"alert\">\n                                    <div ng-message=\"required\">* Required </div>\n                                    <div ng-message=\"minlength\">The password confirmation field must be at least 8 characters </div>\n                                    <div ng-message=\"maxlength\">The password confirmation field should not be more than 16 characters </div>\n                                    <div ng-message=\"pattern\">You must include one uppercase, one number and one special symbol</div>\n                                    <div ng-message=\"compareTo\">Must match the previous entry</div>\n                                </div>\n                            </div>\n                        </fieldset>\n\n                        <!-- accept terms -->\n                        <div ng-show=\"!vm.acceptTerms\">\n                            <div class=\"row\">\n                                <div class=\"col-md-12 text-center\">\n                                    <div>\n                                        <button ng-click=\"acceptTerms(registerDetailsForm, $event)\"\n                                                class=\"btn btn-primary\">Continue</button>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n\n                        <!-- submit -->\n                        <div ng-cloak ng-show=\"vm.acceptTerms\">\n                            <div class=\"row\">\n                                <div class=\"col-md-12 text-center\">\n                                    <div>\n                                        <p>Now we need to validate your details. On clicking the button below, a\n                                        token will be sent to your email address. The token is valid for 3 minutes.</p>\n                                        <button type=\"submit\" class=\"btn btn-primary\">Send token</button>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </form>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("register/email.html","<!--Header-->\n<div id=\"header\">\n    <section class=\"container-fluid bg-primary\">\n        <div class=\"row padding-lg\">\n            <div class=\"col-xs-12\">\n                <!--Title-->\n                <h3>We just sent you an email!</h3>\n                <p>Please check your email account: {{vm.email}}</p>\n            </div>\n        </div>\n    </section>\n</div>\n\n<div class=\"container\">\n    <div class=\"row margin-y-lg\">\n        <div class=\"col-xs-12\">\n\n            <form name=\"activateEmailForm\" class=\"form-inline\"\n                    ng-submit=\"activateEmailForm.$valid && postActivateEmail(activateEmailForm)\"\n                    novalidate>\n\n                <fieldset class=\"form-group row\"\n                          ng-class=\"{ \'has-error\' : activateEmailForm.email.$invalid && activateEmailForm.$submitted}\">\n                    <div class=\"col-md-4\">\n                        <label for=\"email\">Verification token</label>\n                    </div>\n                    <div class=\"col-md-8\">\n                        <div class=\"form-group\">\n                            <div class=\"input-group\" id=\"email\">\n                                <input type=\"text\"\n                                       class=\"form-control\"\n                                       id=\"valKey1\"\n                                       name=\"valKey1\"\n                                       maxlength=\"3\"\n                                       placeholder=\"XXX\"\n                                       ng-model=\"vm.emailToken.secret.a\"\n                                       tabindex=\"1\"\n                                       auto-focus\n                                       required>\n                                <div class=\"input-group-addon\">-</div>\n                                <input type=\"text\"\n                                       class=\"form-control\"\n                                       id=\"valKey2\"\n                                       name=\"valKey2\"\n                                       maxlength=\"3\"\n                                       placeholder=\"XXX\"\n                                       ng-model=\"vm.emailToken.secret.b\"\n                                       tabindex=\"2\"\n                                       auto-focus\n                                       required>\n                                <div class=\"input-group-addon\">-</div>\n                                <input type=\"text\"\n                                       class=\"form-control\"\n                                       id=\"valKey3\"\n                                       name=\"valKey3\"\n                                       maxlength=\"3\"\n                                       placeholder=\"XXX\"\n                                       ng-model=\"vm.emailToken.secret.c\"\n                                       tabindex=\"3\"\n                                       auto-focus\n                                       required>\n                                <div class=\"input-group-addon\">-</div>\n                                <input type=\"text\"\n                                       class=\"form-control\"\n                                       id=\"valKey4\"\n                                       name=\"valKey4\"\n                                       maxlength=\"3\"\n                                       placeholder=\"XXX\"\n                                       ng-model=\"vm.emailToken.secret.d\"\n                                       tabindex=\"4\"\n                                       auto-focus\n                                       required>\n                            </div>\n                        </div>\n\n                        <div ng-show=\"(activateEmailForm.valKey1.$invalid ||\n                                activateEmailForm.valKey2.$invalid ||\n                                activateEmailForm.valKey3.$invalid ||\n                                activateEmailForm.valKey4.$invalid)\n                                && activateEmailForm.$submitted\"\n                             class=\"text-color-danger\"\n                             role=\"alert\">\n                            <p>Please input the the 12 digit code we emailed you. </p>\n                        </div>\n                    </div>\n                </fieldset>\n\n                <!-- <a ng-click=\"resendToken($event, \'email\');\">Resend token</a> -->\n\n                <div class=\"margin-x-md margin-y-lg\">\n                    <button type=\"submit\" class=\"btn btn-primary btn-lg\">Check email token</button>\n                </div>\n\n            </form>\n\n        </div>\n    </div>\n</div>\n");
$templateCache.put("register/mobile.html","<!--Header-->\n<div id=\"header\">\n    <section class=\"container-fluid bg-primary\">\n        <div class=\"row padding-lg\">\n            <div class=\"col-xs-12\">\n                <!--Title-->\n                <h3>Register your mobile number</h3>\n            </div>\n        </div>\n    </section>\n</div>\n\n<div class=\"container\">\n    <div class=\"row margin-y-lg\">\n        <div class=\"col-xs-12\">\n\n            <!-- mobile number -->\n            <div ng-show=\"!mobileConfirmed\">\n                <form name=\"activateMobileForm\" class=\"form-inline\"\n                      ng-submit=\"activateMobileForm.$valid && getMobileToken(activateMobileForm)\"\n                      novalidate>\n                    <p>Great! Your email address has been validated. Now we need to do the same with your mobile.\n                    On clicking the button below a token will be sent to your mobile. The token is valid for 3 minutes.</p>\n                    <fieldset class=\"row\"\n                              ng-class=\"{ \'has-error\' : activateMobileForm.mobile_number.$invalid && activateMobileForm.$submitted}\">\n\n                        <div class=\"col-md-4\">\n                            <div class=\"form-group\">\n                                <label for=\"mobile_number\">Mobile</label>\n                            </div>\n                        </div>\n                        <div class=\"col-md-4\">\n                            <div class=\"form-group\">\n                                <input name=\"mobile_number\"\n                                       id=\"mobile_number\"\n                                       type=\"text\"\n                                       ng-model=\"vm.mobile\"\n                                       placeholder=\"mobile number\"\n                                       ng-pattern=\"/^((0|\\+44)7(5|6|7|8|9){1}\\d{2}\\s?\\d{6})$/\"\n                                       required>\n                            </div>\n                            <div ng-messages=\"activateMobileForm.mobile_number.$error\"\n                                 ng-if=\"activateMobileForm.$submitted && activateMobileForm.mobile_number.$invalid\"\n                                 class=\"text-color-danger\"\n                                 role=\"alert\">\n                                <div ng-message=\"required\">* Required </div>\n                                <div ng-pattern=\"pattern\">Must be a valid UK mobile phone</div>\n                            </div>\n                        </div>\n                    </fieldset>\n\n                    <div class=\"margin-x-md margin-y-lg\">\n                        <button class=\"btn btn-primary btn-lg\"type=\"submit\">Send text message</button>\n                    </div>\n\n                </form>\n            </div>\n\n            <!-- mobile secret -->\n            <div ng-show=\"mobileConfirmed\">\n                <form name=\"postMobileActivationForm\" class=\"form-inline\"\n                      ng-submit=\"postMobileActivationForm.$valid && postActivateMobile(postMobileActivationForm)\"\n                      novalidate>\n                    <fieldset class=\"form-group row\"\n                              ng-class=\"{ \'has-error\' : postMobileActivationForm.mobile_secret.$invalid && postMobileActivationForm.$submitted}\">\n                        <div class=\"col-md-4\">\n                                <label for=\"mobile_secret\">Verification token</label>\n                        </div>\n                        <div class=\"col-md-8\">\n                            <div class=\"form-group\">\n                                <div class=\"input-group\" id=\"mobile_secret\">\n                                    <input type=\"text\"\n                                           class=\"form-control\"\n                                           id=\"valKey1\"\n                                           name=\"valKey1\"\n                                           maxlength=\"3\"\n                                           placeholder=\"XXX\"\n                                           ng-model=\"vm.mobileToken.secret.a\"\n                                           auto-focus\n                                           tabindex=\"1\"\n                                           required>\n                                    <div class=\"input-group-addon\">-</div>\n                                    <input type=\"text\"\n                                           class=\"form-control\"\n                                           id=\"valKey2\"\n                                           name=\"valKey2\"\n                                           maxlength=\"3\"\n                                           placeholder=\"XXX\"\n                                           ng-model=\"vm.mobileToken.secret.b\"\n                                           auto-focus\n                                           tabindex=\"2\"\n                                           required>\n                                    <div class=\"input-group-addon\">-</div>\n                                    <input type=\"text\"\n                                           class=\"form-control\"\n                                           id=\"valKey3\"\n                                           name=\"valKey3\"\n                                           maxlength=\"3\"\n                                           placeholder=\"XXX\"\n                                           ng-model=\"vm.mobileToken.secret.c\"\n                                           auto-focus\n                                           tabindex=\"3\"\n                                           required>\n                                    <div class=\"input-group-addon\">-</div>\n                                    <input type=\"text\"\n                                           class=\"form-control\"\n                                           id=\"valKey4\"\n                                           name=\"valKey4\"\n                                           maxlength=\"3\"\n                                           placeholder=\"XXX\"\n                                           ng-model=\"vm.mobileToken.secret.d\"\n                                           auto-focus\n                                           tabindex=\"4\"\n                                           required>\n                                </div>\n                            </div>\n\n                            <div ng-show=\"(postMobileActivationForm.valKey1.$invalid ||\n                                postMobileActivationForm.valKey2.$invalid ||\n                                postMobileActivationForm.valKey3.$invalid ||\n                                postMobileActivationForm.valKey4.$invalid)\n                                &&  postMobileActivationForm.$submitted\"\n                                 class=\"text-color-danger\"\n                                 role=\"alert\">\n                                <p>Please input the the 12 digit code we texted you. </p>\n                            </div>\n                        </div>\n                    </fieldset>\n                    <!-- <a ng-click=\"resendToken($event, \'mobile\');\">Resend token</a> -->\n\n                    <div class=\"margin-x-md margin-y-lg\">\n                        <button type=\"submit\" class=\"btn btn-primary btn-lg\">Check token</button>\n                    </div>\n                </form>\n            </div>\n\n        </div>\n    </div>\n</div>\n");}]);
angular.module("templates.setup", []).run(["$templateCache", function($templateCache) {$templateCache.put("setup/account-confirm.html","<div>\n    <div class=\"form-group row\">\n        <div class=\"col-md-8 col-md-offset-2\">\n            <div class=\"card card-block\">\n                <h5 class=\"card-title text-xs-center\">Confirm Test Deposit</h5>\n                <p class=\"card-text\">You are about to send a test payment of 0.01 to your bank account. Please click Confirm Test Deposit to continue</p>\n                <div class=\"text-xs-center\">\n                    <button type=\"submit\"\n                            ng-click=\"bankAuthForm.$valid && postBankAuthentication($event, bankAuthForm)\"\n                            class=\"btn btn-secondary btn-width-lg\">Confirm Deposit</button>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>");
$templateCache.put("setup/account-info.html","<!-- confirm account -->\n<div>\n    <div class=\"form-group row\">\n        <div class=\"col-md-8 col-md-offset-2\">\n\n            <div class=\"card card-block\">\n                <h5 class=\"card-title text-xs-center\">Verify Bank Account</h5>\n                <p class=\"card-text\">\n                    Now We need to verify that this bank account belongs to you. This is done by a test deposit.\n                    A small deposit will be made into your bank account, which you should be able to see within 2 hours.\n                    Follow the steps below to create the deposit amount and enter the token.\n\n                <ol>\n                    <li>Click Verify My Bank Account</li>\n                    <li>Check your bank statement and search for a deposit of 0.01 from --PeerPay service name--</li>\n                    <li>Note the payment reference associated with the deposit</li>\n                    <li>Return to your PeerPay account</li>\n                    <li>Enter the 16 character token part of the payment reference in the field provided and click Done</li>\n                </ol>\n                </p>\n                <div class=\"text-xs-center\">\n                    <a ng-click=\"confirmAccount($event)\" class=\"btn btn-primary btn-width-lg\">Verify Account</a>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("setup/account-sent.html","<div>\n    <div class=\"form-group row\">\n        <div class=\"col-md-8 col-md-offset-2\">\n            <div class=\"card card-block card-inverse card-success\">\n                <h5 class=\"card-title text-xs-center\">Account Setup Complete</h5>\n                <p class=\"card-text\">Your Test deposit has been sent to your bank account\n                    When you have seen the deposit in your account return to the Manage my Bank Account page to complete your setup</p>\n                <div class=\"text-xs-center\">\n                    <a ng-click=\"returnToSetup()\" class=\"btn btn-secondary btn-width-lg\">OK</a>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>");
$templateCache.put("setup/account-success.html","<div class=\"col-md-6 col-md-offset-3 padding-lg bg-ppLightBlue borderless border-radius-md\">\n\n    <div class=\"form-group row\">\n        <div class=\"col-md-6 col-md-offset-4\">\n\n            <div class=\"card card-block card-inverse card-success\">\n                <h5 class=\"card-title text-xs-center\">Account Verified</h5>\n                <p class=\"card-text\">\n                    The reference that you entered is a match!<br/>\n                    Your account has been authenticated.<br/>\n                    Your client details have automatically been submitted to\n                    PeerPay for authorisation.<br/>\n                    Once you receive your authorisation confirmation you\n                    can start using the \'PeerPay\' system.\n                </p>\n                <p class=\"text-xs-center\">\n                    <a ng-click=\"returnToSetup()\" class=\"btn btn-secondary btn-width-lg\">OK</a>\n                </p>\n\n            </div>\n\n        </div>\n    </div>\n\n</div>\n");
$templateCache.put("setup/account-verify.html","<div class=\"col-md-6 col-md-offset-3 padding-lg bg-ppLightBlue borderless border-radius-md\">\n    <form name=\"bankCheckForm\"\n            ng-submit=\"bankCheckForm.$valid && postBankVerification(bankCheckForm)\"\n            novalidate>\n\n        <div class=\"form-group row padding-y-lg\">\n            <div class=\"col-md-10 col-md-offset-1\n                        padding-y-lg font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">\n                Re-enter your bank account details\n            </div>\n        </div>\n\n        <fieldset class=\"form-group row margin-bottom-md\">\n            <label for=\"account-number\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Account Number</label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"account-number\"\n                       name=\"accountNumber\"\n                       ng-model=\"vm.accounts.verify.accountNum\"\n                       placeholder=\"\"\n                       class=\"form-control\"\n                       required>\n            </div>\n            <div ng-messages=\"bankCheckForm.accountNumber.$error\"\n                 ng-if=\"bankCheckForm.$submitted\"\n                 class=\"text-color-danger\"\n                 role=\"alert\">\n                <div ng-message=\"required\">* Required </div>\n            </div>\n        </fieldset>\n\n\n        <fieldset class=\"form-group row margin-bottom-md\">\n            <label for=\"sort-code\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Sort Code</label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"sort-code\"\n                       name=\"sortCode\"\n                       ng-model=\"vm.accounts.verify.sortCode\"\n                       placeholder=\"\"\n                       class=\"form-control\"\n                       required>\n            </div>\n            <div ng-messages=\"bankCheckForm.sortCode.$error\"\n                 ng-if=\"bankCheckForm.$submitted\"\n                 class=\"text-color-danger\"\n                 role=\"alert\">\n                <div ng-message=\"required\">* Required </div>\n            </div>\n        </fieldset>\n\n        <div class=\"form-group row padding-y-lg\">\n            <div class=\"col-md-10 col-md-offset-1\n                        padding-y-lg font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">\n                Enter the token from your authentication deposit\n            </div>\n        </div>\n\n        <fieldset class=\"form-group row\"\n                  ng-class=\"{ \'has-error\' : bankCheckForm.email.$invalid && bankCheckForm.$submitted}\">\n            <div class=\"col-md-4\">\n                <label for=\"account-secret\">Verification token</label>\n            </div>\n            <div class=\"col-md-8\">\n                <div class=\"form-group\">\n                    <div class=\"input-group\" id=\"account-secret\">\n                        <input type=\"text\"\n                               class=\"form-control\"\n                               id=\"valKey1\"\n                               name=\"valKey1\"\n                               maxlength=\"3\"\n                               placeholder=\"XXX\"\n                               ng-model=\"vm.accounts.verify.secret.a\"\n                               tabindex=\"1\"\n                               auto-focus\n                               required>\n                        <div class=\"input-group-addon\">-</div>\n                        <input type=\"text\"\n                               class=\"form-control\"\n                               id=\"valKey2\"\n                               name=\"valKey2\"\n                               maxlength=\"3\"\n                               placeholder=\"XXX\"\n                               ng-model=\"vm.accounts.verify.secret.b\"\n                               tabindex=\"2\"\n                               auto-focus\n                               required>\n                        <div class=\"input-group-addon\">-</div>\n                        <input type=\"text\"\n                               class=\"form-control\"\n                               id=\"valKey3\"\n                               name=\"valKey3\"\n                               maxlength=\"3\"\n                               placeholder=\"XXX\"\n                               ng-model=\"vm.accounts.verify.secret.c\"\n                               tabindex=\"3\"\n                               auto-focus\n                               required>\n                        <div class=\"input-group-addon\">-</div>\n                        <input type=\"text\"\n                               class=\"form-control\"\n                               id=\"valKey4\"\n                               name=\"valKey4\"\n                               maxlength=\"3\"\n                               placeholder=\"XXX\"\n                               ng-model=\"vm.accounts.verify.secret.d\"\n                               tabindex=\"4\"\n                               auto-focus\n                               required>\n                    </div>\n                </div>\n\n                <div ng-show=\"(bankCheckForm.valKey1.$invalid ||\n                                bankCheckForm.valKey2.$invalid ||\n                                bankCheckForm.valKey3.$invalid ||\n                                bankCheckForm.valKey4.$invalid)\n                                && bankCheckForm.$submitted\"\n                     class=\"text-color-danger\"\n                     role=\"alert\">\n                    <p>Please input the the 12 digit code from your bank statement. </p>\n                </div>\n            </div>\n        </fieldset>\n\n        <div class=\"form-group row\">\n            <div class=\"col-md-6 col-md-offset-4\">\n                <button type=\"submit\" id=\"continue\" class=\"btn btn-secondary btn-sm\">Confirm Account</button>\n            </div>\n        </div>\n    </form>\n\n</div>\n");
$templateCache.put("setup/company-details.html","<div class=\"col-md-6 col-md-offset-3 padding-lg bg-ppLightBlue borderless border-radius-md\">\n    <form ng-submit=\"confirmDetailsCorrect()\">\n\n        <div class=\"form-group row padding-y-lg\">\n            <div class=\"col-md-10 col-md-offset-1\n                        padding-y-lg font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">\n                Please confirm all {{vm.client.clientType == \'lender\' ? \'lender\' : \'borrower\'}} details\n            </div>\n        </div>\n\n\n        <div class=\"form-group row\">\n            <label for=\"company-name\"\n                   class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right font-weight-bold\">\n                {{vm.client.lenderType == \'individual\' ? \"Investor Name\" : \"Company Name\"}}\n            </label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"company-name\"\n                       name=\"company-name\"\n                       placeholder=\"Company Name\"\n                       class=\"form-control\"\n                       ng-model=\"vm.client.clientName\"\n                       disabled>\n            </div>\n        </div>\n\n        <div class=\"form-group row margin-bottom-md\">\n            <label for=\"company-number\"\n                   class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right font-weight-bold\">\n                {{vm.client.lenderType == \'individual\' ? \"NI Number\" : \"Company Number\"}}\n            </label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"company-number\"\n                       name=\"company-number\"\n                       placeholder=\"Company Number\"\n                       class=\"form-control\"\n                       ng-model=\"vm.client.clientNumber\"\n                       disabled>\n            </div>\n        </div>\n\n        <div class=\"form-group row margin-bottom-md\" ng-show=\"vm.client.clientDesc\">\n            <label for=\"company-number\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Company Description</label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"company-description\"\n                       name=\"company-description\"\n                       placeholder=\"Company Description\"\n                       class=\"form-control\"\n                       ng-model=\"vm.client.clientDesc\"\n                       disabled>\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"company-address-1\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Address</label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"company-address-1\"\n                       name=\"company-address-1\"\n                       placeholder=\"Address Line 1\"\n                       class=\"form-control \"\n                       ng-model=\"vm.client.clientData.address.addressLine1\"\n                       disabled>\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"company-address-2\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\"></label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"company-address-2\"\n                       name=\"company-address-2\"\n                       placeholder=\"Address Line 2\"\n                       class=\"form-control\"\n                       ng-model=\"vm.client.clientData.address.addressLine2\"\n                       disabled>\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"address-town\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Town / City</label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"address-town\"\n                       name=\"address-town\"\n                       laceholder=\"Town/City\"\n                       class=\"form-control \"\n                       ng-model=\"vm.client.clientData.address.town\"\n                       disabled>\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"address-county\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">County</label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"address-county\"\n                       name=\"address-county\"\n                       placeholder=\"County\"\n                       class=\"form-control \"\n                       ng-model=\"vm.client.clientData.address.county\"\n                       disabled>\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"post-code\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Post Code</label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"post-code\"\n                       name=\"address-post-code\"\n                       placeholder=\"Post Code\"\n                       class=\"form-control \"\n                       ng-model=\"vm.client.clientData.address.postCode\"\n                       disabled>\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"address-country\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Country</label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"address-country\"\n                       name=\"address-country\"\n                       placeholder=\"Country\"\n                       class=\"form-control \"\n                       ng-model=\"vm.client.clientData.address.country\"\n                       disabled>\n            </div>\n        </div>\n\n        <div class=\"form-group row margin-top-md\">\n            <label for=\"private-domain\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">{{domainLabel}}</label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"private-domain\"\n                       name=\"private-domain\"\n                       placeholder=\"Email Domain\"\n                       ng-model=\"vm.client.emailDomain\"\n                       class=\"form-control\"\n                       disabled>\n            </div>\n        </div>\n\n        <div class=\"form-group row margin-top-md\" ng-show=\"vm.client.clientData.clientType != \'lender\' && vm.client.clientType != \'lender\'\">\n            <label for=\"accountancy-system\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Accountancy System</label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"accountancy-system\"\n                       name=\"accountancy-system\"\n                       placeholder=\"Accountancy System\"\n                       ng-model=\"vm.client.clientData.accountsSystem\"\n                       class=\"form-control\"\n                       disabled>\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"main-contact\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Main Contact Name</label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"main-contact\"\n                       name=\"main-contact\"\n                       placeholder=\"Main Contact\"\n                       class=\"form-control\"\n                       ng-model=\"normalizedPrimary\"\n                       disabled>\n            </div>\n        </div>\n\n        <div class=\"form-group row margin-top-md\">\n            <div class=\"col-md-offset-4 col-md-6\">\n                <button class=\"btn btn-primary btn-block\" type=\"submit\" >\n                    All Details Correct\n                </button>\n                <button class=\"btn btn-link btn-block btn-sm text-color-grey\" ng-click=\"reportProblem()\" ng-disabled=\"true\">\n                    I have found a problem\n                </button>\n            </div>\n        </div>\n\n    </form>\n</div>\n");
$templateCache.put("setup/index.html","<div class=\"container-fluid padding-lg\">\n    <ui-view/>\n</div>\n");
$templateCache.put("setup/loading.html","<div class=\"container margin-y-lg\">\n    <div class=\"row\">\n        <div class=\"col-md-8 col-md-offset-2\">\n            <h1>Loading details...</h1>\n            <ui-view/>\n        </div>\n    </div>\n</div>\n\n");
$templateCache.put("setup/borrower/account-authenticate.html","<div class=\"col-md-6 col-md-offset-3 padding-lg bg-ppLightBlue borderless border-radius-md\">\n    <form name=\"bankAuthForm\"\n            ng-submit=\"bankAuthForm.$valid\"\n            novalidate>\n\n        <!-- fetch accounts -->\n        <div>\n            <div class=\"form-group row padding-y-lg\">\n                <div class=\"col-md-10 col-md-offset-1\n                            padding-y-lg font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">\n                    Register and verify your bank account\n                </div>\n            </div>\n            <div ui-view>\n                <div class=\"form-group row\">\n                    <div class=\"col-md-8 col-md-offset-2\">\n                        <button ng-click=\"getAccounts($event, \'setup.borrower.accounts.authenticate.select\')\" id=\"invoice-info\" class=\"btn btn-info btn-md\">Get My Bank Account Details</button>\n                        <p class=\"text-info margin-top-sm font-italic\">Retrieve your bank account details from your accountancy system</p>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n    </form>\n</div>\n");
$templateCache.put("setup/borrower/account-complete.html","<div ng-cloak ng-show=\"accountTestSent && bankAuthForm.$submitted\">\n    <div class=\"form-group row\">\n        <div class=\"col-md-8 col-md-offset-2\">\n            <div class=\"card card-block card-inverse card-success\">\n                <h5 class=\"card-title text-xs-center\">Account Setup Complete</h5>\n                <p class=\"card-text\">Your Test deposit has been sent to your bank account\n                    When you have seen the deposit in your account return to the Manage\n                    my Bank Account page to complete your setup</p>\n                <div class=\"text-xs-center\">\n                    <a ng-click=\"completeAccountSetup($event)\" class=\"btn btn-secondary btn-width-lg\">OK</a>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("setup/borrower/account-select.html","<!-- select account -->\n\n<div class=\"form-group row\">\n    <div class=\"col-md-8 col-md-offset-2\">\n        <p class=\"font-italic\">These are the bank accounts we found in your accountancy system\n            Choose the account you want to register and click Continue to confirm that you want to use this bank account</p>\n    </div>\n    <div class=\"col-md-5 col-md-offset-2\">\n        <select name=\"selectedAccount\"\n                ng-model=\"vm.accounts.authenticate\"\n                ng-options=\"item.accountDisplay for item in vm.accounts.available\"\n                id=\"select-account\"\n                class=\"form-control\"\n                required>\n        </select>\n    </div>\n</div>\n<div ng-messages=\"bankAuthForm.selectedAccount.$error\"\n     ng-if=\"selectedAccountSubmitted\"\n     class=\"text-color-danger\"\n     role=\"alert\">\n    <div ng-message=\"required\">* Required </div>\n</div>\n\n<div ui-view>\n    <div class=\"form-group row\">\n        <div class=\"col-md-8 col-md-offset-2\">\n            <button id=\"continue\" ng-click=\"selectAccount($event)\" class=\"btn btn-secondary btn-sm\">Continue</button>\n        </div>\n    </div>\n</div>");
$templateCache.put("setup/borrower/invoice-templates.html","<div class=\"col-md-10 col-md-offset-1 padding-lg bg-ppLightBlue borderless border-radius-md\">\n    <p>You need to download the invoice template below and import into your accountancy system before you can start submitting invoices for borrowing.</p>\n    <p>All invoices that you want to use for borrowing must be created using this template as this contains the payment information that your customer will need to use to ensure that payment of the invoice reaches us correctly.</p>\n\n    <div class=\"form-group row margin-top-md\">\n        <label for=\"accountancy-system\" class=\"col-md-8 form-control-label text-spaced-xs text-xs-right small\"><a href=\"#\">Click here</a> for instructions on how to load an invoice template into</label>\n        <div class=\"col-md-4\">\n            <input type=\"text\"\n                   id=\"accountancy-system\"\n                   name=\"accountancy-system\"\n                   placeholder=\"Accountancy System\"\n                   ng-model=\"vm.client.clientData.accountsSystem\"\n                   class=\"form-control\"\n                   disabled>\n        </div>\n    </div>\n    <div class=\"form-group row margin-top-lg\">\n        <div class=\"col-md-offset-3 col-md-6\">\n            <button class=\"btn btn-primary btn-block\" type=\"submit\" >\n                Download Invoice Template\n            </button>\n        </div>\n    </div>\n</div>");
$templateCache.put("setup/borrower/manage.html","<div class=\"row\">\n    <div class=\"col-md-3 sidebar\">\n\n        <div class=\"card bg-ppLightBlue borderless\">\n            <div class=\"card-header bg-ppNavyBlue text-color-white font-size-ml\">\n                Setup Status\n            </div>\n            <div class=\"card-block padding-sm\">\n                <div class=\"inner-container\n                          display-table\n                          padding-sm\n                          bg-white\n                          margin-top-xs margin-bottom-xs\n                          border-radius-sm\n                          text-spaced-xs\" ng-repeat=\"step in steps track by $index\">\n                    <span class=\"content left text-color-ppNavyBlue\">{{step.label}}</span>\n                    <span class=\"content icon-container display-table-cell\">\n                        <i class=\"fa fa-check fa-2x\" ng-if=\"getStepStatus(step.confirmKey)\"></i>\n                        <i class=\"fa fa-times fa-2x\" ng-if=\"!getStepStatus(step.confirmKey)\"></i>\n                    </span>\n                </div>\n            </div>\n        </div>\n\n    </div>\n    <!--Main Body-->\n    <div class=\"col-md-9 options\">\n        <div class=\"row\">\n            <div class=\"col-sm-12 col-md-6\">\n                <div class=\"card card-block\" ng-class=\"getStepStatus(\'companyDetailsConfirmed\') ? \'bg-grey\' : \'bg-lightbeige\'\">\n                    <h3 class=\"card-title font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">Confirm Company Details</h3>\n                    <div class=\"card-text padding-bottom-lg\">\n                        <div class=\"inner-container display-table\">\n                                <span class=\"content font-italic\">\n                                    Check and update company details\n                                </span>\n                                <span class=\"content icon-container display-table-cell\">\n                                    <i class=\"fa fa-building-o fa-3x\"></i>\n                                </span>\n                        </div>\n                    </div>\n                    <button class=\"btn btn-secondary btn-width-lg\" ng-click=\"redirectTo(\'setup.borrower.company\')\" ng-disabled=\"getStepStatus(\'companyDetailsConfirmed\')\">{{companyConfirmBtn}}</button>\n                </div>\n            </div>\n\n            <div class=\"col-sm-12 col-md-6\">\n                <div class=\"card card-block\"\n                    ng-class=\"(getStepStatus(\'bankAccountTestSent\') && getStepStatus(\'bankAccountConfirmed\')) ||\n                              (!getStepStatus(\'companyDetailsConfirmed\') ||\n                              !getStepStatus(\'tsCsConfirmed\') ||\n                              !getStepStatus(\'clientCompletedRiskProfile\'))\n                              ? \'bg-grey\' : \'bg-lightbeige\'\n                              \">\n                    <h3 class=\"card-title font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">Manage My Bank Accounts</h3>\n                    <div class=\"card-text padding-bottom-lg\">\n                        <div class=\"inner-container display-table\">\n                                <span class=\"content font-italic\">\n                                    Setup and verify a new bank account\n                                </span>\n                                <span class=\"content icon-container display-table-cell\">\n                                    <i class=\"fa fa-bank fa-3x\"></i>\n                                </span>\n                        </div>\n                    </div>\n                    <button class=\"btn btn-secondary btn-width-lg\" ng-click=\"redirectTo(\'setup.borrower.accounts.authenticate\')\" ng-disabled=\"!(!getStepStatus(\'bankAccountTestSent\') &&\n                         getStepStatus(\'companyDetailsConfirmed\') &&\n                         getStepStatus(\'clientCompletedRiskProfile\') &&\n                         getStepStatus(\'tsCsConfirmed\'))\">Setup Account</button>\n\n                    <button class=\"btn btn-secondary btn-width-lg\" ng-click=\"redirectTo(\'setup.borrower.accounts.verify\')\" ng-disabled=\"!(getStepStatus(\'bankAccountTestSent\') && !getStepStatus(\'bankAccountConfirmed\'))\">Confirm Account</button>\n                </div>\n            </div>\n\n        </div>\n\n        <div class=\"row\">\n\n            <div class=\"col-sm-12 col-md-6\">\n                <div class=\"card card-block\"\n                    ng-class=\"!getStepStatus(\'companyDetailsConfirmed\') || getStepStatus(\'clientCompletedRiskProfile\') ? \'bg-grey\' : \'bg-lightbeige\'\"\n                    >\n                    <h3 class=\"card-title font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">Complete Company Risk Profile</h3>\n                    <div class=\"card-text padding-bottom-lg\">\n                        <div class=\"inner-container display-table\">\n                                <span class=\"content font-italic\">\n                                    View and complete your risk profile information\n                                </span>\n                                <span class=\"content icon-container display-table-cell\">\n                                    <i class=\"fa fa-warning fa-3x\"></i>\n                                </span>\n                        </div>\n                    </div>\n                    <button class=\"btn btn-secondary btn-width-lg\" ng-click=\"redirectTo(\'setup.borrower.risk.start\')\" ng-disabled=\"!(!getStepStatus(\'clientCompletedRiskProfile\') && getStepStatus(\'companyDetailsConfirmed\'))\">Risk Profile</button>\n                </div>\n            </div>\n\n            <div class=\"col-sm-12 col-md-6\">\n                <div class=\"card card-block\" ng-class=\"!getStepStatus(\'clientAuthorised\') ? \'bg-grey\' : \'bg-lightbeige\'\">\n                    <h3 class=\"card-title font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">Invoice Templates</h3>\n                    <div class=\"card-text padding-bottom-lg\">\n                        <div class=\"inner-container display-table\">\n                                <span class=\"content font-italic\">\n                                    Download Template for your accountancy system\n                                </span>\n                                <span class=\"content icon-download display-table-cell\">\n                                    <i class=\"fa fa-arrow-circle-o-down fa-3x\"></i>\n                                </span>\n                        </div>\n                    </div>\n                    <button class=\"btn btn-secondary btn-width-lg\" ng-click=\"redirectTo(\'setup.borrower.invoices.templates\')\" ng-disabled=\"!getStepStatus(\'clientAuthorised\')\">Templates</button>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"col-sm-12 col-md-6\">\n                <div class=\"card card-block bg-lightbeige\" ng-class=\"!getStepStatus(\'companyDetailsConfirmed\') || getStepStatus(\'tsCsConfirmed\') ? \'bg-grey\' : \'bg-lightbeige\'\">\n                    <h3 class=\"card-title font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">Confirm Terms and Conditions</h3>\n                    <div class=\"card-text padding-bottom-lg\">\n                        <div class=\"inner-container display-table\">\n                                <span class=\"content font-italic \">\n                                    Confirm and view terms and conditions of the service\n                                </span>\n                                <span class=\"content icon-container display-table-cell\">\n                                    <i class=\"fa fa-file-text-o fa-3x\"></i>\n                                </span>\n                        </div>\n                    </div>\n                    <button class=\"btn btn-secondary btn-width-lg\" ng-click=\"confirmTerms($event)\" ng-disabled=\"!(!getStepStatus(\'tsCsConfirmed\') && getStepStatus(\'companyDetailsConfirmed\'))\">Terms & Conditions</button>\n                </div>\n            </div>\n\n            <div class=\"col-sm-12 col-md-6\">\n                <div class=\"card card-block bg-lightbeige\">\n                    <h3 class=\"card-title font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">My User Settings</h3>\n                    <div class=\"card-text padding-bottom-lg\">\n                        <div class=\"inner-container display-table\">\n                                <span class=\"content font-italic \">\n                                    Manage my User Settings\n                                </span>\n                                <span class=\"content icon-container display-table-cell\">\n                                    <i class=\"fa fa-user fa-3x\"></i>\n                                </span>\n                        </div>\n                    </div>\n                    <a href=\"/setup/borrower/user\" class=\"btn btn-secondary btn-width-lg\">Manage Settings</a>\n                </div>\n            </div>\n\n        </div>\n    </div>\n</div>");
$templateCache.put("setup/borrower/risk-info.html","\n<div class=\"form-group row margin-bottom-md\">\n    <label for=\"company-number\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right font-weight-bold\">Company Number</label>\n    <div class=\"col-md-6\">\n        <p id=\"company-number\" class=\"form-control-static\">42155844</p>\n    </div>\n</div>\n\n<div class=\"form-group row\">\n\n    <label class=\"col-md-8 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">\n        Active customers over the last 12 months\n    </label>\n    <div class=\"col-md-1\">\n        <p class=\"form-control-static font-weight-bold\">{{analysis.countActiveCustomers}}</p>\n    </div>\n\n    <label class=\"col-md-8 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">\n        Invoices sent over the last 12 months\n    </label>\n    <div class=\"col-md-1\">\n        <p class=\"form-control-static font-weight-bold\">{{analysis.countInvoices}}</p>\n    </div>\n\n    <label class=\"col-md-8 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">\n        Number of invoices currently outstanding\n    </label>\n    <div class=\"col-md-1\">\n        <p class=\"form-control-static font-weight-bold\">{{analysis.countInvoicesOutstanding}}</p>\n    </div>\n\n    <label class=\"col-md-8 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">\n        Number of customers with invoices currently outstanding\n    </label>\n    <div class=\"col-md-1\">\n        <p class=\"form-control-static font-weight-bold\">{{analysis.countCustomersOutstanding}}</p>\n    </div>\n\n    <label class=\"col-md-8 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">\n        Total amount on invoices currently outstanding\n    </label>\n    <div class=\"col-md-1\">\n        <p class=\"form-control-static font-weight-bold\">{{analysis.sumInvoicesOutstanding}}</p>\n    </div>\n\n    <label class=\"col-md-8 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">\n        Number of invoices currently overdue\n    </label>\n    <div class=\"col-md-1\">\n        <p class=\"form-control-static font-weight-bold\">{{analysis.countInvoicesOverdue}}</p>\n    </div>\n\n    <label class=\"col-md-8 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">\n        Number of customers with invoices currently overdue\n    </label>\n    <div class=\"col-md-1\">\n        <p class=\"form-control-static font-weight-bold\">{{analysis.countCustomersOverdue}}</p>\n    </div>\n\n    <label class=\"col-md-8 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">\n        Total amount on invoices currently overdue\n    </label>\n    <div class=\"col-md-1\">\n        <p class=\"form-control-static font-weight-bold\">{{analysis.sumInvoicesOverdue}}</p>\n    </div>\n\n    <label class=\"col-md-8 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">\n        Total amount on overdue invoices in the last 12 months\n    </label>\n    <div class=\"col-md-1\">\n        <p class=\"form-control-static font-weight-bold\">{{analysis.sumInvoicesOverdueYearly}}</p>\n    </div>\n</div>\n\n\n<div class=\"form-group row margin-top-md\">\n    <div class=\"col-md-offset-4 col-md-6\">\n        <button ng-click=\"acceptAnalysis($event)\" class=\"btn btn-primary btn-width-md margin-bottom-sm right\">\n            OK\n        </button>\n    </div>\n</div>\n\n");
$templateCache.put("setup/borrower/risk-profile.html","<div class=\"col-md-6 col-md-offset-3 padding-lg bg-ppLightBlue borderless border-radius-md\">\n    <form name=\"ppForm\"\n          ng-submit=\"ppForm.$valid && putSelfAssessment()\"\n            novalidate>\n\n        <div class=\"form-group row padding-y-lg\">\n            <div class=\"col-md-10 col-md-offset-1\n                        padding-y-lg font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">\n                {{title}}\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"company-name\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right font-weight-bold\">Company Name</label>\n            <div class=\"col-md-6\">\n                <p id=\"company-name\" class=\"form-control-static\">{{vm.client.clientDesc}}</p>\n            </div>\n        </div>\n\n        <div class=\"form-group row margin-bottom-md\">\n            <label for=\"company-number\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right font-weight-bold\">Company Number</label>\n            <div class=\"col-md-6\">\n                <p id=\"company-number\" class=\"form-control-static\">{{vm.client.clientNumber}}</p>\n            </div>\n        </div>\n\n        <ui-view/>\n\n    </form>\n</div>\n");
$templateCache.put("setup/borrower/risk-questionnaire.html","<div>\n    <div class=\"form-group row\">\n        <label for=\"invoice-info\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\"></label>\n        <div class=\"col-md-6\">\n            <button id=\"invoice-info\" ng-click=\"viewRiskAnalysis($event)\" class=\"btn btn-info btn-md\">View Invoice Information</button>\n            <p class=\"text-info margin-top-sm font-italic\">\n                View the invoice information that was retrieved from your Accounts package during registration\n            </p>\n        </div>\n    </div>\n</div>\n\n<div ng-repeat=\"field in questionnaire\">\n    <dropdown-field field=\"field\" namespace=\"foo\"></dropdown-field>\n</div>\n\n\n<div class=\"form-group row margin-top-md\">\n    <div class=\"col-md-offset-4 col-md-6\">\n        <button type=\"submit\" class=\"btn btn-primary btn-width-md margin-bottom-sm right\">\n            OK\n        </button>\n    </div>\n</div>");
$templateCache.put("setup/borrower/risk-start.html","<div class=\"form-group row\">\n    <label for=\"invoice-info\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\"></label>\n    <div class=\"col-md-6\">\n        <button id=\"invoice-info\" ng-click=\"getRiskAnalysis($event, \'setup.borrower.risk.info\')\" class=\"btn btn-info btn-md\">Get Invoice Information</button>\n        <p class=\"text-info margin-top-sm font-italic\">\n            Fetch the invoice information from your Accounts system\n        </p>\n    </div>\n</div>");
$templateCache.put("setup/borrower/user-details.html","<div class=\"col-md-6 col-md-offset-3 padding-lg bg-ppLightBlue borderless border-radius-md\">\n    <form ng-submit=\"saveUserDetails()\" novalidate>\n\n        <div class=\"form-group row padding-y-lg\">\n            <div class=\"col-md-10 col-md-offset-1\n                        padding-y-lg font-size-ml text-spaced-sm font-weight-bold\n            text-color-ppNavyBlue\">\n                User details\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"user-name\" class=\"col-md-3 col-md-offset-1 form-control-label\n           text-spaced-xs text-xs-right font-weight-bold\">Username</label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"user-name\"\n                       name=\"user-name\"\n                       placeholder=\"User Name\"\n                       class=\"form-control\"\n                       ng-model=\"vm.username\"\n                       required>\n            </div>\n        </div>\n\n        <div class=\"form-group row margin-bottom-md\">\n            <label for=\"title\" class=\"col-md-3 col-md-offset-1 form-control-label\n           text-spaced-xs text-xs-right font-weight-bold\">Title</label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"title\"\n                       name=\"title\"\n                       placeholder=\"Title\"\n                       class=\"form-control\"\n                       ng-model=\"vm.user.profile.title\"\n                       required>\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"first-name\" class=\"col-md-3 col-md-offset-1 form-control-label\n           text-spaced-xs text-xs-right\">First Name</label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"first-name\"\n                       name=\"first-name\"\n                       placeholder=\"Full Name\"\n                       class=\"form-control \"\n                       ng-model=\"vm.firstName\"\n                       required>\n            </div>\n        </div>\n\n    <div class=\"form-group row\">\n            <label for=\"last-name\" class=\"col-md-3 col-md-offset-1 form-control-label\n           text-spaced-xs text-xs-right\">Last Name</label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"last-name\"\n                       name=\"last-name\"\n                       placeholder=\"Last Name\"\n                       class=\"form-control \"\n                       ng-model=\"vm.lastName\"\n                       required>\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"email\" class=\"col-md-3 col-md-offset-1 form-control-label\n           text-spaced-xs text-xs-right\">Email Address</label>\n            <div class=\"col-md-6\">\n                <input type=\"email\"\n                       id=\"email\"\n                       name=\"email\"\n                       placeholder=\"Email\"\n                       class=\"form-control \"\n                       ng-model=\"vm.email\"\n                       required>\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"mobile\" class=\"col-md-3 col-md-offset-1 form-control-label\n           text-spaced-xs text-xs-right\">Mobile</label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"mobile\"\n                       name=\"mobile\"\n                       placeholder=\"Mobile\"\n                       class=\"form-control \"\n                       ng-model=\"vm.mobile\"\n                       required>\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"notifications\" class=\"col-md-3 col-md-offset-1 form-control-label\n           text-spaced-xs text-xs-right\">Notification Preference</label>\n            <div class=\"col-md-4\">\n                <input type=\"checkbox\" />\n                <label>Email</label>\n            </div>\n            <div class=\"col-md-4\">\n                <input type=\"checkbox\" />\n                <label>Mobile</label>\n            </div>\n        </div>\n\n        <div class=\"form-group row margin-top-md\">\n            <div class=\"col-md-offset-4 col-md-6\">\n                <button class=\"btn btn-primary btn-block\" type=\"submit\" >\n                    Save Details\n                </button>\n            </div>\n        </div>\n\n    </form>\n</div>\n");
$templateCache.put("setup/lender/account-authenticate.html","<div class=\"col-md-6 col-md-offset-3 padding-lg bg-ppLightBlue borderless border-radius-md\">\n    <form name=\"bankAuthForm\"\n          ng-submit=\"bankAuthForm.$valid\"\n          novalidate>\n        <p>You will need to register &amp; verify your bank account for receiving your Investment returns.</p>\n        <p>Enter the details of your bank account and click Continue</p>\n\n        <div class=\"form-group row\">\n            <label for=\"accountNum\" class=\"col-md-3 form-control-label text-spaced-xs text-xs-right\">Bank Account Number</label>\n            <div class=\"col-md-9\">\n                <input type=\"number\"\n                       id=\"accountNum\"\n                       name=\"accountNum\"\n                       placeholder=\"Bank Account Number\"\n                       class=\"form-control\"\n                       maxlength=\"8\"\n                       ng-model=\"vm.accounts.authenticate.accountNum\"\n                       required>\n                <div ng-messages=\"bankAuthForm.accountNum.$error\"\n                     ng-if=\"bankAuthForm.$submitted\"\n                     class=\"text-color-danger\"\n                     role=\"alert\">\n                    <div ng-message=\"required\">Please provide your bank account number</div>\n                    <div ng-message=\"maxlength\">An account number cannot be more than 8 digits</div>\n                </div>\n            </div>\n        </div>\n\n        <fieldset class=\"form-group row\"\n            ng-class=\"{ \'has-error\' : bankAuthForm.email.$invalid && bankAuthForm.$submitted}\">\n            <label for=\"sortcode\" class=\"col-md-3 form-control-label text-spaced-xs text-xs-right\">Sort Code</label>\n            <div class=\"col-md-9\">\n                <div class=\"form-group\">\n                    <div class=\"input-group\" id=\"email\">\n                        <input type=\"text\"\n                               class=\"form-control\"\n                               id=\"valKey1\"\n                               name=\"valKey1\"\n                               maxlength=\"2\"\n                               placeholder=\"XX\"\n                               ng-model=\"vm.accounts.authenticate.sortCode.a\"\n                               auto-focus\n                               tabindex=\"1\"\n                               required>\n                        <div class=\"input-group-addon\">-</div>\n                        <input type=\"text\"\n                               class=\"form-control\"\n                               id=\"valKey2\"\n                               name=\"valKey2\"\n                               maxlength=\"2\"\n                               placeholder=\"XX\"\n                               ng-model=\"vm.accounts.authenticate.sortCode.b\"\n                               auto-focus\n                               tabindex=\"2\"\n                               required>\n                        <div class=\"input-group-addon\">-</div>\n                        <input type=\"text\"\n                               class=\"form-control\"\n                               id=\"valKey3\"\n                               name=\"valKey3\"\n                               maxlength=\"2\"\n                               placeholder=\"XX\"\n                               ng-model=\"vm.accounts.authenticate.sortCode.c\"\n                               auto-focus\n                               tabindex=\"3\"\n                               required>\n                    </div>\n                </div>\n\n                <div ng-show=\"(bankAuthForm.valKey1.$invalid ||\n                        bankAuthForm.valKey2.$invalid ||\n                        bankAuthForm.valKey3.$invalid) && bankAuthForm.$submitted\"\n                     class=\"text-color-danger\"\n                     role=\"alert\">\n                    <p>Please provide your sortcode </p>\n                </div>\n            </div>\n        </fieldset>\n\n        <div ui-view>\n            <div class=\"col-md-8 col-md-offset-2\">\n                <button id=\"continue\"\n                        type=\"submit\"\n                        ng-click=\"inputAccount($event, bankAuthForm)\"\n                        class=\"btn btn-secondary btn-sm\">\n                    Continue\n                </button>\n            </div>\n        </div>\n    </form>\n</div>\n");
$templateCache.put("setup/lender/confirm-deposit.html","<div class=\"col-md-6 col-md-offset-3 padding-lg bg-ppLightBlue borderless border-radius-md\">\n    <form name=\"bankTestForm\"\n          ng-submit=\"bankTestForm.$valid && postBankAuthentication(bankTestForm)\"\n          novalidate>\n        <div class=\"form-group row padding-y-lg\">\n            <div class=\"col-md-10 col-md-offset-1\n                        padding-y-lg font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">\n                Confirm Deposit\n            </div>\n        </div>\n        <p>We are pleased to welcome you as a Lender to the PeerPay Service.</p>\n        <p>To complete this procedure you should now deposit the funds you committed to in your Investor Risk Profile into the Bank Account detailed below using the payment reference below so we can identify your deposit.</p>\n\n        <div class=\"form-group row\">\n            <label for=\"accountNum\" class=\"col-md-3 form-control-label text-spaced-xs text-xs-right\">Committed Funding</label>\n            <div class=\"col-md-9\">\n                <input type=\"text\"\n                       id=\"accountNum\"\n                       name=\"accountNum\"\n                       placeholder=\"Bank Account Number\"\n                       class=\"form-control\"\n                       maxlength=\"8\"\n                       ng-model=\"vm.accounts.authenticate.accountNum\"\n                >\n                <div ng-messages=\"bankTestForm.accountNum.$error\"\n                     ng-if=\"bankTestForm.$dirty\"\n                     class=\"text-color-danger\"\n                     role=\"alert\">\n                    <div ng-message=\"required\">Please provide your committed funding</div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"accountNum\" class=\"col-md-3 form-control-label text-spaced-xs text-xs-right\">Sort Code</label>\n            <div class=\"col-md-9\">\n                <input type=\"text\"\n                       id=\"accountNum\"\n                       name=\"accountNum\"\n                       placeholder=\"Bank Account Number\"\n                       class=\"form-control\"\n                       maxlength=\"8\"\n                       ng-model=\"vm.accounts.authenticate.accountNum\"\n                >\n                <div ng-messages=\"bankTestForm.accountNum.$error\"\n                     ng-if=\"bankTestForm.$dirty\"\n                     class=\"text-color-danger\"\n                     role=\"alert\">\n                    <div ng-message=\"required\">Please provide your sort code</div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"accountNum\" class=\"col-md-3 form-control-label text-spaced-xs text-xs-right\">Account Number</label>\n            <div class=\"col-md-9\">\n                <input type=\"text\"\n                       id=\"accountNum\"\n                       name=\"accountNum\"\n                       placeholder=\"Bank Account Number\"\n                       class=\"form-control\"\n                       maxlength=\"8\"\n                       ng-model=\"vm.accounts.authenticate.accountNum\"\n                >\n                <div ng-messages=\"bankTestForm.accountNum.$error\"\n                     ng-if=\"bankTestForm.$dirty\"\n                     class=\"text-color-danger\"\n                     role=\"alert\">\n                    <div ng-message=\"required\">Please provide your bank account number</div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"accountNum\" class=\"col-md-3 form-control-label text-spaced-xs text-xs-right\">Payment Reference</label>\n            <div class=\"col-md-9\">\n                <input type=\"text\"\n                       id=\"accountNum\"\n                       name=\"accountNum\"\n                       placeholder=\"Bank Account Number\"\n                       class=\"form-control\"\n                       maxlength=\"8\"\n                       ng-model=\"vm.accounts.authenticate.accountNum\"\n                >\n                <div ng-messages=\"bankTestForm.accountNum.$error\"\n                     ng-if=\"bankTestForm.$dirty\"\n                     class=\"text-color-danger\"\n                     role=\"alert\">\n                    <div ng-message=\"required\">Please provide your payment reference</div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"col-md-8 col-md-offset-2\">\n            <button id=\"continue\" ng-click=\"cancelConfirmDeposit($event)\" class=\"btn btn-secondary btn-sm\">Cancel</button>\n            <button id=\"continue\" ng-click=\"paymentInitiated($event)\" class=\"btn btn-secondary btn-sm\">Payment Initiated</button>\n        </div>\n    </form>\n</div>\n\n");
$templateCache.put("setup/lender/manage.html","<div class=\"col-md-3 sidebar\">\n\n    <div class=\"card bg-ppLightBlue borderless\">\n        <div class=\"card-header bg-ppNavyBlue text-color-white font-size-ml\">\n            Setup Status\n        </div>\n        <div class=\"card-block padding-sm\">\n            <div class=\"inner-container\n                      display-table\n                      padding-sm\n                      bg-white\n                      margin-top-xs margin-bottom-xs\n                      border-radius-sm\n                      text-spaced-xs\" ng-repeat=\"step in lenderSteps track by $index\">\n                <span class=\"content left text-color-ppNavyBlue\">{{step.label}}</span>\n                <span class=\"content icon-container display-table-cell\">\n                    <i class=\"fa fa-check fa-2x\" ng-if=\"getStepStatus(step.confirmKey)\"></i>\n                    <i class=\"fa fa-times fa-2x\" ng-if=\"!getStepStatus(step.confirmKey)\"></i>\n                </span>\n            </div>\n        </div>\n    </div>\n\n</div>\n<!--Main Body-->\n<div class=\"col-md-9 options\">\n    <div class=\"row\">\n        <div class=\"col-sm-12 col-md-6\">\n            <div class=\"card card-block\" ng-class=\"getStepStatus(\'companyDetailsConfirmed\') ? \'bg-grey\' : \'bg-lightbeige\'\">\n                <h3 class=\"card-title font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">Confirm Lender Details</h3>\n                <div class=\"card-text padding-bottom-lg\">\n                    <div class=\"inner-container display-table\">\n                            <span class=\"content font-italic\">\n                                Check and update your details\n                            </span>\n                            <span class=\"content icon-container display-table-cell\">\n                                <i class=\"fa fa-building-o fa-3x\"></i>\n                            </span>\n                    </div>\n                </div>\n                <button class=\"btn btn-secondary btn-width-lg\" ng-click=\"redirectTo(\'setup.lender.details\')\" ng-disabled=\"getStepStatus(\'companyDetailsConfirmed\')\">{{companyConfirmBtn}}</button>\n            </div>\n        </div>\n\n        <div class=\"col-sm-12 col-md-6\">\n            <div class=\"card card-block bg-lightbeige\"\n                ng-class=\"(getStepStatus(\'bankAccountTestSent\') && getStepStatus(\'bankAccountConfirmed\')) ||\n                          (!getStepStatus(\'companyDetailsConfirmed\') ||\n                          !getStepStatus(\'tsCsConfirmed\') ||\n                          !getStepStatus(\'clientCompletedRiskProfile\'))\n                          ? \'bg-grey\' : \'bg-lightbeige\'\n                          \">\n                <h3 class=\"card-title font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">Manage My Bank Accounts</h3>\n                <div class=\"card-text padding-bottom-lg\">\n                    <div class=\"inner-container display-table\">\n                            <span class=\"content font-italic\">\n                                Enter and confirm bank account details and authentication process\n                            </span>\n                            <span class=\"content icon-container display-table-cell\">\n                                <i class=\"fa fa-bank fa-3x\"></i>\n                            </span>\n                    </div>\n                </div>\n                <button class=\"btn btn-secondary btn-width-lg\" ng-click=\"redirectTo(\'setup.lender.accounts.authenticate\')\" ng-disabled=\"!(!getStepStatus(\'bankAccountTestSent\') &&\n                         getStepStatus(\'companyDetailsConfirmed\') &&\n                         getStepStatus(\'clientCompletedRiskProfile\') &&\n                         getStepStatus(\'tsCsConfirmed\'))\">Setup Account</button>\n\n                <button class=\"btn btn-secondary btn-width-lg\" ng-click=\"redirectTo(\'setup.lender.accounts.verify\')\" ng-disabled=\"!(getStepStatus(\'bankAccountTestSent\') && !getStepStatus(\'bankAccountConfirmed\'))\">Confirm Account</button>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"row\">\n        <div class=\"col-sm-12 col-md-6\">\n            <div class=\"card card-block\" ng-class=\"!getStepStatus(\'companyDetailsConfirmed\') || getStepStatus(\'tsCsConfirmed\') ? \'bg-grey\' : \'bg-lightbeige\'\">\n                <h3 class=\"card-title font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">Confirm Terms and Conditions</h3>\n                <div class=\"card-text padding-bottom-lg\">\n                    <div class=\"inner-container display-table\">\n                            <span class=\"content font-italic \">\n                                Confirm and view terms and conditions of the service\n                            </span>\n                            <span class=\"content icon-container display-table-cell\">\n                                <i class=\"fa fa-file-text-o fa-3x\"></i>\n                            </span>\n                    </div>\n                </div>\n                <button class=\"btn btn-secondary btn-width-lg\" ng-click=\"redirectTo(\'setup.lender.terms\')\" ng-disabled=\"!(!getStepStatus(\'tsCsConfirmed\') && getStepStatus(\'companyDetailsConfirmed\'))\">Terms of Service</button>\n            </div>\n        </div>\n\n        <div class=\"col-sm-12 col-md-6\">\n            <div class=\"card card-block bg-grey\">\n                <h3 class=\"card-title font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">Confirm My Deposit</h3>\n                <div class=\"card-text padding-bottom-lg\">\n                    <div class=\"inner-container display-table\">\n                            <span class=\"content font-italic\">\n                                Recover PeerPay bank details and confirm deposit of funds\n                            </span>\n                            <span class=\"content icon-container display-table-cell\">\n                                <i class=\"fa fa-warning fa-3x\"></i>\n                            </span>\n                    </div>\n                </div>\n                <button class=\"btn btn-secondary btn-width-lg\" ng-click=\"redirectTo(\'setup.lender.deposit\')\" ng-disabled=\"!getStepStatus(\'bankAccountConfirmed\') || getStepStatus(\'depositPaymentConfirmed\')\">Confirm Deposit</button>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"row\">\n        <div class=\"col-sm-12 col-md-6\">\n            <div class=\"card card-block\" ng-class=\"!getStepStatus(\'companyDetailsConfirmed\') || getStepStatus(\'clientCompletedRiskProfile\') ? \'bg-grey\' : \'bg-lightbeige\'\">\n                <h3 class=\"card-title font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">Manage Investor Risk Profile</h3>\n                <div class=\"card-text padding-bottom-lg\">\n                    <div class=\"inner-container display-table\">\n                            <span class=\"content font-italic\">\n                                View and complete your investor risk profile information\n                            </span>\n                            <span class=\"content icon-container display-table-cell\">\n                                <i class=\"fa fa-warning fa-3x\"></i>\n                            </span>\n                    </div>\n                </div>\n                <button class=\"btn btn-secondary btn-width-lg\" ng-click=\"redirectTo(\'setup.lender.risk\')\" ng-disabled=\"!(!getStepStatus(\'clientCompletedRiskProfile\') && getStepStatus(\'companyDetailsConfirmed\'))\">Risk Profile</button>\n            </div>\n        </div>\n\n    </div>\n</div>");
$templateCache.put("setup/lender/risk-confirm.html","<div>\n    <div class=\"form-group row\">\n        <div class=\"col-md-8 col-md-offset-2\">\n\n            <div class=\"card card-block\">\n                <h5 class=\"card-title text-xs-center\">PeerPay Execution Only Notice</h5>\n                <p class=\"card-text\">\n                    I, {{vm.firstName}} {{vm.lastName}} <span ng-show=\"vm.client.clientName\">of {{vm.client.clientName}}</span> , confirm my intention to invest the sum of &pound;{{vm.client.clientData.lenderRiskProfile.depositAmount}}.\n                    <br />\n                    As a Sophisticated Investor, I agree and confirm that:\n                <ol>\n                    <li>I am aware that the transaction is execution only</li>\n                    <li>I have not asked for or received advice</li>\n                    <li>It is my decision alone to make the investment</li>\n                    <li>PeerPay takes no responsibility for the product\'s suitability.</li>\n                </ol>\n                <br />\n                Dated: {{todaysDate | date:\'dd-MM-yyyy\'}}\n                </p>\n                <div class=\"text-xs-center\">\n                    <a type=\"submit\" ng-click=\"ppForm.$valild && putRiskProfile(ppForm)\" class=\"btn btn-primary btn-width-lg\">Accept Terms</a>\n                    <a class=\"btn btn-primary btn-width-lg\" disabled>Print Notice</a>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>");
$templateCache.put("setup/lender/risk-profile.html","<div class=\"col-md-12 padding-lg bg-ppLightBlue borderless border-radius-md\">\n    <form name=\"ppForm\"\n          novalidate>\n\n        <div class=\"form-group row padding-y-lg\">\n            <div class=\"col-md-10 col-md-offset-1\n                        padding-y-lg font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">\n                Lender Risk Profile\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"lenderType\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Source of funds</label>\n            <div class=\"col-md-6\">\n                <input type=\"text\"\n                       id=\"lenderType\"\n                       name=\"lenderType\"\n                       class=\"form-control\"\n                       ng-model=\"vm.client.lenderType\"\n                       disabled\n                       >\n            </div>\n        </div>\n\n        <div class=\"form-group row margin-bottom-md\">\n            <label for=\"availableFundsAmount\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Amount of available funds</label>\n            <div class=\"col-md-6\">\n                <div class=\"input-group\">\n                    <span class=\"input-group-addon\" id=\"basic-addon1\">&pound;</span>\n                    <input type=\"number\"\n                           id=\"availableFundsAmount\"\n                           name=\"availableFundsAmount\"\n                           class=\"form-control\"\n                           required\n                           ng-model=\"vm.client.clientData.lenderRiskProfile.availableFundsAmount\"\n                           >\n                </div>\n            </div>\n            <div ng-messages=\"ppForm.availableFundsAmount.$error\"\n                 ng-if=\"ppForm.$submitted\"\n                 class=\"text-color-danger\"\n                 role=\"alert\">\n                <div ng-message=\"required\">* Required </div>\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"depositAmount\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Value of funds to be deposited with PeerPay</label>\n            <div class=\"col-md-6\">\n                <div class=\"input-group\">\n                    <span class=\"input-group-addon\" id=\"basic-addon1\">&pound;</span>\n                    <input type=\"number\"\n                           id=\"depositAmount\"\n                           name=\"depositAmount\"\n                           class=\"form-control\"\n                           required\n                           ng-model=\"vm.client.clientData.lenderRiskProfile.depositAmount\"\n                           smaller-or-equal=\"vm.client.clientData.lenderRiskProfile.availableFundsAmount\"\n                           >\n                </div>\n                <div ng-messages=\"ppForm.depositAmount.$error\"\n                     ng-if=\"ppForm.$submitted\"\n                     class=\"text-color-danger\"\n                     role=\"alert\">\n                    <div ng-message=\"required\">* Required </div>\n                </div>\n                <div ng-messages=\"ppForm.depositAmount.$error\"\n                     ng-if=\"ppForm.$dirty\"\n                     class=\"text-color-danger\"\n                     role=\"alert\">\n                    <div ng-message=\"smallerOrEqual\">Value of funds deposited must be smaller or equal to available funds</div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"form-group row margin-bottom-md\">\n            <label for=\"company-number\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Loads Accountants confirmation of Amount of available funds</label>\n            <p>FILE UPLOAD TO GO HERE</p>\n        </div>\n\n        <div class=\"form-group row margin-bottom-md\">\n            <label for=\"financialYearEnd\" class=\"col-md-3 col-md-offset-1 form-control-label text-spaced-xs text-xs-right\">Date of Company Financial Year End</label>\n            <div class=\"col-md-6\">\n                <!-- <input type=\"text\"\n                       id=\"financialYearEnd\"\n                       name=\"financialYearEnd\"\n                       class=\"form-control\"\n                       required\n                       ng-model=\"vm.client.clientData.lenderRiskProfile.financialYearEnd\"\n                       > -->\n                <div class=\"row\">\n                    <div class=\"col-sm-6\">\n                        <select id=\"financialYearEndDay\" name=\"financialYearEndDay\" class=\"form-control\"\n                                ng-model=\"vm.client.clientData.lenderRiskProfile.financialYearEndDay\"\n                                ng-options=\"o for o in {{days}}\"\n                                required>\n                                <option value=\"\">dd</option>\n                        </select>\n                        <div ng-messages=\"ppForm.financialYearEndDay.$error\"\n                             ng-if=\"ppForm.$submitted\"\n                             class=\"text-color-danger\"\n                             role=\"alert\"\n                             required>\n                            <div ng-message=\"required\">* Required </div>\n                        </div>\n                    </div>\n                    <div class=\"col-sm-6\">\n                        <select id=\"financialYearEndMonth\" name=\"financialYearEndMonth\" class=\"form-control\"\n                                ng-model=\"vm.client.clientData.lenderRiskProfile.financialYearEndMonth\"\n                                ng-options=\"o for o in {{months}}\"\n                                required>\n                                <option value=\"\">mm</option>\n                        </select>\n                        <div ng-messages=\"ppForm.financialYearEndMonth.$error\"\n                             ng-if=\"ppForm.$submitted\"\n                             class=\"text-color-danger\"\n                             role=\"alert\">\n                            <div ng-message=\"required\">* Required </div>\n                        </div>\n                    </div>\n                </div>\n\n            </div>\n            <div ng-messages=\"ppForm.financialYearEnd.$error\"\n                 ng-if=\"ppForm.$submitted\"\n                 class=\"text-color-danger\"\n                 role=\"alert\">\n                <div ng-message=\"required\">* Required </div>\n            </div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"col-md-12\">\n                <div id=\"details_form\" ng-repeat=\"field in forms.lenderRiskProfile\">\n                    <dropdown-field field=\"field\"></dropdown-field>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row bg-light-gray padding-left-sm padding-top-sm\">\n            <p>Lending Spread by risk levels</p>\n            <div class=\"col-md-12 col-sm-12\">\n                <div class=\"form-group row\">\n                    <label for=\"depositAmount\" class=\"col-md-3 form-control-label text-spaced-xs text-xs-right\"><span class=\"text-color-green\">LOW</span></label>\n                    <div class=\"col-md-9\">\n\n                        <select id=\"lendSpreadLowPercentage\"\n                                name=\"lendSpreadLowPercentage\"\n                                class=\"form-control\"\n                                ng-model=\"vm.client.clientData.lenderRiskProfile.lendSpreadLowPercentage\"\n                                ng-options=\"o for o in {{percentages}}\"\n                                required>\n                                <option value=\"\">Select</option>\n                        </select>\n\n                        <div ng-messages=\"ppForm.lendSpreadLowPercentage.$error\"\n                             ng-if=\"ppForm.$submitted\"\n                             class=\"text-color-danger\"\n                             role=\"alert\">\n                            <div ng-message=\"required\">* Required </div>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"form-group row\">\n                    <label for=\"depositAmount\" class=\"col-md-3 form-control-label text-spaced-xs text-xs-right\"><span class=\"text-color-amber\">MEDIUM</span></label>\n                    <div class=\"col-md-9\">\n                        <select id=\"lendSpreadMediumPercentage\"\n                                name=\"lendSpreadMediumPercentage\"\n                                class=\"form-control\"\n                                ng-model=\"vm.client.clientData.lenderRiskProfile.lendSpreadMediumPercentage\"\n                                ng-options=\"o for o in {{percentages}}\"\n                                required>\n                                <option value=\"\">Select</option>\n                        </select>\n\n                        <div ng-messages=\"ppForm.lendSpreadMediumPercentage.$error\"\n                             ng-if=\"ppForm.$submitted\"\n                             class=\"text-color-danger\"\n                             role=\"alert\">\n                            <div ng-message=\"required\">* Required </div>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"form-group row\">\n                    <label for=\"depositAmount\" class=\"col-md-3 form-control-label text-spaced-xs text-xs-right\"><span class=\"text-color-red\">HIGH</span></label>\n                    <div class=\"col-md-9\">\n                        <select id=\"lendSpreadHighPercentage\"\n                                name=\"lendSpreadHighPercentage\"\n                                class=\"form-control\"\n                                ng-model=\"vm.client.clientData.lenderRiskProfile.lendSpreadHighPercentage\"\n                                ng-options=\"o for o in {{percentages}}\"\n                                required>\n                                <option value=\"\">Select</option>\n                        </select>\n                        <div ng-messages=\"ppForm.lendSpreadHighPercentage.$error\"\n                             ng-if=\"ppForm.$submitted\"\n                             class=\"text-color-danger\"\n                             role=\"alert\">\n                            <div ng-message=\"required\">* Required </div>\n                        </div>\n                    </div>\n                </div>\n\n                <div\n                     ng-show=\"percentageError\"\n                     class=\"text-color-danger\"\n                     role=\"alert\">\n                    <div ng-show=\"percentageError\">Percentages must add up to 100%</div>\n                </div>\n            </div>\n        </div>\n\n        <!-- @todo add form table for lending spread by risk levels -->\n\n        <!-- @endif -->\n\n        <div ui-view>\n            <div class=\"form-group row margin-top-md\">\n                <div class=\"col-md-offset-4 col-md-6\">\n                    <button class=\"btn btn-primary btn-block\" ng-click=\"confirmRiskProfile(ppForm, $event)\" >\n                        Save\n                    </button>\n                    <button class=\"btn btn-link btn-block btn-sm\">\n                        Cancel\n                    </button>\n                </div>\n            </div>\n        </div>\n\n    </form>\n</div>\n");
$templateCache.put("setup/lender/terms.html","<div class=\"col-md-6 col-md-offset-3 padding-lg bg-ppLightBlue borderless border-radius-md\">\n    <form ng-submit=\"confirmTermsOfService()\">\n\n        <div class=\"form-group row padding-y-lg\">\n            <div class=\"col-md-10 col-md-offset-1\n                        padding-y-lg font-size-ml text-spaced-sm font-weight-bold text-color-ppNavyBlue\">\n                Confirm Terms of Service\n            </div>\n        </div>\n\n        <p>To proceed with your registration on the service you are required to confirm that:</p>\n        <ol>\n            <li>You meet the criteria neccessary for a Sophisticated Investor</li>\n            <li>Your accept the Terms of Service</li>\n        </ol>\n\n\n        <div class=\"form-group row\">\n            <label for=\"company-name\" class=\"col-md-12 form-control-label text-spaced-xs font-weight-bold\">Sophisticated investor Criteria</label>\n            <div class=\"col-md-12\">\n                <!-- @todo Sophisticated Terms of service to be injected here -->\n                <div>{{config.termsLenderSophisticatedInvestor.content}}</div>\n            </div>\n        </div>\n\n        <div class=\"form-group row\">\n            <label for=\"company-name\" class=\"col-md-12 form-control-label text-spaced-xs font-weight-bold\">Terms of Service</label>\n            <div class=\"col-md-12\">\n                <!-- @todo Terms of service to be injected here -->\n                <div>{{config.termsLenderTermsOfService.content}}</div>\n            </div>\n        </div>\n\n        <div class=\"form-group row margin-top-md\">\n            <div class=\"col-md-offset-4 col-md-6\">\n                <button class=\"btn btn-primary btn-block\" type=\"submit\">\n                    Confirm &amp; Continue\n                </button>\n                <button class=\"btn btn-link btn-block btn-sm\" ng-click=\"cancelTermsOfService($event)\">\n                    Cancel\n                </button>\n            </div>\n        </div>\n\n    </form>\n</div>\n");}]); }());