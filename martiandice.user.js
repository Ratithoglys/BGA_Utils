// ==UserScript==
// @name         BoardGameArena: Games: Martian Dice
// @namespace    https://ebumna.net/
// @version      0.3
// @description  BoardGameArena: Games: Martian Dice
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/martiandice?table=*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/martiandice.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/martiandice.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ID de l'infobulle à supprimer
    const TOOLTIP_ID = '#dijit__MasterTooltip_0';

    function clearTooltip() {
        const tooltip = document.querySelector(TOOLTIP_ID);
        if (tooltip) {
            tooltip.innerHTML = null;
        }
    }

    // Vérifier la présence de l'infobulle toutes les 500ms
    const tooltipCheckInterval = setInterval(() => {
        if (document.querySelector(TOOLTIP_ID)) {
          clearTooltip()
          clearInterval(tooltipCheckInterval);
        }
    }, 500);
})();
