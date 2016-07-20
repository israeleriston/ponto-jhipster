(function() {
    'use strict';

    angular
        .module('pontoApp')
        .controller('FeriadoDeleteController',FeriadoDeleteController);

    FeriadoDeleteController.$inject = ['$uibModalInstance', 'entity', 'Feriado'];

    function FeriadoDeleteController($uibModalInstance, entity, Feriado) {
        var vm = this;

        vm.feriado = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Feriado.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
