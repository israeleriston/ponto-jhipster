(function() {
	'use strict';
	angular
    .module('CidadeServices', [])
		.factory('CidadeService', CidadeService);
	;

	CidadeService.$inject = [ '$http', 'TemplateService' ];

	function CidadeService($http, TemplateService) {
		var service = new TemplateService('/cidades');
		service.getCidades = getCidades;
		service.cidadeFindAll = cidadeFindAll;
		service.cidadeFindParameters = cidadeFindParameters;
    service.getCidadesFromUf = getCidadesFromUf;
    service.getCidadeNameAndSiglaUF = getCidadeNameAndSiglaUF;

		return service;

		function getCidades(data) {
      var method = 'POST';
      return $http({
        url : '/query/cidadeFindByNameContaining/1',
        method : method,
        data : {
          nome : data
        }
      }).then(getCidadeSuccess);

		};

		function cidadeFindAll(pageNumber) {
			var method = 'POST';
			var url = '/query/cidadeFindAll/'
					+ pageNumber /* + '/?pageSize='+ pageSize */;
			return $http({
				url : url,
				method : method,
				data : {}
			}).then(cidadeFindAllSuccess)
		};

		function cidadeFindParameters(parameter, pageNumber) {
			var method = 'POST';
			var url = '/query/cidadeFindByFieldsContaining/'
					+ pageNumber /* + '/?pageSize='+ pageSize */;
			return $http({
				url : url,
				method : method,
				data : {
					parameter : parameter
				}
			}).then(cidadeFindParametersSuccess)
		};

    function getCidadesFromUf(ufId, parameter){
      var method = 'POST';
      return $http({
        url : '/query/CidadeFindByIdUfAndNameContaining/1',
        method : method,
        data : {
          id : ufId,
          nome : parameter
        }
      }).then(getCidadeSuccess);
    };

    function getCidadeNameAndSiglaUF(cidadeId){
      var method = 'POST';
      return $http({
        url : '/query/cidadeFindNameAndSiglaUF/1',
        method : method,
        data : {
          id : cidadeId
        }
      }).then(getCidadeSuccess);
    }

    function cidadeFindParametersSuccess(response) {
      return response;
    };

    function cidadeFindAllSuccess(response) {
      return response;
    };

    function getCidadeSuccess(response){
      return response.data;
    };
	}
}());