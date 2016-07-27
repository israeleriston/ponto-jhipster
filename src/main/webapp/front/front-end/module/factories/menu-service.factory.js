(function(){
'use strict';
  angular
    .module('MenuServices',[])
    .factory('MenuService', MenuService);
  
  MenuService.$inject = ['$http','localservice', 'BusEventsService'];
  
  function MenuService($http, localservice, BusEventsService){
    var method = 'POST'
      , url = '/itensDeAcesso'
      , service = {
          getAccessItensWithValidationContext : getAccessItensWithValidationContext,
          getContext : getContext
        };
    return service;
    
    function getAccessItensWithValidationContext(){
        return $http({
          url : url,
          method : method,
          data : {}
        })
        .then(returnDataFromResponse, function(err){
          BusEventsService.broadcast('LogoutDaAplicacaoEvent');
          return {};
        });
    }

    function returnDataFromResponse(response){
      return response.data;
    }

    function getContext(){
      var urlContext = '/access/getContext'
        , methodContext = 'POST';

      return $http({
        url : urlContext,
        method : methodContext,
        data : {}
      })
      .then(function(response){
        return response;
      });
    }
  }
}());