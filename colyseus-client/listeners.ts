import {getBotIdByRoom, handleState} from "../utils";
import {Room} from "colyseus.js";
import {bot, botClients} from "../bot";
import {BotClient} from "../types/botClient";
import {GameState} from "../types/gameState";
import {RoomStage} from "../types/roomStage";
import {Scenes} from "telegraf";
import {ScenesEnum} from "../scenes/scenes";

export function addListeners(room: Room, ctx: Scenes.SceneContext<Scenes.SceneSessionData>) {
    console.log('joined!');
    const obj: BotClient = {
        telegramId: ctx.chat!.id ?? 777777,
        room: room
    }
    botClients.push(obj)
    console.log("join player, clients:", botClients)

    room.onMessage("*", (type, message) => {
        console.log("received message:", type, "=>", message);
    });

    room.onLeave(function () {
        const delTgIdIndex = botClients.findIndex((el) => el.room === room)
        botClients.splice(delTgIdIndex, 1)
        console.log("clients after leave:", botClients)
        console.log("leave room info:, ", room.sessionId)
    });

    room.onStateChange(async function (state) {
        const tgId = getBotIdByRoom(room)
        const json = state.toJSON() as GameState
        if (json.stage === RoomStage.Finished) {
            await ctx.scene.enter(ScenesEnum.exit)
            bot.telegram.sendMessage(tgId, "игра завершена")
        }
        handleState(room)
    });
}