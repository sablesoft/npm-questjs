<script setup>
import {defineProps, onMounted} from "vue";
import PaneTitle from './PaneTitle.vue';

const props = defineProps({
    questjs: {
        type: Object,
        required: true
    }
});
let inventoryHandler = function (event) {
    console.log(event, event.target);
}

onMounted(() => {
    console.log('Mounted PaneInventory');
});
</script>
<style>
.item>img {
    display: inline;
    margin-right: 5px;
}
</style>
<template>
    <div v-for="inv in questjs.settings.inventoryPane" class="pane-div">
        <PaneTitle :questjs="questjs" :title="inv.name"/>
        <div class="item-list" :id="inv.alt" @click="inventoryHandler"></div>
    </div>
</template>
