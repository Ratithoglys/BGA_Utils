// ==UserScript==
// @name         BoardGameArena: Games: My Shelfie
// @namespace    https://ebumna.net/
// @version      0.1
// @description  BoardGameArena: Games: My Shelfie
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/myshelfie?table=*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/myshelfie.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/myshelfie.user.js
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
#board .item-tile.active:after {
    border: 3px solid #f00;
}
#board .item-tile.unactive:after {
    border: 3px solid #000;
}
`

})();
