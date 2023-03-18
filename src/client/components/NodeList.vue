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

interface NodeListData {
    network: typeof Network,
    loading: boolean
}

export default {
    data() : NodeListData {
        return {
            network: Network,
            loading: false
        }
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
}
</script>