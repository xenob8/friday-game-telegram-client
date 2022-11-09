import {Scenes} from "telegraf";
import {ScenesEnum} from "./scenes";
import {getBotClientByTgId} from "../utils";

export const exitScene = new Scenes.BaseScene<Scenes.SceneContext>(ScenesEnum.exit);
exitScene.enter(ctx => {
    getBotClientByTgId(ctx.chat!.id).room.leave()
    ctx.scene.leave()
})
