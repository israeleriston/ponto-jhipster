(function(){
	'use strict';	
	angular
		.module('PerfilDeUsuarioEdit', [])
		.config(config)
		.controller('PerfilDeUsuarioEditController', PerfilDeUsuarioEditController);

	config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.perfilDeUsuario-edit',{
        url : '/perfilDeUsuario/:id/edit',
        templateProvider : templateProvider,
        controller : 'PerfilDeUsuarioEditController',
        controllerAs : 'vm',
        resolve : {
          perfilDeUsuarioPreService : perfilDeUsuarioPreService
        }
      });

    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/perfil-usuario/perfil-usuario-create.html';
      return $templateFactory.fromUrl(url);
    }

    perfilDeUsuarioPreService.$inject = ['$stateParams', 'PerfilDeUsuarioService'];
		function perfilDeUsuarioPreService($stateParams, PerfilDeUsuarioService) {
			var id = $stateParams.id;
			return PerfilDeUsuarioService.get(id);
		}
  }


	PerfilDeUsuarioEditController.$inject = ['UrlService','perfilDeUsuarioPreService','PerfilDeUsuarioService','PerfilDeAcessoService','UsuarioService','EmpresaService','message'];

	function PerfilDeUsuarioEditController(UrlService, perfilDeUsuarioPreService, PerfilDeUsuarioService, PerfilDeAcessoService, UsuarioService, EmpresaService, message) {
	    var vm = this;
	    angular.extend(vm, PerfilDeUsuarioService.PerfilDeUsuario(perfilDeUsuarioPreService.data));
	    vm.getEmpresas = getEmpresas;
	    vm.getPerfisDeAcesso = getPerfisDeAcesso;
	    vm.incluirPerfilDeAcesso = incluirPerfilDeAcesso;
	    vm.findItensDeAcesso = findItensDeAcesso;
	    vm.removePerfilDeAcesso = removePerfilDeAcesso;
	    vm.restringirItemDeAcesso = restringirItemDeAcesso;
	    vm.liberarItem = liberarItem;
	    vm.inserirVariavelDisable = inserirVariavelDisable;
	    vm.unmarkRestrictItemDeAcesso = unmarkRestrictItemDeAcesso;
	    vm.atualizarItensDeAcessoRestritos = atualizarItensDeAcessoRestritos;
	    vm.backToList = backToList;
	    vm.empresaIsUndefined = empresaIsUndefined;
	    vm.perfilDeAcessoIsUndefined = perfilDeAcessoIsUndefined;
	    vm.save = save;
	    vm.itensDeAcesso = [];
	    vm.empresa;
	    vm.usuario;
	    vm.perfisDeAcessoIncluidos = [];
	    vm.parametroBusca;
	    vm.itensDeAcessoRestritos = [];
	    vm.divRestricoesEmVisualizacao = false;
	    vm.showDivEmpresaEPerfisDeAcesso = false;
	    vm.init = init;
	    vm.init();
	    
	    function init(){
	    	loadUsuario(vm.perfilDeUsuario.usuarioId.value);
	    	loadEmpresa(vm.perfilDeUsuario.empresaId.value);
	    	loadPerfisDeAcessoAdicionados(vm.perfilDeUsuario.perfisDeAcessoDoPerfilDeUsuario);
	    	if(vm.perfilDeUsuario.itensDeAcessoRestritos.length > 0){
	    		loadItensDeAcessoRestringidos(vm.perfilDeUsuario.itensDeAcessoRestritos);
	    	}
	    }
	    
	    function save(){
	    	PerfilDeUsuarioService
			.edit(montarPerfilDeUsuario())
				.then(perfilDeUsuarioEditSuccess);
	    }
	    
	    function perfilDeUsuarioEditSuccess(response){
	    	message.success('Perfil de usuário editado com sucesso');
	    	UrlService.go('app.perfilDeUsuario-list', {id:vm.usuario.id.value});
	    }

	    function backToList(){
	    	UrlService.go('app.perfilDeUsuario-list', {id:vm.usuario.id.value});
	    }

	    function perfilDeUsuarioCreateSuccess(){
	    	message.success("Perfil de Usuario salvo com sucesso");
	    }
	    
	    function perfilDeUsuarioCreateError(){
	    	message.success("Erro ao salvar perfil de Usuario");
	    }
	    
		function getEmpresas(search){
		    return EmpresaService
		      .getEmpresas(search)
		      .then(getEmpresasSuccess)
		}

		function getEmpresasSuccess(response){
			return response.data.data;
		}
	    
    function getPerfisDeAcesso(search){
	    return PerfilDeAcessoService
	      .getPerfisDeAcesso(search)
	      .then(getPerfisDeAcessoSuccess)
		}

		function getPerfisDeAcessoSuccess(response){
			return response.data.data;
		}

	    
	    function incluirPerfilDeAcesso(){
				try{
					vm.perfisDeAcessoIncluidos.forEach(function(perfilDeAcesso){
						if(angular.equals(perfilDeAcesso, vm.perfilDeAcesso)){
							message.error("Este perfil de acesso já foi adicionado");
							throw Exception;
						}
					});
					vm.perfisDeAcessoIncluidos.push(vm.perfilDeAcesso);
					vm.showDivEmpresaEPerfisDeAcesso = true;
					if(vm.divRestricoesEmVisualizacao){
						vm.findItensDeAcesso(1);
					}
					delete vm.perfilDeAcesso;
				}catch(e){
				}
	    }
	    
	    function PerfilDeUsuario(){
	    	this.usuarioId;
	    	this.empresaId;
	    	this.itensDeAcessoRestritos = [];
	    	this.perfisDeAcessoDoPerfilDeUsuario = [];
	    	return this;
	    }
	    
	    function removePerfilDeAcesso(indice){
	    	
	    	vm.perfisDeAcessoIncluidos.splice(indice,1);
	    	
	    	if(vm.perfisDeAcessoIncluidos.length < 1){
	    		vm.itensDeAcesso = [];
	    		vm.itensDeAcessoRestritos = [];
	    		vm.divRestricoesEmVisualizacao = false;
	    	} else{
	    		if(vm.divRestricoesEmVisualizacao){
	        		vm.findItensDeAcesso(1);
	        	}
	        	if(vm.itensDeAcessoRestritos.length > 0){
	        		vm.atualizarItensDeAcessoRestritos();
	        	}
	    	}
	    }
	    
		function findItensDeAcesso(pageNumber){
			if(!vm.parametroBusca){
				PerfilDeAcessoService.findAllItensDeAcessoBySeveralPerfilDeAcessoIds(getIdsPerfisDeAcesso(),pageNumber)
				.then(function(response){
					vm.inserirVariavelDisable(response);
				});
		    } else {
		    	PerfilDeAcessoService.findAllItensDeAcessoBySeveralPerfilDeAcessoIdsWithParameter(getIdsPerfisDeAcesso(),pageNumber, vm.parametroBusca)
				.then(function(response){
					vm.inserirVariavelDisable(response);
				});
		    }
		}
		
		function getIdsPerfisDeAcesso(){
			var ids = [];
			vm.perfisDeAcessoIncluidos.forEach(function(perfilDeAcesso){
				ids.push(perfilDeAcesso.id);
			});
			return ids;
		}
		
		function getIdsItensDeAcessoRestringidos(){
			var ids = [];
			vm.itensDeAcessoRestritos.forEach(function(itemDeAcesso){
				ids.push(itemDeAcesso.id);
			});
			return ids;
		}
		
		function restringirItemDeAcesso(itemDeAcesso){
			itemDeAcesso.restrict = true;
			vm.itensDeAcessoRestritos.push(itemDeAcesso);
		}
		
		function liberarItem(indice){
			vm.unmarkRestrictItemDeAcesso(vm.itensDeAcessoRestritos[indice].id);
			vm.itensDeAcessoRestritos.splice(indice,1);
		}
		
		function inserirVariavelDisable(itensDeAcessoPage){
			
			itensDeAcessoPage.data.data.forEach(function(item){
				if(isRestrict(item.id)){
					item.restrict = true;
				}else{
					item.restrict = false;
				}
			});
			vm.itensDeAcesso = itensDeAcessoPage.data;
		}
		
		function isRestrict(itemId){
			var response = false;
			angular.forEach(vm.itensDeAcessoRestritos,function(value,key){
				if(value.id == itemId){
					response = true;
					return;
				}
			});
			return response;
		}
		
		function unmarkRestrictItemDeAcesso(itemId){
			angular.forEach(vm.itensDeAcesso.data,function(value,key){
				if(value.id == itemId){
					value.restrict = false;
					return;
				}
			});
		}
		
		function atualizarItensDeAcessoRestritos(){
			PerfilDeAcessoService.findAllItensDeAcessoRestrictedsBySeveralPerfilDeAcessoIds(getIdsPerfisDeAcesso(),getIdsItensDeAcessoRestringidos(), 1)
			.then(function(response){
				vm.itensDeAcessoRestritos = response.data.data; 
			});
		}
		
		function montarPerfilDeUsuario(){
			vm.perfilDeUsuario.usuarioId = vm.usuario.id.value;
			vm.perfilDeUsuario.empresaId = vm.empresa.id;
			vm.perfilDeUsuario.itensDeAcessoRestritos = getIdsItensDeAcessoRestringidos();
			vm.perfilDeUsuario.perfisDeAcessoDoPerfilDeUsuario = getIdsPerfisDeAcesso();
			return vm.perfilDeUsuario;
		}
		
		function loadUsuario(usuarioId){
			UsuarioService.get(usuarioId)
			.then(loadUsuarioSuccess);
		}
		
		function loadUsuarioSuccess(data){
			vm.usuario =  data.data;
		}
		
		function loadEmpresa(empresaId){
			EmpresaService.findIdAndNameOfEmpresa(empresaId)
			.then(loadEmpresaSuccess);
		}
		
		function loadEmpresaSuccess(data){
			vm.empresa =  data.data.data[0];
		}
		
		function loadPerfisDeAcessoAdicionados(perfisDeUsuarioAcessos){
			var ids = [];
			perfisDeUsuarioAcessos.forEach(function(perfil){
				ids.push(perfil.perfilDeAcessoId.value);
			});
			PerfilDeAcessoService.findAllPerfisDeAcessoBySeveralPerfilDeAcessoIds(ids, 1)
			.then(loadPerfisDeAcessoSuccess);
		}
		
		function loadPerfisDeAcessoSuccess(response){
			vm.perfisDeAcessoIncluidos = response.data.data;
			vm.showDivEmpresaEPerfisDeAcesso = true;
		}
		
		function loadItensDeAcessoRestringidos(perfisDeUsuarioRestricoes){
			var ids = [];
			perfisDeUsuarioRestricoes.forEach(function(perfil){
				ids.push(perfil.itemDeAcessoId.value);
			});
			PerfilDeAcessoService.findAllItensDeAcessoBySeveralIds(ids, 1)
			.then(loadItensDeAcessoBySeveralIdsSuccess);
		}
		
		function loadItensDeAcessoBySeveralIdsSuccess(response){
			vm.itensDeAcessoRestritos = response.data.data;
		}
		
		function empresaIsUndefined(){
			if(vm.empresa){
				return angular.isUndefined(vm.empresa.id);
			}
			return false;
		}
		
		function perfilDeAcessoIsUndefined(){
			if(vm.perfilDeAcesso){
				return angular.isUndefined(vm.perfilDeAcesso.id);
			}
			return false;
		}
	}
}())