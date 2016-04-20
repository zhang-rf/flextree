/*!
 * FlextreeJS.Components v1.0.0
 * http://zhang-rf.github.io/flextree
 *
 * Copyright Zhang rf and other contributors
 * Released under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 */

(function ($) {
    'use strict';

    if (!$.flextree)
        throw new Error("flextree.js required");

    var $fnTree = $.fn.tree;
    $.fn.tree = function () {
        var $tree = $fnTree.apply(this, Array.prototype.slice.call(arguments));
        var components = $.flextree.components.global;
        for (var i = 0; i < arguments.length; i++) {
            var args = arguments[i];
            if (typeof args == 'object' && args.components) {
                components = args.components;
                break;
            }
        }

        if (components)
            for (var componentName in components)
                $.flextree.components[componentName].main.apply($tree.get(0), components[componentName]);
        return $tree;
    };

    $.flextree.components = {};

    if (typeof module !== 'undefined' && module.exports)
        module.exports = $.flextree.components;
}(typeof module !== 'undefined' && module.exports ? require('jquery') : jQuery));
