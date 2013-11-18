/**!
 * AngularJS file upload/drop directive with http post and progress
 * @author  Danial  <danial.farid@gmail.com>
 * @version 1.1.5
 */
(function() {
	
var angularFileUpload = angular.module('angularFileUpload', []);

angularFileUpload.service('$upload', ['$http', '$rootScope', function($http, $rootScope) {
	this.upload = function(config) {
		config.method = config.method || 'POST';
		config.headers = config.headers || {};
		config.headers['Content-Type'] = undefined;
		config.transformRequest = config.transformRequest || $http.defaults.transformRequest;
		var formData = new FormData();
		if (config.data) {
			for (var key in config.data) {
				var val = config.data[key];
				if (!config.formDataAppender) {
					if (typeof config.transformRequest == 'function') {
						val = config.transformRequest(val);
					} else {
						for (var i = 0; i < config.transformRequest.length; i++) {
							var fn = config.transformRequest[i];
							if (typeof fn == 'function') {
								val = fn(val);
							}
						}
					}
					formData.append(key, val);
				} else {
					config.formDataAppender(formData, key, val);
				}
			}
		}
		config.transformRequest =  angular.identity;
		formData.append(config.fileFormDataName || 'file', config.data.file, config.data.file.name);

		formData['__setXHR_'] = function(xhr) {
			config.__XHR = xhr;
			xhr.upload.addEventListener('progress', function(e) {
				if (config.progress) {
					config.progress(e);
					if (!$rootScope.$$phase) {
						$rootScope.$apply();
					}
				}
			}, false);
		};

		config.data = formData;
		
		var promise = $http(config);
		
		promise.progress = function(fn) {
			config.progress = fn;
			return promise;
		};
		
		promise.abort = function() {
			if (config.__XHR) {
				config.__XHR.abort();
			}
			return promise;
		};		
		promise.then = (function(promise, origThen) {
			return function(s, e, p) {
				config.progress = p || config.progress;
				origThen.apply(promise, [s, e, p]);
				return promise;
			};
		})(promise, promise.then);
		
		return promise;
	};
}]);

angularFileUpload.directive('ngFileSelect', [ '$parse', '$http', function($parse, $http) {
	return function(scope, elem, attr) {
		var fn = $parse(attr['ngFileSelect']);
		elem.bind('change', function(evt) {
			var files = [], fileList, i;
			fileList = evt.target.files;
			if (fileList != null) {
				for (i = 0; i < fileList.length; i++) {
					files.push(fileList.item(i));
				}
			}
			scope.$apply(function() {
				fn(scope, {
					$files : files,
					$event : evt
				});
			});
		});
		elem.bind('click', function(){
			this.value = null;
		});
	};
} ]);

angularFileUpload.directive('ngFileDropAvailable', [ '$parse', '$http', function($parse, $http) {
	return function(scope, elem, attr) {
		if ('draggable' in document.createElement('span')) {
			var fn = $parse(attr['ngFileDropAvailable']);
			if(!scope.$$phase) {
				scope.$apply(function() {
					fn(scope);
				});
			} else {
				fn(scope)
			}
		}
	};
} ]);

angularFileUpload.directive('ngFileDrop', [ '$parse', '$http', function($parse, $http) {
	return function(scope, elem, attr) {
		if ('draggable' in document.createElement('span')) {
			var fn = $parse(attr['ngFileDrop']);
			elem[0].addEventListener("dragover", function(evt) {
				evt.stopPropagation();
				evt.preventDefault();
				elem.addClass(attr['ngFileDragOverClass'] || "dragover");
			}, false);
			elem[0].addEventListener("dragleave", function(evt) {
				elem.removeClass(attr['ngFileDragOverClass'] || "dragover");
			}, false);
			elem[0].addEventListener("drop", function(evt) {
				evt.stopPropagation();
				evt.preventDefault();
				elem.removeClass(attr['ngFileDragOverClass'] || "dragover");
				var files = [], fileList = evt.dataTransfer.files, i;
				if (fileList != null) {
					for (i = 0; i < fileList.length; i++) {
						files.push(fileList.item(i));
					}
				}
				scope.$apply(function() {
					fn(scope, {
						$files : files,
						$event : evt
					});
				});
			}, false);
		}
	};
} ]);

})();
