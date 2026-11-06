// ==UserScript==
// @name         BoardGameArena: Games: Monster Factory
// @namespace    https://ebumna.net/
// @version      0.3
// @description  BoardGameArena: Games: Monster Factory
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/monsterfactory?table=*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/monsterfactory.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/monsterfactory.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.head.appendChild(document.createElement('style')).innerHTML = `
.scrollerClass {
    height: 600px;
    min-height: 200px;
    min-width: 200px;
    resize: both;
    overflow-y: auto;
    overflow-x: hidden;
}
`
})();
