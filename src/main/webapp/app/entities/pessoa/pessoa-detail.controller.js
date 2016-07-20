(function() {
    'use strict';

    angular
        .module('pontoApp')
        .controller('PessoaDetailController', PessoaDetailController);

    PessoaDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Pessoa'];

    function PessoaDetailController($scope, $rootScope, $stateParams, entity, Pessoa) {
        var vm = this;

        vm.pessoa = entity;

        var unsubscribe = $rootScope.$on('pontoApp:pessoaUpdate', function(event, result) {
            vm.pessoa = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
