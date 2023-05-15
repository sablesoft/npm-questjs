<!--suppress JSUnresolvedVariable -->
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
    if (props.questjs.io.disableLevel) {
        console.log('io.disableLevel');
        return;
    }
    if (event.target.classList.contains('item-action')) {
        let data = event.target.dataset;
        props.questjs.io.clickItemAction(data.item, data.action);
    }
    let item = event.target.closest('.item-wrapper');
    if (item.classList.contains('active')) {
        item.classList.remove('active');
        return;
    }
    let items = document.getElementsByClassName('item-wrapper');
    for (let item of items) {
        item.classList.remove('active');
    }
    item.classList.add('active')
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
.item-wrapper>.item-action {
    display: none;
}
.item-wrapper.active>.item-action {
    display: block;
}
</style>
<template>
    <div v-for="inv in questjs.settings.inventoryPane" class="pane-div">
        <PaneTitle :questjs="questjs" :title="inv.name"/>
        <div class="item-list" :id="inv.alt" @click="inventoryHandler"></div>
    </div>
</template>
