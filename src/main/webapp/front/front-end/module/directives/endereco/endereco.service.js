(function(){
  'use strict';
  angular
    .module('EnderecoServices',[])
    .factory('EnderecoService', EnderecoService);

    EnderecoService.$inject = ['TemplateService', '$http']
    function EnderecoService(TemplateService, $http) {
      var service = new TemplateService('/enderecos');
      service.getTiposLogradouro = getTiposLogradouro;
      service.getTiposEndereco = getTiposEndereco;
      service.build = build;
      service.buscaCep = buscaCep;
      return service;

      function getTiposLogradouro(){
        var url = service.getBaseUrl() + '/tipoLogradouro'
          ,  method = 'GET'
        return $http({
          url : url,
          method : method
        }).then(function(response){
          return response.data;
        });
      }

      function getTiposEndereco(){
        var url = service.getBaseUrl() + '/tipoEndereco'
          ,  method = 'GET'
        return $http({
          url : url,
          method : method
        }).then(function(response){
          return response.data;
        });
      }

      function build(enderecos){
        var list = [];
        angular.forEach(enderecos, function(endereco){
          var end = {
            tipoendereco : endereco.tipoendereco,
            tipologradouro : endereco.tipologradouro,
            logradouro : endereco.logradouro,
            numero : endereco.numero,
            bairro : endereco.bairro,
            cep : endereco.cep,
            cidadeid : endereco.cidadeid,
            complemento : endereco.complemento,
            cidade : {
              id : endereco.cidadeid,
              nome : endereco.cidadenome,
            },
            uf : {
              id : endereco.unidadefederativaid,
              nome : endereco.unidadefederativanome,
              sigla : endereco.unidadefederativasigla,
            } 
          }

          list.push(end);
        });

        return list;
      }
      
      function buscaCep(cep){
        /*return $http({
          url : '/busca-cep',
          method : 'POST',
          params : {
            cep : cep
          }        
        })
        .then(function(response){
          return response.data;
        });*/
        return null;
      }
    }
}());