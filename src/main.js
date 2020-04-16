import Vue from 'vue'
import App from './App'
import i18n from './i18n';
import router from './router'
import Vant from 'vant'
import VeeValidate from 'vee-validate';
import 'vant/lib/index.css'
import './common/css/index_active.css'
import rem from './common/js/util'
import allid from './common/js/getid'
import './common/css/reset.less'
import store from './store/index'
import axios from 'axios'
import echarts from 'echarts'
import Bridge from './config/bridge.js'
import mycommon from './common/js/mycommon.js'
import backStatusMap from './common/js/status';
import './validation/index.js';
import VueScroller from 'vue-scroller'
import Loading from './common/global/loading'
import vueFeedback from 'vue-feedback'
import Scroll from 'vue-slim-better-scroll'
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'
import vuuPull from 'vuu-pull'
// import base from './common/js/base'
// Vue.use(base);

import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
    // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
    ak: '6otZKgx2mh3FKLifdX6w7dqos5NYK86y'
})

Vue.use(vuuPull)
Vue.use(Scroll)




Vue.Cancel = [];
router.beforeEach((to, from, next) => {
    while (Vue.Cancel.length > 0) {
        Vue.Cancel.shift()('cancel');
    }
    next();
})

Vue.use(vueFeedback)
Vue.use(Loading)
Vue.use(VueScroller)
Vue.use(Vant);
Vue.config.productionTip = false;
Vue.use(rem);


Vue.prototype.allid = allid
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;
Vue.prototype.$bridge = Bridge;
Vue.prototype.mycommon = mycommon;
Vue.prototype.$mycommon = mycommon;
Vue.prototype.$backStatusMap = backStatusMap;



/* eslint-disable no-new */
new Vue({
    el: '#app',
    i18n,
    router,
    store,
    render: h => h(App)
        // components: { App }
})
