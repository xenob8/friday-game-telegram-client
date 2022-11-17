import {getBotIdByRoom, handleState} from "../utils";
import {Room} from "colyseus.js";
import {bot, botClients} from "../bot";
import {BotClient} from "../types/botClient";
import {GameState} from "../types/gameState";
import {RoomStage} from "../types/roomStage";

export function addListeners(room: Room, tgId?: number | undefined) {
    console.log('joined!');
    const obj: BotClient = {
        telegramId: tgId ?? 777777,
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

    room.onStateChange(function (state) {
        const tgId = getBotIdByRoom(room)
        const json = state.toJSON() as GameState
        if (json.stage === RoomStage.Finished){
            bot.telegram.sendMessage(tgId, "игра завершена, выйдите, чтобы начать следующую")
        }
        handleState(room)
    });
}