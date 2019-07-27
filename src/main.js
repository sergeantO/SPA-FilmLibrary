// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// Libs
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Uimini from 'uimini/dist/css/uimini.css'

// Components
import App from './App'
import router from './router'
import store from './store'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/messaging'
import 'firebase/storage'

Vue.use(
  Vuelidate,
  Uimini
)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    var firebaseConfig = {
      apiKey: 'AIzaSyB5je9jQZUhb2zpYD8gy2asGKyZRNmnvds',
      authDomain: 'film-library-e6f22.firebaseapp.com',
      databaseURL: 'https://film-library-e6f22.firebaseio.com',
      projectId: 'film-library-e6f22',
      storageBucket: '',
      messagingSenderId: '312155744861',
      appId: '1:312155744861:web:929ea07d03c63734'
    }
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig)
  }
})
