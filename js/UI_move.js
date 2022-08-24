/*****************************************************************************
 * Move variables
 *****************************************************************************/
var frame       = undefined;
var frameStartX = undefined;
var frameStartY = undefined;


/*****************************************************************************
 * Move helpers
 *****************************************************************************/
function uiMoveDirection(newX, newY, oldX, oldY) {
    if (Math.abs(newX - oldX) > Math.abs(newY - oldY)) {
        /* Horizontal movement */
        if (newX < oldX) {
            return "left";
        } else {
            return "right";
        }
    } else {
        /* Vertical movement */
        if (newY < oldY) {
            return "up";
        } else {
            return "down";
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
    /* Check that target is frame */
    if (event.target.id != "frame") {
        return false;
    }

    /* Save move start situation */
    frame        = event.target;
    frameStartX = parseInt(frame.style.left, 10);
    frameStartY = parseInt(frame.style.top, 10);

    return false;
}

function uiMoveContinue(event) {
    if (frame != undefined) {
        let move = "";

        /* Get event position */
        let pos = uiMovePosition(event);
        if (pos == undefined) {
            return false;
        }

        /* Calculate move delta */
        let deltaX = pos.X - frameStartX;
        let deltaY = pos.Y - frameStartY;

        /* Check if deltaX, deltaY possible */
        move = uiMoveDirection(deltaX, 0, 0, 0);
        if (game.isLegalMove(move) == false) {
            deltaX = 0;
        }
        move = uiMoveDirection(0, deltaY, 0, 0);
        if (game.isLegalMove(move) == false) {
            deltaY = 0;
        }

        /* Check frame grid limits */
        if (deltaX > gameGridCellSize) {
            deltaX = gameGridCellSize;
        }
        if (deltaX < -gameGridCellSize) {
            deltaX = -gameGridCellSize;
        }
        if (deltaY > gameGridCellSize) {
            deltaY = gameGridCellSize;
        }
        if (deltaY < -gameGridCellSize) {
            deltaY = -gameGridCellSize;
        }

        /* Select horizontal or vertical direction */
        let frameX = frameStartX + deltaX;
        let frameY = frameStartY + deltaY;
        if (deltaX != 0 && deltaY != 0) {
            /* Snap to main direction */
            if (Math.abs(pos.X - frameStartX) > Math.abs(pos.Y - frameStartY)) {
                frameY = frameStartY;
            } else {
                frameX = frameStartX;
            }
        }

        /* Start frame movement if threshold exeeced */
        let startThreshold = 0.2;
        if (Math.abs(frameX - frameStartX) > gameGridCellSize * startThreshold ||
            Math.abs(frameY - frameStartY) > gameGridCellSize * startThreshold) {
            /* Move frame */
            frame.style.left = frameX + "px";
            frame.style.top  = frameY + "px";
        } else {
            /* Keep frame in center */
            frame.style.left = frameStartX + "px";
            frame.style.top  = frameStartY + "px";
        }

        /* Snap move if threshold exeeced */
        let snapThreshold = 0.8;
        if (Math.abs(frameX - frameStartX) > gameGridCellSize * snapThreshold ||
            Math.abs(frameY - frameStartY) > gameGridCellSize * snapThreshold) {
            /* Mave move on board */
            uiMoveExecute();

            /* Save new frame start */
            frameStartX = parseInt(frame.style.left, 10);
            frameStartY = parseInt(frame.style.top, 10);
        }
    }

    return false;
}

function uiMoveExecute() {
    /* Find out move direction */
    let frameX = parseInt(frame.style.left, 10);
    let frameY = parseInt(frame.style.top, 10);
    let move = uiMoveDirection(frameX, frameY, frameStartX, frameStartY);

    /* Check if moved more than half grid cell */
    if (Math.abs(frameX - frameStartX) >= gameGridCellSize/2 ||
        Math.abs(frameY - frameStartY) >= gameGridCellSize/2) {
        /* Execute move on game board */
        game.moveExecute(move);
    }

    /* Refresh board */
    uiGameRefresh(game);

    return false;
}

function uiMoveEnd(event) {
    if (frame != undefined) {
        /* Execute move */
        uiMoveExecute();
    }

    /* End move */
    frame       = undefined;
    frameStartX = undefined;
    frameStartY = undefined;

    return false;
}

function uiMoveCancel(event) {
    /* Refresh board */
    uiGameRefresh(game);

    /* End move */
    frame       = undefined;
    frameStartX = undefined;
    frameStartY = undefined;

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

