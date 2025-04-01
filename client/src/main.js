import './assets/main.css';
import './assets/toast.css';

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  GiVote,
  GiMuscleUp,
  BiArrowUpRight,
  BiPlus,
  FaEdit,
  MdDeleteoutlineSharp,
  MdArrowbackRound
} from 'oh-vue-icons/icons';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const options = {
  position: POSITION.TOP, // Position of the toasts
  timeout: 3000, // Default timeout for toasts (in milliseconds)
  closeOnClick: true, // Close toast on click
  pauseOnFocusLoss: false, // Pause toast when window loses focus
  pauseOnHover: true, // Pause toast on hover
  draggable: true, // Make toasts draggable
  draggablePercent: 0.6, // Draggable percentage (0 - 1)
  showCloseButtonOnHover: false, // Show close button on hover
  hideProgressBar: false, // Hide the progress bar
  closeButton: 'icon', // Close button type ('button' or 'icon')
  icon: true, // Show icon for toasts
  rtl: false, // Enable right-to-left layout
  transition: 'Vue-Toastification__fade', // Transition type
  maxToasts: 6, // Maximum number of toasts to display at once
  newestOnTop: true, // Add new toasts on top
  toastClassName: 'custom-toast',
  bodyClassName: ['custom-toast-body']
};

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(router);
app.use(Toast, options);
app.use(createPinia());

addIcons(
  GiVote,
  GiMuscleUp,
  BiArrowUpRight,
  BiPlus,
  FaEdit,
  MdDeleteoutlineSharp,
  MdArrowbackRound
);
app.component('v-icon', OhVueIcon);

app.mount('#app');
