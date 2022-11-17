import {Scenes, session} from "telegraf";
import {bot} from "./bot"
import {ReplyKeyBoardBuilder} from "./keyboards";
import {Client} from "colyseus.js";
import {changeRealNameScene} from "./scenes/changeRealName";
import {joinRoomScene} from "./scenes/joinRoom";
import {gameRoomScene} from "./scenes/gameRoom";
import {createRoomScene} from "./scenes/createRoom";
import {ScenesEnum} from "./scenes/scenes";
import {changeFictionName} from "./scenes/changeFictionName";
import {exitScene} from "./scenes/exit";
import 'dotenv/config'

const stage = new Scenes.Stage<Scenes.SceneContext>(
    [changeRealNameScene, joinRoomScene, gameRoomScene, createRoomScene, changeFictionName, exitScene])

export const client = new Client(process.env.SERVER);

bot.use(session());
bot.use(stage.middleware());

bot.start(ctx => ctx.reply("Hi", new ReplyKeyBoardBuilder().createRoomBtn().joinGameBtn().build().oneTime()))
bot.hears("присоединиться к игре", ctx => ctx.scene.enter(ScenesEnum.joinRoom))
bot.hears("создать комнату", ctx => ctx.scene.enter(ScenesEnum.createRoom))
bot.on("message", ctx => ctx.reply("Жми на кнопки"));