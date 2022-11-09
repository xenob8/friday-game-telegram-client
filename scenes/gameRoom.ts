import {Scenes} from "telegraf";
import {InlineKeyBoardBuilder, ReplyKeyBoardBuilder, startKB} from "../keyboards";
import {getBotClientByTgId, handleState} from "../utils";
import {botClients} from "../bot";
import {ScenesEnum} from "./scenes";
import {MessageType} from "../types/messageType";
import {RoomStage} from "../types/roomStage";
import {SceneState} from "../types/sceneState";
import {ChangeFictionNamePayload} from "../types/changeFictionNamePayload";

export const gameRoomScene = new Scenes.BaseScene<Scenes.SceneContext>(ScenesEnum.gameRoom);
gameRoomScene.enter(ctx => {
    console.log("you in game room", new ReplyKeyBoardBuilder().exit().build())
    const state = ctx.scene.state as SceneState
    if (state.init) {
        ctx.reply(`Вы в комнанте игры, /back вернуться назад, id msg ${ctx.message!.message_id}`,
            new InlineKeyBoardBuilder().exit().build()).then(ctx => {
            getBotClientByTgId(ctx.chat!.id).gameMsgId = ctx.message_id
            handleState(getBotClientByTgId(ctx.chat!.id).room) // because skip join state change
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

gameRoomScene.action("start", ctx => {
    ctx.reply("игра начата")
    getBotClientByTgId(ctx.chat!.id).room.send(MessageType.ChangeGameStage, {newStage: RoomStage.Guessing})
})

gameRoomScene.action("exit", ctx => {
    ctx.reply("exiting handler")
    ctx.answerCbQuery()
    getBotClientByTgId(ctx.chat!.id).room.leave()
    // const delTgIdIndex = botClients.findIndex((el) => el.telegramId === ctx.chat!.id)
    // botClients.splice(delTgIdIndex, 1)
    // console.log("clients after leave:", botClients)
    ctx.scene.leave()
})

gameRoomScene.action(/.*/, ctx => {
    ctx.answerCbQuery()
    ctx.reply("Да вы меня выбрали")
    ctx.scene.enter(ScenesEnum.changeFictionName, {
        targetId: ctx.callbackQuery.data,
        senderTgId: ctx.chat!.id
    } as ChangeFictionNamePayload)
})

gameRoomScene.hears("ввести имя", ctx => {
    ctx.scene.enter("room:changeRealName")
})

gameRoomScene.hears("выйти из комнаты", ctx => ctx.scene.leave())

gameRoomScene.on("text", ctx => {
    ctx.reply(`вы в игровой комнате ${ctx.message.text}`, new ReplyKeyBoardBuilder().exit().build())
});
