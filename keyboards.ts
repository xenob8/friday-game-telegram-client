import {Markup} from "telegraf";

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