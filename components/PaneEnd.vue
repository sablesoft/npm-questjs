<script setup>
import {defineProps, onMounted} from "vue";

const props = defineProps({
    questjs: {
        type: Object,
        required: true
    }
});
onMounted(() => {
    console.log('Mounted PaneEnd');
});
</script>
<style>
</style>
<template>
    <div class="pane-div">
        <table id="pane-div-finished">
            <p>G<br/>A<br/>M<br/>E<br/>/<br/>O<br/>V<br/>E<br/>R</p>
        </table>
    </div>
</template>
