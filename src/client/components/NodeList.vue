<template>
    <v-card>
        <v-card-title>
            Node List
            <v-btn @click="refresh" icon="mdi-refresh"></v-btn>
        </v-card-title>
        <v-table>
            <thead>
                <tr>
                    <th>Node Number</th>
                    <th>Manufacturer ID</th>
                    <th>Module ID</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="node in nodes"
                >
                <td>{{  node.nodeNumber }}</td>
                <td>{{  node.manufId }}</td>
                <td>{{  node.moduleId }}</td>
            </tr>
            </tbody>
        </v-table>
    </v-card>
</template>
<script lang="ts">
import { CbusNodes, OpCodes } from '../api/api';

interface NodeListData {
    nodes: OpCodes.PNN[]
}

export default {
    data() : NodeListData {
        return {
            nodes:[]
        }
    },
    methods: {
        async refresh() {
            const nodes = await CbusNodes.QueryNodes({});
            this.nodes = nodes.data;
            
        }
    }
}
</script>