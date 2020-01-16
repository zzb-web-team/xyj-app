import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '@/pages/login/index'
import login from '@/pages/login/login'
import loginCode from '@/pages/login/loginCode'

import find from '@/pages/login/find'
import binding from '@/pages/login/binding'
import username from '@/pages/login/username'
import saoma from '@/pages/login/saoma'
import searchbinding from '@/pages/login/searchbinding'
import emaillogin from '@/pages/login/emaillogin'
import pforgetpassword from '@/pages/login/pforgetpassword'
import emailregistration from '@/pages/login/emailregistration'
import reset from '@/pages/login/reset'
import localsearch from '@/pages/login/localsearch'

import minemachine from '@/pages/income/minemachine'
import ranking from '@/pages/income/ranking'
import allranking from '@/pages/income/allranking'
import bill from '@/pages/income/bill'
import recording from '@/pages/income/recording'
import tomoney from '@/pages/income/tomoney'
import billdetail from '@/pages/income/billdetail'
import success from '@/pages/income/success'

import management from '@/pages/management/management'
import managementinfo from '@/pages/management/managementinfo'
import mining from '@/pages/management/mining'
import ding from '@/pages/management/ding'

import usercenter from '@/pages/userinfo/usercenter'
import user from '@/pages/userinfo/user'
import changephone from '@/pages/userinfo/changephone'
import password from '@/pages/userinfo/password'
import about from '@/pages/userinfo/about'
import privacy from '@/pages/userinfo/privacy'
import message from '@/pages/userinfo/message'
import message_details from '@/pages/userinfo/message_details'
import updatepassword from '@/pages/userinfo/updatepassword'
import setusername from '@/pages/userinfo/setusername'
import useragreement from '@/pages/userinfo/useragreement'
import tool from '@/pages/userinfo/tool'
import remotecontrol from '@/pages/userinfo/remotecontrol'
import versioninformation from '@/pages/userinfo/versioninformation'
import tiao from '@/pages/userinfo/tiao'
import two from '@/pages/userinfo/two'


Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'index',
        component: index,
    },
    {
        path: '/login',
        name: 'login',
        component: login,
        meta: { index: 1 }
    },
    {
        path: '/loginCode',
        name: 'loginCode',
        component: loginCode,
        meta: {
            index: 2,
            keepalive: false, // 组件是否需要被保存
            isBack: false, //判断是否是点击返回按钮进入页面的，默认是false
        }
    },
    {
        path: '/find',
        name: 'find',
        component: find,
        meta: { index: 7 }
    },
    {
        path: '/saoma',
        name: 'saoma',
        component: saoma,
        meta: { index: 5 }
    },
    {
        path: '/searchbinding',
        name: 'searchbinding',
        component: searchbinding,
        meta: { index: 6 }
    },
    {
        path: '/binding',
        name: 'binding',
        component: binding,
        meta: { index: 6 }
    },
    {
        path: '/username',
        name: 'username',
        component: username,
        meta: { index: 2 }
    },
    {
        path: '/minemachine',
        name: 'minemachine',
        component: minemachine,
        meta: {
            index: 5,
            // keepalive: true, // 组件是否需要被保存
            // isBack: true,//判断是否是点击返回按钮进入页面的，默认是false
        }
    },
    {
        path: '/management',
        name: 'management',
        component: management,
        meta: {
            index: 5,
            keepalive: false, // 组件是否需要被保存
            isBack: true, //判断是否是点击返回按钮进入页面的，默认是false
        }
    },
    {
        path: '/usercenter',
        name: 'usercenter',
        component: usercenter,
        meta: { index: 5 }
    },
    {
        path: '/managementinfo',
        name: 'managementinfo',
        component: managementinfo,
        meta: { index: 6 }
    },
    {
        path: '/ranking',
        name: 'ranking',
        component: ranking,
        meta: { index: 6 }
    },
    {
        path: '/bill',
        name: 'bill',
        component: bill,
        meta: {
            index: 6,
            keepalive: true, // 组件是否需要被保存
            isBack: false, //判断是否是点击返回按钮进入页面的，默认是false
        }
    },
    {
        path: '/billdetail',
        name: 'billdetail',
        component: billdetail,
        meta: { index: 7 }
    },
    {
        path: '/success',
        name: 'success',
        component: success,
        meta: { index: 8 }
    },
    {
        path: '/recording',
        name: 'recording',
        component: recording,
        meta: { index: 2 }
    },
    {
        path: '/allranking',
        name: 'allranking',
        component: allranking,
        meta: { index: 6 }
    },
    {
        path: '/tomoney',
        name: 'tomoney',
        component: tomoney,
        meta: { index: 2 }
    },
    {
        path: '/mining',
        name: 'mining',
        component: mining,
        meta: { index: 7 }
    },
    {
        path: '/ding',
        name: 'ding',
        component: ding,
        meta: { index: 6 }
    },
    {
        path: '/user',
        name: 'user',
        component: user,
        meta: { index: 6 }
    },
    {
        path: '/changephone',
        name: 'changephone',
        component: changephone,
        meta: { index: 7 }
    },
    {
        path: '/password',
        name: 'password',
        component: password,
        meta: { index: 6 }
    },
    {
        path: '/about',
        name: 'about',
        component: about,
        meta: { index: 6 }
    },
    {
        path: '/privacy',
        name: 'privacy',
        component: privacy,
        meta: { index: 6 }
    },
    {
        path: '/message',
        name: 'message',
        component: message,
        meta: { index: 6 }
    },
    {
        path: '/message_details',
        name: 'message_details',
        component: message_details,
        meta: { index: 7 }
    },
    {
        path: '/updatepassword',
        name: 'updatepassword',
        component: updatepassword,
        meta: { index: 6 }
    },
    {
        path: '/setusername',
        name: 'setusername',
        component: setusername,
        meta: { index: 7 }
    },
    {
        path: '/useragreement',
        name: 'useragreement',
        component: useragreement,
        meta: { index: 6 }
    },
    {
        path: '/tool',
        name: 'tool',
        component: tool,
        meta: { index: 6 }
    },
    {
        path: '/remotecontrol',
        name: 'remotecontrol',
        component: remotecontrol,
        meta: { index: 8 }
    },
    {
        path: '/emaillogin',
        name: 'emaillogin',
        component: emaillogin,
        meta: { index: 2 }
    },
    {
        path: '/emailregistration',
        name: 'emailregistration',
        component: emailregistration,
        meta: { index: 2 }
    },
    {
        path: '/pforgetpassword',
        name: 'pforgetpassword',
        component: pforgetpassword,
        meta: { index: 2 }
    }, {
        path: '/reset',
        name: 'reset',
        component: reset,
        meta: { index: 2 }
    }, {
        path: '/versioninformation',
        name: 'versioninformation',
        component: versioninformation,
        meta: { index: 2 }
    }, {
        path: '/localsearch',
        name: 'localsearch',
        component: localsearch,
        meta: { index: 2 }
    },
    {
        path: '/tiao',
        name: 'tiao',
        component: tiao,
        meta: { index: 1 }
    },
    {
        path: '/two',
        name: 'two',
        component: two,
        meta: { index: 1 }
    },
]

// const router = new VueRouter({
//   mode:'history',//默认是hash模式
//   linkActiveClass:'menvscode-active',
//   scrollBehavior(to,from,savePosition){ // 在点击浏览器的“前进/后退”，或者切换导航的时候触发。
//     console.log(to) // to：要进入的目标路由对象，到哪里去
//     console.log(from) // from：离开的路由对象，哪里来
//     console.log(savePosition) // savePosition：会记录滚动条的坐标，点击前进/后退的时候记录值{x:?,y:?}
//     /*if(savePosition) {
//       return savePosition;
//     }else{
//       return {x:0,y:0}
//     }*/
//     if(to.hash){ //先判断目标路由有没有hash值
//       return {selector:to.hash}
//     }
//   },
//   routes:routes
// })


const router = new VueRouter({
        routes: routes
    })
    // router.beforeEach((to, from, next) => {
    //     window.get_pushid = this.get_pushid;
    //     next();

// })


export default router