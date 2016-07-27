(function(){
  'use strict';  
  angular
    .module('PerfilDeUsuarioList', [])
  	.config(config)
  	.controller('PerfilDeUsuarioListController', PerfilDeUsuarioListController);

    config.$inject = ['$stateProvider'];
    function config($stateProvider){
      $stateProvider
        .state('app.perfilDeUsuario-list',{
          url : '/perfilDeUsuario/:id/list',
          templateProvider : templateProvider,
          controller : 'PerfilDeUsuarioListController',
          controllerAs : 'vm',
          resolve : {
            perfilDeUsuarioPreService : perfilDeUsuarioPreService,
            getUser : getUser
          }
        });

      templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
      function templateProvider(TemplateUrlPathFactory, $templateFactory){
        var url = TemplateUrlPathFactory.getPathUrlGeral() + '/perfil-usuario/perfil-usuario-list.html';
        return $templateFactory.fromUrl(url);
      }

      perfilDeUsuarioPreService.$inject = ['PerfilDeUsuarioService', '$stateParams'];
      function perfilDeUsuarioPreService(PerfilDeUsuarioService, $stateParams){
        var id = $stateParams.id;
        return PerfilDeUsuarioService.findAll(id, 1);
      }

      getUser.$inject = ['UsuarioService', '$stateParams'];
  		function getUser(UsuarioService, $stateParams) {
        var id = $stateParams.id;
  			return UsuarioService.get(id);
  		}
    }

  PerfilDeUsuarioListController.$inject = ['UrlService','PerfilDeUsuarioService','perfilDeUsuarioPreService','getUser','ModalConfirmationService','message'];

  function PerfilDeUsuarioListController(UrlService, PerfilDeUsuarioService, perfilDeUsuarioPreService, getUser, ModalConfirmationService, message) {
  	var vm = this;
  	vm.perfisDeUsuario = perfilDeUsuarioPreService.data;
  	vm.user = getUser.data;
    vm.pageNumber = 1;
    vm.parametroBusca = '';
  	vm.create = create;
  	vm.goToEdit = goToEdit;
  	vm.findPerfis = findPerfis;
  	vm.remove = remove;

  	function create() {
      UrlService.go('app.perfilDeUsuario-create', {id:vm.user.id.value});
  	}

  	function goToEdit(id) {
      UrlService.go('app.perfilDeUsuario-edit', {id:id});
  	}

  	function findPerfis(parametro, pageNumber) {
      if(!pageNumber)
        vm.pageNumber = 1;
      if(!parametro)
        vm.parametroBusca = '';
      PerfilDeUsuarioService
        .findByParams(vm.user.id.value, vm.parametroBusca, vm.pageNumber)
        .then(successFindPerfisByParams);
  	}
    
  	function successFindPerfisByParams(response) {
  		vm.perfisDeUsuario = response.data;
  	}

  	function remove(perfilDeUsusario) {
  		var contentModal = {
  			header : 'Exclusão de perfil do usuário.',
  			text : 'Tem certeza que deseja excluir este perfil do usuário:',
  			target : vm.user.nome
  		};

  		ModalConfirmationService
        .confirmation(contentModal)
        .then(function() {
  			 PerfilDeUsuarioService
          .remove(perfilDeUsusario)
          .then(successRemovePerfilDeUsuario);
  		});

  		function successRemovePerfilDeUsuario(response) {
  			if (response.status == 200) {
  				message.success('Perfil de usuário excluído com successo.');
  				findPerfis(vm.pageNumber);
  			}
  		}
  	}
  }
}())