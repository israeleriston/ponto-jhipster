(function() {
	'use strict';
	angular.module('UnidadeFederativaServices', []).factory(
			'UnidadeFederativaService', UnidadeFederativaService);
	;

	UnidadeFederativaService.$inject = [ '$http', 'TemplateService', '$timeout' ];

	function UnidadeFederativaService($http, TemplateService, $timeout) {
		var service = new TemplateService('/unidadesFederativas');

		service.getUnidadesFederativas = getUnidadesFederativas;
		service.unidadeFederativaFindAll = unidadeFederativaFindAll;
		service.unidadeFederativaFindParameters = unidadeFederativaFindParameters;
		service.ufFindAllSigla = ufFindAllSigla;

		return service;

		function getUnidadesFederativas(data) {
			var method = 'POST';
			return $http({
				url : '/query/unidadeFederativaFindByNameContaining/1',
				method : method,
				data : {
					nome : data
				}
			}).then(getUnidadesFederativasSuccess);
		};

		function unidadeFederativaFindAll(pageNumber) {
			var method = 'POST';
			var url = '/query/unidadeFederativaFindAll/'
					+ pageNumber;
			return $http({
				url : url,
				method : method,
				data : {}
			}).then(unidadeFederativaSuccess)
		};

	

		function unidadeFederativaFindParameters(parameter, pageNumber) {
			var method = 'POST';
			var url = '/query/UnidadeFederativaFindByFieldsContaining/'
					+ pageNumber /* + '/?pageSize='+ pageSize */;
			return $http({
				url : url,
				method : method,
				data : {
					parameter : parameter
				}
			}).then(unidadeFederativaFindParametersSuccess)
		};

		function unidadeFederativaFindParametersSuccess(response){
			return response;
		}

		function ufFindAllSigla(parameter) {
			var method = 'POST';
			var url = '/query/UnidadeFederativaFindAllSigla/1';
			return $http({
				url : url,
				method : method,
				data : {
					parameter : parameter
				}
			}).then(getUnidadesFederativasSuccess)
		};

		function unidadeFederativaSuccess(response) {
			return response;
		};
		
		function getUnidadesFederativasSuccess(response) {
			return response.data;
		};
	}
}());