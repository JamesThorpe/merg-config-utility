<template>
    <v-btn icon @click="dialogOpen = true" size="small">
        <v-icon icon="mdi-plus-network"></v-icon>
        <v-tooltip text="Add node manually" activator="parent"></v-tooltip>
    </v-btn>

    <v-dialog
            v-model="dialogOpen"
            persistent
            width="500"
            height="400"
        >
        <v-card prepend-icon="mdi-help-network-outline">
            <template #title>
                Add Node Manually
            </template>
            <v-card-text>
                <v-form>
                    <v-text-field v-model.number="manufacturerId" label="Manufacturer ID"></v-text-field>
                    <v-text-field v-model.number="moduleId" label="Module ID"></v-text-field>
                    <v-text-field v-model.number="nodeNumber" label="Node Number"></v-text-field>
                    <v-text-field v-model.number="supportedNVs" label="Supported NVs"></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn @click="dialogOpen = false">Close</v-btn>
                <v-btn color="primary" @click="add">Add</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Network } from '../config/network'
interface Data {
    dialogOpen: boolean,
    manufacturerId: number,
    moduleId: number,
    nodeNumber: number,
    supportedNVs: number,
}
export default defineComponent({
    data(): Data {
        return {
            dialogOpen: false,
            manufacturerId: 165,
            moduleId: 8,
            nodeNumber: 0,
            supportedNVs: 10
        }
    },
    methods: {
        add() {
            Network.addNodeManually(this.manufacturerId, this.moduleId, this.nodeNumber, this.supportedNVs);
            this.dialogOpen = false;
        }
    }
});
</script>
<style type="scss" scoped>
.connected {
    color: green;
}
.disconnected {
    color: red;
}
</style>