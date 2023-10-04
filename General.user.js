// ==UserScript==
// @name         BoardGameArena: General
// @namespace    http://ebumna.net/
// @version      0.5
// @description  Misc utils for BoardGameArena
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*
// @icon         http://boardgamearena.com/theme/img/favicon/android-icon-512x512
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/BGA_Utils/main/General.user.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/BGA_Utils/main/General.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

 	// Enable for debugging
	const DEBUG = false;
	const logDebug = (...msgs) => {
		// eslint-disable-next-line no-console
		if (DEBUG) console.log('BGA_GEN> ', msgs);
	};

    document.head.appendChild(document.createElement('style')).innerHTML = `
#tournament_popup {
    background-color: gold;
    border-radius: 8px;
    color: #000;
    display: none;
    font-size: 20px;
    font-weight: 700;
    margin: 10px 10px 20px;
    padding: 8px;
    text-align: center
}

#arena_popup {
    background-color: royalblue;
    border-radius: 8px;
    color: #fff;
    display: none;
    font-size: 20px;
    font-weight: 700;
    margin: 10px 10px 20px;
    padding: 8px;
    text-align: center
}
`

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

    const tournament_popup = '<div id="tournament_popup" style="display:block"><div id="arena_near_end_text" class="roundedboxinner">🏆 This is a Tournament match 🏆</div></div>';
    const arena_popup = '<div id="arena_popup" style="display:block"><div id="arena_near_end_text" class="roundedboxinner">⚔️ This is an Arena match ⚔️</div></div>';

    const oRoot = document.body;
    const observer_menu = new MutationObserver(addGamesButton);
    observer_menu.observe(oRoot, config_stree);

    function addGamesButton() {
        logDebug('addGamesButton()');
        if (document.querySelector('#backToTables') === null) {
            if (/boardgamearena\.com\/\d+\//.test(document.baseURI) && document.querySelector('#upperrightmenu') !== null) {
                logDebug('addGamesButton() > 🎲 Table > topbar_content');
                observer_menu.disconnect();
                document.querySelector('#upperrightmenu').insertAdjacentHTML('afterbegin', '<div class="upperrightmenu_item"><a id="backToTables" class="bgabutton bgabutton_blue globalaction" href="/gameinprogress">🎲</a></div>');
            }
            else if (/boardgamearena\.com\/\d+\//.test(document.baseURI) == false && document.querySelector('.bga-menu-bar-items') !== null) {
                logDebug('addGamesButton() > 🚫 Table > no #refreshPlayersBtn > bga-menu-bar-items');
                observer_menu.disconnect();
                document.querySelector('.bga-menu-bar-items').firstChild.insertAdjacentHTML('afterend','<a id="backToTables" class="bga-menu-bar-items__menu-item bga-link truncate svelte-1duixkh" href="/gameinprogress">🎲 Tables  </a>');
            }
        }
        if (document.querySelector('#tournamentsList') === null) {
            if (/boardgamearena\.com\/\d+\//.test(document.baseURI) == false && document.querySelector('.bga-menu-bar-items') !== null) {
                observer_menu.disconnect();
                document.querySelector('.bga-menu-bar-items').firstChild.insertAdjacentHTML('afterend','<a id="tournamentsList" class="bga-menu-bar-items__menu-item bga-link truncate svelte-1duixkh" href="/tournamentlist">🏆 Tournaments  </a>');
            }
        }

        if (gameui.tournament_id !== null && document.querySelector('#arena_ending_soon') !== null) {
            document.querySelector('#arena_ending_soon').insertAdjacentHTML('beforebegin', tournament_popup);
        }
        if (document.body.classList.contains('arena_mode') && document.querySelector('#arena_ending_soon') !== null) {
            document.querySelector('#arena_ending_soon').insertAdjacentHTML('beforebegin', arena_popup);
        }
    }
})();
