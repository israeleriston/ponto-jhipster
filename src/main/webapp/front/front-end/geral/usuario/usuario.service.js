(function(){
  'use strict';
  angular
    .module('UsuarioServices',[])
    .factory('UsuarioService',UsuarioService);


  UsuarioService.$inject = ['TemplateService','$http', 'localservice'];

  function UsuarioService(TemplateService,$http, localservice){
    var service = new TemplateService('/usuarios');
    service.findAll = findAll;
    service.findByParams = findByParams;
    service.usuarioHasItemDeAcesso = usuarioHasItemDeAcesso;
    service.findEmpresasDoUsuario = findEmpresasDoUsuario;
    service.getUsuarioByLogin = getUsuarioByLogin;

    return service;

    function findAll(numberPage){      
      var url = '/query/usuarioFindAll/'+numberPage
        , method = 'POST'
        , data = {
          login : localservice.getUsername()
        };
      return $http({
        url : url,
        method : method,
        data : data
      })
      .then(findAllPromise);

      function findAllPromise(response){
        return response.data;
      }
    }

    function findByParams(param, pageNumber){      
      var url = '/query/usuarioFindByFieldsContaining/' + pageNumber
        , method = 'POST'
        , data = {
          parameter : param,
          login : localservice.getUsername()
        }
      return $http({
        url : url,
        method : method,
        data : data
      })
      .then(successFindByParams);

      function successFindByParams(response){
        return response;
      }
    }

    function usuarioHasItemDeAcesso(username, featureItemDeAcesso){     
      var url = '/query/usuarioHasItemDeAcesso/1'
        , method = 'POST'
        , data = {
          username : username,
          featureItemDeAcesso : featureItemDeAcesso
        }
      return $http({
        url : url,
        method : method,
        data : data
      })
      .then(usuarioHasItemDeAcessoSuccess);

      function usuarioHasItemDeAcessoSuccess(response){
        return response.data.data;
      }
    }
    
     function findEmpresasDoUsuario(usuarioId){      
      var url = '/query/usuarioFindEmpresas/1'
        , method = 'POST'
        , data = { usuarioId : usuarioId}
        , params = { pageSize : 0 };
      return $http({
        url : url,
        method : method,
        data : data,
        params : params
      })
      .then(function(response){
        return response.data.data;
      });      
    }
    
    function getUsuarioByLogin(numberPage){
      var url = '/query/getUsuarioByLogin/'+numberPage
        , method = 'POST'
        , data = {
          login : localservice.getUsername()
        };
      return $http({
        url : url,
        method : method,
        data : data
      })
      .then(findAllPromise);

      function findAllPromise(response){
        var usuario = {};
        usuario.id = response.data.data[0].id;
        usuario.nome = response.data.data[0].nome;
        usuario.sobrenome = response.data.data[0].sobrenome;
        usuario.login = response.data.data[0].login;
        usuario.email = response.data.data[0].email;
        usuario.version = response.data.data[0].version
        return usuario;
      }  
    }
  }
}());