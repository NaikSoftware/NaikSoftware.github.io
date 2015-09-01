$(function () {

    var navbar = $('#navbar');
    var body = $('body');

    $(window).resize(adjustScreenSize($(window).width()));

    function adjustScreenSize(width) {
        if (width < 800) {
            navbar.removeClass('navbar-fixed-top');
            body.css('padding-top', '0px');
        } else {
            navbar.addClass('navbar-fixed-top');
            body.css('padding-top', '100px');
        }
    }
});


