import {components} from "./mcu-server"

export type OpCode = components["schemas"]["ICbusOpCode"];

export interface CbusStandardMessage {
    type: "cbus-standard",
    message: any,
    opCode: OpCode,
    direction: "received" | "sent",
    text: string
}