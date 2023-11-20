// ==UserScript==
// @name         BoardGameArena: Games: Roll to the Top
// @namespace    https://ebumna.net/
// @version      0.1
// @description  BoardGameArena: Games: Roll to the Top
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/rolltothetopjourneys?table=*
// @icon         http://boardgamearena.com/theme/img/favicon/android-icon-512x512
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/BGA_Utils/main/rolltothetopjourneys.user.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/BGA_Utils/main/rolltothetopjourneys.user.js
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
