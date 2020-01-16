// 试着REM
import router from "../../router";
// import allpid from "./getid"
export default function() {
    fnResize()
    window.onresize = function() {
            fnResize()
        }
        // window.onload = function() {
        //     get_pushid()
        // }

    function fnResize() {
        var deviceWidth = document.documentElement.clientWidth || window.innerWidth
        if (deviceWidth >= 750) {
            deviceWidth = 750
        }

        if (deviceWidth <= 320) {
            deviceWidth = 320
        }
        document.documentElement.style.fontSize = (deviceWidth / 7.5) + 'px'
    }


    // function get_pushid(data) {

    //     console.log(allpid.pid, "测试测试测试测试测试测试测试测试测试测试");
    //     if (data == "(null)") {
    //         // 没有取到数据
    //         allpid.pid = "a";
    //     } else {
    //         // 取到数据
    //         if (data) {
    //             // let nearr = JSON.parse(data);
    //             allpid.pid = data
    //         } else {
    //             console.log(allpid.pid);
    //             allpid.pid = "a"
    //         }
    //     }

    // }





    window.addEventListener("message", receiveMessage, false);

    function receiveMessage(event) {
        if (event.origin == "http://47.99.193.140") {
            router.push("/tomoney");
        }

    }
    // function IsPC() {
    //   var userAgentInfo = navigator.userAgent;
    //   var reg = new RegExp("(Android|iPhone|SymbianOS|Windows Phone|iPad|iPod)", "ig");
    //   var isPC = !reg.test(userAgentInfo);
    //   return isPC
    // }
    // var initFontSize = function () {
    //   var n = document.getElementsByTagName("html")[0],
    //     e = document.documentElement.clientWidth;
    //   if (IsPC()) {
    //     if (e > 750) {
    //       n.style.fontSize = "100px"
    //     } else {
    //       n.style.fontSize = e / 750 * 100 + "px"
    //     }
    //   } else {
    //     n.style.fontSize = e / 750 * 100 + "px";
    //   }
    // };
    // initFontSize();
    // window.onresize = function () {
    //   initFontSize()
    // };

    /**
     * 一些帮助函数
     */

    /**
     * setTimeout 的 promise 封装
     * @param {Number} time
     * @returns
     */
    function timeout(time) {
        return new Promise(resolve => {
            setTimeout(resolve, time)
        })
    }
}