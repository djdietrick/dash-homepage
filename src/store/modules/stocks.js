import {db, functions} from '../../main';
import Vue from 'vue';

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
    addPrice: (state, price) => Vue.set(state.prices, price.ticker, price.prices),
    addTicker: (state, ticker) => state.tickers.add(ticker),
    removeTicker: (state, ticker) => state.tickers.delete(ticker),
    removePrice: (state, ticker) => Vue.delete(state.prices, ticker)
}

const actions = {
    async fetchStockPrices({state, commit, rootState}) {
        try {
            const snapshot = await db.collection('users').doc(rootState.user.userId)
                .collection('stocks').get();
            
            let tickers = new Set();
            snapshot.forEach(doc => {
                tickers.add(doc.data().ticker);
            });

            commit('setTickers', tickers);

            if(state.tickers.length === 0)
                return;

            const getStockPrices = functions.httpsCallable('getStockPrices')
            const res = await getStockPrices({tickers: [
                ...Array.from(state.tickers)
            ]});
            commit('setPrices', res.data.reduce(function(map, val) {
                map[val.ticker] = val.prices;
                return map;
            }, {}));
        } catch(e) {
            console.error(e);
        }
    },
    async fetchStockPrice({commit}, ticker) {
        try {
            const getStockPrices = functions.httpsCallable('getStockPrices')
            const res = await getStockPrices({tickers: [ticker]});
            console.log(res.data);
            commit('addPrice', res.data[0]);
        } catch(e) {
            console.error(e);
        }
    },
    async addTicker({commit, rootState, dispatch}, ticker) {
        const getStockMetaData = functions.httpsCallable('getStockMetaData');
        const mdres = await getStockMetaData({ticker});
        if(typeof mdres.data === "string") 
            throw new Error(mdres.data);

        await db.collection('users').doc(rootState.user.userId).collection('stocks')
            .doc(ticker).set({
                ticker
            }).then(() => {
            }).catch((e) => {
                console.error(e);
            });
        commit('addTicker', ticker);
        dispatch('fetchStockPrice', ticker);
    },
    async removeTicker({commit, rootState}, ticker) {
        await db.collection('users').doc(rootState.user.userId).collection('stocks')
            .doc(ticker).delete();
        commit('removeTicker', ticker);
        commit('removePrice', ticker);
    },
    async getStockMetaData({commit}, ticker) {
        const getStockMetaData = functions.httpsCallable('getStockMetaData');
        const res = await getStockMetaData({ticker});
        console.log(res.data);

    }
}

export default {
    state,
    getters,
    mutations,
    actions
}