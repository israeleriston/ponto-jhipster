(function(){
  'use strict';
  angular
    .module('TelefoneServices',[])
    .factory('TelefoneService', TelefoneService);

  TelefoneService.$inject = ['TemplateService','$http'];

  function TelefoneService(TemplateService, $http){
    var service = new TemplateService('/telefones');
    service.getTiposDeTelefones = getTiposDeTelefones;
    return service;

    function getTiposDeTelefones(){
      var url = service.getBaseUrl() + '/tiposDeTelefone'
        , method = 'GET'
      return $http({
        url : url,
        method : method,
      }).then(function(response){
        return response.data;
      });
    }
  }
}());