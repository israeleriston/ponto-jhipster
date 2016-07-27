(function(){
'use strict';
  angular
    .module('MenuBuilder',[])
    .factory('MenuBuildService',MenuBuildService);

  MenuBuildService.$inject = ['$state', 'MenuService', '$timeout'];

  function MenuBuildService($state, MenuService, $timeout){
    var allItens = []
      , itens = []
      , states = $state.get()
      , defaultStates = []
      , service = {
        build : build,
        getMenuItens : getMenuItens,
        getMenus : getMenus,
        buildMenu : buildMenu,
        getItemMenuByState : getItemMenuByState,
        hasActionAccess : hasActionAccess,
        clearItens : clearItens,
        getItemMenuByFeature : getItemMenuByFeature,
        hasItemAccess : hasItemAccess,
        loadDefaultStates : loadDefaultStates,
        hasLoadedAccessItems : hasLoadedAccessItems
      };

    return service;

    function build(accessItens){
      allItens = buildStates(accessItens);
      itens = getParentItem();
    }

    function getMenuItens(){
      return itens;
    }

    function getMenus(){
      var menus = [getHomeItem()];
      angular.forEach(allItens, function(item){
        if(item.tipo === 'MENU'){
          menus.push(item);
        }
      });
      return menus;
    }

    function buildStates(accessItens){
      var list = [];
      angular.forEach(accessItens, function(item){
        var state = getStateByUrl(item.url);
        item.state = state.name;
        list.push(item);
      });
      return list;
    }

    function getStateByUrl(url){
      var state = {name : 'app.index'};
      angular.forEach(states, function(item, index){
        if(url === item.url){
          state = item;
          return state;
        }
      });

      return state;
    }

    function getParentItem(){
      var parents = [];
      parents.push(getHomeItem());

      angular.forEach(allItens,function(item){
        if(!item.itemdeacesso_superior_id){
          if(item.tipo === 'MENU'){
            parents.push(item);
          }
        }
      });
      return parents;
    }

    function getHomeItem(){
      return {nome : 'Home', url : '/', id : 1, state : 'app.index'};
    }

    function buildMenu(item){
      if(!item.id){
        return item;
      }
      itens = [];
      if(item.id == 1){
        itens = getParentItem();
        return {};
      }
      itens.push(getHomeItem());
      itens.push(buildRecursiveMenu(item));
      addItensChildrenIntoItens(item);
      return item;
    }

    function buildRecursiveMenu(itemDeMenu){
      if(itemDeMenu.itemdeacesso_superior_id !== null){
        itens.push(buildRecursiveMenu(getItemMenu(itemDeMenu.itemdeacesso_superior_id)));
      }
      return itemDeMenu;
    }

    function addItensChildrenIntoItens(itemDeMenu){
      angular.forEach(allItens,function(item){
        if(itemDeMenu.id === item.itemdeacesso_superior_id && item.tipo === 'MENU'){
          itens.push(item);
          return itens;
        }
      });
    }

    function getItemMenu(itemdeacesso_superior_id){
      var itemDeMenu = getItemFromKeyAndValue('id', itemdeacesso_superior_id);
      return itemDeMenu;
    }

    function getItemMenuByState(state){
      var itemDeMenu = {};
      angular.forEach(allItens, function(item){
        if(item.state === state && item.state !== 'app.index'){
          itemDeMenu = item;
          return item;
        }
      });
      return itemDeMenu;
    }

    function getItemFromKeyAndValue(key, value){
      var itemDeMenu = {};
      angular.forEach(allItens, function(item){
        if(item[key] === value){
          itemDeMenu = item;
          return item;
        }
      });
      return itemDeMenu;
    }

    function hasDefaultAccessItem(state){
      var defaultItem = {}
      angular.forEach(defaultStates, function(item){
        if(item.state === state){
          defaultItem = item;
          return defaultItem;
        }
      });

      return angular.isDefined(defaultItem.id);
    }

    function hasActionAccess(action){
      var item = getItemFromKeyAndValue('feature', action);
      return angular.isDefined(item.id);
    }

    function hasItemAccess(state){
      var itemDeMenu = getItemFromKeyAndValue('state', state)
      , hasItem = angular.isDefined(itemDeMenu.id);
      if(hasItem){
        return hasItem;
      }
      return hasDefaultAccessItem(state);
    }

    function loadDefaultStates(){
      var pattern = /^app\./;
      angular.forEach(states, function(item, index){
        if(!pattern.test(item.name)){
          var acessState = {state : item.name, url : item.url, id : Math.floor(Math.random())+index};
          defaultStates.push(acessState);
        }
      });
    }

    function clearItens(){
      itens = [];
      allItens = [];
      defaultStates = [];
    }

    function hasLoadedAccessItems(){
      return allItens.length > 0;
    }

    function getItemMenuByFeature(action){
      var item = getItemFromKeyAndValue('feature', action);
      return item;
    }
  }
}());