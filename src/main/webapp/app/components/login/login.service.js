(function() {
    'use strict';

    angular
        .module('pontoApp')
        .factory('LoginService', LoginService);

    LoginService.$inject = ['$state'];

    function LoginService ($state) {
        var service = {
            open: open
        };

        var modalInstance = null;
        var resetModal = function () {
            console.log('chamou aqui no login.service ao chamar o reset Modal')
            modalInstance = null;
        };

        return service;

        function open () {
            console.log('chamou aqui no login.service ao chamar o open')
            $state.go('login');
        }
    }
})();
