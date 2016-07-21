(function() {
    'use strict';

    angular
        .module('pontoApp')
        .controller('PessoaDialogController', PessoaDialogController);

    PessoaDialogController.$inject = ['$timeout', '$scope', '$stateParams', 'entity', 'Pessoa','$state'];

    function PessoaDialogController ($timeout, $scope, $stateParams, entity, Pessoa,$state) {
        var vm = this;

        vm.pessoa = entity;
        vm.clear = clear;
        vm.save = save;

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            redirecionar();
        }

        function save () {
            vm.isSaving = true;
            if (vm.pessoa.id !== null) {
                Pessoa.update(vm.pessoa, onSaveSuccess, onSaveError);
            } else {
                Pessoa.save(vm.pessoa, onSaveSuccess, onSaveError);
            }
            redirecionar();
        }

        function redirecionar() {
            $state.go('pessoa', null , {
                reload: true
            });
        }
true
        function onSaveSuccess (result) {
            $scope.$emit('pontoApp:pessoaUpdate', result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
