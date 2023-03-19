import { ILiteEvent, LiteEvent } from "../util/LiteEvent";
import { CbusStandardMessage, OpCode } from "./socket-messages";



let socket: WebSocket;

export type OpCodeMessage = {
    OpCode: OpCode,
    Text: string
};

let _standardMessageReceived = new LiteEvent<OpCodeMessage>();
let _standardMessageSent = new LiteEvent<OpCodeMessage>();

function _open(url: string):void {
     socket = new WebSocket(url);
     socket.onmessage = _message;
};

function _message(ev: MessageEvent<any>):void {
    const msg = JSON.parse(ev.data) as any;
    switch (msg.type) {
        case "cbus-standard": {
            const standardMsg = msg as CbusStandardMessage;
                        switch (standardMsg.direction) {
                case "received":
                    _standardMessageReceived.trigger({OpCode: standardMsg.opCode, Text: msg.text});
                    break;
                case "sent":
                    _standardMessageSent.trigger({OpCode: standardMsg.opCode, Text: msg.text});
                    break;
            }
        }
    }
    
}

export namespace Socket {
    export const open = _open;
    export const standardMessageReceived = _standardMessageReceived.expose();
    export const standardMessageSent = _standardMessageSent.expose();
}


