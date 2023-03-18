import { ILiteEvent, LiteEvent } from "../util/LiteEvent";
import { cbusStandardMessage, OpCode } from "./socket-messages";

let socket: WebSocket;

let _standardMessageReceived = new LiteEvent<OpCode>();
let _standardMessageSent = new LiteEvent<OpCode>();

function _open(url: string):void {
     socket = new WebSocket(url);
     socket.onmessage = _message;
};

function _message(ev: MessageEvent<any>):void {
    //{"Type":"cbus","Message":{"Data":"kQEBAAU=","IsExtended":false,"Length":5},"OpCode":{"Code":"ACOF","Description":"Indicates an ‘OFF’ event using the full event number of 4 bytes. (long event).","Group":1,"Name":"Accessory Off","Number":145,"Priority":3,"NodeNumber":257,"EventNumber":5,"IsLongEvent":true,"IsShortEvent":false,"IsOnEvent":false,"IsOffEvent":true,"DataLength":4,"Message":{"Data":"kQEBAAU=","IsExtended":false,"Length":5}},"Direction":"received"}
    const msg = JSON.parse(ev.data) as any;
    switch (msg.type) {
        case "cbus-standard": {
            const standardMsg = msg as cbusStandardMessage;
            switch (standardMsg.direction) {
                case "received":
                    _standardMessageReceived.trigger(standardMsg.opCode);
                    break;
                case "sent":
                    _standardMessageSent.trigger(standardMsg.opCode);
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


