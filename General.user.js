// ==UserScript==
// @name         BoardGameArena: General
// @namespace    http://ebumna.net/
// @version      0.36
// @description  Misc utils for BoardGameArena
// @author       Lénaïc JAOUEN
// @match        https://boardgamearena.com/*
// @exclude      https://boardgamearena.com/blank?*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @updateURL    https://github.com/Ratithoglys/BGA_Utils/raw/main/General.user.js
// @downloadURL  https://github.com/Ratithoglys/BGA_Utils/raw/main/General.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // Enable for debugging
    const DEBUG = true;
    const logDebug = (...msgs) => {
        if (DEBUG) console.debug('BGA_GEN> ', msgs);
    };

    // Page courante (BGA est une SPA : document.baseURI change sans rechargement)
    const isGamePage = () => /boardgamearena\.com\/\d+\//.test(document.baseURI);
    const isTutorialPage = () => /boardgamearena\.com\/tutorial\?/.test(document.baseURI);
    const isGameOrTutorial = () => isGamePage() || isTutorialPage();
    const isLobby = () => /boardgamearena\.com\/lobby/.test(document.baseURI);
    const isGamelist = () => /boardgamearena\.com\/gamelist/.test(document.baseURI);
    const isTablePage = () => /boardgamearena\.com\/\d+\/.*?\?table=.*/.test(document.baseURI);

    // let excludedGames = GM_getValue('excludedGames', []).map(entry => {
    //     return entry;
    // });
    let excludedGames = [
        "altered",
        "challengers",
        "digitcode",
        "turingmachine",
        "cardia",
        "chakra",
        "eternitium",
        "eriantys",
        "schottentotten",
        "orionduel",
        "shutthebox",
        "galacticcruise",
        "cosmoctopus",
        "dodo",
        "seasons",
        "raceforthegalaxy",
        "throughtheagesnewstory",
        "coffeerush",
        "heythatsmyfish",
        "justdesserts",
        "paganfateofroanoke",
        "imperialsettlers",
        "mystlingacademy"
    ]

    document.head.appendChild(document.createElement('style')).innerHTML = `
#pagemaintitletext { color: black; }
#game-logo { top: 5px; margin: 0 6px; position: relative; }
.eb-game-fav { position: absolute; top: 4px; right: -18px; font-size: 20px; line-height: 1; pointer-events: none; }
#ebgame-tuto { font-size: 40px; }
#ebgame-type { font-size: 40px; }
#variant_wrap { background-color: #ccff00; }

.game_box_wrap:has(.alpha_game) { background-color: lightcoral; }
.alphabanner { background-color: lightcoral; }
.game_box_wrap:has(.beta_game) { background-color: gold; }
.betabanner { background-color: gold; }

.bgabutton_gray { background-color: #c9c9c9; }
.tableplace_freeplace { background-color: lightgray; }

.bga-vertical .bga-menu-bar-items__menu-item.bga-menu-sub-menu-item-eb {
    padding: 10px 0 10px 95px;
    font-size: 0.85rem;
    cursor: pointer;
}

div[aria-label=turnBasedNotesIncent] { display: none }

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

/* CSS pour le coeur favori */
.eb-favorite-heart {
    position: absolute;
    top: -6px;
    left: 20px;
    font-size: 40px;
    z-index: 100;
    pointer-events: none; /* Empêche le coeur de bloquer les clics sur la vignette */
    filter: drop-shadow(0px 0px 4px rgba(255,255,255,0.9));
    line-height: 1;
}

/* Profil > Groupes : une ligne par groupe, au lieu d'une seule ligne séparée par des virgules */
#playergroups .eb-groups-list { margin: 8px 0 0; padding-left: 20px; }
#playergroups .eb-groups-list li { margin: 2px 0; }
`

    // --- GESTION DU CHANGEMENT D'URL (SPA) ---
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            logDebug('URL Change detected to:', lastUrl);
            init(); // On relance la logique globale
        }
    });
    urlObserver.observe(document, { subtree: true, childList: true });

    document.body.insertAdjacentHTML('beforeend','<div id="ebumna-boxes"></div>');

    const config_stree = {
        childList: true,
        attributes: false,
        characterData: false,
        subtree: true
    };
    const config_childs = {
        childList: true,
        attributes: false,
        characterData: false,
        subtree: false
    };

    /* GENERAL TOPBAR UI BUTTONS */
    const observer_menu = new MutationObserver(addGamesButtons);
    const observer_mobilemenu = new MutationObserver(addMobileGamesButtons);

    /* GAMES > Player color - Once per load **/
    const observer_color = new MutationObserver(betterPlayerColorNotification);

    /* PLAY NOW > Tables ELO coloring - All the time */
    const observer_gametables = new MutationObserver(playnow_loop);

    /* GAMES LIST > Favorite Heart */
    const observer_favorite_games = new MutationObserver(favoriteGames_loop);

    /* LOBBY > Attend que #gamelobby_inner apparaisse avant de le surveiller */
    const observer_lobby_wait = new MutationObserver((mutations, obs) => {
        const lobbyInner = document.querySelector('#gamelobby_inner');
        if (lobbyInner) {
            logDebug('Lobby Wait - #gamelobby_inner trouvé ! Lancement de observer_gametables');
            observer_gametables.observe(lobbyInner, config_stree);
            playnow_loop(); // On force un premier calcul
            obs.disconnect(); // Le guetteur a fini son travail, on l'éteint
        }
    });

    /* PROFIL > Groupes : attend que #playergroups apparaisse avant de le mettre en liste */
    const observer_groups_wait = new MutationObserver((mutations, obs) => {
        if (listPlayerGroups()) {
            obs.disconnect(); // Le guetteur a fini son travail, on l'éteint
        }
    });

    function init() {
        observer_lobby_wait.disconnect();
        observer_groups_wait.disconnect();

        // Hors lobby : on retire la boîte de filtrage et on arrête de surveiller les tables
        if (!isLobby()) {
            observer_gametables.disconnect();
            document.querySelector('#ebBox-GameTableMgr')?.remove();
        }

        logDebug('Initialisation des observers...');

        // On observe le body pour les menus et boutons globaux
        observer_menu.observe(document.body, config_stree);
        observer_mobilemenu.observe(document.body, config_childs);

        // Marquage des favoris sur les listes de jeux
        if (isGamelist()) {
            observer_favorite_games.observe(document.body, config_stree);
        }

        // Coloration du joueur (uniquement si on est sur une page de jeu)
        if (isTablePage()) {
            observer_color.observe(document.body, config_stree);
        }

        // Profil > Groupes en liste (https://boardgamearena.com/player?section=groups)
        if (/boardgamearena\.com\/player/.test(document.baseURI)) {
            if (!listPlayerGroups()) {
                // Pas encore là (ex: navigation SPA) : on attend son apparition
                logDebug('Groups Wait - En attente de #playergroups...');
                observer_groups_wait.observe(document.body, config_stree);
            }
        }

        // Cas spécifique du Lobby
        if (isLobby()) {
            const lobbyInner = document.querySelector('#gamelobby_inner');
            if (lobbyInner) {
                // S'il est déjà là (ex: rafraichissement direct de la page F5)
                observer_gametables.observe(lobbyInner, config_stree);
                playnow_loop();
            } else {
                // S'il n'est pas encore là (ex: navigation SPA)
                logDebug('Lobby Wait - En attente de #gamelobby_inner...');
                observer_lobby_wait.observe(document.body, config_stree);
            }
        }
    }

    // Premier lancement
    init();

    /* PROFIL > Groupes : une ligne par groupe, triée par ordre alphabétique, au lieu
       d'une seule ligne séparée par des virgules. #playergroups contient des liens
       séparés par des noeuds texte ", " : les déplacer dans un <ul> supprime les
       virgules, sans toucher aux liens ni à leurs href. */
    function listPlayerGroups() {
        const container = document.getElementById('playergroups');
        if (!container || container.dataset.ebGroupsListed) {
            return !!container;
        }
        const links = [...container.querySelectorAll('a.bga-link')];
        if (links.length === 0) {
            return false;
        }
        links.sort((a, b) => a.textContent.trim().localeCompare(b.textContent.trim(), 'fr', { sensitivity: 'base' }));
        const list = document.createElement('ul');
        list.className = 'eb-groups-list';
        links.forEach((link) => {
            const item = document.createElement('li');
            item.appendChild(link);
            list.appendChild(item);
        });
        container.replaceChildren(list);
        container.dataset.ebGroupsListed = '1';
        logDebug('listPlayerGroups() -', links.length, 'groupes mis en liste');
        return true;
    }

    /* GENERAL TOPBAR UI BUTTONS */
    /* Insère après le premier élément du conteneur, sans planter si le
       conteneur est absent ou encore vide (cas du menu mobile, monté après
       le menu desktop : firstElementChild est alors null). Renvoie false
       dans ce cas, pour laisser l'observateur réessayer à la prochaine
       mutation au lieu d'avorter toute la fonction. */
    function insertAfterFirstElement(container, html) {
        const first = container?.firstElementChild;
        if (!first) return false;
        first.insertAdjacentHTML('afterend', html);
        return true;
    }
    /* Reprise dynamique de la classe du premier lien natif du menu : le
       suffixe Svelte (svelte-...) change à chaque déploiement BGA, il ne
       doit plus être codé en dur. Si aucun lien natif n'est encore monté,
       repli sur les classes de base (lien visible, sans style scopé). */
    function nativeMenuLinkClass() {
        const native = document.querySelector('.bga-menu-bar-items a.bga-menu-bar-items__menu-item');
        return native ? native.className : 'bga-menu-bar-items__menu-item bga-link truncate';
    }
    function svelteSuffix() {
        const m = nativeMenuLinkClass().match(/svelte-[A-Za-z0-9_-]+/);
        return m ? m[0] : '';
    }
    function verticalMenuLinkClass() {
        const suffix = svelteSuffix();
        // bga-menu-sub-menu-item (classe native) : fond bleu + texte blanc,
        // sans elle les traits blancs de l'arbre sont invisibles sur fond gris.
        return 'bga-menu-bar-items__menu-item bga-link bga-menu-sub-menu-item bga-menu-sub-menu-item-eb truncate' + (suffix ? ' ' + suffix : '');
    }
    function treeIconClass() {
        const suffix = svelteSuffix();
        return 'bga-menu-sub-menu-item__tree-icon' + (suffix ? ' ' + suffix : '');
    }
    function treeIconContClass() {
        const suffix = svelteSuffix();
        return 'bga-menu-sub-menu-item__tree-icon-cont' + (suffix ? ' ' + suffix : '');
    }

    /* Le jeu courant est-il dans les favoris ? Sur une table, le jeu tourne dans une
   iframe : globalUserInfos est dans la fenêtre parente. */
    function isFavoriteGame() {
        try {
            const top = (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window).top;
            return [true, 1, '1'].includes(top.globalUserInfos.game_list.find(g => g.name === gameui.game_name)?.favorite);
        } catch (e) {
            return false;
        }
    }

    /* TABLE : icône du type de partie à côté du logo : 🏆 tournoi, ⚔️ arène, 💙 friendly.
   Tournoi et arène se lisent localement ; le friendly (option 201 = 1) demande au serveur. */
    function markTableType() {
        const tableId = new URLSearchParams(location.search).get('table');
        if (!tableId || document.body.dataset.ebTableType === tableId) return; // une seule fois par table
        document.body.dataset.ebTableType = tableId;

        const setType = (html) => {
            if (!document.querySelector('#ebgame-type')) {
                document.querySelector('#site-logo').insertAdjacentHTML('beforebegin', '<div id="ebgame-type">' + html + '</div>');
            }
        };

        if (gameui.tournament_id !== null) {
            return setType('<a id="gametypeicon" href="/tournament?id=' + gameui.tournament_id + '#overview">🏆</a>');
        }
        if (document.body.classList.contains('arena_mode')) {
            return setType('⚔️');
        }

        gameui.ajaxcall('/table/table/tableinfos.html', { id: tableId, lock: false }, gameui, (r) => {
            if (String((r.data ?? r).options?.['201']?.value) === '1') setType('💙');
        }, () => {}, 'get');
    }

    function addGamesButtons() {
        logDebug('addGamesButtons() - START');

        /* GAMES : Button linking to the game page and tutorial, tournament/arena/friendly info */
        if (isGamePage() && document.querySelector('#game-logo') == null) {
            logDebug('addGamesButtons() - game page detected and #game-logo is null');
            if (typeof gameui === 'undefined' || gameui.game_name == "" || gameui.game_display_name == "") {
                logDebug('addGamesButtons() - gameui is undefined or game info is empty, returning');
                return;
            }

            document.querySelector('#site-logo').insertAdjacentHTML('beforebegin','<div id="game-logo"><a id="gamelogoicon" href="/gamepanel?game=' + gameui.game_name + '"><img id="gamelogoiconsrc" src="https://x.boardgamearena.net/data/data/gamemedia/' + gameui.game_name + '/icon/default.png" alt="' + gameui.game_display_name + '"></a>' + (isFavoriteGame() ? '<span class="eb-game-fav">❤️</span>' : '') + '</div> <div id="ebgame-tuto"><a id="gametutoicon" href="/tutorial?game=' + gameui.game_name + '">👨‍🎓</a></div>');
            logDebug('addGamesButtons() - #game-logo button added');

            markTableType();
        }

        /* MENU : liens desktop + mobile (l'ordre du tableau est l'ordre
           d'insertion ; l'insertion après le premier élément inverse
           l'ordre à l'écran, comme avant) */
        const menuButtons = [
            ['notifications', '/playernotif', '🚨 Notifs  ', '🚨 '],
            ['newsFeed', '/player?section=recent', '📰 Feed  ', '📰 '],
            ['backToTables', '/gameinprogress', '🎲 Tables  ', '🎲 '],
            ['tournamentsList', '/tournamentlist', '🏆 Tournois  ', '🏆 ']
        ];
        if (!isGamePage() && document.querySelector('.bga-menu-bar-items') !== null) {
            menuButtons.forEach(([id, href, label, shortLabel]) => {
                if (document.querySelector('#' + id) !== null) return;
                // backToTables sur page tuto avec #upperrightmenu : le bouton va
                // dans #upperrightmenu (bloc ci-dessous), pas dans le menu.
                if (id === 'backToTables' && isTutorialPage() && document.querySelector('#upperrightmenu') !== null) return;
                insertAfterFirstElement(document.querySelector('.bga-menu-bar-items'), '<a id="' + id + '" class="' + nativeMenuLinkClass() + '" href="' + href + '">' + label + '</a>');
                insertAfterFirstElement(document.querySelector('.bga-menu-bar-items.bga-mobile'), '<a class="' + nativeMenuLinkClass() + '" href="' + href + '">' + shortLabel + '</a>');
                logDebug('addGamesButtons() - #' + id + ' button added');
            });
        }

        /* GAMES / MENU : Button linking to the current tables (page de jeu / tuto :
           le bouton 🎲 va dans #upperrightmenu, pas dans le menu — le lien
           de menu est posé par la boucle ci-dessus) */
        if (document.querySelector('#backToTables') === null && isGameOrTutorial() && document.querySelector('#upperrightmenu') !== null) {
            logDebug('addGamesButtons() > 🎲 Table > topbar_content');
            document.querySelector('#upperrightmenu').insertAdjacentHTML('afterbegin', '<div class="upperrightmenu_item"><a id="backToTables" class="self-center globalaction" href="/gameinprogress"><span style="font-size:1.5em; border: 1px solid black; padding: 3px; background-color: #4871b6; border-radius: 6px">🎲</span></a></div>');
            logDebug('addGamesButtons() - #backToTables button added to upperrightmenu');
        }

        /* GAMES / MENU : Button linking to FR version */
        if (document.querySelector('#langFR') === null) {
            if (isGameOrTutorial() && document.querySelector('#upperrightmenu') !== null) {
                let prm = new URLSearchParams(window.location.search);
                prm.set('lang','fr');
                document.querySelector('#upperrightmenu').insertAdjacentHTML('afterbegin', '<div class="upperrightmenu_item"><a id="langFR" class="self-center globalaction" href="?' + prm.toString() + '"><span style="font-size:1.5em; border: 1px solid black; padding: 3px; background-color: #c9c9c9; border-radius: 6px">FR</span></a></div>');
                logDebug('addGamesButtons() - #langFR button added');
            }
        }

        /* Sur une page de jeu / tutoriel : on coupe l'observateur dès que les
           deux boutons du #upperrightmenu sont posés. */
        const onGameOrTutorial = isGameOrTutorial();
        if (onGameOrTutorial && document.querySelector('#backToTables') !== null && document.querySelector('#langFR') !== null) {
            observer_menu.disconnect();
            logDebug('observer_menu - disconnected (game page buttons present)');
        }

        /* Ailleurs : on ne coupe l'observateur que quand les 4 liens desktop ET les 4
           liens mobile sont présents : sinon, une insertion ratée (menu
           mobile encore vide au premier déclenchement) ne serait jamais
           réessayée. */
        const mobileBar = document.querySelector('.bga-menu-bar-items.bga-mobile');
        const mobileDone = !mobileBar || ['/playernotif', '/player?section=recent', '/gameinprogress', '/tournamentlist'].every(href => mobileBar.querySelector('a[href="' + href + '"]'));
        if (document.querySelector('#notifications') !== null && document.querySelector('#newsFeed') !== null && document.querySelector('#backToTables') !== null && document.querySelector('#tournamentsList') !== null && mobileDone) {
            observer_menu.disconnect();
            logDebug('observer_menu - disconnected (all menu buttons present)');
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
        observer_mobilemenu.disconnect();

        const vertical = document.querySelector('.bga-menu-bar-items.bga-vertical');
        const notGamePage = !isGamePage();

        /* MENU : liens du menu vertical mobile (ancre et conteneur d'icône
           diffèrent selon le bouton) */
        const mobileButtons = [
            ['notifsMobile', '/playernotif', '🚨 Notifs', '/headlines', false],
            ['newsFeedMobile', '/player?section=recent', '📰 Feed', '/headlines', true],
            ['tablesMobile', '/gameinprogress', '🎲 Tables', '/lobby', false],
            ['tournamentsListMobile', '/tournamentlist', '🏆 Tournois', '/lobby', true]
        ];
        mobileButtons.forEach(([id, href, label, anchor, withCont]) => {
            if (document.getElementById(id) === null && notGamePage) {
                vertical.querySelector('[href="' + anchor + '"]').insertAdjacentHTML('afterend', '<a id="' + id + '" class="' + verticalMenuLinkClass() + '" href="' + href + '"><div class="' + treeIconClass() + '"></div>' + (withCont ? ' <div class="' + treeIconContClass() + '"></div>' : '') + label + '</a>');
                logDebug('addMobileGamesButtons() - #' + id + ' button added');
            }
        });
        logDebug('addMobileGamesButtons() - END');
    }

    /* FAVORITE GAMES HIGHLIGHTING */
    let favGamesTimeout = null;
    function favoriteGames_loop() {
        if (!isGamelist()) return;

        // Anti-spam (Debounce) : on attend que le DOM se calme 300ms avant de lancer le traitement
        if (favGamesTimeout) {
            clearTimeout(favGamesTimeout);
        }
        favGamesTimeout = setTimeout(markFavoriteGames, 300);
    }

    function markFavoriteGames() {
        if (typeof globalUserInfos === 'undefined' || !globalUserInfos.game_list) return;

        // Pas de cache : on recalcule le Set à chaque appel (< 1 ms), ce qui permet
        // de voir les ajouts/retraits de favoris en direct.
        const favGames = globalUserInfos.game_list.filter(g => g.favorite === true || g.favorite === 1 || g.favorite === "1");
        const favoriteGameNames = new Set(favGames.map(g => g.name));

        let gameLinks = document.querySelectorAll('.bga-game-grid > div > a');
        if (gameLinks.length === 0) {
            gameLinks = document.querySelectorAll('.bga-game-browser-carousel__item > a');
        }

        if (gameLinks.length > 0) {
            observer_favorite_games.disconnect();
        }

        gameLinks.forEach((link) => {
            logDebug('markFavoriteGames() - link', link);
            if (!link.href) return;

            let gameName = null;
            try {
                // Extraction du nom du jeu depuis l'URL
                const url = new URL(link.href, window.location.origin);
                gameName = url.searchParams.get('game');
                if (!gameName) {
                    const match = url.pathname.match(/\/game\/([^\/]+)/);
                    if (match) gameName = match[1];
                }
            } catch (e) {
                return; // En cas d'URL invalide
            }

            // Vérifier si le jeu est dans notre Set de favoris
            const isFav = gameName && favoriteGameNames.has(gameName);
            const existingHeart = link.querySelector('.eb-favorite-heart');

            // Ajout du coeur
            if (isFav && !existingHeart) {
                // Le lien doit pouvoir servir de repère (relative) au coeur (en absolute)
                if (window.getComputedStyle(link).position === 'static') {
                    link.style.position = 'relative';
                }
                link.insertAdjacentHTML('beforeend', '<div class="eb-favorite-heart">❤️</div>');
            }
            // Retrait du coeur
            else if (!isFav && existingHeart) {
                existingHeart.remove();
            }
        });
    }

    /* GAMES */
    /** Player color **/
    function betterPlayerColorNotification() {
        logDebug('betterPlayerColorNotification() - START');

        if (!isTablePage()) {
            logDebug('betterPlayerColorNotification() - not in game table, disconnecting observer_color');
            observer_color.disconnect();
            return;
        }

        if (document.querySelector('#pagemaintitletext') != null && document.querySelector('#player_boards > .current-player-board > div') != null) {
            logDebug('betterPlayerColorNotification() - found #pagemaintitletext, disconnecting observer_color');
            observer_color.disconnect();
            const userColor = document.querySelector('#player_boards > .current-player-board > div').id.replace('player_board_inner_','');
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

    /* PLAY NOW */
    function playnow_loop() {
        if (!isLobby()) return;

        if (document.querySelector('#gamelobby_inner')) {
            logDebug('playnow_loop() - START');
            observer_gametables.disconnect();
            gameTables_page_ui();
            improveGameTables();
            logDebug('playnow_loop() - END');
        }
    }

    /** Tables **/
    function gameTables_page_ui() {
        logDebug('gameTables_page_ui() - START');
        if (isLobby()) {
            logDebug('gameTables_page_ui() - lobby page detected');
            const sortMenu = document.getElementById('favorite_sort_menu_title').nextElementSibling;
            const sortbySection = sortMenu.querySelector('.sortby_section');
            const sortByEloOption = document.getElementById('favorite_sortby_elo');
            const sortByArenaRankOption = document.getElementById('favorite_sortby_rank');
            const sortByPopularity = document.getElementById('favorite_sortby_popularity');

            /* Crée une option de tri ("Sort by ELO" / "Sort by Rank") : même
               création d'élément, même clic (tri + coche + sélection). */
            function addSortOption(id, label, sortFn) {
                logDebug('gameTables_page_ui() - creating sort option', id);
                const newMenuItem = document.createElement('a');
                newMenuItem.href = '#';
                newMenuItem.classList.add('bga-link', 'login-menu-item', 'sortby', 'notselected');
                newMenuItem.id = id;
                newMenuItem.textContent = label;

                newMenuItem.addEventListener('click', function(event) {
                    logDebug('gameTables_page_ui() - sort option clicked', id);
                    event.preventDefault();
                    sortFn();

                    // Update menu item selection visually
                    const existingSelected = sortbySection.querySelector('.selected');
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
                    newMenuItem.innerHTML = label + ' <i class="fa fa-check" aria-hidden="true"></i>';
                });

                // Insert the new menu item before "Sort by name"
                const nameMenuItem = document.getElementById('favorite_sortby_name');
                sortbySection.insertBefore(newMenuItem, nameMenuItem);
                logDebug('gameTables_page_ui() - sort option added to menu', id);
            }

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
                    addSortOption('favorite_sortby_elo', 'Sort by ELO', sortByElo);
                }

                //Simulate a click on the "Sort by ELO" menu item after the page loads
                const sortByELOMenuItem = document.getElementById('favorite_sortby_rank'); // This is actually rank, should be elo ?
                if (sortByELOMenuItem && !sortByELOMenuItem.classList.contains('selected')) {
                    logDebug('gameTables_page_ui() - simulating click on sortByELOMenuItem (which is actually rank)');
                    sortByELOMenuItem.click(); // Simulate click on "Sort by Rank" which is present by default
                }

                /* Filtering popup */
                addBox('GameTableMgr');
                addBoxBtn('GameTableMgr', 'Show 0 tables', () => expandTables('.gamerank_beginner'));
                addBoxBtn('GameTableMgr', 'Hide 0 tables', () => collapseTables('.gamerank_beginner'));
                addBoxBtn('GameTableMgr', 'Show 1-100 tables', () => expandTables('.gamerank_apprentice'));
                addBoxBtn('GameTableMgr', 'Hide 1-100 tables', () => collapseTables('.gamerank_apprentice'));
                addBoxBtn('GameTableMgr', 'Show Alpha tables', () => expandTables('.alpha_game'));
                addBoxBtn('GameTableMgr', 'Hide Alpha tables', () => collapseTables('.alpha_game'));
                addBoxBtn('GameTableMgr', 'Show Beta tables', () => expandTables('.beta_game'));
                addBoxBtn('GameTableMgr', 'Hide Beta tables', () => collapseTables('.beta_game'));
                addBoxBtn('GameTableMgr', 'Hide all', collapseAllTables);
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
                    addSortOption('favorite_sortby_rank', 'Sort by Rank', sortByArenaRank);
                }

                //Simulate a click on the "Sort by Rank" menu item after the page loads
                const sortByRankMenuItem = document.getElementById('favorite_sortby_rank');
                if (sortByRankMenuItem && !sortByRankMenuItem.classList.contains('selected')) {
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
    const expandTables = sel => document.querySelectorAll('#favorite_games_list ' + sel).forEach(e => { e.closest('.wannaplay').querySelector('.game_box_image_wrap .game_box').click(); });
    const collapseTables = sel => document.querySelectorAll('#favorite_expanded ' + sel).forEach(e => { e.closest('.game_box_wrap').querySelector('.game_box').click(); });
    function collapseAllTables() {
        document.querySelectorAll('#favorite_expanded .expandedgame_box_wrap').forEach(e => { e.closest('.game_box_wrap').querySelector('.game_box').click(); });
    }
    function sortByElo() {
        logDebug('sortByElo() - START');
        const gameElements = document.querySelectorAll('.game_box_wrap.initial_favorite');
        const container = document.getElementById('favorite_games_list');

        const games = [];
        gameElements.forEach(element => {
            const gameEloElement = element.querySelector('.myelo_value');
            // NaN ou absence de .myelo_value => -9999
            const gameElo = gameEloElement ? parseInt(gameEloElement.textContent, 10) : NaN;
            games.push({ element, eloValue: isNaN(gameElo) ? -9999 : gameElo });
        });

        // Trier en utilisant eloValue
        games.sort((a, b) => b.eloValue - a.eloValue);

        // Réorganiser les éléments dans le conteneur
        games.forEach(game => {
            container.appendChild(game.element);
        });
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

            // Masquer si pas d'ELO, ELO < 100, ELO non affiché ("~~") ou jeu en bêta
            if (!myEloValue || parseInt(myEloValue.textContent, 10) < 100 || myEloValue.textContent === '~~' || betaGame) {
                element.style.display = 'none';
                return;
            }

            element.style.display = 'block'; // Make sure that all non filtered elements are shown

            if (myArenaLeague && myArenaLabel) {
                let leagueValue = parseInt(myArenaLeague.classList[1].replace('league_', ''));
                let labelValue = parseInt(myArenaLabel.textContent, 10);

                // the higher the league number, the better
                // the lower the arena_label value, the better
                // => pour league_5, on inverse le label pour que le plus petit soit le mieux classé
                if (leagueValue === 5) {
                    labelValue = -labelValue;
                }

                games.push({
                    element,
                    league: leagueValue,
                    rank: labelValue,
                });
            }
        });

        // Tri par league puis rank (décroissant)
        games.sort((a, b) => {
            if (b.league !== a.league) {
                return b.league - a.league; // Sort by league (descending)
            } else {
                return b.rank - a.rank; // Sort by rank (descending - note that for league_5 label is inverted)
            }
            return b.rank - a.rank;
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
        document.querySelectorAll('.gamerank_apprentice, .gamerank_beginner').forEach(e => { e.style.backgroundColor = 'pink' });
        document.querySelectorAll('.how_to_play_button').forEach(e => { e.style.backgroundColor = 'lightgreen' });

        document.querySelectorAll('.table_status_additional').forEach(e => {
            if (e.innerText == '(Friendly mode)') {
                e.closest('.gametable').style.backgroundColor = 'lightgrey';
                e.closest('.gametable').querySelector('div.gametable_colored_indicator').innerHTML = '<div class="friendly_indicator" style="font-size: 3em; position: relative; left: -10px; transform:translateY(50%);">💙</div>';
            }
        });

        const levelColors = {
            'Beginner': '#b0e0e6',
            'Apprentice': '#ccebc5',
            'Good player': '#ffffe0',
            'Strong player': '#ffc0cb',
            'Expert': '#ff8080',
            'Master': '#ff0000'
        };
        document.querySelectorAll('.playersummary').forEach(e => {
            const color = levelColors[e.innerText];
            if (color) {
                e.closest('.tableplace').style.backgroundColor = color;
            }
        });

        if (document.querySelector('#gamelobby_inner') !== null) {
            observer_gametables.observe(document.querySelector('#gamelobby_inner'), config_stree);
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
        const layers = document.querySelector('#ebBox-'+bName+' > .ebBoxBackground > .ebBoxLayers');
        layers.insertAdjacentHTML('beforeEnd', '<div class="ebBoButton">'+content+'</div>');
        layers.lastElementChild.addEventListener('click', clickCallback);
        logDebug('addBoxBtn() - END', bName, content, clickCallback);
    }
    /* BOXING UI */
})();
