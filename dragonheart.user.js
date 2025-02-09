// ==UserScript==
// @name         BoardGameArena: Games: Dragonheart
// @namespace    https://ebumna.net/
// @version      0.2
// @description  BoardGameArena: Games: Dragonheart
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/dragonheart?table=*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/dragonheart.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/dragonheart.user.js
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    const MY_HAND_SELECTOR = '#myhand';
    const BOARD_SELECTOR = '#board';
    const CARD_SELECTOR = '.card';
    const PLACE_SELECTOR = '.place';

    const config_attributes = { attributes: true, attributeFilter: ['style']};
    const config_childList = { childList: true, subtree: true }; // Observe childList changes on the board

    function updateBorder(mutation) {
      if (mutation.target.style.borderWidth === '1px') {
          mutation.target.style.borderWidth = '3px';
          // Debug log for border update
          console.log('BGA_DRAGONHEART> Bordure mise à jour à 3px pour :', mutation.target.id);
      }
    }

    function updateCardCounts() {
        for (let i = 0; i <= 5; i++) {
            const place = document.getElementById(`place_${i}_1`);
            if (place) {
                const count = place.querySelectorAll(CARD_SELECTOR).length;

                // Find or create the counter element
                let counter = place.querySelector('.card-count');
                if (!counter) {
                    counter = document.createElement('span');
                    counter.classList.add('card-count');
                    place.appendChild(counter);
                }
                counter.textContent = count;
            }
        }
    }

    function initObservers() {
        const myHand = document.querySelector(MY_HAND_SELECTOR);
        const board = document.querySelector(BOARD_SELECTOR);

        if (!myHand || !board) {
            console.error('BGA_DRAGONHEART> Éléments du jeu non trouvés.');
            return;
        }

        // Observer for border width changes in my hand
        const borderObserver = new MutationObserver(mutations => {
            mutations.forEach(updateBorder);
        });

        myHand.querySelectorAll('div[id^="myhand_item_"]').forEach( item => {
            borderObserver.observe(item, config_attributes);
        });

        // Observer for card count changes on the board
        const boardObserver = new MutationObserver(updateCardCounts);
        boardObserver.observe(board, config_childList);

        // Initial card count update
        updateCardCounts();
    }

    // Wait for the game elements to be present before starting the script
    const waitForGameElements = setInterval(() => {
        const myHand = document.querySelector(MY_HAND_SELECTOR);
        const board = document.querySelector(BOARD_SELECTOR);
        if (myHand && board) {
            clearInterval(waitForGameElements);
            initObservers();
        }
    }, 500);

    // Ajout des styles CSS
    GM_addStyle(`
        .card-count {
            position: absolute;
            top: 2px;
            left: 2px;
            background-color: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            width: 20px;
            height: 20px;
            text-align: center;
            font-size: 12px;
            line-height: 20px;
            font-weight: bold;
            z-index: 10; /* Ajout de z-index pour la pastille */
        }
        div[id^="myhand_item_"][style*="border-width: 1px"] { /* Ciblage plus précis pour la bordure */
            border-width: 3px !important; /* Utilisation de !important pour forcer le style */
        }
    `);
})();
