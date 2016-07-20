/**
 * Created by israeleriston on 19/07/16.
 */
(function () {
    'use strict';

    angular.module('pontoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('login', {
                parent: 'app',
                url: '/login',
                data: {
                    authorities: []
                },
                views: {
                    'content@': {
                        templateUrl: '/app/components/login/login.html',
                        controller: 'LoginController',
                        controllerAs: 'vm'
                    },

                    'menu@': {
                        templateUrl: '/app/components/menu/no-navigation.html'
                    },

                    'navbar@': {
                        templateUrl: '/app/components/navbar/no-navbar.html'
                    }
                }

            })
    }
})();