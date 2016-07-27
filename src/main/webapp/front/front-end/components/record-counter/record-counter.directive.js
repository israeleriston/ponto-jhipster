(function(){
 'use strict';
  angular
    .module('RecordCounterDirective',[])
    .directive('recordCounter', recordCounter);

  recordCounter.$inject = ['TemplateUrlPathFactory'];

  function recordCounter(TemplateUrlPathFactory){
    var directive = {
      restrict : 'E',
      scope : {
        list : '=',
      },
      templateUrl : TemplateUrlPathFactory.getPahtUrlComponents() + '/record-counter/record-counter.directive.html',
      link : link,
    }
    return directive;

    function link(scope, element, attrs){
      scope.getRecordCounterMessage = getRecordCounterMessage;

      function getRecordCounterMessage(){
        var message = scope.list.data.length + ' de ' + scope.list.recordCount + ' registros.'
        return message;
      }
    }
  }
}());