/*!
 * FlextreeJS.Components v1.0.0
 * http://flextreejs.github.io/
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

(function ($) {
    'use strict';

    var cssCheckbox = 'ft-checkbox';
    var selCheckbox = '.' + cssCheckbox;
    var dataAttached = 'ft-checkbox-attached';
    var eventCheck = 'check.checkbox.flextree';

    $.fn.treeChecked = function () {
        return $(this).treeRoot().find(selCheckbox).filter(':checked').treeNode();
    };

    $.flextree.components.checkbox = {
        eventCheck: eventCheck,

        main: function (multiple) {
            var $root = $(this).treeRoot();
            if ($root.data(dataAttached))
                return;

            $root.data(dataAttached, true);
            if (multiple === false) {
                $root.on('click', selCheckbox, function (e) {
                    $(e.delegateTarget).find(selCheckbox).filter(':checked').not(this).prop('checked', false);
                    $(e.target).trigger(eventCheck);
                });
                return;
            }

            $root.on('click', selCheckbox, function (e) {
                $(this).treeFind().find(selCheckbox)
                    .prop('indeterminate', false).prop('checked', $(this).is(':checked'));

                var $parents = $(this).treeParents().find(selCheckbox);
                for (var i = $parents.length - 1; i >= 0; i--) {
                    var $this = $($parents[i]);
                    var $children = $this.treeChildren().find(selCheckbox);

                    if ($children.length == 1) {
                        $this.prop('checked', $children.is(':checked'));
                        continue;
                    }

                    var lastChecked = $this.is(':checked');
                    var lastIndeterminate = $this.prop('indeterminate');

                    var checked = true, unchecked = true, indeterminate = false;
                    $children.each(function () {
                        if ($(this).is(':checked'))
                            unchecked = false;
                        else
                            checked = false;

                        if ($(this).prop('indeterminate'))
                            indeterminate = true;

                        if (!checked && !unchecked)
                            return false;
                    });

                    if (checked) {
                        if (lastChecked)
                            break;

                        $this.prop('indeterminate', false).prop('checked', true);
                    } else if (unchecked && !indeterminate) {
                        if (!lastChecked && !lastIndeterminate)
                            break;

                        $this.prop('indeterminate', false).prop('checked', false);
                    } else {
                        if (lastIndeterminate)
                            break;

                        $this.prop('indeterminate', true).prop('checked', false);
                    }
                }

                $(e.target).trigger(eventCheck);
            });
        }
    }
}(typeof module !== 'undefined' && module.exports ? require('jquery') : jQuery));

(function ($) {
    'use strict';

    var dataDragSource = 'ft-dnd5-source';
    var dataAttached = 'ft-dnd5-attached';

    $.flextree.components.dnd5 = {
        main: function () {
            $(this).treeAll().each(function () {
                $(this).attr('draggable', 'true')
                    .find('a,img').attr('draggable', 'false');
            });

            var $root = $(this).treeRoot();
            if ($root.data(dataAttached))
                return;

            $root.data(dataAttached, true);
            $root.on('dragstart', 'li[draggable=true]', function (e) {
                    $(e.delegateTarget).data(dataDragSource, this);
                })
                .on('dragover', 'li[draggable=true]', function (e) {
                    var dragSource = $(e.delegateTarget).data(dataDragSource);
                    if (dragSource == this)
                        return;

                    if ($(this).nextAll().filter(dragSource).length != 0)
                        $(this).addClass('ft-dnd5-top');
                    else if ($(this).prevAll().filter(dragSource).length != 0)
                        $(this).addClass('ft-dnd5-bottom');
                    else
                        return;

                    e.preventDefault();
                })
                .on('dragleave', 'li[draggable=true]', function () {
                    $(this).removeClass('ft-dnd5-top')
                        .removeClass('ft-dnd5-bottom');
                })
                .on('drop', 'li[draggable=true]', function (e) {
                    e.preventDefault();

                    $(this).removeClass('ft-dnd5-top')
                        .removeClass('ft-dnd5-bottom');

                    var dragSource = $(e.delegateTarget).data(dataDragSource);
                    var $dragSource = $(dragSource);
                    $dragSource = $dragSource.add($dragSource.treeChildren().parent().parent());

                    if ($(this).nextAll().filter(dragSource).length != 0)
                        $(this).before($dragSource);
                    else if ($(this).prevAll().filter(dragSource).length != 0) {
                        var $this = $(this).treeNext().prev();
                        if ($this.length == 0)
                            $this = $(this).next();
                        if ($this.length == 0)
                            $this = $(this);

                        $this.after($dragSource);
                    }
                })
                .on('dragend', 'li[draggable=true]', function (e) {
                    $(e.delegateTarget).removeData(dataDragSource);
                });
        }
    };
}(typeof module !== 'undefined' && module.exports ? require('jquery') : jQuery));

(function ($) {
    'use strict';

    var cssVisible = 'ft-visible';
    var selLoading = '.ft-ajax';
    var eventActivate = 'activate.ajax.flextree';

    $.fn.treeAjax = function (ajax) {
        var $deferred = $.Deferred();
        $(this).treeNode().on(eventActivate, function () {
            $(this).off(eventActivate);

            var node = this;
            var $loading = $(this).find(selLoading);
            $loading.addClass(cssVisible);
            $.ajax(ajax).then(
                function (data, textStatus, jqXHR) {
                    $deferred.resolveWith(this, [node, data, textStatus, jqXHR]);
                }, function (jqXHR, textStatus, errorThrown) {
                    $deferred.rejectWith(this, [node, jqXHR, textStatus, errorThrown]);
                })
                .always(function () {
                    $loading.removeClass(cssVisible);
                });
        });

        return $deferred.promise();
    };
}(typeof module !== 'undefined' && module.exports ? require('jquery') : jQuery));

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
