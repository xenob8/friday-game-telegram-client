import {Telegraf, Markup} from "telegraf";
import {Client, Room} from "colyseus.js";

type BotClient = {
    telegramId: number,
    room: Room
}

const teleClients: Array<BotClient> = []

const client = new Client('ws://localhost:3015');

function addListeners(room: Room) {
    console.log('joined!');
    room.onMessage("*", (type, message) => {
        console.log("received message:", type, "=>", message);
    });

    room.onLeave(function () {
        console.log("leave room info:, ", room.sessionId)
        const id = teleClients.find(el => el.room.sessionId === room.sessionId)!.telegramId
        bot.telegram.sendMessage(id, "YOU LEAVE")
        console.log("LEFT ROOM", arguments);
    });

    room.onStateChange(function (state) {
        console.log("state change: ", state.toJSON());
    });
}


const BOT_TOKEN = "1925468575:AAH3nc-3dIUhZnnSQNrLLBZocGl5WfIcgUI"
if (!BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!');
const bot = new Telegraf(BOT_TOKEN);

const keyboard = Markup.inlineKeyboard([
    Markup.button.callback("createRoom", "create"),
    Markup.button.callback("leave", "leave"),
]);

bot.start(ctx => ctx.reply(`Hello ${ctx.from.id}`, keyboard));
bot.help(ctx => ctx.reply("Help message"));


bot.on('text', (ctx) => {  // use TextContext by default for bot.text
    client.joinById(ctx.message.text).then((r) => {
        const obj : BotClient = {
            telegramId: ctx.chat.id,
            room: r
        }
        teleClients.push(obj)
        console.log("join to room", r)
        ctx.replyWithMarkdownV2(`join to room with id is \`${r.id}\``)
        addListeners(r)
    })
})


bot.action("create", (ctx) => {
    client.create("game").then((r) => {
        const obj : BotClient = {
            telegramId: ctx.chat!.id,
            room: r
        }
        teleClients.push(obj)
        ctx.replyWithMarkdownV2(`room id is \`${r.id}\``)
        addListeners(r);
    });
});

bot.action("leave", ctx => {
    console.log(teleClients)
    const room = teleClients.find(obj => obj.telegramId === ctx.chat!.id)!.room
    room.connection.close()
})


bot.launch()