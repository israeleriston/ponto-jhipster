(function() {
  'use strict';
  angular
    .module('TelefoneDirective',[])
    .directive('telefone', telefone)
    .controller('ModalInstanceTelefoneController',ModalInstanceTelefoneController)

  telefone.$inject = ['TemplateUrlPathFactory', '$uibModal'];

  function telefone(TemplateUrlPathFactory, $uibModal) {
    var directive = {
      restrict : 'E',
      replace : false,
      transclude : true,
      link : link,
      scope : {
        telefones : '=',
        isRequired : '=',
        name : '@',
      },
      templateUrl: TemplateUrlPathFactory.getPathUrlDirectives() + '/telefone/telefone.directive.html'
    };

    return directive;

    function link(scope, element, attrs){
      scope.name = angular.isUndefined(scope.name) ? 'principal' : scope.name
      scope.telefones = scope.telefones || [];
      scope.editTelefone = editTelefone;
      scope.removeTelefone = removeTelefone;
      scope.openModal = openModal;

      function editTelefone(telefone){
        openModal(telefone);
      };

      function removeTelefone(telefone){
        var index = scope.telefones.indexOf(telefone);
        scope.telefones.splice(index,1);
      }

      function openModal(telefone){
        var modalInstance = $uibModal.open({
          animation : true,
          templateUrl: TemplateUrlPathFactory.getPathUrlDirectives() + '/telefone/telefone-modal.html',
          controller : 'ModalInstanceTelefoneController',
          controllerAs : 'vm',
          bindToController : true,
          backdrop : 'static',
          resolve : {
            preServiceTelefones : preServiceTelefones,
            preServiceTelefone : preServiceTelefone,
          }
        });

        function preServiceTelefones(){
          return scope.telefones;
        }

        function preServiceTelefone(){
          var index = scope.telefones.indexOf(telefone);
          return !telefone ? null : index;
        };
      }
    }
  }

  ModalInstanceTelefoneController.$inject = ['preServiceTelefones', 'preServiceTelefone', 'TelefoneService', 'message', '$log'];

  function ModalInstanceTelefoneController(preServiceTelefones, preServiceTelefone, TelefoneService, message, $log){
    var vm = this;
    vm.fechar = fechar;
    vm.salvar = salvar;
    vm.telefones = preServiceTelefones;
    vm.init = init;
    vm.descricaoBotao = preServiceTelefone != null ? 'Salvar' : 'Adicionar';
    init();

    function init(){
      TelefoneService
        .getTiposDeTelefones()
        .then(function(response){
          vm.tipos = response;
          return vm.tipos;
        });
      vm.telefone = preServiceTelefone == null ? {} : new TelefoneEdit(vm.telefones[preServiceTelefone]);
    }

    function fechar(){
      vm.$dismiss('cancel');
    }

    function salvar(){
      if(preServiceTelefone == null){
        vm.telefones.push(new Telefone(vm.telefone));
        vm.telefone = {};
        message.success('Telefone adicionado com sucesso.',{'positionClass': 'toast-top-right','timeOut': '1000'});
        fechar();
        return;
      }
      vm.telefones.splice(preServiceTelefone,1,new Telefone(vm.telefone));
      fechar();
      message.success('Telefone salvo com sucesso.',{'positionClass': 'toast-top-right','timeOut': '1000'});
    }

    function Telefone(telefone){
      var tel = {
        ddd : String(telefone.numero).substring(0,2),
        numero : String(telefone.numero).substring(2,telefone.numero.length),
        tipo : telefone.tipo
      }
      return tel;
    }

    function TelefoneEdit(telefone){
      var tel = {
        numero : String(telefone.ddd) + String(telefone.numero),
        tipo : telefone.tipo
      }
      return tel;
    }
  }
}())

