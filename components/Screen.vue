<script setup>
import {onMounted, defineProps} from "vue";

defineProps({
    questjs: {
        type: Object,
        required: true,
    },
});

onMounted(() => {});
</script>
<style>
    @import "../assets/css/default.css";
</style>
<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
          integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA=="
          crossorigin="anonymous" />
    <h1 id="loading">LOADING</h1>

    <div id="main">
        <div id="inner">
            <div id="output"></div>
            <!--suppress JSUnresolvedVariable -->
            <div id="input" v-if="questjs.settings.textInput" >
                <!--suppress JSUnresolvedVariable -->
                <span id="cursor">{{ questjs.settings.cursor }}</span>
                <input type="text" name="textbox" id="textbox" autocomplete="off" />
            </div>
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
