(function () {
  'use strict';
  
  angular
    .module('RadioGroupDirective', [])
    .directive('radioGroup', radioGroup);
    
  radioGroup.$inject = ['TemplateUrlPathFactory', '$log'];
  
  function radioGroup(TemplateUrlPathFactory, $log) {
    var directive = {
      restrict: 'E',
      scope: {
        isRequired: '=',
        isInline: '=',
        optionsSource: '=',
        optionLabelField: '@',
        modelValueId: '='
      },
      templateUrl : TemplateUrlPathFactory.getPahtUrlComponents() + '/radio-group/radio-group.directive.html',
      link : link,
    };
    
    return directive;
    
    function link(scope, element, attrs) {
      if (angular.isUndefined(scope.optionLabelField)) {
        $log.error('Sem atributo de label. Informe option-label-field');
        return;
      }
    }
  }

}());