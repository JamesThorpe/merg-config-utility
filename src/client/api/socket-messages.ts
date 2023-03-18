import {components} from "./mcu-server"

export type OpCode = components["schemas"]["ICbusOpCode"];

export interface cbusStandardMessage {
    type: "cbus-standard",
    message: any,
    opCode: OpCode,
    direction: "received" | "sent"
}

export namespace OpCodes {
    export type RQNN = Omit<components["schemas"]["RequestNodeNumber"], "code"> & {code: "RQNN"};
    export type SNN = Omit<components["schemas"]["SetNodeNumber"], "code"> & {code: "SNN"};
}
