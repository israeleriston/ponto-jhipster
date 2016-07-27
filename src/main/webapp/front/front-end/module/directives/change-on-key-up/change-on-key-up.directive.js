(function(){
'use strict';
angular
  .module('ChangeOnKeyUpDirective',[])
  .directive('changeOnKeyup', changeOnKeyup);

  function changeOnKeyup() {
    return {
      require : 'ngModel',
      link : function(scope, element, attrs, modelCtrl) {
        element.on('keyup', element.triggerHandler.bind(element, 'change'));
      }
    }
  }
}());