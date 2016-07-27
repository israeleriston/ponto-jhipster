(function(){
	'use strict';	
	angular
		.module('EmpresaEdit', [])
		.config(config)
		.controller('EmpresaEditController', EmpresaEditController)
		;

	  config.$inject = ['$stateProvider'];
	  function config($stateProvider){
	    $stateProvider
	      .state('app.empresa-edit',{
	        url : '/empresas/:id/edit',
					templateProvider : templateProvider,
					controller : 'EmpresaEditController',
					controllerAs : 'vm',
	        resolve : {
	          empresaPreService : empresaPreService,
	          empresaEnderecoPreService : empresaEnderecoPreService,
	          empresaTelefonePreService : empresaTelefonePreService
	        }
	      });

	    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
	    function templateProvider(TemplateUrlPathFactory, $templateFactory){
	      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/empresa/empresa-create.html';
	      return $templateFactory.fromUrl(url);
	    }

	    empresaPreService.$inject = ['EmpresaService', '$stateParams'];
	    function empresaPreService(EmpresaService, $stateParams){
	      var id = $stateParams.id;
	      return EmpresaService.empresaFindById(id);
	    }

	    empresaEnderecoPreService.$inject = ['empresaPreService', 'EmpresaService'];
	    function empresaEnderecoPreService(empresaPreService, EmpresaService){
	    	return EmpresaService.empresaEnderecoFindByEmpresaId(empresaPreService.data[0].id);
	    }

	    empresaTelefonePreService.$inject = ['empresaPreService', 'EmpresaService'];
	    function empresaTelefonePreService(empresaPreService, EmpresaService){
	      return EmpresaService.empresaTelefoneFindByEmpresaId(empresaPreService.data[0].id);
	    }
	  };

		 EmpresaEditController.$inject = ['UrlService', 'empresaPreService', 'EmpresaService', 'BusEventsService', 'message', 'empresaEnderecoPreService' , 'EnderecoService', 'empresaTelefonePreService'];
		 function EmpresaEditController(UrlService, empresaPreService, EmpresaService, BusEventsService, message, empresaEnderecoPreService, EnderecoService, empresaTelefonePreService){
		 	var vm = this;
		 	vm.empresa = buildEmpresaByResponse(empresaPreService.data[0], empresaEnderecoPreService.data, empresaTelefonePreService.data);
		 	vm.matriz;
		 	vm.backToList = backToList;
		 	vm.save = save;
		 	vm.getMatrizes = getMatrizes;
		 	vm.possuiMatriz = possuiMatriz;
	    vm.hasTelefoneEndereco = hasTelefoneEndereco;

		 	function save(){
		 		if(vm.matriz){
		 			vm.empresa.matrizId = {
		 				value : vm.matriz.id
		 			}	 			 			 			
		 		}else{
		 			vm.empresa.matrizId = null
		 		}		 		
		 		EmpresaService
		 			.edit(vm.empresa)
		 			.then(empresaEditSuccess);
		 	};

		 	function empresaEditSuccess(data){
		 		vm.empresa = {};
		 		message.success('Empresa editada com sucesso.');
	      backToList();
		 	};

		 	function backToList(){
		 		UrlService.go('app.empresa-list');
		 	};

	    function hasTelefoneEndereco(){
	      return vm.empresa.telefones.length > 0 && vm.empresa.enderecos.length > 0;
	    }

		 	function buildEmpresaByResponse(data, enderecos, telefones){
		 		var obj = {};
		 		obj.cnpj = data.cnpj;
		 		obj.entityId = data.id;
		 		obj.inscricaoEstadual = data.inscricaoestadual;
		 		obj.inscricaoMunicipal = data.inscricaomunicipal;
		 		obj.nomeFantasia = data.nomefantasia;
		 		obj.razaoSocial = data.razaosocial;
		 		obj.status = data.status;
		 		if(data.email){
		 			obj.email = data.email;
		 		}else{
		 			obj.email = null;
		 		}
		 		if(data.empresamatriz){
		 			loadMatriz(data.empresamatriz);
				} else {
					vm.matriz = undefined;				
				}
		 		obj.telefones = telefones;
		 		obj.version = data.version;
		 		obj.enderecos = EnderecoService.build(enderecos);
		 		return obj;
		 	};

			function removeTelefone(objTelefone){
				var index = vm.empresa.telefones.indexOf(objTelefone);
	      vm.empresa.telefones.splice(objTelefone.indexOf, 1);
	      BusEventsService.broadcast('AtualizaTelefoneEvent', vm.empresa.telefones);
			};

		 	function getMatrizes(search){
				return EmpresaService
	        .getMatrizContaining(search)
	        .then(getMatrizesSuccess);
			};

			function getMatrizesSuccess(response){
				return response.data;
			};

			function loadMatriz(idMatriz){
				return EmpresaService
				 .empresaFindById(idMatriz)
				 .then(loadMatrizSuccess);
			}

			function loadMatrizSuccess(response) {
				vm.matriz = response.data[0];
			}

			function possuiMatriz(){
				if(angular.isDefined(vm.matriz)){
					return true;
				}
				//return false;
				//Caso não haja matriz será permitido habilitar o campo para seleção da matriz?
				//Lembrando que deve-se considerar as implicações de uma empresa que não foi cadastrada como filial
				//tornar-se uma de prontidão
				return true;
			}
	}
}())
