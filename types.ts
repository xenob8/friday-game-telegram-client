import {Room} from "colyseus.js";

export type BotClient = {
    telegramId: number,
    room: Room,
    gameMsgId?: number
}

export type Player = {
    realName: "Real Name",
    fictionName:"Fiction name"
}

export type ChangeFictionNamePayload = {
    targetId : string
    senderTgId: number
}

export type SceneState = {
    hasName? : boolean
    msgId? : number
    name? : string
}

export type GameState = {
    ownerId: string,
    stage?: string,
    players: {[key: string]: Player}
}