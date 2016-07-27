(function(){  
  'use strict';
  angular
    .module('EmpresaList',[])
    .config(config)
    .controller('EmpresaListController', EmpresaListController)
  ;

  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('app.empresa-list',{
        url : '/empresas/list',
        templateProvider : templateProvider,
        controller : 'EmpresaListController',
        controllerAs : 'vm',
        resolve : {
          empresaPreService : empresaPreService
        }
      });

    templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
    function templateProvider(TemplateUrlPathFactory, $templateFactory){
      var url = TemplateUrlPathFactory.getPathUrlGeral() + '/empresa/empresa-list.html';
      return $templateFactory.fromUrl(url);
    }
    empresaPreService.$inject = ['EmpresaService'];
    function empresaPreService(EmpresaService){
      return EmpresaService.empresaFindAll(1);
    }
  }

  EmpresaListController.$inject = ['UrlService','EmpresaService', 'empresaPreService','ModalConfirmationService', 'message'];

  function EmpresaListController(UrlService, EmpresaService, empresaPreService, ModalConfirmationService, message){
    var vm = this;
    vm.pageNumber = 1;
    vm.parametroBusca = ''; 
    vm.empresas = empresaPreService.data;
    vm.init = init;
    vm.inativar = inativar;
    vm.ativar = ativar;
    vm.create = create;
    vm.goToEdit = goToEdit;
    vm.getEmpresaByNome = getEmpresaByNome;
    vm.findEmpresas = findEmpresas;
    vm.goToUploadImage = goToUploadImage;
    init();

    function init(){
    };

    function inativar(empresa){
      var contentModal = {
        header: 'Inativar Empresa.',
        text: 'Tem certeza que deseja INATIVAR a empresa:',
        target: empresa.nomefantasia          
      };

      ModalConfirmationService
        .confirmation(contentModal)
        .then(function(){
          EmpresaService
            .inativar(empresa)
            .then(successInativarEmpresa)
            ;
        });

        function successInativarEmpresa(response){
          if(response.status == 200){
            message.success('Empresa inativada com successo.');
            findEmpresas(vm.pageNumber);
          }
        };
    };

    function ativar(empresa){
      var contentModal = {
        header: 'Ativar Empresa.',
        text: 'Tem certeza que deseja ATIVAR a empresa:',
        target: empresa.nomefantasia          
      };

      ModalConfirmationService
        .confirmation(contentModal)
        .then(function(){
          EmpresaService
            .ativar(empresa)
            .then(successAtivarEmpresa)
            ;
        });

        function successAtivarEmpresa(response){
          if(response.status == 200){
            message.success('Empresa ativada com successo.');
            findEmpresas(vm.pageNumber)
            ;
          }
        };
    };
    
    function create(){
      UrlService.go('app.empresa-create');
    };
    
    function goToEdit(id){
    	UrlService.go('app.empresa-edit',{id:id})

    };

    function getEmpresaByNome(search){
      return EmpresaService
        .getEmpresas(search)
        .then(getEmpresasSuccess)
        ;
    };

    function getEmpresasSuccess(response){
      return response.data;
    };

    function findEmpresas(parametro, pageNumber){
      if(!pageNumber)
        vm.pageNumber = 1;
      if(!parametro)
          vm.parametroBusca = '';
      EmpresaService
          .empresaFindParameters(vm.parametroBusca, vm.pageNumber)
          .then(successFindAll);
    };

    function goToUploadImage(id){
      UrlService.go('app.upload',{id:id});
    }

    function successFindAll(response){
        vm.empresas = response.data;
    };
  }
}())
