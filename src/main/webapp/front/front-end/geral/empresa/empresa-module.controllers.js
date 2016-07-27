(function(){
	'use strict';
	angular
		.module('EmpresaControllers', [
			'EmpresaCreate',
			'EmpresaEdit',
			'EmpresaList',
      'EmpresaContext',
      'EmpresaUploadImage'
		]);
}());