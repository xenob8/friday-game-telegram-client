import {Scenes, Telegraf} from "telegraf";
import {BotClient} from "./types/botClient";
import 'dotenv/config'

export const bot = new Telegraf<Scenes.SceneContext>(process.env.TOKEN ?? "token");
export let botClients: Array<BotClient> = []
