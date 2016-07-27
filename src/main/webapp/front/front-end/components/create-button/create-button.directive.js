(function(){
 'use strict';
  angular
    .module('CreateButtonDirective',[])
    .directive('createButton', createButton);

  createButton.$inject = ['TemplateUrlPathFactory'];

  function createButton(TemplateUrlPathFactory){
    var directive = {
      restrict : 'E',
      scope : {
        actionVerifyName : '@',
        label : '@',
        func : '&',
      },
      templateUrl : TemplateUrlPathFactory.getPahtUrlComponents() + '/create-button/create-button.directive.html',
      link : link,
    }
    return directive;

    function link(scope, element, attrs){
      scope.executeFunction = scope.func();
      scope.msg = 'Cadastrar um(a) novo(a) ' + scope.label + ' .' ;
    }
  }
}());