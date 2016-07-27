(function(){
 'use strict';
  angular
    .module('InputCpfDirective',[])
    .directive('inputCpf', inputCpf);

  inputCpf.$inject = ['TemplateUrlPathFactory'];

  function inputCpf(TemplateUrlPathFactory){
    var directive = {
      restrict : 'E',
      scope : {
        object : '=',
        isRequired : '=',
		    isDisabled : '='
      },
      templateUrl : TemplateUrlPathFactory.getPahtUrlComponents() + '/input-cpf/input-cpf.directive.html',
      link : link,
    }
    return directive;

    function link(scope, element, attrs){
      var maxLength = 14
        , minLength = 13;
      scope.$watch('formInputCpf.cpf.$modelValue', function(value){
        if(!value){
          scope.formInputCpf.$setPristine();
        }
      });
      scope.invalidCpf = 'CPF Invalido.'
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