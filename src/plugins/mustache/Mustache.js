(function () {
    var plugin = (function (glue, Mustache) {
        "use strict";

        /**
         * Render template
         *
         * @param {String} name
         * @param {String} [values]
         *
         * @returns {jQuery}
         */
        glue.fn.Widget.prototype.renderTemplate = function (name, values) {
            return $(Mustache.render(this.getTemplate(name), values || this.model));
        };
    });

    if (typeof this.define != "undefined") {
        this.define('glue/mustache', ['glue', 'mustache'], plugin);
    }
    else {
        plugin(this.glue, this.Mustache);
    }
})();