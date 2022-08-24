/*****************************************************************************
 * Game window handling
 *****************************************************************************/
function windowResize() {
    if (gameGridWidth != gameGrid.clientWidth) {
        gameGridWidth = gameGrid.clientWidth;
        uiBoardSetup(game.board);
    }

    return false;
}


/*****************************************************************************
 * Window event handlers
 *****************************************************************************/
window.addEventListener("resize", windowResize);

