import { CbusModule, ConfigurationTab, GroupConfigurationItem } from "./cbus-module";

function generateGeneralInput(index: number):GroupConfigurationItem {
    return {
        type: "group",
        groupName: "Input " + index,
        items: [
            {
                name: "On/Off or On selection",
                type: "flag",
                nv: 1,
                flagValue: (1 << (8 - index))
            }, {
                name: "Invert Input",
                type: "flag",
                nv: 2,
                flagValue: (1 << (8 - index))
            }, {
                name: "Push button toggle",
                type: "flag",
                nv: 6,
                flagValue: (1 << (8 - index))
            }
        ]
    }
}

function generateAdvancedInput(index: number): GroupConfigurationItem {
    return {
        type: "group",
        groupName: "Input " + index,
        items: [
            {
                name: "Delayed Input",
                type: "flag",
                nv: 3,
                flagValue: (1 << (8 - index))
            }, {
                name: "Disable SOD",
                type: "flag",
                nv: 8,
                flagValue: (1 << (8 - index))
            }
        ]
    };
}


export class CanAce8c implements CbusModule {
    get manufacturerId(): number {
        return 165;
    }
    get moduleId(): number {
        return 5;
    }
    get name(): string {
        return "CANACE8C";
    }
    get configurationTabs(): ConfigurationTab[] {
        return [
            {
                name: "General",
                items: [
                    generateGeneralInput(1),
                    generateGeneralInput(2),
                    generateGeneralInput(3),
                    generateGeneralInput(4),
                    generateGeneralInput(5),
                    generateGeneralInput(6),
                    generateGeneralInput(7),
                    generateGeneralInput(8)
                ]
            }, {
                name: "Advanced",
                items: [
                    generateAdvancedInput(1),
                    generateAdvancedInput(2),
                    generateAdvancedInput(3),
                    generateAdvancedInput(4),
                    generateAdvancedInput(5),
                    generateAdvancedInput(6),
                    generateAdvancedInput(7),
                    generateAdvancedInput(8),
                    {
                        name: "Input delay, ON time",
                        type: "numeric",
                        nv: 4,
                        scale: 10,
                        units: "ms"
                    }, {
                        name: "Input delay, OFF time",
                        type: "numeric",
                        nv: 5,
                        scale: 10,
                        units: "ms"
                    }, {
                        name: "Route Options",
                        type: "select",
                        nv: 7,
                        selectValues: [
                            {
                                name: "None",
                                value:0
                            }, {
                                name: "All Inputs",
                                value: 255
                            }, {
                                name: "Input 1",
                                value: (1<<7)
                            }, {
                                name: "Input 2", 
                                value: (1<<6)
                            }, {
                                name: "Input 3",
                                value: (1<<5)
                            }, {
                                name: "Input 4",
                                value: (1<<4)
                            }, {
                                name: "Input 5",
                                value: (1<<3)
                            }, {
                                name: "Input 6",
                                value: (1<<2)
                            }, {
                                name: "Input 7",
                                value: (1<<1)
                            }, {
                                name: "Input 8",
                                value: 1
                            }
                        ]
                    }
                ]
            }
        ]
    }
    get expectWrack(): boolean {
        return true;
    }

}