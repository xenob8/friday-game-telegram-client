import {Context, Scenes, Telegraf, Telegram} from 'telegraf'

export class CustomContext extends Scenes.SceneContext {

    getId(...args: Parameters<Context['reply']>) {
        return this.chat!.id
    }
}