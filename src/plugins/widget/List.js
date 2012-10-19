/**
 * Created for vuvu.tv.
 * User: Evgeny Shpilevsky
 * Date: 2/6/12
 */

var List = (function(){

    /**
     * @class
     */
    var ListModel = function() {

    };

    /**
     * Extending
     */
    var f = function () {};
    f.prototype = Array.prototype;
    ListModel.prototype = new f();

    /**
     * Alias
     */
    var List = ListModel.prototype;

    /**
     * Clear all views
     */
    List.destroy = function() {
        this.forEach(function(view, index){
            view.destroy();
            this[index] = undefined;
        }, this);

        this.length = 0;
    };

    /**
     * Destroy widget and remove it from list
     *
     * @param widget
     */
    List.destroyWidget = function(widget) {
        var found = -1;

        for (var index = 0; index < this.length; index++) {
            if (found >= 0) {
                this[found++] = this[index];
            }
            else if (this[index] == widget) {
                found = index;
            }
        }

        if (found >= 0) {
            this.length--;
        }

        widget.destroy();
    };

    /**
     * @param widget
     */
    List.push = function(widget) {
        [].push.call(this, widget);
        return widget;
    };

    /**
     * Refresh all views in list
     */
    List.refresh = function() {
        for (var index = 0; index < this.length; index++) {
            this[index].refresh();
        }
    };

    return ListModel;

})();