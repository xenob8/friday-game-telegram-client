import {Scenes} from "telegraf";
import {client} from "../setup";
import {addListeners} from "../colyseus-client/listeners";
import {Room} from "colyseus.js";

export const createRoomScene = new Scenes.BaseScene<Scenes.SceneContext>("create:room");
createRoomScene.enter(async ctx => {
    const name = ctx.from?.first_name ?? "Нет имя в телеге"
    ctx.reply(`привет ${name}`)

    let r = await client.create("game", {realName: name})
    addListeners(r, ctx);
    await ctx.replyWithMarkdownV2(`Ваша комната создалась \n room id is \`${r.id}\``)
    ctx.scene.enter("game:room", {init: true})

});
