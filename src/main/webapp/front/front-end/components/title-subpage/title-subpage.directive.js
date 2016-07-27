(function(){
 'use strict';
  angular
    .module('TitleSubpageDirective',[])
    .directive('titleSubpage', titleSubpage);

  titleSubpage.$inject = ['TemplateUrlPathFactory'];

  function titleSubpage(TemplateUrlPathFactory){
    var directive = {
      restrict : 'E',
      scope : {
        description : '@',
        icon : '@',
      },
      templateUrl : TemplateUrlPathFactory.getPahtUrlComponents() + '/title-subpage/title-subpage.directive.html',
      link : link,
    }
    return directive;

    function link(scope, element, attrs){
      scope.getDescription = getDescription;

      function getDescription(){
        var description = scope.description;
        return description;
      }
    }
  }
}());