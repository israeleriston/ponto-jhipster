(function() {
    'use strict';

    angular
        .module('pontoApp')
        .controller('TelefoneDetailController', TelefoneDetailController);

    TelefoneDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Telefone', 'Pessoa'];

    function TelefoneDetailController($scope, $rootScope, $stateParams, entity, Telefone, Pessoa) {
        var vm = this;

        vm.telefone = entity;

        var unsubscribe = $rootScope.$on('pontoApp:telefoneUpdate', function(event, result) {
            vm.telefone = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
