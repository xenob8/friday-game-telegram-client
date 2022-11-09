import {Scenes, session} from "telegraf";
import {bot} from "./bot"
import {ReplyKeyBoardBuilder, startKB} from "./keyboards";
import {Client} from "colyseus.js";
import {changeRealNameScene} from "./scenes/changeRealName";
import {joinRoomScene} from "./scenes/joinRoom";
import {gameRoomScene} from "./scenes/gameRoom";
import {createRoomScene} from "./scenes/createRoom";
import {ScenesEnum} from "./scenes/scenes";
import {changeFictionName} from "./scenes/changeFictionName";

const stage = new Scenes.Stage<Scenes.SceneContext>([changeRealNameScene, joinRoomScene, gameRoomScene, createRoomScene, changeFictionName])

export const client = new Client('ws://localhost:3015');

bot.use(session());
bot.use(stage.middleware());

bot.start(ctx => ctx.reply("Hi", new ReplyKeyBoardBuilder().createRoomBtn().joinGameBtn().build()))
bot.hears("присоединиться к игре", ctx => ctx.scene.enter(ScenesEnum.joinRoom))
bot.hears("создать комнату", ctx => ctx.scene.enter(ScenesEnum.createRoom))
bot.hears("lala", ctx => {
    ctx.reply("dfdfdf")
    bot.telegram.editMessageText(ctx.chat.id, ctx.message.message_id+1, undefined, "changed")
})
bot.on("message", ctx => ctx.reply("Try /login"));