(function(){
'use strict';
  angular
    .module('PerfilDeUsuarioServices',[])
    .factory('PerfilDeUsuarioService',PerfilDeUsuarioService);
    ;

    PerfilDeUsuarioService.$inject = ['$http','TemplateService', 'message'];

    function PerfilDeUsuarioService($http, TemplateService, message){
      var service = new TemplateService('/perfilDeUsuario');
      service.findAll = findAll;
      service.findByParams = findByParams;
      service.getDiasDaSemana = getDiasDaSemana;
      service.getDiaDaSemanaByValue = getDiaDaSemanaByValue;
      service.PerfilDeUsuario = PerfilDeUsuario;
	  
      return service;
	  
      function findAll(id, pageNumber) {
			var method = 'POST';
			var url = '/query/perfilDeUsuarioFindByUserId/'
					+ pageNumber;
			return $http({
				url : url,
				method : method,
				data : {
					id : id
				}
			}).then(perfilDeUsuarioFindAllSuccess);
		}

		function perfilDeUsuarioFindAllSuccess(response) {
			return response;
		}
		
		function findByParams(id, parameter, pageNumber) {
			var method = 'POST';
			var url = '/query/perfilDeUsuarioFindByParameter/'
					+ pageNumber;
			return $http({
				url : url,
				method : method,
				data : {
					id : id,
					parameter : parameter
				}
			}).then(perfilDeUsuarioFindByParameterSuccess)
		}

    function getDiasDaSemana(){
      var list = [
        {name : 'DOMINGO', value : 0},
        {name : 'SEGUNDA', value : 1},
        {name : 'TERÇA', value : 2},
        {name : 'QUARTA', value : 3},
        {name : 'QUINTA', value : 4},
        {name : 'SEXTA', value : 5},
        {name : 'SÁBADO', value : 6}
      ];
      return list;
    }

    function getDiaDaSemanaByValue(key){
      var dia = {}
      angular.forEach(getDiasDaSemana(), function(item,index){
        if(item.name === key || item.value == key){
          dia = item;
          return dia;
        }
      });
      return dia;
    }

		function perfilDeUsuarioFindByParameterSuccess(response) {
			return response;
		}

    function PerfilDeUsuario(data){
      var self = {
        usuarioId : {},
        empresaId : {},
        usuario : {},
        itensDeAcessoRestritos : [],
        perfisDeAcessoDoPerfilDeUsuario : [],
        diaDaSemana : {},
        perfilDeUsuario : data ? getPerfilDeUsuarioToEdit(data) : {
          periodosDeAcesso : []
        },
        diasDaSemana : getDiasDaSemana(),
        addPeriodo : addPeriodo,
        createPeriodo : createPeriodo,
        removePeriodo : removePeriodo,
        isValidFields : isValidFields
      }
      , horaInicio = new Date()
      , horaFim = new Date();

      horaInicio.setHours(8);
      horaInicio.setMinutes(0);
      horaFim.setHours(18);
      horaFim.setMinutes(0);

      self.periodo = {
        horaInicio : horaInicio,
        horaFim : horaFim
      }

      return self;

      function addPeriodo(){
        angular.forEach(self.diaDaSemana, function(value, key){
          if(value == true){
            var objPeriodo = createPeriodo(key);
            if(isPeriodoBetweenPeriodosOnDiaDaSemana(objPeriodo)){
              message.info('Período de acesso está dentro de um intervalo existente no dia da semana ' + objPeriodo.diaDaSemana + ' .');
              return;
            }
            if(isHoraInicioGreaterHoraFim(objPeriodo)){
              message.info('Hora inicio maior que a hora fim da ' + objPeriodo.diaDaSemana + ' .');
              return;
            }
            self.perfilDeUsuario.periodosDeAcesso.push(objPeriodo);
            delete self.diaDaSemana[key];
          }
        });
      }

      function isHoraInicioGreaterHoraFim(periodo){
        return periodo.dataHoraInicio > periodo.dataHoraFim;
      }

      function isPeriodoBetweenPeriodosOnDiaDaSemana(periodo){
        var exists = false;
        angular.forEach(self.perfilDeUsuario.periodosDeAcesso, function(item){
          if(item.ordem == periodo.ordem){
            if(periodo.dataHoraInicio >= item.dataHoraInicio && periodo.dataHoraFim <= item.dataHoraFim){
              exists = true;
              return exists;
            }
          }
        });
        return exists;
      }

      function createPeriodo(key){
        var objPeriodo = {
          dataHoraInicio : self.periodo.horaInicio,
          dataHoraFim : self.periodo.horaFim,
          horaInicio : self.periodo.horaInicio.getHours() + ':' + self.periodo.horaInicio.getMinutes(),
          horaFim : self.periodo.horaFim.getHours() + ':' + self.periodo.horaFim.getMinutes(),
          diaDaSemana : getDiaDaSemanaByValue(key).name,
          ordem : parseInt(key)
        }
        return objPeriodo;
      }

      function isValidFields(){
        var isValid = false;
        angular.forEach(self.diaDaSemana, function(value, key){
          if(value == true){
            isValid = true;
            return;
          }
        });
        if(!self.periodo.horaInicio || !self.periodo.horaFim){
          return false;
        }
        return isValid;
      }

      function removePeriodo(periodo){
        var index = self.perfilDeUsuario.periodosDeAcesso.indexOf(periodo);
        self.perfilDeUsuario.periodosDeAcesso.splice(index,1);
      }

      function getPerfilDeUsuarioToEdit(data){
        var perfilDeUsuario = data;
        angular.forEach(perfilDeUsuario.periodosDeAcesso, function(item, index){
          var date = new Date()
            , horaInicioHora = item.horaInicio.substring(0,item.horaInicio.search(':'))
            , horaInicioMinuto = item.horaInicio.substring(item.horaInicio.search(':')+1,item.horaInicio.length)
            , horaFimHora = item.horaFim.substring(0,item.horaFim.search(':'))
            , horaFimMinuto = item.horaFim.substring(item.horaFim.search(':')+1,item.horaInicio.length)
            , dataHoraInicio = new Date()
            , dataHoraFim = new Date();
          dataHoraInicio.setHours(horaInicioHora);
          dataHoraInicio.setMinutes(horaInicioMinuto);
          dataHoraFim.setHours(horaFimHora);
          dataHoraFim.setMinutes(horaFimMinuto);
          perfilDeUsuario.periodosDeAcesso[index].dataHoraInicio = dataHoraInicio;
          perfilDeUsuario.periodosDeAcesso[index].dataHoraFim = dataHoraFim;
          perfilDeUsuario.periodosDeAcesso[index].ordem = getDiaDaSemanaByValue(item.diaDaSemana).value;
        });
        return perfilDeUsuario;
      }
    }
  }
}());