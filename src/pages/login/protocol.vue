<template>
  <div class="container">
    <van-nav-bar :title="title" left-text="返回" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
      <div class="container_introduction">
        <div class="introduction_text">
          <div class="protocol_text">
            <h2>用户协议</h2>
            <p>一、用户协议的接受</p>
            <p>1.1 本用户协议（简称“协议”）系由您与北京西柚云盘网络科技有限公司（以下简称“西柚网络科技”）所订立的相关权利义务规范，用以描述西柚网络科技通过旗下“西柚APP”软件向您提供服务及您使用“西柚APP”软件服务所涉及的详细规定。因此，请您于开始使用“西柚APP软件”前，切实详细地阅读本协议的所有内容。</p>
            <p>1.2 只要您开始使用西柚网络科技提供的“西柚APP”软件，即表示您已无条件接受了本协议的相关规定及西柚APP就此公布的各项管理规定，并愿意受其约束。如果发生纠纷，您应自行承担事实上未认真阅读本条款的责任，不得以未仔细阅读为由进行抗辩。</p>
            <p>二、服务内容</p>
            <p>2.1 “西柚APP”软件是西柚网络科技提供的一款配合西柚机硬件产品的软件，西柚网络科技通过“西柚APP”软件向广大用户提供私人数据存储与文件上传下载服务（以下简称“西柚APP服务”）。</p>
            <p>2.2 除非另有明确约定，“西柚APP”软件增强或强化目前服务功能的所有新功能，包括新的产品以及新的服务，均自动适用本协议的约定。</p>
            <p>2.3 西柚APP向您提供免费服务和收费服务。在提供收费服务前，西柚APP会向您给予明确提示，只有在您根据提示指示选择同意支付相关费用后，西柚APP才会向您提供该收费服务。如果您拒绝支付相关费用，西柚APP有权不向您提供该收费服务。</p>
            <p>2.4 您应当自行负担使用西柚APP服务所需的设备（例如个人手机、及其他与接入互联网或移动网有关的装置）及所需的费用（如为接入互联网而支付的电话费及上网费、为使用移动网而支付的手机费）。</p>
            <p>三、用户账号</p>
            <p>3.1 您在“西柚APP”软件进行注册时，须提供真实、有效的身份识别资料，并应在前述资料发生变更时，及时进行线上更新。若您所提供的资料与事实不符或所提供的资料业已变更而未更新或有任何误导之嫌而导致西柚APP无法为您提供或继续提供服务的，您应自行承担由此引发的损失。</p>
            <p>3.2 您须了解和认可西柚APP账号的使用权仅归属于原始注册人。未经西柚网络科技的事先书面同意，您不得以任何形式将自身西柚APP账号及密码转让、赠予、出借、售卖予第三方或者以其他方式许可非初始注册人对其进行使用，否则西柚网络科技有权封禁、删除该账号。如您并非当前所使用西柚APP账号的原始注册人，您应立即停止对该账号的一切使用及操作，同时西柚网络科技有权依原始注册人之请求或依自身判断将该账号重新交予原始注册人使用，由此引发的全部责任及损失与西柚网络科技无关。</p>
            <p>3.3 您有义务妥善保管在注册时获得的账号及密码，如因黑客、第三人行为或您自身保管疏忽导致账号、密码遭他人非法使用并给您造成损失的，西柚网络科技就此不承担任何责任。</p>
            <p>3.4 如您发现自身账号遭他人非法使用或有异常使用的情形，应立即通知西柚网络科技，并提供与原始注册人相一致的个人有效身份信息。西柚网络科技在核实您所提供的个人有效身份信息后，将尽可能为您维护自身合法权利提供必要协助，但西柚APP并不承诺您一定能通过该途径找回西柚APP账号。</p>
            <p>四、使用规则</p>
            <p>4.1 您应就自身使用西柚APP服务的行为负责，并保证在使用西柚APP服务的过程中遵循以下原则：</p>
            <p>（1）遵守中国有关的法律和法规；</p>
            <p>（2）遵守本条款及西柚APP发布的相关管理规定；</p>
            <p>（3）不得以任何形式侵犯第三方及西柚网络科技的合法利益；</p>
            <p>（4）不得将西柚APP提供的服务用于任何非法或侵权活动，包括但不限于将其用于展示、传播包含色情、种族主义、低级趣味、淫秽、诽谤中伤、污辱性质的资料，以及传播任何针对宗教、民族传统、人种、性别、年龄的各种仇恨、歧视和偏见的内容。</p>
            <p>4.2 西柚网络科技有权对您使用服务的情况进行审查和监督，如西柚APP根据自身独立判断认为您存在违法或违约行为的，有权要求您纠正相应行为，并采取一切必要的措施（包括但不限于更改或删除您发布或上传的内容、暂停或终止您使用西柚APP服务的权利等）以减轻您的行为造成的影响。</p>
            <p>4.3 您应保证自身对“西柚APP”软件的使用行为的合法性、正当性，且不得对客户端进行反编译、反汇编、破解等行为。</p>
            <p>4.4 请勿滥用或干扰西柚APP软件服务，包括但不限于将西柚APP软件服务用于非法目的，篡改与西柚APP软件相关的计算机代码，使用与西柚APP相关的标志或文字，攻击西柚APP的服务器，删除、隐藏或修改任何与西柚APP软件服务相关的声明等。</p>
            <p>4.5 您了解并认可，在您使用西柚APP服务公开发表内容(例如评论)时，须遵守社会公序良德和相关法律法规，且不得发布和上传如下内容：</p>
            <p>（1）违反宪法确定的基本原则的</p>
            <p>（2）违反当地法律、法规及其它规定的</p>
            <p>（3）违背社会公序良俗，有损社会公共利益的</p>
            <p>（4）侵害第三方合法权益的文件或信息，包括但不限于病毒代码、黑客程序、软件破解注册信息等</p>
            <p>（5）未获合法授权的文章、图片、音乐、视频、应用等</p>
            <p>（6）广告内容或链接</p>
            <p>（7）违反西柚APP信息发布政策或损害西柚APP合法权益的</p>
            <p>（8）不得上传任何具有色情内容的评论内容，不得上传内容低俗，格调不高的评论内容。不得上传具有色情诱导性评论内容。不得在发表的评论中中出现任何具有低俗色情含义的字眼。</p>
            <p>4.6 西柚网络科技有权对您发布和上传的内容进行审核，如西柚APP根据自身独立判断认为您所发布、上传的内容包含前述情况的，有权直接删除相关内容，且无需另行通知您。西柚APP的审核行为并非义务行为，不能因西柚APP审核不全面而免除您有可能发生的非法传播责任。</p>
            <p>4.7 由于您发布上传的内容带来的法律纠纷或其它后果，需要由您自行承担。</p>
            <p>4.8 您在使用西柚APP过程中创作内容所包含的权利将依法归您自行所有。但您应了解，对于您通过西柚APP服务发布、上传至可公开获取区域的任何内容，均视为您已同意授权西柚APP获得相应内容在全世界范围内免费的、永久性的、不可撤销的、非独家的和完全再许可的权利和许可，可以使用、复制、修改、改编、出版、翻译、据以创作衍生作品、传播、表演和展示此等内容（整体或部分），也可将此等内容编入当前已知的或以后开发的其他任何形式的作品、媒体或技术中。</p>
            <p>4.9 如果西柚APP工作人员判断认为您对西柚APP的使用超出了合理范围，我们有权对您就西柚APP服务的使用进行限制，您应自行承担由此引发的责任及损失。</p>
          </div>
        </div>
        <!-- <form action method="post">
        <label>
          <input class="remmber" type="checkbox" name="remmber" v-model="devnameok">
          我已阅读并同意该协议
        </label>
      </form>
      <div>
        <van-button class="introduction_start" :disabled="!devnameok" @click="goLink()">已阅读并同意</van-button>
        </div>-->
      </div>
  
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import navBar from "../../components/navBar";
import { NavBar } from "vant";

export default {
  data() {
   return{
      title: "用户协议",
      devnameok: true //提交按钮是否可点击 false是可点击,true不可点击
    };
  },
  methods: {
    ...mapMutations(["updateUser", "clearUser"]),
    onClickLeft() {
      this.$router.push({ path: "/login" });
    },
    goLink() {
      this.$router.push({ path: "/username" });
    }
  },
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
  background: #F8F8F8;
  .container_introduction {
    width: 100%;
    height: auto;
    margin: 0 auto;
    overflow: hidden;
    background: #F8F8F8;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 1.2rem;
    .introduction_text {
      font-size: 0.4rem;
      color: #cccccc;
      margin: 0 auto;
      background: #ffffff;
      padding: 0.3rem 0.2rem;
      box-sizing: border-box;
      width: 6.9rem;
      border-radius: 0.12rem;
      overflow: hidden;
      .protocol_text {
        overflow: auto;
        height: 11.35rem;
        -webkit-overflow-scrolling: touch; /* liuhx:可以把这整行注释掉对比差别 */
        h2 {
          font-size: 0.35rem;
          color: #000;
          margin-bottom: 0.3rem;
        }
        p {
          font-size: 0.28rem;
          color: #000;
          width: 100%;
          text-align: left;
          text-indent: 0.3rem;
          margin-top: 0.05rem;
        }
      }
    }
    .introduction_start {
      font-size: 0.38rem;
      color: #ffffff;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 5.9rem;
      height: 0.88rem;
      background: #43bff9;
      border-radius: 0.12rem;
      margin-bottom: 1.84rem;
      // margin-top: 0.8rem;
      border: none;
    }
    form {
      margin-top: 0.2rem;
      margin-bottom: 0.2rem;
      label {
        font-size: 0.3rem;
        display: flex;
        justify-content: center;
        input {
          display: inline-block;
          border-radius: 0.05rem;
          width: 0.38rem;
          height: 0.38rem;
          border: 0.02rem solid #0d1529;
          color: #0d1529;
          position: relative;
          top: 0.05rem;
          left: 0;
          margin-top: 0;
        }
      }
    }
  }
}
@media screen and (min-device-height: 812px) {
  .protocol_text {
    height: 13rem !important;
  }
}
</style>
