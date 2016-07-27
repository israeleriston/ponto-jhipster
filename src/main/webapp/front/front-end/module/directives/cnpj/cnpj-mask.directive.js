(function() {
  'use strict';
  angular
    .module('CnpjMaskDirective',[])
    .directive('maskCnpj', maskCnpj)

  function maskCnpj() {
    return {
      require : 'ngModel',
      link : function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function(inputValue) {
          if (inputValue == undefined) {return '';}
          var cnpjView = inputValue.replace(/[^0-9]/g, '');
          var cnpjModel = cnpjView;
          if (cnpjView.length == 14) {
            cnpjView = format(cnpjView);
            modelCtrl.$setViewValue(cnpjView);
            modelCtrl.$render();
            return cnpjModel;
          }
          if (cnpjView.length > 14) {
            modelCtrl.$setViewValue(cnpjView.substring(0, cnpjView.length - 1));
            modelCtrl.$render();
            return cnpjModel.substring(0, cnpjModel.length - 1);
          }
          modelCtrl.$setViewValue(cnpjView);
          modelCtrl.$render();
        });

        element.bind('blur', function() {
          if (element.val().replace(/[^0-9]/g, '').length == 14) {
            element.val(format(element.val().replace(/[^0-9]/g, '')));
            return;
          }
        });

        element.bind('focus', function() {
          element.val(element.val().replace(/[^0-9]/g, ''));
        });

        function format(cnpjString) {
          return cnpjString.substring(0, 2) + "."
              + cnpjString.substring(2, 5) + "."
              + cnpjString.substring(5, 8) + "/"
              + cnpjString.substring(8, 12) + "."
              + cnpjString.substring(12, 14);
        }
      }
    }
  }
}())