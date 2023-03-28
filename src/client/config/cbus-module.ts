export type BaseConfigurationItem = {
    name: string,
    nv: number,
}

export type NumericConfigurationItem = {
    type: "numeric",
    units?: string,
    scale?: number,
    min?: number;
    max?: number;
} & BaseConfigurationItem;

export type FlagConfigurationItem = {
    type: "flag",
    flagValue: number
} & BaseConfigurationItem;

export type SelectValue = {
    name: string,
    value: number
};

export type SelectConfigurationItem = {
    type: "select",
    selectValues: SelectValue[]
} & BaseConfigurationItem;

export type GroupConfigurationItem = {
    type: "group",
    groupName: string,
    items: ConfigurationItem[]
};

export type ConfigurationItem = NumericConfigurationItem | FlagConfigurationItem | SelectConfigurationItem | GroupConfigurationItem;

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
