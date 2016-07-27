(function(){
'use strict';  
angular
  .module('UsuarioList',[])
  .config(config)
  .controller('UsuarioListController',UsuarioListController);

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.usuario-list',{
        url : '/usuarios/list',
        templateProvider : templateProvider,
        controller : 'UsuarioListController',
        controllerAs : 'vm',
        resolve : {
          usuarioPreService : usuarioPreService
        }
      });

    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/usuario/usuario-list.html';
      return $templateFactory.fromUrl(url);
    }

    usuarioPreService.$inject = ['UsuarioService', '$stateParams'];
    function usuarioPreService(UsuarioService, $stateParams){
      var id = $stateParams.id;
      return UsuarioService.findAll(1);
    }
  }

  UsuarioListController.$inject = ['UrlService','UsuarioService', 'usuarioPreService', 'ModalConfirmationService', 'message'];
  function UsuarioListController(UrlService, UsuarioService, usuarioPreService, ModalConfirmationService, message){
    var vm = this;
    vm.usuario = usuarioPreService;
    vm.pageNumber = 1;
    vm.parametroBusca = ''; 
    vm.inativar = inativar;
    vm.ativar = ativar;
    vm.create = create;
    vm.goToEdit = goToEdit;
    vm.findUsuario = findUsuario;
    vm.definirPerfisDeUsuario = definirPerfisDeUsuario;

    function inativar(user){
      var contentModal = {
        header: 'Inativar usuário.',
        text: 'Tem certeza que deseja INATIVAR o usuário:',
        target: user.nome          
      };

      ModalConfirmationService
        .confirmation(contentModal)
        .then(function(){
          UsuarioService
            .inativar(user)
            .then(successInativarUsuario);
        });

        function successInativarUsuario(response){
          if(response.status == 200){
            message.success('Usuario inativado com successo.');
            findUsuario(vm.pageNumber);
          }
        }
    }

    function ativar(user){
      var contentModal = {
        header: 'Ativar usuário.',
        text: 'Tem certeza que deseja ATIVAR o usuário:',
        target: user.nome          
      };

      ModalConfirmationService
        .confirmation(contentModal)
        .then(function(){
          UsuarioService
            .ativar(user)
            .then(successAtivarUsuario);
        });

        function successAtivarUsuario(response){
          if(response.status == 200){
            message.success('Usuario ativado com successo.');
            findUsuario(vm.pageNumber);
          }
        }
    }

    function create(){
      UrlService.go('app.usuario-create');
    }

    function goToEdit(id){
      UrlService.go('app.usuario-edit',{id:id});
    }

    function findUsuario(parametro, pageNumber){      
     if(!pageNumber)
      vm.pageNumber = 1;
      if(!parametro)
        vm.parametroBusca = '';
      UsuarioService
        .findByParams(vm.parametroBusca, vm.pageNumber)
        .then(successFindUsuarioByParams);
    }

    function successFindUsuarioByParams(response){
      vm.usuario = response.data;
    }

    function definirPerfisDeUsuario(usuario){
    	UrlService.go('app.perfilDeUsuario-list',{id:usuario.id});
    }
  }
}())