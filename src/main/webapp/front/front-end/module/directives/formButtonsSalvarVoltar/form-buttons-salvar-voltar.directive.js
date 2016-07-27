(function(){
'use strict';
angular
  .module('FormButtonsSalvarVoltarDirective',[])
  .directive('formButtonsSalvarVoltar', formButtonsSalvarVoltar);

  function formButtonsSalvarVoltar() {
    return {
      restrict : 'E',
      replace : true,
      templateUrl : './template/form-buttons/form-buttons-salvar-voltar.html'
    }
  }

}());
