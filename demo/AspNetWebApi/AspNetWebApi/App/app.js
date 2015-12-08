"use strict";

/**
 * @ngdoc overview
 * @name webApiSample
 * @description
 * # webApiSample
 *
 * Main module of the application.
 */
angular
  .module("webApiSample", [
    //'ngAnimate',
    //'ngAria',
    //'ngCookies',
    //'ngMessages',
    //'ngResource',
    "ngRoute",
    "ngFileUpload"
    //'ngSanitize',
    //'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "app/home/home.html",
        controller: "HomeCtrl",
        controllerAs: "home"
      })
      .otherwise({
        redirectTo: "/"
      });
  })
  .constant("API_URL", "api/files/");
