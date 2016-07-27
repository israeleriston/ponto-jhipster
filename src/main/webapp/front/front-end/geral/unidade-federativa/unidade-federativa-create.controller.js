(function(){
'use strict';  
angular
  .module('UnidadeFederativaCreate',[])
  .config(config)
  .controller('UnidadeFederativaCreateController',UnidadeFederativaCreateController)
  ;

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.unidadeFederativa-create',{
        url : '/unidadesFederativas/create',
        templateProvider : templateProvider,
        controller : 'UnidadeFederativaCreateController',
        controllerAs : 'vm'
      });

    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/unidade-federativa/unidade-federativa-create.html';
      return $templateFactory.fromUrl(url);
    }
  }

  UnidadeFederativaCreateController.$inject = ['UrlService','UnidadeFederativaService', 'PaisService', 'message'];
  function UnidadeFederativaCreateController(UrlService, UnidadeFederativaService, PaisService, message){
    var vm = this;
    vm.unidadeFederativa = {};
    vm.save = save;
    vm.backToList = backToList;
    vm.getPaises = getPaises;

    function save(){
      vm.unidadeFederativa.paisId = vm.unidadeFederativa.pais.id;
      UnidadeFederativaService
        .create(vm.unidadeFederativa)
        .then(unidadeFederativaCreateSuccess);
    }

    function backToList(){
      UrlService.go('app.unidadeFederativa-list');
    }

    function unidadeFederativaCreateSuccess(response){
      message.success('Unidade Federativa salva com sucesso.');
      UrlService.reload();
    }

    function getPaises(search){
      return PaisService
        .getPaises(search)
        .then(getPaisesSuccess);
      function getPaisesSuccess(response){
        return response.data;
      }
    }

  }
}())