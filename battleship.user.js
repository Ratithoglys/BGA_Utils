// ==UserScript==
// @name         BoardGameArena: Games: Battleship
// @namespace    https://ebumna.net/
// @version      0.1
// @description  BoardGameArena: Games: Battleship
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/battleship?table=*
// @icon         http://boardgamearena.com/theme/img/favicon/android-icon-512x512
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/BGA_Utils/main/battleship.user.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/BGA_Utils/main/battleship.user.js
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
.state_2 {
    color: navy;
    font-weight: bolder;
    font-size: xx-large
}
.state_2::after {
    content: "X"
}
`

})();
