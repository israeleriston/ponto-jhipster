(function(){
'use strict';  
angular
  .module('UnidadeFederativaEdit',[])
  .config(config)
  .controller('UnidadeFederativaEditController',UnidadeFederativaEditController)
  ;

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.unidadeFederativa-edit',{
        url : '/unidadesFederativas/:id/edit',
        templateProvider : templateProvider,
        controller : 'UnidadeFederativaEditController',
        controllerAs : 'vm',
          resolve : {
            unidadeFederativaPreService : unidadeFederativaPreService
          }
      });

    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/unidade-federativa/unidade-federativa-create.html';
      return $templateFactory.fromUrl(url);
    }

    unidadeFederativaPreService.$inject = ['UnidadeFederativaService', '$stateParams'];
    function unidadeFederativaPreService(UnidadeFederativaService, $stateParams){
      var id = $stateParams.id;
      return UnidadeFederativaService.get(id);
    }
  }

  UnidadeFederativaEditController.$inject = ['UrlService', 'unidadeFederativaPreService', 'UnidadeFederativaService', 'PaisService', 'message'];
  function UnidadeFederativaEditController(UrlService, unidadeFederativaPreService, UnidadeFederativaService, PaisService, message){
    var vm = this;
    vm.unidadeFederativa = init(unidadeFederativaPreService.data);
    vm.backToList = backToList;
    vm.save = save;
    vm.getPaises = getPaises;
    
    function init(data){
      getPais(data.paisId);
      return data;
    }

    function getPaises(search){
        return PaisService
          .getPaises(search)
          .then(getPaisesSuccess);
    }

    function getPaisesSuccess(response){
      return response.data;
    }

    function save(){
      vm.unidadeFederativa.paisId = vm.pais.id;	

      UnidadeFederativaService
        .edit(vm.unidadeFederativa)
        .then(unidadeFederativaEditSuccess);
    }

    function unidadeFederativaEditSuccess(response){
      delete vm.pais;
      message.success('Unidade Federativa editada com sucesso.');
      backToList();
    }

    function backToList(){
      UrlService.go('app.unidadeFederativa-list');
    }

    function getPais(paisId){
      PaisService
        .get(paisId.value)
        .then(getPaisSuccess);

      function getPaisSuccess(response){
        vm.pais = response.data;
      }
    }
  }
}())
