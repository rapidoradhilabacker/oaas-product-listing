import { createApp } from 'vue';
import App from './App.vue';

// Mount the Vue application to the specified div
const mountApp = () => {
  const targetEl = document.getElementById('vue-products-app');
  if (targetEl) {
    createApp(App).mount(targetEl);
  }
};

// Execute when DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mountApp();
} else {
  document.addEventListener('DOMContentLoaded', mountApp);
}