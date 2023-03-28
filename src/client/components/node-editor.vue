<template>
        <v-btn size="x-small" prepend-icon="mdi-pencil" @click.stop="editNode">
            Edit Node
        </v-btn>

        <v-dialog
            v-model="dialogOpen"
            persistent
            width="auto"
            height="auto"
        >
        <v-card prepend-icon="mdi-help-network-outline">
            <template #title>
                Edit Node
            </template>
            <template #subtitle>
                {{ config.name }}
            </template>
            <v-text-field density="compact" hide-details v-model="node.name" label="Node Name"></v-text-field>
            <v-tabs v-model="tab"> 
                <v-tab v-for="(tab,i) in config.configurationTabs" :value="`configTab${i}`">{{ tab.name }}</v-tab>
                <v-tab value="nvs">Raw NVs</v-tab>
            </v-tabs>
            <v-card-text>
                <v-window v-model="tab">
                    <v-window-item v-for="(tab, i) in config.configurationTabs" :value="`configTab${i}`">
                        <span v-for="item in tab.items">
                            <nv-editor-numeric v-if="item.type==='numeric'" :config-item="item" :node-variable="node.getVariable(item.nv)"></nv-editor-numeric>
                            <nv-editor-flag v-if="item.type==='flag'" :config-item="item" :node-variable="node.getVariable(item.nv)"></nv-editor-flag>
                            <nv-editor-select v-if="item.type==='select'" :config-item="item" :node-variable="node.getVariable(item.nv)"></nv-editor-select>
                            <v-card class="item-group ma-2" v-if="item.type==='group'" variant="outlined" density="compact">
                                <v-card-title>{{ item.groupName }}</v-card-title>
                                <v-card-text>
                                    <div v-for="groupItem in item.items">
                                        <nv-editor-numeric v-if="groupItem.type==='numeric'" :config-item="groupItem" :node-variable="node.getVariable(groupItem.nv)"></nv-editor-numeric>
                                        <nv-editor-flag v-if="groupItem.type==='flag'" :config-item="groupItem" :node-variable="node.getVariable(groupItem.nv)"></nv-editor-flag>
                                        <nv-editor-select v-if="groupItem.type==='select'" :config-item="groupItem" :node-variable="node.getVariable(groupItem.nv)"></nv-editor-select>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </span>
                    </v-window-item>
                    <v-window-item value="nvs" class="nvList">
                        <div>
                            <div v-for="(_, i) in node.variables">
                                <nv-editor-byte :label="`NV ${node.variables[i].index}`" v-model.number="node.variables[i].value"></nv-editor-byte>
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
import { defineComponent } from 'vue';
import { CbusNode } from '../config/cbus-node';
import { CbusModule } from '../config/cbus-module';
import { Network } from '../config/network';
import { UnknownModule } from "../config/unknown-module";
import nvEditorByte from "./nv-editor-byte.vue"
import nvEditorNumeric from "./nv-editor-numeric.vue"
import nvEditorFlag from './nv-editor-flag.vue';
import nvEditorSelect from './nv-editor-select.vue';

interface Data {
    dialogOpen: boolean,
    tab: string | undefined,
    config: CbusModule
}

export default defineComponent({
    components:{
        nvEditorByte,
        nvEditorNumeric,
        nvEditorFlag,
        nvEditorSelect
    },
    props: {
        node: {
            type: CbusNode,
            required: true
        }
    },
    data():Data {
        return {
            dialogOpen: false,
            tab: undefined,
            config: new UnknownModule()
        }
    },
    methods: {
        async editNode() {
            //TODO: figure out if we want to override saved values
            try {
                await this.node.loadVariables();
            }catch(e) {
                //TODO: proper error popup display component?
                console.error("Unable to load current NVs");
            }
            

            const foundConfig = Network.configs.find((c) => c.manufacturerId === this.node.manufacturerId && c.moduleId === this.node.moduleId);
            if (foundConfig === undefined) {
                this.config = new UnknownModule();
            } else {
                this.config = foundConfig;
            }
            this.dialogOpen = true;
        },
        async readNode() {
            await this.node?.loadVariables();
        },
        async saveNode() {
            await this.node.saveVariables(this.config.expectWrack);
            this.dialogOpen = false;
        }
    }
});
</script>
<style type="scss" scoped>
.nvList {
    max-height: 300px;
    overflow-y: scroll;
}
.item-group {
    display: inline-block;
}
</style>