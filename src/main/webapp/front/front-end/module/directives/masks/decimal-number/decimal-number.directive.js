(function(){
'use strict';
angular
  .module('DecimalNumberDirective',[])
  .directive('decimalNumber', decimalNumber);

  function decimalNumber() {
    return {
      require : 'ngModel',
      link : function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function(inputValue) {          
          if (inputValue == undefined) {
            return '';
          }  

          var transformedInput = inputValue.replace(/[^0-9.,]/g, '');

          if(inputValue.indexOf('.') == 0){
            transformedInput = '0'+transformedInput;
          }
          
          transformedInput = transformedInput.replace(',', '.');
          var firstIndexDecimalLimitator = transformedInput.indexOf('.');

          var otherIndexDecimalLimitator = transformedInput.lastIndexOf('.');

          if(firstIndexDecimalLimitator != otherIndexDecimalLimitator){
            transformedInput = transformedInput.substr(0, otherIndexDecimalLimitator) + 
            transformedInput.substr(otherIndexDecimalLimitator+1, transformedInput.length);
            firstIndexDecimalLimitator = transformedInput.indexOf('.');
          }

          if(firstIndexDecimalLimitator != -1){
            var qntDecimalPlaces = attrs.qntDecimalPlaces ? parseInt(attrs.qntDecimalPlaces) : 2;
            
            if(transformedInput.length-1 > firstIndexDecimalLimitator + qntDecimalPlaces){
              var actualQntDecimalPlaces = transformedInput.substr(firstIndexDecimalLimitator).length;              
              transformedInput = transformedInput.substr(0, (firstIndexDecimalLimitator + qntDecimalPlaces)+1);
            }            
          }

          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }
          return transformedInput;
        });
      }
    }
  }
}());