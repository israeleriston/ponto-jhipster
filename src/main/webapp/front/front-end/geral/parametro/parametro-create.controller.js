(function() {
'use strict';

  angular
    .module('ParametroCreate',[])
    .config(config)
    .controller('ParametroCreateController', ParametroCreateController);
    
  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.parametro-create',{
        url : '/parametros/create',
        templateProvider : templateProvider,
        controller : 'ParametroCreateController',
        controllerAs : 'vm',
        resolve : {
          getNameParametroPreService : getNameParametroPreService,
          getValorParametroPreService : getValorParametroPreService
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
  function getValorParametroPreService(ParametroService,getNameParametroPreService){
    return ParametroService.getValores();
  }

  ParametroCreateController.$inject = ['ParametroService','getNameParametroPreService','getValorParametroPreService','UrlService','message'];
  function ParametroCreateController(ParametroService, getNameParametroPreService, getValorParametroPreService, UrlService,message) {
    var vm = this;
    vm.backToList = backToList;
    vm.save = save;
    vm.removerValor = removerValor;
    init();
    
    function init(){
      vm.patternUuid = '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
      vm.parametros = getNameParametroPreService;
      vm.valores = getValorParametroPreService;
      vm.getEmpresaFindByUsuario = getEmpresaFindByUsuario;
      vm.parametro = {
        inicioVigencia : new Date()
      }
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
      ParametroService.create(new ParametroService.Parametro(vm.parametro)).then(function(response){
        message.success('Parâmetro salvo com sucesso.');
        init();
      })
    }
  }
})();