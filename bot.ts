import {Scenes, Telegraf} from "telegraf";
import {BotClient} from "./types/botClient";

export const bot = new Telegraf<Scenes.SceneContext>("1925468575:AAH3nc-3dIUhZnnSQNrLLBZocGl5WfIcgUI");
export let botClients: Array<BotClient> = []
