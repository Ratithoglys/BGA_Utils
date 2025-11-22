// ==UserScript==
// @name         BoardGameArena: General
// @namespace    http://ebumna.net/
// @version      0.23.5
// @description  Misc utils for BoardGameArena
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/General.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/General.user.js
// @grant        none
// ==/UserScript==

// liste des jeux
//globalUserInfos.game_list.forEach(function(e, i) { if (e.name === 'tagteam') { console.log('tag team: ' + i + ' (id: '+ e.id + ')'); } });

// liste des jeux favoris
//globalUserInfos.game_list.filter(jeu => jeu.favorite === true);

(function() {
    'use strict';

 	// Enable for debugging
	const DEBUG = false; // Changed to true for debugging
	const logDebug = (...msgs) => {
		if (DEBUG) console.debug('BGA_GEN> ', msgs);
	};

    var userColor = null;

    document.head.appendChild(document.createElement('style')).innerHTML = `
#pagemaintitletext { color: black; }
#game-logo { top: 5px; margin: 0 6px; }
#game-tuto { font-size: 40px; }

.game_box_wrap:has(.alpha_game) { background-color: lightcoral; }
.alphabanner { background-color: lightcoral; }
.game_box_wrap:has(.beta_game) { background-color: gold; }
.betabanner { background-color: gold; }

.bgabutton_gray { background-color: #c9c9c9; }
.tableplace_freeplace { background-color: lightgray; }

.bga-vertical.svelte-1duixkh .bga-menu-bar-items__menu-item.bga-menu-sub-menu-item-eb.svelte-1duixkh {
    padding: 10px 0 10px 95px;
    font-size: 0.85rem;
    cursor: pointer;
}

.ebBox {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    position: fixed;
    bottom: 30px;
    right: 10px;
    z-index: 999;
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
    width: 150px;
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
    height: 20px;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    font-size: 12px;
    border-radius: 5px;
    border: 2px solid rgba(0, 0, 0, 0.20);
    border-bottom: 4px solid rgba(0, 0, 0, 0.20);
    background: #007AFF;
    font-weight: 700;
    color: #FFF;
    text-align: center;
    cursor: pointer;
    transition: .1s;
}
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
    logDebug('observer_menu - start observing');
    observer_menu.observe(document.body, config_stree);

    const observer_mobilemenu = new MutationObserver(addMobileGamesButtons);
    logDebug('observer_mobilemenu - start observing');
    observer_mobilemenu.observe(document.body, config_childs);

    const observer_popups = new MutationObserver(hideAnnoyingShit);
    logDebug('observer_popups - start observing');
    observer_popups.observe(document.body, config_childs);

    /* GAMES > Player color - Once per load **/
    const observer_color = new MutationObserver(betterPlayerColorNotification);
    logDebug('observer_color - start observing');
    observer_color.observe(document.body, config_childs);

    /* GAMES > Game type - Once per load **/
    const observer_banner = new MutationObserver(addAlertsBanners);
    logDebug('observer_banner - start observing');
    observer_banner.observe(document.body, config_childs);

    /* PLAY NOW > Tables ELO coloring - All the time */
    const observer_gametables = new MutationObserver(playnow_loop);
    logDebug('observer_gametables - declared, will start observing later');


    function hideAnnoyingShit() {
        logDebug('hideAnnoyingShit() - START');
        // Remove the annoying "Personnal notes" popup
        if (document.querySelector('div[aria-label=turnBasedNotesIncent]') !== null) {
            logDebug('hideAnnoyingShit() - found [aria-label=turnBasedNotesIncent], disconnecting observer_popups');
            observer_popups.disconnect();
            logDebug('observer_popups - disconnected');
            document.querySelector('#turnBasedNotesIncent').innerHTML = null;
        }

        if (document.querySelector('#gamelobby_inner') !== null) {
            logDebug('hideAnnoyingShit() - found #gamelobby_inner, starting observer_gametables');
            observer_gametables.observe(document.querySelector('#gamelobby_inner') ,config_stree);
            logDebug('observer_gametables - start observing');
        }
        logDebug('hideAnnoyingShit() - END');
    }

    /* GENERAL TOPBAR UI BUTTONS */
    function addGamesButtons() {
        logDebug('addGamesButtons() - START');

        /* GAMES : Button linking to the game page */
        if (/boardgamearena\.com\/\d+\//.test(document.baseURI) && document.querySelector('#game-logo') == null) {
            logDebug('addGamesButtons() - game page detected and #game-logo is null');
            if (typeof gameui === 'undefined' || gameui.game_name == "" || gameui.game_display_name == "") {
                logDebug('addGamesButtons() - gameui is undefined or game info is empty, returning');
                return;
            }

            document.querySelector('#site-logo').insertAdjacentHTML('beforebegin','<div id="game-logo"><a id="gamelogoicon" href="/gamepanel?game=' + gameui.game_name + '"><img id="gamelogoiconsrc" src="https://x.boardgamearena.net/data/data/gamemedia/' + gameui.game_name + '/icon/default.png" alt="' + gameui.game_display_name + '"></a></div> <div id="game-tuto"><a id="gametutoicon" href="/tutorial?game=' + gameui.game_name + '">👨‍🎓</a></div>');
            logDebug('addGamesButtons() - #game-logo button added');
        }

        /* MENU : Button linking to the notifications */
        if (document.querySelector('#notifications') === null) {
            if (/boardgamearena\.com\/\d+\//.test(document.baseURI) == false && document.querySelector('.bga-menu-bar-items') !== null) {
                logDebug('addGamesButtons() - not game page, #notifications is null and .bga-menu-bar-items exists, disconnecting observer_menu');
                observer_menu.disconnect();
                logDebug('observer_menu - disconnected');
                document.querySelector('.bga-menu-bar-items').firstChild.insertAdjacentHTML('afterend','<a id="notifications" class="bga-menu-bar-items__menu-item bga-link truncate svelte-1duixkh" href="/playernotif">🚨 Notifs  </a>');
                document.querySelector('.bga-menu-bar-items.bga-mobile').firstChild.insertAdjacentHTML('afterend','<a class="bga-menu-bar-items__menu-item bga-link truncate svelte-1duixkh" href="/playernotif">🚨 </a>');
                logDebug('addGamesButtons() - #notifications button added');
            }
        }

        /* MENU : Button linking to the personnal feed */
        if (document.querySelector('#newsFeed') === null) {
            if (/boardgamearena\.com\/\d+\//.test(document.baseURI) == false && document.querySelector('.bga-menu-bar-items') !== null) {
                logDebug('addGamesButtons() - not game page, #newsFeed is null and .bga-menu-bar-items exists, disconnecting observer_menu');
                observer_menu.disconnect();
                logDebug('observer_menu - disconnected');
                document.querySelector('.bga-menu-bar-items').firstChild.insertAdjacentHTML('afterend','<a id="newsFeed" class="bga-menu-bar-items__menu-item bga-link truncate svelte-1duixkh" href="/player?section=recent">📰 Feed  </a>');
                document.querySelector('.bga-menu-bar-items.bga-mobile').firstChild.insertAdjacentHTML('afterend','<a class="bga-menu-bar-items__menu-item bga-link truncate svelte-1duixkh" href="/player?section=recent">📰 </a>');
                logDebug('addGamesButtons() - #newsFeed button added');
            }
        }

        /* GAMES / MENU : Button linking to the current tables */
        if (document.querySelector('#backToTables') === null) {
            if ((/boardgamearena\.com\/\d+\//.test(document.baseURI) || /boardgamearena\.com\/tutorial\?/.test(document.baseURI)) && document.querySelector('#upperrightmenu') !== null) {
                logDebug('addGamesButtons() - game page or tutorial, #backToTables is null and #upperrightmenu exists, disconnecting observer_menu');
                observer_menu.disconnect();
                logDebug('observer_menu - disconnected');
                logDebug('addGamesButtons() > 🎲 Table > topbar_content');
                document.querySelector('#upperrightmenu').insertAdjacentHTML('afterbegin', '<div class="upperrightmenu_item"><a id="backToTables" class="self-center globalaction" href="/gameinprogress"><span style="font-size:1.5em; border: 1px solid black; padding: 3px; background-color: #4871b6; border-radius: 6px">🎲</span></a></div>');
                logDebug('addGamesButtons() - #backToTables button added to upperrightmenu');
            }
            else if (/boardgamearena\.com\/\d+\//.test(document.baseURI) == false && document.querySelector('.bga-menu-bar-items') !== null) {
                logDebug('addGamesButtons() - not game page, #backToTables is null and .bga-menu-bar-items exists, disconnecting observer_menu');
                observer_menu.disconnect();
                logDebug('observer_menu - disconnected');
                logDebug('addGamesButtons() > 🚫 Table > no #refreshPlayersBtn > bga-menu-bar-items');
                document.querySelector('.bga-menu-bar-items').firstChild.insertAdjacentHTML('afterend','<a id="backToTables" class="bga-menu-bar-items__menu-item bga-link truncate svelte-1duixkh" href="/gameinprogress">🎲 Tables  </a>');
                document.querySelector('.bga-menu-bar-items.bga-mobile').firstChild.insertAdjacentHTML('afterend','<a class="bga-menu-bar-items__menu-item bga-link truncate svelte-1duixkh" href="/gameinprogress">🎲 </a>');
                logDebug('addGamesButtons() - #backToTables button added to bga-menu-bar-items');
            }
        }

        /* MENU : Button linking to the tournaments */
        if (document.querySelector('#tournamentsList') === null) {
            if (/boardgamearena\.com\/\d+\//.test(document.baseURI) == false && document.querySelector('.bga-menu-bar-items') !== null) {
                logDebug('addGamesButtons() - not game page, #tournamentsList is null and .bga-menu-bar-items exists, disconnecting observer_menu');
                observer_menu.disconnect();
                logDebug('observer_menu - disconnected');
                document.querySelector('.bga-menu-bar-items').firstChild.insertAdjacentHTML('afterend','<a id="tournamentsList" class="bga-menu-bar-items__menu-item bga-link truncate svelte-1duixkh" href="/tournamentlist">🏆 Tournois  </a>');
                document.querySelector('.bga-menu-bar-items.bga-mobile').firstChild.insertAdjacentHTML('afterend','<a class="bga-menu-bar-items__menu-item bga-link truncate svelte-1duixkh" href="/tournamentlist">🏆 </a>');
                logDebug('addGamesButtons() - #tournamentsList button added');
            }
        }

        /* GAMES / MENU : Button linking to FR version */
        if (document.querySelector('#btLangFR') === null) {
            if ((/boardgamearena\.com\/\d+\//.test(document.baseURI) || /boardgamearena\.com\/tutorial\?/.test(document.baseURI)) && document.querySelector('#upperrightmenu') !== null) {
                logDebug('addGamesButtons() - game page or tutorial, #btLangFR is null and #upperrightmenu exists, disconnecting observer_menu');
                observer_menu.disconnect();
                logDebug('observer_menu - disconnected');
                let prm = new URLSearchParams(window.location.search);
                prm.set('lang','fr');
                document.querySelector('#upperrightmenu').insertAdjacentHTML('afterbegin', '<div class="upperrightmenu_item"><a id="langFR" class="self-center globalaction" href="?' + prm.toString() + '"><span style="font-size:1.5em; border: 1px solid black; padding: 3px; background-color: #c9c9c9; border-radius: 6px">FR</span></a></div>');
                logDebug('addGamesButtons() - #btLangFR button added');
            }
        }
        logDebug('addGamesButtons() - END');
   }

    function addMobileGamesButtons() {
        logDebug('addMobileGamesButtons() - START');

        if (document.querySelector('.bga-menu-bar-items.bga-vertical') === null) {
            logDebug('addMobileGamesButtons() - .bga-menu-bar-items.bga-vertical is null, returning');
            return;
        }

        /* MENU : Button linking personnal notification */
        if (document.getElementById('notifsMobile') === null) {
            if (/boardgamearena\.com\/\d+\//.test(document.baseURI) == false && document.querySelector('.bga-menu-bar-items') !== null) {
                logDebug('addMobileGamesButtons() - not game page, #notifsMobile is null and .bga-menu-bar-items exists');
                document.querySelector('.bga-menu-bar-items.bga-vertical').querySelector('[href="/headlines"]').insertAdjacentHTML('afterend','<a id="notifsMobile" class="bga-menu-bar-items__menu-item bga-link bga-menu-sub-menu-item-eb truncate svelte-1duixkh" href="/playernotif"><div class="bga-menu-sub-menu-item__tree-icon svelte-1duixkh"></div>🚨 Notifs</a>');
                logDebug('addMobileGamesButtons() - #notifsMobile button added');
            }
        }

        /* MENU : Button linking to personnal feed */
        if (document.getElementById('newsFeedMobile') === null) {
            if (/boardgamearena\.com\/\d+\//.test(document.baseURI) == false && document.querySelector('.bga-menu-bar-items') !== null) {
                logDebug('addMobileGamesButtons() - not game page, #newsFeedMobile is null and .bga-menu-bar-items exists');
                document.querySelector('.bga-menu-bar-items.bga-vertical').querySelector('[href="/headlines"]').insertAdjacentHTML('afterend','<a id="newsFeedMobile" class="bga-menu-bar-items__menu-item bga-link bga-menu-sub-menu-item-eb truncate svelte-1duixkh" href="/player?section=recent"><div class="bga-menu-sub-menu-item__tree-icon svelte-1duixkh"></div> <div class="bga-menu-sub-menu-item__tree-icon-cont svelte-1duixkh"></div>📰 Feed</a>');
                logDebug('addMobileGamesButtons() - #newsFeedMobile button added');
            }
        }

        /* MENU : Button linking to the tables */
        if (document.getElementById('tablesMobile') === null) {
            if (/boardgamearena\.com\/\d+\//.test(document.baseURI) == false && document.querySelector('.bga-menu-bar-items') !== null) {
                logDebug('addMobileGamesButtons() - not game page, #tablesMobile is null and .bga-menu-bar-items exists');
                document.querySelector('.bga-menu-bar-items.bga-vertical').querySelector('[href="/lobby"]').insertAdjacentHTML('afterend','<a id="tablesMobile" class="bga-menu-bar-items__menu-item bga-link bga-menu-sub-menu-item-eb truncate svelte-1duixkh" href="/gameinprogress"><div class="bga-menu-sub-menu-item__tree-icon svelte-1duixkh"></div> 🎲 Tables</a>');
                logDebug('addMobileGamesButtons() - #tablesMobile button added');
            }
        }

        /* MENU : Button linking to the tournaments */
        if (document.getElementById('tournamentsListMobile') === null) {
            if (/boardgamearena\.com\/\d+\//.test(document.baseURI) == false && document.querySelector('.bga-menu-bar-items') !== null) {
                logDebug('addMobileGamesButtons() - not game page, #tournamentsListMobile is null and .bga-menu-bar-items exists');
                document.querySelector('.bga-menu-bar-items.bga-vertical').querySelector('[href="/lobby"]').insertAdjacentHTML('afterend','<a id="tournamentsListMobile" class="bga-menu-bar-items__menu-item bga-link bga-menu-sub-menu-item-eb truncate svelte-1duixkh" href="/tournamentlist"><div class="bga-menu-sub-menu-item__tree-icon svelte-1duixkh"></div> <div class="bga-menu-sub-menu-item__tree-icon-cont svelte-1duixkh"></div>🏆 Tournois</a>');
                logDebug('addMobileGamesButtons() - #tournamentsListMobile button added');
            }
        }
        logDebug('addMobileGamesButtons() - END');
    }

    /* GAMES */
    /** Player color **/
    function betterPlayerColorNotification() {
        logDebug('betterPlayerColorNotification() - START');
        if (!/boardgamearena\.com\/\d+\/.*?\?table=.*/.test(document.baseURI)) {
            logDebug('betterPlayerColorNotification() - not in game table, disconnecting observer_color');
            observer_color.disconnect();
            logDebug('observer_color - disconnected');
            return;
        }

        if (document.querySelector('#pagemaintitletext') != null) {
            logDebug('betterPlayerColorNotification() - found #pagemaintitletext, disconnecting observer_color');
            observer_color.disconnect();
            logDebug('observer_color - disconnected');
            userColor = document.querySelector('#player_boards > .current-player-board > div').id.replace('player_board_inner_','');
            logDebug('betterPlayerColorNotification() - userColor:', userColor);

            document.querySelector('#active_player_statusbar_icon').style.backgroundColor = 'white';
            document.querySelector('#active_player_statusbar_icon').style.borderRadius = '5px';
            document.querySelector('#pagemaintitletext').style.backgroundColor = 'white';
            document.querySelector('#pagemaintitletext').style.borderRadius = '5px';
            document.querySelector('#pagemaintitletext').style.padding = '2px';
            document.querySelector('#not_playing_help').style.backgroundColor = 'white';
            document.querySelector('#not_playing_help').style.borderRadius = '5px';
            document.querySelector('#page-title').style.backgroundColor = '#'+userColor;
            document.querySelector('#pagemaintitle_wrap').style.backgroundColor = '#'+userColor;
            logDebug('betterPlayerColorNotification() - color styles applied');
        }
        logDebug('betterPlayerColorNotification() - END');
    }

    /** Game type, tips **/
    function addAlertsBanners() {
        logDebug('addAlertsBanners() - START');
        if (!/boardgamearena\.com\/\d+\/.*?\?table=.*/.test(document.baseURI)) {
            logDebug('addAlertsBanners() - not in game table, disconnecting observer_banner');
            observer_banner.disconnect();
            logDebug('observer_banner - disconnected');
            return;
        }

        if (typeof gameui !== 'undefined') {
            logDebug('addAlertsBanners() - gameui is defined, disconnecting observer_banner');
            observer_banner.disconnect();
            logDebug('observer_banner - disconnected');
            if (gameui.tournament_id !== null && document.querySelector('#arena_ending_soon') !== null) {
                logDebug('addAlertsBanners() - tournament game detected');
                addBox('RankInfo');
                addBoxTitleLine('RankInfo', '🏆 <a href="/tournament?id='+gameui.tournament_id+'" class="">Tournament</a> 🏆');
                document.querySelector('#ebBox-RankInfo > div').style.backgroundColor = 'gold';
                logDebug('addAlertsBanners() - Tournament box added');
            }
            else if (document.body.classList.contains('arena_mode') && document.querySelector('#arena_ending_soon') !== null) {
                logDebug('addAlertsBanners() - arena game detected');
                addBox('RankInfo');
                addBoxTitleLine('RankInfo', '⚔️ Arena ⚔️');
                document.querySelector('#ebBox-RankInfo > div').style.backgroundColor = 'royalblue';
                logDebug('addAlertsBanners() - Arena box added');
            }
            else if (document.body.classList.contains('training_mode') && document.querySelector('#arena_ending_soon') !== null) {
                logDebug('addAlertsBanners() - training game detected');
                addBox('RankInfo');
                addBoxTitleLine('RankInfo', '❤️ Friendly ❤️');
                document.querySelector('#ebBox-RankInfo > div').style.backgroundColor = 'lightgrey';
                logDebug('addAlertsBanners() - Friendly box added');
            }

            // addBox('Tips');
            // addBoxTitleLine('Tips', '<div class="bga-flag" data-country="GB"></div> Tips EN');
            // addBoxTitleLine('Tips', '<div class="bga-flag" data-country="FR"></div> Tips FR');
        }
        logDebug('addAlertsBanners() - END');
    }

    /* PLAY NOW */
    function playnow_loop() {
        logDebug('playnow_loop() - START');
        gameTables_page_ui();
        improveGameTables();
        logDebug('playnow_loop() - END');
    }
    /** Tables **/
    function gameTables_page_ui() {
        logDebug('gameTables_page_ui() - START');
        if (/boardgamearena\.com\/lobby/.test(document.baseURI)) {
            logDebug('gameTables_page_ui() - lobby page detected');
            const sortMenu = document.getElementById('favorite_sort_menu_title').nextElementSibling;
            const sortbySection = sortMenu.querySelector('.sortby_section');
            const sortByEloOption = document.getElementById('favorite_sortby_elo');
            const sortByArenaRankOption = document.getElementById('favorite_sortby_rank');
            const sortByPopularity = document.getElementById('favorite_sortby_popularity');

            if (sortByPopularity) {
                logDebug('gameTables_page_ui() - removing sortByPopularity');
                sortByPopularity.remove();
            }

            if (!document.querySelector('#arena-season-end').checkVisibility() && document.querySelector('#ebBox-GameTableMgr') == null) {
                logDebug('gameTables_page_ui() - arena season not ended and #ebBox-GameTableMgr is null');
                if (sortByArenaRankOption) {
                    logDebug('gameTables_page_ui() - removing sortByArenaRankOption');
                    sortByArenaRankOption.remove();
                }

                /* Sort by ELO option */
                if (sortMenu && !sortByEloOption) {
                    logDebug('gameTables_page_ui() - sortMenu exists and sortByEloOption is null, creating sortByEloOption');
                    const newMenuItem = document.createElement('a');
                    newMenuItem.href = '#';
                    newMenuItem.classList.add('bga-link', 'login-menu-item', 'sortby', 'notselected');
                    newMenuItem.id = 'favorite_sortby_elo';
                    newMenuItem.textContent = 'Sort by ELO';

                    // Add the click event listener to trigger the sorting
                    newMenuItem.addEventListener('click', function(event) {
                        logDebug('gameTables_page_ui() - sortByEloOption clicked');
                        event.preventDefault(); // Prevent default link behavior
                        sortByElo(); // Call the sorting function (defined below)

                        // Update menu item selection visually
                        const existingSelected = sortbySection.querySelector('.selected'); // Select within sortbySection
                        if (existingSelected) {
                            existingSelected.classList.remove('selected');
                            existingSelected.classList.add('notselected');

                            // Remove the checkmark icon (if it exists)
                            const checkmarkIcon = existingSelected.querySelector('.fa-check');
                            if (checkmarkIcon) {
                                existingSelected.removeChild(checkmarkIcon);
                            }
                        }
                        // Add the checkmark icon to the newly selected item
                        newMenuItem.classList.add('selected');
                        newMenuItem.classList.remove('notselected');
                        newMenuItem.innerHTML = 'Sort by ELO <i class="fa fa-check" aria-hidden="true"></i>';
                    });

                    // Insert the new menu item before "Sort by name"
                    const nameMenuItem = document.getElementById('favorite_sortby_name');
                    sortbySection.insertBefore(newMenuItem, nameMenuItem);
                    logDebug('gameTables_page_ui() - sortByEloOption added to menu');
                }

                //Simulate a click on the "Sort by ELO" menu item after the page loads
                const sortByELOMenuItem = document.getElementById('favorite_sortby_rank'); // This is actually rank, should be elo ?
                if (sortByELOMenuItem) {
                    logDebug('gameTables_page_ui() - simulating click on sortByELOMenuItem (which is actually rank)');
                    sortByELOMenuItem.click(); // Simulate click on "Sort by Rank" which is present by default
                }

                /* Filtering popup */
                addBox('GameTableMgr');
                addBoxBtn('GameTableMgr', 'Show 0 tables', expandBeginnerTables);
                addBoxBtn('GameTableMgr', 'Hide 0 tables', collapseBeginnerTables);
                addBoxBtn('GameTableMgr', 'Show 1-100 tables', expandApprenticeTables);
                addBoxBtn('GameTableMgr', 'Hide 1-100 tables', collapseApprenticeTables);
                addBoxBtn('GameTableMgr', 'Show Alpha tables', expandAlphaTables);
                addBoxBtn('GameTableMgr', 'Hide Alpha tables', collapseAlphaTables);
                addBoxBtn('GameTableMgr', 'Show Beta tables', expandBetaTables);
                addBoxBtn('GameTableMgr', 'Hide Beta tables', collapseBetaTables);
                addBoxBtn('GameTableMgr', 'Hide all', collapseTables);
                addBoxBtn('GameTableMgr', 'Order ELO', sortByElo);
                logDebug('gameTables_page_ui() - GameTableMgr box added');
            }
            else if (document.querySelector('#arena-season-end').checkVisibility() && document.querySelector('#ebBox-GameTableMgr') != null) {
                logDebug('gameTables_page_ui() - arena season ended and #ebBox-GameTableMgr exists');
                if (sortByEloOption) {
                    logDebug('gameTables_page_ui() - removing sortByEloOption');
                    sortByEloOption.remove();
                }

                /* Sort by Arena Ranking option */
                if (sortMenu && !sortByArenaRankOption) {
                    logDebug('gameTables_page_ui() - sortMenu exists and sortByArenaRankOption is null, creating sortByArenaRankOption');
                    const newRankMenuItem = document.createElement('a');
                    newRankMenuItem.href = '#';
                    newRankMenuItem.classList.add('bga-link', 'login-menu-item', 'sortby', 'notselected');
                    newRankMenuItem.id = 'favorite_sortby_rank';
                    newRankMenuItem.textContent = 'Sort by Rank';

                    newRankMenuItem.addEventListener('click', function(event) {
                        logDebug('gameTables_page_ui() - sortByArenaRankOption clicked');
                        event.preventDefault();
                        sortByArenaRank(); // Call the new sorting function

                        // Update menu item selection visually (same logic as for "Sort by ELO")
                        const existingSelected = sortbySection.querySelector('.selected');
                        if (existingSelected) {
                            existingSelected.classList.remove('selected');
                            existingSelected.classList.add('notselected');

                            // Remove the checkmark icon (if it exists)
                            const selectedIcon = existingSelected.querySelector('.fa-check');
                            if (selectedIcon) {
                                existingSelected.removeChild(selectedIcon);
                            }
                        }
                        // Add the checkmark icon to the newly selected item
                        newRankMenuItem.classList.add('selected');
                        newRankMenuItem.classList.remove('notselected');
                        newRankMenuItem.innerHTML = 'Sort by Rank <i class="fa fa-check" aria-hidden="true"></i>';
                    });

                    // Insert "Sort by Rank" before "Sort by popularity"
                    const nameMenuItem = document.getElementById('favorite_sortby_name');
                    sortbySection.insertBefore(newRankMenuItem, nameMenuItem);
                    logDebug('gameTables_page_ui() - sortByArenaRankOption added to menu');
                }

                //Simulate a click on the "Sort by Rank" menu item after the page loads
                const sortByRankMenuItem = document.getElementById('favorite_sortby_rank');
                if (sortByRankMenuItem) {
                    logDebug('gameTables_page_ui() - simulating click on sortByRankMenuItem');
                    sortByRankMenuItem.click();
                }

                logDebug('gameTables_page_ui() - removing #ebBox-GameTableMgr');
                document.querySelector('#ebBox-GameTableMgr').remove();
            }
        }
        else if (/boardgamearena\.com\/player\?section=prestige/.test(document.baseURI)) {
            logDebug('gameTables_page_ui() - prestige page detected (not implemented)');
            const AchievmentCountLink = document.getElementById('pagesection_prestige').querySelector('.pagesection_link');
            const NameSortItem = document.getElementById('games_sortby_name');
            const ELOSortItem = document.getElementById('games_sortby_ELO');

        }
        logDebug('gameTables_page_ui() - END');
    }
    function expandBeginnerTables() {
        logDebug('expandBeginnerTables() - START');
        document.querySelectorAll('#favorite_games_list .gamerank_beginner').forEach(e => { logDebug('expandBeginnerTables() - expanding beginner table', e); e.closest('.wannaplay').querySelector('.game_box_image_wrap .game_box').click(); });
        logDebug('expandBeginnerTables() - END');
    }
    function collapseBeginnerTables() {
        logDebug('collapseBeginnerTables() - START');
        document.querySelectorAll('#favorite_expanded .gamerank_beginner').forEach(e => { logDebug('collapseBeginnerTables() - collapsing beginner table', e); e.closest('.game_box_wrap').querySelector('.game_box').click(); });
        logDebug('collapseBeginnerTables() - END');
    }
    function expandApprenticeTables() {
        logDebug('expandApprenticeTables() - START');
        document.querySelectorAll('#favorite_games_list .gamerank_apprentice').forEach(e => { logDebug('expandApprenticeTables() - expanding apprentice table', e); e.closest('.wannaplay').querySelector('.game_box_image_wrap .game_box').click(); });
        logDebug('expandApprenticeTables() - END');
    }
    function collapseApprenticeTables() {
        logDebug('collapseApprenticeTables() - START');
        document.querySelectorAll('#favorite_expanded .gamerank_apprentice').forEach(e => { logDebug('collapseApprenticeTables() - collapsing apprentice table', e); e.closest('.game_box_wrap').querySelector('.game_box').click(); });
        logDebug('collapseApprenticeTables() - END');
    }
    function collapsel100Tables() {
        logDebug('collapsel100Tables() - START');
        document.querySelectorAll('#favorite_games_list .gamerank_beginner, #favorite_expanded .gamerank_apprentice').forEach(e => { logDebug('collapsel100Tables() - collapsing beginner or apprentice table', e); e.closest('.game_box_wrap').querySelector('.game_box').click(); });
        logDebug('collapsel100Tables() - END');
    }
    function collapseg100Tables() {
        logDebug('collapseg100Tables() - START');
        document.querySelectorAll('#favorite_expanded .gamerank_apprentice').forEach(e => { logDebug('collapseg100Tables() - collapsing apprentice table', e); e.closest('.game_box_wrap').querySelector('.game_box').click(); });
        logDebug('collapseg100Tables() - END');
    }
    function expandAlphaTables() {
        logDebug('expandAlphaTables() - START');
        document.querySelectorAll('#favorite_games_list .alpha_game').forEach(e => { logDebug('expandAlphaTables() - expanding alpha table', e); e.closest('.wannaplay').querySelector('.game_box_image_wrap .game_box').click(); });
        logDebug('expandAlphaTables() - END');
    }
    function collapseAlphaTables() {
        logDebug('collapseAlphaTables() - START');
        document.querySelectorAll('#favorite_expanded .alpha_game').forEach(e => { logDebug('collapseAlphaTables() - collapsing alpha table', e); e.closest('.game_box_wrap').querySelector('.game_box').click(); });
        logDebug('collapseAlphaTables() - END');
    }
    function expandBetaTables() {
        logDebug('expandBetaTables() - START');
        document.querySelectorAll('#favorite_games_list .beta_game').forEach(e => { logDebug('expandBetaTables() - expanding beta table', e); e.closest('.wannaplay').querySelector('.game_box_image_wrap .game_box').click(); });
        logDebug('expandBetaTables() - END');
    }
    function collapseBetaTables() {
        logDebug('collapseBetaTables() - START');
        document.querySelectorAll('#favorite_expanded .beta_game').forEach(e => { logDebug('collapseBetaTables() - collapsing beta table', e); e.closest('.game_box_wrap').querySelector('.game_box').click(); });
        logDebug('collapseBetaTables() - END');
    }
    function collapseTables() {
        logDebug('collapseTables() - START');
        document.querySelectorAll('#favorite_expanded .expandedgame_box_wrap').forEach(e => { logDebug('collapseTables() - collapsing expanded table', e); e.closest('.game_box_wrap').querySelector('.game_box').click(); });
        logDebug('collapseTables() - END');
    }
    function sortByElo() {
        logDebug('sortByElo() - START');
        const gameElements = document.querySelectorAll('.game_box_wrap.initial_favorite');
        const container = document.getElementById('favorite_games_list');

        const games = [];
        gameElements.forEach(element => {
            const gameEloElement = element.querySelector('.myelo_value');
            if (gameEloElement) {
                const gameElo = parseInt(gameEloElement.textContent, 10);
                // Remplacer NaN par -9999
                const eloValue = isNaN(gameElo) ? -9999 : gameElo;
                games.push({ element, eloValue });
            } else {
                // Si l'élément .myelo_value n'existe pas, on lui attribue -9999
                games.push({ element, eloValue: -9999 });
            }
        });

        // Trier en utilisant eloValue
        games.sort((a, b) => b.eloValue - a.eloValue);

        // Réorganiser les éléments dans le conteneur
        games.forEach(game => {
            container.appendChild(game.element);
        });
        logDebug('sortByElo() - Tables sorted by ELO');
        logDebug('sortByElo() - END');
    }
    function sortByArenaRank() {
        logDebug('sortByArenaRank() - START');
        const gameElements = document.querySelectorAll('.game_box_wrap.initial_favorite');
        const container = document.getElementById('favorite_games_list');

        const games = [];
        gameElements.forEach(element => {
            const myArenaLeague = element.querySelector('.myarena_league');
            const myArenaLabel = element.querySelector('.arena_label');
            const myEloValue = element.querySelector('.myelo_value');
            const betaGame = element.querySelector('.beta_game');

            // Skip if myelo_value is less than 100 or if it's a beta game
            if ((myEloValue && parseInt(myEloValue.textContent, 10) < 100) || myEloValue.textContent === '~~' || betaGame) {
                element.style.display = 'none'; // Hide the element
                return; // Skip to the next element
            }

            element.style.display = 'block'; //Make sure that all non filtered elements are shown

            if (myArenaLeague && myArenaLabel) {
                let leagueValue = parseInt(myArenaLeague.classList[1].replace('league_', '')); // Extract league number
                let labelValue = parseInt(myArenaLabel.textContent, 10);

                // the higher the league number, the better
                // the lower the arena_label value, the better

                // Modify the ranking logic for league_5
                if (leagueValue === 5) {
                    // Invert the labelValue for league_5 so that lower numbers are better (higher rank)
                    labelValue = -labelValue;
                }

                games.push({
                    element,
                    league: leagueValue,
                    rank: labelValue,
                });
            }
        });

        // Sort the array based on league and rank
        games.sort((a, b) => {
            if (b.league !== a.league) {
                return b.league - a.league; // Sort by league (descending)
            } else {
                return b.rank - a.rank; // Sort by rank (descending - note that for league_5 label is inverted)
            }
        });

        // Re-append the elements to the container in the new order
        games.forEach(game => {
            container.appendChild(game.element);
        });
        logDebug('sortByArenaRank() - Tables sorted by Arena Rank');
        logDebug('sortByArenaRank() - END');
    }

    /** Tables ELO **/
    function improveGameTables() {
        logDebug('improveGameTables() - START');
        observer_gametables.disconnect();
        logDebug('observer_gametables - disconnected temporarily');
        document.querySelectorAll('.gamerank_apprentice, .gamerank_beginner').forEach(e => { e.style.backgroundColor = 'pink' });
        document.querySelectorAll('.how_to_play_button').forEach(e => { e.style.backgroundColor = 'lightgreen' });

        document.querySelectorAll('.table_status_additional').forEach(e => {if (e.innerText == '(Friendly mode)') {
            e.closest('.gametable').style.backgroundColor = 'lightgrey';
            e.closest('.gametable').querySelector('div.gametable_colored_indicator').innerHTML = '<div class="friendly_indicator" style="font-size: 3em; position: relative; left: -10px; transform:translateY(50%);">❤️</div>';
        } })
        if (document.querySelector('#gamelobby_inner') !== null) {
            logDebug('improveGameTables() - found #gamelobby_inner, restarting observer_gametables');
            observer_gametables.observe(document.querySelector('#gamelobby_inner') ,config_stree);
            logDebug('observer_gametables - restarted observing');
        }
        if (!/boardgamearena\.com\/gameinprogress/.test(document.baseURI)) {
            document.querySelectorAll('.playersummary').forEach(e => {
                if (e.innerText == 'Beginner') {
                    e.closest('.tableplace').style.backgroundColor = '#b0e0e6';
                }
                if (e.innerText == 'Apprentice') {
                    e.closest('.tableplace').style.backgroundColor = '#ccebc5';
                }
                else if (e.innerText == 'Good player') {
                    e.closest('.tableplace').style.backgroundColor = '#ffffe0';
                }
                else if (e.innerText == 'Strong player') {
                    e.closest('.tableplace').style.backgroundColor = '#ffc0cb';
                }
                else if (e.innerText == 'Expert') {
                    e.closest('.tableplace').style.backgroundColor = '#ff8080';
                }
                else if (e.innerText == 'Master') {
                    e.closest('.tableplace').style.backgroundColor = '#ff0000';
                }
            });
            logDebug('improveGameTables() - player level colors applied');
        }
        logDebug('improveGameTables() - END');
    }

    /* BOXING UI */
    function addBox(bName) {
        logDebug('addBox() - START', bName);
        document.querySelector('#ebumna-boxes').insertAdjacentHTML('beforeend','<div id="ebBox-'+bName+'" class="ebBox"><div class="ebBoxBackground"><div class="ebBoxLayers"></div></div></div>');
        logDebug('addBox() - END', bName);
    }
    function addBoxTitleLine(bName, content) {
        logDebug('addBoxTitleLine() - START', bName, content);
        document.querySelector('#ebBox-'+bName+' > .ebBoxBackground > .ebBoxLayers').insertAdjacentHTML('beforeEnd', '<p class="ebBoxTitleSectionTwoTextOne ebBoxTitleSectionTitleText">'+content+'');
        logDebug('addBoxTitleLine() - END', bName, content);
    }
    function addBoxLine(bName, content) {
        logDebug('addBoxLine() - START', bName, content);
        document.querySelector('#ebBox-'+bName+' > .ebBoxBackground > .ebBoxLayers').insertAdjacentHTML('beforeEnd', '<p class="ebBoxTitleSectionTwoTextOne">'+content+'');
        logDebug('addBoxLine() - END', bName, content);
    }
    function addBoxBtn(bName, content, clickCallback) {
        logDebug('addBoxBtn() - START', bName, content, clickCallback);
        document.querySelector('#ebBox-'+bName+' > .ebBoxBackground > .ebBoxLayers').insertAdjacentHTML('beforeEnd', '<div class="ebBoButton">'+content+'');
        document.querySelector('#ebBox-'+bName+' > .ebBoxBackground > .ebBoxLayers > div.ebBoButton:last-child').addEventListener('click', clickCallback);
        logDebug('addBoxBtn() - END', bName, content, clickCallback);
    }
    /* BOXING UI */

/* Reordonner les éléments par ELO dans : https://boardgamearena.com/player?section=prestige
gameElements = document.querySelectorAll('.palmares_game');

// Créer un tableau d'objets avec les informations de chaque jeu
_games = [];
gameElements.forEach(element => {
  gameRankValue = parseInt(element.querySelector('.gamerank_value').textContent);
  _games.push({
    element,
    gameRankValue
  });
});

// Trier le tableau d'objets par ordre croissant de la valeur 'gameRankValue'
_games.sort((a, b) => b.gameRankValue - a.gameRankValue);

// Réinsérer les éléments HTML dans le DOM dans l'ordre trié
const gameContainer = document.querySelector('.palmares_game').parentNode;
_games.forEach(game => {
  gameContainer.appendChild(game.element);
});

/* Reordonner les éléments par alpha dans : https://boardgamearena.com/player?section=prestige
                    const gameElements = document.querySelectorAll('.palmares_game');

                    // Créer un tableau d'objets avec les informations de chaque jeu
                    let _games = [];
                    gameElements.forEach(element => {
                        let gameName = element.querySelector('.gamename');
                        _games.push({element, gameName});
                    });

                    // Trier le tableau d'objets par ordre croissant de la valeur 'gameName'
                    _games.sort((a, b) => {
                        if (a.gameName < b.gameName) return -1;
                        if (a.gameName > b.gameName) return 1;
                        return 0;
                    });

                    // Réinsérer les éléments HTML dans le DOM dans l'ordre trié
                    const gameContainer = document.querySelector('.palmares_game').parentNode;
                    _games.forEach(game => {
                        gameContainer.appendChild(game.element);
                    });
  */
})();