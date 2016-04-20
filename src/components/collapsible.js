(function ($) {
    'use strict';

    var selFlextree = $.flextree.getInternal('selFlextree');
    var dataFixDblClickBug = $.flextree.getInternal('dataFixDblClickBug');
    var dataCollapsible = $.flextree.getInternal('dataCollapsible');
    var dataExclusiveNode = $.flextree.getInternal('dataExclusiveNode');

    var selCollapsible = '.ft-collapsible';
    var cssExpanded = 'ft-expanded';
    var dataAttached = 'ft-collapsible-attached';

    $.flextree.components.collapsible = {
        main: function () {
            var $root = $(this).treeRoot();
            var fixDblClickBug = $root.data(dataFixDblClickBug);
            var collapsible = $root.data(dataCollapsible);
            var exclusiveNode = $root.data(dataExclusiveNode);

            if (!collapsible || $root.data(dataAttached))
                return;

            $root.data(dataAttached, true);
            $root.on('click', selCollapsible, function (e) {
                if (fixDblClickBug && !e.isClick)
                    return;

                e.stopPropagation();
                $(this).treeActivate();
            });

            $root.on($.flextree.eventActivate, 'li:not(' + selFlextree + ')', function () {
                $(this).find(selCollapsible).toggleClass(cssExpanded);
                if (exclusiveNode)
                    $(this).treeSiblings().find(selCollapsible).removeClass(cssExpanded);
            });
        }
    };
}(typeof module !== 'undefined' && module.exports ? require('jquery') : jQuery));
