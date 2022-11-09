import {Markup} from "telegraf";
import {InlineKeyboardButton} from "typegram/markup";
import {Player} from "./types";

export class ReplyKeyBoardBuilder {
    buttons: string[] = []


    createRoomBtn() {
        this.buttons.push("создать комнату")
        return this
    }

    joinGameBtn() {
        this.buttons.push("присоединиться к игре")
        return this
    }

    build() {
        return Markup.keyboard(this.buttons);
    }
}

export class InlineKeyBoardBuilder {
    buttons: InlineKeyboardButton[] = []

    exit() {
        this.buttons.push({text: "exit", callback_data: "exit"})
        return this
    }

    changeName() {
        this.buttons.push({text: "Сменить ваше имя", callback_data: "realName"})
        return this
    }

    addPlayers(players: { [key: string]: Player } | undefined) {
        if (!players) return this
        Object.entries(players).forEach(
            ([player_id, value]) => this.buttons.push({text: `${value.realName ?? "-"}, кто: ${value.fictionName ?? "-"}`, callback_data: player_id})
        )
        return this
    }

    typeName() {
        this.buttons.push({text: "Введите ваше имя", callback_data: "realName"})
        return this
    }

    build() {
        return Markup.inlineKeyboard(this.buttons)
    }

}

export const startKB = Markup.keyboard([
    ["создать комнату"],
    ["присоединиться к игре"],
])
    .oneTime()
    .resize()


export const noNickExitKb = Markup.keyboard([
    ["ввести имя"],
    ["покинуть комнату"],
])
    .oneTime()
    .resize()


export const exitRoomKB = Markup.keyboard([
    ["покинуть комнату"],
])
    .oneTime()
    .resize()