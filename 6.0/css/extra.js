(function (document) {
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

    function bind_version_selector_refresh() {
        move_version_selector_to_active_header_topic();
        if (!window.addEventListener) {
            return;
        }

        window.addEventListener("scroll", move_version_selector_to_active_header_topic, { passive: true });
        window.addEventListener("resize", move_version_selector_to_active_header_topic);

        if (typeof document$ !== "undefined" && document$.subscribe) {
            document$.subscribe(move_version_selector_to_active_header_topic);
        }
    }

    function onReady(fn) {
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            document.attachEvent("onreadystatechange", function() {
                if (document.readyState === "interactive") {
                    fn();
                }
            });
        }
    }

    onReady(function () {
        version_selector_init();
        bind_version_selector_refresh();
    });
})(document);
