//import {get, post } from './http'
import axios from 'axios'


//let serverUrl = 'http://test.zzb.com' //PHP服务域名
let serverUrl = 'http://zzb.onezen.net' //PHP服务域名
    //let serverUrl = 'http://xyj.grapefruitcloud.com/' //PHP服务域名


/**启动上报 */
export const turnon = params => { return axios.post(`${serverUrl}/miner_earn/turnon`, params).then(res => res.data) }

/**登录注册 */
// 获取验证码
export const get_code = params => { return axios.post(`${serverUrl}/ptfs_user_server/get_code`, params).then(res => res.data) }
    // 登录/注册
export const login = params => { return axios.post(`${serverUrl}/ptfs_user_server/login`, params).then(res => res.data) }
    // 退出登录
export const logout = params => { return axios.post(`${serverUrl}/ptfs_user_server/logout`, params).then(res => res.data) }



/**用户信息 */
//修改用户附属信息
export const updateUserinfo = params => { return axios.post(`${serverUrl}/ptfs_user_server/update_user_info`, params).then(res => res.data) }
    // 获取用户信息
export const getUserinfo = params => { return axios.post(`${serverUrl}/ptfs_user_server/get_user_info`, params).then(res => res.data) }
    //修改用户手机号码
export const settelnum = params => { return axios.post(`${serverUrl}/ptfs_user_server/change_user_telnum`, params).then(res => res.data) }
    //交易密码修改
export const updatepwd = params => { return axios.post(`${serverUrl}/ptfs_user_server/set_user_charge_psd`, params).then(res => res.data) }
    //查询交易密码设置状态
export const querystatus = params => { return axios.post(`${serverUrl}/ ptfs_user_server/get_user_charge_status`, params).then(res => res.data) }



/**设备管理 */
// 扫码获取设备id
export const getDevid = params => { return axios.post(`${serverUrl}/miner_ctrl/query_device_id_by_sn`, params).then(res => res.data) }
    // 查询设备状态
export const getDevstatus = params => { return axios.post(`${serverUrl}/miner_ctrl/query_device_bind_state`, params).then(res => res.data) }
    // 解绑/绑定西柚机
export const bindingmill = params => { return axios.post(`${serverUrl}/miner_ctrl/change_device_bind_state`, params).then(res => res.data) }
    // 编辑设备信息(设置设备名)
export const setDevName = params => { return axios.post(`${serverUrl}/miner_ctrl/edit_node_basicinfo`, params).then(res => res.data) }
    // 获取西柚机详情
export const getMinerInfo = params => { return axios.post(`${serverUrl}/miner_ctrl/query_node_basicinfo`, params).then(res => res.data) }
    //查询已绑定设备列表
export const isbindinglist = params => { return axios.post(`${serverUrl}/miner_ctrl/query_bind_devinfo_list_by_user_id`, params).then(res => res.data) }
    //重启设备
export const restarts = params => { return axios.post(`${serverUrl}/miner_ctrl/ctrl_node_state`, params).then(res => res.data) }
    //绑定并设置设备名称
export const bindsetname = params => { return axios.post(`${serverUrl}/miner_ctrl/bind_dev_update_dev_name`, params).then(res => res.data) }
    /*查询历史设备名称 */
export const getdevhistoricalname = params => { return axios.post(`${serverUrl}/miner_ctrl/query_dev_name_chg_log`, params).then(res => res.data) }



/**设备收益 */
//绑定/收益/存储力排名
export const rank = params => { return axios.post(`${serverUrl}/miner_earn/query_profit_rank`, params).then(res => res.data) }
    //查询单台设备详细信息
export const devinformation = params => { return axios.post(`${serverUrl}/miner_earn/query_node_info_list`, params).then(res => res.data) }
    //获取单台设备单日收益
export const devrevenue = params => { return axios.post(`${serverUrl}/miner_earn/query_node_profit_list`, params).then(res => res.data) }
    //查询用户所有设备详细信息
export const alldevinformation = params => { return axios.post(`${serverUrl}/miner_earn/query_user_node_info_list`, params).then(res => res.data) }
    //获取用户所有设备收益
export const alldevrevenue = params => { return axios.post(`${serverUrl}/miner_earn/query_user_node_profit_list`, params).then(res => res.data) }
    //获取设备历史状态列表，
export const devstatuslist = params => { return axios.post(`${serverUrl}/miner_ctrl/query_online_histgraph`, params).then(res => res.data) }
    //查询用户历史收益
export const getuserdevlist = params => { return axios.post(`${serverUrl}/miner_earn/query_user_profit_list`, params).then(res => res.data) }


/**积分兑换 */
//积分兑换记录
export const redeems = params => { return axios.post(`${serverUrl}/oauth/orderlist`, params).then(res => res.data) }
    //兑换积分
export const redeempoints = params => { return axios.post(`${serverUrl}/oauth/pay`, params).then(res => res.data) }
    //获取授权
export const authorization = params => { return axios.post(`${serverUrl}/oauth/check`, params).then(res => res.data) }
    //授权
export const check = params => { return axios.post(`${serverUrl}/miner_earn/query_user_profit_list`, params).then(res => res.data) }
    //确认交易信息
export const confirmorder = params => { return axios.post(`${serverUrl}/oauth/order`, params).then(res => res.data) }




//消息推送
/**获取推送标签 */
export const get_tag = params => { return axios.post(`${serverUrl}/noticepush/get_tag`, params).then(res => res.data) }
    /**App用户查询历史推送记录 */
export const query_push_history_listex = params => { return axios.post(`${serverUrl}/noticepush/query_push_history_listex`, params).then(res => res.data) }
    /**APP用户删除推送消息 */
export const delete_push_list = params => { return axios.post(`${serverUrl}/noticepush/delete_push_list`, params).then(res => res.data) }


//监控
/** 用户平均算力 */
export const get_user_average_cp = params => { return axios.post(`${serverUrl}/miner_earn/get_user_average_cp`, params).then(res => res.data) }
    /**监控-设备存储 */
export const get_dev_cap_list = params => { return axios.post(`${serverUrl}/miner_earn/get_dev_cap_list`, params).then(res => res.data) }
    /** 监控-设备带宽*/
export const get_dev_bandwidth_list = params => { return axios.post(`${serverUrl}/miner_earn/get_dev_bandwidth_list`, params).then(res => res.data) }

//算力
/**算力值 */
export const get_app_dev_cp_val = params => { return axios.post(`${serverUrl}/miner_earn/get_app_dev_cp_val`, params).then(res => res.data) }
    /**算力值列表 */
export const get_app_dev_cp_list = params => { return axios.post(`${serverUrl}/miner_earn/get_app_dev_cp_list`, params).then(res => res.data) }
    /**节点动态列表 */
export const query_node_dynamic_info = params => { return axios.post(`${serverUrl}/miner_ctrl/query_node_dynamic_info`, params).then(res => res.data) }
    /**查询节点位置信息 */
export const query_node_address_info = params => { return axios.post(`${serverUrl}/miner_ctrl/query_node_address_info`, params).then(res => res.data) }

//收益
export const query_node_total_profit_info = params => { return axios.post(`${serverUrl}/miner_earn/query_node_total_profit_info`, params).then(res => res.data) }

//我的
/**签到 */
export const sign = params => { return axios.post(`${serverUrl}/account/sign`, params).then(res => res.data) }
    /**积分收支记录 */
export const query_user_node_exchange_list = params => { return axios.post(`${serverUrl}/miner_earn/query_user_node_exchange_list`, params).then(res => res.data) }

//帮助中心
export const app_query_help_cat_info = params => { return axios.post(`${serverUrl}/miner_ctrl/app_query_help_cat_info `, params).then(res => res.data) }
    //帮助中心详情
export const app_query_help_item_info = params => { return axios.post(`${serverUrl}/miner_ctrl/app_query_help_item_info`, params).then(res => res.data) }