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
