(function() {
    'use strict';

    angular
        .module('pontoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('feriado', {
            parent: 'entity',
            url: '/feriado?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Feriados'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/feriado/feriados.html',
                    controller: 'FeriadoController',
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
        .state('feriado-detail', {
            parent: 'entity',
            url: '/feriado/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Feriado'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/feriado/feriado-detail.html',
                    controller: 'FeriadoDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Feriado', function($stateParams, Feriado) {
                    return Feriado.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('feriado.new', {
            parent: 'feriado',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/feriado/feriado-dialog.html',
                    controller: 'FeriadoDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('feriado', null, { reload: true });
                }, function() {
                    $state.go('feriado');
                });
            }]
        })
        .state('feriado.edit', {
            parent: 'feriado',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/feriado/feriado-dialog.html',
                    controller: 'FeriadoDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Feriado', function(Feriado) {
                            return Feriado.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('feriado', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('feriado.delete', {
            parent: 'feriado',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/feriado/feriado-delete-dialog.html',
                    controller: 'FeriadoDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Feriado', function(Feriado) {
                            return Feriado.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('feriado', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
