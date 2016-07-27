(function() {
  'use strict';
  angular
    .module('addingMaskCep',[])
    .directive('maskCep', maskCep)

  function maskCep() {
    return {
      require : 'ngModel',
      link : function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function(inputValue) {
          if (inputValue == undefined) {return '';}
          var cepView = inputValue.replace(/[^0-9]/g, '');
          var cepModel = cepView;
          if (cepView.length == 8) {
            cepView = format(cepView);
            modelCtrl.$setViewValue(cepView);
            modelCtrl.$render();
            return cepModel;
          }
          if (cepView.length > 8) {
            modelCtrl.$setViewValue(cepView.substring(0, cepView.length - 1));
            modelCtrl.$render();
            return cepModel.substring(0, cepModel.length - 1);
          }
          modelCtrl.$setViewValue(cepView);
          modelCtrl.$render();
        });

        element.bind('blur', function() {
          var length = element.val().replace(/[^0-9]/g, '').length;
          if (length == 8) {
            element.val(format(element.val().replace(/[^0-9]/g, '')));
            return;
          }
        });

        element.bind('focus', function() {
          element.val(element.val().replace(/[^0-9]/g, ''));
        });

        function format(cepString) {
          return cepString.substring(0, 2) + "." + cepString.substring(2, 5) + "-" + cepString.substring(5, 8);
        }
      }
    }
  }
}())