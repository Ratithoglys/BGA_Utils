// ==UserScript==
// @name         BoardGameArena: Games: 6 nimmt!
// @namespace    https://ebumna.net/
// @version      0.2
// @description  BoardGameArena: Games: 6 nimmt!
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/sechsnimmt?table=*
// @icon         http://boardgamearena.com/theme/img/favicon/android-icon-512x512
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/BGA_Utils/main/sechsnimmt.user.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/BGA_Utils/main/sechsnimmt.user.js
// @grant        none
// ==/UserScript==

// TODO : Mise en évidence de la règle

(function() {
    'use strict';

 	// Enable for debugging
	const DEBUG = false;
	const logDebug = (...msgs) => {
		// eslint-disable-next-line no-console
		if (DEBUG) console.log('BGA_GEN> ', msgs);
	};

    const config_childs = {
        childList: true,
        attributes: false,
        characterData: false,
        subtree: false
    };

    const observer_banner = new MutationObserver(addOptionBanner);
    observer_banner.observe(document.body, config_childs);

    function addOptionBanner() {
        if (document.querySelector('#pagemaintitletext') != null) {
            observer_banner.disconnect();

            let game_mode = document.querySelector('#footer_option_value_101').innerText;

            if (/Professional/.test(game_mode)) {
                document.querySelector('#active_player_statusbar').insertAdjacentHTML('beforebegin','⬅️➡️');
            }
            else {
                document.querySelector('#active_player_statusbar').insertAdjacentHTML('beforebegin','➡️');
            }
        }
    }

})();
