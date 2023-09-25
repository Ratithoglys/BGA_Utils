// ==UserScript==
// @name         Ebumna : BoardGameArena, Highlight
// @namespace    https://ebumna.net/
// @version      0.4
// @description  Highlight oneself (and select people) on the game in progress page
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*
// @icon         http://en.studio.boardgamearena.com/favicon.ico
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/BGA_Utils/main/Highlight.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/BGA_Utils/main/Highlight.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var user;
    const friends = [""]

    const config_element = {
        childList: true,
        attributes: false,
        characterData: false,
        subtree: false
    };
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
    const oMainPanel = document.querySelector('#main-content');
    const observer_userPanel = new MutationObserver(getUser);
    const observer_gamesPanel = new MutationObserver(getGames);
    const observer_players = new MutationObserver(getPlayers);
    const observer_mainPanel = new MutationObserver(manageScript);
    observer_mainPanel.observe(oMainPanel, config_element);

    function manageScript() {
        if (/boardgamearena\.com\/gameinprogress/.test(document.baseURI)) {
            observer_userPanel.observe(oRoot, config_stree); // get user name
            observer_gamesPanel.observe(oRoot, config_stree); // check for current tables list
        }
        else {
            observer_userPanel.disconnect();
            observer_gamesPanel.disconnect();
            observer_players.disconnect();
        }
    }

    function getUser() {
        console.log('BGA> getUser()');
        if (document.querySelector('.bga-username') === undefined) {
            return;
        }
        else {
            user = document.querySelector('.bga-username').innerText;
            console.log('BGA> Hello '+user);
            observer_userPanel.disconnect();
        }
    }

    function getGames() {
        if (document.querySelector('.gametables_yours') === undefined) {
            return;
        }
        else {
            observer_gamesPanel.disconnect();
            getPlayers();
            observer_players.observe(document.querySelector('#gametables_yours'), config_streefull);
        }
    }

    function getPlayers() {
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
