// ==UserScript==
// @name         BoardGameArena: General
// @namespace    http://ebumna.net/
// @version      0.13
// @description  Misc utils for BoardGameArena
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*
// @icon         http://boardgamearena.com/theme/img/favicon/android-icon-512x512
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/BGA_Utils/main/General.user.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/BGA_Utils/main/General.user.js
// @grant        none
// ==/UserScript==


// liste des jeux
//globalUserInfos.game_list.forEach({e,i}=>{if (e.name='martiandice') {console.log('martian dice: '+i)} } );

// TODO : Gestion différenciée des écrans téléphone

(function() {
    'use strict';

 	// Enable for debugging
	const DEBUG = false;
	const logDebug = (...msgs) => {
		// eslint-disable-next-line no-console
		if (DEBUG) console.log('BGA_GEN> ', msgs);
	};

    var userColor = null;

    document.head.appendChild(document.createElement('style')).innerHTML = `
#tournament_popup {
    background-color: gold;
    border-radius: 8px;
    color: #000;
    display: none;
    font-size: 20px;
    font-weight: 700;
    margin: 10px 10px 20px;
    padding: 8px;
    text-align: center
}

#arena_popup {
    background-color: royalblue;
    border-radius: 8px;
    color: #fff;
    display: none;
    font-size: 20px;
    font-weight: 700;
    margin: 10px 10px 20px;
    padding: 8px;
    text-align: center
}

.ebBox {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    position: fixed;
    bottom: 24px;
    right: 2px;
    z-index: 2;
}
.ebBoxBackground {
    display: flex;
    padding: 16px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 16px;
    border: 2px solid rgb(129, 129, 129);
    background: #FFFAFA;
    width: 200px;
}
.ebBoxLayers {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
}
.ebBoxTitleSectionTwoTextOne {
    color: rgba(75, 75, 75, 0.8);
    height: 44px;
    font-weight: 700;
    font-size: 16px;
    margin: 0px;
    margin-top: -2px;
    cursor: default;
}
.ebBoxTitleSectionTitleText {
    height: inherit;
    width: 100%;
    text-align: center;
    color: black;
}
.ebBoButton {
    position: relative;
    display: flex;
    height: 48px;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    font-size: 16px;
    border-radius: 8px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: #007AFF;
    font-weight: 700;
    color: #FFF;
    text-align: center;
    cursor: pointer;
    transition: .1s;
`

    document.body.insertAdjacentHTML('beforeend',`<div id="ebumna-boxes"></div>`);

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
    const config_childs = {
        childList: true,
        attributes: false,
        characterData: false,
        subtree: false
    };

    //const tournament_popup = '<div id="tournament_popup" style="display:block"><div id="arena_near_end_text" class="roundedboxinner">🏆 This is a Tournament match 🏆</div></div>';
    //const arena_popup = '<div id="arena_popup" style="display:block"><div id="arena_near_end_text" class="roundedboxinner">⚔️ This is an Arena match ⚔️</div></div>';

    /* GENERAL TOPBAR UI BUTTONS - Once per load*/
    const observer_menu = new MutationObserver(addGamesButtons);
    observer_menu.observe(document.body, config_stree);

    const observer_popups = new MutationObserver(hideAnnoyingShit);
    observer_popups.observe(document.body, config_stree);

    const observer_options = new MutationObserver(getOptions);
    //obeserver_options.observer(document.body, config_stree);

    /* GAMES > Player color - Once per load **/
    const observer_color = new MutationObserver(betterPlayerColorNotification);
    observer_color.observe(document.body, config_childs);

    /* GAMES > Game type - Once per load **/
    const observer_banner = new MutationObserver(addAlertsBanners);
    observer_banner.observe(document.body, config_childs);

    /* TOURNAMENT > Calendar links - Once per load */
    const observer_calendar = new MutationObserver(fixCalendarLinks);
    observer_calendar.observe(document.body, config_childs);

    /* PLAY NOW > Tables ELO coloring - All the time */
    const observer_gametables = new MutationObserver(playnow_loop);


    function hideAnnoyingShit() {
        // Remove the annoying "Personnal notes" popup
        if (document.querySelector('#turnBasedNotesIncent') !== null) {
            observer_popups.disconnect();
            document.querySelector('#turnBasedNotesIncent').innerHTML = null;
        }

        if (document.querySelector('#gamelobby_inner') !== null) {
            observer_gametables.observe(document.querySelector('#gamelobby_inner') ,config_stree);
        }

    }

    function getOptions() {
    }

    /* GENERAL TOPBAR UI BUTTONS */
    function addGamesButtons() {
        logDebug('addGamesButton()');
        if (document.querySelector('#backToTables') === null) {
            if ((/boardgamearena\.com\/\d+\//.test(document.baseURI) || /boardgamearena\.com\/tutorial\?/.test(document.baseURI)) && document.querySelector('#upperrightmenu') !== null) {
                logDebug('addGamesButton() > 🎲 Table > topbar_content');
                observer_menu.disconnect();
                document.querySelector('#upperrightmenu').insertAdjacentHTML('afterbegin', '<div class="upperrightmenu_item"><a id="backToTables" class="bgabutton bgabutton_blue globalaction" href="/gameinprogress">🎲</a></div>');
            }
            else if (/boardgamearena\.com\/\d+\//.test(document.baseURI) == false && document.querySelector('.bga-menu-bar-items') !== null) {
                logDebug('addGamesButton() > 🚫 Table > no #refreshPlayersBtn > bga-menu-bar-items');
                observer_menu.disconnect();
                document.querySelector('.bga-menu-bar-items').firstChild.insertAdjacentHTML('afterend','<a id="backToTables" class="bga-menu-bar-items__menu-item bga-link truncate svelte-1duixkh" href="/gameinprogress">🎲 Tables  </a>');
            }
        }
        if (document.querySelector('#tournamentsList') === null) {
            if (/boardgamearena\.com\/\d+\//.test(document.baseURI) == false && document.querySelector('.bga-menu-bar-items') !== null) {
                observer_menu.disconnect();
                document.querySelector('.bga-menu-bar-items').firstChild.insertAdjacentHTML('afterend','<a id="tournamentsList" class="bga-menu-bar-items__menu-item bga-link truncate svelte-1duixkh" href="/tournamentlist">🏆 Tournois  </a>');
            }
        }
    }

    /* GAMES */
    /** Player color **/
    function betterPlayerColorNotification() {
        if (!/boardgamearena\.com\/\d+\/.*?\?table=.*/.test(document.baseURI)) {
            observer_color.disconnect();
            return;
        }

        if (document.querySelector('#pagemaintitletext') != null) {
            observer_color.disconnect();
            userColor = document.querySelector('#player_boards > .current-player-board > div').id.replace('player_board_inner_','');

            document.querySelector('#pagemaintitletext').style.backgroundColor = 'white';
            document.querySelector('#page-title').style.backgroundColor = '#'+userColor;
            document.querySelector('#pagemaintitle_wrap').style.backgroundColor = '#'+userColor;
        }
    }

    /** Game type **/
    function addAlertsBanners() {
        if (!/boardgamearena\.com\/\d+\/.*?\?table=.*/.test(document.baseURI)) {
            observer_banner.disconnect();
            return;
        }

        if (typeof gameui !== 'undefined') {
            observer_banner.disconnect();
            if (gameui.tournament_id !== null && document.querySelector('#arena_ending_soon') !== null) {
                addBox('RankInfo');
                //document.querySelector('#arena_ending_soon').insertAdjacentHTML('beforebegin', tournament_popup);
                addBoxTitleLine('RankInfo', '🏆 Tournament match 🏆');
                document.querySelector('#ebBox-RankInfo > div').style.backgroundColor = 'gold';
            }
            else if (document.body.classList.contains('arena_mode') && document.querySelector('#arena_ending_soon') !== null) {
                addBox('RankInfo');
                //document.querySelector('#arena_ending_soon').insertAdjacentHTML('beforebegin', arena_popup);
                addBoxTitleLine('RankInfo', '⚔️ Arena match ⚔️');
                document.querySelector('#ebBox-RankInfo > div').style.backgroundColor = 'royalblue';
            }
            else if (document.body.classList.contains('training_mode') && document.querySelector('#arena_ending_soon') !== null) {
                addBox('RankInfo');
                //document.querySelector('#arena_ending_soon').insertAdjacentHTML('beforebegin', arena_popup);
                addBoxTitleLine('RankInfo', '❤️ Friendly match ❤️');
                document.querySelector('#ebBox-RankInfo > div').style.backgroundColor = 'lightgrey';
            }
        }
    }

    /* TOURNAMENT */
    /** Calendar links **/
    function fixCalendarLinks() {
        if (!/boardgamearena\.com\/tournament\?id=.*/.test(document.baseURI)) {
            observer_calendar.disconnect();
            return;
        }

        if (document.querySelector('#calendarDlg > p > a') == null) {
            return
        }
        observer_calendar.disconnect();
        if (document.querySelector('#calendarDlg > p > a').attributes.length > 3) {
            let start = /href="/.exec(document.querySelector('#calendarDlg > p > a').outerHTML).index + 6;
            let end = /" class="/.exec(document.querySelector('#calendarDlg > p > a').outerHTML).index - 1;
            let fixedLink = /href=\"(.*)\" /.exec(document.querySelector('#calendarDlg > p > a').outerHTML)[1].replace(/ /g,'').replace(/"/g,'').replace(/output=xml/, 'src=fa609dcb7002d888c873a44e472e2cdccddc17491ff172ba64203d38d51fa29f@group.calendar.google.com&output=xml');

            console.log(fixedLink);
            document.querySelector('#calendarDlg > p > a').outerHTML = document.querySelector('#calendarDlg > p > a').outerHTML.replace(document.querySelector('#calendarDlg > p > a').outerHTML.substring(start, end), fixedLink);
            document.querySelector('#calendarDlg > p > a').setAttribute('href', document.querySelector('#calendarDlg > p > a').getAttribute('href').replace(/&text=/,'&text=🎲%20'));
        }
        else {
            document.querySelector('#calendarDlg > p > a').setAttribute('href', document.querySelector('#calendarDlg > p > a').getAttribute('href').replace(/&text=/,'&text=🎲%20').replace(/output=xml/, 'src=fa609dcb7002d888c873a44e472e2cdccddc17491ff172ba64203d38d51fa29f@group.calendar.google.com&output=xml'));
        }
    }

    /* PLAY NOW */
    function playnow_loop() {
        gameTables_page_ui();
        improveGameTables();
    }
    /** Tables **/
    function gameTables_page_ui() {
        if (/boardgamearena\.com\/lobby/.test(document.baseURI)) {
            if (!document.querySelector('#arena-season-end').checkVisibility() && document.querySelector('#ebBox-GameTableMgr') == null) {
                addBox('GameTableMgr');
                addBoxBtn('GameTableMgr', 'Show <100 tables', expandBeginnerTables);
                addBoxBtn('GameTableMgr', 'Hide <100 tables', collapseBeginnerTables);
            }
            else if (document.querySelector('#arena-season-end').checkVisibility() && document.querySelector('#ebBox-GameTableMgr') != null) {
                document.querySelector('#ebBox-GameTableMgr').remove();
            }
        }
    }
    function expandBeginnerTables() {
        document.querySelectorAll('#favorite_games_list .gamerank_apprentice, #favorite_games_list .gamerank_beginner').forEach(e => { e.closest('.wannaplay').querySelector('.game_box_image_wrap .game_box').click(); });
    }
    function collapseBeginnerTables() {
        document.querySelectorAll('#favorite_expanded .gamerank_apprentice, #favorite_expanded .gamerank_beginner').forEach(e => { e.closest('.game_box_wrap').querySelector('.game_box').click(); });
    }

    /** Tables ELO **/
    function improveGameTables() {
        observer_gametables.disconnect();
        document.querySelectorAll('.gamerank_apprentice, .gamerank_beginner').forEach(e => { e.style.backgroundColor = 'pink' });
        document.querySelectorAll('.how_to_play_button').forEach(e => { e.style.backgroundColor = 'lightgreen' });

        document.querySelectorAll('.table_status_additional').forEach(e => {if (e.innerText == '(Friendly mode)') { e.closest('.gametable').style.backgroundColor = 'lightgrey' } })
        if (document.querySelector('#gamelobby_inner') !== null) {
            observer_gametables.observe(document.querySelector('#gamelobby_inner') ,config_stree);
        }

    }

    /* BOXING UI */
    function addBox(bName) {
        document.querySelector('#ebumna-boxes').insertAdjacentHTML('beforeend','<div id="ebBox-'+bName+'" class="ebBox"><div class="ebBoxBackground"><div class="ebBoxLayers"></div></div></div>');
    }
    function addBoxTitleLine(bName, content) {
        document.querySelector('#ebBox-'+bName+' > .ebBoxBackground > .ebBoxLayers').insertAdjacentHTML('beforeEnd', '<p class="ebBoxTitleSectionTwoTextOne ebBoxTitleSectionTitleText">'+content+'</p>');
    }
    function addBoxLine(bName, content) {
        document.querySelector('#ebBox-'+bName+' > .ebBoxBackground > .ebBoxLayers').insertAdjacentHTML('beforeEnd', '<p class="ebBoxTitleSectionTwoTextOne">'+content+'</p>');
    }
    function addBoxBtn(bName, content, clickCallback) {
        document.querySelector('#ebBox-'+bName+' > .ebBoxBackground > .ebBoxLayers').insertAdjacentHTML('beforeEnd', '<div class="bgabutton bgabutton_blue">'+content+'</p>');
        document.querySelector('#ebBox-'+bName+' > .ebBoxBackground > .ebBoxLayers > div.bgabutton:last-child').addEventListener('click', clickCallback)
    }
    /* BOXING UI */
})();
