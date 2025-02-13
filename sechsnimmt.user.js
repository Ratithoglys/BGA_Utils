// ==UserScript==
// @name         BoardGameArena: Games: 6 nimmt!
// @namespace    https://ebumna.net/
// @version      0.5
// @description  BoardGameArena: Games: 6 nimmt!
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/sechsnimmt?table=*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/sechsnimmt.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/sechsnimmt.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /* Mise en évidence de la règle (normal/pro) */
    function addOptionBanner() {

        const gameModeElement = document.querySelector('#footer_option_value_101').innerText;
        const proBannerElement = document.querySelector('div#game_play_area div.whiteblock');

        if (!gameModeElement) {
            return; // Le mode de jeu n'est pas encore disponible
        }

        if (/Enabled/.test(gameModeElement)) {
            document.querySelector('#active_player_statusbar').insertAdjacentHTML('beforebegin','➡️🃏🃏🃏⬅️');
        }
        else {
            document.querySelector('#active_player_statusbar').insertAdjacentHTML('beforebegin','🃏🃏🃏⬅️');
        }

        if (proBannerElement && proBannerElement.innerText === 'Professional variant') {
            proBannerElement.style.backgroundColor = 'yellow';
        }
    }

    // Attendre que l'élément "page_title" soit présent avant de démarrer le script
    const waitForPageTitle = setInterval(() => {
        const pageTitle = document.querySelector('#pagemaintitletext');
        if (pageTitle) {
            clearInterval(waitForPageTitle);
            addOptionBanner();
        }
    }, 500);

})();
