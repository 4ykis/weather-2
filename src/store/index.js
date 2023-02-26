import { createStore } from 'vuex';
import { getSavedCity, saveCity, getUserCity } from '@/helpers/helpers.js'

const Store = createStore({
    state: {
        savedWeatherBlock: getSavedCity(),
        weatherBlockData: [await getUserCity()],
        userLocationData: { name: "Lviv", lat: "49.8383", lon: "24.0232" },
    },
    mutations: {
        addWeatherBlock(state) {
            state.weatherBlockData.push(state.userLocationData);
        },
        removeWeatherBlock(state, index) {
            state.weatherBlockData.splice(index, 1);
        },
        changeWeatherBlockData(state, data) {
            state.weatherBlockData[data.i] = data.city;
        },
        toggleSavedCity(state, city) {
            let flag = true;
            let newArr = state.savedWeatherBlock;

            if (newArr.length) {
                newArr.forEach((el, i) => {
                    if (el.name == city.name) {
                        state.savedWeatherBlock.splice(i, 1);
                        flag = false;
                    }
                });
            }

            if (flag) {
                state.savedWeatherBlock.push(city);
            }
            saveCity(state.savedWeatherBlock);
        }
    },
    actions: {
        addWeatherBlock(context) {
            context.commit('addWeatherBlock');
        },
        toggleSavedCity(context, city) {
            context.commit('toggleSavedCity', city);
        },
        removeWeatherBlock(context, index) {
            context.commit('removeWeatherBlock', index);
        },
        changeWeatherBlockData(context, data) {
            context.commit('changeWeatherBlockData', data);
        }
    },
    getters: {
        getSavedCity(state) {
            return state.savedWeatherBlock;
        }
    }
})

export default Store;
