(function() {
'use strict';

  angular
    .module('ParametroServices',[])
    .factory('ParametroService', ParametroService);

  ParametroService.$inject = ['TemplateService','$http','EmpresaService'];
  function ParametroService(TemplateService,$http, EmpresaService) {
    var service = new TemplateService('/parametros')
      , tiposValores = [];
    service.getParametros = getParametros;
    service.getValores = getValores;
    service.parametroFindByParameter = parametroFindByParameter;
    service.getEmpresaFindByUsuario = getEmpresaFindByUsuario;
    service.Parametro = Parametro;
    service.ParametroEdit = ParametroEdit;
    service.encerrarVigencia = encerrarVigencia;
    service.getParametroFindById = getParametroFindById;
    service.getTipoValor = getTipoValor;
    
    return service;
    
    function getParametros(){
      return service.get().then(function(response){
        return response.data;
      });
    }
    
    function getValores(){
      var url = service.getBaseUrl() + '/valor'
        , method = 'GET'
      return $http({
        method : method,
        url : url
      }).then(function(response){
        return buildTipoValue(response.data);
      });
    }
    
    function buildTipoValue(values){
      tiposValores = []
      angular.forEach(values,function(item){
        angular.forEach(item,function(value, key){
          tiposValores.push({
              key : key,
              value : value
            });
        });
      });
      return tiposValores;
    }
    
    function getTipoValor(key){
      var tipoValor = {};
      angular.forEach(tiposValores,function(item){
        if(key === item.key){
          tipoValor = item;
          return tipoValor;
        }
      })
      return tipoValor;
    }
    
    function parametroFindByParameter(parameter, pageNumber){
			var method = 'POST'
			  , url = '/query/parametroFindByParameter/' + pageNumber;
			return $http({
				url : url,
				method : method,
				data : {
					parameter : parameter
				}
			}).then(function(response){
        return response.data;
      })
    }
    
    function getEmpresaFindByUsuario(parameter){
      return EmpresaService.getEmpresasWithLogin(parameter).then(function(response){
        return response.data.data;
      });
    }
    
    function Parametro(param){
      var parametro = {
        inicioVigencia : param && param.inicioVigencia ? param.inicioVigencia : new Date(),
        empresaId : param && param.empresa && param.empresa.id ? param.empresa.id : '',
        nome : param && param.nome ? param.nome : '',
        valor : param && param.valor ? param.valor : '',
        tipoValor : param && param.tipoValor ? param.tipoValor : ''
      }
      return parametro;
    }
    
    function ParametroEdit(param){
      var parametro = {
        entityId : param.id,
        inicioVigencia : new Date(param.iniciovigencia),
        tipoValor : param.tipovalorparametro,
        valor : param.valor,
        nome : param.parametronome,
        empresa : {
          id : param.empresaid,
          razaosocial : param.empresanome
        },
        empresaId : param.empresaid,
        entityVersion : param.version
      }
      
      return parametro;
    }
    
    function encerrarVigencia(parametro){
      var method = 'PUT'
        , data = {
          entityId : parametro.id,
          entityVersion : parametro.parametroversion,
          empresaId : parametro.empresaid,
        }
        , url = service.getBaseUrl() + '/encerrar'
      return $http({
        method : method,
        url : url,
        data : data
      }).then(function(response){
        return response.data;
      });
    }
    
    function getParametroFindById(parametroId){
      var method = 'POST'
        , url = '/query/parametroFindById/1'
        , data = {
          parametroId : parametroId
        }
        return $http({
          url : url,
          method : method,
          data : data
        }).then(function(response){
          return ParametroEdit(response.data.data[0]);
        });
    }
  }
})();