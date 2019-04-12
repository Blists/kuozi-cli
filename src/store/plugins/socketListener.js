import io from "socket.io-client";
import { socket } from "../../../config/project/project.env";
import msgHandler from "../handler/msgHandler";
let initConn = store => {
    let conn = io(socket);
    conn.on("connect", () => {
        console.log("connect");
    });
    conn.on("message", message => {
        msgHandler(message);
    });
    conn.on("disconnect", () => {
        console.log("disconnect");
    });
    conn.on("error", error => {
        console.log(error);
    });
    return conn;
};

export default function webImlistener() {
    return store => {
        store.state.socket.conn = initConn(store);
    };
}
