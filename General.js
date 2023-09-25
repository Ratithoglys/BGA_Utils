// ==UserScript==
// @name         Ebumna : BoardGameArena, General
// @namespace    http://ebumna.net/
// @version      0.2
// @description  Misc utils for BoardGameArena
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*
// @icon         http://en.studio.boardgamearena.com/favicon.ico
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/BGA_Utils/main/Highlight.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/BGA_Utils/main/Highlight.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const config_stree = {
        childList: true,
        attributes: false,
        characterData: false,
        subtree: true
    };
    const config_streefull = {
        childList: true,
        attributes: true,
        characterData: false,
        subtree: true
    };

    const oRoot = document.body;
    const observer_menu = new MutationObserver(addGamesButton);
    observer_menu.observe(oRoot, config_stree);

    function addGamesButton() {
        if (document.querySelector('#backToTables') === null) {
            if (/boardgamearena\.com\/\d+\//.test(document.baseURI) && document.querySelector('#upperrightmenu') !== null && document.querySelector('#gotonexttable_wrap') !== null) {
                observer_menu.disconnect();
                document.querySelector('#upperrightmenu').insertAdjacentHTML('afterbegin', '<div class="upperrightmenu_item"><a id="backToTables" class="globalaction icon20" href="/gameinprogress">🎲</a></div>');
                document.querySelector('#gotonexttable_wrap').firstElementChild.insertAdjacentHTML('afterend', '&nbsp;<a id="go_to_next_table_active_player" class="bgabutton bgabutton_blue" href="/gameinprogress" style="margin-left: 10px;display: inline;">🎲</a>&nbsp;')
            }
            else if (/boardgamearena\.com\/\d+\//.test(document.baseURI) == false && document.querySelector('.bga-menu-bar-items') !== null) {
                observer_menu.disconnect();
                document.querySelector('.bga-menu-bar-items').firstChild.insertAdjacentHTML('afterend','<a id="backToTables" class="bga-menu-bar-items__menu-item bga-link truncate svelte-1duixkh" href="/gameinprogress">🎲 Tables  </a>');
            }
        }
    }
})();
