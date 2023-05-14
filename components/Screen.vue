<!--suppress ES6UnusedImports, JSUnresolvedVariable -->
<script setup>
import {onMounted, defineProps, ref} from "vue";
import PaneCompass from './PaneCompass.vue';
import PaneStatus from './PaneStatus.vue';
import PaneInventory from './PaneInventory.vue';
import PaneEnd from './PaneEnd.vue';
import TextInput from './TextInput.vue';
const paneList = {
    PaneCompass,
    PaneStatus,
    PaneInventory,
    PaneEnd,
}
let props = defineProps({
    questjs: {
        type: Object,
        required: true,
    },
});
let paneActive = function(pane) {
    switch (pane) {
        case PaneCompass:
            return !!props.questjs.settings.compassPane;
        case PaneStatus:
            return !!props.questjs.settings.statusPane;
        case PaneInventory:
            return !!props.questjs.settings.inventoryPane;
        case PaneEnd:
            return false; // todo
    }
}
let panes = ref(null);
onMounted(() => {
    props.questjs.io.panesWidth = panes.value.clientWidth;
    console.log('Mounted Screen');
});
</script>
<style>
@import "../assets/css/default.css";
</style>
<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
          integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA=="
          crossorigin="anonymous"/>
    <h1 id="loading">LOADING</h1>

    <div id="main">
        <div id="inner">
            <div id="output"></div>
            <TextInput v-if="questjs.settings.textInput" :questjs="questjs"/>
        </div>
    </div>

    <div id="panes" :class="'side-panes-' + questjs.settings.panes"
         class="side-panes panes-narrow" style="display: block;" ref="panes">
        <template v-for="pane in paneList">
            <component v-if="paneActive(pane)" :is="pane" :questjs="questjs"></component>
        </template>
    </div>

    <dialog id="dialog">
        <form method="dialog">
            <h4 id="dialog-title"></h4>
            <hr/>
            <div id="dialog-content"></div>
            <div id="dialog-footer" style="text-align:right">
                <hr/>
                <button id="dialog-button" value="default">Confirm</button>
            </div>
        </form>
    </dialog>
    <div id="quest-map"></div>
    <div id="quest-image"></div>
    <form style="display:none" id="fileDialogForm">
        <input type="file" id="fileDialog" v-on:change="questjs.saveLoad.loadGameAsFile" accept=".q6save"/>
    </form>
</template>
