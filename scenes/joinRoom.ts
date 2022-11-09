import {Scenes} from "telegraf";
import {startKB} from "../keyboards";
import {client} from "../setup";
import {BotClient} from "../types";
import {botClients} from "../bot";
import {addListeners} from "../utils";

export const joinRoomScene = new Scenes.BaseScene<Scenes.SceneContext>("join:room");
joinRoomScene.enter(ctx => ctx.reply("Введите id комнаты, /back вернуться назад"));
joinRoomScene.leave(ctx => ctx.reply("exiting join", startKB));
joinRoomScene.command("back", Scenes.Stage.leave<Scenes.SceneContext>());
joinRoomScene.on("text", ctx => {
    client.joinById(ctx.message.text).then((r) => {
        const obj: BotClient = {
            telegramId: ctx.chat.id,
            room: r
        }
        botClients.push(obj)
        console.log("join to room", r)
        ctx.replyWithMarkdownV2(`joined to room with id is \`${r.id}\``)
        addListeners(r)
        ctx.scene.enter("game:room")
    })
});
