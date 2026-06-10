// ==UserScript==
// @name         BoardGameArena: Games: Fromage
// @namespace    https://ebumna.net/
// @version      0.1
// @description  BoardGameArena: Games: Fromage
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/fromage?table=*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/fromage.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/fromage.user.js
// @grant        none
// ==/UserScript==

// TODO : Mieux colorier les cases tirées

(function() {
    'use strict';

    document.head.appendChild(document.createElement('style')).innerHTML = `
.selectable {
    outline: 3px dashed #ff0000 !important;
}
`
})();
