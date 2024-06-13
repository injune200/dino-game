import { CLIENT_VERSION } from './Constants.js';
import stages from "./assets/stage.json.js";
import stageItemList from "./assets/item_unlock.json.js";

const socket = io('http://localhost:3000', {
    query: {
        clientVersion: CLIENT_VERSION,
    },
});


let userId = null;
let currentStageId;
let currentStageData = stages.data[0];
let nextStageData = stages.data[1];
let currentStageItem;

socket.on('changeStage', (data) => {
    currentStageId = data.stageId;
    currentStageData = stages.data.find(element => element.id == currentStageId)
    currentStageItem = stageItemList.data.find(element => element.stage_id == currentStageId)
    nextStageData = stages.data[stages.data.findIndex(element => element.id == currentStageId) + 1]
    console.log(data);
    console.log("현재 스테이지: ", currentStageData)
    console.log("얻을수 있는 아이템 목록: ", currentStageItem.item_id)
    console.log("다음 스테이지: ", nextStageData)
});

socket.on("getItem", (data) => {
    console.log(data);
})

socket.on("response", (data) => {
    console.log(data);
})

socket.on('connection', (data) => {
    console.log('connection: ', data);
    userId = data.uuid;
});

const sendEvent = (handlerId, payload) => {
    socket.emit('event', {
        userId,
        clientVersion: CLIENT_VERSION,
        handlerId,
        payload,
    });
};

export { sendEvent, currentStageData, nextStageData, currentStageItem };
