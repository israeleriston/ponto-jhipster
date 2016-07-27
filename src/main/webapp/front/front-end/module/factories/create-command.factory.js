(function(){
  'use strict';
  angular
    .module('CreateCommand',[])
    .factory('CommandFactory',CommandFactory);

    function CommandFactory(){
      var obj = {
        createEditCommand : createEditCommand,
        createRemoveCommand : createRemoveCommand
      }

      return obj;

      function createEditCommand(data){
        var newData = {};
        angular.forEach(data, function(value, key){
          
          if (key === 'id') {
            newData.entityId = value;
          }          
          if (key !== 'id' && key !== 'version'){            
            newData[key] = value;              
          }
          if(key === 'version'){
            newData.entityVersion = value;
          }
        });          
        return newData;
      }

      function createRemoveCommand(data){
        var newData = {
          entityId : {
            value : data.id
          },
          entityVersion : data.version
        }
        return newData;
      }
    }
}());   