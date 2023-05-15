<!--suppress JSUnresolvedVariable, JSUnresolvedFunction -->
<script setup>
import {defineProps, onMounted} from "vue";
const props = defineProps({
    /**
     * @type Object
     */
    questjs: {
        type: Object,
        required: true
    }
});
onMounted(() => {
   console.log('Mounted PaneCompass');
});
let getExit = function (row, column) {
    return props.questjs.lang.exit_list[column + 5 * (row - 1)];
}
let title = function(row, column) {
    return props.questjs.sentenceCase(getExit(row, column).name);
}
let click = function(row, column) {
    if (props.questjs.io.disableLevel) {
        return;
    }
    let name = getExit(row, column).name;
    props.questjs.runCmd(name);
}
let icon = function(row, column) {
    let exit = getExit(row, column);
    if (!props.questjs.settings.useCompassIcons) {
        return exit.abbrev;
    }
    const transform = exit.rotate ? ' style="transform: rotate(40deg)"' : ''
    return '<i class="fas ' + exit.symbol + '"' + transform + '></i>';
}
// todo - reactive doesn't work:
let isActive = function(row, column) {
    let exit = getExit(row, column);
    if (!exit) {
        return false;
    }
    /**
     * @type DEFAULT_ROOM
     */
    let loc = props.guestjs.loc();
    if (!loc) {
        return false;
    }
    return loc.hasExit(exit.name, {excludeScenery:true}) ||
        exit.type === 'nocmd';
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
                    <span :id="'exit-' + getExit(row, column).name"
                          v-html="icon(row, column)"
                          class="compass-button"
                          @click="click(row, column)"
                          style="display: none;">
                    </span>
                </td>
                <td></td>
                <td v-for="column in [3, 4]" :key="column"
                    class="compass-button" :title="title(row, column)">
                    <span :id="'exit-' + getExit(row, column).name"
                          v-html="icon(row, column)"
                          class="compass-button"
                          @click="click(row, column)"
                          style="display: none;">
                    </span>
                </td>
            </tr>
        </tbody>
    </table>
    </div>
</template>
