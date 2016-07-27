(function(){
 'use strict';
  angular
    .module('InputDecimalNumberDirective',[])
    .directive('inputDecimalNumber', inputDecimalNumber);

  inputDecimalNumber.$inject = ['TemplateUrlPathFactory'];

  function inputDecimalNumber(TemplateUrlPathFactory){
    var directive = {      
      restrict : 'E',
      scope : {
        object : '=',
        label : '@',
        name : '@',
        id : '@',
        isRequired : '=',
        isDisabled : '=',
        qntDecimalPlaces : '@',
        min : '@',
        maxLength : '@',
        customError : '=',
        customErrorMessage : '@',
      },
      link : link,
      templateUrl : TemplateUrlPathFactory.getPahtUrlComponents() + '/input-decimal-number/input-decimal-number.directive.html',
    };
    return directive;

    function link(scope, element, attrs){
      var el = element.find('input');
      scope.showLabel = angular.isDefined(scope.label) && scope.label != null && scope.label != '';
      scope.requiredMessage = 'Este campo é obrigatório';
      if(angular.isUndefined(scope.maxLength)){
        scope.maxLength = 14;
      };
      if(angular.isUndefined(scope.qntDecimalPlaces)){
        scope.qntDecimalPlaces = 2;
      };
      scope.$watch('formInputDecimalNumber.'+scope.name+'.$modelValue', function(value){
        if(!value){
          scope.formInputDecimalNumber.$setPristine();
        }
      });

      if(angular.isDefined(scope.customError)){
        scope.$watch('customError', function(value){
          if(angular.isUndefined(scope.customErrorMessage)){
            scope.customErrorMessage = 'Não foi informado a mensagem de erro.';
          }
          scope.formInputDecimalNumber[scope.name].$setValidity('customError', !value);
        })
      }

      if(scope.isRequired == true){
        el.parent().addClass('required');
      }
    }
  }
}());