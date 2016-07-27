(function(){
  'use strict';
  angular
    .module('CpfFilter',[])
    .filter('mascararCpfNaLista', mascararCpfNaLista)
    ;

    function mascararCpfNaLista() {
      return function(value){
        if(!value)
          return value;
        var cpf;
        cpf = value.substring(0, 3) + ".";
        cpf = cpf + value.substring(3, 6) + ".";
        cpf = cpf + value.substring(6, 9) + "-";
        cpf = cpf + value.substring(9, value.length);
        return cpf;
      }
    }
}());