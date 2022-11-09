import {Scenes} from "telegraf";
import {InlineKeyBoardBuilder, startKB} from "../keyboards";
import {addListeners, getBotClient, handleState} from "../utils";
import {bot, botClients} from "../bot";
import {ScenesEnum} from "./scenes";
import {ChangeFictionNamePayload, SceneState} from "../types";
import {client} from "../setup";
import {changeFictionName} from "./changeFictionName";

export const gameRoomScene = new Scenes.BaseScene<Scenes.SceneContext>(ScenesEnum.gameRoom);
gameRoomScene.enter(ctx => {
    console.log("Мы в гейм руме")
    const state = ctx.scene.state as SceneState
    console.log("ctx state:", state)
    if (!state.hasName) {
        ctx.reply(`Вы в комнанте игры, /back вернуться назад, id msg ${ctx.message!.message_id}`,
            new InlineKeyBoardBuilder().
            typeName().exit().build()).then(ctx => {
                getBotClient(ctx.chat!.id).gameMsgId = ctx.message_id
                // handleState(getBotClient(ctx.chat!.id).room) // because skip join state change
        })
    }

});
gameRoomScene.leave(ctx => ctx.reply("exiting room", startKB));
gameRoomScene.command("back", ctx => ctx.scene.enter(ScenesEnum.joinRoom));
gameRoomScene.hears("покинуть комнату", ctx => {
    const room = botClients.find(obj => obj.telegramId === ctx.chat!.id)!.room
    room.connection.close()
    Scenes.Stage.leave<Scenes.SceneContext>()
})
gameRoomScene.action("realName", ctx => {
    ctx.answerCbQuery()
    ctx.scene.enter(ScenesEnum.changeRealName)

})

gameRoomScene.action(/.*/, ctx =>{
    ctx.answerCbQuery()
    ctx.reply("Да вы меня выбрали")
    ctx.scene.enter(ScenesEnum.changeFictionName,{targetId: ctx.callbackQuery.data, senderTgId: ctx.chat!.id } as ChangeFictionNamePayload)
})

gameRoomScene.hears("ввести имя", ctx => {
    ctx.scene.enter("room:changeRealName")
})


gameRoomScene.on("text", ctx => {
    ctx.reply(`game Room ${ctx.message.text}`)
});
