(function() {

  "use strict";

  angular
    .module("webApiSample")
    .service("fileService", [
      "$http", "$q","API_URL", function($http, $q, API_URL) {

        //var apiUrl = "api/files/";

        function getAll() {

          var deferred = $q.defer();

          $http.get(API_URL)
            .success(function(result) {
              deferred.resolve(result);
            })
            .error(function(error) {
              deferred.reject(error);
            });

          return deferred.promise;
        }

        function getPhoto(fileName) {

          var deferred = $q.defer();

          $http.get(API_URL + fileName)
            .success(function(result) {
              deferred.resolve(result);
            })
            .error(function(error) {
              deferred.reject(error);
            });

          return deferred.promise;
        }

        function deletePhoto(fileName) {

          var deferred = $q.defer();

          $http.delete(API_URL, { params: { fileName: fileName } })
            .success(function(result) {
              deferred.resolve(result);
            }).error(function(error) {
              deferred.reject(error);
            });

          return deferred.promise;
        }

        return {
          getAll: getAll,
          getPhoto: getPhoto,
          deletePhoto: deletePhoto
        };
      }
    ]);


})();