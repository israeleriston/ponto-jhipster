(function() {
    'use strict';

    angular
        .module('pontoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('home', {
            parent: 'app',
            url: '/',
            data: {
                authorities: ['ROLE_USER'] // TODO usado para requerer acesso para o usuário que não esteja autenticado.
            },
            views: {
                'content@': {
                    templateUrl: 'app/home/home.html',
                    controller: 'HomeController',
                    controllerAs: 'vm'
                },

                'footer@': {
                    templateUrl: '/app/components/footer/no-footer.html'
                }
            }
        });
    }
})();
