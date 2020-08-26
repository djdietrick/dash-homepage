<template>
    <div>
        STOCKS
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
    methods: {
        ...mapActions(['fetchStockPrice'])
    },
    created() {
        this.fetchStockPrice();
    }
}
</script>

