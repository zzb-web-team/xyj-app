import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate';


Validator.extend('phone', {
    validate: value => {
        return value.length === 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
    }
});

Validator.extend('user_nickname', {
    validate: value => {
        return /^(?!(\d+)$)[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(value);
    }
});

const messagesZhHans = {
    required: (field) => ``,
    max: (n, e) => n + "不能超过" + e[0] + "个字符",
    phone: '手机格式错误',
    digits: (n, e) => n + '必须为' + e[0] + "位数字",
    user_nickname: () => '用户昵称格式不对'
}

const attributesZhHans = {
    "user_name": "用户名",
    "phone": "手机号",
    "yzm": "验证码"
}


Vue.use(VeeValidate, {
    locale: 'zh-Hans',
    useConstraintAttrs: false,
    dictionary: {
        'zh-Hans': { messages: messagesZhHans, attributes: attributesZhHans }
    }
});