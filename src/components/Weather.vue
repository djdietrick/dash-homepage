<template>
    
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
    data() {
        return {
            newLocation: ''
        }
    },
    methods: {
        ...mapActions(['setLocationAndFetch', 'setCoordinatesAndFetch'])
    },
    computed: {
        ...mapGetters({
            location: 'getLocation',
            weather: 'getWeather'
        })
    },
    mounted() {
        if(this.location.length > 0) {
            this.setLocationAndFetch(this.location);
        } else {
            navigator.geolocation.getCurrentPosition(pos => {
                const coordinates = {
                    lat: pos.coords.latitude,
                    long: pos.coords.longitude
                }
                this.setCoordinatesAndFetch(coordinates);
            }, err => {
                console.log(err);
            })
        }
    }
}
</script>