        return model;
    };
    
    if (typeof this.define != "undefined") {
        this.define('glue/model', ['jquery', 'glue'], plugin);
    }
    else {
        plugin(this.jQuery, this.glue)();
    }
}();