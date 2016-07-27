(function(){  
  'use strict';
  angular
    .module('UnidadeFederativaList',[])
    .config(config)
    .controller('UnidadeFederativaListController', UnidadeFederativaListController)
  ;

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.unidadeFederativa-list',{
        url : '/unidadesFederativas/list',
        templateProvider : templateProvider,
        controller : 'UnidadeFederativaListController',
        controllerAs : 'vm',
        resolve : {
          unidadeFederativaPreService : unidadeFederativaPreService
        }
      });

    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/unidade-federativa/unidade-federativa-list.html';
      return $templateFactory.fromUrl(url);
    }

    unidadeFederativaPreService.$inject = ['UnidadeFederativaService'];
    function unidadeFederativaPreService(UnidadeFederativaService){
      return UnidadeFederativaService.unidadeFederativaFindAll(1);
    }
  }

  UnidadeFederativaListController.$inject = ['UrlService','UnidadeFederativaService', 'unidadeFederativaPreService','ModalConfirmationService', 'message'];
  function UnidadeFederativaListController(UrlService, UnidadeFederativaService, unidadeFederativaPreService, ModalConfirmationService, message){
    var vm = this;
    vm.pageNumber = 1;
    vm.parametroBusca = '';
    vm.unidadesFederativas = unidadeFederativaPreService.data;
    vm.remove = remove;
    vm.create = create;
    vm.goToEdit = goToEdit;
    vm.getUfs = getUfs;
    vm.findUnidadesFederativas = findUnidadesFederativas;

    function remove(unidadeFederativa, size, indice){
      var conteudoModal = {
            header: 'Exclusão de Unidade Federativa',
            text: 'Tem certeza que deseja remover a Unidade Federativa:',
            target: unidadeFederativa.nome
        };
        ModalConfirmationService
          .confirmation(conteudoModal)
          .then(function(){
              UnidadeFederativaService
                .remove(unidadeFederativa)
                .then(unidadeFederativaRemoveSuccess);
            }
        );
    }

    function unidadeFederativaRemoveSuccess(response){
      message.success('Unidade federativa excluída com sucesso.');
      findUnidadesFederativas(vm.pageNumber);
    }

    function create(){
      UrlService.go('app.unidadeFederativa-create');
    }
    
    function goToEdit(id){
    	UrlService.go('app.unidadeFederativa-edit',{id:id});
    }

    function getUfs(search){
      return UnidadeFederativaService
        .getUnidadesFederativas(search)
        .then(getUnidadesFederativasSuccess);
    }

    function getUnidadesFederativasSuccess(response){
      return response.data;
    }

    function findUnidadesFederativas(parametro, pageNumber){
      if(!pageNumber)
        vm.pageNumber = 1;
      if(!parametro)
         vm.parametroBusca = '';
      UnidadeFederativaService
        .unidadeFederativaFindParameters(vm.parametroBusca, vm.pageNumber)
        .then(unidadeFederativaFindAllSuccess);
    };

    function unidadeFederativaFindAllSuccess(response){
      vm.unidadesFederativas = response.data;
    }
  }
}())