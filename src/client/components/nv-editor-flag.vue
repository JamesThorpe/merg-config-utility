<template>
    <v-checkbox density="compact" hide-details :label="configItem.name" v-model="value"></v-checkbox>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FlagConfigurationItem } from '../config/cbus-module';
import { NodeVariable } from '../config/node-variable';

export default defineComponent({
    props:{
        configItem: {
            type: Object as PropType<FlagConfigurationItem> ,
            required: true
        },
        nodeVariable: {
            type: Object as PropType<NodeVariable>,
            required: true
        }
    },
    data() {
        return {
            innerValue: false
        }
    },
    computed: {
        value: {
            get() {
                return this.innerValue;
            },
            set(nv: boolean) {
                this.innerValue = nv;

                if (nv) {
                    this.nodeVariable.value |= this.configItem.flagValue;
                } else {
                    this.nodeVariable.value &= ~this.configItem.flagValue;
                }
            }
        }
    },
    watch: {
        'nodeVariable.value': {
            handler() {
                this.innerValue = (this.nodeVariable.value & this.configItem.flagValue) != 0;
            },
            immediate: true

        }
    }
});
</script>