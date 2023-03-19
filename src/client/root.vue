<template>
    <v-app>
        
        <v-app-bar density="compact">
            <template v-slot:prepend>
                <v-btn icon>
                    <v-icon icon="mdi-menu"></v-icon>
                    <v-menu activator="parent">
                        <v-list>
                            <v-list-item title="Save Config" value="1" @click="save"></v-list-item>
                            <v-list-item title="Load Config" value="2" @click="load"></v-list-item>
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
            <messages></messages>
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
import messages from "./components/messages.vue";

import { CbusConnection, CbusNodes } from "./api/api"
import { Network } from "./config/cbusnetwork";

export default {
    components: {
        "status-bar": statusbar,
        "cbus-connection": cbusConnection,
        "rqnn": rqnn,
        "node-list": nodeList,
        "messages": messages
    },
    methods: {
        save() {
            const data = Network.getData();
            const e = document.createElement("a");
            e.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 4)));
            e.setAttribute("download", "fcu.json");
            e.style.display = "none";
            document.body.appendChild(e);
            e.click();
            document.body.removeChild(e);
        },

        load() {
            var input = document.createElement("input");
            input.setAttribute("type", "file");
            
            input.onchange = (e) => {
                    var input = e.target as HTMLInputElement;

                    var reader = new FileReader();
                    reader.onload = () => {
                        const data = JSON.parse(reader.result as string);
                        Network.loadData(data);
                    };
                    reader.readAsText(input.files[0]);
            }

            input.click(); // opening dialog
            
            return false; // avoiding navigation
        }
    }
}
</script>