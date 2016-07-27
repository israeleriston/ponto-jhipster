(function() {
  'use strict';
  angular
    .module('EdicaoDeUsuarioDirective', [])
    .directive('edicaoUsuario', edicaoUsuario)
    .controller('ModalEdicaoUsuario', ModalEdicaoUsuario);

  edicaoUsuario.$inject = ['TemplateUrlPathFactory', '$uibModal'];
  function edicaoUsuario(TemplateUrlPathFactory, $uibModal) {
    var directive = {
      restrict: 'E',
      link: link,
      templateUrl: TemplateUrlPathFactory.getPathUrlGeral() + '/usuario/edicao-usuario.directive.html'
    }
    return directive;

    function link(scope, element, attrs) {
      scope.openModal = openModal;

      function openModal(size) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: TemplateUrlPathFactory.getPathUrlGeral() + '/usuario/edicao-usuario.modal.html',
          controller: 'ModalEdicaoUsuario',
          controllerAs: 'vm',
          size: 'lg',
          resolve: {
            preServiceFindUsuario : preServiceFindUsuario
          }
        });
      };
    }
  }
  
              
  preServiceFindUsuario.$inject = ['UsuarioService']
  function preServiceFindUsuario(UsuarioService){
    return UsuarioService.getUsuarioByLogin(1);
  }

  ModalEdicaoUsuario.$inject = ['$uibModalInstance', 'preServiceFindUsuario', 'UsuarioService', 'message'];
  function ModalEdicaoUsuario($uibModalInstance, preServiceFindUsuario, UsuarioService, message) {
    var vm = this
    vm.usuario = preServiceFindUsuario;
    vm.senhaEhDiferenteDeConfirmacao = senhaEhDiferenteDeConfirmacao;
    vm.editar = editar;
    
    function senhaEhDiferenteDeConfirmacao(){
    return angular.isDefined(vm.usuario.senha) && angular.isDefined(vm.usuario.confirmacaoDeSenha) && 
      vm.usuario.senha !== vm.usuario.confirmacaoDeSenha;
    }
    function editar(){
      UsuarioService
        .edit(vm.usuario)
        .then(usuarioEditadoSuccess)
    }
    
    function usuarioEditadoSuccess(response){
      var msg = 'Usuario salvo com successo.';
      message.success(msg);
      vm.close();
    }
    
    vm.close = function() {
      $uibModalInstance.close('fechou');
    };

    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  };

}());