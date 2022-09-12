/*****************************************************************************
 * Move variables
 *****************************************************************************/
var cursor       = undefined;
var cursorStartX = undefined;
var cursorStartY = undefined;


/*****************************************************************************
 * Move helpers
 *****************************************************************************/
function uiMoveDirection(oldX, oldY, newX, newY) {
    if (Math.abs(newX - oldX) > Math.abs(newY - oldY)) {
        /* Horizontal movement (left<->right) */
        if (newX < oldX) {
            /* Left */
            if (newY < oldY) {
                return "left-up";
            } else {
                return "left-down";
            }
        } else {
            /* Right */
            if (newY < oldY) {
                return "right-up";
            } else {
                return "right-down";
            }
        }
    } else {
        /* Vertical movement (up<->down) */
        if (newY < oldY) {
            /* Up */
            if (newX < oldX) {
                return "up-left";
            } else {
                return "up-right";
            }
        } else {
            /* Down */
            if (newX < oldX) {
                return "down-left";
            } else {
                return "down-right";
            }
        }
    }

    return "";
}

function uiMovePosition(event) {
    let X, Y;

    switch (event.type) {
        case "mousedown":
        case "mousemove":
        case "mouseup":
        case "mouseleave":
            X = event.clientX;
            Y = event.clientY;
            break;
        case "touchstart":
        case "touchmove":
        case "touchend":
        case "touchcancel":
            /* Ignore if touched multiple fingers */
            if (event.targetTouches > 1) {
                return undefined;
            }

            X = event.touches[0].clientX;
            Y = event.touches[0].clientY;
            break;
        default:
            return undefined;
    }

    let rect = gameGrid.getBoundingClientRect();
    X -= rect.left;
    Y -= rect.top;

    return {X, Y};
}


/*****************************************************************************
 * Move event handlers
 *****************************************************************************/
function uiMoveStart(event) {
    /* Check that target is cursor */
    if (event.target.id != "cursor") {
        return false;
    }

    /* Save move start situation */
    cursor       = event.target;
    cursorStartX = parseFloat(cursor.style.left);
    cursorStartY = parseFloat(cursor.style.top);

    return false;
}

function uiMoveContinue(event) {
    if (cursor != undefined) {
        let move = "";

        /* Get event position */
        let pos = uiMovePosition(event);
        if (pos == undefined) {
            return false;
        }

        /* Calculate move delta */
        let deltaX = pos.X - cursorStartX;
        let deltaY = pos.Y - cursorStartY;


        /* Check if deltaX, deltaY possible */
        move = uiMoveDirection(0, 0, deltaX, deltaY);
        if (game.isLegalMove(move) == false) {
            deltaX = 0;
            deltaY = 0;
        }

        /* Snap to move direction */
        let cursorX = cursorStartX + deltaX;
        let cursorY = cursorStartY + deltaY;
        /* Snap to main direction */
        if (Math.abs(pos.X - cursorStartX) > Math.abs(pos.Y - cursorStartY)) {
            cursorY = cursorStartY + Math.sign(deltaY) * Math.abs(deltaX / 2);
        } else {
            cursorX = cursorStartX + Math.sign(deltaX) * Math.abs(deltaY / 2);
        }


        /* Start cursor movement if threshold exeeced */
        let startThreshold = 0.5;
        if (Math.abs(cursorX - cursorStartX) > gameGridCellSize * startThreshold ||
            Math.abs(cursorY - cursorStartY) > gameGridCellSize * startThreshold) {
            /* Move cursor */
            cursor.style.left = cursorX + "px";
            cursor.style.top  = cursorY + "px";
        } else {
            /* Keep cursor in center */
            cursor.style.left = cursorStartX + "px";
            cursor.style.top  = cursorStartY + "px";
        }

        /* Snap move if threshold exeeced */
        let snapThreshold = 1.8;
        if (Math.abs(cursorX - cursorStartX) > gameGridCellSize * snapThreshold ||
            Math.abs(cursorY - cursorStartY) > gameGridCellSize * snapThreshold) {
            /* Mave move on board */
            uiMoveExecute();

            /* Save new cursor start */
            cursorStartX = parseFloat(cursor.style.left);
            cursorStartY = parseFloat(cursor.style.top);
        }
    }

    return false;
}

function uiMoveExecute() {
    /* Find out move direction */
    let cursorX = parseFloat(cursor.style.left);
    let cursorY = parseFloat(cursor.style.top);
    let move = uiMoveDirection(cursorStartX, cursorStartY, cursorX, cursorY);

    /* Check if moved more than half grid cell */
    let moveThreshold = 1.0;
    if (Math.abs(cursorX - cursorStartX) > gameGridCellSize * moveThreshold ||
        Math.abs(cursorY - cursorStartY) > gameGridCellSize * moveThreshold) {
        /* Execute move on game board */
        game.moveExecute(move);
    }

    /* Refresh board */
    uiGameRefresh(game);

    return false;
}

function uiMoveEnd(event) {
    if (cursor != undefined) {
        /* Execute move */
        uiMoveExecute();
    }

    /* End move */
    cursor       = undefined;
    cursorStartX = undefined;
    cursorStartY = undefined;

    return false;
}

function uiMoveCancel(event) {
    /* Refresh board */
    uiGameRefresh(game);

    /* End move */
    cursor       = undefined;
    cursorStartX = undefined;
    cursorStartY = undefined;

    return false;
}


/*****************************************************************************
 * Register mouse event handlers
 *****************************************************************************/
window.addEventListener("mousedown",  uiMoveStart);
window.addEventListener("mousemove",  uiMoveContinue);
window.addEventListener("mouseup",    uiMoveEnd);
window.addEventListener("mouseleave", uiMoveCancel);


/*****************************************************************************
 * Register touch event handlers
 *****************************************************************************/
window.addEventListener("touchstart", uiMoveStart);
window.addEventListener("touchmove",  uiMoveContinue);
window.addEventListener("touchend",   uiMoveEnd);

