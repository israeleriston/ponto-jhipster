(function() {
    'use strict';

    angular
        .module('pontoApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'Principal', 'LoginService', '$state','Auth'];

    function HomeController ($scope, Principal, LoginService, $state,Auth) {
        var vm = this;

        vm.account = null;
        vm.isAuthenticated = null;
        vm.login = LoginService.open;
        vm.register = register;
        vm.logout = logout;
        $scope.$on('authenticationSuccess', function() {
            getAccount();
        });

        getAccount();

        function getAccount() {
            Principal.identity().then(function(account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
            });
        }
        function register () {
            $state.go('register');
        }

        function logout() {
            Auth.logout();
            console.log('fez logout da applicação');
            $state.go('login', null , {
                reload:true
            });
        }
    }
})();
