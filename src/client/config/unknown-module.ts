import { CbusModule, ConfigurationTab } from "./cbus-module";

export class UnknownModule implements CbusModule {
    get manufacturerId(): number {
        return -1;
    }
    get moduleId(): number {
        return -1;
    }
    get name(): string {
        return "Unknown";
    }
    get configurationTabs(): ConfigurationTab[] {
        return [];
    }
    get expectWrack(): boolean {
        return true;
    }
}