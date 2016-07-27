(function(){
'use strict';
angular
  .module('PerfilDeAcessoEdit',[])
  .config(config)
  .controller('PerfilDeAcessoEditController',PerfilDeAcessoEditController)
  ;

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.perfilDeAcesso-edit',{
        url : '/perfilDeAcesso/:id/edit',
        templateProvider : templateProvider,
        controller : 'PerfilDeAcessoEditController',
        controllerAs : 'vm',
        resolve : {
          perfilDeAcessoPreService : perfilDeAcessoPreService,
          componentesDoLoginPreService : componentesDoLoginPreService,
          perfilDeAcessoComponentesDoLoginPreService : perfilDeAcessoComponentesDoLoginPreService
        }
      });

    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/perfil-acesso/perfil-acesso-create.html';
      return $templateFactory.fromUrl(url);
    }

    perfilDeAcessoPreService.$inject = ['PerfilDeAcessoService', '$stateParams', 'context'];
    function perfilDeAcessoPreService(PerfilDeAcessoService, $stateParams, context){
      return PerfilDeAcessoService.get($stateParams.id);
    }
    
    componentesDoLoginPreService.$inject = ['PerfilDeAcessoService', 'perfilDeAcessoPreService'];
    function componentesDoLoginPreService(PerfilDeAcessoService, perfilDeAcessoPreService){
    	return PerfilDeAcessoService.buscarComponentesDeLogin();
    }
    
    perfilDeAcessoComponentesDoLoginPreService.$inject = ['PerfilDeAcessoService', '$stateParams', 'componentesDoLoginPreService'];
    function perfilDeAcessoComponentesDoLoginPreService(PerfilDeAcessoService, $stateParams, componentesDoLoginPreService){
    	return PerfilDeAcessoService.buscarComponentesDeLoginPorPerfilDeAcesso($stateParams.id);
    }
  }

  PerfilDeAcessoEditController.$inject = ['UrlService', 'perfilDeAcessoPreService', 'componentesDoLoginPreService', 'perfilDeAcessoComponentesDoLoginPreService', 'PerfilDeAcessoService', 'message'];
  function PerfilDeAcessoEditController(UrlService, perfilDeAcessoPreService, componentesDoLoginPreService, perfilDeAcessoComponentesDoLoginPreService, PerfilDeAcessoService, message){
    var vm = this;

    vm.perfilDeAcesso = perfilDeAcessoPreService.data;
    vm.perfilDeAcesso.itensDeAcessoId = perfilDeAcessoPreService.data.itensPerfilDeAcesso;
    vm.itensSelecionados = new Set();
    vm.backToList = backToList;
    vm.save = save;
    vm.formIsInvalid = formIsInvalid;
    vm.validateForm = validateForm;
    getArvoreDeItensDeAcesso();
    vm.componentesDoLogin = buildComponentesDoLogin(componentesDoLoginPreService.data);
    vm.selecionarComponenteDeLogin = selecionarComponenteDeLogin;
    vm.precedenteSelecionado = precedenteSelecionado;
    
    function save(){
    	var tree = $('#jstree').jstree(true);
    	vm.perfilDeAcesso.itensDeAcessoId = [];
    	vm.itensSelecionados.forEach(function(item){
    		var parents = tree.get_node(item).parents;
    		parents.forEach(function(itemParent){
    			if(itemParent != "#" && vm.itensSelecionados.has(itemParent)==false){
    				vm.itensSelecionados.add(itemParent);
    			}
    		});
    	});
    	
      vm.itensSelecionados.forEach(function(item){
        vm.perfilDeAcesso.itensDeAcessoId.push({
            value : item
          });
      });
      
      vm.perfilDeAcesso.componentesDeLoginValues = [];
      angular.forEach(vm.componentesDoLogin, function(componente){
        if(componente.selecionado){
          vm.perfilDeAcesso.componentesDeLoginValues.push({value : componente.id});
        }
      });
      PerfilDeAcessoService
        .edit(vm.perfilDeAcesso)
          .then(perfilDeAcessoEditSuccess);
    }

    function perfilDeAcessoEditSuccess(response){
    	UrlService.go('app.perfilDeAcesso-list');
    	message.success('Perfil de acesso editado com sucesso');
    }

    function backToList(){
      UrlService.go('app.perfilDeAcesso-list');
    }
    
    function getArvoreDeItensDeAcesso(){
      return PerfilDeAcessoService
        .getArvoreDeItensDeAcesso()
        .then(function(data){
          montarArvore(data.data, vm.perfilDeAcesso.itensDeAcessoId);
        });
    }
    
    function buildComponentesDoLogin(componentesQuery){
      angular.forEach(componentesQuery, function(componente){
        if(!componente.precedent){
          componente.selecionado = true;
          componente.isObrigatorio = true;
        }else{
          angular.forEach(perfilDeAcessoComponentesDoLoginPreService, function(componenteUtilizado){
            if(componente.id == componenteUtilizado.componenteloginvalue){
              componente.selecionado = true;
            }
          }); 
        }        
      });
      return componentesQuery;
    }    
    
    function selecionarComponenteDeLogin(componente){
      componente.selecionado = (componente.selecionado ? false : true);
      if(!componente.selecionado){
        desmarcarComponentesDependentes(componente);
      }
    }
    
    function desmarcarComponentesDependentes(componentePrecedente){
      angular.forEach(vm.componentesDoLogin, function(componente){
        if(componente.precedent == componentePrecedente.id){
          componente.selecionado = false;
          desmarcarComponentesDependentes(componente);
        }
      });
    }
    
    function precedenteSelecionado(componenteVerificado){
      var result = false;      
      angular.forEach(vm.componentesDoLogin, function(componente){        
        if(componenteVerificado.precedent == componente.id){
          result = componente.selecionado;
          return;
        }
      });
      return result;
    }
      
      function montarArvore(todosOsItens, itensDoPerfil) {
      	$('#jstree').jstree({
      		"core":{
      			"data": todosOsItens,
      		     "themes": {
   		            "icons":false
   		        }
      		},
  			"plugins" : ["checkbox","search"],
  		  	"checkbox": {
  				"real_checkboxes": false,
  			    "three_state": true
  		  	},
  		  	"search" : {
		  		"show_only_matches" : true
  		  	}
      	}).on('loaded.jstree', function () {
      	    itensDoPerfil.forEach(function(item){
      	    	if($('#jstree').jstree(true).get_node(item.itemDeAcessoId.value).children.length == 0){
      	    		 $('#jstree').jstree(true).select_node(item.itemDeAcessoId.value);
      	    	}
      	    });
      	});
      	
      	var to = false;
      	$('#searchField').keyup(function () {
      		if(to) { clearTimeout(to); }
      		to = setTimeout(function () {
      			var v = $('#searchField').val();
      			$('#jstree').jstree(true).search(v);
      		}, 250);
      	});
  		
      	$('#jstree').on("changed.jstree", function(e, data) {
      		vm.itensSelecionados = new Set(data.selected);
      		if(formIsInvalid()){
      			disableButtom();
    		}else{
    			enableButtom();
    		}
      	});
  	};
  	
  	function formIsInvalid(){
		if(vm.itensSelecionados.size < 1 || vm.perfilDeAcesso.nome == undefined || vm.perfilDeAcesso.nome == ""){
			return true;
		}else{
			return false;
		}
	}
  	
  	function validateForm(){
		if(formIsInvalid()){
			disableButtom()
			
		}else{
			enableButtom();
		}
	}
	
	function disableButtom(){
		$("#botaoSalvar").prop("disabled",true);
	}
	
	function enableButtom(){
		$("#botaoSalvar").prop("disabled",false);
	}
  }
}())
