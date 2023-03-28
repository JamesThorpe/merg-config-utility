<template>
    <v-text-field
        density="compact"
        hide-details
        type="number"
        :label="configItem.name"
        v-model="scaledValue"
        :suffix="configItem.units" 
        :step="configItem.scale"
        @blur="validate"
        :min="min"
        :max="max">
    </v-text-field>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { NumericConfigurationItem } from "../config/cbus-module";
import { NodeVariable } from "../config/node-variable";

export default defineComponent({
    props:{
        configItem: {
            type: Object as PropType<NumericConfigurationItem> ,
            required: true
        },
        nodeVariable: {
            type: Object as PropType<NodeVariable>,
            required: true
        }
    },
    data() {
        return {
            scaledValue: 0
        }
    },
    computed: {
        min() {
            let min = 0;
            if (this.configItem.min !== undefined) {
                min = this.configItem.min;
            }
            if (this.configItem.scale !== undefined) {
                min = min * this.configItem.scale;
            }
            return min;
        },
        max() {
            let max = 255;
            if (this.configItem.max !== undefined) {
                max = this.configItem.max;
            }
            if (this.configItem.scale !== undefined) {
                max = max * this.configItem.scale;
            }
            return max;
        }
    },
    methods: {
        updateScaledVal(newVal: number) {
            if (this.configItem.type == "numeric" && this.configItem.scale !== undefined) {
                this.scaledValue = +(newVal * this.configItem.scale).toFixed(2);
            } else {
                this.scaledValue = newVal;
            }
        },
        validate() {
            let min = 0;
            let max = 255;
            let val = this.scaledValue;
            if (this.configItem.scale !== undefined) {
                val = Math.round(val / this.configItem.scale);
                if (this.configItem.min !== undefined) {
                    min = this.configItem.min;
                }
                if (this.configItem.max !== undefined) {
                    max = this.configItem.max;
                }
            }
            if (val < min) {
                val = min;
            }
            if (val > max) {
                val = max;
                
            }
            this.nodeVariable.value = val;
        }

    },
    watch: {
        "nodeVariable.value": {
            handler() {
                this.updateScaledVal(this.nodeVariable.value);
            },
            immediate:true            
        },
    }
});
</script>