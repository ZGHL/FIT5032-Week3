import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1xBQ8LM0NLlg-xwzyyrrX0d7tQOKyQ3U",
  authDomain: "week7-guohouzhang.firebaseapp.com",
  projectId: "week7-guohouzhang",
  storageBucket: "week7-guohouzhang.firebasestorage.app",
  messagingSenderId: "85043116688",
  appId: "1:85043116688:web:979ad39464f8ba7763b615"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const vueApp = createApp(App)
vueApp.use(PrimeVue, { theme: { preset: Aura } })
vueApp.use(router)

vueApp.mount('#app')

