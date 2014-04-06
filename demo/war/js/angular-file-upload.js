/**!
 * AngularJS file upload/drop directive with http post and progress
 * @author  Danial  <danial.farid@gmail.com>
 * @version <%= pkg.version %>
 */
(function() {
	
var angularFileUpload = angular.module('angularFileUpload', []);

angularFileUpload.service('$upload', ['$http', '$rootScope', '$timeout', function($http, $rootScope, $timeout) {
	function sendHttp(config) {
		config.method = config.method || 'POST';
		config.headers = config.headers || {};
		config.transformRequest = config.transformRequest || function(data) {
			if (window.ArrayBuffer && data instanceof ArrayBuffer) {
				return data;
			}
			return $http.defaults.transformRequest[0](data);
		};
		
		if (window.XMLHttpRequest.__isShim) {
			config.headers['__setXHR_'] = function() {
				return function(xhr) {
					config.__XHR = xhr;
					xhr.upload.addEventListener('progress', function(e) {
						if (config.progress) {
							$timeout(function() {
								if(config.progress) config.progress(e);
							});
						}
					}, false);
					//fix for firefox not firing upload progress end, also IE8-9
					xhr.upload.addEventListener('load', function(e) {
						if (e.lengthComputable) {
							$timeout(function() {
								if(config.progress) config.progress(e);
							});
						}
					}, false);
				}	
			};
		}
			
		var promise = $http(config);
		
		promise.progress = function(fn) {
			config.progress = fn;
			return promise;
		};		
		promise.abort = function() {
			if (config.__XHR) {
				$timeout(function() {
					config.__XHR.abort();
				});
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
	this.upload = function(config) {
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
		
		var fileFormName = config.fileFormDataName || 'file';
		
		if (Object.prototype.toString.call(config.file) === '[object Array]') {
			var isFileFormNameString = Object.prototype.toString.call(fileFormName) === '[object String]'; 
			for (var i = 0; i < config.file.length; i++) {						         
				formData.append(isFileFormNameString ? fileFormName + i : fileFormName[i], config.file[i], config.file[i].name);
			}
		} else {
			formData.append(fileFormName, config.file, config.file.name);
		}
		
		config.data = formData;
		
		return sendHttp(config);
	};
	this.http = function(config) {
		return sendHttp(config);
	}
}]);

angularFileUpload.directive('ngFileSelect', [ '$parse', '$http', '$timeout', function($parse, $http, $timeout) {
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
			$timeout(function() {
				fn(scope, {
					$files : files,
					$event : evt
				});
			});
		});

        var isFileInput = (elem.attr('type') && elem.attr('type').toLowerCase() == 'file') || false;

        if (!isFileInput) {
            var fileInputEl = angular.element('<input type="file" />')
            	.css("top", 0)
            	.css("bottom", 0)
            	.css("left", 0)
            	.css("right", 0)
            	.css("width", "100%")
            	.css("opacity", 0)
            	.css("position", "absolute")
            	.attr("title", "Drop file or click here to upload"); // better than browser's default title
            elem
            	.append(fileInputEl)
        		.css("position", "relative");
        } else
			elem.bind('click', function(){
				this.value = null;
			});
	};
} ]);

angularFileUpload.directive('ngFileDropAvailable', [ '$parse', '$http', '$timeout', function($parse, $http, $timeout) {
	return function(scope, elem, attr) {
		if ('draggable' in document.createElement('span')) {
			var fn = $parse(attr['ngFileDropAvailable']);
			$timeout(function() {
				fn(scope);
			});
		}
	};
} ]);

angularFileUpload.directive('ngFileDrop', [ '$parse', '$http', '$timeout', function($parse, $http, $timeout) {
	return function(scope, elem, attr) {
		if ('draggable' in document.createElement('span')) {
			var cancel = null;
			var fn = $parse(attr['ngFileDrop']);
			elem[0].addEventListener("dragover", function(evt) {
				$timeout.cancel(cancel);
				evt.stopPropagation();
				evt.preventDefault();
				elem.addClass(attr['ngFileDragOverClass'] || "dragover");
			}, false);
			elem[0].addEventListener("dragleave", function(evt) {
				cancel = $timeout(function() {
					elem.removeClass(attr['ngFileDragOverClass'] || "dragover");
				});
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
				$timeout(function() {
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