(function(){
  'use strict';
  angular
    .module('CnpjFilter',[])
    .filter('mascararCnpjNaLista', mascararCnpjNaLista)
    ;

    function mascararCnpjNaLista() {
      return function(cnpjString){
        if(!cnpjString)
            return cnpjString;
        var cnpj;
        cnpj = cnpjString.substring(0, 2) + ".";
        cnpj = cnpj + cnpjString.substring(2, 5) + ".";
        cnpj = cnpj + cnpjString.substring(5, 8) + "/";
        cnpj = cnpj + cnpjString.substring(8, 12) + ".";
        cnpj = cnpj + cnpjString.substring(12, 14);
        return cnpj;
      }
    }
}());