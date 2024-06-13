import { gameStart, gameEnd } from "./game.handler.js";
import { getItemScore } from "./getScore.handler.js";
import { moveStageHandler } from "./stage.handler.js";


const handlerMappings = {
    2: gameStart,
    3: gameEnd,
    11: moveStageHandler,
    12: getItemScore
};

export default handlerMappings