<script>
    import Close from "@/components/icons/Close.vue";
    export default {
        props: {
            show: Boolean,
            title: String,
            isConfirm: Boolean,
        },
        components: {
            Close
        }
    };
</script>

<template>
    <div class="modal" v-if="show">
        <div class="modal-overlay" @click="$emit('close')"></div>
        <div class="modal-container">
            <div class="modal-header">
                <h3 v-if="title">{{ title }}</h3>
                <span class="modal-close" @click="$emit('close')">
                    <Close :w="'30px'" :h="'30px'" />
                </span>
            </div>
            <div class="modal-body">
                <div class="modal-content">
                    <slot></slot>
                </div>
                <div class="modal-controls" v-if="isConfirm">
                    <button class="btn" @click="$emit('confirm')">Ok</button>
                    <button class="btn" @click="$emit('decline')">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
    @import 'modal.scss';
</style>