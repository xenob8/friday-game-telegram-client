import {Context, Markup, Scenes, session, Telegraf, Telegram} from "telegraf";
import {Client, Room} from "colyseus.js";
import {exitRoomKB, noNickExitKb, startKB} from "./keyboards";

const {enter, leave} = Scenes.Stage;


function editRoomStateMsg(id: number, text: string) {
    const clien = getBotClient(id)
    console.log("edit room state: client", clien)
    const msg_id = clien.gameMsgId
    console.log("edit room state: client_id", msg_id)

    bot.telegram.editMessageCaption(id, msg_id, undefined, text)
}


type BotClient = {
    telegramId: number,
    room: Room,
    gameMsgId?: number
}

const client = new Client('ws://localhost:3015');
const botClients: Array<BotClient> = []

const changeRealNameScene = new Scenes.BaseScene<Scenes.SceneContext>("room:changeRealName");
changeRealNameScene.enter(ctx => editRoomStateMsg(ctx.chat!.id, "type ur name"))
changeRealNameScene.leave(ctx => ctx.reply("exiting changeRealName"));
// changeRealNameScene.command("back", leave<Scenes.SceneContext>());
changeRealNameScene.on("text", ctx => {
    const room = getRoomByBotId(ctx.chat.id)
    console.log("room id", room.id)
    console.log("player id", room.sessionId)
    room.send("changePlayerFictionName", {newFictionName: ctx.message.text, playerId: room.sessionId})
    ctx.reply("Имя сменилось")
    ctx.scene.enter("game:room")
});

const createRoomScene = new Scenes.BaseScene<Scenes.SceneContext>("create:room");
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


const joinRoomScene = new Scenes.BaseScene<Scenes.SceneContext>("join:room");
joinRoomScene.enter(ctx => ctx.reply("Введите id комнаты, /back вернуться назад"));
joinRoomScene.leave(ctx => ctx.reply("exiting join", startKB));
joinRoomScene.command("back", leave<Scenes.SceneContext>());
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


const gameRoomScene = new Scenes.BaseScene<Scenes.SceneContext>("game:room");
gameRoomScene.enter(ctx => {
    console.log("context before reply", ctx.message!.message_id)
    console.log("context before reply", ctx.message)
    ctx.reply("Вы в комнанте игры, /back вернуться назад", noNickExitKb)
    getBotClient(ctx.chat!.id).gameMsgId = ctx.message?.message_id! + 2
    console.log("context after reply", ctx.message!.message_id)


});
gameRoomScene.leave(ctx => ctx.reply("exiting room", startKB));
gameRoomScene.command("back", ctx => ctx.scene.enter("join:room"));
gameRoomScene.hears("покинуть комнату", ctx => {
    console.log("botClients:", botClients)
    console.log("try to exit with telegram id:", ctx.chat.id)
    const room = botClients.find(obj => obj.telegramId === ctx.chat!.id)!.room
    room.connection.close()
    leave<Scenes.SceneContext>()
})
gameRoomScene.hears("lala", ctx => {
    console.log("lalal id:", ctx.message.message_id)
    editRoomStateMsg(ctx.chat.id, "DFDFDF")

})
gameRoomScene.hears("ввести имя", ctx => {
    ctx.scene.enter("room:changeRealName")
})


gameRoomScene.on("text", ctx => {
    ctx.reply(`game Room ${ctx.message.text}`)
});


const bot = new Telegraf<Scenes.SceneContext>("1925468575:AAH3nc-3dIUhZnnSQNrLLBZocGl5WfIcgUI");

const stage = new Scenes.Stage<Scenes.SceneContext>([changeRealNameScene, joinRoomScene, gameRoomScene, createRoomScene])

bot.use(session());
bot.use(stage.middleware());


bot.start(ctx => ctx.reply("Hi", startKB))
bot.hears("присоединиться к игре", ctx => ctx.scene.enter("join:room"))
bot.hears("создать комнату", ctx => ctx.scene.enter("create:room"))
bot.hears("lala", ctx => {
    ctx.reply("dfdfdf")
    bot.telegram.editMessageText(ctx.chat.id, ctx.message.message_id+1, undefined, "changed")
})
bot.on("message", ctx => ctx.reply("Try /login"));
bot.launch();


function addListeners(room: Room) {
    console.log('joined!');
    room.onMessage("*", (type, message) => {
        console.log("received message:", type, "=>", message);
    });

    room.onLeave(function () {
        console.log("leave room info:, ", room.sessionId)
        const id = botClients.find(el => el.room.sessionId === room.sessionId)!.telegramId
        bot.telegram.sendMessage(id, "YOU LEAVE")
        console.log("LEFT ROOM", arguments);
    });

    room.onStateChange(function (state) {
        const tg_id = getBotIdByRoom(room)
        const json = state.toJSON()
        const tgClient = getBotClient(tg_id)
        // if (tgClient.gameMsgId) {
        //     bot.telegram.editMessageText(tg_id, tgClient.gameMsgId, undefined, JSON.stringify(json))
        // } else {
        //     bot.telegram.sendMessage(tg_id, JSON.stringify(json))
        // }
        console.log("state change: ", json);
    });
}

function getRoomByBotId(id: number): Room {
    return botClients.find(obj => obj.telegramId === id)!.room
}

function getBotIdByRoom(room: Room): number {
    return botClients.find(obj => obj.room.sessionId === room.sessionId)!.telegramId
}

function getBotClient(id: number): BotClient {
    console.log("GET BOT CLIENT, INPUT ID", id)
    console.log("GET BOT CLIENT, clients ", botClients)
    return botClients.find(obj => obj.telegramId === id)!
}

function getMsgWithGameStateId(id: number): number {
    return getBotClient(id).gameMsgId!
}
