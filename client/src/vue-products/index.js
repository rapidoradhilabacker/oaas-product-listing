import { createApp } from 'vue';
import App from './App.vue';

// Define a function to mount the app
const mountApp = () => {
  const targetEl = document.getElementById('vue-products-app');
  
  if (targetEl) {
    const app = createApp(App);
    app.mount(targetEl);
    console.log('Vue Products app mounted successfully');
  } else {
    console.error('Target element #vue-products-app not found');
  }
};

// Mount when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  // DOM already loaded, mount immediately
  mountApp();
}