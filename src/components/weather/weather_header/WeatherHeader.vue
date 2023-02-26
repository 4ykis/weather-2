<script>
    import { debounce } from "debounce";
    import cityNamesList from "@/assets/data/cityNames.json";
    import cityCoordList from "@/assets/data/cityCoord.json";
    import Delete from "@/components/icons/delete.vue";
    
    export default {
        data() {
            return {
                search: this.current.name,
                results: [],
                showResults: false,
                res: null
            }
        },
        computed: {
            blockLenght() {
                return this.$store.state.weatherBlockData.length 
            }
        },
        watch: {
            
        },
        methods: {
            searchCity: debounce(function() {
                if (this.search.length > 2) {
                    this.debounceSearch();
                } else {
                    this.results = [];
                    this.showResults = false;
                }
            }, 500),
            debounceSearch() {
                this.results = [];
                cityNamesList.forEach((city,i) => {
                    if (city.toLowerCase().includes(this.search.toLowerCase())) {
                        this.results.push({
                            name: city,
                            index: i
                        })
                    }
                });
                if (this.results.length > 0) {
                    this.showResults = true;
                }
            },
            selectCity(result) {
                this.res = {
                    name: result.name,
                    lat: cityCoordList[result.index].lat,
                    lon: cityCoordList[result.index].lon
                }
                this.search = result.name;
                this.$emit('selected', this.res);
                this.showResults = false;
            },
            handleClickOutside(e) {
                if (!this.$refs.searchField.contains(e.target)) {
                    this.showResults = false;
                }
            }
        },
        mounted() {
            document.addEventListener('click', this.handleClickOutside);
        },
        destroyed() {
            document.removeEventListener('click', this.handleClickOutside);
        },
        props: {
            current: Object
        },
        components: {
            Delete
        }
    }
</script>

<template>
    <div class="weather_header">
        <div class="weather_header-search" ref="searchField">
            <input type="text" 
                class="weather_header-input" 
                placeholder="Search for a city"
                @input="searchCity"
                v-model="search">
            <ul v-if="showResults" class="weather_header-list">
                <template v-for="item in results" :key="item">
                    <li @click="selectCity(item)" class="weather_header-item">
                        {{ item.name }}
                    </li>
                </template>
            </ul>
        </div>
        
        <button v-if="blockLenght > 1" @click="$emit('remove')" class="weather_header-btn btn-w-icon">
            <Delete :h="'20px'" :w="'20px'"/>
        </button>
    </div>
</template>



<style lang="scss" scoped>
    @import 'weather_header.scss';
</style>