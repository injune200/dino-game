import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let gameAssets = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, "../../assets");

//파일 읽는 함수
const readFileAsync = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(basePath, filename), "utf8", (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(JSON.parse(data));
        })
    })
}


export const loadGameAssets = async () => { //gameAssets에 모든 에셋 정보 저장
    try {
        const [stages, items, itemUnlocks] = await Promise.all([
            readFileAsync("stage.json"),
            readFileAsync("item.json"),
            readFileAsync("item_unlock.json"),
        ])

        gameAssets = { stages, items, itemUnlocks }
        return gameAssets;
    } catch (e) {
        throw new Error("Failed to load : " + e.message);
    }
}




export const getGameAssets = () => {//gameAssets에 저장된 정보 모두 가져오기
    return gameAssets;
}