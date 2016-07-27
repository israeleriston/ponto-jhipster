(function(){  
'use strict';
angular
  .module('PaisEdit',[])
  .config(config)
  .controller('PaisEditController',PaisEditController)
  ;

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.pais-edit',{
        url : '/paises/:id/edit',
        templateProvider : templateProvider,
        controller : 'PaisEditController',
        controllerAs : 'vm',
        resolve : {
          paisPreService : paisPreService
        }
      });

    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/pais/pais-create.html';
      return $templateFactory.fromUrl(url);
    }

    paisPreService.$inject = ['PaisService', '$stateParams'];
    function paisPreService(PaisService, $stateParams){
      var id = $stateParams.id;
      return PaisService.get(id);
    }
  }

  PaisEditController.$inject = ['UrlService', 'paisPreService', 'PaisService', 'message'];
  function PaisEditController(UrlService, paisPreService, PaisService, message){
    var vm = this;
    vm.pais = paisPreService.data;
    vm.backToList = backToList;
    vm.save = save;

    function paisGetSuccess(response){
      vm.pais = response.data;
    }

    function save(){
      PaisService
        .edit(vm.pais)
        .then(paisEditSuccess);
    }

    function paisEditSuccess(response){
      message.success('País editado com sucesso.');
      backToList();
    }

    function backToList(){
      UrlService.go('app.pais-list');
    }
  }
}())
