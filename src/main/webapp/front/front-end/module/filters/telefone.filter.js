(function(){
  'use strict';
  angular
    .module('TelefoneFilter',[])
    .filter('mascararTelefoneNaLista', mascararTelefoneNaLista)
    ;

    function mascararTelefoneNaLista(){
      return function(telefone){
        if(!telefone){
          return telefone;
        }else{
          var sizeNumero = telefone.numero.length;
          var tel = '';
          tel = '('+telefone.ddd+')';
          if(sizeNumero === 7){
            tel = tel + ' ' + String(telefone.numero).substring(0, 3);
            tel = tel + '-' + String(telefone.numero).substring(3, String(telefone.numero).length);
          }
          if(sizeNumero === 8){
            tel = tel + ' ' + String(telefone.numero).substring(0, 4);
            tel = tel + '-' + String(telefone.numero).substring(4, String(telefone.numero).length); 
          }
          if(sizeNumero === 9){
            tel = tel + ' ' + String(telefone.numero).substring(0, 5);
            tel = tel + '-' + String(telefone.numero).substring(5, String(telefone.numero).length);
          }                              
          return tel;
        }
      }
    }
}());