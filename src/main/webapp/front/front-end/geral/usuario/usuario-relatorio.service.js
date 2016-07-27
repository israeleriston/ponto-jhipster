(function() {
	'use strict';
	angular
		.module('RelatorioUsuarioServices', [])
		.factory('RelatorioUsuarioService',RelatorioUsuarioService);
	;
	RelatorioUsuarioService.$inject = [ '$http', 'TemplateService' ];

	function RelatorioUsuarioService($http, TemplateService) {
		var service = new TemplateService('/relatorios/usuario');

		service.gerarRelatorioTodosUsuarios = gerarRelatorioTodosUsuarios;
		service.gerarRelatorioUsuariosPorEmpresa = gerarRelatorioUsuariosPorEmpresa;
		return service;

		function gerarRelatorioTodosUsuarios(criteriosData, status, ordenacao, ordem) {
			var method = 'POST';
			return $http({
				url : '/report/reportAllUsuario',
				method : method,
				responseType : 'arraybuffer',
				data : {
					criteriosData : criteriosData,
					statusArray : status,
					ordenacao : ordenacao,
					ordem : ordem
				}
			})
			.then(gerarRelatorioTodosUsuariosSuccess);
		}

		function gerarRelatorioTodosUsuariosSuccess(response) {
			return response;
		}
		
		function gerarRelatorioUsuariosPorEmpresa(criteriosData, empresaId, status, ordenacao, ordem) {
			var method = 'POST';
			return $http({
				url : '/report/reportUsuarioByBusiness',
				method : method,
				responseType : 'arraybuffer',
				data : {
					criteriosData : criteriosData,
					empresaId : empresaId,
					statusArray : status,
					ordenacao : ordenacao,
					ordem : ordem
				}
			})
			.then(gerarRelatorioUsuariosPorEmpresaSuccess);
		}

		function gerarRelatorioUsuariosPorEmpresaSuccess(response) {
			return response;
		}
	}
}());
