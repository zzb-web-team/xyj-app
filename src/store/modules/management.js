import mycommon from "../../common/js/mycommon";
import { pushd } from "shelljs";

// initial state
const state = {
    devsn: '',
    minerstates: '',
    listInfoText: '',
    pushid: ""
};

// getters
const getters = {};

// actions
const actions = {
    savelistInfoText({ commit }, savelistInfoText) {
        commit('savelistInfoText', savelistInfoText)
    }
};

// mutations
const mutations = {
    setdevsn(state, devsn) { //设备sn
        state.devsn = devsn
    },
    setdevstatus(state, minerstates) { //设备状态
        state.minerstates = minerstates
    },
    savelistInfoText(state, listInfoText) { //设备sn
        state.listInfoText = listInfoText
    },
    setpushid(state, pushid) {
        state.pushid = pushid
    }
};

export default {
    //   namespaced: true,
    state,
    getters,
    actions,
    mutations
};