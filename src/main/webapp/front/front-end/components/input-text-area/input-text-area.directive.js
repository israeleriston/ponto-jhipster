(function(){
 'use strict';
  angular
    .module('InputTextAreaDirective',[])
    .directive('inputTextArea', inputTextArea);

  inputTextArea.$inject = ['TemplateUrlPathFactory'];

  function inputTextArea(TemplateUrlPathFactory){
    var directive = {
      restrict : 'E',
      scope : {
        object : '=',
        label : '@',
        name : '@',
        isRequired : '=',
        maxLength : '@',
        minLength : '@',
        rowsLength: '@',
        isUpperCase : '=',
        isDisabled : '='
      },
      templateUrl : TemplateUrlPathFactory.getPahtUrlComponents() + '/input-text-area/input-text-area.directive.html',
      link : link,
    }
    return directive;

    function link(scope, element, attrs){
      var maxLength = 255
        , minLength = 1
        , rowsLength = 5
        , el = element.find('input');
      scope.minLengthMessage = 'Valor do campo muito curto.'
      scope.maxLengthMessage = 'Valor do campo muito longo.'
      scope.requiredMessage = 'Este campo é obrigatório.'
      scope.showLabel = angular.isDefined(scope.label) && scope.label != null && scope.label != '';
      scope.$watch('formInputTextArea.'+scope.name+'.$modelValue', function(value){
        if(!value){
          scope.formInputTextArea.$setPristine();
        }
      });
      if(angular.isUndefined(scope.maxLength) || scope.maxLength > maxLength){
        scope.maxLength = maxLength;
      }
      if(angular.isUndefined(scope.minLength)){
        scope.minLength = minLength;
      }
      if(angular.isUndefined(scope.rowsLength)){
        scope.rowsLength = rowsLength;
      }
      if(scope.isRequired == true){
        el.parent().addClass('required');
      }
    }
  }
}())