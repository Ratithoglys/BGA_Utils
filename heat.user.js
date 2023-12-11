// ==UserScript==
// @name         BoardGameArena: Games: Heat
// @namespace    https://ebumna.net/
// @version      0.3
// @description  BoardGameArena: Games: Heat
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/heat?table=*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/heat.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/heat.user.js
// @grant        none
// ==/UserScript==

// TODO : Popup pour le dernier tour

(function() {
    'use strict';

 	// Enable for debugging
	const DEBUG = false;
	const logDebug = (...msgs) => {
		// eslint-disable-next-line no-console
		if (DEBUG) console.log('BGA_GEN> ', msgs);
	};

    document.head.appendChild(document.createElement('style')).innerHTML = `
#last_lap_popup {
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
`
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

    const observer_laps = new MutationObserver(alertLap);
    const observer_mainPanel = new MutationObserver(manageScript);
    observer_mainPanel.observe(document.body, config_stree);

    const last_lap_popup = '<div id="last_lap_popup" style="display:block"><div class="roundedboxinner">🏁 This is the last lap 🏁</div> <div style="font-size: 12px; font-weight: normal;">(no slipstream after cross line)</div></div>';

    /* Récupération de la boite du joueur */
    function manageScript() {
        logDebug('manageScript');
        if (document.querySelector('#page-title') != null && document.querySelector('#page-title') != null) {
            alertLap();
            observer_laps.observe(document.querySelector('#lap-counter-5'), config_char);
            observer_mainPanel.disconnect();
        }
    }

    /* Popup pour le dernier tour */
    function alertLap() {
        logDebug('alertLap');
        let clap = document.querySelector('.current-player-board span[id^=lap-counter-').innerText;
        let tlap = document.querySelector('.nbr-laps').innerText;

        if (clap == tlap && document.querySelector('#last_lap_popup') == null) {
            document.querySelector('#page-title').insertAdjacentHTML('beforebegin', last_lap_popup);
        }
    }

})();
