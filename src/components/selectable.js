(function ($) {
    'use strict';

    var dataFixDblClickBug = $.flextree.getInternal('dataFixDblClickBug');

    var cssSelectable = 'ft-selectable';
    var selSelectable = '.' + cssSelectable;
    var cssSelected = 'ft-selected';
    var selSelected = selSelectable + '.' + cssSelected;
    var dataSelected = 'ft-selectable-selected';
    var dataAttached = 'ft-selectable-attached';
    var dataMultiple = 'ft-selectable-multiple';
    var dataCancelable = 'ft-selectable-cancelable';
    var eventSelect = 'select.selectable.flextree';

    $.fn.treeSelected = function () {
        var $root = $(this).treeRoot();
        var selected = $root.data(dataSelected);
        if (selected)
            return $(selected);

        return $root.find(selSelected);
    };

    $.fn.treeSelect = function () {
        var $this = $(this).treeNode();
        var $root = $this.treeRoot();
        var multiple = $root.data(dataMultiple);
        var cancelable = $root.data(dataCancelable);

        if (cancelable)
            $this.toggleClass(cssSelected);
        else
            $this.addClass(cssSelected);

        if (!multiple) {
            if (!$this.hasClass(cssSelected))
                $root.removeData(dataSelected);
            else {
                var $lastSelected = $($root.data(dataSelected));
                if (!$lastSelected.is(this)) {
                    $lastSelected.removeClass(cssSelected);
                    $root.data(dataSelected, this);
                }
            }
        }

        $this.trigger(eventSelect);
    };

    $.flextree.components.selectable = {
        eventSelect: eventSelect,

        main: function (multiple, cancelable) {
            $(this).treeAll().each(function () {
                $(this).addClass(cssSelectable);
            });

            var $root = $(this).treeRoot();
            if ($root.data(dataAttached))
                return;

            $root.data(dataAttached, true);
            $root.data(dataMultiple, multiple || false);
            $root.data(dataCancelable, cancelable !== false);

            var fixDblClickBug = $root.data(dataFixDblClickBug);
            $root.on('click', selSelectable, function (e) {
                if (fixDblClickBug && !e.isClick)
                    return;

                $(this).treeSelect();
            });
        }
    };
}(typeof module !== 'undefined' && module.exports ? require('jquery') : jQuery));
