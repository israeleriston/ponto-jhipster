(function(){
 'use strict';
  angular
    .module('InputSearchDirective',[])
    .directive('inputSearch', inputSearch);

  inputSearch.$inject = ['TemplateUrlPathFactory'];

  function inputSearch(TemplateUrlPathFactory){
    var directive = {
      restrict : 'E',
      scope : {
        func : '&',
        searchField : '=',
        isUpperCase : '=',
        isDisabled : '='
      },
      templateUrl : TemplateUrlPathFactory.getPahtUrlComponents() + '/input-search/input-search.directive.html',
      link : link,
    }
    return directive;

    function link(scope, element, attrs){
      scope.getPageNumber = getPageNumber;
      scope.executeFunction = scope.func();

      function getPageNumber(){
        var pageNumber = 1;
        return pageNumber;
      }
    }

  }
}());