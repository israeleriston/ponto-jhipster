(function(){
  'use strict';
  angular
    .module('AddButtonRegisteringDirective',[])
    .directive('addButtonRegistering',addButtonRegistering)
    .controller('ModalInstanceController', ModalInstanceController);

  addButtonRegistering.$inject = ['MenuBuildService', '$state', 'TemplateUrlPathFactory', '$templateFactory', '$uibModal', 'WindowManagerService'];

  function addButtonRegistering(MenuBuildService, $state, TemplateUrlPathFactory, $templateFactory, $uibModal, WindowManagerService) {
    var directive = {
      restrict : 'EA',
      templateUrl: TemplateUrlPathFactory.getPathUrlDirectives() + '/addButtonRegistering/add-button-registering.html',
      replace : true,
      scope : {
        addButtonRegistering : '=togo'
      },
      link : link
    }
    return directive

    function link(scope, element, attrs){
      var item = getItem(attrs.actionVerify);
      if(!item.state){
        return;
      }

      scope.registering = item.state;
      scope.label = item.nome;
      scope.goState = goState;

      function goState(){
        if (WindowManagerService.getOpenMode() == 'new-tab') {
          openAsNewTab();
          return;
        }
        
        if (WindowManagerService.getOpenMode() == 'modal') {
          openAsModal();
          return;
        }
        
        console.error('Impossível determinar forma de abrir nova página.')

        function openAsNewTab() {
          var url = $state.href(scope.registering,{},{notify:true});
          window.open(url, '_blank');          
        }
        
        function openAsModal() {
          var stateConfig = $state.get(scope.registering);
          stateConfig.templateProvider(TemplateUrlPathFactory, $templateFactory)
            .then(openTemplateAsModal);
            
          function openTemplateAsModal(template) {
            var modalInstance = $uibModal.open({
              animation: true,
              template: template,
              controller: stateConfig.controller,
              controllerAs: stateConfig.controllerAs,
              windowTemplateUrl: TemplateUrlPathFactory.getPathUrlDirectives() + '/addButtonRegistering/window.template.html',
            });
            
            modalInstance.result.then(doNothing, closeWindow);
            
            WindowManagerService.push(modalInstance);
            
            function doNothing() {};
            
            function closeWindow() {
              console.log('Fechando por dismiss');
              WindowManagerService.pop();
            };
          }
        }
      }

      function getItem(action){
        var item = MenuBuildService
          .getItemMenuByFeature(action);
        return item;
      }

    }
  }
  
  ModalInstanceController.$inject = ['WindowManagerService'];
  function ModalInstanceController(WindowManagerService){
    var vm = this;
    vm.close = close;

    function close(){
      WindowManagerService.pop();
    };
  };

}());