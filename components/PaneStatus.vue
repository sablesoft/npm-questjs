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
onMounted(() => {
    console.log('Mounted PaneStatus');
});
</script>
<style>
</style>
<template>
    <div class="pane-div">
        <PaneTitle :questjs="questjs" :title="questjs.settings.statusPane"/>
        <table id="status-pane">
        </table>
    </div>
</template>
