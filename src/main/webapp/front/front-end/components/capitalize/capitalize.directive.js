(function(){
'use strict';
angular
  .module('CapitalizeDirective',[])
  .directive('capitalize', capitalize);

  function capitalize(){
    var directive = {
      require: 'ngModel',
      link: link
    }
    return directive;

    function link(scope, element, attrs, modelCtrl) {
      var capitalize = function(inputValue) {
        if(inputValue == undefined) {
          inputValue = '';
        }
        var capitalized = inputValue;
        if(attrs.capitalize === 'true'){
          capitalized = angular.uppercase(inputValue);
        }
        
        if(inputValue != ''){
          modelCtrl.$setViewValue(capitalized);
        }
        modelCtrl.$render();
        return capitalized;
      }
      modelCtrl.$parsers.push(capitalize);
      capitalize(scope[attrs.ngModel]);
    }
  }
}());