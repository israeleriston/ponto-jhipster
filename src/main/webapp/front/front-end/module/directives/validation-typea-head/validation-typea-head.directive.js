(function(){
  'use strict';
  angular
    .module('ValidationTypeaheadDirective', [])
    .directive('validationTypeahead', validationTypeahead);

  function validationTypeahead(){
    var directive = {
      link : link,
      require : 'ngModel',
      restrict: 'A',
    }

    return directive;

    function link(scope, element, attrs, model){
      scope.$watch(attrs.ngModel, function(value){
        if(!value){
          model.$setValidity('invalidTypeahead',true);
          return;
        }
        if(model.$dirty == true){
          model.$setValidity('invalidTypeahead', angular.isObject(value) && angular.isDefined(value.id));
          return;
        }
      });
    }
  }
}());