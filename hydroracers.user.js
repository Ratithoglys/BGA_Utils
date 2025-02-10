// ==UserScript==
// @name         BoardGameArena: Games: Hydroracers
// @namespace    https://ebumna.net/
// @version      0.1
// @description  BoardGameArena: Games: Hydroracers
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/hydroracers?table=*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/hydroracers.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/hydroracers.user.js
// @grant        none
// ==/UserScript==

// TODO : Mieu colorier les cases tirées

(function() {
    'use strict';

    function setRaceTracker() {
        document.querySelector('div#race_count span#round_counter').style.fontSize = '2em';
    }

    // Attendre que l'élément "page_title" soit présent avant de démarrer le script
    const waitForPageTitle = setInterval(() => {
        const pageBoard = document.querySelector('#race_count');
        if (pageBoard) {
            clearInterval(waitForPageTitle);
            setRaceTracker();
        }
    }, 500);

})();
