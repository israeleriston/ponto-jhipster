(function() {
    'use strict';

    angular
        .module('pontoApp')
        .controller('HoraDeleteController',HoraDeleteController);

    HoraDeleteController.$inject = ['$uibModalInstance', 'entity', 'Hora'];

    function HoraDeleteController($uibModalInstance, entity, Hora) {
        var vm = this;

        vm.hora = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Hora.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
