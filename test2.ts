import {Scenes, Telegraf} from "telegraf";
import {startKB} from "./keyboards";

const bot = new Telegraf<Scenes.SceneContext>("1925468575:AAH3nc-3dIUhZnnSQNrLLBZocGl5WfIcgUI");


// bot.telegram.sendMessage(480316781, "dfsfdfsdfsdf")
// bot.telegram.editMessageText(480316781,3011, undefined, "try rubles1")

bot.hears("lala", ctx=>{
    ctx.reply(`HAHAHAHA, ${ctx.message.message_id}`, startKB)
    ctx.reply("HAHAHAHA___")
})

bot.on("text", ctx => bot.telegram.editMessageReplyMarkup(480316781, parseInt(ctx.message.text), undefined, "changed"))

bot.launch()