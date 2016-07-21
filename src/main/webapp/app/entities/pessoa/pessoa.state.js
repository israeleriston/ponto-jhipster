(function () {
    'use strict';

    angular
        .module('pontoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('pessoa', {
                parent: 'entity',
                url: '/pessoa?page&sort&search',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'Pessoas'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/pessoa/pessoas.html',
                        controller: 'PessoaController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    page: {
                        value: '1',
                        squash: true
                    },
                    sort: {
                        value: 'id,asc',
                        squash: true
                    },
                    search: null
                },
                resolve: {
                    pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                        return {
                            page: PaginationUtil.parsePage($stateParams.page),
                            sort: $stateParams.sort,
                            predicate: PaginationUtil.parsePredicate($stateParams.sort),
                            ascending: PaginationUtil.parseAscending($stateParams.sort),
                            search: $stateParams.search
                        };
                    }],
                }
            })
            .state('pessoa-detail', {
                parent: 'entity',
                url: '/pessoa/{id}',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'Pessoa'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/pessoa/pessoa-detail.html',
                        controller: 'PessoaDetailController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    entity: ['$stateParams', 'Pessoa', function ($stateParams, Pessoa) {
                        return Pessoa.get({id: $stateParams.id}).$promise;
                    }]
                }
            })
            .state('pessoa.new', {
                parent: 'pessoa',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER']
                },
                
                views: {
                    'content@': {
                        templateUrl: 'app/entities/pessoa/pessoa-dialog.html',
                        controller: 'PessoaDialogController',
                        controllerAs: 'vm'
                    }
                },
                
                resolve: {
                    entity: function () {
                        return {
                            nome: null,
                            email: null,
                            cpf: null,
                            inscricao: null,
                            id: null
                        };
                    }
                }
            })
            .state('pessoa.edit', {
                parent: 'pessoa',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_USER']
                },

                views:{
                    'content@':{
                        templateUrl: 'app/entities/pessoa/pessoa-dialog.html',
                        controller: 'PessoaDialogController',
                        controllerAs: 'vm'
                    }
                },

                resolve: {
                    entity: ['Pessoa', function (Pessoa) {
                        return Pessoa.get({id: $stateParams.id}).$promise;
                    }]
                }


            })
            .state('pessoa.delete', {
                parent: 'pessoa',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/pessoa/pessoa-delete-dialog.html',
                        controller: 'PessoaDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['Pessoa', function (Pessoa) {
                                return Pessoa.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('pessoa', null, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            });
    }

})();
