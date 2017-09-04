(function() {
    'use strict';

    var iframe = document.querySelector('iframe.interactive');
    var mediaQuery = window.matchMedia('(min-width: 63.9385em)');
    var siteUrl = document.documentElement.dataset['siteUrl'];
    var targetOrigin = document.documentElement.dataset['editorUrl'];

    /* If there is no `iframe`, or if this is a JS example,
    simply return */
    if (!iframe || iframe.classList.contains('interactive-js')) {
        return;
    }

    /**
     * A simple wrapper function for the `postMessage`s sent
     * to the interactive editor iframe
     * @param {Object} message - The message object sent to the interactive editor
     */
    function postToEditor(message) {
        iframe.contentWindow.postMessage(message, targetOrigin);
    }

    /**
     * Posts back the current site URL.
     * @param {Object} event - The event Object received from postMessage
     */
    function postSiteUrl(event) {
        /* only post the site url if the correct property
        exists on the message object, and its value is true */
        if (event.data.siteUrl) {
            postToEditor({ siteUrl: siteUrl });
        }
    }

    /* As the user sizes the browser or tilts their device,
    listen for mediaQuery events and communicate the new
    viewport state to the interactive editor */
    mediaQuery.addListener(function(event) {
        if (event.matches) {
            postToEditor({ smallViewport: false });
        } else {
            postToEditor({ smallViewport: true });
        }
    });

    window.onload = function() {
        // if the mediaQuery does not match on load
        if (!mediaQuery.matches) {
            // add the class `small-desktop-and-below`
            postToEditor({ smallViewport: true });
        }

        // add event listener for postMessages from the interactive editor
        window.addEventListener('message', postSiteUrl, false);
    };
})();
