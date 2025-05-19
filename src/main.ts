// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';

import router from './router';
import { createPinia } from 'pinia';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/theme-chalk/dark/css-vars.css';
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';

app.use(ElementPlus);
app.use(createPinia());
app.use(router);

app.mount('#app');
