(function() {
'use strict';

  angular
    .module('ParametroList',[])
    .config(config)
    .controller('ParametroListController', ParametroListController);

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.parametro-list',{
        url : '/parametros/list',
        templateProvider : templateProvider,
        controller : 'ParametroListController',
        controllerAs : 'vm',
        resolve : {
          parametroFindAllPreService : parametroFindAllPreService,
          getValorParametroPreService : getValorParametroPreService
        }
      });
  };
  
  parametroFindAllPreService.$inject = ['ParametroService'];
  function parametroFindAllPreService(ParametroService){
    return ParametroService.parametroFindByParameter('',1);
  }
  
  getValorParametroPreService.$inject = ['ParametroService','parametroFindAllPreService'];
  function getValorParametroPreService(ParametroService, parametroFindAllPreService){
    return ParametroService.getValores();
  }

  templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
  function templateProvider(TemplateUrlPathFactory, $templateFactory){
    var url = TemplateUrlPathFactory.getPathUrlGeral() + '/parametro/parametro-list.html';
    return $templateFactory.fromUrl(url);
  };

  ParametroListController.$inject = ['ParametroService','parametroFindAllPreService','UrlService','ModalConfirmationService','message','getValorParametroPreService','$filter'];
  function ParametroListController(ParametroService,parametroFindAllPreService, UrlService, ModalConfirmationService, message, getValorParametroPreService, $filter) {
    var vm = this;
    vm.parametros = parametroFindAllPreService;
    vm.parametroFindByParameter = parametroFindByParameter;
    vm.create = create;
    vm.encerrarVigencia = encerrarVigencia;
    vm.goToEdit = goToEdit;
    vm.isVigenciaEncerrada = isVigenciaEncerrada;
    vm.getTipoValor = getTipoValor;
    vm.getValorPeloTipo = getValorPeloTipo;
    init();
    
    function init(){
      vm.pageNumber = 1;
      vm.busca = ''
    }
    function parametroFindByParameter(pageNumber) {
      vm.pageNumber = pageNumber ? pageNumber : 1;
      return ParametroService.parametroFindByParameter(vm.busca,vm.pageNumber)
        .then(function(parametros){
          vm.parametros = parametros;
          return vm.parametros; 
        });
    }
    
    function create(){
      UrlService.go('app.parametro-create');
    }
    
    function encerrarVigencia(parametro){
      if(isVigenciaEncerrada(parametro))
        return;
      var conteudoModal = {
        header: 'Encerrar vigência parâmetro',
        text: 'Tem certeza que deseja ENCERRAR a vigência do parâmetro:',
        target: parametro.parametronome
      };

      ModalConfirmationService
        .confirmation(conteudoModal)
        .then(function(){
          ParametroService
            .encerrarVigencia(parametro)
	          .then(function(response){
              message.success('Parâmetro com vigência encerrada. ');
              parametroFindByParameter('',vm.pageNumber);
            });
        });
    }
    
    function goToEdit(parametro){
      if(isVigenciaEncerrada(parametro))
        return;
      UrlService.go('app.parametro-edit',{id:parametro.id});
    }
    
    function isVigenciaEncerrada(parametro){
      return parametro.statusvigencia == 'ENCERRADA';
    }
    
    function getTipoValor(key){
      return ParametroService.getTipoValor(key).value;
    }
    
    function getValorPeloTipo(param){
      switch(param.tipovalorparametro){
        case 'DATE':
          return $filter('date')(new Date(param.valor),'dd/MM/yyyy')
       default :
        return param.valor
      }
    }
  }
})();