// ==UserScript==
// @name         BoardGameArena: Games: Downforce
// @namespace    https://ebumna.net/
// @version      0.2
// @description  BoardGameArena: Games: Downforce
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*/downforce?table=*
// @icon         http://boardgamearena.com/theme/img/favicon/android-icon-512x512
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/downforce.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/downforce.user.js
// @grant        none
// ==/UserScript==

// TODO : Calculer le max des cartes pour chaque couleur

(function() {
    'use strict';

 	// Enable for debugging
	const DEBUG = false;
	const logDebug = (...msgs) => {
		// eslint-disable-next-line no-console
		if (DEBUG) console.log('BGA_GEN> ', msgs);
	};

    const colors = {'orange':0, 'black':0, 'green':0, 'blue':0, 'red':0, 'yellow':0};

    function getCardValues() {
        var cards = document.querySelectorAll('#df-myhand .stockitem');
        var c_l_tab = [];

        cards.forEach( (e, i) => {
            // console.log('carte '+i+': ');
            // console.log(e);
            c_l_tab[i] = [];
            e.querySelectorAll('.df-card-line').forEach( e => {
                let l_val = e.className.match(/df-card-(\d)/);
                let l_lib = e.className.match(/df-card-([A-Z]{1}[a-z]+)/);

                if (l_val != null && l_lib != null) {
                    //console.log(' - ' + l_lib[1].toLowerCase() + ': ' + l_val[1]);
                    c_l_tab[i].push({key: l_lib[1].toLocaleLowerCase(), value: l_val[1]});
                }
            });
            e.querySelectorAll('[class^="df-speed8-"],[class*=" df-speed8-"]').forEach( e => {
                let l_8 = e.className.match(/df-speed8-([a-z]+)/);

                if (l_8 != null) {
                    //console.log(' - ' + l_8[1] + ': 8 !!!');
                    c_l_tab[i].push({key: l_8[1].toLocaleLowerCase(), value: 8});
                }
            });
        });

        return c_l_tab;
    }

    function getCardColorValue(card, color) {
        console.log(card + ' + ' + color);
        if (color != 'joker') {
            if (card[color] != null) {
                console.log(card[color]);
                return card[color];
            }
            else {
                console.log(0);
                return 0;
            }
        }
        else {
            let jk_val = 0;
            card.forEach(e => {
                if (e.key == 'joker' && e.value > jk_val) {
                    jk_val = e.value;
                }
            });

            return jk_val;
        }
    }

    function evalMaxCombinatory() {
        const c_l_tab = getCardValues();

        for (const [col, val] of Object.entries(colors)) {
        // Object.entries(colors).forEach( (col, val) => {
            console.log(col + ' => ' + val);
            c_l_tab.forEach( card => {
                let c_val = getCardColorValue(card, col);
                let c_grey = getCardColorValue(card, 'joker');
                console.log('=> '+c_val+'/'+c_grey);

                // colors[col] += c_val;
                // if (c_val == 0) {
                //     colors[col] += c_grey;
                // }
            });
        }

        console.log(colors);
    }
evalMaxCombinatory()
})();
