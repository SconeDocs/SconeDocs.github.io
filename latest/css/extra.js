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

    function version_selector_init() {
        document.addEventListener("click", function (event) {
            var link = event.target.closest(".md-version__link"),
                selector,
                current;

            if (!link) {
                return;
            }

            selector = link.closest(".md-version");
            if (!selector) {
                return;
            }

            current = selector.querySelector(".md-version__current");
            if (!current) {
                return;
            }

            if (link.textContent.trim() !== current.textContent.trim()) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
        });
    }

    function move_version_selector_to_active_header_topic() {
        var selector = document.querySelector(".md-version"),
            title = document.querySelector("[data-md-component='header-title']"),
            topics,
            activeTopic;

        if (!selector || !title) {
            return;
        }

        topics = title.querySelectorAll(".md-header__topic");
        if (topics.length < 2) {
            return;
        }

        activeTopic = title.getAttribute("data-md-state") === "active"
            ? topics[1]
            : topics[0];

        if (selector.parentNode !== activeTopic) {
            activeTopic.appendChild(selector);
        }
    }

    function keep_version_selector_visible_on_scroll() {
        move_version_selector_to_active_header_topic();
        if (!window.addEventListener) {
            return;
        }

        window.addEventListener("scroll", move_version_selector_to_active_header_topic, { passive: true });
        window.addEventListener("resize", move_version_selector_to_active_header_topic);
    }

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
        version_selector_init();
        keep_version_selector_visible_on_scroll();
    });
})(document);
