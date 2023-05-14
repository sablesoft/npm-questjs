<script setup>
import {onMounted, defineProps} from "vue";

defineProps({
});

onMounted(() => {
});
</script>
<style>
    @import "./assets/css/font-awesome_5.15.1.css";
    @import "./assets/css/default.css";
</style>
<template>
    <h1 id="loading">LOADING</h1>

    <div id="main">
        <div id="inner">
            <div id="output"></div>
            <div id="input"></div>
        </div>
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
        <input type="file" id="fileDialog" accept=".q6save"/>
    </form>
</template>
