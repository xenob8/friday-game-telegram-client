import {Scenes} from "telegraf";
import {getBotClientByTgId} from "../utils";
import {ScenesEnum} from "./scenes";

export const changeRealNameScene = new Scenes.BaseScene<Scenes.SceneContext>(ScenesEnum.changeRealName);
changeRealNameScene.enter(ctx => ctx.reply("type ur name"))
changeRealNameScene.leave(ctx => ctx.reply("exiting changeRealName"));
changeRealNameScene.on("text", ctx => {
    console.log("change fiction name")
    const room = getBotClientByTgId(ctx.chat!.id).room
    room.send("changePlayerFictionName", {newFictionName: ctx.message.text, playerId: room.sessionId})
    ctx.reply(`ваше имя${ctx.message.text}`)
    ctx.scene.enter(ScenesEnum.gameRoom, {hasName: true, msgId: getBotClientByTgId(ctx.chat?.id).gameMsgId, name: ctx.message.text})
});





