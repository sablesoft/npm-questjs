<!--suppress JSUnresolvedVariable, JSUnresolvedFunction -->
<script setup>
import {defineProps, onMounted} from "vue";
const props = defineProps({
    questjs: {
        type: Object,
        required: true
    }
});
onMounted(() => {
   console.log('Mounted PaneCompass');
});
let exit = function (row, column) {
    return props.questjs.lang.exit_list[column + 5 * (row - 1)];
}
let title = function(row, column) {
    return props.questjs.sentenceCase(exit(row, column).name);
}
let click = function(row, column) {
    if (props.questjs.io.disableLevel) {
        return;
    }
    let name = exit(row, column).name;
    props.questjs.runCmd(name);
}
let icon = function(row, column) {
    let o = exit(row, column);
    if (!props.questjs.settings.useCompassIcons) {
        return o.abbrev;
    }
    const transform = o.rotate ? ' style="transform: rotate(40deg)"' : ''
    return '<i class="fas ' + o.symbol + '"' + transform + '></i>';
}
</script>
<style>
</style>
<template>
    <div class="pane-div">
        <table id="compass-table">
        <tbody>
            <tr v-for="row in 3" :key="row">
                <td v-for="column in [0, 1, 2]" :key="column"
                    class="compass-button" :title="title(row, column)">
                    <span :id="'exit-' + exit(row, column).name"
                          v-html="icon(row, column)"
                          class="compass-button"
                          v-on:click="click(row, column)"
                          style="display: none;">
                    </span>
                </td>
                <td></td>
                <td v-for="column in [3, 4]" :key="column"
                    class="compass-button" :title="title(row, column)">
                    <span :id="'exit-' + exit(row, column).name"
                          v-html="icon(row, column)"
                          class="compass-button"
                          v-on:click="click(row, column)"
                          style="display: none;">
                    </span>
                </td>
            </tr>
        </tbody>
    </table>
    </div>
</template>
