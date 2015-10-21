$(function () {
    
    var states = [{text: "0", active: true}, {text: "*"}, {text: "1"}];
    
    var state = $('#func-val').nToggle(states);
    
    $('#btn_get_state').click(function () {
        alert(state());
    });
    
});

