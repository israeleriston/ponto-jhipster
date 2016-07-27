(function(){
 'use strict';
  angular
    .module('InputImageDirective',[])
    .directive('inputImage', inputImage);

  inputImage.$inject = ['TemplateUrlPathFactory'];

  function inputImage(TemplateUrlPathFactory){
    var directive = {
      restrict : 'E',
      scope : {
        object : '=',
        imagePreview : '=',
        isRequired : '=',
        isDisabled : '='
      },
      templateUrl : TemplateUrlPathFactory.getPahtUrlComponents() + '/input-image/input-image.directive.html',
      link : link,
    }
    return directive;

    function link(scope, element, attrs){
        scope.imagePattern = TemplateUrlPathFactory.getPahtUrlComponents() + '/input-image/imageNotSelected.jpg';
                
        scope.deleteImage = function(){
          if(scope.isDisabled == true)
            return;
            delete scope.object;  
            $('#inputImage').val("");
            scope.imagePreview = scope.imagePattern;
        };
        
        scope.$watch('imagePreview', function(value){
          scope.imageSelected = (scope.imagePreview && scope.imagePreview != scope.imagePattern) ? true : false;
        });
        
        $(document).on('change', '.btn-file :file', function() {
            scope.image = $(this).get(0).files[0];
            if(scope.image){
                var reader  = new FileReader();
                reader.onloadend = function () {
                    scope.$apply(function () {
                        scope.imagePreview = reader.result;
                        scope.object = reader.result;
                    });
                }
                reader.readAsDataURL(scope.image);
            }
        });        
    }
  }
}())