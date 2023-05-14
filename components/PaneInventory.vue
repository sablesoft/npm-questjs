<script setup>
import {defineProps, onMounted} from "vue";
import PaneTitle from './PaneTitle.vue';

const props = defineProps({
    questjs: {
        type: Object,
        required: true
    }
});
onMounted(() => {
    console.log('Mounted PaneInventory');
});
</script>
<style>
</style>
<template>
    <div v-for="inv in questjs.settings.inventoryPane" class="pane-div">
        <PaneTitle :questjs="questjs" :title="inv.name"/>
        <div class="item-list" :id="inv.alt"></div>
    </div>
</template>
