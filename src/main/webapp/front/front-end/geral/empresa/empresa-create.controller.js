(function(){
'use strict';	
angular
	.module('EmpresaCreate', [])
	.config(config)
	.controller('EmpresaCreateController', EmpresaCreateController)
	;
  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.empresa-create',{
        url : '/empresas/create',
				templateProvider : templateProvider,
				controller : 'EmpresaCreateController',
				controllerAs : 'vm'
      });

    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/empresa/empresa-create.html';
      return $templateFactory.fromUrl(url);
    };

  };

	EmpresaCreateController.$inject = ['UrlService', 'EmpresaService', 'BusEventsService', 'message'];
	function EmpresaCreateController(UrlService, EmpresaService, BusEventsService, message){
		var vm = this;
		vm.empresa = {};
		vm.empresa.telefones = [];
		vm.empresa.enderecos = [];		
		vm.init = init;
		vm.save = save;
		vm.backToList = backToList;
		vm.isValidMatriz = isValidMatriz;
		vm.getMatrizes = getMatrizes;
    vm.hasTelefoneEndereco = hasTelefoneEndereco;
    init();
    
    function init(){
      vm.empresa = {};
      vm.empresa.telefones = [];
      vm.empresa.enderecos = [];  
      vm.matriz = [];
    };

		function save(){
			if(angular.isDefined(vm.matriz)){
				if(angular.isDefined(vm.matriz.id)) {
					vm.empresa.matrizId = vm.matriz.id;
					vm.empresa.cnpjMatriz = vm.matriz.cnpj;				
				} else {
					delete(vm.empresa.matrizId);
					delete(vm.empresa.cnpjMatriz);
				}
		}

			EmpresaService
				.save(vm.empresa)
				.then(empresaCreateSuccess);
		};

		function backToList(){
			UrlService.go('app.empresa-list');
		};
	 
	  function isValidMatriz(){
	    if(angular.isDefined(vm.matriz))
	      return angular.isDefined(vm.matriz.id)
	  }

		function empresaCreateSuccess(data){
			message.success('Empresa Salva com Sucesso');
			UrlService.reload();
		};

    function hasTelefoneEndereco(){
      return vm.empresa.telefones.length > 0 && vm.empresa.enderecos.length > 0;
    }

		function getMatrizes(search){
			return EmpresaService
	        .getMatrizContaining(search)
	        .then(getMatrizesSuccess);
		};

		function getMatrizesSuccess(response){
			return response.data;
		};
	}
}())
