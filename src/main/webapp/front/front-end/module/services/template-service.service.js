(function(){
'use strict';
  angular
    .module('TemplateServices',[])
    .factory('TemplateService',TemplateService);

  TemplateService.$inject = ['$http', 'CommandFactory','localservice'];

  function TemplateService($http, CommandFactory, localservice){

    var TemplateService = function(url){
        this.baseUrl =  url;
      }
      , method = 'GET';

      TemplateService.prototype.create = create;
      TemplateService.prototype.edit =  edit;
      TemplateService.prototype.get =  get;
      TemplateService.prototype.remove =  remove;
      TemplateService.prototype.find =  find;
      TemplateService.prototype.inativar =  inativar;
      TemplateService.prototype.ativar =  ativar;
      TemplateService.prototype.getBaseUrl =  getBaseUrl;
      TemplateService.prototype.getStatusDoRegistro = getStatusDoRegistro;
      TemplateService.prototype.http =  http;
    return TemplateService;


    function create(data){
      var method = 'POST';
      return $http({
        url : this.getBaseUrl(),
        method : method,
        data : data
      });
    }

    function edit(data){      
      var obj = CommandFactory.createEditCommand(data);      
      var method = 'PUT';
      return $http({
        url : this.getBaseUrl(),
        method : method,
        data : obj
      });
    }

    function get(entityId){      
      return $http({
        url : this.getBaseUrl(),
        method : method,
        params : {
          entityId : entityId
        }
      });
    }
    function remove(data){
      var method = 'DELETE';
      var headers = {
        'Content-Type' : 'application/json'
      };

      return $http({
        url : this.getBaseUrl(),
        method : method,
        headers : headers,
        data : CommandFactory.createRemoveCommand(data)
      });
    }

    function find(){
      return $http({
        url : this.getBaseUrl(),
        method : method
      });
    }

    function inativar(obj){
      var url = this.getBaseUrl() + '/inativar'
        , data = obj
        , method = 'PUT';

      data.entityId = obj.id;
      data.entityVersion = obj.version;      

      return $http({
        url : url,
        data : data,
        method : method
      })
      .then(inativarPromise);

      function inativarPromise(response){
        return response;
      }

    }

    function ativar(obj){
      var url = this.getBaseUrl() + '/ativar'
        , data = obj
        , method = 'PUT';
      
      data.entityId = obj.id;
      data.entityVersion = obj.version;

      return $http({
        url : url,
        data : data,
        method : method
      })
      .then(ativarPromise)

      function ativarPromise(response){
        return response;
      }
    }

    function getBaseUrl(){
      return this.baseUrl;
    }

    function getStatusDoRegistro(){
      var list = [
        {name : 'Ativo' , value : 'ATIVO'},
        {name : 'Inativo' , value : 'INATIVO'}
      ]
    }
    
    function http(method, url, data, params, callbackSuccess, callbackError){
      return $http({
        method : method,
        url : url,
        data : data,
        params : params
      }).then(callbackSuccess, callbackError);
    }
  }
}());