(function(){
  'use strict';
  angular
    .module('PerfilDeAcessoServices',[])
    .factory('PerfilDeAcessoService',PerfilDeAcessoService);

    PerfilDeAcessoService.$inject = ['$http','TemplateService', 'BusEventsService', 'UrlService'];
    function PerfilDeAcessoService($http, TemplateService, BusEventsService, UrlService){

      var service = new TemplateService('/perfilDeAcesso');
      
      service.getArvoreDeItensDeAcesso = getArvoreDeItensDeAcesso;
      service.perfilDeAcessoFindAll = perfilDeAcessoFindAll;
      service.perfilDeAcessoFindParameters = perfilDeAcessoFindParameters;
      service.getPerfisDeAcesso = getPerfisDeAcesso;
      service.findAllItensDeAcessoBySeveralPerfilDeAcessoIds = findAllItensDeAcessoBySeveralPerfilDeAcessoIds;
      service.findAllItensDeAcessoBySeveralPerfilDeAcessoIdsWithParameter = findAllItensDeAcessoBySeveralPerfilDeAcessoIdsWithParameter;
      service.findAllItensDeAcessoRestrictedsBySeveralPerfilDeAcessoIds = findAllItensDeAcessoRestrictedsBySeveralPerfilDeAcessoIds;
      service.findAllPerfisDeAcessoBySeveralPerfilDeAcessoIds = findAllPerfisDeAcessoBySeveralPerfilDeAcessoIds;
      service.findAllItensDeAcessoBySeveralIds = findAllItensDeAcessoBySeveralIds;
      service.buscarComponentesDeLogin = buscarComponentesDeLogin;
      service.buscarComponentesDeLoginPorPerfilDeAcesso = buscarComponentesDeLoginPorPerfilDeAcesso;
      service.irParaOProximoPassoDeLogin = irParaOProximoPassoDeLogin;
      service.getProximoComponenteDeLogin = getProximoComponenteDeLogin;
      var baseUrl = service.getBaseUrl();

	  return service;
    	  
      function getArvoreDeItensDeAcesso(){
        var method = 'GET';
        return $http({
          url : baseUrl.concat("/getArvoreDeItensDeAcesso"),
          method : method
        });
      }
      
      function perfilDeAcessoFindAll(pageNumber) {
			var method = 'POST';
			var url = '/query/perfilDeAcessoFindAll/'
					+ pageNumber;
			return $http({
				url : url,
				method : method,
				data : {}
			}).then(resultPromisseSuccess)
		};	

		function perfilDeAcessoFindParameters(parameter, pageNumber) {
			var method = 'POST';
			var url = '/query/perfilDeAcessoFindByFieldsContaining/'
					+ pageNumber;
			return $http({
				url : url,
				method : method,
				data : {
					parameter : parameter
				}
			}).then(resultPromisseSuccess)
		};	
		
		function getPerfisDeAcesso(nome) {
			var method = 'POST';
			return $http({
				url : '/query/perfilDeAcessoFindByNameContaining/1',
				method : method,
				data : {
					nome : nome
				}
			}).then(resultPromisseSuccess);
		};			
		
		function findAllItensDeAcessoBySeveralPerfilDeAcessoIds(ids, pageNumber) {
			var method = 'POST';
			var url = '/query/itemDeAcessoFindBySeveralPerfilDeAcessoIds/'
					+ pageNumber;
			return $http({
				url : url,
				method : method,
				data : {
					ids : ids
				}
			}).then(resultPromisseSuccess)
		};
		
		function findAllItensDeAcessoBySeveralPerfilDeAcessoIdsWithParameter(ids, pageNumber, parameter) {
			var method = 'POST';
			var url = '/query/itemDeAcessoFindBySeveralPerfilDeAcessoIdsWithNameContaining/'
					+ pageNumber;
			return $http({
				url : url,
				method : method,
				data : {
					parameter : parameter,
					ids : ids
				}
			}).then(resultPromisseSuccess)
		};
	
		function findAllItensDeAcessoRestrictedsBySeveralPerfilDeAcessoIds(idsPerfisDeAcesso, idsItensDeAcessoRestringidos, pageNumber) {
			var method = 'POST';
			var url = '/query/itemDeAcessoRestrictedFindBySeveralPerfilDeAcessoIds/'
					+ pageNumber;
			return $http({
				url : url,
				method : method,
				data : {
					idsPerfisDeAcesso : idsPerfisDeAcesso,
					idsItensDeAcessoRestritos : idsItensDeAcessoRestringidos
				}
			}).then(resultPromisseSuccess)
		};		
		
		function findAllPerfisDeAcessoBySeveralPerfilDeAcessoIds(ids, pageNumber) {
			var method = 'POST';
			var url = '/query/perfilDeAcessoFindBySeveralPerfilDeAcessoIds/'
					+ pageNumber;
			return $http({
				url : url,
				method : method,
				data : {
					ids : ids
				}
			}).then(resultPromisseSuccess)
		};	
		
		function findAllItensDeAcessoBySeveralIds(ids, pageNumber) {
			var method = 'POST';
			var url = '/query/itemDeAcessoFindBySeveralIds/'
					+ pageNumber;
			return $http({
				url : url,
				method : method,
				data : {
					ids : ids
				}
			}).then(resultPromisseSuccess)
		};
    
    function buscarComponentesDeLogin(){      
        return $http({
          url : baseUrl.concat('/getComponentesDoLogin'),
          method : 'GET'
        });
    }
    
    function buscarComponentesDeLoginPorPerfilDeAcesso(perfilDeAcessoId){
      return $http({
				url : '/query/perfilDeAcessoFindComponentsLogin/1',
				method : 'POST',
				data : {
					perfilDeAcessoId : perfilDeAcessoId
				}, 
        params : {
          pageSize : 0
        }
			}).then(resultQuerySucess)
    }
    
    function getProximoComponenteDeLogin(actualStep){
      return $http({
        url : '/access/getNextLoginComponent',
        method : 'POST',
        params : { actualStep : actualStep },
        headers : { 'Content-Type' : 'text/plain' }
      }).then(function(response){
        return response.data;
      });
    }
    
    function irParaOProximoPassoDeLogin(actualStep){
      getProximoComponenteDeLogin(actualStep)
        .then(function(nextStep){
          if(!nextStep){
            UrlService.go('app.index',{},{notify:true});
            return;
          }
          BusEventsService.broadcast(nextStep);
        });
    }
    
    function resultPromisseSuccess(response){
      return response;
    }
    
    function resultQuerySucess(response){
      return response.data.data;
    }		
  }
}());