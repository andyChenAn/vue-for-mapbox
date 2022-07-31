import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const app = createApp(App);
app.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre');
  blocks.forEach((block: HTMLPreElement) => {
    hljs.highlightElement(block)
  })
})

app.use(router).mount('#app');
