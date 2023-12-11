// ==UserScript==
// @name         BoardGameArena: Games: Piraten kapern
// @namespace    https://ebumna.net/
// @version      0.1
// @description  BoardGameArena: Games: Piraten kapern
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/piratenkapern?table=*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/piratenkapern.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/piratenkapern.user.js
// @grant        none
// ==/UserScript==

// TODO : Mieu colorier les cases tirées

(function() {
    'use strict';

 	// Enable for debugging
	const DEBUG = false;
	const logDebug = (...msgs) => {
		// eslint-disable-next-line no-console
		if (DEBUG) console.log('BGA_GEN> ', msgs);
	};

    document.head.appendChild(document.createElement('style')).innerHTML = `
#btn_score {
    background-color: #C92727;
    border-color: #B20A0A;
    color: #FFF;
}
#btn_score:hover {
    background-color: #Cf4040;
}
`

})();
