(function(){
'use strict';
  angular
    .module('core.routes',[])
    .config(configure);

  configure.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];

  function configure($stateProvider, $urlRouterProvider, $httpProvider){
    $httpProvider.interceptors.push('HttpInterceptor');

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('app',{
        abstract : true,
        resolve : {
          context : context,
          itensDeAcesso : itensDeAcesso
        },
        controller : controller,
        template : '<data-ui-view/>'
      })
      .state('app.index',{
        url : '/',
        templateUrl : './principal.html'
      });
    context.$inject = ['MenuService', 'BusEventsService'];

    function context(MenuService, BusEventsService){
      var contexts = MenuService.getContext();
      BusEventsService.broadcast('InsertContextOnAppEvent', contexts);
      return contexts;
    }

    itensDeAcesso.$inject = ['MenuService', 'context'];

    function itensDeAcesso(MenuService, context){
      return MenuService.getAccessItensWithValidationContext();
    }

    controller.$inject = ['itensDeAcesso', 'context', 'MenuBuildService', 'BusEventsService', 'UrlService', 'localservice']

    function controller(itensDeAcesso, context, MenuBuildService, BusEventsService, UrlService, localservice ){
      MenuBuildService.build(itensDeAcesso.data);
      MenuBuildService.loadDefaultStates();
      var current = UrlService.getCurrent();

      buildMenuBreadcrumb(current.name,current.url);

      BusEventsService.on('$stateChangeStart', stateChangeStart);
      BusEventsService.on('$stateChangeError', stateChangeError);
      BusEventsService.on('AbrirItemDeMenuPeloItemEvent', abrirItemDeMenuPeloItemEvent);
      BusEventsService.on('LogoutDaAplicacaoEvent', logoutDaAplicacaoEvent);

      if(!MenuBuildService.hasItemAccess(current.name)) {
        UrlService.go('app.index',{},{notify:true, location : true});
      }

      function stateChangeStart(event, toState, toParams, fromState) {
        if(toState) {
          var nameState = toState.name;
          if(nameState) {
            if(!MenuBuildService.hasItemAccess(nameState) && MenuBuildService.hasLoadedAccessItems()){
              event.preventDefault();
            } else {
              buildMenuBreadcrumb(nameState,toState.url);
            }
          }
        }
      }

      function stateChangeError(event, toState, toParams, fromState, fromParams, error){
        event.preventDefault();
      }

      function abrirItemDeMenuPeloItemEvent(event, data){
        var item = MenuBuildService.buildMenu(data);
        if(item.state)
          UrlService.go(item.state,{},{notify:true, location:true, reload:false});
      }

      function logoutDaAplicacaoEvent(event){
        MenuBuildService.clearItens();
      }

      function buildMenuBreadcrumb(state, url){
        if(state && url){
          var item = MenuBuildService.getItemMenuByState(state);
          MenuBuildService.buildMenu(item);
        }
      }
    }
  }
}());
