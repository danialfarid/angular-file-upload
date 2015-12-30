(function () {

  ngFileUpload.provider('ngFileUploadApeConfig', function(){

    var _imageProxyUrl = 'http://url.apester.com/';

    this.imageProxyUrl = function(proxyUrl){
      _imageProxyUrl = proxyUrl;
      return this;
    };

    function _removeHtmlEntities(url){
      var entities = [
        { find:'&lt;', replace:'<' },
        { find:'&gt;', replace:'>' },
        { find:'&amp;', replace:'&' }
      ];
      entities.forEach(function(ent){
        var reg = new RegExp(ent.find, 'g');
        url.replace(reg, ent.replace);
      });
      return url;
    }

    this.$get = [function(){
      return {
        imageProxyUrl:    _imageProxyUrl,
        utils: {
          removeHtmlEntities: _removeHtmlEntities
        }
      };
    }];

  });

})();
