(function(){
'use strict';	
angular
	.module('UsuarioRelatorio', [])
	.config(config)
	.controller('RelatorioUsuarioCreateController', RelatorioUsuarioCreateController);

	config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.relatorio-usuario',{
      	url : '/relatorios/usuario/create',
				templateProvider : templateProvider,
				controller : 'RelatorioUsuarioCreateController',
				controllerAs : 'vm'
      });

    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/usuario/usuario-relatorio.html';
      return $templateFactory.fromUrl(url);
    }
  }

RelatorioUsuarioCreateController.$inject = ['RelatorioUsuarioService','EmpresaService'];
function RelatorioUsuarioCreateController(RelatorioUsuarioService, EmpresaService) {
	var vm = this;
	vm.empresa;
	vm.getEmpresas = getEmpresas;
	vm.generateReport = generateReport;
	vm.statusQuery = 'ATIVO,INATIVO';
	vm.statusCriterios = 'Ativo e Inativo';
	vm.criteriosData;
	vm.ordenacaoQuery = 'nome';
	vm.ordenacaoCriterios = 'Nome';
	vm.ordenacaoOrdemQuery = 'asc';
	vm.ordenacaoOrdemCriterios = 'Crescente';

	function gerarRelatorioTodosUsuarios() {
		RelatorioUsuarioService.gerarRelatorioTodosUsuarios(
			{
				'Status dos usuários' : vm.statusCriterios,
				'Ordenação' : vm.ordenacaoCriterios,
				'Ordem' : vm.ordenacaoOrdemCriterios
			},
			vm.statusQuery.split(','),
			vm.ordenacaoQuery,
			vm.ordenacaoOrdemQuery)
		.then(gerarRelatorioTodosUsuariosSuccess);
	}

	function gerarRelatorioTodosUsuariosSuccess(response) {
		openPDFReport(response.data);
	}
	
	function gerarRelatorioUsuariosPorEmpresa() {
		RelatorioUsuarioService.gerarRelatorioUsuariosPorEmpresa(
			{
				'Status dos usuários' : vm.statusCriterios,
				'Empresa' : vm.empresa.razaosocial,
				'Ordenação' : vm.ordenacaoCriterios,
				'Ordem' : vm.ordenacaoOrdemCriterios
			},
			vm.empresa.id,
			vm.statusQuery.split(','),
			vm.ordenacaoQuery,
			vm.ordenacaoOrdemQuery
		)
		.then(gerarRelatorioUsuariosPorEmpresaSuccess);
	}

	function gerarRelatorioUsuariosPorEmpresaSuccess(response) {
		openPDFReport(response.data);
	}

	function getEmpresas(search) {
		return EmpresaService.getEmpresas(search).then(getEmpresasSuccess)
	}

	function getEmpresasSuccess(response) {
		return response.data.data;
	}

	function openPDFReport(data) {
		var file = new Blob([ data ], {
			type : 'application/pdf'
		});
		var fileURL = URL.createObjectURL(file);
		window.open(fileURL);
	}

	function generateReport() {
		if (angular.isObject(vm.empresa)) {
			gerarRelatorioUsuariosPorEmpresa();
		} else {
			gerarRelatorioTodosUsuarios();
		}
	}
}
}())