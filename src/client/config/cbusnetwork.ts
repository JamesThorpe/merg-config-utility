import { OpCodes, CbusNodes } from "../api/api";
import { Socket } from "../api/socket";
import { reactive } from "vue";

export type CbusNode = {
    nodeNumber: number,
    manufacturerId: number,
    moduleId: number,
    name: string
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
                nodeNumber: pnn.nodeNumber,
                manufacturerId: pnn.manufId,
                moduleId: pnn.moduleId,
                name: `Node ${pnn.nodeNumber}`
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
            if (h.code !== "PNN") return;
            const msg = h as OpCodes.PNN;
            this.addNode(msg);
        });
    }
});

Network.watchForNodes();




