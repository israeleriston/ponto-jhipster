(function() {
    'use strict';

    angular
        .module('pontoApp')
        .factory('DiaSearch', DiaSearch);

    DiaSearch.$inject = ['$resource'];

    function DiaSearch($resource) {
        var resourceUrl =  'api/_search/dias/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
