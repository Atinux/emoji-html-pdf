// Generated by CoffeeScript 1.8.0
(function() {
  var exit, json, nbPages, options, page, paper, setContent, system, type, webpage, _i, _len, _ref, _ref1, _ref2, _ref3;

  system = require('system');

  webpage = require('webpage');

  exit = function(error) {
    var message;
    if (typeof error === 'string') {
      message = error;
    }
    if (error) {
      system.stderr.write("html-pdf: " + (message || ("Unknown Error " + error)) + "\n");
    }
    return phantom.exit(error ? 1 : 0);
  };

  setTimeout(function() {
    return exit('Force timeout');
  }, 120000);

  json = JSON.parse(system.stdin.readLine());

  if (!((_ref = json.html) != null ? _ref.trim() : void 0)) {
    exit('Did not receive any html');
  }

  options = json.options;

  page = webpage.create();

  page.content = json.html;

  nbPages = 0;

  paper = {
    border: options.border || '0'
  };

  if (options.height && options.width) {
    paper.width = options.width;
    paper.height = options.height;
  } else {
    paper.format = options.format || 'A4';
    paper.orientation = options.orientation || 'portrait';
  }

  setContent = function(type) {
    var _ref1;
    return paper[type] = {
      height: (_ref1 = options[type]) != null ? _ref1.height : void 0,
      contents: phantom.callback(function(pageNum, numPages) {
        var _ref2;
        nbPages = numPages;
        return (((_ref2 = options[type]) != null ? _ref2.contents : void 0) || '').replace('{{page}}', pageNum).replace('{{pages}}', numPages);
      })
    };
  };

  _ref1 = ['header', 'footer'];
  for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
    type = _ref1[_i];
    if (options[type]) {
      setContent(type);
    }
  }

  if ((_ref2 = paper.header) != null) {
    if (_ref2.height == null) {
      _ref2.height = '45mm';
    }
  }

  if ((_ref3 = paper.footer) != null) {
    if (_ref3.height == null) {
      _ref3.height = '28mm';
    }
  }

  page.paperSize = paper;

  page.onConsoleMessage = function (message) {
    if (message === '__DONE__') {
      var fileOptions, filename;

      fileOptions = {
        type: options.type || 'pdf',
        quality: options.quality || 75
      };
      filename = options.filename || ("" + (options.directory || '/tmp') + "/html-pdf-" + system.pid + "." + fileOptions.type);
      page.render(filename, fileOptions);
      system.stdout.write(JSON.stringify({
        filename: filename,
        pages: nbPages
      }));
      return exit(null);
    }
  };

  page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];

    if (trace && trace.length) {
      msgStack.push('TRACE:');
      trace.forEach(function(t) {
        msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
      });
    }

    system.stderr.write(msgStack.join('\n'));

  };

  page.onLoadFinished = function(status) {
    
  };

}).call(this);
