    <script>
    import Star from "@/components/icons/Star.vue";
    import Star_active from "@/components/icons/Star_active.vue";
    import Sunset from "@/components/icons/Sunset.vue";
    import Sunrise from "@/components/icons/Sunrise.vue";
    import { debounce } from "debounce";

    export default {
        data() {
            return {
                isToggleActive: false
            }
        },
        props: {
            isSaved: Boolean,
            data: Object,
            city: String
        },
        methods: {
            emitToggle: debounce(function() {
                this.$emit('toggleState');
            }, 500),
            toggleState() {
                this.isToggleActive = !this.isToggleActive;
                this.emitToggle();
            }
        },
        components: {
            Star,
            Star_active,
            Sunrise,
            Sunset
        }
    }
</script>

<template>
    <div class="weather_block">
        <div class="weather_block-top">
            <div class="weather_block-header">
                <h2 class="weather_block-title">{{ city }}</h2>
                <button @click="$emit('save')" class="btn btn-w-icon btn-clear">
                    <Star :h="'30px'" :w="'30px'" v-if="!isSaved" />
                    <Star_active :h="'30px'" :w="'30px'" v-if="isSaved"/>
                </button>
            </div>
        </div>
        <div class="weather_block-middle">
            <div class="weather_block-temp">
                <img class="weather_block-temp_img" :src="`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`" :alt="data.weather[0].main">
                <div class="weather_block-temp_inner">
                    <h4 class="weather_block-temp_title">
                        {{ Math.round(data.temp) }}<span>°C</span>
                    </h4>
                    <p  class="weather_block-temp_subtitle">
                        Feels like: {{  Math.round(data.feels_like) }}<span>°C</span>
                    </p>
                </div>
            </div>
            <div class="weather_block-sun" v-if="data.sunrise && data.sunset">
                <div class="weather_block-sunrise">
                    <div class="weather_block-sun_icon">
                        <Sunrise/>
                    </div>
                    {{ new Date(data.sunrise * 100).getHours() }}:{{ new Date(data.sunrise * 100).getMinutes() }}
                </div>
                <div class="weather_block-sunset">
                    <div class="weather_block-sun_icon">
                        <Sunset/>
                    </div>
                    {{ new Date(data.sunset * 100).getHours() }}:{{ new Date(data.sunset * 100).getMinutes() }}
                </div>
            </div>
        </div>
        <div class="weather_block-bottom">
            <div class="weather_block-additional">
                <div class="weather_block-additional_block m-wind">
                    <div class="weather_block-additional_title">Wind:</div>
                    <div class="weather_block-additional_val">
                        {{ data.wind_speed }}<span>m/s</span>
                    </div>
                </div>
                <div class="weather_block-additional_block m-humidity">
                    <div class="weather_block-additional_title">Humidity:</div>
                    <div class="weather_block-additional_val">
                        {{ data.humidity }}<span>%</span>
                    </div>
                    
                </div>
                <div class="weather_block-additional_block m-wind">
                    <div class="weather_block-additional_title">Clouds:</div>
                    <div class="weather_block-additional_val">
                        {{ data.clouds }}<span>%</span>
                    </div>
                </div>
            </div>
            <div class="weather_block-toggle">
                <span>Toggle Days:</span>
                <div :title="isToggleActive ? 5 : 1" :class="['weather_block-toggle_inner', {'active': isToggleActive}]" @click="toggleState" ></div>
            </div>
        </div>
    </div>
</template>



<style lang="scss" scoped>
    @import 'weather_block.scss';
</style>