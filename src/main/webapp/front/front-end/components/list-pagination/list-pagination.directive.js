(function(){
 'use strict';
  angular
    .module('ListPaginationDirective',[])
    .directive('listPagination', listPagination);

  listPagination.$inject = ['TemplateUrlPathFactory'];

  function listPagination(TemplateUrlPathFactory){
    var directive = {
      restrict : 'E',
      scope : {
        list : '=',
        func : '&',
        itemPerPage : '@',
      },
      templateUrl : TemplateUrlPathFactory.getPahtUrlComponents() + '/list-pagination/list-pagination.directive.html',
      link : link,
    }
    return directive;

    function link(scope, element, attrs){
      scope.executeFunction = scope.func();

      scope.$watch('list.number', function(value){
        if(value !== scope.pageNumber){
          scope.pageNumber = value;
        }
      });

      if(angular.isUndefined(scope.itemPerPage)){
        scope.itemPerPage = 10;
      }
    }
  }
}())