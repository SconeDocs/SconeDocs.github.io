(function (document) {
    function clipboard_init() {
        var charts = document.querySelectorAll("div.codehilite"),
            arr = [],
            i, j, maxItem, pre, btn, el;

        // Make sure we are dealing with an array
        for(i = 0, maxItem = charts.length; i < maxItem; i++) arr.push(charts[i]);

        // Find the UML source element and get the text
        for (i = 0, maxItem = arr.length; i < maxItem; i++) {
            el = arr[i];
            pre = el.childNodes[0];

            pre.id = "hl_code" + i.toString();
            btn = document.createElement('button');
            btn.appendChild(document.createTextNode('copy'));
            btn.setAttribute("class", "btn");
            btn.setAttribute("data-clipboard-target", "#hl_code" + i.toString());
            el.insertBefore(btn, pre);
        }
        new Clipboard('.btn');
    };

    function onReady(fn) {
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            document.attachEvent('onreadystatechange', function() {
                if (document.readyState === 'interactive')
                    fn();
            });
        }
    }

    onReady(function(){
        clipboard_init();
    });
})(document);