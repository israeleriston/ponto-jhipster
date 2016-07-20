(function() {
    'use strict';
    angular
        .module('pontoApp')
        .factory('Telefone', Telefone);

    Telefone.$inject = ['$resource'];

    function Telefone ($resource) {
        var resourceUrl =  'api/telefones/:id';

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
