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

            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn color="primary">Ok</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script lang="ts">
import { Socket } from '../api/socket';
import { components } from '../api/mcu-server';

export default {
    data() {
        return {
            rqnnOpen: false
        }
    },
    beforeMount() {
        Socket.standardMessageReceived.on((h) => {
            
            if (h.code !== "RQNN") return;
            const msg = h as components["schemas"]["RequestNodeNumber"];
            
            console.log(msg.description);
            this.rqnnOpen = true;
        });
    }
}
</script>