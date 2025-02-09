// ==UserScript==
// @name         BoardGameArena: Games: Railroad Ink
// @namespace    https://ebumna.net/
// @version      0.1
// @description  BoardGameArena: Games: Railroad Ink
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/railroadink?table=*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/railroadink.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/railroadink.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Palette (lightness 75-90%, saturation 55-75%)
    const colorMap = [
        '#FF8888', // 1 - Rouge pastel
        '#FFB574', // 2 - Orange doux
        '#FFE57A', // 3 - Or clair
        '#85D685', // 4 - Vert menthe
        '#5EDEE0', // 5 - Cyan clair
        '#8AA9FF', // 6 - Bleu ciel
        '#C788DD'  // 7 - Lilas pastel
    ];

    // Fonction principale pour appliquer les couleurs
    function applyColors() {
        const elements = document.querySelectorAll('div.round-number');
        elements.forEach(div => {
            const value = parseInt(div.textContent.trim());
            if (!isNaN(value) && value >= 1 && value <= 7) {
                div.style.backgroundColor = colorMap[value - 1];
                div.style.color = '#000000';
                div.style.padding = '2px 5px';
                div.style.borderRadius = '3px';
                div.style.display = 'inline-block';
            }
        });
    }

    // Observer pour les éléments ajoutés dynamiquement
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                applyColors();
            }
        });
    });

    // Configuration de l'Observer
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // Exécution initiale
    applyColors();
})();
