(function(){
  'use strict';
  angular
    .module('BreadcrumbFilter',[])
    .filter('criaUrlNoBreadcrumb', criaUrlNoBreadcrumb)
    ;

    function criaUrlNoBreadcrumb(){
      return function(url){
        if(url){
          var hashTag = '#';
          return hashTag + url;
        }
        return url;
      }
    }
}())