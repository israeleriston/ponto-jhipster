(function(){
'use strict';    
angular
  .module('PerfilDeAcessoCreate',[])
  .config(config)
  .controller('PerfilDeAcessoCreateController', PerfilDeAcessoCreateController)
  ;

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.perfilDeAcesso-create',{
        url : '/perfilDeAcesso/create',
        templateProvider : templateProvider,
        controller : 'PerfilDeAcessoCreateController',
        controllerAs : 'vm',
        resolve : {
          componentesDoLoginPreService : componentesDoLoginPreService
        }
      });

    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/perfil-acesso/perfil-acesso-create.html';
      return $templateFactory.fromUrl(url);
    };
    
    componentesDoLoginPreService.$inject = ['PerfilDeAcessoService', 'context'];
    function componentesDoLoginPreService(PerfilDeAcessoService, context){
    	return PerfilDeAcessoService.buscarComponentesDeLogin();
    };
  }

  PerfilDeAcessoCreateController.$inject = ['UrlService','PerfilDeAcessoService', 'message', 'componentesDoLoginPreService'];
  function PerfilDeAcessoCreateController(UrlService, PerfilDeAcessoService, message, componentesDoLoginPreService){
   var vm = this;
   vm.perfilDeAcesso = {};
   vm.perfilDeAcesso.itensDeAcessoId = [];
   vm.arvoreDeItensDeAcesso;
   vm.itensSelecionados = new Set();
   vm.save = save;
   vm.getArvoreDeItensDeAcesso = getArvoreDeItensDeAcesso;
   vm.backToList = backToList;
	 vm.montarArvore = montarArvore;
	 vm.getArvoreDeItensDeAcesso();
   vm.componentesDoLogin = buildComponentesDoLogin(componentesDoLoginPreService.data);
   vm.selecionarComponenteDeLogin = selecionarComponenteDeLogin;
   vm.precedenteSelecionado = precedenteSelecionado;
	
	function save(){

    	var tree = $('#jstree').jstree(true);
    	
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
          vm.perfilDeAcesso.componentesDeLoginValues.push({ value : componente.id });
        }
      });
      
      PerfilDeAcessoService
        .create(vm.perfilDeAcesso)
          .then(perfilDeAcessoCreateSuccess);
    }

    function backToList(){
    	UrlService.go('app.perfilDeAcesso-list');
    }

    function perfilDeAcessoCreateSuccess(){
    	message.success("Perfil de acesso salvo com sucesso");
    	UrlService.go('app.perfilDeAcesso-list');
    }

    function getArvoreDeItensDeAcesso(){
      return PerfilDeAcessoService
        .getArvoreDeItensDeAcesso()
        .then(function(data){
        	montarArvore(data.data);
        });
    }
    
    function buildComponentesDoLogin(componentesQuery){      
      angular.forEach(componentesQuery, function(componente){
        if(!componente.precedent){
          componente.selecionado = true;
          componente.isObrigatorio = true;
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
    
    function montarArvore(itens) {
    	$('#jstree').jstree({
    		"core":{
    			"data": itens,
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
            vm.haItensSelecionados = vm.itensSelecionados.size > 0;
            $("#botaoSalvar").prop("disabled",vm.itensSelecionados.size < 1 || 
                (vm.perfilDeAcesso.nome == undefined || vm.perfilDeAcesso.nome == ""));
    	});
	};	
  }
}())