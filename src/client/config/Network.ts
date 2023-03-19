import { OpCodes, CbusNodes } from "../api/api";
import { Socket } from "../api/socket";
import { reactive } from "vue";
import { CanAcc4 } from "./canacc4";
import { CbusModule } from "./cbus-module";
import { CbusNode } from "./CbusNode";

export interface NetworkData {
    nodes: CbusNode[]
};

export const Network = reactive({
    nodes: [] as CbusNode[],
    configs: [] as CbusModule[],
   
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
        existingNode.isConsumer = (pnn.nodeFlags & 1) === 1,
        existingNode.isProducer = (pnn.nodeFlags & 2) === 2,
        existingNode.isFlim = (pnn.nodeFlags & 4) === 4,
        existingNode.isBootloadable = (pnn.nodeFlags & 8) === 8,
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
            const n = new CbusNode();
            n.name = node.name;
            n.nodeNumber = node.nodeNumber;
            n.manufacturerId = node.manufacturerId;
            n.moduleId = node.moduleId;
            n.isConsumer = node.isConsumer;
            n.isProducer = node.isProducer;
            n.isFlim = node.isFlim;
            n.isBootloadable = node.isBootloadable;
            n.params = node.params;
            this.nodes.push(n);
        });
    },
    async loadConfigs() {
        this.configs = [];
        this.configs.push(new CanAcc4());
    }
    
});

Network.watchForNodes();




