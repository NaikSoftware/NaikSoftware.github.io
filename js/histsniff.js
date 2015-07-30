$(function () {

    var MAX_DIFF = 400;//ms

    var hosts = [
        'yandex.com', 'habrahabr.ru', 'lol.com', 'johncms.com', 'basic.com', 'annimon.com', 'keddr.ru',
        'java.com', 'mail.ru', 'android.com'
    ];

    var processed = 0;

    var result = [];
    monitor();
    for (var i = 0; i < hosts.length; i++) {
        wrapper(i);
    }

    function wrapper(ind) {
        var start = new Date();
        var img = new Image();
        img.src = 'http://' + hosts[ind] + '/favicon.ico';
        img.onload = function () {
            try {
                result.push(saveResult(hosts[ind], start, new Date()));
                processed++;
                console.log(processed);
            } catch (e) {
                processed++;
                console.log(processed + ' in catch');
            }
        };
    }

    function saveResult(host, start, end) {
        var diff = end - start;
        return {
            host: host,
            start: start,
            end: end,
            diff: diff
        };
    }

    function monitor() {
        console.log("monitor " + processed);
        if (processed < hosts.length) {
            setTimeout(monitor, 1000);
            return;
        }
        
        var msg = $('<ul>');

        for (var i = 0; i < result.length; i++) {
            var visited = (result[i].diff < MAX_DIFF ? true : false);
            var li = $('<li>').append(result[i].host + ' : ' + (visited ? 'visited' : 'unvisited') + '</li>');
            if (visited) li.addClass('text-primary');
            msg.append(li);
        }
        
        $('#panel_body').append(msg);
    }
    
});