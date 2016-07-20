'use strict';

describe('Controller Tests', function() {

    describe('Pessoa Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockPessoa;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockPessoa = jasmine.createSpy('MockPessoa');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Pessoa': MockPessoa
            };
            createController = function() {
                $injector.get('$controller')("PessoaDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'pontoApp:pessoaUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
