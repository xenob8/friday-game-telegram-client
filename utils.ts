import {bot, botClients} from "./bot";
import {BotClient} from "./types";
import {Room} from "colyseus.js";

export function addListeners(room: Room) {
    console.log('joined!');
    room.onMessage("*", (type, message) => {
        console.log("received message:", type, "=>", message);
    });

    room.onLeave(function () {
        console.log("leave room info:, ", room.sessionId)
        const id = botClients.find(el => el.room.sessionId === room.sessionId)!.telegramId
        bot.telegram.sendMessage(id, "YOU LEAVE")
        console.log("LEFT ROOM", arguments);
    });

    room.onStateChange(function (state) {
        const tg_id = getBotIdByRoom(room)
        const json = state.toJSON()
        const tgClient = getBotClient(tg_id)
        // if (tgClient.gameMsgId) {
        //     bot.telegram.editMessageText(tg_id, tgClient.gameMsgId, undefined, JSON.stringify(json))
        // } else {
        //     bot.telegram.sendMessage(tg_id, JSON.stringify(json))
        // }
        console.log("state change: ", json);
    });
}

export function getRoomByBotId(id: number): Room {
    return botClients.find(obj => obj.telegramId === id)!.room
}

export function getBotIdByRoom(room: Room): number {
    return botClients.find(obj => obj.room.sessionId === room.sessionId)!.telegramId
}

export function getBotClient(id: number): BotClient {
    console.log("GET BOT CLIENT, INPUT ID", id)
    console.log("GET BOT CLIENT, clients ", botClients)
    return botClients.find(obj => obj.telegramId === id)!
}



export function getMsgWithGameStateId(id: number): number {
    return getBotClient(id).gameMsgId!
}

export function editRoomStateMsg(id: number, text: string) {
    const clien = getBotClient(id)
    console.log("edit room state: client", clien)
    const msg_id = clien.gameMsgId
    console.log("edit room state: client_id", msg_id)

    bot.telegram.editMessageCaption(id, msg_id, undefined, text)
}