import mycommon from "../../common/js/mycommon";

// initial state
const state = {
    log_token: "",
    phone_number: "",
    user_name: "",
    user_sex: "",
    charge_psd: "",
    cancelTokenArr: [], // 取消请求token数组
    keepAlive: []
};

// getters
const getters = {};

// actions
const actions = {};

// mutations
const mutations = {
    updateUser(state, obj) {
        for (let k in obj) {
            if (obj.hasOwnProperty(k)) {
                state[k] = obj[k];
            }
        }
        mycommon.storage(state);
    },
    clearUser(state) {
        state = {
            log_token: "",
            phone_number: "",
            user_name: "",
            user_sex: "",
            charge_psd: ""
        };
        mycommon.storage(state);
    },
    pushToken(state, payload) {

        state.cancelTokenArr.push(payload.cancelToken);
    },

    clearToken({ cancelTokenArr }) {

        cancelTokenArr.forEach(item => {

            item('路由跳转取消请求');
        });

        cancelTokenArr = [];
    },
    changeKeepAlive_: (state, keepAlive_) => {
        if (typeof keepAlive_ == "string") {
            state.keepAlive.push(keepAlive_);
        } else {
            state.keepAlive = keepAlive_;
        }
    }
};

export default {
    //   namespaced: true,
    state,
    getters,
    actions,
    mutations
};