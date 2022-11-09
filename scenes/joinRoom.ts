import {Scenes} from "telegraf";
import {startKB} from "../keyboards";
import {client} from "../setup";
import {botClients} from "../bot";

import {ScenesEnum} from "./scenes";
import {addListeners} from "../colyseus-client/listeners";

export const joinRoomScene = new Scenes.BaseScene<Scenes.SceneContext>(ScenesEnum.joinRoom);
joinRoomScene.enter(ctx => ctx.reply("Введите id комнаты, /back вернуться назад"));
joinRoomScene.leave(ctx => ctx.reply("exiting join", startKB));
joinRoomScene.command("back", Scenes.Stage.leave<Scenes.SceneContext>());
joinRoomScene.on("text", ctx => {
    client.joinById(ctx.message.text, {realName: ctx.from?.first_name ?? "No tg Name"}).then((r) => {
        addListeners(r, ctx.chat!.id)
        ctx.replyWithMarkdownV2(`joined to room with id is \`${r.id}\``)
        ctx.scene.enter(ScenesEnum.gameRoom, {init: true})
        console.log("clints after join", botClients)
    }).catch(() => ctx.reply("невалидный айди"))
});
