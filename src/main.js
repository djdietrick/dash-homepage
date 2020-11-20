import Vue from 'vue'
import App from './App.vue'
import store from './store'
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/auth';

import './styles/main.scss';
import ShoelaceModelDirective from '@shoelace-style/vue-sl-model';
Vue.config.ignoredElements = [/^sl-/];
Vue.use(ShoelaceModelDirective);

Vue.config.productionTip = false;

firebase.initializeApp({
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: "dash-website-1b9cb.firebaseapp.com",
  databaseURL: "https://dash-website-1b9cb.firebaseio.com",
  projectId: "dash-website-1b9cb",
  storageBucket: "dash-website-1b9cb.appspot.com",
  messagingSenderId: process.env.VUE_APP_MESSENGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID
});

export const db = firebase.firestore();
export const functions = firebase.functions();
export const auth = firebase.auth();

new Vue({
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
