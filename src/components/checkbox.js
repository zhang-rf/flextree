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
