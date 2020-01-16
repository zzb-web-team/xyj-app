<!--四位验证码输入框组件-->
<template>
  <div class="security-code-wrap">
    <label for="code">
      <ul class="security-code-container">
        <li
          class="field-wrap"
          :class="value[index]?'highlight':''"
          v-for="(item, index) in number"
          :key="index"
        >
          <i class="char-field">{{value[index]||placeholder}}</i>
        </li>
      </ul>
    </label>
    <input
      ref="input"
      class="input-code"
      @keyup="handleInput($event)"
      v-model="value"
      id="code"
      name="code"
      autofocus
      type="password"
      :maxlength="number"
      autocorrect="off"
      autocomplete="off"
      autocapitalize="off"
    />
  </div>
</template>
<script>
export default {
  name: "SecurityCode",
  // component properties
  props: {
    number: {
      type: Number,
      default: 6
    },
    placeholder: {
      type: String,
      default: "*"
    }
  },
  // variables
  data() {
    return {
      value: ""
    };
  },
  methods: {
    hideKeyboard() {
      // 输入完成隐藏键盘
      document.activeElement.blur(); // ios隐藏键盘
      this.$refs.input.blur(); // android隐藏键盘
    },
    handleSubmit() {
      this.$emit("input", this.value);
    },
    handleInput(e) {
      this.$refs.input.value = this.value;
      if (this.value.length >= this.number) {
        this.hideKeyboard();
      }
      this.handleSubmit();
    }
  }
};
</script>
<style scoped lang="less">
.security-code-wrap {
  width: 100%;
  overflow: hidden;
}
.security-code-container {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  .field-wrap {
    list-style: none;
    display: block;
    width: 0.8rem;
    height: 0.8rem;
    line-height: 0.8rem;
    font-size: 0.36rem;
    background-color: #fff;
    border: 0.02rem solid #808080;
    border-radius: 0.12rem;
    margin: 0.1rem;
    color: #000;
    .char-field {
      font-style: normal;
    }
    .char-fields {
      font-style: normal;
      animation: 1s van-cursor-flicker infinite;
    }
    &.highlight {
      border-color: #5c74f3;
    }
  }
}
.input-code {
  position: absolute;
  left: -9999px;
  top: -99999px;
  width: 100%;
  height: 2rem;
  // width: 0;
  // height: 0;
  opacity: 0;
  // overflow: visible;
  z-index: -100;
}
</style>