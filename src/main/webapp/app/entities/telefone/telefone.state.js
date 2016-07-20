(function() {
    'use strict';

    angular
        .module('pontoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('telefone', {
            parent: 'entity',
            url: '/telefone?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Telefones'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/telefone/telefones.html',
                    controller: 'TelefoneController',
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
        .state('telefone-detail', {
            parent: 'entity',
            url: '/telefone/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Telefone'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/telefone/telefone-detail.html',
                    controller: 'TelefoneDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Telefone', function($stateParams, Telefone) {
                    return Telefone.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('telefone.new', {
            parent: 'telefone',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/telefone/telefone-dialog.html',
                    controller: 'TelefoneDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                numero: null,
                                tipoTelefone: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('telefone', null, { reload: true });
                }, function() {
                    $state.go('telefone');
                });
            }]
        })
        .state('telefone.edit', {
            parent: 'telefone',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/telefone/telefone-dialog.html',
                    controller: 'TelefoneDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Telefone', function(Telefone) {
                            return Telefone.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('telefone', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('telefone.delete', {
            parent: 'telefone',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/telefone/telefone-delete-dialog.html',
                    controller: 'TelefoneDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Telefone', function(Telefone) {
                            return Telefone.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('telefone', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
