<template>
    <v-btn icon @click="configure" :class="{connected: isConnected, disconnected: !isConnected}">
        <v-icon :icon="icon"></v-icon>
        <v-tooltip :text="feedback" activator="parent"></v-tooltip>
    </v-btn>

    <v-dialog
            v-model="dialogOpen"
            persistent
            width="500"
            height="400"
        >
        <v-card prepend-icon="mdi-help-network-outline">
            <template #title>
                Configure CBUS Connection
            </template>
            <v-card-text>
                <v-form>
                    <v-radio-group v-model="connectionType" inline>
                        <v-radio label="Serial/COM Port" value="serial"></v-radio>
                        <v-radio label="Network" value="tcp"></v-radio>
                    </v-radio-group>
                    
                    <div v-if="connectionType == 'serial'">
                        <v-select label="Select port" :items="availablePorts" v-model="serialPort"></v-select>
                    </div>
                    <div v-else>
                        <v-text-field label="Host (IP Address)" v-model="tcpHost"></v-text-field>
                        <v-text-field label="Port" v-model="tcpPort"></v-text-field>
                    </div>
                </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn @click="dialogOpen = false">Close</v-btn>
                <v-btn color="primary" @click="connect">Connect</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script lang="ts">
import { CbusConnection } from '../api/api'

interface CbusConnectionData {
    isConnected: boolean,
    dialogOpen: boolean,
    availablePorts: string[],
    connectionType: "serial" | "tcp",
    serialPort: string,
    tcpHost: string,
    tcpPort: number
}
export default {
    data(): CbusConnectionData {
        return {
            isConnected: false,
            dialogOpen: false,
            availablePorts: [],
            connectionType: "serial",
            serialPort: "",
            tcpHost: "",
            tcpPort: 0

        }
    },
    computed: {
        feedback():string {
            //TODO: include info about the connection
            return this.isConnected ? "CBUS Connected" : "No CBUS Connection";
        },
        icon():string {
            return this.isConnected ? "mdi-network-outline": "mdi-network-off-outline";
        }
    },
    methods: {
        async configure():Promise<void> {
            this.availablePorts = (await CbusConnection.getComPorts({})).data;
            this.dialogOpen = true;
        },
        async connect(): Promise<void> {
            
            const connectedResponse = await CbusConnection.connect({
                connectionType: this.connectionType == "serial" ? 0 : 1,
                serialPort: this.connectionType == "serial" ? {
                    portName: this.serialPort,
                } : undefined,
                tcp: this.connectionType == "tcp" ? {
                    host: this.tcpHost,
                    port: this.tcpPort
                } : undefined
            });
            this.isConnected = connectedResponse.data;
            this.dialogOpen = false;
        }
    }
}
</script>
<style type="scss" scoped>
.connected {
    color: green;
}
.disconnected {
    color: red;
}
</style>