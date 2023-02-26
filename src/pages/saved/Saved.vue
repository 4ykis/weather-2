<script>
    import Weather from "@/components/weather/Weather.vue";
    import Header from '@/components/header/Header.vue';

    import { mapGetters } from 'vuex';

    export default {
        computed: {
            ...mapGetters(['getSavedCity']),
            savedCity() {
                return this.getSavedCity;
            },
            showedBlocks() {
                return this.$store.state.weatherBlockData
            }
        },
        components: {
            Weather,
            Header
        }
    }
</script>

<template>
    <Header />
    <div class="container">
        <template v-if="savedCity.length">
            <template v-for="city in savedCity" :key="city">
                <Weather :initData="city" :isSavedPage="true"/>
            </template>
        </template>
        <div v-else class="no-saved">
            Sorry, you have no saved City.
        </div>
    </div>
</template>



<style lang="scss">
    @import 'saved.scss';
</style>