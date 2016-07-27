(function(){  
  'use strict';
  angular
    .module('PaisList',[])
    .config(config)
    .controller('PaisListController', PaisListController)
  ;

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.pais-list',{
        url : '/paises/list',
        templateProvider : templateProvider,
        controller : 'PaisListController',
        controllerAs : 'vm',
        resolve : {
          paisPreService : paisPreService
        }
      });

    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/pais/pais-list.html';
      return $templateFactory.fromUrl(url);
    }

    paisPreService.$inject = ['PaisService'];
    function paisPreService(PaisService){
      return PaisService.paisFindParameters('',1);
    }
  }

  PaisListController.$inject = ['UrlService','PaisService', 'paisPreService', 'ModalConfirmationService', 'message'];
  function PaisListController(UrlService, PaisService, paisPreService, ModalConfirmationService, message){
    var vm = this;
    vm.pageNumber = 1;
    vm.parametroBusca = '';
    vm.paises = paisPreService.data;
    vm.edit = edit;
    vm.remove = remove;
    vm.create = create;
    vm.goToEdit = goToEdit;
    vm.findPaises = findPaises;

    function edit(pais){
      UrlService.go('app.pais-edit',{id:pais.id});
    };

    function remove (pais, size) {
      var conteudoModal = {
        header: 'Exclusão de país',
        text: 'Tem certeza que deseja remover o país:',
        target: pais.nome
      };

      ModalConfirmationService
        .confirmation(conteudoModal)
        .then(function(){
          PaisService
            .remove(pais)
	          .then(paisRemoveSuccess);
        });
    };

    function paisRemoveSuccess(data){
      message.success('País excluído com sucesso.');
      UrlService.reload();
    };
    
    function create(){
      UrlService.go('app.pais-create');
    };
    
    function goToEdit(id){
      UrlService.go('app.pais-edit',{id:id});
    };
    
    function findPaises(pageNumber){
      PaisService
        .paisFindParameters(!vm.busca ? '' : vm.busca, pageNumber)
        .then(findAllSuccess);
    }

      function findAllSuccess(response){
        vm.paises = response.data;
      }
  }
}())
