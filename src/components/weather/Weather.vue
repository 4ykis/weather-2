<script>
import WeatherBlock from './weather_block/WeatherBlock.vue';
import WeatherHeader from './weather_header/WeatherHeader.vue';
import WeatherGraph from './weather_graph/WeatherGraph.vue';
import Modal from "@/components/modal/Modal.vue";
import Preloader from "@/components/preloader/Preloader.vue";
import { mapGetters } from 'vuex';
import { parseWeekData } from '@/helpers/helpers.js'

export default {
    data() {
        return {
            showWeek: false,
            data: null,
            city: null,
            chartType: "",
            showModal: false,
            showPreloader: false,
            textModal: "",
            isConfirmModal: true
        }
    },
    computed: {
        ...mapGetters(['getSavedCity']),
        isSaved() {
            let saved = this.getSavedCity;
            let res = saved.find(el => {
                return el.name == (this.city ? this.city.name : this.initData.name);
            })
            return Boolean(res);
        },
        savedLenght() {
            return this.$store.state.savedWeatherBlock.length 
        }
    },
    props: {
        isSavedPage: Boolean,
        initData: Object,
        index: Number
    },
    methods: {
        setBackground() {
            let id = this.data.current.weather[0].id;
            let img = "";
            
            if (id > 800) {
                img = 'clouds';
            } else if (id == 800) {
                img = 'clearsky'
            } else if (id >= 700) {
                img = 'fog'
            } else if (id >= 600) {
                img = 'snow'
            } else if (id >= 500) {
                img = 'rain2'
            } else if (id >= 300) {
                img = 'drizzle'
            } else if (id >= 200) {
                img = 'thunderstorm'
            } else {
                img = 'clearsky'
            }
            this.$refs.weather.style.backgroundImage = `url('/assets/image/${img}.jpg')`;
            this.showPreloader = false;
        },
        async setCity(city) {
            this.city = city;
            await this.getDayWeatherData(this.city.lon, this.city.lat);
            this.$store.dispatch('changeWeatherBlockData', { city: this.city, i: this.index});
        },
        removeCurrentBlock() {
            this.$store.dispatch('removeWeatherBlock', this.index);
        },
        showRemoveModal() {
            this.isConfirmModal = true;
            this.textModal = `Confirm the deletion of the weather block for ${this.city ? this.city.name : this.initData.name}`
            this.showModal = true;
        },
        saveCurrentCity() {
            if (this.savedLenght < 5) {
                this.$store.dispatch('toggleSavedCity', this.city ? this.city : this.initData);
            } else {
                if (this.isSaved) {
                    this.$store.dispatch('toggleSavedCity', this.city ? this.city : this.initData);
                } else {
                    this.isConfirmModal = false;
                    this.textModal = `You reach maximum of saved City's`;
                    this.showModal = true;
                }
            }
        },
        toggleWeekData() {
            this.showWeek = !this.showWeek;
            this.showPreloader = true;
            if (this.showWeek) {
                let data = this.city ? this.city : this.initData;
                this.getWeekWeatherData(data.lon, data.lat);
            } else {
                let data = this.city ? this.city : this.initData;
                this.getDayWeatherData(data.lon, data.lat);
            }
        },
        async getDayWeatherData(lon, lat) {
            const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
            try {
                const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&exclude=minutely,daily&lon=${lon}&units=metric&appid=${API_KEY}`);
                if (!response.ok) {
                    throw new Error(`${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                this.chartType = "day"
                this.data = data;
                this.setBackground();
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async getWeekWeatherData(lon, lat) {
            const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
                if (!response.ok) {
                    throw new Error(`${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                let weekData = parseWeekData(data);
                this.data.current = weekData.current;
                this.data.hourly = weekData.hourly;
                this.chartType = "5 days";
                this.setBackground();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    },
    mounted() {
        this.getDayWeatherData(this.initData.lon, this.initData.lat);
    },
    components: {
        Preloader,
        WeatherHeader,
        WeatherBlock,
        WeatherGraph,
        Modal
    }
}
</script>

<template>
    <div class="weather" ref="weather">
        <WeatherHeader 
            v-if="!isSavedPage"
            @selected="setCity"
            @remove="showRemoveModal"
            :current="city ? city : initData"
        />
        <div class="weather-container" v-if="data">
            <WeatherBlock 
                :data="data.current" 
                :city="city ? city.name : initData.name"
                @toggleState="toggleWeekData"
                @save="saveCurrentCity"
                :isSaved="isSaved"
            />
            <WeatherGraph :data="data.hourly" :type="chartType"/>
        </div>
        <Modal
            :show="showModal"
            :isConfirm="isConfirmModal"
            @close="showModal = false"
            @decline="showModal = false"
            @confirm="removeCurrentBlock"
        >
            {{ textModal }}
        </Modal>
        <Preloader :show="showPreloader" :isPage="false" />
    </div>
</template>


<style lang="scss" scoped>
    @import 'weather.scss';
</style>