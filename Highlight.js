// ==UserScript==
// @name         Ebumna : BoardGameArena
// @namespace    https://ebumna.net/
// @version      0.2
// @description  Highlight oneself (and select people) on the game in progress page
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/gameinprogress
// @icon         http://en.studio.boardgamearena.com/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var user;
    const friends = [""]

    const config_stree = {
        childList: true,
        attributes: false,
        characterData: false,
        subtree: true
    };
    const config_streefull = {
        childList: true,
        attributes: true,
        characterData: false,
        subtree: true
    };

    const oRoot = document.body;
    const observer_userPanel = new MutationObserver(getUser);
    observer_userPanel.observe(oRoot, config_stree);

    function getUser() {
        console.log('BGA> getUser()');
        if (document.querySelector('.bga-username') === undefined) {
            return;
        }
        else {
            user = document.querySelector('.bga-username').innerText;
            observer_userPanel.disconnect();
            console.log('BGA> Hello '+user);
        }
    }

    const oGamesPanel = document
    const observer_gamesPanel = new MutationObserver(getGames);
    const observer_players = new MutationObserver(spy_players);
    observer_gamesPanel.observe(oRoot, config_stree);

    function getGames() {
        console.log('BGA> getGames()');
        if (document.querySelector('.gametables_yours') === undefined) {
            return;
        }
        else {
            console.log(document.querySelector('#gametables_yours'))
            observer_gamesPanel.disconnect();
            observer_players.observe(document.querySelector('#gametables_yours'), config_streefull);
            spy_players();
        }
    }

    function spy_players() {
        console.log('BGA> Spying…')
        var userCards = document.querySelectorAll(".tableplace > a[title='"+user+"']");
        var friendCards = document.querySelectorAll(".tableplace > a");

        userCards.forEach( uc => {
            uc.parentElement.style.borderRadius = '25px';
            uc.nextSibling.querySelector('a').style.color = 'black';
            if (uc.parentElement.classList.contains('tableplace_activeplayer_current')) {
                uc.parentElement.style.backgroundColor = 'LightCoral';
            }
            else {
                uc.parentElement.style.backgroundColor = 'LightGreen';
            }
        });

        friendCards.forEach( fc => {
            if (friends.indexOf(fc.getAttribute('title')) > -1) {
                fc.parentElement.style.borderRadius = '25px';
                fc.nextSibling.querySelector('a').style.color = 'black';
                if (fc.parentElement.classList.contains('tableplace_activeplayer')) {
                    fc.parentElement.style.backgroundColor = 'LightPink';
                }
                else {
                    fc.parentElement.style.backgroundColor = 'PeachPuff';
                }
            }
        });
    }
})();
