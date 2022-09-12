/*****************************************************************************
 * Level initialization
 *****************************************************************************/
function levelStart(level) {
    /* Check level value */
    if (!(level > 0)) {
        level = 0;
    }

    /* Initialize game */
    if (level < gameLevels.length) {
        /* Use predefined challenges */
        game.init(level,
                  gameLevels[level].width,
                  gameLevels[level].height,
                  gameLevels[level].moves);
    } else {
        /* Use last defined challenge */
        game.init(level,
                  gameLevels[gameLevels.length - 1].width,
                  gameLevels[gameLevels.length - 1].height,
                  gameLevels[gameLevels.length - 1].moves);
    }

    /* Save game point */
    localStorage.setItem("game-level", JSON.stringify(game.level));

    /* Setup board */
    uiBoardSetup(game.board);
}

/*****************************************************************************
 * Game levels
 *****************************************************************************/
var gameLevels = [
    {width: 4, height: 4, moves: 2},
    {width: 7, height: 7, moves: 9},
];

/*****************************************************************************
 * Create game
 *****************************************************************************/
var game = new Game();

/*****************************************************************************
 * Start game from save point
 *****************************************************************************/
level = JSON.parse(localStorage.getItem("game-level"));
if (level > 0) {
    levelStart(level);
} else {
    levelStart(0);
}

