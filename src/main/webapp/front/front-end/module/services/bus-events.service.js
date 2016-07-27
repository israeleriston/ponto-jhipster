(function(){
  'use strict'
  angular
    .module('BusEventsServices',[])
    .service('BusEventsService',BusEventsService);

    BusEventsService.$inject = ['$rootScope'];

    function BusEventsService($rootScope){
      var service = {
        broadcast : broadcast,
        on : on,
        destroy : destroy,
        apply : apply,
        notify : notify,
      }

      return service;

      function broadcast(nameEvent, data){
        $rootScope.$broadcast(nameEvent, data);
      }

      function on(listenerEvent, callback, removeListener){
        if(removeListener)
          destroy(listenerEvent)
        return $rootScope.$on(listenerEvent, callback);
      }

      function destroy(event){
        $rootScope.$$listeners[event] = []
      }

      function notify(event, args){
        $rootScope.$emit(event, args);
      }

      function apply(callback){
        $rootScope.$apply(callback);
      }

    }

}())