(function(){
 'use strict';
  angular
    .module('ActionButtonDirective',[])
    .directive('actionButton', actionButton);

  actionButton.$inject = ['TemplateUrlPathFactory'];

  function actionButton(TemplateUrlPathFactory){
    var directive = {
      restrict : 'E',
      scope : {
        actionType : '@',
        typeButton : '@',
        actionVerifyName : '@',
        label : '@',
        isDisabled : '=',
      },
      templateUrl : TemplateUrlPathFactory.getPahtUrlComponents() + '/action-button/action-button.directive.html',
      link : link,
    }
    return directive;

    function link(scope, element, attrs){
      scope.classes = ['btn-sm'];
      switch(scope.actionType){
        case 'edit':
          setClasses(['btn-warning'], 'glyphicon-pencil');
        break;
        case 'remove':
          setClasses(['btn-danger'], 'glyphicon-trash');
        break;
        case 'inactivate':
          setClasses(['btn-danger'], 'glyphicon-ok-circle');
        break;
        case 'activate':
          setClasses(['btn-default'], 'glyphicon-remove-circle');
        break;
        case 'create':
          setClasses(['btn-success','form-control'], 'glyphicon-floppy-disk');
        break;
        case 'list':
          setClasses(['btn-link','form-control'], 'glyphicon-backward');
        break;
        case 'closingForce':
          setClasses(['btn-warning','form-control']);
        break;
        case 'next':
          setClasses(['btn-success'], 'glyphicon-chevron-right');
        break;
        case 'finish':
          setClasses(['btn-primary'], 'glyphicon-ok-sign');
        break;

      }

      function setClasses(classList, icon){
        scope.classes.push.apply(scope.classes,classList)
        scope.icon = icon;
      }
    }
  }
}());