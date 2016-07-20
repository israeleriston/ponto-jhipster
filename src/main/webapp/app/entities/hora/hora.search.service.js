(function() {
    'use strict';

    angular
        .module('pontoApp')
        .factory('HoraSearch', HoraSearch);

    HoraSearch.$inject = ['$resource'];

    function HoraSearch($resource) {
        var resourceUrl =  'api/_search/horas/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
