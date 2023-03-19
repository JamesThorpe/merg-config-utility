import { OpCodes, CbusNodes } from "../api/api";
import { Socket } from "../api/socket";
import { reactive } from "vue";

export type CbusNode = {
    name: string,
    nodeNumber: number,
    manufacturerId: number,
    moduleId: number,
    isConsumer: boolean,
    isProducer: boolean,
    isFlim: boolean,
    isBootloadable: boolean

};

export interface NetworkData {
    nodes: CbusNode[]
};

export const Network = reactive({
    nodes: [] as CbusNode[],
   
    clearNodes() {
        this.nodes = [];
    },

    addNode(pnn: OpCodes.PNN) {
        const existingNode = this.nodes.find(n => n.nodeNumber == pnn.nodeNumber);
        if (existingNode === undefined) {
            this.nodes.push({
                name: `Node ${pnn.nodeNumber}`,
                nodeNumber: pnn.nodeNumber,
                manufacturerId: pnn.manufId,
                moduleId: pnn.moduleId,
                isConsumer: pnn.nodeFlags & 1,
                isProducer: pnn.nodeFlags & 2,
                isFlim: pnn.nodeFlags & 4,
                isBootloadable: pnn.nodeFlags & 8
            });
        } else {
            existingNode.manufacturerId = pnn.manufId;
            existingNode.moduleId = pnn.moduleId;
        }
    },

    async refreshNodes() {
        await CbusNodes.QueryNodes({});
    },

    watchForNodes() {
        Socket.standardMessageReceived.on((h) => {
            if (h.OpCode.code !== "PNN") return;
            const msg = h.OpCode as OpCodes.PNN;
            this.addNode(msg);
        });
    },

    getData():NetworkData {
        return {
            nodes: this.nodes
        }
    },

    loadData(data: NetworkData): void {
        this.nodes = data.nodes;
    }
    
});

Network.watchForNodes();




