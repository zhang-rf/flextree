(function ($) {
    'use strict';

    $.fn.treeSearch = function (keyword, selector) {
        selector = selector || '*';

        var $nodes = $();
        $(this).treeAll().each(function () {
            if ($(this).filter(selector).text().indexOf(keyword) != -1)
                $nodes = $nodes.add(this);
        });

        return $nodes;
    };

}(typeof module !== 'undefined' && module.exports ? require('jquery') : jQuery));
