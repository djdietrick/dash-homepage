import {db} from '../../main.js';
import { v4 as uuidv4 } from 'uuid';

const state = {
    links: []
}

const getters = {
    getLinks: (state) => state.links
}

const mutations = {
    setLinks: (state, links) => state.links = links,
    addLink: (state, link) => {
        if(state.links.find(l => l.id === link.id))
            return;
        state.links.push(link);
    },
    removeLink: (state, id) => {
        state.links = state.links.filter(link => link.id != id);
    }
}

const actions = {
    async fetchLinks({commit, rootState}) {
        if(!rootState.user)
            throw new Error("Not logged in");

        // Commenting out for now and just using local storage
        
        db.collection('links').doc(rootState.user.userId).collection('links').get()
            .then(snapshot => {
                let links = [];
                for(let i = 0; i < snapshot.docs.length; i++) {
                    links.push(snapshot.docs[i].data());
                }
                commit('setLinks', links);
            })
    },
    async addLink({commit, rootState}, link) {
        if(!rootState.user)
            throw new Error("Not logged in");

        link.url = link.url.replace(/^(https?:\/\/)?(w{3})?\.?/g, '')
        //link.url = link.url.replace('/', '\\/')

        // TODO : Replace this with cloud function, use puppeteer to get title automatically and use that as key

        link.id = uuidv4();

        await db.collection('links').doc(rootState.user.userId).collection('links')
            .doc(link.id).set({
                id: link.id,
                url: link.url,
                name: link.name,
                category: link.category
            }).then(() => {
            }).catch((e) => {
                console.error(e);
            });

        commit('addLink', link);

    },
    async removeLink({commit, rootState}, link) {
        if(!rootState.user)
            throw new Error("Not logged in");
        
        // Commenting out for now, will uncomment when using Firestore
        await db.collection('links').doc(rootState.user.userId).collection('links')
            .doc(link.id).delete();
        
        commit('removeLink', link.id);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}