$(function () {

    var text = $("#input_text");
    var svg = $("#svg_path");

    $("#btn_process").click(function () {
        svg.attr('d', text.val());
    });
});
