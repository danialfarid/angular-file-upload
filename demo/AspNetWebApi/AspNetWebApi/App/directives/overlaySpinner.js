(function() {

  "use strict";

  function overlaySpinner($animate) {
    // Usage:
    //     <directive></directive>
    // Creates:
    // 
    function link(scope, element) {
      function statusWatcher(active) {
        $animate[active ? "addClass" : "removeClass"](element, "overlay-spinner-active");
      }

      scope.$watch("active", statusWatcher);
    }

    return {
      templateUrl: "/app/directives/overlaySpinner.html",
      scope: { active: "=" },
      transclude: true,
      link: link,
      restrict: "EA"
    };
  }

  angular
    .module("webApiSample")
    .directive("overlaySpinner", overlaySpinner);

  overlaySpinner.$inject = ["$animate"];

})();