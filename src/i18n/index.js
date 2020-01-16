import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from './en';
import zhHans from './zh-Hans';
import zhHant from './zh-Hant';

Vue.use(VueI18n);

const messages = {
  'zh-Hans': zhHans,
  'zh-Hant': zhHant,
  'en': en 
};

export default new VueI18n({
  locale: 'zh-Hans', // 设置地区
//   locale: 'en',
  messages, // 设置地区信息
})