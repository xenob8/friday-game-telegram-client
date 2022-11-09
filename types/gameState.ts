import {Player} from "./player";

export type GameState = {
    ownerId: string,
    stage?: string,
    players: { [key: string]: Player }
}