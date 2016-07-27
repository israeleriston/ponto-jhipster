(function(){
 'use strict';
  angular
    .module('InputTypeaheadDirective',[])
    .directive('inputTypeahead', inputTypeahead);

  inputTypeahead.$inject = ['TemplateUrlPathFactory'];

  function inputTypeahead(TemplateUrlPathFactory){
    var directive = {
      restrict : 'E',
      scope : {
        object : '=',
        func : '&',
        changefunc: '&',
        label : '@',
        field : '@',
        name : '@',
        placeholder: '@',
        isRequired : '=',
        isUpperCase : '=',
        isDisabled : '='
      },
      templateUrl : TemplateUrlPathFactory.getPahtUrlComponents() + '/input-typeahead/input-typeahead.directive.html',
      link : link,
    }
    return directive;

    function link(scope, element, attrs){
      scope.executeFunction = scope.func();
      scope.onSelectFunction = scope.changefunc();
      scope.showLabel = angular.isDefined(scope.label) && scope.label != null && scope.label != '';

      scope.$watch('formInputTypeahead.'+scope.name+'.$modelValue', function(value){
        if(!value){
          scope.formInputTypeahead.$setPristine();
        }
      });

      scope.invalidTypeahead = 'Selecione um(a) ' + scope.label + ' corretamente.'
      scope.requiredMessage = 'Este campo é obrigatório.'

      var el = element.find('input');
      if(scope.isRequired == true){
        el.parent().addClass('required');
      }
    }
  }
}())