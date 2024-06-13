import { getGameAssets } from "../init/assets.js";
import { getItems, setItems } from "../models/item.model.js";

export const getItemScore = (userId, payload) => {
    const { stages, items, itemUnlocks } = getGameAssets();

    const currentStageId = payload.currentStageData.id
    const stageItemList = itemUnlocks.data.find(element => element.stage_id == currentStageId).item_id;

    if (!stageItemList.includes(payload.itemId)) {
        return { staus: "fail", message: "해당 스테이지에서는 얻을수 없는 아이템 입니다." }
    }

    const item = items.data.find(element => element.id == payload.itemId)

    if (item.score != payload.addScore) {
        return { staus: "fail", message: "아이템 획득 점수가 다릅니다." }
    }

    setItems(userId, currentStageId, payload.itemId);

    console.log("Items: ", getItems(userId));

    return { status: "success", message: "아이템 획득 문제 없음." };

}