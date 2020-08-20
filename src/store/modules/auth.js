import {db, auth} from '../../main';

const state = {
    user: null
}

const getters = {
    getUser: (state) => state.user
}

const mutations = {
    setUser: (state, user) => state.user = user,
    removeUser: (state) => state.user = null
}

const actions = {
    async signupWithEmail({commit}, form) {
        const cred = await auth.createUserWithEmailAndPassword(form.email, form.password);
        await db.collection('users').doc(cred.user.uid).set({
            email: form.email,
            name: form.name,
            userId: cred.user.uid
        });
        const user = await db.collection('users').doc(cred.user.uid).get();
        commit('setUser', user.data());
    },
    async signupWithGoogle({commit}) {
        
    },
    async loginWithEmail({commit}, form) {
        const cred = await auth.signInWithEmailAndPassword(form.email, form.password);
        const user = await db.collection('users').doc(cred.user.uid).get();
        commit('setUser', user.data());
    },
    async logout({commit}) {
        auth.signOut().then(() => { commit('removeUser') });
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}