export type ConfigurationItem = {
    name: string,
    type: "numeric",
    nv: number,
} | {
    name: string,
    type: "flag",
    nv: number,
    flagValue: number
} | {
    name: string,
    type: "select",
    nv: number,
    selectValues: string[]
};

export type ConfigurationTab = {
    name: string,
    items: ConfigurationItem[]
};

export type CbusModule = {
    get manufacturerId(): number;
    get moduleId(): number;
    get name(): string;
    get configurationTabs(): ConfigurationTab[];
    get expectWrack(): boolean;
    //TODO: add support for firmware versions
};
