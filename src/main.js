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
  apiKey: "AIzaSyCoTRxagOnK0M_Tizp8220s3mcX3itpCgg",
  authDomain: "dash-homepage-b17fb.firebaseapp.com",
  databaseURL: "https://dash-homepage-b17fb.firebaseio.com",
  projectId: "dash-homepage-b17fb",
  storageBucket: "dash-homepage-b17fb.appspot.com",
  messagingSenderId: "1005228845792",
  appId: "1:1005228845792:web:57e57d4a6139fe85ae3e85",
  measurementId: "G-9HNWW7JZT2"
});

export const db = firebase.firestore();
export const functions = firebase.functions();
export const auth = firebase.auth();

new Vue({
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
