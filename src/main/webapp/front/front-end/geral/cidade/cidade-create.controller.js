(function(){  
'use strict';
angular
  .module('CidadeCreate',[])
  .config(config)
  .controller('CidadeCreateController', CidadeCreateController)
  ; 

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.cidade-create',{
        url : '/cidades/create',
        templateProvider : templateProvider,
        controller : 'CidadeCreateController',
        controllerAs : 'vm'
      });

    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/cidade/cidade-create.html';
      return $templateFactory.fromUrl(url);
    }
  };

  CidadeCreateController.$inject = ['UrlService','CidadeService', 'UnidadeFederativaService', 'message'];
  function CidadeCreateController(UrlService, CidadeService, UnidadeFederativaService, message){
    var vm = this;
    vm.cidade = {};
    vm.save = save;
    vm.backToList = backToList;
    vm.getUfs = getUfs;

    function save(){
      vm.cidade.unidadeFederativaId = vm.unidadeFederativa.id;
      CidadeService
        .create(vm.cidade)
        .then(cidadeCreateSuccess);
    }

    function backToList(){
      UrlService.go('app.cidade-list');
    }

    function cidadeCreateSuccess(response){
      message.success('Cidade salva com sucesso.');
      UrlService.reload();
    }

    function getUfs(search){
      return UnidadeFederativaService
      .ufFindAllSigla(search)
      .then(getSuccess);
    };

    function getSuccess(response){
    	return response.data;
    }
  }
}())