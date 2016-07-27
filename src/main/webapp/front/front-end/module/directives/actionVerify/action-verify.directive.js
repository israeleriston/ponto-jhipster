(function(){
'use strict';
angular
  .module('ActionVerifyDirective',[])
  .directive('actionVerify', actionVerify);

  actionVerify.$inject = ['MenuBuildService','$compile'];

  function actionVerify(MenuBuildService, $compile) {
    var directive = {
      restrict : 'A',
      link : link
    }
    return directive;
    
    function link(scope, element, attrs){
      verify();

      function verify(){
        var feature = attrs.actionVerify,
        hideElement = attrs.hideElement;
        
        if (!feature) {
          setDisabledAttrs(attrs);
        } else if (!MenuBuildService.hasActionAccess(feature)) {
          setDisabledAttrs(attrs);
          console.log(hideElement);
            if (hideElement && hideElement === 'true')
              setHideElement();
        }
      }

      function setDisabledAttrs(attr) {
        element.attr('disabled', true);
        element.addClass('disabled');
      };
      
      function setHideElement(){
        element.css('display','none');
      };     
    }
  }
}());