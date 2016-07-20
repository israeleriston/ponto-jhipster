(function() {
    'use strict';

    angular
        .module('pontoApp')
        .controller('DiaDialogController', DiaDialogController);

    DiaDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Dia', 'Pessoa'];

    function DiaDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Dia, Pessoa) {
        var vm = this;

        vm.dia = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.pessoas = Pessoa.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.dia.id !== null) {
                Dia.update(vm.dia, onSaveSuccess, onSaveError);
            } else {
                Dia.save(vm.dia, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('pontoApp:diaUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.data = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }
})();
