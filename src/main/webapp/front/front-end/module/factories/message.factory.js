(function(){
'use strict';
angular
  .module('MessageFactory',[])
  .factory('message', message);

  function message(){
    var factory = {
      success : success,
      warning : warning,
      error : error,
      info : info,
    };

    return factory;

    function defaultOptions(){
      return {
        'closeButton' : true,
        'debug' : false,
        'newestOnTop' : false,
        'progressBar' : false,
        'positionClass' : 'toast-top-center',
        'preventDuplicates': false,
        'onclick' : null,
        'showDuration' : '300',
        'hideDuration' : '1000',
        'timeOut' : '4000',
        'extendedTimeOut' : '1000',
        'showEasing' : 'swing',
        'hideEasing' : 'linear',
        'showMethod' : 'show',
        'hideMethod' : 'slideUp'
      };
    }

    function success(msg, options){
      toastr.options = angular.isDefined(options) ? options : defaultOptions();
      toastr.success(msg);
    }
    function warning(msg, options){
      toastr.options = angular.isDefined(options) ? options : defaultOptions();
      toastr.warning(msg);
    }
    function error(msg, options){
      toastr.options = angular.isDefined(options) ? options : defaultOptions();
      toastr.error(msg);
    }
    function info(msg, options){
      toastr.options = angular.isDefined(options) ? options : defaultOptions();
      toastr.info(msg);
    }
  }
}());