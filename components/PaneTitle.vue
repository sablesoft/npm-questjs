<!--suppress JSUnresolvedFunction, JSUnresolvedVariable -->
<script setup>
import {defineProps, onMounted} from "vue";

const props = defineProps({
    questjs: {
        type: Object,
        required: true
    },
    title: {
        type: String,
        required: false
    }
});
onMounted(() => {
    console.log('Mounted title for ' + props.title);
});
let id = function() {
    return props.questjs.verbify(props.title) + '-side-pane-heading';
}
let collapsible = function() {
    return props.questjs.settings.collapsibleSidePanes;
}
let switchPane = function() {
    // todo
    console.log('Switch Pane - TODO');
}
</script>
<style>
</style>
<template>
    <h4 v-if="title" class="side-pane-heading" :id="id()">
        {{ title }}
        <i v-if="collapsible()" class="fas fa-eye"
           v-on:click="switchPane()"></i>
    </h4>
</template>
