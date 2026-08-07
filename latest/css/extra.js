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

    function bind_tooltip_layer() {
        var tooltip = document.createElement("div"),
            activeElement = null,
            margin = 16,
            gap = 10,
            arrowInset = 12;

        tooltip.className = "mdx-tooltip";
        document.body.appendChild(tooltip);

        function hideTooltip() {
            activeElement = null;
            tooltip.classList.remove("mdx-tooltip--active");
        }

        function showTooltip(element) {
            var rect, tooltipRect, viewportWidth, viewportHeight, left, top, arrowLeft;

            if (!element) {
                return;
            }

            activeElement = element;
            tooltip.textContent = element.getAttribute("data-tooltip") || "";
            tooltip.classList.remove("mdx-tooltip--active");
            tooltip.style.left = "0px";
            tooltip.style.top = "0px";
            tooltip.style.setProperty("--mdx-tooltip-arrow-left", "50%");

            rect = element.getBoundingClientRect();
            viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            viewportHeight = window.innerHeight || document.documentElement.clientHeight;

            tooltip.classList.add("mdx-tooltip--active");
            tooltipRect = tooltip.getBoundingClientRect();
            tooltip.setAttribute(
                "data-placement",
                viewportHeight - rect.bottom >= tooltipRect.height + gap || viewportHeight - rect.bottom >= rect.top
                    ? "bottom"
                    : "top"
            );

            left = Math.max(
                margin,
                Math.min(
                    rect.left + rect.width / 2 - tooltipRect.width / 2,
                    viewportWidth - tooltipRect.width - margin
                )
            );

            top = tooltip.getAttribute("data-placement") === "bottom"
                ? rect.bottom + gap
                : rect.top - tooltipRect.height - gap;
            top = Math.max(margin, Math.min(top, viewportHeight - tooltipRect.height - margin));
            arrowLeft = Math.max(
                arrowInset,
                Math.min(rect.left + rect.width / 2 - left, tooltipRect.width - arrowInset)
            );

            tooltip.style.left = left + "px";
            tooltip.style.top = top + "px";
            tooltip.style.setProperty("--mdx-tooltip-arrow-left", arrowLeft + "px");
        }

        document.addEventListener("mouseenter", function (event) {
            showTooltip(event.target.closest("[data-tooltip]"));
        }, true);
        document.addEventListener("focusin", function (event) {
            showTooltip(event.target.closest("[data-tooltip]"));
        });
        document.addEventListener("mouseleave", function (event) {
            if (event.target.closest("[data-tooltip]")) {
                hideTooltip();
            }
        }, true);
        document.addEventListener("focusout", function (event) {
            if (event.target.closest("[data-tooltip]")) {
                hideTooltip();
            }
        });
        window.addEventListener("scroll", function () {
            showTooltip(activeElement);
        }, { passive: true });
        window.addEventListener("resize", function () {
            showTooltip(activeElement);
        });

        if (typeof document$ !== "undefined" && document$.subscribe) {
            document$.subscribe(hideTooltip);
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
        bind_tooltip_layer();
    });
})(document);
