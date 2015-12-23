(function () {

  ngFileUpload.provider('ngFileUploadApeConfig', function(){

    var _skipResizingGif = true;
    var _imageProxyUrl = 'http://url.apester.com/';

    this.skipGifResizing = function(isSkip){
      _skipResizingGif = isSkip;
      return this;
    };
    this.imageProxyUrl = function(proxyUrl){
      _imageProxyUrl = proxyUrl;
      return this;
    };

    this.$get = [function(){
      return {
        skipGifResizing:  _skipResizingGif,
        imageProxyUrl:    _imageProxyUrl
      };
    }];

  });

})();
