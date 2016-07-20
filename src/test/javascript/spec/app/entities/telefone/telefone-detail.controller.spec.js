'use strict';

describe('Controller Tests', function() {

    describe('Telefone Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockTelefone, MockPessoa;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockTelefone = jasmine.createSpy('MockTelefone');
            MockPessoa = jasmine.createSpy('MockPessoa');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Telefone': MockTelefone,
                'Pessoa': MockPessoa
            };
            createController = function() {
                $injector.get('$controller')("TelefoneDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'pontoApp:telefoneUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
