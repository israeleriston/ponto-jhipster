(function(){  
  'use strict';
  angular
    .module('PerfilDeAcessoList',[])
    .config(config)
    .controller('PerfilDeAcessoListController', PerfilDeAcessoListController)
  ;

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.perfilDeAcesso-list',{
        url : '/perfilDeAcesso/list',
        templateProvider : templateProvider,
        controller : 'PerfilDeAcessoListController as vm',
        resolve : {
          perfilDeAcessoPreService : perfilDeAcessoPreService
        }
      });

    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/perfil-acesso/perfil-acesso-list.html';
      return $templateFactory.fromUrl(url);
    }

    perfilDeAcessoPreService.$inject = ['PerfilDeAcessoService'];
    function perfilDeAcessoPreService(PerfilDeAcessoService){
      return PerfilDeAcessoService.perfilDeAcessoFindAll(1);
    }
  }

  PerfilDeAcessoListController.$inject = ['UrlService','PerfilDeAcessoService','ModalConfirmationService', 'perfilDeAcessoPreService', 'message'];
  function PerfilDeAcessoListController(UrlService, PerfilDeAcessoService,ModalConfirmationService, perfilDeAcessoPreService, message){
    var vm = this;
    vm.pageNumber = 1;
    vm.parametroBusca = '';
    vm.perfisDeAcesso = perfilDeAcessoPreService.data;
    vm.remove = remove;
    vm.edit = edit;
    vm.create = create;
    vm.findPerfisDeAcesso = findPerfisDeAcesso;

    function edit(data){
      UrlService.go('app.perfilDeAcesso-edit',{id:data.id});
    }
    
    function remove (perfilDeAcesso, size) {
        var conteudoModal = {
            header: 'Exclusão de perfil de acesso',
            text: 'Tem certeza que deseja remover o perfil de acesso:',
            target: perfilDeAcesso.nome
        };
        
        ModalConfirmationService
          .confirmation(conteudoModal)
          .then(function(){
            	PerfilDeAcessoService
                .remove(perfilDeAcesso)
                .then(removePerfilDeAcessoSuccess);
            }
        );
    };
    
    function removePerfilDeAcessoSuccess(data){
    	message.success("Perfil de acesso excluído com sucesso");
    	findPerfisDeAcesso(vm.pageNumber);
    };
    
    function create(){
      UrlService.go('app.perfilDeAcesso-create');
    }
    
    function findPerfisDeAcesso(parametro, pageNumber){
        if(!pageNumber)
            vm.pageNumber = 1;
        if(!parametro)
            vm.parametroBusca = '';
        PerfilDeAcessoService
            .perfilDeAcessoFindParameters(vm.parametroBusca, vm.pageNumber)
            .then(findAllSuccess);
    };
    function findAllSuccess(response){
        vm.perfisDeAcesso = response.data;
    };
  }
}())
