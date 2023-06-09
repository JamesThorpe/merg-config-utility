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
                    <th>Version</th>
                    <th>NVs</th>
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
                <td>{{ node.version }}</td>
                <td>{{ node.supportedNodeVariables }}</td>
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
            <add-node-manually></add-node-manually>
            <v-btn @click="refresh" size="small" icon>
                <v-icon icon="mdi-refresh"></v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Network } from "../config/network";
import { CbusNode } from "../config/cbus-node";
import NodeEditor from "./node-editor.vue";
import AddNodeManually from "./add-node-manually.vue";

interface Data {
    network: typeof Network,
    loading: boolean
}

export default defineComponent({
    data() : Data {
        return {
            network: Network,
            loading: false
        }
    },
    components: {
        "node-editor": NodeEditor,
        "add-node-manually": AddNodeManually
    },
    methods: {
        async refresh() {
            this.loading = true;
            await this.network.refreshNodes();
            this.loading = false;
        },
        selectNode(node: CbusNode):void {
            console.log("Select node", node.nodeNumber);
        }
    }
});
</script>
<style type="scss">
.iconOn {
    color: green;
}
</style>