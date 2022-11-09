import {Scenes} from "telegraf";
import {InlineKeyBoardBuilder, startKB} from "../keyboards";
import {getBotClient} from "../utils";
import {bot, botClients} from "../bot";
import {ScenesEnum} from "./scenes";
import {SceneState} from "../types";

export const gameRoomScene = new Scenes.BaseScene<Scenes.SceneContext>(ScenesEnum.gameRoom);
gameRoomScene.enter(ctx => {
    const state = ctx.scene.state as SceneState
    console.log("ctx state:", state)
    if (!state.hasName) {
        ctx.reply(`Вы в комнанте игры, /back вернуться назад, id msg ${ctx.message!.message_id}`,
            new InlineKeyBoardBuilder().typeName().exit().build())
        getBotClient(ctx.chat!.id).gameMsgId = ctx.message!.message_id + 2
    } else {
        
        bot.telegram.editMessageText(ctx.chat?.id,
            getBotClient(ctx.chat!.id).gameMsgId,
            undefined,
            state.name ?? "no name",
            {reply_markup: new InlineKeyBoardBuilder().changeName().exit().build().reply_markup})

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

gameRoomScene.hears("ввести имя", ctx => {
    ctx.scene.enter("room:changeRealName")
})


gameRoomScene.on("text", ctx => {
    ctx.reply(`game Room ${ctx.message.text}`)
});
