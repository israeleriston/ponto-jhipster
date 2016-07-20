(function() {
    'use strict';

    angular
        .module('pontoApp')
        .controller('HoraDetailController', HoraDetailController);

    HoraDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Hora', 'Dia'];

    function HoraDetailController($scope, $rootScope, $stateParams, entity, Hora, Dia) {
        var vm = this;

        vm.hora = entity;

        var unsubscribe = $rootScope.$on('pontoApp:horaUpdate', function(event, result) {
            vm.hora = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
