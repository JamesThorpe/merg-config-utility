import { OpCodes, CbusNodes } from "../api/api";
import { Socket } from "../api/socket";
import { reactive } from "vue";
import { CanAcc4 } from "./canacc4";
import { CanAce8c } from "./canace8c";
import { CbusModule } from "./cbus-module";
import { CbusNode } from "./cbus-node";
import { NodeVariable } from "./node-variable";

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
            existingNode.nodeNumber = pnn.nodeNumber ?? -1;
            this.nodes.push(existingNode);
        }
        existingNode.manufacturerId = pnn.manufId ?? -1;
        existingNode.moduleId = pnn.moduleId ?? -1;
        let nf = 0;
        if (pnn.nodeFlags !== undefined) {
            nf = pnn.nodeFlags;
        }
        existingNode.isConsumer = (nf & 1) === 1,
        existingNode.isProducer = (nf & 2) === 2,
        existingNode.isFlim = (nf & 4) === 4,
        existingNode.isBootloadable = (nf & 8) === 8,
        existingNode.params = params
    },

    addNodeManually(manufacturerId: number, moduleId: number, nodeNumber: number, supportedNVs: number) {
        const node = new CbusNode();
        node.nodeNumber = nodeNumber;
        node.manufacturerId = manufacturerId;
        node.moduleId = moduleId;
        node.params = [0, manufacturerId, "x".charCodeAt(0), moduleId, 0, 0, supportedNVs, 9];
        node.variables = [];
        for (var i = 0; i < supportedNVs; i++) {
            node.variables.push(new NodeVariable(i+1, 0));
        }
        this.nodes.push(node);
    },

    async refreshNodes() {
        await CbusNodes.QueryNodes({});
    },

    watchForNodes() {
        Socket.standardMessageReceived.on(async (h) => {
            if (h.OpCode.code !== "PNN") return;
            const msg = h.OpCode as OpCodes.PNN;

            const params = await CbusNodes.ReadNodeParameters({
                nodeNumber: msg.nodeNumber ?? -1
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
        this.configs.push(new CanAce8c());
    }
    
});

Network.watchForNodes();




