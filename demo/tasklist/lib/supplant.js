define(function(undefined){

    /**
     * @param {String} result
     * @param {String} value
     * @return {*}
     */
    var getValue = function (result, value) {
        for (var index = 0; index < value.length; index++) {
            if (typeof result != "object") {
                return undefined;
            }

            result = result[ value[index] ];
        }

        return result;
    };

    /**
     * @param {Object} data
     * @return {String}
     */
    String.prototype.supplant = function (data) {
        // conditions like {?value}{/value} and {?!value}{/value}
        var result = this;
        var string = "";

        while (result != string) {
            string = result;
            result = string.replace(/\{\?\!?([^{}]*)\}(.*?)(\{\/\1})/mg,
                function (template, key, result) {
                    var check = getValue(data, key.split('.'));

                    if (template[2] == '!') {
                        check = !check;
                    }

                    if (check) {
                        return result;
                    }
                    else {
                        return '';
                    }
                }
            );
        }

        // variables like {value} and {value.foo}
        string = result.replace(/{([^{}]*)}/mg,
            function (template, key) {
                key = key.split('|');

                var value = getValue(data, key[0].split('.'));

                if (key[1] == 'e' && typeof value == 'string') {
                    value = value.escape();
                }

                if (typeof value === 'string' || typeof value === 'number') {
                    return value;
                }
                else {
                    return template;
                }
            }
        );

        return string;
    };

    String.prototype.escape = function () {
        return this
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\\/g, '')
            .replace("'", "&#39;")
            .replace('"', "&#34;");
    };
});