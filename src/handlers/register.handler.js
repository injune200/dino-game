import { addUser } from "../models/user.model.js";
import { v4 as uuidv4 } from "uuid";
import { handleConnection, handleDisconnect, handlerEvent } from "./helper.js";

const registerHandler = (io) => {
    io.on('connection', (socket) => {
        // 최초 커넥션을 맺은 이후 발생하는 각종 이벤트를 처리하는 곳

        const userUUID = uuidv4();
        addUser({ uuid: userUUID, socketId: socket.id });

        handleConnection(socket, userUUID);

        socket.on("event", (data) => {
            handlerEvent(io, socket, data);
        })

        socket.on("dissconnect", (socket) => { //해제하기 까지 대기하는
            handleDisconnect(socket, userUUID);

        });
    });
};

export default registerHandler;