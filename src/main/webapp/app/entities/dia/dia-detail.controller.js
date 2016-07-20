(function() {
    'use strict';

    angular
        .module('pontoApp')
        .controller('DiaDetailController', DiaDetailController);

    DiaDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Dia', 'Pessoa'];

    function DiaDetailController($scope, $rootScope, $stateParams, entity, Dia, Pessoa) {
        var vm = this;

        vm.dia = entity;

        var unsubscribe = $rootScope.$on('pontoApp:diaUpdate', function(event, result) {
            vm.dia = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
