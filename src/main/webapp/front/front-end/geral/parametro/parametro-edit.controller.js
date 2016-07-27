(function() {
'use strict';

  angular
    .module('ParametroEdit',[])
    .config(config)
    .controller('ParametroEditController', ParametroEditController);
    
  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.parametro-edit',{
        url : '/parametros/:id/edit',
        templateProvider : templateProvider,
        controller : 'ParametroEditController',
        controllerAs : 'vm',
        resolve : {
          getNameParametroPreService : getNameParametroPreService,
          getValorParametroPreService : getValorParametroPreService,
          getParametroFindByIdPreService : getParametroFindByIdPreService
        }
      });
  };
  
  templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
  function templateProvider(TemplateUrlPathFactory, $templateFactory){
    var url = TemplateUrlPathFactory.getPathUrlGeral() + '/parametro/parametro-create.html';
    return $templateFactory.fromUrl(url);
  };
  
  getNameParametroPreService.$inject = ['ParametroService','context'];
  function getNameParametroPreService(ParametroService,context){
    return ParametroService.getParametros();
  }
  
  getValorParametroPreService.$inject = ['ParametroService','getNameParametroPreService'];
  function getValorParametroPreService(ParametroService, getNameParametroPreService){
    return ParametroService.getValores();
  }
  
  getParametroFindByIdPreService.$inject = ['getValorParametroPreService','$stateParams','ParametroService'];
  function getParametroFindByIdPreService(getValorParametroPreService, $stateParams, ParametroService){
    return ParametroService.getParametroFindById($stateParams.id);
  }

  ParametroEditController.$inject = ['ParametroService','getNameParametroPreService','getValorParametroPreService','UrlService', 'getParametroFindByIdPreService' ,'message'];
  function ParametroEditController(ParametroService, getNameParametroPreService, getValorParametroPreService, UrlService, getParametroFindByIdPreService , message) {
    var vm = this;
    vm.backToList = backToList;
    vm.save = save;
    vm.isEditing = isEditing;
    vm.removerValor = removerValor; 
    init();
    
    function init(){
      vm.patternUuid = '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
      vm.parametros = getNameParametroPreService;
      vm.valores = getValorParametroPreService;
      vm.getEmpresaFindByUsuario = getEmpresaFindByUsuario;
      vm.parametro = getParametroFindByIdPreService;
    }
    
    function removerValor(){
      delete vm.parametro.valor
    }
    
    function backToList(){
      UrlService.go('app.parametro-list');
    }
    
    function getEmpresaFindByUsuario(parameter){
      return ParametroService.getEmpresaFindByUsuario(parameter).then(function(empresas){
        return empresas;
      });
    }
    
    function save(){
      ParametroService.edit(vm.parametro).then(function(response){
        message.success('Parâmetro editado com sucesso.');
        delete vm.parametro;
        UrlService.go('app.parametro-list');
      });
    }
    
    function isEditing(){
      return angular.isDefined(vm.parametro) && angular.isDefined(vm.parametro.entityId);
    }
  }
})();