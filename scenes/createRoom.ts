import {Scenes} from "telegraf";
import {client} from "../setup";
import {addListeners} from "../colyseus-client/listeners";

export const createRoomScene = new Scenes.BaseScene<Scenes.SceneContext>("create:room");
createRoomScene.enter(ctx => {
    const name = ctx.from?.first_name ?? "Нет имя в телеге"
    ctx.reply(`привет ${name}`)

    client.create("game", {realName: name}).then(r => {
        addListeners(r, ctx.chat!.id);

        ctx.replyWithMarkdownV2(`Ваша комната создалась \n room id is \`${r.id}\``).
        then(() => ctx.scene.enter("game:room", {init: true}))
    })
});
