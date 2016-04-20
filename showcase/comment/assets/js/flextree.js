/*!
 * FlextreeJS v1.0.0
 * http://flextreejs.github.io/
 *
 * Copyright Zhang rf
 * Released under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 */

(function ($) {
    'use strict';

    var cssFlextree = 'js-flextree';
    var selFlextree = '.' + cssFlextree;
    var dataCollapsible = 'flextree-collapsible';
    var dataExclusiveNode = 'flextree-exclusive';
    var dataFixDblClickBug = 'flextree-dblbug';
    var dataExpanded = 'flextree-expanded';
    var eventActivate = 'activate.flextree';

    var ulPadding = '1em';
    var ulTemplate = '<ul class="' + cssFlextree + '" style="margin: 0;padding: 0;list-style-type: none;"/>';

    $.flextree = {
        eventActivate: eventActivate,

        /**
         * @param {Array} dataSource
         * @param {String} template
         * @param {Object} args
         * @param {Function} onBind
         * @returns {jQuery}
         */
        tree: function (dataSource, template, args, onBind) {
            // Prevent modification of the original array
            dataSource = dataSource.concat();

            // (args, onBind)
            if (template && typeof template != 'string') {
                onBind = args;
                args = template;
                template = undefined;
            }
            // (onBind)
            if (args && typeof args != 'object') {
                onBind = args;
                args = undefined;
            }
            // ()
            if (onBind && typeof onBind != 'function')
                args = undefined;

            template = template || $.flextree.global.template;
            args = args || $.flextree.global.args || {};

            if (!args.id)
                args.id = 'id';
            if (!args.parentId) {
                args.parentId = 'parent_id';

                if (dataSource.length > 0) {
                    if ('parentId' in dataSource[0])
                        args.parentId = 'parentId';
                    else if ('parentid' in dataSource[0])
                        args.parentId = 'parentid';
                }
            }

            // Correct nodes that have an invalid parent
            if (args.correctParent) {
                var ids = [];
                dataSource.forEach(function (data) {
                    ids.push(data[args.id]);
                });

                dataSource.forEach(function (data) {
                    var parentId = data[args.parentId];
                    if (parentId && ids.indexOf(parentId) == -1)
                        data[args.parentId] = null;
                });
            }

            var $root = $(ulTemplate);
            var liMap = {'': $root};
            do {
                var unfinished = false;

                dataSource.forEach(function (data, i) {
                    var parentId = data[args.parentId] || '';
                    if (!(parentId in liMap))
                        return;

                    var id = data[args.id];
                    var $ulNode = liMap[parentId];

                    // Create a ul to append child nodes
                    if (!$ulNode.is('ul')) {
                        var $ulWrapper = $('<li/>').addClass(cssFlextree);
                        if (args.collapsible)
                            $ulWrapper.css('display', 'none');
                        $ulNode = $(ulTemplate).css('padding-left', $.flextree.global.padding || ulPadding);
                        $ulWrapper.append($ulNode);

                        liMap[parentId].after($ulWrapper);
                        liMap[parentId] = $ulNode;
                    }

                    var tempTemplate = template;
                    for (var placeholder in data) {
                        if (data.hasOwnProperty(placeholder))
                            tempTemplate = tempTemplate.replace(
                                new RegExp('{' + placeholder + '}', 'g'), data[placeholder] || '');
                    }

                    var $liNode = $(tempTemplate);
                    if (!$liNode.is('li'))
                        $liNode = $('<li/>').append($liNode);

                    // Flag for components
                    $root.data(dataCollapsible, args.collapsible || false);
                    $root.data(dataExclusiveNode, args.exclusiveNode !== false);
                    $root.data(dataFixDblClickBug, args.fixDblClickBug || false);
                    if (args.collapsible) {
                        var exclusiveNode = args.exclusiveNode;
                        $liNode.on(eventActivate, function () {
                            if ($(this).data(dataExpanded))
                                $(this).removeData(dataExpanded);
                            else
                                $(this).data(dataExpanded, true);

                            $(this).next().filter(selFlextree).slideToggle('fast');
                            if (exclusiveNode !== false)
                                $(this).siblings().removeData(dataExpanded)
                                    .filter(selFlextree).not($(this).next()).slideUp('fast');
                        });

                        if (args.collapseEvent !== null) {
                            // Default collapse event is onClick
                            var events = 'click';
                            if (args.collapseEvent != null)
                                events = args.collapseEvent;

                            $liNode.on(events, function (e) {
                                // Ignore input events
                                if (!$(e.target).is('input'))
                                    $(this).trigger(eventActivate);
                            });
                        }

                        // Add a flag to determine whether it's a click event or dblclick event
                        if (args.fixDblClickBug) {
                            (function () {
                                function clearTimer() {
                                    if (clearTimer.timer) {
                                        clearTimeout(clearTimer.timer);
                                        clearTimer.timer = null;
                                    }
                                }

                                $liNode.on('click', function (e) {
                                    if (e.isClick)
                                        return;

                                    var $target = $(e.target);
                                    // Ignore input events
                                    if ($target.is('input'))
                                        return;

                                    if (clearTimer.timer)
                                        clearTimer();
                                    else {
                                        // Delay click event for 200ms and add a "isClick" flag
                                        clearTimer.timer = setTimeout(function () {
                                            clearTimer();
                                            $target.trigger($.Event('click', {isClick: true}));
                                        }, 300);
                                    }
                                });
                            }());
                        }
                    }

                    // "onBind" argument overrides "args.onBind"
                    var onBindCallback = onBind || args.onBind;
                    if (onBindCallback) {
                        var liNode = $liNode.get(0);
                        onBindCallback.call(liNode, data, i, liNode);
                    }
                    $ulNode.append($liNode);

                    liMap[id] = $liNode;
                    delete dataSource[i];
                    unfinished = true;
                });
            } while (unfinished);

            return $root;
        },

        /**
         * Preserved for components
         * @param {String} varName
         * @returns {String}
         */
        getInternal: function (varName) {
            if (typeof varName == 'string' && /^\w+$/.test(varName))
                return eval(varName);
        }
    };

    // For global template, args and padding
    $.flextree.global = {};

    // Directly append a tree to this container
    $.fn.tree = function () {
        var $tree = $.flextree.tree.apply(undefined, Array.prototype.slice.call(arguments));

        var $container = $(this);
        var $ulContainer = $container.treeChildren().parent();
        if ($ulContainer.length != 0)
            $container = $ulContainer;

        if ($container.is('ul')) {
            $tree.children().appendTo($container);
            $tree = $container;
        } else {
            if ($container.parent().is(selFlextree))
                $container.after($('<li/>').addClass(cssFlextree).append(
                    $tree.css('padding-left', $.flextree.global.padding || ulPadding)));
            else
                $container.append($tree);
        }
        return $tree;
    };

    $.fn.extend(function () {
        function $li(that) {
            var $this = $(that);
            return $this.is('li') ? $this : $this.parentsUntil(selFlextree, 'li');
        }

        return {
            treeParent: function () {
                return $li(this).parent().parent(selFlextree).prev();
            },

            treeParents: function () {
                return $li(this).parents('li' + selFlextree).prev();
            },

            treeChildren: function () {
                return $li(this).next().filter(selFlextree)
                    .children().children().not(selFlextree);
            },

            treeFind: function () {
                return $li(this).next().filter(selFlextree)
                    .find('ul' + selFlextree).children().not(selFlextree);
            },

            treeSiblings: function () {
                return $li(this).siblings().not(selFlextree);
            },

            treeNext: function () {
                var $nodes = $();
                $.each(this, function () {
                    $nodes = $nodes.add($(this).nextAll().not(selFlextree).first());
                });
                return $nodes;
            },

            treeNextAll: function () {
                return $li(this).nextAll().not(selFlextree);
            },

            treePrev: function () {
                var $nodes = $();
                $.each(this, function () {
                    $nodes = $nodes.add($(this).prevAll().not(selFlextree).first());
                });
                return $nodes;
            },

            treePrevAll: function () {
                return $li(this).prevAll().not(selFlextree);
            },

            treeNode: function () {
                return $li(this);
            },

            treeRoot: function () {
                var $root = $(this).parents('ul' + selFlextree);
                return $root.length == 0 ? $(this).filter('ul' + selFlextree) : $root.last();
            },

            treeAll: function () {
                return $(this).find('li:not(' + selFlextree + ')')
                    .filter('ul' + selFlextree + ' li:not(' + selFlextree + ')');
            },

            treeActivate: function () {
                $li(this).trigger(eventActivate);
                return this;
            },

            treeExpanded: function () {
                return $li(this).data(dataExpanded) == true;
            }
        };
    }());

    if (typeof module !== 'undefined' && module.exports)
        module.exports = $.flextree;
}(typeof module !== 'undefined' && module.exports ? require('jquery') : jQuery));
