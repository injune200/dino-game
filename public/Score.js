import { sendEvent } from "./Socket.js";
import stages from "./assets/stage.json.js"
import items from "./assets/item.json.js"
import "./Socket.js"
import { currentStageData, nextStageData } from './Socket.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.score += currentStageData.scorePerSecond * deltaTime * 0.001;
    // 점수가 스테이지 별 점수 이상이 될 시 서버에 메세지 전송
    if (currentStageData.id != stages.data[stages.data.length - 1].id) { // 마지막 스테이지 제외
      if (Math.floor(this.score) >= nextStageData.score) {
        this.stageChange = false;
        sendEvent(11, { currentStage: currentStageData, targetStage: nextStageData });
      }
    }

  }

  getItem(itemId) {
    let addScore = items.data.find(element => element.id == itemId).score
    console.log("아이템 아이디: ", itemId, ", 추가 점수: ", addScore)
    this.score += addScore;
    sendEvent(12, { currentStageData, itemId, addScore, currentScore: this.score });
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
