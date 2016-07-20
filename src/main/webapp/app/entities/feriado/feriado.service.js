(function() {
    'use strict';
    angular
        .module('pontoApp')
        .factory('Feriado', Feriado);

    Feriado.$inject = ['$resource'];

    function Feriado ($resource) {
        var resourceUrl =  'api/feriados/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
