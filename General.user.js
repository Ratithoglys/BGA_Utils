// ==UserScript==
// @name         Ebumna : BoardGameArena, General
// @namespace    http://ebumna.net/
// @version      0.3
// @description  Misc utils for BoardGameArena
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*
// @icon         http://en.studio.boardgamearena.com/favicon.ico
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/BGA_Utils/main/General.user.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/BGA_Utils/main/General.user.js
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
            if (/boardgamearena\.com\/\d+\//.test(document.baseURI) && document.querySelector('#upperrightmenu') !== null) {
                observer_menu.disconnect();
                document.querySelector('#upperrightmenu').insertAdjacentHTML('afterbegin', '<div class="upperrightmenu_item"><a id="backToTables" class="bgabutton bgabutton_blue globalaction" href="/gameinprogress">🎲</a></div>');
            }
            else if (/boardgamearena\.com\/\d+\//.test(document.baseURI) == false && document.querySelector('.bga-menu-bar-items') !== null) {
                observer_menu.disconnect();
                document.querySelector('.bga-menu-bar-items').firstChild.insertAdjacentHTML('afterend','<a id="backToTables" class="bga-menu-bar-items__menu-item bga-link truncate svelte-1duixkh" href="/gameinprogress">🎲 Tables  </a>');
            }

        }
    }
})();
