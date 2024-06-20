// ==UserScript==
// @name         BoardGameArena: Games: Metro
// @namespace    https://ebumna.net/
// @version      0.1
// @description  BoardGameArena: Games: Metro
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/metro?table=*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/metro.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/metro.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

 	// Enable for debugging
	const DEBUG = true;
	const logDebug = (...msgs) => {
		// eslint-disable-next-line no-console
		if (DEBUG) console.log('BGA_GEN> ', msgs);
	};

    const config_stree = {
        childList: true,
        attributes: false,
        characterData: false,
        subtree: true
    };
    const config_char = {
        childList: false,
        attributes: false,
        characterData: true,
        subtree: false
    };

    const observer_laps = new MutationObserver(colorWagons);
    const observer_mainPanel = new MutationObserver(manageScript);
    observer_mainPanel.observe(document.body, config_stree);

    /* Récupération de la boite du joueur */
    function manageScript() {
        logDebug('manageScript');
        if (document.querySelector('#main_board') != null) {
            colorWagons();
            observer_laps.observe(document.querySelector('#main_board'), config_stree);
            observer_mainPanel.disconnect();
        }
    }

    /* Popup pour le dernier tour */
    function colorWagons() {
        logDebug('colorWagons');

        document.querySelectorAll(".mtr_wagon").forEach(w => {
            if (w.style.outlineWidth == '0px' && w.style.filter == '') {
                w.style.filter = 'grayscale(75%)';
            }
        });
    }

})();
