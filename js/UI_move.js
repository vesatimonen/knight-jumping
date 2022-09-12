/*****************************************************************************
 * Move variables
 *****************************************************************************/
var cursor       = undefined;
var cursorStartX = undefined;
var cursorStartY = undefined;


/*****************************************************************************
 * Move helpers
 *****************************************************************************/
function uiMoveDirection(newX, newY, oldX, oldY) {
    if (Math.abs(newX - oldX) > Math.abs(newY - oldY)) {
        /* Horizontal movement */
        if (newX < oldX) {
            return "left-up";
        } else {
            return "right-down";
        }
    } else {
        /* Vertical movement */
        if (newY < oldY) {
            return "up-right";
        } else {
            return "down-left";
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

    let rect = gameGrid.getBoundingClientRect()
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
    cursorStartX = parseInt(cursor.style.left, 10);
    cursorStartY = parseInt(cursor.style.top, 10);

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
/*
        move = uiMoveDirection(deltaX, 0, 0, 0);
        if (game.isLegalMove(move) == false) {
            deltaX = 0;
        }
        move = uiMoveDirection(0, deltaY, 0, 0);
        if (game.isLegalMove(move) == false) {
            deltaY = 0;
        }
*/

        /* Check cursor grid limits */
/*
        if (deltaX > 2*gameGridCellSize) {
            deltaX = 2*gameGridCellSize;
        }
        if (deltaX < -2*gameGridCellSize) {
            deltaX = -2*gameGridCellSize;
        }
        if (deltaY > 2*gameGridCellSize) {
            deltaY = 2*gameGridCellSize;
        }
        if (deltaY < -2*gameGridCellSize) {
            deltaY = -2*gameGridCellSize;
        }
*/

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
        let startThreshold = 0.2;
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
            cursorStartX = parseInt(cursor.style.left, 10);
            cursorStartY = parseInt(cursor.style.top, 10);
        }
    }

    return false;
}

function uiMoveExecute() {
    /* Find out move direction */
    let cursorX = parseInt(cursor.style.left, 10);
    let cursorY = parseInt(cursor.style.top, 10);
    let move = uiMoveDirection(cursorX, cursorY, cursorStartX, cursorStartY);

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

