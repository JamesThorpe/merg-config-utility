<template>
    <v-dialog
            v-model="rqnnOpen"
            persistent
            width="500"
            height="400"
        >
        <v-card prepend-icon="mdi-help-network-outline">
            <template #title>
                New FLiM node detected
            </template>
            <v-card-text>
                A new FLiM node has been detected.  Please assign it a node number:
                <v-text-field v-model="nodeNumber" label="Node Number"></v-text-field>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn color="primary" @click="assign">Ok</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script lang="ts">
import { Socket } from '../api/socket';
import { CbusNodes, OpCodes } from "../api/api";
export default {
    data() {
        return {
            rqnnOpen: false,
            nodeNumber: 0
        }
    },
    beforeMount() {
        Socket.standardMessageReceived.on((h) => {
            if (h.OpCode.code !== "RQNN") return;
            const msg = h.OpCode as OpCodes.RQNN;
            this.rqnnOpen = true;
        });
    },
    methods: {
        async assign() {
            let snn: OpCodes.SNN = {
                $type: "SetNodeNumber",
                code: "SNN",
                nodeNumber: this.nodeNumber
            };
            if (await CbusNodes.SetNodeNumber(snn)) {
                this.rqnnOpen = false;
            }
        }
    }
}
</script>