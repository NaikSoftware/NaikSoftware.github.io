/*
N-Toggle project
This is a part of NaikSoftware.github.io

@author Naik
*/
(function($) {

	/**
	* @param states array with toggle states
	*/
	$.fn.nToggle = function(states) {
		var count = states.length;
		var stateWidth = this.css('width') / count;
		for(var i = 0; i < count; i++) {
			this.append(make(states[i], stateWidth));
		}
	}
	
	function make(state, width) {
		var elem = $('<div class="toggle-elem">');
		elem.css('width', width);
		elem.text(state.text);
		if (state.active) elem.addClass('active-ntoggle');
		elem.on('click', function() {
			elem.parent().removeClass('active-toggle');
			elem.addClass('active-ntoggle');
		});
		return elem;
	}
	
})(jQuery);
