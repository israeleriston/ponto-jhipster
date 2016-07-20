'use strict';

describe('Controller Tests', function() {

    describe('Dia Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockDia, MockPessoa;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockDia = jasmine.createSpy('MockDia');
            MockPessoa = jasmine.createSpy('MockPessoa');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Dia': MockDia,
                'Pessoa': MockPessoa
            };
            createController = function() {
                $injector.get('$controller')("DiaDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'pontoApp:diaUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
