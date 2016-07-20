'use strict';

describe('Controller Tests', function() {

    describe('Feriado Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockFeriado, MockDia;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockFeriado = jasmine.createSpy('MockFeriado');
            MockDia = jasmine.createSpy('MockDia');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Feriado': MockFeriado,
                'Dia': MockDia
            };
            createController = function() {
                $injector.get('$controller')("FeriadoDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'pontoApp:feriadoUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
