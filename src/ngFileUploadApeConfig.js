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
        url = url.replace(reg, ent.replace);
      });
      return url;
    }

    var _errCallbacks = [];
    function _registerErrorCB(cb){
      _errCallbacks.push(cb);
    }
    function _handleError(err){
      _errCallbacks.forEach(function(cb){
        if (cb && typeof cb === 'function') cb(err);
      });
      // emptying the list after every error
      _errCallbacks.splice(0, _errCallbacks.length);
    }

    this.$get = [function(){
      return {
        imageProxyUrl:    _imageProxyUrl,
        utils: {
          removeHtmlEntities: _removeHtmlEntities,
          registerErrorCB: _registerErrorCB,
          handleError: _handleError
        }
      };
    }];

  });

})();
