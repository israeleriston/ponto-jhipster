(function(){
 'use strict';
  angular
    .module('InputEmailDirective',[])
    .directive('inputEmail', inputEmail);

  inputEmail.$inject = ['TemplateUrlPathFactory'];

  function inputEmail(TemplateUrlPathFactory){
    var directive = {
      restrict : 'E',
      scope : {
        object : '=',
        label : '@',
        name : '@',
        isRequired : '=',
        maxLength : '@',
        minLength : '@',
        isDisabled : '='
      },
      templateUrl : TemplateUrlPathFactory.getPahtUrlComponents() + '/input-email/input-email.directive.html',
      link : link,
    }
    return directive;

    function link(scope, element, attrs){
      var maxLength = 255
        , minLength = 3
        , el = element.find('input');
      scope.minLengthMessage = 'Valor do campo muito curto.';
      scope.maxLengthMessage = 'Valor do campo muito longo.';
      scope.requiredMessage = 'Este campo é obrigatório.';
      scope.invalidEmail = 'Email invalido.';
      scope.showLabel = angular.isDefined(scope.label) && scope.label != null && scope.label != '';
      scope.$watch('formInputEmail.'+scope.name+'.$modelValue', function(value){
        if(!value){
          scope.formInputEmail.$setPristine();
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
      scope.emailIsValidAfterCharacterArroba = function(field){
        var emailChangedView = field.$viewValue;
        if(emailChangedView) {
          if(emailChangedView.indexOf('@') == emailChangedView.length-1){            
            return false;
          }
          if(emailChangedView.indexOf('.') == emailChangedView.length-1){            
            return false;
          }
        }
        return true;
      }
    }
  }
}())