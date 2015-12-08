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
      "$http", "fileService","Upload", function ($http, fileService,Upload) {

        var vm = this;
        vm.title = "Photos";

        vm.photos = [];

        vm.files = [];

        var url = "api/files";

        fileService.getAll().then(function (data) {
          vm.photos = data;
        }, function (err) {
          console.log(err);
        });


        vm.uploadFiles = function (files) {
          console.log(files);
          //Upload.upload();
        }

        vm.remove = function (filePhoto) {

        }

        vm.setPreviewPhoto = function (filePhoto) {

        };

        this.awesomeThings = [
          "HTML5 Boilerplate",
          "AngularJS",
          "Karma"
        ];


      }
    ]);
})();
