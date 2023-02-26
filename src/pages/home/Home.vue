<script>
    import Weather from "@/components/weather/Weather.vue";
    import Modal from "@/components/modal/Modal.vue";
    import Header from '@/components/header/Header.vue';

    export default {
        data() {
            return {
                userLocationData: this.$store.state.userLocationData,
                showModal: false
            }
        },
        computed: {
            showedBlocks() {
                return this.$store.state.weatherBlockData
            }
        },
        methods: {
            addAnotherWeatherBlock() {
                if (this.showedBlocks.length >= 5) {
                    this.showModal = true;
                } else {
                    this.$store.dispatch('addWeatherBlock');
                }
            }
        },
        components: {
            Weather,
            Modal,
            Header
        }
    }
    </script>

<template>
    <div class="page">
        <Header />
        <div class="container">
            <template v-for="(item, i) in showedBlocks" :key="i">
                <Weather :initData="item" :isSavedPage="false" :index="i"/>
            </template>
            <button @click="addAnotherWeatherBlock" class="btn">Add another City</button>
            <Modal
                :show="showModal"
                @close="showModal = false"
            >
                You already have max (5) weather blocks.
            </Modal>
        </div>
    </div>
</template>

<style lang="scss">
    @import "home.scss";
</style>