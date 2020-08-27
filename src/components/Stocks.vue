<template>
    <div class="stocks">
        
        <div class="stocks__buttons">
            <sl-dropdown class="add">
                <sl-button slot="trigger" class="trigger"><sl-icon name="plus"></sl-icon></sl-button>
                <div class="add__dropdown">
                    <sl-form @slSubmit="formatAndSubmit">
                        <sl-spinner v-if="waiting" class="add__spinner"></sl-spinner>
                        <sl-input class="add__input" v-sl-model="newTicker" label="Ticker"></sl-input>
                        <sl-button @click="formatAndSubmit" class="add__button">Add</sl-button>
                    </sl-form>
                </div>
            </sl-dropdown>
            <sl-button @click="remove" :disabled="selectedTicker.size === 0"><sl-icon name="dash"></sl-icon></sl-button>
        </div>
        <div class="stocks__summary">
            <div class="stock__placeholder" v-if="tickers.size === 0">
                <h2>Stock Monitor</h2>
                <h3>Add stocks here</h3>
            </div>
            <div class="stock" v-for="(priceList, index) in prices" :key="index"
                :class="{ selected: index == selectedTicker }"
                @click="selectedTicker = index">
                <h3 class="stock__ticker">{{index}}</h3>
                <p class="stock__price">{{getLastPrice(priceList).close}}</p>
                <p class="stock__change" 
                    :class="{ loss: getLastChange(priceList) < 0, gain: getLastChange(priceList) > 0}">
                    {{getLastChange(priceList)}}
                </p>
            </div>
        </div>
        <div class="stocks__details">
            <canvas ref="prices" width="8rem" height="5rem"></canvas>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import Chart from 'chart.js';
import moment from 'moment';

export default {
    data() {
        return {
            newTicker: '',
            error: '',
            waiting: false,
            selectedTicker: ''
        }
    },
    computed: {
        ...mapGetters({
            tickers: 'getTickers',
            prices: 'getPrices'
        })
    },
    watch: {
        selectedTicker: function(t) {
            if(t.length === 0) return;

            let prices = this.prices[t];

            new Chart(this.$refs.prices, {
                type: 'line',
                data: {
                    labels: prices.map(price => moment(price.date).format('M-D')),
                    datasets: [{
                        data: prices.map(price => price.close),
                        label: 'Price',
                        borderColor: 'rgba(41, 152, 255, 1)',
                        backgroundColor: 'rgba(41, 152, 255, 0.5)'
                    }]
                },
                options: {
                    scales: {
                         yAxes: [{
                            stacked: true,
                            gridLines: {
                                display: true,
                                color: "white"
                            }
                        }]
                    },
                    legend: {
                        labels: {
                            fontColor: 'white'
                        }
                    }
                }
            })
        }
    },
    methods: {
        ...mapActions(['fetchStockPrices', 'addTicker', 'removeTicker', 'getStockMetaData']),
        async formatAndSubmit() {
            this.waiting = true;
            try {
                this.error = '';
                await this.addTicker(this.newTicker.toUpperCase());
                this.newTicker = '';
            } catch(e) {
                this.error = e;
            }
            this.waiting = false;
        },
        getLastPrice(arr) {
            if(!arr.length) return 0.0;
            return arr[arr.length - 1];
        },
        getLastChange(arr) {
            if(arr.length < 2) return 0.0;
            return (arr[arr.length - 1].close - arr[arr.length - 2].close).toPrecision(3);
        },
        remove() {
            if(this.selectedTicker.length === 0) return;
            this.removeTicker(this.selectedTicker);
        }
    },
    created() {
        this.fetchStockPrices();
    }
}
</script>

<style lang="scss" scoped>
@import "../styles/main.scss";
.stocks {
    background-color: $color-grey-dark-3;
    border-radius: 1rem;

    position: relative;
    display: grid;
    grid-template-rows: 1fr 2fr;
    grid-template-columns: 1fr 9fr;

    &__summary {
        grid-row: 1 / 2;
        grid-column: 2 / 3;
        display: flex;
        overflow-x: auto;

        .stock {
            width: 7rem;
            height: 10rem;
            margin-top: 1rem;
            margin-left: 2rem;
            &:last-child {
                margin-right: 2rem;
            }

            align-items: center;
            justify-content: space-around;

            background-color: $color-background;
            border-radius: 1rem;
            
            display: flex;
            flex-direction: column;

            &__placeholder {
                opacity: 0.7;
                text-align: center;
                margin: 0 auto;
                margin-top: 3rem;
            }

        }
    }

    &__details {
        grid-row: 2 / 3;
        grid-column: 1 / -1;
    }

    &__buttons {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        margin-left: 1rem;
    }
}

sl-icon {
    transform: translateY(4px);
    font-size: 2rem;
}

.add {
    // position: absolute;
    // top: 13rem;
    // right: 2rem;

    

    &__button {
        margin-top: 1rem;
    }

    &__input::part(base) {
        width: 10rem;
    }

    &::part(panel) {
        border-radius: 1rem;
    }
    
    &__dropdown {
        border-radius: 1rem;
        width: minmax(90%, 75rem);
        height: min-content;
        padding: 3rem;
        background-color: $color-grey-dark-3;
    }

    &__spinner {
        font-size: 3rem;
       --stroke-width: 0.5rem;
       --track-color: $color-white;
    }
}

.loss {
    color: $color-error;
}

.gain {
    color: $color-success;
}

.selected {
    background-color: $color-primary !important;
}
    
</style>