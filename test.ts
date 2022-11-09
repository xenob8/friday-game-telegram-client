import { Telegraf, Markup } from "telegraf";

const bot = new Telegraf("1925468575:AAH3nc-3dIUhZnnSQNrLLBZocGl5WfIcgUI");

bot.use(Telegraf.log());


bot.command("random", ctx => {
    return ctx.reply(
        "random example",
        Markup.inlineKeyboard([
            Markup.button.callback("Coke", "Coke"),
            Markup.button.callback("Dr Pepper", "Dr Pepper", Math.random() > 0.5),
            Markup.button.callback("Pepsi", "Pepsi"),
        ]),
    );
});


bot.action("Dr Pepper", (ctx, next) => {
    return ctx.reply("👍").then(() =>{
        next()
    });
});

bot.action(("Dr Pepper"), ctx => {
    return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great pidor`);
});

bot.action(/.+/, ctx => {
    return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`);
});

bot.launch();