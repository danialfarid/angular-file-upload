(function () {

  ngFileUpload.provider('ngFileUploadApeConfig', function(){

    var _skipResizingGif = true;
    var _imageProxyUrl = 'http://url.apester.com/';

    this.skipGifResizing = function(isSkip){
      _skipResizingGif = isSkip;
    }
    this.imageProxyUrl = function(proxyUrl){
      _imageProxyUrl = proxyUrl;
    }

    this.$get = [function(){
      return {
        skipGifResizing:  _skipResizingGif,
        imageProxyUrl:    _imageProxyUrl
      }
    }];

  });

})();
