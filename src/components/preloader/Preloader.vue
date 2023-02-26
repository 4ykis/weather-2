<script>
    export default {
        props: {
            show: Boolean,
            isPage: {
                type: Boolean,
                default: true
            }
        }
    };
</script>

<template>
    <div :class="['preloader', {'m-page': isPage}]" v-if="show">
        <div class="preloader-overlay"></div>
        <div class="preloader-animation">
            <div class="preloader-circle m-first"></div>
            <div class="preloader-circle m-second"></div>
            <div class="preloader-circle m-third"></div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
    @import 'preloader.scss';
</style>