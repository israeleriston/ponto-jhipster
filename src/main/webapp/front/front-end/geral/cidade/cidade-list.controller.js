(function(){  
  'use strict';
  angular
    .module('CidadeList',[])
    .config(config)
    .controller('CidadeListController', CidadeListController)
  ;

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.cidade-list',{
        url : '/cidades/list',
        templateProvider : templateProvider,
        controller : 'CidadeListController as vm',
        resolve : {
          cidadePreService : cidadePreService
        }
      })
    ;

    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/cidade/cidade-list.html';
      return $templateFactory.fromUrl(url);
    }

    cidadePreService.$inject = ['CidadeService'];
    function cidadePreService(CidadeService){
      return CidadeService.cidadeFindAll(1);
    }
  }

  CidadeListController.$inject = ['UrlService','CidadeService', 'cidadePreService','ModalConfirmationService', 'message'];
  function CidadeListController(UrlService, CidadeService, cidadePreService, ModalConfirmationService, message){
    var vm = this;
    vm.pageNumber = 1;
    vm.parametroBusca = '';
    vm.cidades = cidadePreService.data;
    vm.remove = remove;
    vm.create = create;
    vm.goToEdit = goToEdit;
    vm.findCidades = findCidades;

    function create(){
      UrlService.go('app.cidade-create');
    }
    
    function goToEdit(id){
        UrlService.go('app.cidade-edit',{id:id});
    }
    
    function remove (cidade, size) {
        var conteudoModal = {
            header : 'Exclusão de cidade',
            text: 'Tem certeza que deseja remover a cidade:',
            target: cidade.nome
        };

        ModalConfirmationService
          .confirmation(conteudoModal)
          .then(function(){
              	CidadeService
                  .remove(cidade)
  	                .then(removeCidadeSuccess);
          });
    };
    
    function removeCidadeSuccess(data){
    	message.success("Cidade excluída com sucesso");
    	vm.pageNumber = 1;
		findCidades(vm.pageNumber);
		vm.parametroBusca = "";
    };
    
    function findCidades(parametro, pageNumber){
        if(!pageNumber)
            vm.pageNumber = 1;
        if(!parametro)
            vm.parametroBusca = '';
        CidadeService
            .cidadeFindParameters(vm.parametroBusca, vm.pageNumber)
            .then(findAllSuccess);
    };
    function findAllSuccess(response){
      vm.cidades = response.data;
    }
  }
}())
