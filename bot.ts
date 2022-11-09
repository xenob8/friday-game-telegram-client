import {Scenes, Telegraf} from "telegraf";
import {BotClient} from "./types";
import {CustomContext} from "./customContext";

// export const bot = new Telegraf<Scenes.SceneContext>("1925468575:AAH3nc-3dIUhZnnSQNrLLBZocGl5WfIcgUI", {contextType: CustomContext});
export const bot = new Telegraf<Scenes.SceneContext>("1925468575:AAH3nc-3dIUhZnnSQNrLLBZocGl5WfIcgUI");
export const botClients: Array<BotClient> = []
