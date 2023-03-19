import { CbusNodes } from "../api/api";
import { NodeVariable } from "./NodeVariable";


export class CbusNode {
    name: string;
    nodeNumber: number;
    manufacturerId: number;
    moduleId: number;
    isConsumer: boolean;
    isProducer: boolean;
    isFlim: boolean;
    isBootloadable: boolean;
    params: number[] = [];
    variables: NodeVariable[] = [];

    getVariable(nv: number): NodeVariable {
        return this.variables.find(v => v.index === nv);
    }

    get paramManufacturerId(): number {
        if (this.params[1] !== undefined) {
            return this.params[1];
        }
        return -1;
    }
    get paramModuleId(): number {
        if (this.params[3] !== undefined) {
            return this.params[3];
        }
        return -1;
    }
    get minorVersion(): string {
        if (this.params[2] !== undefined) {
            return String.fromCharCode(this.params[2]);
        }
        return "?";
    }
    get majorVersion(): number {
        if (this.params[7] !== undefined) {
            return this.params[7];
        }
        return 0;
    }
    get version(): string {
        return `${this.majorVersion}${this.minorVersion}`;
    }
    get supportedNodeVariables(): number {
        if (this.params[6] !== undefined) {
            return this.params[6];
        }
        return -1;
    }

    async loadVariables() {
        const response = await CbusNodes.ReadNodeVariables({
            nodeNumber: this.nodeNumber,
            variableCount: this.supportedNodeVariables
        });
        this.variables = response.data.map((v, i) => ({ index: i + 1, value: v }));
    }

    async saveVariables(expectWrack: boolean) {
        await CbusNodes.UpdateNodeVariables({
            nodeNumber: this.nodeNumber,
            variables: this.variables.map(v => (v.value)),
            expectWrack: expectWrack
        });
    }
}
