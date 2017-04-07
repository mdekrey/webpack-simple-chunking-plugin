var a = require("./targets/a.js");
require.ensure(["./targets/c.js"], function(require) {
    require("./targets/b.js").xyz();
    var d = require("./targets/d.js");
});

require.ensure(["./targets/e.js"], function(require) {
    require("./targets/b.js").xyz();
    var d = require("./targets/d.js");
});
