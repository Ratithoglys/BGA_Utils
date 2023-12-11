// ==UserScript==
// @name         BoardGameArena: Games: Battleship
// @namespace    https://ebumna.net/
// @version      0.2
// @description  BoardGameArena: Games: Battleship
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/battleship?table=*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/battleship.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/battleship.user.js
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
