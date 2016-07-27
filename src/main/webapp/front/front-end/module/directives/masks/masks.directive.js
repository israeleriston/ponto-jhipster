/**
 * angular-mask
 * Personalized input masks for AngularJS
 */
(function (angular) {

var StringMask = (function() {
	var tokens = {
		'0': {pattern: /\d/, _default: '0'},
		'9': {pattern: /\d/, optional: true},
		'#': {pattern: /\d/, optional: true, recursive: true},
		'S': {pattern: /[a-zA-Z]/},
		'$': {escape: true} 
	};
	var isEscaped = function(pattern, pos) {
		var count = 0;
		var i = pos - 1;
		var token = {escape: true};
		while (i >= 0 && token && token.escape) {
			token = tokens[pattern.charAt(i)];
			count += token && token.escape ? 1 : 0;
			i--;
		}
		return count > 0 && count%2 === 1;	
	};
	var calcOptionalNumbersToUse = function(pattern, value) {
		var numbersInP = pattern.replace(/[^0]/g,'').length;
		var numbersInV = value.replace(/[^\d]/g,'').length;
		return numbersInV - numbersInP;
	};
	var concatChar = function(text, character, options) {
		if (options.reverse) return character + text;
		return text + character;
	};
	var hasMoreTokens = function(pattern, pos, inc) {
		var pc = pattern.charAt(pos);
		var token = tokens[pc];
		if (pc === '') return false;
		return token && !token.escape ? true : hasMoreTokens(pattern, pos + inc, inc);
	};
	var insertChar = function(text, char, position) {
		var t = text.split('');
		t.splice(position >= 0 ? position: 0, 0, char);
		return t.join('');
	};
	var StringMask = function(pattern, opt) {
		this.options = opt || {};
		this.options = {
			reverse: this.options.reverse || false,
			usedefaults: this.options.usedefaults || this.options.reverse
		};
		this.pattern = pattern;

		StringMask.prototype.process = function proccess(value) {
			if (!value) return '';
			value = value + '';
			var pattern2 = this.pattern;
			var valid = true;
			var formatted = '';
			var valuePos = this.options.reverse ? value.length - 1 : 0;
			var optionalNumbersToUse = calcOptionalNumbersToUse(pattern2, value);
			var escapeNext = false;
			var recursive = [];
			var inRecursiveMode = false;

			var steps = {
				start: this.options.reverse ? pattern2.length - 1 : 0,
				end: this.options.reverse ? -1 : pattern2.length,
				inc: this.options.reverse ? -1 : 1
			};

			var continueCondition = function(options) {
				if (!inRecursiveMode && hasMoreTokens(pattern2, i, steps.inc)) {
					return true;
				} else if (!inRecursiveMode) {
					inRecursiveMode = recursive.length > 0;
				}

				if (inRecursiveMode) {
					var pc = recursive.shift();
					recursive.push(pc);
					if (options.reverse && valuePos >= 0) {
						i++;
						pattern2 = insertChar(pattern2, pc, i);
						return true;
					} else if (!options.reverse && valuePos < value.length) {
						pattern2 = insertChar(pattern2, pc, i);
						return true;
					}
				}
				return i < pattern2.length && i >= 0;
			};

			for (var i = steps.start; continueCondition(this.options); i = i + steps.inc) {
				var pc = pattern2.charAt(i);
				var vc = value.charAt(valuePos);
				var token = tokens[pc];
				if (!inRecursiveMode || vc) {
					if (this.options.reverse && isEscaped(pattern2, i)) {
						formatted = concatChar(formatted, pc, this.options);
						i = i + steps.inc;
						continue;
					} else if (!this.options.reverse && escapeNext) {
						formatted = concatChar(formatted, pc, this.options);
						escapeNext = false;
						continue;
					} else if (!this.options.reverse && token && token.escape) {
						escapeNext = true;
						continue;
					}
				}

				if (!inRecursiveMode && token && token.recursive) {
					recursive.push(pc);
				} else if (inRecursiveMode && !vc) {
					if (!token || !token.recursive) formatted = concatChar(formatted, pc, this.options);
					continue;
				} else if (recursive.length > 0 && token && !token.recursive) {
					// Recursive tokens most be the last tokens of the pattern
					valid = false;
					continue;
				} else if (!inRecursiveMode && recursive.length > 0 && !vc) {
					continue;
				}

				if (!token) {
					formatted = concatChar(formatted, pc, this.options);
					if (!inRecursiveMode && recursive.length) {
						recursive.push(pc);
					}
				} else if (token.optional) {
					if (token.pattern.test(vc) && optionalNumbersToUse) {
						formatted = concatChar(formatted, vc, this.options);
						valuePos = valuePos + steps.inc;
						optionalNumbersToUse--;
					} else if (recursive.length > 0 && vc) {
						valid = false;
						break;
					}
				} else if (token.pattern.test(vc)) {
					formatted = concatChar(formatted, vc, this.options);
					valuePos = valuePos + steps.inc;
				} else if (!vc && token._default && this.options.usedefaults) {
					formatted = concatChar(formatted, token._default, this.options);
				} else {
					valid = false;
					break;
				}
			}

			return {result: formatted, valid: valid};
		};

		StringMask.prototype.apply = function(value) {
			return this.process(value).result;
		};

		StringMask.prototype.validate = function(value) {
			return this.process(value).valid;
		};
	};

	StringMask.process = function(value, pattern, options) {
		return new StringMask(pattern, options).process(value);
	};

	StringMask.apply = function(value, pattern, options) {
		return new StringMask(pattern, options).apply(value);
	};

	StringMask.validate = function(value, pattern, options) {
		return new StringMask(pattern, options).validate(value);
	};

	return StringMask;
}());

/** Used to determine if values are of the language type Object */
var objectTypes = {
	'boolean': false,
	'function': true,
	'object': true,
	'number': false,
	'string': false,
	'undefined': false
};

if (objectTypes[typeof module]) {
	module.exports = StringMask;	
}

/**
 * br-validations
 * A library of validations applicable to several Brazilian data like I.E., CNPJ, CPF and others
 * @version v0.2.2
 * @link http://github.com/the-darc/br-validations
 * @license MIT
 */
(function () {
  var root = this;
var CNPJ = {};

CNPJ.validate = function(c) {
	var b = [6,5,4,3,2,9,8,7,6,5,4,3,2];
	c = c.replace(/[^\d]/g,'');

	var r = /^(0{14}|1{14}|2{14}|3{14}|4{14}|5{14}|6{14}|7{14}|8{14}|9{14})$/;
	if (!c || c.length !== 14 || r.test(c)) {
		return false;
	}
	c = c.split('');

	for (var i = 0, n = 0; i < 12; i++) {
		n += c[i] * b[i+1];
	}
	n = 11 - n%11;
	n = n >= 10 ? 0 : n;
	if (parseInt(c[12]) !== n)  {
		return false;
	}

	for (i = 0, n = 0; i <= 12; i++) {
		n += c[i] * b[i];
	}
	n = 11 - n%11;
	n = n >= 10 ? 0 : n;
	if (parseInt(c[13]) !== n)  {
		return false;
	}
	return true;
};


var CPF = {};

CPF.validate = function(cpf) {
	cpf = cpf.replace(/[^\d]+/g,'');
	var r = /^(0{11}|1{11}|2{11}|3{11}|4{11}|5{11}|6{11}|7{11}|8{11}|9{11})$/;
	if (!cpf || cpf.length !== 11 || r.test(cpf)) {
		return false;
	}
	function validateDigit(digit) {
		var add = 0;
		var init = digit - 9;
		for (var i = 0; i < 9; i ++) {
			add += parseInt(cpf.charAt(i + init)) * (i+1);
		}
		return (add%11)%10 === parseInt(cpf.charAt(digit));
	}
	return validateDigit(9) && validateDigit(10);
};

var algorithmSteps = {
	handleStr: {
		onlyNumbers: function(str) {
			return str.replace(/[^\d]/g,'').split('');
		},
		mgSpec: function(str) {
			var s = str.replace(/[^\d]/g,'');
			s = s.substr(0,3)+'0'+s.substr(3, s.length);
			return s.split('');
		}
	},
	sum: {
		normalSum: function(handledStr, pesos) {
			var nums = handledStr;
			var sum = 0;
			for (var i = 0; i < pesos.length; i++) {
				sum += parseInt(nums[i]) * pesos[i];
			}
			return sum;
		},
		individualSum: function(handledStr, pesos) {
			var nums = handledStr;
			var sum = 0;
			for (var i = 0; i < pesos.length; i++) {
				var mult = parseInt(nums[i]) * pesos[i];
				sum += mult%10 + parseInt(mult/10);
			}
			return sum;
		},
		apSpec: function(handledStr, pesos) {
			var sum = this.normalSum(handledStr, pesos);
			var ref = handledStr.join('');
			if (ref >= '030000010' && ref <= '030170009') {
				return sum + 5;
			}
			if (ref >= '030170010' && ref <= '030190229') {
				return sum + 9;
			}
			return sum;
		}
	},
	rest: {
		mod11: function(sum) {
			return sum%11;
		},
		mod10: function(sum) {
			return sum%10;
		},
		mod9: function(sum) {
			return sum%9;
		}
	},
	expectedDV: {
		minusRestOf11: function(rest) {
			return rest < 2 ? 0 : 11 - rest;
		},
		minusRestOf11v2: function(rest) {
			return rest < 2 ? 11 - rest - 10 : 11 - rest;
		},
		minusRestOf10: function(rest) {
			return rest < 1 ? 0 : 10 - rest;
		},
		mod10: function(rest) {
			return rest%10;
		},
		goSpec: function(rest, handledStr) {
			var ref = handledStr.join('');
			if (rest === 1) {
				return ref >= '101031050' && ref <= '101199979' ? 1 : 0;
			}
			return rest === 0 ? 0 : 11 - rest;
		},
		apSpec: function(rest, handledStr) {
			var ref = handledStr.join('');
			if (rest === 0) {
				return ref >= '030170010' && ref <= '030190229' ? 1 : 0;
			}
			return rest === 1 ? 0 : 11 - rest;
		},
		voidFn: function(rest) {
			return rest;
		}
	}
};


/**
 * options {
 *     pesos: Array of values used to operate in sum step
 *     dvPos: Position of the DV to validate considering the handledStr
 *     algorithmSteps: The four DV's validation algorithm steps names
 * }
 */
function validateDV(value, options) {
	var steps = options.algorithmSteps;

	// Step 01: Handle String
	var handledStr = algorithmSteps.handleStr[steps[0]](value);

	// Step 02: Sum chars
	var sum = algorithmSteps.sum[steps[1]](handledStr, options.pesos);

	// Step 03: Rest calculation
	var rest = algorithmSteps.rest[steps[2]](sum);

	// Fixed Step: Get current DV
	var currentDV = parseInt(handledStr[options.dvpos]);

	// Step 04: Expected DV calculation
	var expectedDV = algorithmSteps.expectedDV[steps[3]](rest, handledStr);

	// Fixed step: DV verification
	return currentDV === expectedDV;
}

var BrV = {
   cpf: CPF,
   cnpj: CNPJ
};
var objectTypes = {
	'function': true,
	'object': true
};
if (objectTypes[typeof module]) {
	module.exports = BrV;	
} else {
	root.BrV = BrV;
}
}.call(this));
'use strict';

angular.module('masks.helpers', [])
.factory('PreFormatters', [function(){
	function clearDelimitersAndLeadingZeros(value) {
		var cleanValue = value.replace(/^-/,'').replace(/^0*/, '');
		cleanValue = cleanValue.replace(/[^0-9]/g, '');
		return cleanValue;
	}

	function prepareNumberToFormatter (value, decimals) {
		return clearDelimitersAndLeadingZeros((parseFloat(value)).toFixed(decimals));
	}

	return {
		clearDelimitersAndLeadingZeros: clearDelimitersAndLeadingZeros,
		prepareNumberToFormatter: prepareNumberToFormatter
	};
}])
.factory('NumberValidators', [function() {
	return {
		maxNumber: function maxValidator(ctrl, value, limit) {
			var max = parseFloat(limit);
			var validity = ctrl.$isEmpty(value) || isNaN(max)|| value <= max;
			ctrl.$setValidity('max', validity);
			return value;
		},
		minNumber: function minValidator(ctrl, value, limit) {
			var min = parseFloat(limit);
			var validity = ctrl.$isEmpty(value) || isNaN(min) || value >= min;
			ctrl.$setValidity('min', validity);
			return value;
		}
	};
}])
.factory('NumberMasks', [function(){
	return {
		viewMask: function (decimals, decimalDelimiter, thousandsDelimiter) {
			var mask = '#' + thousandsDelimiter + '##0';

			if(decimals > 0) {
				mask += decimalDelimiter;
				for (var i = 0; i < decimals; i++) {
					mask += '0';
				}
			}

			return new StringMask(mask, {
				reverse: true
			});
		},
		modelMask: function (decimals) {
			var mask = '###0';

			if(decimals > 0) {
				mask += '.';
				for (var i = 0; i < decimals; i++) {
					mask += '0';
				}
			}

			return new StringMask(mask, {
				reverse: true
			});
		}
	};
}]);

'use strict';
angular.module('core.masks', [
	'utils.masks'
])
.config(['$logProvider', function($logProvider) {
	$logProvider.debugEnabled(false);
}]);

'use strict';

angular.module('utils.masks', [
	'masks.helpers',
	'masks.cep',
	'masks.cpfCnpj',
	'masks.number',
	'masks.phone',
	'masks.number.limit',
	'masks.decimal.number.places',
	'masks.date',
	'checkbox.indeterminate',
	'masks.money'
]);

'use strict';
angular.module('masks.number', [])
.directive('numberMask', [function() {	

	function clearValue (value) {
		if(!value) {
			return value;
		}
		return value.replace(/[^0-9]/g, '');
	}
	
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, element, attrs, ctrl) {
			if (!ctrl) {
				return;
			}			
			ctrl.$parsers.push(function(value) {
				if (ctrl.$viewValue) {
					ctrl.$setViewValue(clearValue(ctrl.$viewValue));
					ctrl.$render();
				}
				return clearValue(ctrl.$viewValue);
			})
		}
	}	
}]);

'use strict';
angular.module('masks.cep', [])
.directive('cepMask', [function() {
	var cepMask = new StringMask('00.000-000');

	function clearValue (value) {
		if(!value) {
			return value;
		}

		return value.replace(/[^0-9]/g, '');
	}

	function applyCepMask (value, ctrl) {
		if(!value) {
			ctrl.$setValidity('cep', true);
			return value;
		}
		var processed = cepMask.process(value);
		ctrl.$setValidity('cep', processed.valid);
		var formatedValue = processed.result;
		return formatedValue.trim().replace(/[^0-9]$/, '');
	}

	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, element, attrs, ctrl) {
			if (!ctrl) {
				return;
			}

			ctrl.$formatters.push(function(value) {
				return applyCepMask(value, ctrl);
			});

			ctrl.$parsers.push(function(value) {
				if (!value) {
					return applyCepMask(value, ctrl);
				}

				var cleanValue = clearValue(value);
				var formatedValue = applyCepMask(cleanValue, ctrl);

				if (ctrl.$viewValue !== formatedValue) {
					ctrl.$setViewValue(formatedValue);
					ctrl.$render();
				}

				return clearValue(formatedValue);
			});
		}
	};
}]);

'use strict';
(function() {
	var cnpjPattern = new StringMask('00.000.000\/0000-00');
	var cpfPattern = new StringMask('000.000.000-00');

	function validateCPF (ctrl, value) {
		var valid = ctrl.$isEmpty(value) || BrV.cpf.validate(value);
		ctrl.$setValidity('invalidCpf', valid);		
		return value;
	}

	function validateCNPJ (ctrl, value) {
		var valid = ctrl.$isEmpty(value) || BrV.cnpj.validate(value);
		ctrl.$setValidity('invalidCnpj', valid);
		return value;
	}

	function validateCPForCNPJ (ctrl, value) {
		if(!value || value.length <= 11) {
			validateCNPJ(ctrl, '');
			return validateCPF(ctrl, value);
		}else {
			validateCPF(ctrl, '');
			return validateCNPJ(ctrl, value);
		}
	}

	function cpfMask() {
		function applyCpfMask (value) {
			if(!value) {
				return value;
			}
			var formatedValue = cpfPattern.apply(value);
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}

		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				ctrl.$formatters.push(function(value) {
					return applyCpfMask(validateCPF(ctrl, value));
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]/g,'');
					var formatedValue = applyCpfMask(actualNumber);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue.replace(/[^\d]+/g,'');
				});

				ctrl.$parsers.push(function(value) {
					return validateCPF(ctrl, value);
				});
			}
		};
	}

	function cnpjMask() {
		function applyCnpjMask (value) {
			if(!value) {
				return value;
			}
			var formatedValue = cnpjPattern.apply(value);
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				ctrl.$formatters.push(function(value) {
					return applyCnpjMask(validateCNPJ(ctrl, value));
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						ctrl.$setViewValue(value.trim());
						ctrl.$render();
						return value.trim();
					}
					var actualNumber = value.replace(/[^\d]+/g,'');
					var formatedValue = applyCnpjMask(actualNumber);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}
					return formatedValue.replace(/[^\d]+/g,'');
				});

				ctrl.$parsers.push(function(value) {
					return validateCNPJ(ctrl, value);
				});
			}
		};
	}

	angular.module('masks.cpfCnpj', [])
	.directive('cpfMask', [cpfMask])
	.directive('cnpjMask', [cnpjMask]);
})();

'use strict';
angular.module('masks.phone', [])
.factory('PhoneValidators', [function() {
	return {
		brPhoneNumber: function (ctrl, value) {
			var valid = ctrl.$isEmpty(value) || value.length === 9 || value.length === 10 || value.length === 11;
			ctrl.$setValidity('phone', valid);
			return value;
		}
	};
}])
.directive('phoneMask', ['PhoneValidators', function(PhoneValidators) {
	
	var phoneMask7D = new StringMask('(00) 000-0000'),
		phoneMask8D = new StringMask('(00) 0000-0000'),
		phoneMask9D = new StringMask('(00) 00000-0000');

	function clearValue (value) {
		if(!value) {
			return value;
		}
		return value.replace(/[^0-9]/g, '');
	}

	function applyPhoneMask (value) {
		if(!value) {
			return value;
		}

		var formatedValue;

		if(value.length < 10){
			formatedValue = phoneMask7D.apply(value);
		}
		if(value.length == 10){
			formatedValue = phoneMask8D.apply(value);
		}
		if(value.length > 10){
			formatedValue = phoneMask9D.apply(value);
		}

		return formatedValue.trim().replace(/[^0-9]$/, '');
	}

	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, element, attrs, ctrl) {
			if (!ctrl) {
				return;
			}

			ctrl.$formatters.push(function(value) {
				return applyPhoneMask(PhoneValidators.brPhoneNumber(ctrl, value));
			});

			ctrl.$parsers.push(function(value) {
				if (!value) {
					return value;
				}

				var cleanValue = clearValue(value);
				var formatedValue = applyPhoneMask(cleanValue);

				if (ctrl.$viewValue !== formatedValue) {
					ctrl.$setViewValue(formatedValue);
					ctrl.$render();
				}

				return clearValue(formatedValue);
			});

			ctrl.$parsers.push(function(value) {
				return PhoneValidators.brPhoneNumber(ctrl, value);
			});
		}
	};
}]);

'use strict';
angular.module('masks.number.limit', [])
.directive('numberLimitMask', [function() {	

	function clearValue (value) {
		if(!value) {
			return value;
		}
		return value.replace(/[^0-9]/g, '');
	}

	function getAndValidateMaxNumber(attrs){
		if(attrs.max){			
			var onlyNumbers = /^\d+$/.test(attrs.max);
			if(onlyNumbers){
				return parseInt(attrs.max);
			}else{
				return undefined;
			}			
		}else{
			return undefined;
		}
	}

	function getAndValidateMinNumber(attrs){
		if(attrs.min){			
			var onlyNumbers = /^\d+$/.test(attrs.min);
			if(onlyNumbers){
				return parseInt(attrs.min);
			}else{
				return undefined;
			}			
		}else{
			return undefined;
		}
	}

	function validateMaxValue(ctrlViewValue, maxValue){
		return parseInt(ctrlViewValue) > maxValue;
	}

	function validateMinValue(ctrlViewValue, minValue){
		return parseInt(ctrlViewValue) < minValue;
	}

	function validateLimits(ctrl, attrs){
		var maxNumber = getAndValidateMaxNumber(attrs);					
		if(maxNumber){
			if(validateMaxValue(ctrl.$viewValue, maxNumber)){
				ctrl.$setValidity('max', false);
			}else{
				ctrl.$setValidity('max', true);
			}
		}

		var minNumber = getAndValidateMinNumber(attrs);					
		if(minNumber){
			if(validateMinValue(ctrl.$viewValue, minNumber)){
				ctrl.$setValidity('min', false);
			}else{
				ctrl.$setValidity('min', true);
			}
		}
	}
	
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, element, attrs, ctrl) {							
			if (!ctrl) {
				return;
			}			
			ctrl.$parsers.push(function(value) {
				if (ctrl.$viewValue) {					
					ctrl.$setViewValue(clearValue(ctrl.$viewValue));
					validateLimits(ctrl, attrs);			
					ctrl.$render();
				}else{
					ctrl.$setValidity('min', true);
				}
				return clearValue(ctrl.$viewValue);
			})
		}
	}	
}]);

'use strict';
angular.module('masks.decimal.number.places', [])
.directive('decimalNumberPlacesMask', [function() {	

	function clearValue (value, qntPlaces) {		
		if(!value) {
			return value;
		}
		var indexOfDecimalLimitator = value.indexOf(".");
		if(indexOfDecimalLimitator > -1){			
			value = value.substring(0, indexOfDecimalLimitator+(qntPlaces+1));
		}		
		return value;	
	}	
	
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, element, attrs, ctrl) {							
			if (!ctrl) {
				return;
			}			
			ctrl.$parsers.push(function(value) {				
				if (ctrl.$viewValue) {					
					ctrl.$setViewValue(clearValue(ctrl.$viewValue, attrs.qntdecimalplaces));					
					ctrl.$render();
				}
				return clearValue(ctrl.$viewValue, attrs.qntdecimalplaces);
			})
		}
	}	
}]);

'use strict';
angular
.module('masks.date', [])
.directive('dateMask',[function() {
	var dateMask = new StringMask('00/00/0000');

	function clearValue (value) {		
		if(!value) {
			return value;
		}
		return value.replace(/[^0-9]/g, '');
	}

	function isValidDate(s) {
	  var bits = s.split('/');
	  var y = bits[2], m  = bits[1], d = bits[0];
	  // Assume not leap year by default (note zero index for Jan)
	  var daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

	  // If evenly divisible by 4 and not evenly divisible by 100,
	  // or is evenly divisible by 400, then a leap year
	  if ( (!(y % 4) && y % 100) || !(y % 400)) {
	    daysInMonth[1] = 29;
	  }
	  return d <= daysInMonth[--m]
	}

	function applyDateMask (value, ctrl) {
		if(!value) {
			ctrl.$setValidity('invalidDate', true);
			return value;
		}
		var modelValue = String(ctrl.$modelValue);
		if(modelValue.length > 7 && value.length > 7){
			var modelValueOnlyNumbers = modelValue.replace(/[^0-9]/g, '');
			value = modelValueOnlyNumbers.substr(6,2) + '' + modelValueOnlyNumbers.substr(4,2)+ '' + modelValueOnlyNumbers.substr(0,4);
		}

		var processed = dateMask.process(value);
		var formatedValue = processed.result;
		if(formatedValue.length == 10 && !isValidDate(formatedValue)){
			ctrl.$setValidity('invalidDate', false);
		}
		return formatedValue.trim().replace(/[^0-9]$/, '');
	}

	function dateValue(value, ctrl){
		if(value.length > 7){
			// var date = value.substr(4,4) + '-' + value.substr(2,2) + '-' + value.substr(0,2),
			validDate = value.substr(0,2) + '/' + value.substr(2,2) + '/' + value.substr(3,4);
			var date = new Date(value.substr(4,4), parseInt(value.substr(2,2))-1, value.substr(0,2));

			if(isValidDate(validDate)){
				ctrl.$setValidity('invalidDate', true);
				return date;
			}
		}
		ctrl.$setValidity('invalidDate', false);
		return '';
	}

	return {
		restrict: 'A',
		require: '?ngModel',
		terminal : true,
		link: function(scope, element, attrs, ctrl) {
			if(!attrs.maxlength)
				element.attr('maxlength',10);


			ctrl.$formatters.push(function(value) {
				if(value instanceof Date)
					return value;
				return applyDateMask(value, ctrl);
			});

			ctrl.$parsers.push(function(value) {

				if (!value) {
					return applyDateMask(ctrl.$viewValue, ctrl);
				}

				var cleanValue = clearValue(ctrl.$viewValue);
				var formatedValue = applyDateMask(cleanValue, ctrl);

				if (ctrl.$viewValue !== formatedValue) {
					ctrl.$setViewValue(formatedValue);
					ctrl.$render();
					return ''
				}
				return dateValue(cleanValue, ctrl);
			});
		}
	};
}]);

'use strict';
angular.module('checkbox.indeterminate', [])
.directive('indeterminate', [function() {	
	return {
	  restrict: 'A',
	  link: function(scope, element, attributes) {
      attributes.$observe('indeterminate', function(value) {
          $(element).prop('indeterminate', value == "true");
      });
	  }
  };
}]);

'use strict';
angular
.module('masks.money', [])
.directive('moneyMask',[function() {
  var isNumber = /[0-9]/,
  prefix = '',
  suffix = '',
  separadorDeSentavos = ','
  separatorDeMilhares = '.',
  limit = false,
  limiteDeCentavos = 2,
  clearPrefix = false,
  clearSufix = false,
  permiteNegativo = false,
  insertPlusSign = false;
  
  if(insertPlusSign){
  	permiteNegativo = true;
  }

  function toNumbers(value) {
    var formatted = '';
    for (var i = 0; i < (value.length); i++) {
      charValue = value.charAt(i);
      if (formatted.length == 0 && charValue == 0) charValue = false;
      if (charValue && charValue.match(isNumber)) {
        if (limit) {
          if (formatted.length < limit) formatted = formatted + charValue;
        } else {
          formatted = formatted + charValue;
        }
      }
    }
    return formatted;
  }

  function preencheComZeros(value) {
    while (value.length < (limiteDeCentavos + 1)){
    	// console.log('Value Mask',value)
    	value = '0' + value;
    }
    return value;
  }

  function applyMoneyMask(value) {
  	if(!value) {
			return '0';
		}
    var formatted = preencheComZeros(toNumbers(value)),
    thousandsFormatted = '',
    contagem = 0;
    if (limiteDeCentavos == 0) {
      separadorDeSentavos = "";
      valorDosCentavos = "";
    }
    var valorDosCentavos = formatted.substr(formatted.length - limiteDeCentavos, limiteDeCentavos);
    var integerVal = formatted.substr(0, formatted.length - limiteDeCentavos);
    formatted = (limiteDeCentavos == 0) ? integerVal : integerVal + separadorDeSentavos + valorDosCentavos;
    if (separatorDeMilhares || $.trim(separatorDeMilhares) != "") {
      for (var cont = integerVal.length; cont > 0; cont--) {
        charValue = integerVal.substr(cont - 1, 1);
        contagem++;
        if (contagem % 3 == 0) charValue = separatorDeMilhares + charValue;
        thousandsFormatted = charValue + thousandsFormatted;
      }
      if (thousandsFormatted.substr(0, 1) == separatorDeMilhares){
      	thousandsFormatted = thousandsFormatted.substring(1, thousandsFormatted.length);
      }
      formatted = (limiteDeCentavos == 0) ? thousandsFormatted : thousandsFormatted + separadorDeSentavos + valorDosCentavos;
    }
    if (permiteNegativo && (integerVal != 0 || valorDosCentavos != 0)) {
      if (value.indexOf('-') != -1 && value.indexOf('+') < value.indexOf('-')) {
        formatted = '-' + formatted;
      } else {
        if (!insertPlusSign){
        	formatted = '' + formatted;
       	}
        else{
        	formatted = '+' + formatted;
        }
      }
    }
    if(prefix) {
    	formatted = prefix + formatted;
    }
    if(suffix){
    	formatted = formatted + suffix;
    }
    return formatted;
  }

  function returnToModel(value){
    var convert = value.replace('.', '');
    convert = convert.replace(',', '.');
    return convert;
  }

	return {
		restrict: 'A',
		require: '?ngModel',
		terminal: true,
		link: function(scope, element, attrs, ctrl) {
			ctrl.$formatters.push(function(value) {
				var formattedValue = String(value).replace('.',',');
				//console.log('applyMoneyMask(value)',applyMoneyMask(value));
				//ctrl.$setViewValue(formattedValue);
				//ctrl.$modelValue = value
				return angular.isDefined(value) ? formattedValue : '0';
			});

// Interação
			ctrl.$parsers.push(function(value) {

				var cleanValue = ctrl.$viewValue;
				var formatedValue = applyMoneyMask(cleanValue);

				// if (ctrl.$viewValue !== formatedValue) {
					ctrl.$setViewValue(formatedValue);
					ctrl.$render();
					// return '';
				// }
				return returnToModel(formatedValue);
			});
// fim da interação
		}
	}
}]);
})(angular);
