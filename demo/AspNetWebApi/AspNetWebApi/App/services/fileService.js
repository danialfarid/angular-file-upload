(function() {

  "use strict";

  angular
    .module("webApiSample")
    .service("fileService", [
      "$http", "$q", "Upload", function($http, $q, Upload) {

        var apiUrl = "api/files/";

        function getAll() {
          //debugger;
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

        //function addPhotos(photos) {

        //  var deferred = $q.defer();

        //  $http.post(apiUrl, photos)
        //    .success(function(result) {
        //      deferred.resolve(result);
        //    }).error(function(error) {
        //      deferred.reject(error);
        //    });

        //  return deferred.promise;
        //}

        function deletePhoto(fileName) {

          var deferred = $q.defer();

          $http.delete(apiUrl + fileName).success(function(result) {
            deferred.resolve(result);
          }).error(function(error) {
            deferred.reject(error);
          });

          return deferred.promise;
        }

        return {
          getAll: getAll,
          getPhoto: getPhoto,
          //addPhotos: addPhotos,
          deletePhoto: deletePhoto
        };
      }
    ]);


})();