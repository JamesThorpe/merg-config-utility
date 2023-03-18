<template>
    <v-app>
        
        <v-app-bar density="compact">
            <template v-slot:prepend>
                <v-btn icon>
                    <v-icon icon="mdi-menu"></v-icon>
                    <v-menu activator="parent">
                        <v-list>
                            <v-list-item title="Item 2"></v-list-item>
                            <v-list-item title="Item 3"></v-list-item>
                        </v-list>
                    </v-menu>
                </v-btn>
            </template>
            <v-app-bar-title>
                MERG Configuration Utility
            </v-app-bar-title>
            <v-spacer></v-spacer>
            <cbus-connection></cbus-connection>
        </v-app-bar>
    
        <v-main>
            <node-list></node-list>
        </v-main>
        <status-bar />
    
        <rqnn></rqnn>
    </v-app>
</template>
<script lang="ts">
import statusbar from "./components/statusbar.vue";
import cbusConnection from "./components/cbus-connection.vue";
import rqnn from "./components/RQNN.vue";
import nodeList from "./components/NodeList.vue";

import { CbusConnection, CbusNodes } from "./api/api"

export default {
    components: {
        "status-bar": statusbar,
        "cbus-connection": cbusConnection,
        "rqnn": rqnn,
        "node-list": nodeList
    }
}
</script>