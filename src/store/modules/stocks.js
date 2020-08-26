import {db, functions} from '../../main';

const state = {
    tickers: new Set(),
    prices: {}
}

const getters = {
    getTickers: (state) => state.tickers,
    getPrices: (state) => state.prices
}

const mutations = {
    setTickers: (state, tickers) => state.tickers = tickers,
    setPrices: (state, prices) => state.prices = prices,
    addTicker: (state, ticker) => state.tickers.insert(ticker)
}

const actions = {
    async fetchStockPrice(symbol) {
        try {
            const getStockPrices = functions.httpsCallable('getStockPrices')
            const res = await getStockPrices({ticker: 'TSLA'});
            console.log(res);
        } catch(e) {
            console.error(e);
        }
        
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}