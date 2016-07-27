(function(){
'use strict';
  angular
    .module('UrlServices',[])
    .service('UrlService', UrlService);

  UrlService.$inject = ['$state']

  function UrlService($state){
    this.reload = reload;
    this.go = go;
    this.getCurrent = getCurrent;
    this.openWindow = openWindow;
    this.getStateParams = getStateParams;

    function reload(){
      $state.reload();
    }

    function go(state, params){
      if(!params)
        params = {};
      $state.go(state,params);
    }

    function getCurrent(){
      return $state.current;
    }
    
    function openWindow(state,params){
      return window.open($state.href(state, params));
    }
    
    function getStateParams(){
      return $state.params;
    }
  }
}());