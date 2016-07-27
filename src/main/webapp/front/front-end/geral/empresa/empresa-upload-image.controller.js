(function(){
'use strict';  
  angular
    .module('EmpresaUploadImage', [
      'angularFileUpload'
    ])
    .config(config)
    .controller('EmpresaUploadImageController', EmpresaUploadImageController);

    config.$inject = ['$stateProvider'];
    function config($stateProvider){
      $stateProvider
        .state('app.upload',{
          url : '/upload/:id/imagem',
          templateProvider : templateProvider,
          controller: 'EmpresaUploadImageController',
          controllerAs : 'vm',
          resolve : {
            empresaUploadImagePreService : empresaUploadImagePreService
          }
        });

      templateProvider.$inject = ['TemplateUrlPathFactory', '$templateFactory'];
      function templateProvider(TemplateUrlPathFactory, $templateFactory){
        var url = TemplateUrlPathFactory.getPathUrlGeral() + '/empresa/empresa-upload-image.html';
        return $templateFactory.fromUrl(url);
      }

      empresaUploadImagePreService.$inject = ['EmpresaService', '$stateParams'];
      function empresaUploadImagePreService(EmpresaService, $stateParams){
        var id = $stateParams.id;
        return EmpresaService.get(id);
      }
    }

    EmpresaUploadImageController.$inject = ['$scope','empresaUploadImagePreService','UploadService','$stateParams','$q','UrlService', 'ModalConfirmationService', 'message'];

    function EmpresaUploadImageController ($scope, empresaUploadImagePreService, UploadService, $stateParams, $q, UrlService, ModalConfirmationService, message) {
      var vm = this;
      vm.remove = remove;
      vm.upload = upload;
      vm.empresa = empresaUploadImagePreService.data;
      vm.selectedFiles = {};
      vm.command = {};
      vm.commandRemove = {};
      var id;
      vm.backToList = backToList;
      vm.fileSelected = fileSelected;
      vm.imageSelected;
      vm.readAsDataURL = readAsDataURL;
      vm.imageSrc = "";
      vm.tipo;
      vm.file;
      vm.tipos;
      vm.formatarCategoria = formatarCategoria;
      vm.validarTipo = validarTipo; 
      init();

      vm.tipos = [
        {
          valor:'LOGO',     
          descricao:'Logotipo'
        },
        {
          valor:'LOGO_RELATORIO',     
          descricao:'Logotipo para relatórios'
        },
        {
          valor:'LOGO_DOCUMENTO',     
          descricao:'Logotipo para documentos'
        },
        {
          valor:'OUTRAS',     
          descricao:'Outras'
        }
      ];

      function init(){

        var id = $stateParams.id;
        vm.command = {
          entityId : {
            value : id
          }
        }
        
        vm.command.entityVersion = vm.empresa.version;
      };

      function remove(fileId) {
        var contentModal = {
            header: 'Exclusão de Imagem',
            text: 'Tem certeza que deseja excluir a imagem da empresa',
            target: ''          
        };

        ModalConfirmationService
          .confirmation(contentModal)
          .then(function(){
              vm.commandRemove = {
                idImagem : fileId,
                entityId : vm.empresa.id,
                entityVersion : vm.empresa.version
              }

              UploadService
                .removeImagem(vm.commandRemove)
                .then(removeImageSuccess);
            });
      };

    function removeImageSuccess(data){
      message.success('Imagem Salva com Sucesso');
      UrlService.reload();
    }
      
    function backToList(){
      UrlService.go('app.empresa-list');
    };

    function onLoad(reader, deferred, scope) {
      return function () {
        scope.$apply(function () {
            deferred.resolve(reader.result);
        });
      };
    };
   
    function onError(reader, deferred, scope) {
      return function () {
        scope.$apply(function () {
            deferred.reject(reader.result);
        });
      };
    };
   
    var onProgress = function(reader, scope) {
      return function (event) {
        scope.$broadcast("fileProgress",
          {
            total: event.total,
            loaded: event.loaded
          });
      };
    };

    function fileSelected(file){
      readAsDataURL(file[0]).then(function(result) {
        vm.imageSrc = result;
        vm.teste = false;
      });
    }

    function getReader(deferred, scope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, scope);
      reader.onerror = onError(reader, deferred, scope);
      reader.onprogress = onProgress(reader, scope);
      return reader;
    };
   
    function readAsDataURL(file) {
      var deferred = $q.defer();
      var reader = getReader(deferred, $scope);         
      reader.readAsDataURL(file);
      return deferred.promise;
    };

    function validarTipo(){
      var valid = true;
      angular.forEach(vm.tipos, function(tipo) {
        if(tipo.valor === vm.tipo.valor){
          if(vm.tipo.valor == 'LOGO' || vm.tipo.valor == 'LOGO_RELATORIO' || vm.tipo.valor == 'LOGO_DOCUMENTO'){
            if(existeOTipoSalvo(vm.tipo.valor)){
              valid = false;
              message.error('Já existe uma imagem deste tipo adicionada para esta empresa');
              return;  
            }          
          }        
        }
      });
      if(valid){
        upload();
      }
    }

    function existeOTipoSalvo(tipoValor){
      var existe = false;
      angular.forEach(vm.empresa.imagem, function(imagem){
        if(imagem.tipo == tipoValor){
          existe = true;
          return;
        }
      })
      return existe;
    }

    function upload() {
      vm.command.imageEncoded = vm.imageSrc,
      vm.command.typeImage = vm.tipo.valor

      UploadService
        .upload(vm.command)
        .then(uploadImageSuccess);

      function uploadImageSuccess(data){
        message.success('Imagem Salva com Sucesso');
        UrlService.reload();
      };
    };

    function formatarCategoria(categoria){
      var descricao;
      angular.forEach(vm.tipos, function(tipo) {
        if(tipo.valor === categoria){
          descricao = tipo.descricao;
          return;
        }
      });
      return descricao;
    }
  };
}())