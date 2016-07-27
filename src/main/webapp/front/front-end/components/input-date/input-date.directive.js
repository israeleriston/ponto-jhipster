(function(){
'use strict';
angular
  .module('InputDateDirective',[])
  .directive('inputDate', inputDate);

  inputDate.$inject = ['TemplateUrlPathFactory'];

  function inputDate(TemplateUrlPathFactory){
    var directive = {
      restrict : 'E',
      scope : {
        object : '=',
        label : '@',
        name : '@',
        isRequired : '=',
        isDisabled : '=',

      },
      templateUrl: TemplateUrlPathFactory.getPahtUrlComponents() + '/input-date/input-date.directive.html',
      link : link,
      priority : 0,
    }
    return directive;

    function link(scope, element, attrs){
      scope.invalidDate = 'Data inválida.';
      scope.requiredMessage = 'Este campo é obrigatório.';
      scope.open = open;
      scope.disabled = disabled;
      scope.isValidDate = isValidDate;
      scope.format = 'dd/MM/yyyy';
      scope.formatMask = '99/99/9999';
       scope.showLabel = angular.isDefined(scope.label) && scope.label != null && scope.label != '';
     $('.date').mask("99/99/9999");

      scope.status = {
        opened : false
      }

      if(angular.isDefined(scope.object) && !(scope.object instanceof Date))
        scope.object = new Date(scope.object)

      function open (){
        scope.status.opened = true;
      }

      function disabled (){
        return scope.isDisabled == true;
      }

      var el = element.find('input');
      if(scope.isRequired == true){
        el.parent().parent().addClass('required');
      }

      function isValidDate(){
        return (scope.object instanceof Date);
      }
    }
  }
  
}());