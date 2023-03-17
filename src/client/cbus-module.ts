export type configurationItem = {
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

export type configurationTab = {
    name: string,
    items: configurationItem[]
};

export type cbusModule = {
    manufacturerId: number,
    moduleId: number,
    name: string
    configuration: configurationTab[];
};