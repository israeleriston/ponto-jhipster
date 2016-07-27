(function() {
  'use strict';
  angular
    .module('addingMaskTelefone',[])
    .directive('maskTelefone', maskTelefone)

  function maskTelefone() {
    return {
      require : 'ngModel',
      link : function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function(inputValue) {
          if (inputValue == undefined) { return ''; }
          var phoneView = inputValue.replace(/[^0-9]/g, '');
          var phoneModel = phoneView;
          if (phoneView.length == 8) {
            phoneView = format8Digits(phoneView);
            modelCtrl.$setViewValue(phoneView);
            modelCtrl.$render();
            return phoneModel;
          }
          if (phoneView.length == 9) {
            phoneView = format9Digits(phoneView);
            modelCtrl.$setViewValue(phoneView);
            modelCtrl.$render();
            return phoneModel;
          }
          if (phoneView.length > 9) {
            modelCtrl.$setViewValue(phoneView.substring(0, phoneView.length - 1));
            modelCtrl.$render();
            return phoneModel.substring(0, phoneModel.length - 1);
          }
          modelCtrl.$setViewValue(phoneView);
          modelCtrl.$render();
        });

        element.bind('blur', function() {
          var length = element.val().replace(/[^0-9]/g, '').length;
          if (length < 8) {
            element.val(element.val().replace(/[^0-9]/g, ''));
            return;
          }
          if (length == 8) {
            element.val(format8Digits(element.val().replace(/[^0-9]/g, '')));
            return;
          }
          if (length == 9) {
            element.val(format9Digits(element.val().replace(/[^0-9]/g, '')));
            return;
          }
        });

        element.bind('focus', function() {
          element.val(element.val().replace(/[^0-9]/g, ''));
        });

        function format8Digits(phoneString) {
          return phoneString.substring(0, 4) + "-" + phoneString.substring(4, 8);
        }

        function format9Digits(phoneString) {
          return phoneString.substring(0, 5) + "-" + phoneString.substring(5, 9);
        }
      }
    }
  }
}())