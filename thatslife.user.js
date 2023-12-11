// ==UserScript==
// @name         BoardGameArena: Games: That's life
// @namespace    https://ebumna.net/
// @version      0.1
// @description  BoardGameArena: Games: That's life
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/thatslife?table=*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/thatslife.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/thatslife.user.js
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
.token {
    filter: drop-shadow(-1px -1px 1px white) drop-shadow(1px 1px 1px white) drop-shadow(-1px 1px 0 black) drop-shadow(1px -1px 0 black) !important;
}
.token_select {
    filter: drop-shadow(-2px -2px 1px black) drop-shadow(2px 2px 1px black) drop-shadow(-2px 2px 0 black) drop-shadow(2px -2px 0 black) !important;
}
`

})();
