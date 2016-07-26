(function() {
    'use strict';

    angular
        .module('pontoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('hora', {
            parent: 'entity',
            url: '/hora?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Horas'
            },
            views: {
                'conteudo@app': {
                    templateUrl: 'app/entities/hora/horas.html',
                    controller: 'HoraController',
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
        .state('hora-detail', {
            parent: 'entity',
            url: '/hora/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Hora'
            },
            views: {
                'conteudo@app': {
                    templateUrl: 'app/entities/hora/hora-detail.html',
                    controller: 'HoraDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Hora', function($stateParams, Hora) {
                    return Hora.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('hora.new', {
            parent: 'hora',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/hora/hora-dialog.html',
                    controller: 'HoraDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                data: null,
                                tipoHora: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('hora', null, { reload: true });
                }, function() {
                    $state.go('hora');
                });
            }]
        })
        .state('hora.edit', {
            parent: 'hora',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/hora/hora-dialog.html',
                    controller: 'HoraDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Hora', function(Hora) {
                            return Hora.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('hora', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('hora.delete', {
            parent: 'hora',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/hora/hora-delete-dialog.html',
                    controller: 'HoraDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Hora', function(Hora) {
                            return Hora.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('hora', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
