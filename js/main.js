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
        /* Use predefined levels */
        game.init(level,
                  gameLevels[level].width, gameLevels[level].height,
                  gameLevels[level].moves);
    } else {
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
    {width: 3, height: 3, moves:  2},
    {width: 3, height: 3, moves:  4},
    {width: 3, height: 3, moves:  6},
    {width: 3, height: 3, moves:  8},
    {width: 3, height: 3, moves: 10},
    {width: 3, height: 3, moves: 12},

    {width: 3, height: 4, moves: 14},
    {width: 3, height: 4, moves: 16},
    {width: 3, height: 4, moves: 18},

    {width: 4, height: 4, moves: 20},
    {width: 4, height: 4, moves: 22},
    {width: 4, height: 4, moves: 24},

    {width: 4, height: 5, moves: 26},
    {width: 4, height: 5, moves: 28},
    {width: 4, height: 5, moves: 30},

    {width: 5, height: 5, moves: 32},
    {width: 5, height: 5, moves: 34},
    {width: 5, height: 5, moves: 36},
    {width: 5, height: 5, moves: 38},

    {width: 5, height: 6, moves: 40},
    {width: 5, height: 6, moves: 42},
    {width: 5, height: 6, moves: 44},
    {width: 5, height: 6, moves: 46},

    {width: 5, height: 7, moves: 48},
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

