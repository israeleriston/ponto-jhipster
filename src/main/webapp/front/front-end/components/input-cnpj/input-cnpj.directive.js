(function(){
 'use strict';
  angular
    .module('InputCnpjDirective',[])
    .directive('inputCnpj', inputCnpj);

  inputCnpj.$inject = ['TemplateUrlPathFactory'];

  function inputCnpj(TemplateUrlPathFactory){
    var directive = {
      restrict : 'E',
      scope : {
        object : '=',
        isRequired : '=',
        isDisabled : '='
      },
      templateUrl : TemplateUrlPathFactory.getPahtUrlComponents() + '/input-cnpj/input-cnpj.directive.html',
      link : link,
    }
    return directive;

    function link(scope, element, attrs){
      var maxLength = 20
        , minLength = 11;

      scope.$watch('formInputCnpj.cnpj.$modelValue', function(value){
        if(!value){
          scope.formInputCnpj.$setPristine();
        }
      });
      scope.invalidCnpj = 'CNPJ Invalido.'
      scope.requiredMessage = 'Este campo é obrigatório.'
      var el = element.find('input');
      if(angular.isUndefined(scope.maxLength) || scope.maxLength > maxLength){
        scope.maxLength = maxLength;
      }
      if(angular.isUndefined(scope.minLength)){
        scope.minLength = minLength;
      }
      if(scope.isRequired == true){
        el.parent().addClass('required');
      }
    }
  }
}())