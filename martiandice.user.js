// ==UserScript==
// @name         BoardGameArena: Games: Martian Dice
// @namespace    https://ebumna.net/
// @version      0.2
// @description  BoardGameArena: Games: Martian Dice
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/martiandice?table=*
// @icon         http://boardgamearena.com/theme/img/favicon/android-icon-512x512
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/martiandice.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/martiandice.user.js
// @grant        none
// ==/UserScript==

// TODO : Récupérer les différents dés en cours
// TODO : Algorithme de calcul optimal
// TODO : Calculer le max de points faisables sur le tour et le score associé

(function() {
    'use strict';

 	// Enable for debugging
	const DEBUG = false;
	const logDebug = (...msgs) => {
		// eslint-disable-next-line no-console
		if (DEBUG) console.log('BGA_GEN> ', msgs);
	};

    const config_childs = {
        childList: true,
        attributes: false,
        characterData: false,
        subtree: false
    };
    const config_att = {
        childList: false,
        attributes: true,
        characterData: false,
        subtree: false
    };

    const observer_popups_create = new MutationObserver(whenPopup);
    observer_popups_create.observe(document.body, config_childs);

    function giveMoveSuggestion() {
        // De coté
        // nombre de Tanks
        // nombre de Lasers
        // nombre d'Humains
        // nombre de Vaches
        // nombre de Poulets

        // En jeu
        // nombre de Lasers
        // nombre d'Humains
        // nombre de Vaches
        // nombre de Poulets

        calculateWinningStrategy()
        resursiveDescription()
    }

    function calculateWinningStrategy() {
    }

    function recursiveDescription() {
    }

    function whenPopup() {
        if (document.querySelector('#dijit__MasterTooltip_0') != null) {
            observer_popups_create.disconnect();
            document.querySelector('#dijit__MasterTooltip_0').innerHTML = null;
        }
    }

})();
