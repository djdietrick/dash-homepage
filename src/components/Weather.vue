<template>
    <div class="weather">
        <div class="weather__search">
            <sl-form @slSubmit="searchAndFetch" class="form">
                <sl-input class="weather__search--input" v-sl-model="newLocation"></sl-input>
                <sl-button @click="searchAndFetch"><sl-icon name="search"></sl-icon></sl-button>
                <sl-button @click="getCurrentLocationAndFetch"><sl-icon name="geo"></sl-icon></sl-button>
            </sl-form>
        </div>
        <div v-if="weather.currently !== undefined" class="weather__current">
            <div class="weather__current__basics">
                <h1 class="weather__current--temperature">{{Math.trunc(weather.currently.temperature)}}&#176;</h1>
                <sl-icon class="weather__current--icon" name="sun"></sl-icon>
                <h3 class="weather__current--feelslike">Feels like: {{Math.trunc(weather.currently.apparentTemperature)}}&#176;</h3>
            </div>
            <div class="weather__current__details">
                <p class="weather__current__detail">Humidity: {{weather.currently.humidity}}</p>
                <p class="weather__current__detail">Wind Speed: {{weather.currently.windSpeed}}</p>
                <p class="weather__current__detail">UV Index: {{weather.currently.uvIndex}}</p>
                <canvas ref="rain" width="8rem" height="5rem"></canvas>
            </div>
        </div>
        <div v-if="weather.daily !== undefined" class="weather__forecast">
            <div v-for="(day, index) in weather.daily.data.slice(1)" :key="index" class="weather__forecast__day">
                <p class="weather__forecast--day">{{getForecastDate(day.time)}}</p>
                <p class="weather__forecast--day">{{getDayOfWeek(day.time)}}</p>
                <sl-icon class="weather__forecast--icon" name="sun"></sl-icon>
                <p class="weather__forecast--temps">{{Math.trunc(day.apparentTemperatureHigh)}}&#176;/{{Math.trunc(day.apparentTemperatureLow)}}&#176;</p>       
                <p class="weather__forecast--temps"><sl-icon class="droplet" name="droplet"></sl-icon> 
                    {{Math.trunc(day.precipProbability * 100)}}%</p>                 
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
import Chart from 'chart.js';
import moment from 'moment';

export default {
    data() {
        return {
            newLocation: '',
            mounted: false
        }
    },
    methods: {
        ...mapActions(['setLocationAndFetch', 'setCoordinatesAndFetch']),
        searchAndFetch() {
            this.setLocationAndFetch(this.newLocation);
        },
        getCurrentLocationAndFetch() {
             navigator.geolocation.getCurrentPosition(pos => {
                const coordinates = {
                    lat: pos.coords.latitude,
                    long: pos.coords.longitude
                }
                this.setCoordinatesAndFetch(coordinates);
            }, err => {
                console.log(err);
            });
        },
        getForecastDate(time) {
            return moment.unix(time).format("MM/D");
        },
        getDayOfWeek(time) {
            return moment.unix(time).format("ddd");
        },
        updateChart() {
            if(!this.weather.minutely)
                return;

            let precips = this.weather.minutely.data.slice(1).map(min => min.precipIntensity * 100);
            new Chart(this.$refs.rain, {
                type: 'line',
                data: {
                    labels: [0, 10, 20, 30, 40, 50, 60],
                    datasets: [{
                        data: precips,
                        label: 'Intensity',
                        borderColor: 'rgba(41, 152, 255, 1)',
                        backgroundColor: 'rgba(41, 152, 255, 0.5)'
                    }],
                },
                options: {
                    scales: {
                         yAxes: [{
                            stacked: true,
                            gridLines: {
                                display: true,
                                color: "white"
                                },
                            ticks: {
                                suggestedMax: 1,
                                suggestedMin: 0
                            }
                        }]
                    },
                    legend: {
                        labels: {
                            fontColor: 'white'
                        }
                    }
                }
            });
        }
    },
    computed: {
        ...mapGetters({
            location: 'getLocation',
            weather: 'getWeather'
        })
    },
    watch: {
        location: function(l) {
            this.newLocation = l;
        },
        weather: function(w) {
            if(this.mounted) {
                this.updateChart();
            }
        }
    },
    created() {
        if(this.location.length > 0) {
            this.setLocationAndFetch(this.location);
        } else {
            this.getCurrentLocationAndFetch();
        }
        this.newLocation = this.location;
    },
    mounted() {
        this.mounted = true;
        this.updateChart();
    }
}
</script>

<style lang="scss" scoped>
@import "../styles/main.scss";
.weather {
    background-color: $color-grey-dark-3;
    border-radius: 1rem;

    display: grid;
    grid-template-rows: 5rem minmax(1fr, 35rem) minmax(1fr, 25rem);
    grid-gap: 2rem;

    &__search {
        margin-top: 1rem;
        margin-left: 3rem;

        .form::part(base) {
            width: 100%;
            display: flex;
            align-items: center;
        }

        sl-input {
            margin-right: 1rem;
        }

        sl-icon {
            font-size: $default-font-size;
        }

        sl-button {
            margin-right: 1rem;
        }
    }
    &__current {
        display: grid;
        grid-template-columns: 1fr 1fr;

        &__basics {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 7fr 1fr;
            align-items: center;
            justify-items: center;
            margin-left: 2rem;
        }

        &--temperature {
            font-size: 5rem;
        }

        &--icon {
            font-size: 5rem;
            color: $color-primary;
        }

        &--feelslike {
            grid-column: 1 / -1;
        }

        &__details {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            margin-right: 2rem;
        }
    }

    &__forecast {
        padding: 1rem 2rem;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-gap: 0.5rem;
        &__day {
            background-color: $color-background;
            border-radius: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
        }

        .droplet {
            color: #5cb5ff;
        }

        &--date {
            font-weight: 100;
            color: $color-primary;
        }
        &--icon {
            font-size: 3rem;
        }
        &--temps {
            letter-spacing: 0.1rem;
        }
    }
}

</style>