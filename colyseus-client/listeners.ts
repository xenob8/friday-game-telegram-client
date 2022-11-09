
import {handleState} from "../utils";
import {Room} from "colyseus.js";

export function addListeners(room: Room) {
    console.log('joined!');
    room.onMessage("*", (type, message) => {
        console.log("received message:", type, "=>", message);
    });

    room.onLeave(function () {
        console.log("leave room info:, ", room.sessionId)
        // const id = botClients.find(el => el.room.sessionId === room.sessionId)!.telegramId
        // bot.telegram.sendMessage(id, "YOU LEAVE")
        // console.log("LEFT ROOM", arguments);
    });

    room.onStateChange(function (state) {
        console.log("On state Change:", state.toJSON(), "roomSessoinId:", room.sessionId)
        // console.log("clients:", botClients)
        handleState(room)
    });
}