(function ($) {
    'use strict';

    $(function () {
        $.flextree.global.padding = '2em';
        $.flextree.global.template = $('#template').text();
        var comments = [{
            id: '0',
            parent_id: null,
            postTime: '14:23',
            nickname: 'Taylor',
            content: 'College is the very amazing stage for students, they have gone through the hard time and finally come to their dream place.'
        }, {
            id: '1',
            parent_id: null,
            postTime: '14:23',
            nickname: 'Tim',
            content: 'In this beautiful age, students are young and full of energy, their color of youth should be red, which means active.'
        }, {
            id: '2',
            parent_id: null,
            postTime: '14:23',
            nickname: 'Black',
            content: 'For college students, their main energy should be put on study.'
        }, {
            id: '3',
            parent_id: '0',
            postTime: '14:23',
            nickname: 'Tom',
            reply_to: 'Taylor',
            content: 'For college students, their main energy should be put on study.'
        }, {
            id: '4',
            parent_id: '3',
            postTime: '14:23',
            nickname: 'Taylor',
            reply_to: 'Tom',
            content: 'It is the age of fighting, they need to learn more knowledge, so that they can make some preparation for their future.'
        }, {
            id: '5',
            parent_id: '2',
            postTime: '14:23',
            nickname: 'Boyce',
            reply_to: 'Black',
            content: 'What they learn will decide what kind of job they will do in the future.'
        }];
        $('#comments').tree(comments, function (data) {
            if (data.parent_id != null) {
                var $p = $(this).children('p');
                $p.html('<a href="##">@' + data.reply_to + '</a>' + $p.text());
                $(this).css('margin-top', '-2em');
            }
        });
    });
})(jQuery);
