
import {getBotIdByRoom, handleState} from "../utils";
import {Room} from "colyseus.js";
import {bot, botClients} from "../bot";
import {BotClient} from "../types/botClient";
import {GameState} from "../types/gameState";
import {RoomStage} from "../types/roomStage";
import {gameRoomScene} from "../scenes/gameRoom";

export function addListeners(room: Room, tgId?: number | undefined) {
    console.log('joined!');
    room.onMessage("*", (type, message) => {
        console.log("received message:", type, "=>", message);
    });

    room.state.players.onAdd = (player:any, key:any) => {
        if (room.sessionId === key){
            const obj: BotClient = {
                telegramId: tgId ?? 777777,
                room: room
            }
            botClients.push(obj)
            console.log("join player, clients:", botClients)
        }
    }

    // room.state.players.onRemove = (player, key) => {
    //     console.log(player, "has been removed at", key);
    //
    // };

    room.onLeave(function () {
        const delTgIdIndex = botClients.findIndex((el) => el.room === room)
        botClients.splice(delTgIdIndex, 1)
        console.log("clients after leave:", botClients)
        console.log("leave room info:, ", room.sessionId)
    });

    room.onStateChange(function (state) {
        const tg_id = getBotIdByRoom(room)
        const json = state.toJSON() as GameState
        if (json.stage === RoomStage.Finished){
            bot.telegram.sendMessage(tg_id, "игра завершена, выйдите, чтобы начать следующую")
        }
        // console.log("On state Change:", state.toJSON(), "roomSessoinId:", room.sessionId)
        // console.log("clients:", botClients)
        handleState(room)
    });
}