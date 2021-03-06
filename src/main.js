import { createApp } from 'vue'
import Root from './App.vue'
import VueDiff from 'vue-diff'
// import VueDiff from 'vue-diff/dist/index.es5' // If need to use es5 build
import 'vue-diff/dist/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'

import PrimeVue from 'primevue/config';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Dropdown from 'primevue/dropdown';
import Divider from 'primevue/divider';


import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(Root)


app.use(VueDiff)

axios.defaults.baseURL = import.meta.env.VITE_BASE_API
app.use(VueAxios, axios)

app.use(PrimeVue);
app.component('Dialog', Dialog);
app.component('Button', Button);
app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);
app.component('Dropdown', Dropdown);
app.component('Divider', Divider);

app.mount('#app')
