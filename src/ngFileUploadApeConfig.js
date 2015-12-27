(function () {

  ngFileUpload.provider('ngFileUploadApeConfig', function(){

    var _imageProxyUrl = 'http://url.apester.com/';

    this.imageProxyUrl = function(proxyUrl){
      _imageProxyUrl = proxyUrl;
      return this;
    };

    this.$get = [function(){
      return {
        imageProxyUrl:    _imageProxyUrl
      };
    }];

  });

})();
