import {bot, botClients} from "./bot";
import {BotClient, GameState} from "./types";
import {Room} from "colyseus.js";
import {InlineKeyBoardBuilder} from "./keyboards";


export function handleState(room: Room) {
    const state = room.state
    const tg_id = getBotIdByRoom(room)
    const json = state.toJSON() as GameState
    console.log("HANDLE STATE:", json, "roomSessoinId:", room.sessionId)
    const tgClient = getBotClientByTgId(tg_id)
    const urName = json.players[room.sessionId]?.realName ?? "loading"
    delete json.players[room.sessionId]
    if (tgClient.gameMsgId) {
        bot.telegram.editMessageText(tg_id,
            tgClient.gameMsgId,
            undefined,
            `ваше имя ${urName} `,
            {
                reply_markup: new InlineKeyBoardBuilder()
                    .addPlayers(json.players)
                    .exit().build().reply_markup
            }).catch(console.log)
    }
}

export function getBotIdByRoom(room: Room): number {
    return botClients.find(obj => obj.room.sessionId === room.sessionId)!.telegramId
}

export function getBotClientByTgId(id: number): BotClient {
    return botClients.find(obj => obj.telegramId === id)!
}