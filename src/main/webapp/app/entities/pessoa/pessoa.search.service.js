(function() {
    'use strict';

    angular
        .module('pontoApp')
        .factory('PessoaSearch', PessoaSearch);

    PessoaSearch.$inject = ['$resource'];

    function PessoaSearch($resource) {
        var resourceUrl =  'api/_search/pessoas/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
