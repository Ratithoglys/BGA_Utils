// ==UserScript==
// @name         BoardGameArena: Games: Roll to the Top
// @namespace    https://ebumna.net/
// @version      0.2
// @description  BoardGameArena: Games: Roll to the Top
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/rolltothetopjourneys?table=*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/rolltothetopjourneys.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/rolltothetopjourneys.user.js
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
.is_used {
    opacity: .2;
}
`

})();
