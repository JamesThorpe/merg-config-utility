import { cbusModule, configurationTab } from "./cbus-module";

export class CANACC4 implements cbusModule {
    get manufacturerId(): number {
        return 165;
    }
    get moduleId(): number {
        return 8;
    }
    get name(): string {
        return "CANACC4";
    }
    get configurationTabs(): configurationTab[] {
        return [
            {
                name: "General",
                items: [
                    {
                        name: "Recharge Time",
                        type: "numeric",
                        nv: 9
                    }, {
                        name: "Fire Delay",
                        type: "numeric",
                        nv: 10
                    }
                ]
            }, {
                name: "Output Timings",
                items: [
                    {
                        name: "Pulse Duration Output 1 A",
                        type: "numeric",
                        nv: 1
                    }, {
                        name: "Pulse Duration Output 1 B",
                        type: "numeric",
                        nv: 2
                    }, {
                        name: "Pulse Duration Output 2 A",
                        type: "numeric",
                        nv: 3
                    }, {
                        name: "Pulse Duration Output 2 B",
                        type: "numeric",
                        nv: 4
                    }, {
                        name: "Pulse Duration Output 3 A",
                        type: "numeric",
                        nv: 5
                    }, {
                        name: "Pulse Duration Output 3 B",
                        type: "numeric",
                        nv: 6
                    }, {
                        name: "Pulse Duration Output 4 A",
                        type: "numeric",
                        nv: 7
                    }, {
                        name: "Pulse Duration Output 4 B",
                        type: "numeric",
                        nv: 8
                    }                    
                ]
            }
        ]
    }
}