(function(){
  'use strict';
  angular
    .module('TemplateUrlPath',[])
    .factory('TemplateUrlPathFactory', TemplateUrlPathFactory);

    function TemplateUrlPathFactory(){
      var factory = {
        getPathUrlGeral : getPathUrlGeral,
        getPahtUrlComponents : getPahtUrlComponents,
        getPathUrlDirectives : getPathUrlDirectives,
        getPathUrlFinanceiro : getPathUrlFinanceiro,
        getPathUrlFrota : getPathUrlFrota,
        getPathUrlPessoa : getPathUrlPessoa,
        getPathUrlSPM : getPathUrlSPM
      };

      return factory;

      function getPathUrlGeral(){
        return './bower_components/architecture-front-end/front-end/geral';
      }

      function getPahtUrlComponents() {
        return './bower_components/architecture-front-end/front-end/components';
      }

      function getPathUrlDirectives() {
        return './bower_components/architecture-front-end/front-end/module/directives';
      }

      function getPathUrlFinanceiro(){
        return './bower_components/financeiro-front-end/financeiro'
      }

      function getPathUrlFrota(){
        return './bower_components/frota-front-end/frota'
      }

      function getPathUrlPessoa(){
        return './bower_components/pessoa-front-end/pessoa'
      }
      
      function getPathUrlSPM() {
        return './bower_components/spm-front-end/spm';
      }

    }

}());