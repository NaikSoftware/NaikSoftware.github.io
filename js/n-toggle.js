/*
 N-Toggle project
 This is a part of NaikSoftware.github.io
 
 @author Naik
 */
(function ($) {

    /**
     * @param states array with toggle states in format {text: string, active: boolean}
     */
    $.fn.nToggle = function (states) {
        var toggle = this;
        var count = states.length;
        var stateWidth = 100 / count;
        for (var i = 0; i < count; i++) {
            toggle.append(make(states[i], stateWidth));
        }
        
        return function() {
            return toggle.children('.active').text();
        };
    };

    function make(state, width) {
        var elem = $('<span class="toggle-elem">');
        elem.width(width + '%');
        elem.text(state.text);
        if (state.active) elem.addClass('active');
        elem.on('click', function () {
            elem.parent().children().removeClass('active');
            elem.addClass('active');
        });
        return elem;
    }

})(jQuery);
