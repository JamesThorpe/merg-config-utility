import { Fetcher } from "openapi-typescript-fetch";
import { paths, components } from "./mcu-server";

const fetcher = Fetcher.for<paths>();

/**
 * Sets the base URL of the mcu-server API.
 * @param url The base URL of the mcu-server API.
 */
export function setBaseUrl(url: string) {
    fetcher.configure({
        baseUrl: url
    });
}



/**
 * Methods relating to the connection to a CBUS network.
 */
export namespace CbusConnection {
    /**
     * Gets a list of the available COM/Serial ports on the server.
     */
    export const getComPorts = fetcher.path("/CbusConnection/GetComPorts").method("get").create();
    export const connect = fetcher.path("/CbusConnection/Connect").method("post").create();
    export const send = fetcher.path("/CbusConnection/Send").method("post").create();
    export const status = fetcher.path("/CbusConnection/Status").method("get").create();
}

export namespace CbusNodes {
    export const SetNodeNumber = fetcher.path("/Node/SetNodeNumber").method("post").create();
    export const QueryNodes = fetcher.path("/Node/QueryNodes").method("get").create();
    export const ReadNodeParameters = fetcher.path("/Node/ReadNodeParameters/{nodeNumber}").method("get").create();
    export const ReadNodeVariables = fetcher.path("/Node/ReadNodeVariables/{nodeNumber}/{variableCount}").method("get").create();
    export const UpdateNodeVariables = fetcher.path("/Node/UpdateNodeVariables").method("post").create();
}

export namespace OpCodes {
    export type RQNN = Omit<components["schemas"]["RequestNodeNumber"], "code"> & {code: "RQNN"};
    export type SNN = Omit<components["schemas"]["SetNodeNumber"], "code"> & {code: "SNN"};
    export type PNN = Omit<components["schemas"]["ResponseToQueryNode"], "code"> & {code: "PNN"};
}
