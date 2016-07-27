(function() {
  'use strict';
  angular
    .module('UploadServices', [])
    .factory('UploadService', UploadService);

  UploadService.$inject = [ '$http', 'TemplateService' ];

    function UploadService($http, TemplateService) {
      var service = new TemplateService('/upload');

      service.save = save;
      service.upload = upload;
      service.removeImagem = removeImagem;

      return service;

      function save(command){
        var method = 'PUT'
        , url = '/imagem';
        return $http({
          url : service.getBaseUrl() + url,
          method : method,
          data : command
        }).then(uploadSuccess)
      };

      function uploadSuccess(response){
        return response;
      };

      function upload(command) {
        return $http({
            method: 'PUT',
            url: service.getBaseUrl() + '/imagem',
            data : command
        }).then(uploadSuccess)
      };

      function removeImagem(command) {
        return $http({
            method: 'PUT',
            url: service.getBaseUrl() + '/imagem/remove',
            data : command
        }).then(uploadSuccess)
      };
  }
}());