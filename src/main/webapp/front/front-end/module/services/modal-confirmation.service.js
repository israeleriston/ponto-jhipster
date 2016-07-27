(function(){
'use strict';
  angular
    .module('ModalConfirmationServices',[])
    .service('ModalConfirmationService',ModalConfirmationService)
    .controller('ModalConfirmationController', ModalConfirmationController);
  
  ModalConfirmationService.$inject = ['$uibModal', 'TemplateUrlPathFactory'];

  function ModalConfirmationService($uibModal, TemplateUrlPathFactory){
    this.confirmation = confirmation;

    function confirmation(contentModal){
      if(!contentModal){
        return;
      }
      var modalInstance = $uibModal.open({
          templateUrl: TemplateUrlPathFactory.getPahtUrlComponents() + '/confirmation/confirmation.html',
          controller : 'ModalConfirmationController',
          controllerAs : 'vm',
          bindToController : true,
          resolve : {
            dataPreService : dataPreService
          }
      });

      function dataPreService(){
        return contentModal;
      }

      return modalInstance.result;      
    }
  }

  ModalConfirmationController.$inject = ['dataPreService', 'BusEventsService'];

  function ModalConfirmationController(dataPreService, BusEventsService){
    var vm = this;
    vm.yes = yes;
    vm.cancel = cancel;
    vm.confirm = {
      header: dataPreService.header,
      body: dataPreService.text + ' ' + dataPreService.target + '?' + '\n' + (dataPreService.posText ? dataPreService.posText : '')
    };

    function yes() {
      vm.$close(dataPreService.object);
    };
    function cancel() {
      vm.$dismiss('cancel');
      BusEventsService.broadcast('ConfirmacaoCancelada');
    }
  }
}());    