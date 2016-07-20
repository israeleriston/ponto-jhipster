(function() {
    'use strict';

    angular
        .module('pontoApp')
        .factory('FeriadoSearch', FeriadoSearch);

    FeriadoSearch.$inject = ['$resource'];

    function FeriadoSearch($resource) {
        var resourceUrl =  'api/_search/feriados/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
