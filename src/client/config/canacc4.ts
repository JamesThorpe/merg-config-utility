import { CbusModule, ConfigurationTab } from "./cbus-module";

export class CanAcc4 implements CbusModule {
    get manufacturerId(): number {
        return 165;
    }
    get moduleId(): number {
        return 8;
    }
    get name(): string {
        return "CANACC4";
    }
    get expectWrack(): boolean {
        return false;
    }
    get configurationTabs(): ConfigurationTab[] {
        return [
            {
                name: "General",
                items: [
                    {
                        name: "Recharge Time",
                        type: "numeric",
                        nv: 9,
                        scale: 10,
                        units: "ms"
                    }, {
                        name: "Fire Delay",
                        type: "numeric",
                        nv: 10,
                        //TODO: verify scale & units - wiki doesn't mention them for this NV
                        scale: 10,
                        units: "ms"
                    }
                ]
            }, {
                name: "Output Timings",
                items: [
                    {
                        name: "Pulse Duration Output 1 A",
                        type: "numeric",
                        nv: 1,
                        units: "ms",
                        scale: 10
                    }, {
                        name: "Pulse Duration Output 1 B",
                        type: "numeric",
                        nv: 2,
                        units: "ms",
                        scale: 10
                    }, {
                        name: "Pulse Duration Output 2 A",
                        type: "numeric",
                        nv: 3,
                        units: "ms",
                        scale: 10
                    }, {
                        name: "Pulse Duration Output 2 B",
                        type: "numeric",
                        nv: 4,
                        units: "ms",
                        scale: 10
                    }, {
                        name: "Pulse Duration Output 3 A",
                        type: "numeric",
                        nv: 5,
                        units: "ms",
                        scale: 10
                    }, {
                        name: "Pulse Duration Output 3 B",
                        type: "numeric",
                        nv: 6,
                        units: "ms",
                        scale: 10
                    }, {
                        name: "Pulse Duration Output 4 A",
                        type: "numeric",
                        nv: 7,
                        units: "ms",
                        scale: 10
                    }, {
                        name: "Pulse Duration Output 4 B",
                        type: "numeric",
                        nv: 8,
                        units: "ms",
                        scale: 10
                    }                    
                ]
            }
        ]
    }
}