if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

/**
* node-fs
*
* Provides Promised-IO wrappers for Node.js `fs` module.
**/
define([
  "exports",
  "fs",
  "promised-io/node-stream/Stream",
  "promised-io/promise/node-style/wrap"
], function(exports, fs, Stream, wrap){
  "use strict";

  var isSync = /Sync$/;
  Object.keys(fs).forEach(function(method){
    if(isSync.test(method)){
      return;
    }

    var syncMethod = method + "Sync";
    if(syncMethod in fs){
      exports[method] = wrap(fs[method], method === "readFile");
      exports[syncMethod] = fs[syncMethod];
    }else if(method === "createReadStream"){
      exports.createReadStream = function(path, options){
        return new Stream(fs.createReadStream(path, options));
      };
    }else{
      exports[method] = fs[method];
    }
  });
});
