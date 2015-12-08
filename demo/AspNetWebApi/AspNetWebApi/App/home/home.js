(function() {
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
      "$http", "fileService", "Upload", "API_URL", function ($http, fileService, Upload, API_URL) {

        var vm = this;

        vm.title = "Photos";
        ////var apiUrl = "api/files";

        vm.photos = [];
        vm.files = [];
        vm.previewPhoto = {};

        fileService.getAll()
          .then(function(data) {
            vm.photos = data;
          }, function(err) {
            console.log("Error status: " + err.status);
          });

        function uploadFiles(files) {
          debugger;
          console.log(files);
          Upload.upload({
            url: API_URL,
            data: { file: files }
            })
            .then(function (resp) {

              console.log(resp);
            }, function(err) {
              console.log("Error status: " + err.status);
            });;
        }

        function setPreviewPhoto(photo) {
          vm.previewPhoto = photo;
        }

        function removePhoto(photo) {
          console.log(photo);
          fileService.deletePhoto(photo.Name).then(function() {
            setPreviewPhoto();
          });
        }

        vm.uploadFiles = uploadFiles;
        vm.remove = removePhoto;
        vm.setPreviewPhoto = setPreviewPhoto;
      }
    ]);
})();