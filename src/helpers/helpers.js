function getSavedCity() {
    let saved = localStorage.getItem('saved_city') || '[]';
    return JSON.parse(saved);
}

function saveCity(arr) {
    localStorage.setItem('saved_city', JSON.stringify(arr));
}

async function getUserData() {
    try {
        const response = await fetch('https://ipinfo.io/178.212.96.129?token=8daaeaadb4dc55');
        if (!response.ok) {
            throw new Error(`${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getUserCity() {
    try {
        const data = await getUserData();
        let location = data.loc.split(',');
        return { name: data.city, lat: location[0], lon: location[1] }
    } catch (error) {
        console.error('Error:', error);
        return { name: "London", lat: 51.50853, lon: -0.12574 }
    }
}

function countMostDuplicates(arr) {
    const count = {};
    let maxCount = 0;

    // Count occurrences of each element in the array
    for (let i = 0; i < arr.length; i++) {
        const elem = arr[i];
        count[elem] = (count[elem] || 0) + 1;
        maxCount = Math.max(maxCount, count[elem]);
    }

    // Find all elements that have the maximum count
    const result = [];
    for (const elem in count) {
        if (count[elem] === maxCount) {
        result.push(elem);
        }
    }

    return result;
}

function parseWeekData(data) {
    let DATA = {
        hourly: [],
        current: {}
    }

    let id = [];
    let icons = [];
    let days = {};
    let avgData = {
        temp: 0,
        feels: 0,
        clouds: 0,
        wind: 0,
        humidity: 0
    }

    data.list.forEach(el => {
        let date = new Date(el.dt * 1000);
        let dateMonth = null;
        if (date.getMonth().length > 1) {
            dateMonth = date.getMonth() + 1;
        } else {
            dateMonth = "0" + (date.getMonth() + 1);
        }
        let dateDayMonth = `${date.getDate()}.${dateMonth}`;
        if ( !days[dateDayMonth] ) {
            days[dateDayMonth] = {
                current: [el.main.temp],
                feels: [el.main.feels_like],
                clouds: [el.clouds.all],
                wind: [el.wind.speed],
                humidity: [el.main.humidity],
                icons: [el.weather[0].icon],
                id: [el.weather[0].id]
            }
        } else {
            days[dateDayMonth].current.push(el.main.temp);
            days[dateDayMonth].feels.push(el.main.feels_like);
            days[dateDayMonth].clouds.push(el.clouds.all);
            days[dateDayMonth].wind.push(el.wind.speed);
            days[dateDayMonth].humidity.push(el.main.humidity);
            days[dateDayMonth].icons.push(el.weather[0].icon);
            days[dateDayMonth].id.push(el.weather[0].id);
        }
    });

    for (let item in days) {
        let currentAverage = 0;
        let feelsAverage = 0;
        let cloudsAverage = 0;
        let windAverage = 0;
        let humidityAverage = 0;

        days[item].current.forEach(el => currentAverage += el);
        days[item].feels.forEach(el => feelsAverage += el);
        days[item].clouds.forEach(el => cloudsAverage += el);
        days[item].wind.forEach(el => windAverage += el);
        days[item].humidity.forEach(el => humidityAverage += el);

        days[item].current = +(currentAverage/days[item].current.length).toFixed(2);
        days[item].feels = +(feelsAverage/days[item].feels.length).toFixed(2);
        days[item].clouds = +(cloudsAverage/days[item].clouds.length).toFixed(2);
        days[item].wind = +(windAverage/days[item].wind.length).toFixed(2);
        days[item].humidity = +(humidityAverage/days[item].humidity.length).toFixed(2);

        avgData.temp += days[item].current;
        avgData.feels += days[item].feels;
        avgData.clouds += days[item].clouds;
        avgData.wind += days[item].wind;
        avgData.humidity += days[item].humidity;

        icons = icons.concat(days[item].icons);
        id = id.concat(days[item].id);
        
        DATA.hourly.push({
            label: item,
            temp: days[item].current,
            feels_like: days[item].feels
        })
    }

    icons = countMostDuplicates(icons);
    id = countMostDuplicates(id);

    avgData.temp = +(avgData.temp/Object.keys(days).length).toFixed(2);
    avgData.feels = +(avgData.feels/Object.keys(days).length).toFixed(2);
    avgData.clouds = +(avgData.clouds/Object.keys(days).length).toFixed(2);
    avgData.wind = +(avgData.wind/Object.keys(days).length).toFixed(2);
    avgData.humidity = +(avgData.humidity/Object.keys(days).length).toFixed(2);
    
    DATA.current = {
        clouds: avgData.clouds,
        feels_like: avgData.feels,
        temp: avgData.temp,
        humidity: avgData.humidity,
        wind_speed: avgData.wind,
        weather: [{
            icon: icons[0],
            id: id[0]
        }]
    }

    return DATA;
}

export { getSavedCity, saveCity, getUserCity, getUserData, parseWeekData };