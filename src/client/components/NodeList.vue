<template>
    <v-card :loading="loading" density="compact">
        <v-card-title>
            Node List
        </v-card-title>
        <v-table density="compact">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Node Number</th>
                    <th>Manufacturer ID</th>
                    <th>Module ID</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="node in network.nodes"
                    @click="selectNode(node)"
                >
                <td>{{ node.name }}</td>
                <td>{{ node.nodeNumber }}</td>
                <td>{{ node.manufacturerId }}</td>
                <td>{{ node.moduleId }}</td>
                <td>
                    <v-tooltip text="Indicates whether this is a consumer node" location="bottom">
                        <template v-slot:activator="{props}">
                            <v-icon v-bind="props" icon="mdi-arrow-bottom-right-thick" :class="{'iconOn': node.isConsumer}"></v-icon>
                        </template>
                    </v-tooltip>
                    <v-tooltip text="Indicates whether this is a producer node" location="bottom">
                        <template v-slot:activator="{props}">
                            <v-icon v-bind="props" icon="mdi-arrow-top-right-thick" :class="{'iconOn': node.isProducer}"></v-icon>
                        </template>
                    </v-tooltip>
                    <v-tooltip text="Indicates whether this node is in FLiM mode" location="bottom">
                        <template v-slot:activator="{props}">
                            <v-icon v-bind="props" icon="mdi-cog-outline" :class="{'iconOn': node.isFlim}"></v-icon>        
                        </template>
                    </v-tooltip>
                    <v-tooltip text="Indicates whether this node can be updated remotely using a bootloader">
                        <template v-slot:activator="{props}">
                            <v-icon v-bind="props" icon="mdi-download-box" :class="{'iconOn': node.isBootloadable}"></v-icon>
                        </template>
                    </v-tooltip>
                </td>
                <td>
                    <node-editor :node="node"></node-editor>

                </td>
            </tr>
            </tbody>
        </v-table>
        <v-card-actions class="justify-end">
            <v-btn @click="refresh" size="x-small" icon>
                <v-icon icon="mdi-refresh"></v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script lang="ts">

import { Network, CbusNode } from "../config/cbusnetwork";
import NodeEditor from "./NodeEditor.vue";

interface NodeListData {
    network: typeof Network,
    loading: boolean,
    nodeToEdit: CbusNode
}

export default {
    data() : NodeListData {
        return {
            network: Network,
            loading: false,
            nodeToEdit: null
        }
    },
    components: {
        "node-editor": NodeEditor
    },
    methods: {
        async refresh() {
            this.loading = true;
            await this.network.refreshNodes();
            this.loading = false;
        },
        selectNode(node: CbusNode):void {
            console.log("Select node", node.nodeNumber);
        },
        editNode(node: CbusNode):void {
            this.nodeToEdit = node;
        }
    }
}
</script>
<style type="scss">
.iconOn {
    color: green;
}
</style>