import {Scenes} from "telegraf";
import {client} from "../setup";
import {botClients} from "../bot";
import {getBotClientByTgId} from "../utils";
import {addListeners} from "../colyseus-client/listeners";
import {BotClient} from "../types/botClient";

export const createRoomScene = new Scenes.BaseScene<Scenes.SceneContext>("create:room");
createRoomScene.enter(ctx => {
    const name = ctx.from?.first_name ?? "Нет имя в телеге"
    ctx.reply(`привет ${name}`)

    client.create("game", {realName:name}).then(r => {
        const obj: BotClient = {
            telegramId: ctx.chat!.id,
            room: r
        }
        console.log("room created", r.id)
        botClients.push(obj)
        console.log("create roomm clients:", botClients)
        ctx.replyWithMarkdownV2(`Ваша комната создалась \n room id is \`${r.id}\``).
        then(() => ctx.scene.enter("game:room"))
        addListeners(getBotClientByTgId(ctx.chat!.id).room);
    })
});
