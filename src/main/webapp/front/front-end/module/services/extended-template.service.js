(function(){
  'use strict';
  angular
    .module('ExtendedTemplateService', [])
    .service('ExtendedService', ExtendedService);

  ExtendedService.$inject = ['TemplateService', '$http'];

  function ExtendedService(TemplateService, $http) {

    this.createService = createService;

    function createService(baseUrl, identifier) {

      var service = new TemplateService(baseUrl);

      service.findById = findById;
      service.findAll = findAll;
      service.findByParam = findByParam;
      service.findByParameter = findByParameter;
      service.TypeaheadList = TypeaheadList;

      return service;

      function findById(entityId) {
        var request ={
          url: '/query/' + identifier + '/FindById/1',
          method: 'POST',
          data: {
            entityId: entityId
          } 
        };

        return $http(request).then(findByIdSuccess);
      }

      function findByIdSuccess(response) {
        return response.data;
      }

      function findAll(pageNumber) {
        var request = {
          url: '/query/' + identifier + '/FindAll/' + pageNumber,
          method: 'POST',
          data: {}
        };

        return $http(request).then(findAllSuccess);
      }

      function findAllSuccess(response) {
        return response;
      }

      function findByParam(parameter, pageNumber) {
        var request = {
          url: '/query/' + identifier + '/FindByParam/' + pageNumber,
          method: 'POST',
          data: {
            parameter: parameter
          }
        };

        return $http(request).then(findByParamSuccess);
      }

      function findByParamSuccess(response) {
        return response.data;
      }

      function findByParameter(parameter, pageNumber) {
        var request = {
          url: '/query/' + identifier + '/FindByParameter/' + pageNumber,
          method: 'POST',
          data: {
            parameter: parameter
          }
        };

        return $http(request).then(findByParameterSuccess);
      }

      function findByParameterSuccess(response) {
        return response;
      }

      function TypeaheadList() {
        var typeaheadList = {};

        typeaheadList[identifier + 'TypeaheadList'] = findByParameter;

        return typeaheadList;

        function findByParameter(parameter) {
          return service
            .findByParameter(parameter, 1)
            .then(function (response) {
              return response.data.data;
            })
        }
      }
    }
  }

}());
