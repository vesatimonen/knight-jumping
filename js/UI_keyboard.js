/*****************************************************************************
 * Keyboard input handling
 *****************************************************************************/
function uiKeyPressed(event) {
    let move = "";
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            move = "up";
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            move = "down";
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            move = "left";
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            move = "right";
            break;
        case 'Escape':
        case 'Backspace':
            uiUndo();
            return;
            break;
        default:
            return false;
    }

    /* Execute move on game board */
    if (game.moveExecute(move) == false) {
        return false;
    }

    /* Refresh board */
    uiGameRefresh(game);

    return false;
}


/*****************************************************************************
 * Register keyboard event handlers
 *****************************************************************************/
window.addEventListener("keydown",     uiKeyPressed);
