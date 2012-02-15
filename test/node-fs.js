if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define([
  "promised-io/test/test-case",
  "promised-io/test/test-case/assert",
  "../main",
  "fs",
  "promised-io/promise/Promise",
  "promised-io/node-stream/Stream"
], function(testCase, assert, fs, nativeFs, Promise, Stream){
  return testCase("node-fs", {
    before: function(){
      this.expected = nativeFs.readFileSync(__filename, "utf8");
    },

    "readFile": {
      "returns promise": function(){
        var promise = fs.readFile(__filename);
        assert(promise instanceof Promise);
      },

      "reads correctly": function(){
        var expected = this.expected;
        return fs.readFile(__filename, "utf8").then(function(contents){
          assert.same(contents, expected);
        });
      },

      "fails appropriately": function(){
        return fs.readFile(__filename + Date.now(), "utf8").fail(function(error){
          assert(error.code, "ENOENT");
        });
      }
    },

    "realpath": {
      "returns promise": function(){
        var promise = fs.realpath(__filename);
        assert(promise instanceof Promise);
      },

      "reads correctly": function(){
        var expected = nativeFs.realpathSync(__filename);
        return fs.realpath(__filename).then(function(path){
          assert.same(path, expected);
        });
      },

      "fails appropriately": function(){
        return fs.realpath(__filename + Date.now(), "utf8").fail(function(error){
          assert(error.code, "ENOENT");
        });
      }
    },

    "createReadStream": {
      "returns stream": function(){
        var stream = fs.createReadStream(__filename);
        assert(stream instanceof Stream);
      },

      "reads correctly": function(){
        var expected = this.expected;
        var stream = fs.createReadStream(__filename);
        stream.setEncoding("utf8");
        return stream.join("").then(function(contents){
          assert.same(contents, expected);
        });
      },

      "fails appropriately": function(){
        var stream = fs.createReadStream(__filename + Date.now());
        return stream.join("").fail(function(error){
          assert(error.code, "ENOENT");
        });
      }
    }
  });
});
