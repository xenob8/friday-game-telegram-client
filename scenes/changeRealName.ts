import {Scenes} from "telegraf";
import {editRoomStateMsg, getBotClient, getRoomByBotId} from "../utils";
import {ScenesEnum} from "./scenes";

const {enter, leave} = Scenes.Stage;

export const changeRealNameScene = new Scenes.BaseScene<Scenes.SceneContext>(ScenesEnum.changeRealName);
changeRealNameScene.enter(ctx => ctx.reply("type ur name"))
changeRealNameScene.leave(ctx => ctx.reply("exiting changeRealName"));
changeRealNameScene.on("text", ctx => {
    const room = getRoomByBotId(ctx.chat.id)
    room.send("changePlayerFictionName", {newFictionName: ctx.message.text, playerId: room.sessionId})
    ctx.reply(`ваше имя${ctx.message.text}`)
    ctx.scene.enter(ScenesEnum.gameRoom, {hasName: true, msgId: getBotClient(ctx.chat?.id).gameMsgId, name: ctx.message.text})
});





