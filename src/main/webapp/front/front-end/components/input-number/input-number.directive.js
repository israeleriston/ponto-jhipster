(function(){
 'use strict';
  angular
    .module('InputNumberDirective',[])
    .directive('inputNumber', inputNumber);

  inputNumber.$inject = ['TemplateUrlPathFactory'];

  function inputNumber(TemplateUrlPathFactory){
    var directive = {
      restrict : 'E',
      scope : {
        object : '=',
        label : '@',
        name : '@',
        isRequired : '=',
        maxLength : '@',
        minLength : '@',
        isDisabled : '=',
        verifyZeroNumbers : '='
      },
      link : link,
      templateUrl : TemplateUrlPathFactory.getPahtUrlComponents() + '/input-number/input-number.directive.html',
    };
    return directive;

    function link(scope, element, attrs){
      var el = element.find('input');
      scope.minLengthMessage = 'Valor do campo muito curto.'
      scope.maxLengthMessage = 'Valor do campo muito longo.'
      scope.requiredMessage = 'Este campo é obrigatório.'
      scope.numberIsZeroMessage = 'O valor deste campo não pode ser zero.'
      scope.showLabel = angular.isDefined(scope.label) && scope.label != null && scope.label != '';
      scope.$watch('formInputNumber.'+scope.name+'.$modelValue', function(value){
        if(!value){
          scope.formInputNumber.$setPristine();
        }
        scope.formInputNumber.$setValidity('numberIsZero', !(angular.isDefined(scope.verifyZeroNumbers) && scope.verifyZeroNumbers && isNumberZero() == true));
      });
      if(scope.isRequired == true){
        el.parent().addClass('required');
      }
      
      function isNumberZero() {
        return parseInt(scope.object, 10) <= 0;
      }
    }
  }
}());