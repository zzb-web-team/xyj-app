import Vue from "vue";
import VueRouter from "vue-router";
import index from "@/pages/login/index";
import login from "@/pages/login/login";
import loginCode from "@/pages/login/loginCode";

import find from "@/pages/login/find";
import binding from "@/pages/login/binding";
import first_bind from "@/pages/login/first_bind";
import username from "@/pages/login/username";
import saoma from "@/pages/login/saoma";
import searchbinding from "@/pages/login/searchbinding";
import emaillogin from "@/pages/login/emaillogin";
import pforgetpassword from "@/pages/login/pforgetpassword";
import emailregistration from "@/pages/login/emailregistration";
import reset from "@/pages/login/reset";
import localsearch from "@/pages/login/localsearch";

import minemachine from "@/pages/income/minemachine";
import ranking from "@/pages/income/ranking";
import allranking from "@/pages/income/allranking";
import bill from "@/pages/income/bill";
import recording from "@/pages/income/recording";
import tomoney from "@/pages/income/tomoney";
import billdetail from "@/pages/income/billdetail";
import success from "@/pages/income/success";
import income_overview from "@/pages/income/income_overview";
import all_income_list from "@/pages/income/all_income_list";
import income_list from "@/pages/income/income_list";
import all_income_detail from "@/pages/income/all_income_detail";

import management from "@/pages/management/management";
import managementinfo from "@/pages/management/managementinfo";
import mining from "@/pages/management/mining";
import ding from "@/pages/management/ding";

import usercenter from "@/pages/userinfo/usercenter";
import user from "@/pages/userinfo/user";
import changephone from "@/pages/userinfo/changephone";
import updatephone from "@/pages/userinfo/updatephone";
import password from "@/pages/userinfo/password";
import about from "@/pages/userinfo/about";
import privacy from "@/pages/userinfo/privacy";
import message from "@/pages/userinfo/message";
import message_details from "@/pages/userinfo/message_details";
import updatepassword from "@/pages/userinfo/updatepassword";
import setusername from "@/pages/userinfo/setusername";
import useragreement from "@/pages/userinfo/useragreement";
import tool from "@/pages/userinfo/tool";
import remotecontrol from "@/pages/userinfo/remotecontrol";
import versioninformation from "@/pages/userinfo/versioninformation";
import tiao from "@/pages/userinfo/tiao";
import two from "@/pages/userinfo/two";
import about_us from "@/pages/userinfo/about_us";
import my_scores from "@/pages/userinfo/my_scores";
import node_scores from "@/pages/userinfo/node_scores";
import help_center from "@/pages/userinfo/help_center";
import help_detail from "@/pages/userinfo/help_detail";

import calculation_details from "@/pages/node/calculation_details";
import dev_calculation from "@/pages/node/dev_calculation";
import dynamic_node from "@/pages/node/dynamic_node";
import mining_node from "@/pages/node/mining_node";
import node_details from "@/pages/node/node_details";
import node_recird from "@/pages/node/node_recird";
import node_rules from "@/pages/node/node_rules";

import monitor_details from "@/pages/monitor/monitor_details";
import search_dev from "@/pages/management/search_dev";

Vue.use(VueRouter);

const routes = [{
        path: "/",
        name: "index",
        component: index
    },
    {
        path: "/login",
        name: "login",
        component: login,
        meta: { index: 1 }
    },
    {
        path: "/loginCode",
        name: "loginCode",
        component: loginCode,
        meta: {
            index: 2,
            keepalive: false, // 组件是否需要被保存
            isBack: false //判断是否是点击返回按钮进入页面的，默认是false
        }
    },
    {
        path: "/find",
        name: "find",
        component: find,
        meta: { index: 7 }
    },
    {
        path: "/saoma",
        name: "saoma",
        component: saoma,
        meta: { index: 5 }
    },
    {
        path: "/searchbinding",
        name: "searchbinding",
        component: searchbinding,
        meta: { index: 6 }
    },
    {
        path: "/binding",
        name: "binding",
        component: binding,
        meta: { index: 6 }
    },
    {
        path: "/first_bind",
        name: "/first_bind",
        component: first_bind,
        meta: { index: 6 }
    },
    {
        path: "/username",
        name: "username",
        component: username,
        meta: { index: 2 }
    },
    {
        path: "/minemachine",
        name: "minemachine",
        component: minemachine,
        meta: {
            index: 5
                // keepalive: true, // 组件是否需要被保存
                // isBack: true,//判断是否是点击返回按钮进入页面的，默认是false
        }
    },
    {
        path: "/income_overview",
        name: "income_overview",
        component: income_overview,
        meta: {
            index: 5
        }
    },
    {
        path: "/all_income_list",
        name: "all_income_list",
        component: all_income_list,
        meta: {
            index: 6
        }
    },
    {
        path: "/all_income_detail",
        name: "all_income_detail",
        component: all_income_detail,
        meta: {
            index: 7
        }
    },
    {
        path: "/income_list",
        name: "income_list",
        component: income_list,
        meta: {
            index: 6
        }
    },
    {
        path: "/management",
        name: "management",
        component: management,
        meta: {
            index: 5,
            keepalive: false, // 组件是否需要被保存
            isBack: true //判断是否是点击返回按钮进入页面的，默认是false
        }
    },
    {
        path: "/usercenter",
        name: "usercenter",
        component: usercenter,
        meta: { index: 5 }
    },
    {
        path: "/managementinfo",
        name: "managementinfo",
        component: managementinfo,
        meta: { index: 6 }
    },
    {
        path: "/ranking",
        name: "ranking",
        component: ranking,
        meta: { index: 6 }
    },
    {
        path: "/bill",
        name: "bill",
        component: bill,
        meta: {
            index: 6,
            keepalive: true, // 组件是否需要被保存
            isBack: false //判断是否是点击返回按钮进入页面的，默认是false
        }
    },
    {
        path: "/billdetail",
        name: "billdetail",
        component: billdetail,
        meta: { index: 7 }
    },
    {
        path: "/success",
        name: "success",
        component: success,
        meta: { index: 8 }
    },
    {
        path: "/recording",
        name: "recording",
        component: recording,
        meta: { index: 2 }
    },
    {
        path: "/allranking",
        name: "allranking",
        component: allranking,
        meta: { index: 6 }
    },
    {
        path: "/tomoney",
        name: "tomoney",
        component: tomoney,
        meta: { index: 2 }
    },
    {
        path: "/mining",
        name: "mining",
        component: mining,
        meta: { index: 7 }
    },
    {
        path: "/ding",
        name: "ding",
        component: ding,
        meta: { index: 6 }
    },
    {
        path: "/user",
        name: "user",
        component: user,
        meta: { index: 6 }
    },
    {
        path: "/changephone",
        name: "changephone",
        component: changephone,
        meta: { index: 7 }
    },
    {
        path: "/updatephone",
        name: "updatephone",
        component: updatephone,
        meta: { index: 8 }
    },
    {
        path: "/password",
        name: "password",
        component: password,
        meta: { index: 6 }
    },
    {
        path: "/about",
        name: "about",
        component: about,
        meta: { index: 6 }
    },
    {
        path: "/about_us",
        name: "about_us",
        component: about_us,
        meta: { index: 6 }
    },
    {
        path: "/my_scores",
        name: "my_scores",
        component: my_scores,
        meta: { index: 6 }
    },
    {
        path: "/node_scores",
        name: "node_scores",
        component: node_scores,
        meta: { index: 6 }
    },
    {
        path: "/privacy",
        name: "privacy",
        component: privacy,
        meta: { index: 6 }
    },
    {
        path: "/message",
        name: "message",
        component: message,
        meta: { index: 6 }
    },
    {
        path: "/message_details",
        name: "message_details",
        component: message_details,
        meta: { index: 7 }
    },
    {
        path: "/updatepassword",
        name: "updatepassword",
        component: updatepassword,
        meta: { index: 6 }
    },
    {
        path: "/setusername",
        name: "setusername",
        component: setusername,
        meta: { index: 7 }
    },
    {
        path: "/useragreement",
        name: "useragreement",
        component: useragreement,
        meta: { index: 6 }
    },
    {
        path: "/tool",
        name: "tool",
        component: tool,
        meta: { index: 6 }
    },
    {
        path: "/help_center",
        name: "help_center",
        component: help_center,
        meta: { index: 6 }
    },
    {
        path: "/help_detail",
        name: "help_detail",
        component: help_detail,
        meta: { index: 7 }
    },
    {
        path: "/remotecontrol",
        name: "remotecontrol",
        component: remotecontrol,
        meta: { index: 8 }
    },
    {
        path: "/emaillogin",
        name: "emaillogin",
        component: emaillogin,
        meta: { index: 2 }
    },
    {
        path: "/emailregistration",
        name: "emailregistration",
        component: emailregistration,
        meta: { index: 2 }
    },
    {
        path: "/pforgetpassword",
        name: "pforgetpassword",
        component: pforgetpassword,
        meta: { index: 2 }
    },
    {
        path: "/reset",
        name: "reset",
        component: reset,
        meta: { index: 2 }
    },
    {
        path: "/versioninformation",
        name: "versioninformation",
        component: versioninformation,
        meta: { index: 2 }
    },
    {
        path: "/localsearch",
        name: "localsearch",
        component: localsearch,
        meta: { index: 2 }
    },
    {
        path: "/tiao",
        name: "tiao",
        component: tiao,
        meta: { index: 1 }
    },
    {
        path: "/two",
        name: "two",
        component: two,
        meta: { index: 1 }
    },
    {
        path: "/calculation_details",
        name: "calculation_details",
        component: calculation_details,
        meta: {
            index: 6,
            keepalive: false // 组件是否需要被保存
        }
    },
    {
        path: "/dev_calculation",
        name: "dev_calculation",
        component: dev_calculation,
        meta: {
            index: 6,
            keepalive: false // 组件是否需要被保存
        }
    },
    {
        path: "/dynamic_node",
        name: "dynamic_node",
        component: dynamic_node,
        meta: {
            index: 5,
            keepalive: false // 组件是否需要被保存
        }
    },
    {
        path: "/mining_node",
        name: "mining_node",
        component: mining_node,
        meta: {
            index: 6,
            keepalive: false // 组件是否需要被保存
        }
    },
    {
        path: "/node_details",
        name: "node_details",
        component: node_details,
        meta: {
            index: 6,
            keepalive: false // 组件是否需要被保存
        }
    },
    {
        path: "/node_recird",
        name: "node_recird",
        component: node_recird,
        meta: {
            index: 6,
            keepalive: false // 组件是否需要被保存
        }
    },
    {
        path: "/node_rules",
        name: "node_rules",
        component: node_rules,
        meta: {
            index: 7,
            keepalive: false // 组件是否需要被保存
        }
    },
    {
        path: "/monitor_details",
        name: "monitor_details",
        component: monitor_details,
        meta: {
            index: 5,
            keepalive: false // 组件是否需要被保存
        }
    },
    {
        path: "/search_dev",
        name: "search_dev",
        component: search_dev,
        meta: {
            index: 6,
            keepalive: false, // 组件是否需要被保存
            isBack: true //判断是否是点击返回按钮进入页面的，默认是false
        }
    }
];

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
});
// router.beforeEach((to, from, next) => {
//     window.get_pushid = this.get_pushid;
//     next();

// })

export default router;