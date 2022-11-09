
import {getBotIdByRoom, handleState} from "../utils";
import {Room} from "colyseus.js";
import {botClients} from "../bot";

export function addListeners(room: Room) {
    console.log('joined!');
    room.onMessage("*", (type, message) => {
        console.log("received message:", type, "=>", message);
    });

    room.onLeave(function () {
        const delTgIdIndex = botClients.findIndex((el) => el.room === room)
        botClients.splice(delTgIdIndex, 1)
        console.log("clients after leave:", botClients)
        console.log("leave room info:, ", room.sessionId)
    });

    room.onStateChange(function (state) {
        console.log("On state Change:", state.toJSON(), "roomSessoinId:", room.sessionId)
        // console.log("clients:", botClients)
        handleState(room)
    });
}