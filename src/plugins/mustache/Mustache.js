(function () {
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
})();