(function(){
'use strict';
  angular
    .module('DataFormatServices',[])
    .service('DataFormtService',DataFormtService);

    function DataFormtService(){
      this.convertData = convertData;

      return;

      function convertData(data){
        var d = new Date(data.substring(0,4),data.substring(5,7)-1,
          data.substring(8, String(data).length)),
        months = ['01','02','03','04','05','06','07','08','09','10','11','12']
        return formatDay(d.getDate())+'/'+months[d.getMonth()]+'/'+d.getFullYear();
      };
      
      function formatDay(data){
        if(data[0] !== 0 && String(data).length < 2){
          data = '0' + data;
          return data;
        }else{
          return data;
        }
      };
    }
}());