import { OpCodes, CbusNodes } from "../api/api";
import { Socket } from "../api/socket";
import { reactive } from "vue";

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
    variables: number[] = [];

    get paramManufacturerId():number {
        if (this.params[1] !== undefined) {
            return this.params[1];
        }
        return -1;
    }
    get paramModuleId():number {
        if (this.params[3] !== undefined) {
            return this.params[3];
        }
        return -1;
    }
    get minorVersion():string {
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
        this.variables = response.data;
    }

};

export interface NetworkData {
    nodes: CbusNode[]
};

export const Network = reactive({
    nodes: [] as CbusNode[],
   
    clearNodes() {
        this.nodes = [];
    },

    addNode(pnn: OpCodes.PNN, params: number[]) {
        let existingNode = this.nodes.find(n => n.nodeNumber == pnn.nodeNumber);
        if (existingNode === undefined) {
            existingNode = new CbusNode();
            existingNode.name = `Node ${pnn.nodeNumber}`;
            existingNode.nodeNumber = pnn.nodeNumber;
            this.nodes.push(existingNode);
        }
        existingNode.manufacturerId = pnn.manufId;
        existingNode.moduleId = pnn.moduleId;
        existingNode.isConsumer = pnn.nodeFlags & 1,
        existingNode.isProducer = pnn.nodeFlags & 2,
        existingNode.isFlim = pnn.nodeFlags & 4,
        existingNode.isBootloadable = pnn.nodeFlags & 8,
        existingNode.params = params
    },

    async refreshNodes() {
        await CbusNodes.QueryNodes({});
    },

    watchForNodes() {
        Socket.standardMessageReceived.on(async (h) => {
            if (h.OpCode.code !== "PNN") return;
            const msg = h.OpCode as OpCodes.PNN;

            const params = await CbusNodes.ReadNodeParameters({
                nodeNumber: msg.nodeNumber
            });

            this.addNode(msg, params.data);


        });
    },

    getData():NetworkData {
        return {
            nodes: this.nodes
        }
    },

    loadData(data: NetworkData): void {
        this.clearNodes();
        data.nodes.forEach(node => {
            this.nodes.push(node);
        });
    }
    
});

Network.watchForNodes();




