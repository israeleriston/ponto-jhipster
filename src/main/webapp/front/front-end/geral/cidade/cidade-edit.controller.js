(function(){  
'use strict';
angular
  .module('CidadeEdit',[])
  .config(config)
  .controller('CidadeEditController',CidadeEditController)
  ;

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.cidade-edit',{
        url : '/cidades/:id/edit',
        templateProvider : templateProvider,
        controller : 'CidadeEditController',
        controllerAs : 'vm',
        resolve : {
          cidadePreService : cidadePreService
        }
      });
    
    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/cidade/cidade-create.html';
      return $templateFactory.fromUrl(url);
    }

    cidadePreService.$inject = ['CidadeService', '$stateParams'];
    function cidadePreService(CidadeService, $stateParams){
      var id = $stateParams.id;
      return CidadeService.get(id);
    }
  }

   CidadeEditController.$inject = ['UrlService', 'CidadeService', 'cidadePreService', 'UnidadeFederativaService', 'message'];

  function CidadeEditController(UrlService, CidadeService, cidadePreService, UnidadeFederativaService, message){
    var vm = this;
    vm.cidade = init(cidadePreService.data);
    vm.backToList = backToList;
    vm.save = save;
    vm.getUfs = getUfs;

    function init(data){
       getUnidadeFederativa(data.unidadeFederativaId);
       return data;
    }

    function getUfs(search){
      return UnidadeFederativaService
              .getUnidadesFederativas(search)
              .then(getUnidadesFederativasSuccess);
    }

    function getUnidadesFederativasSuccess(response){
      return response.data;
    }

    function save(){
      vm.cidade.unidadeFederativaId = vm.unidadeFederativa.id;	
      CidadeService
        .edit(vm.cidade)
        .then(cidadeEditSuccess);
    }

    function cidadeEditSuccess(response){
      vm.cidade = {};
      delete vm.unidadeFederativa;
      message.success('Cidade editada com sucesso.');
      backToList()
    }

    function backToList(){
      UrlService.go('app.cidade-list');
    }

    function getUnidadeFederativa(unidadeFederativaId){
      UnidadeFederativaService
        .get(unidadeFederativaId.value)
        .then(getUnidadeFerativaSuccess);

      function getUnidadeFerativaSuccess(response){
        vm.unidadeFederativa = response.data;
      }
    }
  }
}())
