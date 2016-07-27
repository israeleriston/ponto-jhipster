(function(){
  'use strict';
  angular
    .module('BasicLoginStepByStep', [
      'BusEventsServices',
      'LocalServices',
      'EmpresaServices',
      'ui.router'
    ])
    .service('BasicLoginStepByStepService', BasicLoginStepByStepService);

  BasicLoginStepByStepService.$inject = [ '$http', 'BusEventsService', 'UrlService', 'localservice', 'EmpresaService', 'message', 'PerfilDeAcessoService'];
  function BasicLoginStepByStepService($http, BusEventsService, UrlService, localservice, EmpresaService, message, PerfilDeAcessoService) {
    var url = '/access/authenticate', method = 'POST';
    this.login = login;
    this.saveContext = saveContext;
    this.create = create;

    BusEventsService.on('UsuarioLogadoEvent', usuarioLogadoEvent);
    BusEventsService.on('LogoutDaAplicacaoEvent', logoutDaAplicacaoEvent);

    function logoutDaAplicacaoEvent(event){
      var url = '/access/logout';
      $http({
        url : url,
        method : method
      })
      .then(function(response){
        redirectToLogin();
      },function(err){
        redirectToLogin();
      });
    }

    function redirectToLogin(){
      localservice.clearLocalservice();
      UrlService.go('login');
    }

    function usuarioSemEmpresaEvent(event) {
      UrlService.go('empresa',{},{location:false});
    };

    function usuarioLogadoEvent(event, data){
      saveContext('userLoginContext', data.username);      
      if(!localservice.isUserRoot()){
        EmpresaService
          .getEmpresasWithLogin('')
          .then(responseGetEmpresasWithLogin);
        return;
      }else{
        UrlService.go('app.index');
      }
    }

    function responseGetEmpresasWithLogin(response){
      if(response.data.recordCount < 1){
        message.warning('Este usuário não possui perfil de acesso vinculado a alguma empresa');
        return;
      }
      if(response.data.recordCount > 1){
        UrlService.go('empresa',{},{notify:true, location:false});
        return;
      }
      var empresa = response.data.data[0];
      var contextEmpresaId = 'contextEmpresaId' ;

      saveContext(contextEmpresaId, empresa.id)
        .then(function(response){          
          BusEventsService.broadcast('EmpresaSelectedEvent', empresa);
      });
    }

    function create() {
      return angular.copy(this);
    }

    function login(user){
      var params = {
        username : user.name,
        password : user.password
      }

      var request = {
        url : url,
        method : method,
        params : params
      };

      return $http(request)
        .then(responseLogin);
    }

    function responseLogin(response){
      return response.data;
    }

    function saveContext(context, value){
      var method = 'POST'
        , url = '/access/saveContext/' + context
        , data = {
          value : value
        }

      return $http({
        method : method,
        url : url,
        data : data
      });
    }
  }
}());