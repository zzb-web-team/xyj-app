
//存储数据到本地
export function storage(arg) {
    let arr = [];
    arr.push(arg);
    let parameter = JSON.stringify(arr)
    try {
        window.webkit.messageHandlers.saveUserInfo.postMessage(parameter);
    } catch (e) { }
    try {
        window.android.writeDate(parameter);
    } catch (e) { }
}
//获取本地存储的数据
export function obtain() {
    try {
        window.webkit.messageHandlers.loadUserInfo.postMessage("gettoken");
    } catch (e) { }
    try {
        window.android.readDate("gettoken");
    } catch (e) { }

}
//发送版本号
export function versionnumber(arg) {
    let arr = [];
    arr.push(arg);
    let version = JSON.stringify(arr)
    try {
        window.webkit.messageHandlers.getVersion.postMessage(version);
    } catch (e) { }
    try {
        window.android.getVersion(version);
    } catch (e) { }
}
//获取网络状态
// export function getnetworkstatus() {
//     try {
//         window.webkit.messageHandlers.loadUserInfo.postMessage("networkstatus");
//     } catch (e) { }
//     try {
//         window.android.readDate("networkstatus");
//     } catch (e) { }
// }
export default {
    obtain, storage, versionnumber
}

