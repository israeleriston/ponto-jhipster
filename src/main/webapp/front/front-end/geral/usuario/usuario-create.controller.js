(function(){
'use strict'
  angular
    .module('UsuarioCreate',[])
    .config(config)
    .controller('UsuarioCreateController',UsuarioCreateController);

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.usuario-create',{
        url : '/usuarios/create',
        templateProvider : templateProvider,
        controller : 'UsuarioCreateController',
        controllerAs : 'vm'
      });

    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/usuario/usuario-create.html';
      return $templateFactory.fromUrl(url);
    }
  }

  UsuarioCreateController.$inject = ['UrlService','UsuarioService', 'message'];
  function UsuarioCreateController(UrlService, UsuarioService, message){
    var vm = this;
    vm.backToList = backToList;
    vm.save = save;
    vm.senhaEhDiferenteDeConfirmacao = senhaEhDiferenteDeConfirmacao;
    init();

    function init(){
      vm.usuario = {};
    }

    function senhaEhDiferenteDeConfirmacao(){
      return angular.isDefined(vm.usuario.senha) && angular.isDefined(vm.usuario.confirmacaoDeSenha) && 
        vm.usuario.senha !== vm.usuario.confirmacaoDeSenha;
    }

    function backToList(){
      UrlService.go('app.usuario-list');
    }

    function save(){
      UsuarioService
        .create(vm.usuario)
        .then(successSaveUsuario);
    }

    function successSaveUsuario(response){
      var msg = 'Usuario salvo com successo.';
      message.success(msg);
      init();
    }
  }
}())
