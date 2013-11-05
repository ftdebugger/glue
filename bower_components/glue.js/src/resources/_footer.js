    var glue = new Instance();
    glue.fn = Instance.fn;

    glue.util = {
        uniqueId: uniqueId
    };

//    glue.Instance = Instance;

    // export library
    if (typeof this.define != "undefined") {
        this.define("glue", function() {
            return glue;
        });
    }
    else {
        this.glue = glue;
    }
}();