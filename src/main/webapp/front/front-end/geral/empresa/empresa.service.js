(function() {
	'use strict';
	angular
		.module('EmpresaServices', [])
		.factory('EmpresaService', EmpresaService);

	EmpresaService.$inject = [ '$http', 'TemplateService'];

	function EmpresaService($http, TemplateService) {
		var service = new TemplateService('/empresas');
		service.save = save;
		service.getMatrizContaining = getMatrizContaining;
		service.empresaFindAll = empresaFindAll;
		service.empresaFindParameters = empresaFindParameters;
		service.getEmpresas = getEmpresas;
		service.findIdAndNameOfEmpresa = findIdAndNameOfEmpresa;
		service.getEmpresasWithLogin = getEmpresasWithLogin;
		service.loadMatriz = loadMatriz;
		service.empresaFindById = empresaFindById;
		service.empresaEnderecoFindByEmpresaId = empresaEnderecoFindByEmpresaId;
		service.empresaTelefoneFindByEmpresaId = empresaTelefoneFindByEmpresaId;
    	service.getEmpresaContextForRelatorios = getEmpresaContextForRelatorios;
		return service;

		function save(empresa){			
			if(angular.isDefined(empresa.matrizId)){
				return saveFilial(empresa);
			}
			return saveMatriz(empresa);
		};

		function saveFilial(empresa){		
			var method = 'POST'
			  , url = '/criarFilial';
			return $http({
        url : service.getBaseUrl() + url,
        method : method,
        data : empresa
      }).then(empresaFindSuccess)
		};

		function saveMatriz(empresa){			
			var method = 'POST'
			  , url = service.getBaseUrl();
			return $http({
        url : service.getBaseUrl(),
        method : method,
        data : empresa
      }).then(empresaFindSuccess)
		};

		function getMatrizContaining(parameter) {
			var method = 'POST'
			  , url = '/query/getMatrizContainingFields/1';
			return $http({
				url : url,
				method : method,
				data : {
					parameter : parameter
				}
			}).then(empresaFindSuccess)
		};

		function empresaFindAll(pageNumber) {
			var method = 'POST'
			  , url = '/query/empresaFindAll/'
					+ pageNumber;
			return $http({
				url : url,
				method : method,
				data : {}
			}).then(getEmpresasResponseSuccess)
		};

		function empresaFindById(entityId){
			var method = 'POST'
			  , url = '/query/empresaFindById/1'
			return $http({
				url : url,
				method : method,
				data : {
					entityId : entityId
				}
			}).then(function(response){
				return response.data
			})
		}

		function empresaEnderecoFindByEmpresaId(empresaId){
			var method = 'POST'
			  , url = '/query/empresaEnderecoFindByEmpresaId/1'
			return $http({
				url : url,
				method : method,
				data : {
					empresaId : empresaId
				}
			}).then(function(response){
				return response.data
			});
		}

		function empresaTelefoneFindByEmpresaId(empresaId){
			var method = 'POST'
			  , url = '/query/empresaTelefoneFindByEmpresaId/1'
			return $http({
				url : url,
				method : method,
				data : {
					empresaId : empresaId
				}
			}).then(function(response){
				return response.data
			});
		}

		function empresaFindParameters(parameter, pageNumber) {
			var method = 'POST'
			  , url = '/query/EmpresaFindByFieldContaining/'
					+ pageNumber;
			return $http({
				url : url,
				method : method,
				data : {
					parameter : parameter
				}
			}).then(getEmpresasResponseSuccess)
		};
		
		function getEmpresas(nome) {
			var method = 'POST';
			return $http({
				url : '/query/empresaFindByNameContainingAndNomeFantasiaContaining/1',
				method : method,
				data : {
					nome : nome
				}
			}).then(getEmpresasResponseSuccess);
		};

		function getEmpresasWithLogin(nomeEmpresa) {
			var method = 'GET';
			return $http({
				url : service.getBaseUrl() + '/empresaFindByNameContainingAndNomeFantasiaContainingWithLogin',
				method : method,
				params : {
					nomeEmpresa : nomeEmpresa,
          status : 'ATIVO'
				}
			}).then(getEmpresasResponseSuccess);
		};

		function findIdAndNameOfEmpresa(id) {
			var method = 'POST';
			return $http({
				url : '/query/empresaFindIdAndName/1',
				method : method,
				data : {
					id : id
				}
			}).then(getEmpresasResponseSuccess);
		};

		function empresaFindSuccess(response) {
			return response.data;
		};

		function getEmpresasResponseSuccess(response) {
			return response;
		};

		function loadMatriz(idMatriz) {
			var method = 'POST'
				, data = {
						idMatriz : idMatriz
					};
			return $http({
				url : '/query/empresaLoadMatriz/1',
				method : method,
				data : data
			}).then(loadMatrizSuccess);
		};

		function loadMatrizSuccess(response) {
			return response.data;
		};
    
    function getEmpresaContextForRelatorios(){
      return $http({
        url : '/query/empresaContextGetDadosForRelatorios/1',
        method : 'POST',
        data : {},
        params : { pageSize: 1 }        
      }).then(function(response){
        console.log('response -> ', response);
        return response.data.data[0];
      });
    }
	}
}());