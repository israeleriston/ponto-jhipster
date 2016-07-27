(function(){
  'use strict';
  angular
    .module('PerfilDeUsuarioCreate',[])
    .config(config)
    .controller('PerfilDeUsuarioCreateController', PerfilDeUsuarioCreateController)
    ;

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.perfilDeUsuario-create',{
        url : '/perfilDeUsuario/:id/create',
        templateProvider : templateProvider,
        controller : 'PerfilDeUsuarioCreateController',
        controllerAs : 'vm',
        resolve : {
          perfilDeUsuarioPreService : perfilDeUsuarioPreService,
          empresasDoUsuarioPreService : empresasDoUsuarioPreService
        }
      });

    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/perfil-usuario/perfil-usuario-create.html';
      return $templateFactory.fromUrl(url);
    }

    perfilDeUsuarioPreService.$inject = ['$stateParams', 'UsuarioService'];
    function perfilDeUsuarioPreService($stateParams ,UsuarioService){
    	var user = UsuarioService.get($stateParams.id);
    	return user;
    };
    
    empresasDoUsuarioPreService.$inject = ['$stateParams', 'UsuarioService'];
    function empresasDoUsuarioPreService($stateParams , UsuarioService){
    	var empresas = UsuarioService.findEmpresasDoUsuario($stateParams.id);
    	return empresas;
    };
  };


  PerfilDeUsuarioCreateController.$inject = ['UrlService','PerfilDeUsuarioService','EmpresaService','PerfilDeAcessoService','perfilDeUsuarioPreService', 'message', 'empresasDoUsuarioPreService', '$scope'];
  function PerfilDeUsuarioCreateController(UrlService, PerfilDeUsuarioService, EmpresaService, PerfilDeAcessoService, perfilDeUsuarioPreService, message, empresasDoUsuarioPreService, scope){
    var vm = this;
    angular.extend(vm, PerfilDeUsuarioService.PerfilDeUsuario());    
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
    vm.save = save;
    vm.empresaIsUndefined = empresaIsUndefined;
    vm.perfilDeAcessoIsUndefined = perfilDeAcessoIsUndefined;
    vm.itensDeAcesso = [];
    vm.empresa;
    vm.usuario = perfilDeUsuarioPreService.data;
    vm.perfisDeAcessoIncluidos = [];
    vm.parametroBusca;
    vm.itensDeAcessoRestritos = [];
    vm.divRestricoesEmVisualizacao = false;
    vm.showDivEmpresaEPerfisDeAcesso = false;
    vm.empresasDoUsuario = empresasDoUsuarioPreService;
    
    scope.$watch('vm.empresa', function(){
      if(vm.empresa && vm.empresa.id){
        vm.empresa.repetida = usuarioJaPossuiPerfilNestaEmpresa(vm.empresa.id);
      }
    });
    
    scope.$watch('vm.perfilDeAcesso', function(){
      if(vm.perfilDeAcesso && vm.perfilDeAcesso.id){
        vm.perfilDeAcesso.repetido = usuarioJaPossuiOPerfilAdicionado(vm.perfilDeAcesso.id);
      }
    });
    
    function usuarioJaPossuiOPerfilAdicionado(perfilId){
      var result = false;      
      angular.forEach(vm.perfisDeAcessoIncluidos, function(perfil){
        if(perfil.id == perfilId){
          result = true;
          return;
        }
      });      
      return result;
    }
    
    function usuarioJaPossuiPerfilNestaEmpresa(empresaId){
      var result = false;
      angular.forEach(vm.empresasDoUsuario, function(empresa){
        if(empresa.id == empresaId){
          result = true;
          return;
        }
      });
      return result;
    }
    
    function save(){
		PerfilDeUsuarioService
			.create(montarPerfilDeUsuario())
				.then(perfilDeUsuarioCreateSuccess);
    }

    function backToList(){
    	UrlService.go('app.perfilDeUsuario-list',{id : vm.usuario.id.value});
    }

    function perfilDeUsuarioCreateSuccess(){
    	message.success("Perfil de Usuario salvo com sucesso");
    	UrlService.go('app.perfilDeUsuario-list',{id : vm.usuario.id.value});
    }
    
  	function getEmpresas(search){
      return EmpresaService
        .getEmpresas(search)
        .then(function(response){
          return response.data.data;            
        });
  	}

    function getPerfisDeAcesso(search){
      return PerfilDeAcessoService
        .getPerfisDeAcesso(search)
        .then(function(response){
          return response.data.data;            
        });
  	}

    function incluirPerfilDeAcesso(){      
      vm.perfisDeAcessoIncluidos.forEach(function(perfilDeAcesso){
        if(angular.equals(perfilDeAcesso, vm.perfilDeAcesso)){
          message.error("Este perfil de acesso já foi adicionado");
          throw "Perfil de acesso já adicionado";
        }
      });
      vm.perfisDeAcessoIncluidos.push(vm.perfilDeAcesso);
      vm.showDivEmpresaEPerfisDeAcesso = true;
      if(vm.divRestricoesEmVisualizacao){
        vm.findItensDeAcesso(1);
      }
      delete vm.perfilDeAcesso;      
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
  			.then(findItensDeAcessoSuccess);
  	    } else {
  	    	PerfilDeAcessoService.findAllItensDeAcessoBySeveralPerfilDeAcessoIdsWithParameter(getIdsPerfisDeAcesso(),pageNumber, vm.parametroBusca)
  			.then(findItensDeAcessoSuccess);
  	    }
  	}
  	
  	function findItensDeAcessoSuccess(response){
  		vm.inserirVariavelDisable(response);
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
  	
  	function empresaIsUndefined(){
      return !vm.empresa || !vm.empresa.id;  		
  	}       
  	
  	function perfilDeAcessoIsUndefined(){
      return !vm.perfilDeAcesso || !vm.perfilDeAcesso.id;
  	}
  }
}());