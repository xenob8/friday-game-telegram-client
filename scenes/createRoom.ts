import {Scenes} from "telegraf";
import {client} from "../setup";
import {BotClient} from "../types";
import {botClients} from "../bot";
import {addListeners} from "../utils";

export const createRoomScene = new Scenes.BaseScene<Scenes.SceneContext>("create:room");
createRoomScene.enter(ctx => {

    client.create("game").then(r => {
        const obj: BotClient = {
            telegramId: ctx.chat!.id,
            room: r
        }
        console.log("room created", r.id)
        botClients.push(obj)
        console.log("create roomm clients:", botClients)
        ctx.replyWithMarkdownV2(`Ваша комната создалась \n room id is \`${r.id}\``).then(() => ctx.scene.enter("game:room"))
        addListeners(r);
        // ctx.scene.enter("game:room")
    })

});
