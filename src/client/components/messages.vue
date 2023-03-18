<template>
    <v-card density="compact">
        <v-card-title>
            Messages
        </v-card-title>
        <v-card-text>
            <div v-for="m in recent" class="message">
                <v-icon size="x-small" :icon="m.received ? 'mdi-arrow-down-thin' : 'mdi-arrow-up-thin'"></v-icon>
                {{ m.message.Text }} 
            </div>
        </v-card-text>
    </v-card>
</template>
<script lang="ts">
import { Socket, OpCodeMessage } from "../api/socket";

type RecentMessage = {
    received: boolean,
    message: OpCodeMessage
}

export default {
    data() {
        return {
            recent: [] as RecentMessage[]
        }
    },
    mounted() {
        Socket.standardMessageReceived.on((h) => {
            this.addMessage(h, true);            
        });
        Socket.standardMessageSent.on((h) => {
            this.addMessage(h, false);
        });
    },
    methods: {
        addMessage(msg: OpCodeMessage, received: boolean) {
            this.recent.push({received: received, message: msg});
            while(this.recent.length > 20) {
                this.recent.shift()
            }
        }
    }
}
</script>
<style type="scss" scoped>
.message {
    font-family: monospace;
}
</style>