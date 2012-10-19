        return widget;
    };
    
    if (typeof this.define != "undefined") {
        this.define('glue/widget', ['jquery', 'glue'], plugin);
    }
    else {
        plugin(this.jQuery, this.glue);
    }
}();