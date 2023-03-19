<template>
        <v-btn size="x-small" prepend-icon="mdi-pencil" @click="dialogOpen = true">
            Edit Node
        </v-btn>

        <v-dialog
            v-model="dialogOpen"
            persistent
            width="500"
            height="400"
        >
        <v-card prepend-icon="mdi-help-network-outline">
            <template #title>
                Edit Node
            </template>
            <v-card-text>
                <v-text-field v-model="node.name" label="Node Name"></v-text-field>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn color="primary" @click="dialogOpen=false">Ok</v-btn>
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
            dialogOpen: false
        }
    }
}
</script>