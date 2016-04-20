(function ($) {
    'use strict';

    $(function () {
        var categories = [{
            id: 'md',
            parentId: null,
            categoryName: 'Mobile Development'
        }, {
            id: 'wd',
            parentId: null,
            categoryName: 'Web Development'
        }, {
            id: 'bd',
            parentId: null,
            categoryName: 'Backend Development'
        }];
        var template = '<li data-id="{id}"><a href="##">{categoryName}</a><span class="fa ft-ajax"></span></li>';
        var args = {collapsible: true};
        $('#navigator').tree(categories, template, args, function () {
            $(this).treeAjax({url: 'assets/i/' + $(this).data('id') + '.json'})
                .done(function (node, data) {
                    $(node).tree(data).addClass('sub-navigator');
                });
        });

        $.flextree.global = {
            padding: '0',
            template: '<li class="item"><div>{categoryName}</div></li>',
            args: {
                onBind: function (data) {
                    var self = this;
                    $.each(data.items, function () {
                        $(self).append('<a href="##">' + this + '</a>');
                    });
                }
            }
        };
    });
})(jQuery);
