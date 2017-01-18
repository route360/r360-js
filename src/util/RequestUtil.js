

if (r360.Browser.nodejs) {
  (function() {
    var requireNode = eval('require');
    var request = requireNode('request');

    r360.RequestUtil = {
      request: function(options) {
        var requestOptions = {
          uri: options.url,
          method: options.type || 'POST',
          timeout: options.timeout,
          gzip: true,
          body: options.data,
          headers: {
            'accept': 'application/json'
          }
        };

        request(requestOptions, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            if (body[0] == '?') {
              body = body.substring(2, body.length - 1);
            }

            try {
              options.success(JSON.parse(body));
            } catch (ex) {
              options.error(ex);
            }

          } else {
            options.error(error || {status: response.statusCode})
          }
        })
      },

      getJSON: function(url, callback) {
        var requestOptions = {
          uri: url,
          method: 'GET',
          gzip: true,
          json: true
        };

        request(requestOptions, function (error, response, body) {
          if (!error)
            callback(body)
        })
      }
    }
  })();
} else {
  r360.RequestUtil = {
    request: function(options) {
        return $.ajax(options);
    },

    getJSON: function(url, callback) {
      return $.getJSON(url, callback)
    }
  }
}