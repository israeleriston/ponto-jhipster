(function(){
  'use strict';
  angular
    .module('PaisCreate',[])
    .config(config)
    .controller('PaisCreateController',PaisCreateController)
    ;

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.pais-create',{
        url : '/paises/create',
        templateProvider : templateProvider,
        controller : 'PaisCreateController',
        controllerAs : 'vm'
      });

    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/pais/pais-create.html';
      return $templateFactory.fromUrl(url);
    }
  };

  PaisCreateController.$inject = ['UrlService','PaisService', 'message'];
  function PaisCreateController(UrlService, PaisService, message){
    var vm = this;
    vm.pais = {};
    vm.save = save;
    vm.backToList = backToList;

    function save(pais){
      PaisService
        .create(vm.pais)
        .then(paisCreateSuccess);
    }

    function backToList(){
      UrlService.go('app.pais-list');
    }

    function paisCreateSuccess(response){
      message.success('País salvo com sucesso!!');
      UrlService.reload();
    }

  }
}())