(function(){
 'use strict';
  angular
    .module('InputLongDescriptionDirective',[])
    .directive('inputLongDescription', inputLongDescription);

  inputLongDescription.$inject = ['TemplateUrlPathFactory'];

  function inputLongDescription(TemplateUrlPathFactory){
    var directive = {
      restrict : 'E',
      scope : {
        object : '=',
        label : '@',
        name : '@',
        isRequired : '=',
        maxLength : '@',
        minLength : '@',
        isUpperCase : '=',
        isDisabled : '='
      },
      templateUrl : TemplateUrlPathFactory.getPahtUrlComponents() + '/input-long-description/input-long-description.directive.html',
      link : link,
    }
    return directive;

    function link(scope, element, attrs){
      var maxLength = 255
        , minLength = 1
        , el = element.find('input');
      scope.minLengthMessage = 'Valor do campo muito curto.'
      scope.maxLengthMessage = 'Valor do campo muito longo.'
      scope.requiredMessage = 'Este campo é obrigatório.'
      scope.showLabel = angular.isDefined(scope.label) && scope.label != null && scope.label != '';
      scope.$watch('formInputLongDescription.'+scope.name+'.$modelValue', function(value){
        if(!value){
          scope.formInputLongDescription.$setPristine();
        }
      });
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