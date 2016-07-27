(function(){
  'use strict';
  angular
    .module('InputFocusDirective',[])
    .directive('inputFocus', inputFocus);

    function inputFocus(){
      var directive = {
        link : link,
        scope : {
          inputFocus : '='
        }
      }

      return directive;

      function link(scope, element){
        scope.$watch('inputFocus', selectedInputFocus);

        function selectedInputFocus(value){
          if(value){
            element[0].focus();
          }
        }
      }
    }
}());