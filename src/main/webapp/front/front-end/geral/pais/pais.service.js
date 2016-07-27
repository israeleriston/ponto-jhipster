(function(){
  'use strict';
  angular
    .module('PaisServices',[])
    .factory('PaisService',PaisService);
    ;

    PaisService.$inject = ['$http','TemplateService'];
    function PaisService($http, TemplateService){
      var service = new TemplateService('/paises');

      service.getPaises = getPaises;
      service.paisFindAll = paisFindAll;
      service.paisFindParameters = paisFindParameters;

      return service;
      function getPaises(data){
        var method = 'POST';
        return $http({
	        url : '/query/paisFindByNameContaining/1',
	        method : method,
	        data : {
	          nome : data
	        }
        }).then(getPaisesSuccess);

        function getPaisesSuccess(response){
          return response.data;
        }
      }

      function paisFindAll(pageNumber) {
			var method = 'POST';
			var url = '/query/paisFindAll/'
					+ pageNumber;
			return $http({
				url : url,
				method : method,
				data : {}
			}).then(paisFindAllSuccess)
		};

		function paisFindAllSuccess(response) {
			return response;
		};

		function paisFindParameters(parameter, pageNumber) {
			var method = 'POST';
			var url = '/query/paisFindByFieldsContaining/'
					+ pageNumber;
			return $http({
				url : url,
				method : method,
				data : {
					parameter : parameter
				}
			}).then(paisFindParametersSuccess)
		};

		function paisFindParametersSuccess(response) {
			return response;
		};
    }
}());
