<template>
        <v-btn size="x-small" prepend-icon="mdi-pencil" @click.stop="editNode">
            Edit Node
        </v-btn>

        <v-dialog
            v-model="dialogOpen"
            persistent
            width="600"
            height="auto"
        >
        <v-card prepend-icon="mdi-help-network-outline">
            <template #title>
                Edit Node
            </template>
            <v-text-field density="compact" hide-details v-model="node.name" label="Node Name"></v-text-field>
            <v-tabs v-model="tab"> 
                <v-tab value="nvs">Raw NVs</v-tab>
            </v-tabs>
            <v-card-text>
                <v-window v-model="tab">
                <v-window-item value="nvs">
                    NVs:
                <div class="nvList">
                    <div v-for="(_, i) in node.variables">
                        <v-text-field hide-details :label="`NV ${node.variables[i].index}`" v-model="node.variables[i].value" density="compact"></v-text-field>
                    </div>
                </div>
                </v-window-item>
                </v-window>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn @click="dialogOpen = false">Cancel</v-btn>
                <v-btn color="primary" @click="readNode">Read NVs</v-btn>
                <v-btn color="primary" @click="saveNode">Update NVs</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script lang="ts">
import { PropType } from 'vue';
import { CbusNode } from '../config/cbusnetwork';
export default {
    props: {
        node: Object as PropType<CbusNode>
    },
    data() {
        return {
            dialogOpen: false,
            tab: null
        }
    },
    methods: {
        async editNode() {
            //TODO: figure out if we want to override saved values
            await this.node.loadVariables();
            this.dialogOpen = true;
        },
        async readNode() {
            await this.node.loadVariables();
        },
        async saveNode() {
            await this.node.saveVariables();
            this.dialogOpen = false;
        }
    }
}
</script>
<style type="scss" scoped>
.nvList {
    max-height: 200px;
    overflow-y: scroll;
}
</style>