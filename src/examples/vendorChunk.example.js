var a = require("./targets/a.js");
var b = require("./targets/b.js");
var webpack = require("vendor-a");
var MemoryFS = require("vendor-b");

require.ensure(["./targets/b.js"], function(require) {
    require("vendor-a")
    require("vendor-c");
});

require.ensure(["vendor-c"], function(require) {
    require("vendor-a")
    require("vendor-c");
});
