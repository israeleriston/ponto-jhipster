(function(){
  'use strict';
  angular
    .module('core.factories',[
      'CreateCommand',
      'Interceptors',
      'MenuBuilder',
      'MenuServices',
      'TemplateUrlPath',
      'MessageFactory',
      'WindowManager'
    ])
}());