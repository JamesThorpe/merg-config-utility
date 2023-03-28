<template>
    <v-select 
        :label="configItem.name" 
        v-model="nodeVariable.value" 
        :items="configItem.selectValues" 
        item-title="name" 
        item-value="value"
        density="compact"
    >
    </v-select>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { SelectConfigurationItem } from "../config/cbus-module";
import { NodeVariable } from "../config/node-variable";

export default defineComponent({
    props:{
        configItem: {
            type: Object as PropType<SelectConfigurationItem> ,
            required: true
        },
        nodeVariable: {
            type: Object as PropType<NodeVariable>,
            required: true
        }
    }
});
</script>