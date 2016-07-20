(function() {
    'use strict';

    angular
        .module('pontoApp')
        .controller('HoraDialogController', HoraDialogController);

    HoraDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Hora', 'Dia'];

    function HoraDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Hora, Dia) {
        var vm = this;

        vm.hora = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.dias = Dia.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.hora.id !== null) {
                Hora.update(vm.hora, onSaveSuccess, onSaveError);
            } else {
                Hora.save(vm.hora, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('pontoApp:horaUpdate', result);
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
