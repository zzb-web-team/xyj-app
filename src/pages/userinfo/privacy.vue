<template>
  <div class="container">
    <navBar :title="title" :right-text="title">
      <van-icon name="search" slot="right" />
    </navBar>
    <div class="user">
      <div class="user_con">
        <div class="user_con_item">
          <div>
            <h2>隐私协议</h2>
            <p>1.1 西柚APP承诺将采取必要措施保护您存放在西柚APP服务器上的个人数据及隐私信息的安全。</p>
            <p>1.2 除本协议约定的情况，西柚APP保证不对外公开或向第三方提供、公开或共享您的个人数据及隐私信息。</p>
            <p>1.3 在以下情况中，西柚APP对您个人数据及隐私信息的披露将不视为违约，具体包括：</p>
            <p>（1）西柚APP已获得您的明确授权；</p>
            <p>（2）根据有关的法律法规要求，西柚APP有披露义务的；</p>
            <p>（3）司法机关或行政机关基于法定程序要求西柚APP提供的；</p>
            <p>（4）为维护社会公共利益及西柚APP合法权益，在合理范围内进行披露的。</p>
            <p>（5）西柚APP可能会与第三方合作向用户提供相关的网络服务或使用其数据收集工具用以完善自身服务，在此情况下，如该第三方同意承担与西柚APP同等的隐私保护责任的，则西柚APP可在合理范围内对您的信息进行披露。</p>
            <p>1.4 在不披露您的个人数据及隐私的前提下，西柚APP有权对西柚APP整体用户数据信息进行技术分析，并对已进行分析、整理后的统计数据进行利用。</p>
            <p>1.5 尽管西柚APP已为用户的隐私权保护做了极大的努力，但是仍然不能保证现有的安全技术措施使您的个人数据及隐私等不受任何形式的损失。请确保您对上述情况充分知情，且不会因此追究西柚网络科技的法律责任。</p>
            <br />
            <br />
            <p class="titletext">法律声明</p>
            <p />
            <p>一、 总则</p>
            <p>1.1 本软件为西柚网络科技有限公司旗下西柚APP（以下简称“西柚APP”）的官方软件，本软件内容仅供用户个人非商业用途使用，所有浏览本软件的用户应仔细阅读本软件的各项声明、条款等，并遵守互联网法律法规。一旦使用本软件，包括但不限于浏览信息、下载内容、使用提供的第三方软件链接等，即视为用户已了解并完全同意本法律声明中的所有条款，愿意承担使用本软件的全部风险和法律责任。</p>
            <p>1.2 本法律声明的内容可能会不时更改，用户应在使用本软件时及时关注，本软件不承担另行通知义务。</p>
            <p>二、 服务条款</p>
            <p>2.1 本软件所有信息和服务均按现状提供，不带有任何明示或暗示的担保或条件，包括但不限于准确性、及时性和非侵权的默示担保或保证。</p>
            <p>2.2 本软件仅提供相关的网络内容服务，对于可能产生的网络资费由电信运营商收取。</p>
            <p>三、 软件内容的使用</p>
            <p>3.1 本软件对用户上传的音频、影像、文字、图片等文件并无严格审查义务，用户对其上传的任何文件需保证不违反国家相关法律法规政策，不侵犯第三方的任何权利，除非用户或权利人特别说明，否则用户上传资料的行为即意味着用户或用户代理的著作权人免费授权西柚APP对上载作品享有独家的、全球范围内、不可撤销的复制权、发行权、出租权、展览权、表演权、放映权、广播权、信息网络传播权、摄制权、改编权、翻译权、汇编权、使用权和收益权，而且同意西柚APP还可以将上述权利转让或者转授予给其他公司或个人。</p>
            <p>3.2 任何单位或个人认为本软件内容可能侵犯其合法权益的，均可依据以下方式向西柚网络科技发送有效权利通知。权利人应当对该权利通知负责，如权利通知不实，权利通知发送者将承担由此造成的全部法律责任（包括但不限于赔偿费及律师费）。</p>
            <p>四、 免责条款</p>
            <p>4.1 本软件对任何用户或第三方任何损失，包括但不限于数据丢失、因拷贝或下载信息和资料而造成的损失概不负责，不论其是否基于保证、合同、侵权行为、不法行为，或其它任何法律理论，也不论本软件是否已事先提示出现此类损失的可能性。</p>
            <p>4.2 本软件有权依照国家法律法规及规章制度、软件中心规则对用户在本软件上传和发布的资料和言论进行管理和监督，但并不对此承担任何责任。</p>
            <p>4.3 因政府有权机关机构根据法律、行政法规的规定要求披露用户个人资料的，本公司将根据法律规定或为公共安全目的向政府有关机关机构提供个人资料，且无须对此承担任何责任。</p>
            <p>五、 适用法律和管辖权</p>
            <p>5.1 因本声明或使用本软件所发生的争议适用中华人民共和国法律。</p>
            <p>5.2 因本声明或使用本软件所发生的争议，应当协商解决，协商不成的，各方一致同意由西柚网络科技所在地人民法院诉讼解决。</p>
            <p>六、 其他</p>
            <p>6.1 西柚APP虽已采取合理措施避免网页中出现计算机病毒，但信息网络上不存在绝对完善的安全措施，本软件无法对计算机病毒做绝对保证，因此请用户务必自行采取适当的安全防范措施。本软件对计算机病毒不承担任何责任。在法律允许的范围内，本软件保留对本声明的解释和说明的权利。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from "../../components/navBar";

export default {
  data() {
    return {
      repeats: 0, //防止重复点击
      rescount: 0, //请求计数
      title: "隐私协议",
      active: 2,
      sum_earnings: null
    };
  },
  mounted() {
    try {
      window.android.setStatusBarAndNavigationBarColor("", "#ffffff");
    } catch (e) {}
    try {
      window.webkit.messageHandlers.setStatusBarAndNavigationBarColor.postMessage(
        "#745af3,#5e73f3"
      );
    } catch (error) {}
  },
  methods: {},
  components: {
    navBar: navBar
  }
};
</script>
 
<style lang="less" scoped >
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background: #ffffff;
  .user {
    width: 6.9rem;
    background: #ffffff;
    border-radius: 0.12rem;
    height: auto;
    overflow: hidden;
    margin: auto;
    margin-top: 0.3rem;
    .user_con {
      width: 95%;
      height: auto;
      margin: 0 auto;
      padding-bottom: 0.2rem;
      .user_con_item {
        width: 100%;
        padding: 0.3rem;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        text-align: left;
        box-sizing: border-box;
        font-size: 0.28rem;
        font-weight: 400;
        color: rgb(0, 0, 0);
        line-height: 0.4rem;
        overflow: auto;
        height: 11.35rem;
        -webkit-overflow-scrolling: touch; /* liuhx:可以把这整行注释掉对比差别 */
        .titletext {
          display: inline-block;
          width: 100%;
          text-align: center;
          font-size: 0.4rem;
          margin: auto;
          line-height: 0.8rem;
        }
      }
    }
  }
  h2 {
    text-align: center;
    margin: 0.2rem 0;
  }
}
@media screen and (min-device-height: 812px) {
  .user_con_item {
    height: 13.35rem !important;
  }
}
</style>
