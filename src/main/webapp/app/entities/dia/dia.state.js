(function() {
    'use strict';

    angular
        .module('pontoApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('dia', {
            parent: 'entity',
            url: '/dia?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Dias'
            },
            views: {
                'conteudo@app': {
                    templateUrl: 'app/entities/dia/dias.html',
                    controller: 'DiaController',
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
        .state('dia-detail', {
            parent: 'entity',
            url: '/dia/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Dia'
            },
            views: {
                'conteudo@app': {
                    templateUrl: 'app/entities/dia/dia-detail.html',
                    controller: 'DiaDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Dia', function($stateParams, Dia) {
                    return Dia.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('dia.new', {
            parent: 'dia',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/dia/dia-dialog.html',
                    controller: 'DiaDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                data: null,
                                feriado: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('dia', null, { reload: true });
                }, function() {
                    $state.go('dia');
                });
            }]
        })
        .state('dia.edit', {
            parent: 'dia',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/dia/dia-dialog.html',
                    controller: 'DiaDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Dia', function(Dia) {
                            return Dia.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('dia', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('dia.delete', {
            parent: 'dia',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/dia/dia-delete-dialog.html',
                    controller: 'DiaDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Dia', function(Dia) {
                            return Dia.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('dia', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
