import { Fetcher } from "openapi-typescript-fetch";
import { paths } from "./mcu-server";

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
}

