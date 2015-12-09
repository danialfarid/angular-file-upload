(function() {

  "use strict";

        /**
         *  Service - FileService
         * 
         *  Service to do CRUD operations on photos
         * 
         */
        angular
          .module("webApiSample")
          .service("fileService", [
            "$http", "$q", "apiUrl", function($http, $q, apiUrl) {

        /**
        *   Method - GetAll
        * 
        *   Get all photos saved on the server       
        */
        function getAll() {
          var deferred = $q.defer();
          $http.get(apiUrl)
            .success(function(result) {
              deferred.resolve(result);
            })
            .error(function(error) {
              deferred.reject(error);
            });
          return deferred.promise;
        }

        /**
        *   Method - GetPhoto
        * 
        *   Get photo from server with given file name         * 
        */
        function getPhoto(fileName) {
          var deferred = $q.defer();
          $http.get(apiUrl + fileName)
            .success(function(result) {
              deferred.resolve(result);
            })
            .error(function(error) {
              deferred.reject(error);
            });
          return deferred.promise;
        }

        /*
        *   Method - DeletePhoto
        * 
        *   Delete photo on the server with given file name         * 
        */
        function deletePhoto(fileName) {
          var deferred = $q.defer();
          $http.delete(apiUrl, { params: { fileName: fileName } })
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