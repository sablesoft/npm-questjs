<!--suppress JSUnresolvedVariable, JSUnresolvedFunction -->
<script setup>
import {defineProps, onMounted, ref} from "vue";

const props = defineProps({
    questjs: {
        type: Object,
        required: true
    }
});
const input = ref(null);

onMounted(() => {
    window.addEventListener('keydown', function(event) {
        props.questjs.keyboardHandler(event);
    });
    console.log('Mounted Input');
});
</script>
<style>
</style>
<template>
    <div id="input">
        <!--suppress JSUnresolvedVariable -->
        <span id="cursor">{{ questjs.settings.cursor }}</span>
        <input type="text" name="textbox" id="textbox" autocomplete="off"/>
    </div>
</template>
