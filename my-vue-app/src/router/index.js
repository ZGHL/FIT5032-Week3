import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import FireLogin from '../views/FirebaseSigninView.vue'
import FireRegister from '../views/FirebaseRegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import AddBookView  from "../views/AddBookView.vue";
import GetBookCount from "../views/GetBookCountView.vue";
import GetWeather from "../views/WeatherView.vue";
import CountBookAPI from "@/views/CountBookAPI.vue";
import { isAuthenticated } from '../auth.js'
import { getAuth } from "firebase/auth";
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FireLogin
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FireRegister
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView
  },
  {
    path: '/AddBook',
    name: 'AddBook',
    component: AddBookView
  },
  {
    path: '/GetBookCount',
    name: 'GetBookCount',
    component: GetBookCount
  },
  {
    path: '/WeatherCheck',
    name: 'GetWeather',
    component: GetWeather
  },
  {
    path: '/CountBookAPI',
    name: 'CountBookAPI',
    component: CountBookAPI
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// router.beforeEach((to, from, next) => {
//     if (to.name !== 'FirebaseLogin' && !getAuth().currentUser === null) {
//       alert('You must be logged in to access this page.')
//         next({ name: 'FirebaseLogin' })
//     } else {
//         next()
//     }
// });

export default router