// ==UserScript==
// @name         BoardGameArena: Games: Vault: A Den of Thieves
// @namespace    https://ebumna.net/
// @version      0.2
// @description  BoardGameArena: Games: Vault: A Den of Thieves
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/vault?table=*
// @match        https://boardgamearena.com/*/vaultdenofthieves?table=*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/vaultdenofthieves.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/vaultdenofthieves.user.js
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
#passButton {
    background-color: #C92727;
    border-color: #B20A0A;
}
#passButton:hover {
    background-color: #Cf4040;
}
`

})();
