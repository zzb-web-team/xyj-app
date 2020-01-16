import allpid from "./getid"
import router from "../../router";
// param为传入参数

window.get_pushid = function(data) {
    console.log("种花家的小三毛")
    console.log(data)
    if (data == "(null)") {
        // 没有取到数据
    } else {
        // 取到数据
        if (data) {
            // let nearr = JSON.parse(data);
            allpid.pid = data
            router.push({
                path: '/message_details',
                query: {
                    push_id: allpid.pid
                }
            })
        } else {
            allpid.pid = "a";
            router.push({
                path: '/message',
                query: {
                    push_id: allpid.pid
                }
            })
        }
    }
};


// export default { // Vue.js的插件应当有一个公开方法 install。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象。

//     install(Vue) {
//         console.log("**************")
//         window.get_pushid = get_pushid();
//         Vue.prototype.get_pushid = (data) => get_pushid()

//     }

// }