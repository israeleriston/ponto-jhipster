(function(){
  'use strict';
  angular
    .module('Interceptors',[])
    .factory('HttpInterceptor',HttpInterceptor);

  HttpInterceptor.$inject = ['$q', 'localservice', '$timeout', 'BusEventsService', 'message'];

  function HttpInterceptor($q, localservice, $timeout, BusEventsService, message){
    var service = {
      request : request,
      requestError : requestError,
      response : response,        
      responseError : responseError
    }
    return service;

    function request(config){
      var token = localservice.getToken()
      , context = localservice.getContext();
      config.headers['x-api-token'] = token;
      if(config.data){
        angular.forEach(context, function(obj, key){
          config.data[key] = String(obj);
        });
      }
      return config;
    }

    function requestError(rejection){
      console.log('RequestError interceptor:',rejection);
      return $q.reject(rejection);
    }

    function response(response) {
      return response;
    }

    function responseError(rejection){
      if(rejection.data && rejection.data.message){
          message.warning(rejection.data.message);
      }
      //console.log('Response error interceptor:',rejection);
      
      if(rejection.status == 401 || rejection.status == 406){
        BusEventsService.broadcast('LogoutDaAplicacaoEvent');
      }
      return $q.reject(rejection);
    }
  }
}());    