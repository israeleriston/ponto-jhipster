(function() {
  'use strict';
  angular
    .module('EnderecoDirective', [])
    .directive('endereco', endereco)
    .controller('ModalInstanceEnderecoController', ModalInstanceEnderecoController);

  endereco.$inject = ['TemplateUrlPathFactory', '$uibModal', 'EnderecoService', 'message'];
  function endereco(TemplateUrlPathFactory, $uibModal, EnderecoService, message){
    var directive = {
      restrict : 'E',
      replace : false,
      transclude : true,
      scope : {
        enderecos : '=',
        isRequired : '=',
        name : '@',
      },
      link : link,
      templateUrl: TemplateUrlPathFactory.getPathUrlDirectives() + '/endereco/endereco.directive.html'
    }

    return directive;

    function link(scope, element, attrs){
      scope.name = angular.isUndefined(scope.name) ? 'principal' : scope.name
      scope.enderecos = scope.enderecos || [];
      scope.editEndereco = editEndereco;
      scope.removeEndereco = removeEndereco;
      scope.openModal = openModal;
      scope.templatePopover = TemplateUrlPathFactory.getPathUrlDirectives() + '/endereco/template-popover-copy-endereco.html';
      scope.copiarEnderecoDisabled = copiarEnderecoDisabled;
      scope.copiarEndereco = copiarEndereco;        
      getTiposEndereco();

      function editEndereco(endereco){
        openModal(endereco);
      }

      function openModal(endereco){
        var modalInstance = $uibModal.open({
          animation : true,
          templateUrl: TemplateUrlPathFactory.getPathUrlDirectives() + '/endereco/endereco-modal.html',
          size : 'lg',
          controller : 'ModalInstanceEnderecoController',
          controllerAs : 'vm',
          bindToController : true,
          backdrop : 'static',
          resolve : {
            preServiceEnderecos : preServiceEnderecos,
            preServiceEndereco : preServiceEndereco,
          }
        });

        function preServiceEnderecos(){
          return scope.enderecos;
        }

        function preServiceEndereco(){
          var index = scope.enderecos.indexOf(endereco);
          return !endereco ? null : index;
        }
      }

      function removeEndereco(endereco){
        var index = scope.enderecos.indexOf(endereco);
        scope.enderecos.splice(index,1);
      }
      
      function getTiposEndereco(){
        EnderecoService
          .getTiposEndereco()
          .then(function(response){
            scope.tiposDeEndereco = response;
          });
      }
      
      function copiarEnderecoDisabled(tipo){
        if(tipo != 'PRINCIPAL'){
          return false;
        }
        var result = false;
        angular.forEach(scope.enderecos, function(endereco){
          if(endereco.tipoendereco == 'PRINCIPAL'){
            result = true;
            return;
          }
        });
        return result;
      }
      
      function copiarEndereco(endereco, tipo){
        if(copiarEnderecoDisabled(tipo)){
          return;
        }
        var enderecoDestino = angular.copy(endereco);
        enderecoDestino.tipoendereco = tipo;
        scope.enderecos.push(enderecoDestino);
        message.success('Endereço adicionado com sucesso.',{'positionClass': 'toast-top-right','timeOut': '1000'});
      }
    }
  }

  ModalInstanceEnderecoController.$inject = ['preServiceEnderecos', 'preServiceEndereco', 'UnidadeFederativaService','CidadeService', 'EnderecoService', 'message'];
  function ModalInstanceEnderecoController(preServiceEnderecos, preServiceEndereco, UnidadeFederativaService, CidadeService, EnderecoService, message){
    var vm = this;
    vm.fechar = fechar;
    vm.salvar = salvar;
    vm.enderecos = preServiceEnderecos;
    vm.getUfs = getUfs;
    vm.getCidades = getCidades;
    vm.init = init;
    vm.isValidUf = isValidUf;
    vm.descricaoBotao = preServiceEndereco != null ? 'Salvar' : 'Adicionar';
    vm.buscarCep = buscarCep;
    vm.getTipoEnderecosTypeAHead = getTipoEnderecosTypeAHead;
    
    init();

    function init(){
      getTiposDeLogradouro();
      getTiposEndereco();
      vm.endereco = preServiceEndereco == null ? {} : angular.copy(vm.enderecos[preServiceEndereco]);
      if(vm.endereco.cep){
        buscarCep(vm.endereco.cep);
      }
    }

    function getTiposDeLogradouro(){
      EnderecoService
        .getTiposLogradouro()
        .then(function(response){
          vm.tiposDeLogradouro = response;
          return vm.tiposDeLogradouro;
        });
    }
    
    function getTipoEnderecosTypeAHead(busca){
      busca = busca.toUpperCase();
      var result = [];
      angular.forEach(vm.tiposDeLogradouro, function(tipo, index){
        if(result.length <= 5){
          if(tipo.indexOf(busca) == 0){
            result.push({ id : index, nome : tipo});
          }
        }
      });
      return result;
    }

    function getTiposEndereco(){
      EnderecoService
        .getTiposEndereco()
        .then(function(response){
          vm.tiposDeEndereco = response;
          return vm.tiposDeEndereco;
        });
    }

    function getUfs(search){
      return UnidadeFederativaService
      .ufFindAllSigla(search)
      .then(function(response){
        return response.data
      });
    };

    function getCidades(search){
      return CidadeService
        .getCidadesFromUf(vm.endereco.uf.id, search)
        .then(function(response){
          return response.data;
      });
    };

    function isValidUf(){
      if(vm.endereco && vm.endereco.uf){
        if(!angular.isDefined(vm.endereco.uf.id)){
          vm.endereco.cidade = '';
        }else{
          return angular.isDefined(vm.endereco.uf.id);
        }
      }
      return false;
    };

    function fechar(){
      vm.$dismiss('cancel');
    }
    
    function salvar(){
      if(temEnderecoPrincipal(vm.endereco)){
        message.warning('Endereço do tipo PRINCIPAL já cadastrado',{'positionClass': 'toast-top-right','timeOut': '1000'});
        return;
      }
      if(preServiceEndereco == null){
        vm.enderecos.push(new Endereco(vm.endereco));
        vm.endereco = {};
        message.success('Endereço adicionado com sucesso.',{'positionClass': 'toast-top-right','timeOut': '1000'});
        fechar();
        return;
      }
      vm.enderecos.splice(preServiceEndereco, 1, new Endereco(vm.endereco));
      message.success('Endereço atualizado com sucesso.',{'positionClass': 'toast-top-right'})
      fechar();
    }

    function temEnderecoPrincipal(endereco){
      var temEndereco = false;
      angular.forEach(vm.enderecos, function(item, index){
        if(endereco.tipoendereco == item.tipoendereco && endereco.tipoendereco == 'PRINCIPAL' && index != preServiceEndereco){
          temEndereco = true;
          return temEndereco;
        }
      });
      return temEndereco;
    };

    function Endereco(endereco){
      var end = {
        tipologradouro : angular.isObject(endereco.tipologradouro) ? endereco.tipologradouro.nome : endereco.tipologradouro,
        logradouro : endereco.logradouro,
        numero : endereco.numero || '',
        bairro : endereco.bairro,
        cep : endereco.cep,
        cidade : endereco.cidade,
        uf : endereco.uf,
        cidadeid : endereco.cidade.id,
        tipoendereco : endereco.tipoendereco,
        complemento : endereco.complemento,
      }
      return end;
    }
    
    function buscarCep(){
      if(!cepValid()){
        resetCep();
        return;
      }
      EnderecoService.buscaCep(vm.endereco.cep)
        .then(function(cep){
          if(!cep){
            resetCep();
            return;
          }
          vm.endereco.uf = cep.localidade.uf;
          vm.endereco.cidade = cep.localidade;
          if(!cep.cepUnico){
            vm.endereco.tipologradouro = { id : cep.logradouroTipo, nome : cep.logradouroTipo }
            vm.endereco.logradouro = cep.logradouroNome;
            vm.endereco.bairro = cep.bairroNome;            
          }
          vm.cepBloqueado = true;
          vm.cepUnico = cep.cepUnico;
        });
    }
    
    function cepValid(){
      return vm.endereco.cep && vm.endereco.cep.length == 8 && !isNaN(vm.endereco.cep);
    }
    
    function resetCep(){
      if(preServiceEndereco){
        return;
      }
      delete vm.endereco.uf;
      delete vm.endereco.cidade;
      delete vm.endereco.tipologradouro;
      delete vm.endereco.logradouro;
      delete vm.endereco.bairro;
      vm.cepBloqueado = false;
    }       
  }
}())