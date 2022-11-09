import {Room} from "colyseus.js";


export type BotClient = {
    telegramId: number,
    room: Room,
    gameMsgId?: number
}