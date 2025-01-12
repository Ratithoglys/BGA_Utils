// ==UserScript==
// @name         BoardGameArena: Games: Yathzee
// @namespace    https://ebumna.net/
// @version      0.1
// @description  BoardGameArena: Games: Yatzee
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/yatzy?table=*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/yatzy.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/yatzy.user.js
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

    function highlightPossibleCells() {
        const cells = document.querySelectorAll('table#scoring_chart td');
        const pcells = document.querySelectorAll('td.possible_cell');
        let maxValue = 0;
        let maxCells = [];

        // Réinitialiser les styles de toutes les cellules
        cells.forEach(cell => {
            cell.style.fontWeight = null;
            cell.style.color = null;
        });

        pcells.forEach(cell => {
            const cellValue = cell.innerText;
            if (cellValue !== '+0') {
                cell.style.fontWeight = 'bold';
                cell.style.color = 'blue';

                const numericValue = parseInt(cellValue.substring(1));
                if (numericValue > maxValue) {
                    maxValue = numericValue;
                    maxCells = [cell];
                } else if (numericValue === maxValue) {
                    maxCells.push(cell);
                }
            }
        });

        maxCells.forEach(cell => {
            if (!cell.innerHTML.endsWith(' <i class="fa fa-check" style="color: green"></i>')) {
                cell.innerHTML += ' <i class="fa fa-check" style="color: green"></i>';
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                highlightPossibleCells();
            }
        });
    });

    const config = { childList: true, subtree: true };

    // Attendre que la div "page-content" soit présente avant de démarrer l'observation
    const waitForPageContent = setInterval(() => {
        const pageContent = document.getElementById('page-content');
        if (pageContent) {
            clearInterval(waitForPageContent);
            observer.observe(pageContent, config);
            highlightPossibleCells();
        }
    }, 500);
})();
