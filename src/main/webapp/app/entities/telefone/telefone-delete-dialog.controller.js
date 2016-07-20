(function() {
    'use strict';

    angular
        .module('pontoApp')
        .controller('TelefoneDeleteController',TelefoneDeleteController);

    TelefoneDeleteController.$inject = ['$uibModalInstance', 'entity', 'Telefone'];

    function TelefoneDeleteController($uibModalInstance, entity, Telefone) {
        var vm = this;

        vm.telefone = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Telefone.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
