window.centovacast = window.centovacast || {};
window.centovacast.options = window.centovacast.options || {};
window.centovacast.loader = window.centovacast.loader || {
    attempts: 0,
    external_jquery: false,
    loaded: false,
    ready: false,
    widget_definitions: {},
    url: "",
    load_script: function (url) {
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", url);
        document.getElementsByTagName("head")[0].appendChild(script);
    },
    load_widget: function (widgetName) {
        var widget = this.widget_definitions[widgetName];
        if (widget.ref === null) {
            widget.ref = widget.define(jQuery);
        }
    },
    jq_get_jsonp: function (url, data, callback) {
        return jQuery.ajax({
            type: "GET",
            url: url,
            data: data,
            success: callback,
            dataType: "json"
        });
    },
    jq_ready: function () {
        this.ready = true;
        for (var widgetName in this.widget_definitions) {
            var widget = this.widget_definitions[widgetName];
            if (typeof widget.init === "function") {
                widget.init(jQuery);
            }
        }
    },
    jq_loaded: function () {
        if (!this.external_jquery) {
            jQuery.noConflict();
        }
        jQuery.getJSONP = this.jq_get_jsonp.bind(this);
        for (var widgetName in this.widget_definitions) {
            this.load_widget(widgetName);
        }
        this.loaded = true;
        var loader = this;
        jQuery(document).ready(function () {
            loader.jq_ready();
        });
    },
    wait: function () {
        setTimeout(function () {
            window.centovacast.loader.check();
        }, 100);
    },
    check: function () {
        if (typeof jQuery === "undefined") {
            this.wait();
            this.attempts++;
        } else {
            this.jq_loaded();
        }
    },
    init: function () {
        var scripts = document.getElementsByTagName("script");
        var currentScript = scripts[scripts.length - 1];
        var src = currentScript.getAttribute.length !== undefined ? currentScript.getAttribute("src") : currentScript.getAttribute("src", 2);
        if (!src.match(/^https?:\/\//i)) {
            src = window.location.href;
        }
        this.url = src.replace(/(\.(?:[a-z]{2,}|[0-9]+)(:[0-9]+)?\/).*$/i, "$1");
        this.external_jquery = typeof jQuery !== "undefined";
        if (!this.external_jquery) {
            this.load_script(this.url + "system/jquery.min.js");
        }
        this.check();
    },
    add: function (widgetName, initCallback, defineCallback) {
        if (!this.widget_definitions[widgetName]) {
            this.widget_definitions[widgetName] = {
                define: defineCallback,
                init: initCallback,
                ref: null
            };
        }
        if (this.loaded) {
            this.load_widget(widgetName);
        }
        if (this.ready && typeof initCallback === "function") {
            initCallback(jQuery);
        }
    }
};
window.centovacast.loader.init();

window.centovacast.loader.add("streaminfo", function ($) {
    $.extend(window.centovacast.streaminfo.settings, window.centovacast.options.streaminfo);
    if (!window.centovacast.streaminfo.settings.manual) {
        window.centovacast.streaminfo.run();
    }
}, function ($) {
    return {
        settings: {
            poll_limit: 60,
            poll_frequency: 60000
        },
        state: {},
        registry: {},
        check_username: function (username) {
            if (!this.registry[username]) {
                return "";
            }
            return username;
        },
        get_streaminfo_element: function (username, elementId) {
            return $("#" + this.registry[username].id[elementId]);
        },
        _handle_json: function (data) {
            if (!data) return;

            const streamData = data.now_playing;
            const listenersData = data.listeners;

            const username = this.check_username(data.station.id);
            if (!username.length) return;

            if (data.type === "error") {
                const errorMsg = data.error || "No JSON object";
                this.get_streaminfo_element(username, "song").html('<span title="' + errorMsg + '">Unavailable</span>');
                if (typeof this.settings.on_error_callback === "function") {
                    this.settings.on_error_callback(errorMsg);
                }
            } else {
                this.state = streamData;
                if (typeof this.settings.before_change_callback === "function") {
                    this.settings.before_change_callback(data);
                }

                // Update song information
                this.get_streaminfo_element(username, "song").html(streamData.song.text);
                this.get_streaminfo_element(username, "artist").html(streamData.song.artist);
                this.get_streaminfo_element(username, "title").html(streamData.song.title);
                this.get_streaminfo_element(username, "album").html(streamData.song.album);
                this.get_streaminfo_element(username, "art").attr("src", streamData.song.art);

                // Update listener information
                this.get_streaminfo_element(username, "listeners_current").html(listenersData.current);
                this.get_streaminfo_element(username, "listeners_total").html(listenersData.total);
                this.get_streaminfo_element(username, "listeners_unique").html(listenersData.unique);

                if (typeof this.settings.after_change_callback === "function") {
                    this.settings.after_change_callback(data);
                }
            }
        },
        handle_json: function (data) {
            window.centovacast.streaminfo._handle_json(data);
        },
        poll: function (username) {
            const url = "https://station.raptureradio.cc/api/nowplaying/" + username;
            const data = {};
            $.getJSONP(url, data, this.handle_json.bind(this));
        },
        _poll_all: function () {
            for (let username in this.registry) {
                if (typeof username === "string") {
                    this.poll(username);
                }
            }
            if (this.settings.poll_limit === 0 || this.pollcount++ < this.settings.poll_limit) {
                setTimeout(this.poll_all.bind(this), this.settings.poll_frequency);
            }
        },
        poll_all: function () {
            window.centovacast.streaminfo._poll_all();
        },
        register: function (elementId, username, charset, mountpoint) {
            if (!this.registry[username]) {
                this.registry[username] = {
                    charset: charset,
                    mountpoint: mountpoint,
                    current_song: "",
                    id: {}
                };
            }
            const match = elementId.match(/^cc_strinfo_([a-z]+)_/);
            if (match) {
                this.registry[username].id[match[1]] = elementId;
            }
        },
        load: function () {
            const elementId = $(this).attr("id");
            if (typeof elementId !== "string") return;

            let username = elementId.replace(/^cc_strinfo_[a-z]+_/, "");
            let charset = "", mountpoint = "";
            const charsetMatch = username.match(/_cs-([A-Za-z0-9\-]+)$/);
            if (charsetMatch) {
                charset = charsetMatch[1];
                username = username.replace(charsetMatch[0], "");
            }
            const mountpointMatch = username.match(/_mp-([A-Za-z0-9\-]+)$/);
            if (mountpointMatch) {
                mountpoint = mountpointMatch[1];
                username = username.replace(mountpointMatch[0], "");
            }
            window.centovacast.streaminfo.register(elementId, username, charset, mountpoint);
        },
        run: function () {
            $(".cc_streaminfo").each(window.centovacast.streaminfo.load);
            window.centovacast.streaminfo.poll_all();
        }
    };
});
