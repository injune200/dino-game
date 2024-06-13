import { CLIENT_VERSION } from "../constants.js";
import { getGameAssets } from "../init/assets.js";
import { createItems } from "../models/item.model.js";
import { createStage, getStage, setStage } from "../models/stage.model.js";
import { getUser, removeUser } from "../models/user.model.js";
import handlerMappings from "./handlerMapping.js";

export const handleDisconnect = (socket, uuid) => {
    removeUser(socket.id);
    console.log(`User disconnected: ${socket.id}`);
    console.log("Current users: ", getUser());
}

export const handleConnection = (socket, uuid) => {
    console.log(`New user connected!: ${uuid} with socket ID ${socket.id}`);
    console.log("Current users: ", getUser());

    createStage(uuid);
    createItems(uuid);

    socket.emit("connection", { uuid });
}

export const handlerEvent = (io, socket, data) => {
    if (!CLIENT_VERSION.includes(data.clientVersion)) {
        socket.emit("response", { status: "fail", message: "Clinet version mismatch" });

        return;
    }

    const handler = handlerMappings[data.handlerId];
    if (!handler) {
        socket.emit("response", { status: "fail", message: "Handler not found" })
        return;
    }

    const response = handler(data.userId, data.payload);

    if (response.broadcast) {
        io.emit("response", "broadcast");
        return;
    }

    if (data.handlerId == 2 || data.handlerId == 11) {
        socket.emit("changeStage", response); //반응
        return;
    } else if (data.handlerId == 12) {
        socket.emit("getItem", response); //반응
    } else {
        socket.emit("response", response);
    }

}