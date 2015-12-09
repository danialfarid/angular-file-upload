(function () {

  "use strict";

  /**
   * @ngdoc function
   * @name webApiSample.controller:HomeCtrl
   * @description
   * # HomeCtrl
   * Controller of the webApiSample
   */
  angular.module("webApiSample")
    .controller("HomeCtrl", [
      "$http", "$rootScope", "fileService", "Upload", "apiUrl", function($http, $rootScope, fileService, Upload, apiUrl) {

        var vm = this;

        //Variables
        vm.title = "Photos";
        vm.photos = [];
        vm.files = [];
        vm.previewPhoto = {};

        //Functions
        function setPreviewPhoto(photo) {
          vm.previewPhoto = photo;
        }

        function activate() {
          $rootScope.spinner.on();
          fileService.getAll()
            .then(function(data) {
              vm.photos = data.Photos;
              $rootScope.spinner.off();
              setPreviewPhoto();
            }, function(err) {
              console.log("Error status: " + err.status);
              $rootScope.spinner.off();
            });
        }

        function uploadFiles(files) {
          $rootScope.spinner.on();

          Upload.upload({
                  url: apiUrl,
                  data: { file: files }
            })
            .then(function(response) {
                  $rootScope.spinner.off();
                  activate();
                  setPreviewPhoto();
            }, function(err) {
                  console.log("Error status: " + err.status);
                  $rootScope.spinner.off();
            });;
        }

        function removePhoto(photo) {
          $rootScope.spinner.on();
          fileService.deletePhoto(photo.Name)
            .then(function () {
              activate();
              $rootScope.spinner.off();
              setPreviewPhoto();
            });
        }

        //Set scope 
        activate();
        vm.uploadFiles = uploadFiles;
        vm.remove = removePhoto;
        vm.setPreviewPhoto = setPreviewPhoto;
      }
    ]);
})();