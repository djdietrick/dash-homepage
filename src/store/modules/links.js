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
        if(state.links.find(l => l.url === link.url))
            return;
        state.links.push(link);
    },
    removeLink: (state, url) => {
        state.links = state.links.filter(link => link.url != url);
    }
}

const actions = {
    async fetchLinks({commit, rootState}) {
        if(!rootState.user)
            throw new Error("Not logged in");

        // Commenting out for now and just using local storage
        
        db.collection('users').doc(rootState.user.userId).collection('links').get()
            .then(snapshot => {
                let links = [];
                for(let i = 0; i < snapshot.docs.length; i++) {
                    links.push(snapshot.docs[i].data());
                }
                commit('setLinks', links);
            })
    },
    addLink({commit, rootState}, link) {
        if(!rootState.user)
            throw new Error("Not logged in");

        link.url = link.url.replace(/^(https?:\/\/)?(w{3})?\.?/g, '')

        commit('addLink', link);

        db.collection('users').doc(rootState.user.userId).collection('links')
            .doc(link.url).set({
                url: link.url,
                name: link.name,
                category: link.category
            }).then(() => {
            }).catch((e) => {
                console.error(e);
            });
    },
    async removeLink({commit, rootState}, link) {
        if(!rootState.user)
            throw new Error("Not logged in");
        
        // Commenting out for now, will uncomment when using Firestore
        await db.collection('users').doc(rootState.user.userId).collection('links')
            .doc(link.url).delete();
        
        commit('removeLink', link.url);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}