(function() {
    'use strict';

    angular
        .module('pontoApp')
        .controller('FeriadoDetailController', FeriadoDetailController);

    FeriadoDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Feriado', 'Dia'];

    function FeriadoDetailController($scope, $rootScope, $stateParams, entity, Feriado, Dia) {
        var vm = this;

        vm.feriado = entity;

        var unsubscribe = $rootScope.$on('pontoApp:feriadoUpdate', function(event, result) {
            vm.feriado = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
