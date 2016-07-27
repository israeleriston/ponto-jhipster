(function(){
'use strict';
  angular
    .module('LocalServices',[])
    .service('localservice',localservice);

    localservice.$inject = ['$cookies','BusEventsService']

  function localservice($cookies, BusEventsService){
    var nameStorageToken = 'thunderbees-api-token'
      , nameLogonStorage = 'thunderbees-api-logon'
      , usernameLoginStorage = 'thunderbees-api-username'
      , usernameRoot = 'root'
      , context = {}
      , stepsLogin = [];

    this.getToken = getToken;
    this.hasToken = hasToken;
    this.getUsername = getUsername;
    this.getLogon = getLogon;
    this.getEmpresaSelected = getEmpresaSelected;
    this.isUserRoot = isUserRoot;
    this.getItemOnLocalservice = getItemOnLocalservice;
    this.getContext = getContext;
    this.clearLocalservice = clearLocalservice;
    this.setValueOnContext = setValueOnContext;

    listenerEvent('UsuarioLogadoEvent', usuarioLogadoEvent);
    listenerEvent('EmpresaSelectedEvent', empresaSelectedEvent);
    listenerEvent('InsertContextOnAppEvent', insertContextOnAppEvent)

    function usuarioLogadoEvent(event, data){
      setDataIntoLocalservice(nameStorageToken, data.token);
      setDataIntoLocalservice(nameLogonStorage, data.logon);
      setDataIntoLocalservice(usernameLoginStorage, data.username);
    }

    function empresaSelectedEvent(event, data){
      context.contextEmpresaId = data.id;
      // BusEventsService.broadcast('EmpresaRegisterIntoLocalserviceEvent');
    }

    function insertContextOnAppEvent(event, data){
      data.then(function(response){
        context = response.data
        context.currentDate = new Date(context.currentDate);
      });
    }

    function getToken(){
      return getItemOnLocalservice(nameStorageToken);
    }

    function hasToken(){
      return !angular.equals(getToken(),null);
    }

    function getUsername(){
      return getItemOnLocalservice(usernameLoginStorage);
    }

    function getLogon(){
      return getItemOnLocalservice(nameLogonStorage);
    }

    function setDataIntoLocalservice(key, value){
      $cookies.put(key,value);
    }

    function getItemOnLocalservice(key){
      var item = $cookies.get(key) || null;
      return item;
    }

    function getContext(){
      return context;
    }

    function getEmpresaSelected(){
      if(context.contextEmpresaId)
        return context.contextEmpresaId.value;
      return;
    }

    function isUserRoot(){
      return getUsername() === usernameRoot;
    }

    function clearLocalservice() {
      context = {};
      delete $cookies.remove(nameStorageToken);
      delete $cookies.remove(nameLogonStorage);
      delete $cookies.remove(usernameLoginStorage);
    }

    function listenerEvent(event, func){
      BusEventsService.on(event, func);
    }
    
    function setValueOnContext(key, value){
      context[key] = value;
    }
  }
}());