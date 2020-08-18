import {db} from '../../main.js';

const state = {
    links: []
}

const getters = {
    getLinks: (state) => state.links
}

const mutations = {
    setLinks: (state, links) => state.links = links,
    addLink: (state, link) => {

    }
}

const actions = {
    async fetchLinks({commit}) {

    },
    async addLink({commit}, link) {
        commit('addLink', link);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}