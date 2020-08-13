import {db, functions} from '../../main.js';

const state = {
    location: '',
    coordinates: {
        lat: 0,
        long: 0
    },
    weather: {}
}

const getters = {
    getLocation: (state) => state.location,
    getCoordinates: (state) => state.coordinates,
    getWeather: (state) => state.weather
}

const mutations = {
    setLocation: (state, location) => state.location = location,
    setCoordinates: (state, coor) => state.coordinates = coor,
    setWeather: (state, weather) => state.weather = weather
}

const actions = {
    setLocationAndFetch ({commit, dispatch}, location) {
        commit('setLocation', location);
        dispatch('calcCoordinates');
    },
    async setCoordinatesAndFetch({commit, dispatch}, coordinates) {
        commit('setCoordinates', coordinates);
        const getLocation = functions.httpsCallable('getLocation');
        try {
            const location = await getLocation(coordinates);
        
            if(location.data.features && location.data.features.length > 0) {
                let city, state;
                for(let i = 0; i < location.data.features[0].context.length; i++) {
                    const temp = location.data.features[0].context[i];
                    if(temp.id.startsWith("place"))
                        city = temp.text;
                    else if(temp.id.startsWith("region"))
                        state = temp.text;
                }

                commit('setLocation', `${city}, ${state}`);
            }
        } catch(e) {
            console.error("Error getting location: ", e);
        }
        
       

        dispatch('fetchWeather');
    },
    async calcCoordinates ({commit, state, dispatch}) {
        const getLatLong = functions.httpsCallable('getLatLong');
        const coordinates = await getLatLong(state.location);
        commit('setCoordinates', coordinates.data);
        dispatch('fetchWeather');
    },
    async fetchWeather ({commit, state}) {
        if(state.coordinates.lat === undefined || state.coordinates.long === undefined)
            return;

        try {
            const fetchWeather = functions.httpsCallable('fetchWeather')
            const res = await fetchWeather(state.coordinates);
            commit('setWeather', res.data);
        } catch (e) {
            console.log(e);
        }    
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}