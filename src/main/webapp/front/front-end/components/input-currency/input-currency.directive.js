(function(){
 'use strict';
  angular
    .module('InputCurrencyDirective',[])
    .directive('inputCurrency', inputCurrency);

  inputCurrency.$inject = ['TemplateUrlPathFactory'];

  function inputCurrency(TemplateUrlPathFactory){
    var directive = {
      restrict : 'E',
      scope : {
        object : '=',
        label : '@',
        name : '@',
        isRequired : '=',
        isDisabled : '=',
        verifyZeroNumbers : '='
      },
      templateUrl : TemplateUrlPathFactory.getPahtUrlComponents() + '/input-currency/input-currency.directive.html',
      link : link,
    }
    return directive;

    function link(scope, element, attrs){
      scope.requiredMessage = 'Este campo é obrigatório.';
      scope.numberIsZeroMessage = 'O valor deste campo não pode ser zero.';
      scope.maxLength = 14;
      scope.showLabel = angular.isDefined(scope.label) && scope.label != null && scope.label != '';

      scope.$watch('formInputCurrency.'+scope.name+'.$modelValue', function(value){
        if(!value){
          scope.formInputCurrency.$setPristine();
        }
        scope.formInputCurrency.$setValidity('numberIsZero', !(angular.isDefined(scope.verifyZeroNumbers) && scope.verifyZeroNumbers && isNumberZero(value) == true));
      });

      if(scope.isRequired == true){
        element.find('input').parent().addClass('required');
      }

      function isNumberZero(value) {
        return parseFloat(value) <= 0 || isNaN(value);
      }
    }
  }
}());