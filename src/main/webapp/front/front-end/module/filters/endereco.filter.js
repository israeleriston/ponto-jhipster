(function(){
  'use strict';
  angular
    .module('EnderecoFilter',[])
    .filter('mascararEnderecoNaLista', mascararEnderecoNaLista);

    function mascararEnderecoNaLista(){
      return function(endereco){
        if(endereco.cidade){
          var end;
          end = String(endereco.tipoendereco) + ': '
          end = end + String(endereco.tipologradouro) + ' ';
          end = end + String(endereco.logradouro);
          end = end + (endereco.numero ? ', ' + String(endereco.numero) + ' - ' : ' - ');
          end = end + String(endereco.bairro) + ' - ';
          end = end + String(endereco.cep).substring(0,2) + '.';
          end = end + String(endereco.cep).substring(2,5) + '-';
          end = end + String(endereco.cep).substring(5, String(endereco.cep).length) + ', ';
          end = end + String(endereco.cidade.nome) + '-';
          end = end + String(endereco.uf.sigla);
          return end;
        }
      }
    }
}());