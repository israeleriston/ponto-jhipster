(function(){
  'use strict';
  angular
    .module('WindowManager',[])
    .factory('WindowManagerService', WindowManagerService);

  function WindowManagerService(){
    var service = {};
    service.push = push;
    service.pop = pop;
    service.getOpenMode = getOpenMode;
    service.setOpenMode = setOpenMode;
    service.windows = [];
    
    return service;

    function push(modalInstance) {
      service.windows.push(modalInstance);
    }
    
    function pop() {
      var modalInstance = service.windows.pop();
      modalInstance.close();
    }
    
    function getOpenMode() {
      return service.openMode || 'new-tab';
    }
    
    function setOpenMode(openMode) {
      service.openMode = openMode;
    }
  }
}());