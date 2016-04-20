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
