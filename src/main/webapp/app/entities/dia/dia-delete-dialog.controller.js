(function() {
    'use strict';

    angular
        .module('pontoApp')
        .controller('DiaDeleteController',DiaDeleteController);

    DiaDeleteController.$inject = ['$uibModalInstance', 'entity', 'Dia'];

    function DiaDeleteController($uibModalInstance, entity, Dia) {
        var vm = this;

        vm.dia = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Dia.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
