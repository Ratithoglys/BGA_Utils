// ==UserScript==
// @name         BoardGameArena: Games: 6 nimmt!
// @namespace    https://ebumna.net/
// @version      0.3
// @description  BoardGameArena: Games: 6 nimmt!
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/sechsnimmt?table=*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/sechsnimmt.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/sechsnimmt.user.js
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

    const config_childs = {
        childList: true,
        attributes: false,
        characterData: false,
        subtree: false
    };

    const observer_banner = new MutationObserver(addOptionBanner);
    observer_banner.observe(document.body, config_childs);

    /* Mise en évidence de la règle (normal/pro) */
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
