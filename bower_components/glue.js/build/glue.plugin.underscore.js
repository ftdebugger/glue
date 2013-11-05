(function () {
    var plugin = (function (glue, _) {
        "use strict";

        var methods = ['each', 'map', 'reduce', 'reduceRight', 'find', 'filter', 'where', 'findWhere', 'reject', 'every',
            'some', 'contains', 'invoke', 'pluck', 'max', 'min', 'sortBy', 'groupBy', 'indexBy', 'countBy', 'shuffle',
            'sample', 'toArray', 'size', 'forEach', 'first', 'initial', 'last', 'rest', 'compact', 'flatten', 'without',
            'union', 'intersection', 'difference', 'uniq', 'zip', 'object', 'indexOf', 'lastIndexOf', 'sortedIndex',
            'range'];

        /**
         * Create common method proxies
         */
        _.each(methods, function (method) {
            glue.fn.Model.helpers[method] = function () {
                return _[method].apply(this, [this.models].concat([].slice.call(arguments)))
            };
        });
    });

    if (typeof this.define != "undefined") {
        this.define('glue/underscore', ['glue', 'underscore'], plugin);
    }
    else {
        plugin(this.glue, this._);
    }
})();
