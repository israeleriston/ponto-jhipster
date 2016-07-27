(function(){
  'use strict';
  angular
    .module('EmpresaContext',[])
    .config(config)
    .controller('EmpresaContextController',EmpresaContextController);

    config.$inject = ['$stateProvider'];
    function config($stateProvider){
      $stateProvider
        .state('empresa',{
          url : '/empresa',
          templateProvider : templateProvider,
          controller : 'EmpresaContextController',
          controllerAs : 'vm'
        });

      templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
      function templateProvider(TemplateUrlPathFactory, $templateFactory){
        var url = TemplateUrlPathFactory.getPathUrlGeral() + '/empresa/empresa-context.html';
        return $templateFactory.fromUrl(url);
      }
    };

  EmpresaContextController.$inject = ['BusEventsService', 'UrlService', 'EmpresaService', 'localservice', 'LoginService', 'message'];
  function EmpresaContextController(BusEventsService, UrlService, EmpresaService, localservice, LoginService, message){
      var vm = this;
      vm.getEmpresas = getEmpresas;    
      vm.empresaSelected = empresaSelected;
      BusEventsService.on('UsuarioEstaLogadoEvent', usuarioEstaLogadoEvent);
      init();

      function init(){
        var empresa = localservice.getEmpresaSelected()
          , username = localservice.getUsername();
        if(localservice.isUserRoot())
          UrlService.go('app.index');
        if(empresa && username)
          UrlService.go('app.index');
        if(!empresa && !username)
          UrlService.go('login');
      }

      function setStatusEmpresa(status){
        vm.empresaIsSelected = status;
      }

      function getEmpresas(nome){
        return EmpresaService
          .getEmpresasWithLogin(nome)
          .then(getEmpresasSuccess);
      }

      function getEmpresasSuccess(response){
        return response.data.data;
      }

      function empresaSelected(){      
        var empresa = vm.empresa;
        if(!empresa.id){
          var msg = 'Empresa inválida. Favor selecionar uma correta.';
          message.warning(msg);
          setStatusEmpresa(false);
          return;
        }
        saveEmpresaIntoContext(empresa);
      }

      function saveEmpresaIntoContext(empresa){
        var contextEmpresaId = 'contextEmpresaId' ;
        LoginService
          .saveContext(contextEmpresaId, empresa.id)
          .then(responseSaveContext);
      }

      function responseSaveContext(response){
        throwEvent('EmpresaSelectedEvent',vm.empresa);
      }

      function usuarioEstaLogadoEvent(event){
        if(!localservice.getEmpresaSelected())
          UrlService.go('empresa',{},{notify:true});
      }

      function throwEvent(event, data){
        BusEventsService.broadcast(event, data);
      }

  }
}())