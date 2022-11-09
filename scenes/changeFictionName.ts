import {Scenes} from "telegraf";
import {ScenesEnum} from "./scenes";
import {getBotClientByTgId} from "../utils";
import {ChangeFictionNamePayload} from "../types";

export const changeFictionName = new Scenes.BaseScene<Scenes.SceneContext>(ScenesEnum.changeFictionName);
changeFictionName.enter(ctx => {
    console.log("enter fiction: ctx.state", ctx.scene.state)
    ctx.reply("type fiction name")
})
changeFictionName.leave(ctx => ctx.reply("exiting changeRealName"));
changeFictionName.on("text", ctx => {
    const state = ctx.scene.state as ChangeFictionNamePayload
    const room = getBotClientByTgId(state.senderTgId).room
    room.send("changePlayerFictionName", {newFictionName: ctx.message.text, playerId: state.targetId})
    ctx.scene.enter(ScenesEnum.gameRoom, {hasName: true})
});