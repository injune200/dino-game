import { getGameAssets } from "../init/assets.js";
import { getStage, setStage } from "../models/stage.model.js"


export const moveStageHandler = (userId, payload) => {

    //유저는 스테이지를 하나씩 올라갈 수있다.
    //유저는 일정 점수가 되면 다음 스테이지로 이동한다.

    let currentStages = getStage(userId);
    if (!currentStages.length) {
        return { status: "fail", message: " No stages found for user" }
    }

    // 오름차순 -> 가장 큰 스테이지 iD를 확인 <- 유저의 현재 스테이지
    currentStages.sort((a, b) => a.id - b.id);
    const currentStage = currentStages[currentStages.length - 1];

    //클라이언트 vs 서버 비교
    if (currentStage.id !== payload.currentStage.id) {
        return { staus: "fail", message: "Current Stage mismatch" }
    }


    //점수 검증
    const serverTime = Date.now();
    const eleapsedTime = (serverTime - currentStage.timestamp) / 1000;
    const scoreGapTime = (payload.targetStage.score - payload.currentStage.score) / payload.currentStage.scorePerSecond;

    // 1스테이지 -> 2스테이지로 넘어가는 가정
    //5 => 임의로 정한 오차범위
    // if (eleapsedTime < scoreGapTime || eleapsedTime > scoreGapTime + payload.currentStage.scorePerSecond) {
    //     return { status: "fail", message: "INvalid elapsed time" };
    // }

    //targetStage 대한 검증 <- 게임에셋에 존재하는가?
    const { stages } = getGameAssets();
    if (!stages.data.some((stage) => stage.id === payload.targetStage.id)) {
        return { status: "fail", message: "Target stage not found" };
    }

    setStage(userId, payload.targetStage.id, serverTime);

    console.log("Stage: ", currentStages);

    return { status: "success", message: "스테이지 변경 문제 없음.", stageId: payload.targetStage.id };
}