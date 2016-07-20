(function() {
    'use strict';

    angular
        .module('pontoApp')
        .controller('FeriadoDialogController', FeriadoDialogController);

    FeriadoDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', '$q', 'entity', 'Feriado', 'Dia'];

    function FeriadoDialogController ($timeout, $scope, $stateParams, $uibModalInstance, $q, entity, Feriado, Dia) {
        var vm = this;

        vm.feriado = entity;
        vm.clear = clear;
        vm.save = save;
        vm.dias = Dia.query({filter: 'feriado-is-null'});
        $q.all([vm.feriado.$promise, vm.dias.$promise]).then(function() {
            if (!vm.feriado.dia || !vm.feriado.dia.id) {
                return $q.reject();
            }
            return Dia.get({id : vm.feriado.dia.id}).$promise;
        }).then(function(dia) {
            vm.dias.push(dia);
        });

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.feriado.id !== null) {
                Feriado.update(vm.feriado, onSaveSuccess, onSaveError);
            } else {
                Feriado.save(vm.feriado, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('pontoApp:feriadoUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
