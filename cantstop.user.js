// ==UserScript==
// @name         BoardGameArena: Games: Can't Stop
// @namespace    https://ebumna.net/
// @version      0.3
// @description  BoardGameArena: Games: Can't Stop
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/cantstop?table=*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/cantstop.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/cantstop.user.js
// @grant        none
// ==/UserScript==

// TODO : Popup coloré pour mettre en évidence les jetons à regarder
// TODO : Mettre en évidence les jetons déjà positionnés

(function() {
    'use strict';

    document.head.appendChild(document.createElement('style')).innerHTML = `
a#action_stop {
    background: #c92727;
    background: -o-linear-gradient(top,#c20b0b,#c92727);
    border: 1px solid #b20a0a
}
a#action_stop:hover {
    background: #cf4040;
    color: #fff
}
a#action_stop:active {
    background: #b20a0a;
    border-top-color: #b20a0a
}
`
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


    function getValues() {
        var numbersReserved = [];
        var numbersOnDice = [];
        let userTokens = document.querySelectorAll('#board div.token_'+userColor);
        let playingTokens = document.querySelectorAll('#board div.token_000000');

        // Liste des valeurs en jeu
        userTokens.forEach(t => {
            let token = t.id.split(/\_/);
            if (token[0] == "step") {
                if (!numbersReserved.includes(token[1])) {
                    numbersReserved.push(token[1]);
                }
            }
            else if (token[0] == "token") {
                if (!numbersReserved.includes(token[2])) {
                    numbersReserved.push(token[2]);
                }
            }
        })

        // Liste des valeurs à tirer
        playingTokens.forEach(t => {
            let token = t.id.split(/\_/);
            if (!numbersOnDice.includes(token[2])) {
                numbersOnDice.push(token[2]);
            }
        });

        // Les dés à choisir
        // Progresses on 10
        // Progresses on 9 and 9
        document.querySelectorAll('[id^="chooseCombo"]')[2].innerText.split(' ');
    }

})();
