import {Room} from "colyseus.js";

export type BotClient = {
    telegramId: number,
    room: Room,
    gameMsgId?: number
}

export type Player = {
    realName?: string,
    fictionName?: string
}

export type SceneState = {
    hasName? : boolean
    msgId? : number
    name? : string
}