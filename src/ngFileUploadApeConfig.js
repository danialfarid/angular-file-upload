(function () {

  ngFileUpload.provider('ngFileUploadApeConfig', function(){

    var _imageProxyUrl = 'http://url.apester.com/';

    this.imageProxyUrl = function(proxyUrl){
      _imageProxyUrl = proxyUrl;
      return this;
    };

    /**
     * Helps to overcome changing of file type error (gif to png).
     * @param file
     * @returns {boolean}
     * @private
     */
    function _needToResize(file) {
      if (file && file.type === 'image/gif') {
        return false;
      }
      return true;
    }

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

    var _errCallback = null;
    function _registerErrorCB(cb){
      _errCallback = cb;
    }
    function _handleError(err){
      if (_errCallback && typeof _errCallback === 'function')
        _errCallback(err);
    }

    this.$get = [function(){
      return {
        imageProxyUrl:    _imageProxyUrl,
        utils: {
          removeHtmlEntities: _removeHtmlEntities,
          registerErrorCB: _registerErrorCB,
          handleError: _handleError,
          needToResize: _needToResize
        }
      };
    }];

  });

})();
