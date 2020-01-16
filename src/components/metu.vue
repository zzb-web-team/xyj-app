<template>
  <div class="page-container">
    <div class="main-contant">
      <div class="pd-container con-message text-center">
        <p class="ff-seravek-light">
          Enter the One-Time Password sent to your mobile number:
          <span
            class="ff-seravek"
          >1502****760</span>
        </p>
      </div>
      <div class="pd-container">
        <form role="form" action="/auth/login/otp" method="post">
          <div class="checked-codes">
            <p>One-Time Password</p>
            <div class="flex code-container" onclick="focusHandler()">
              <input disabled="disabled" class="tb-code" type="number" id="tb0" />
              <input disabled="disabled" class="tb-code" type="number" id="tb1" />
              <input disabled="disabled" class="tb-code" type="number" id="tb2" />
              <input disabled="disabled" class="tb-code" type="number" id="tb3" />
              <input disabled="disabled" class="tb-code" type="number" id="tb4" />
              <input disabled="disabled" class="tb-code" type="number" id="tb5" />
            </div>
          </div>
          <input
            id="hdcode"
            type="number"
            name="otp"
            style="opacity: 0;"
            onkeydown="inputNumOnly(this)"
            onkeyup="keyupHandler(this)"
          />
          <div class="pd-container text-center">
            <button id="btn-submit-form" type="submit" style="display: none">Next</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "metu",
  data() {
    return {};
  },

  methods: {
    inputNumOnly(e) {
      if (
        !(event.keyCode == 46) &&
        !(event.keyCode == 8) &&
        !(event.keyCode == 37) &&
        !(event.keyCode == 39)
      ) {
        if (
          !(
            (event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105)
          )
        ) {
          event.returnValue = false;
        }
        if (e.value && e.value.length >= 6) {
          event.returnValue = false;
        }
      }
    },
    keyupHandler(e) {
      e.value = e.value.substr(0, 6);
      code = e.value;
      for (var i = 0; i < 6; i++) {
        if (i < code.length) {
          document.getElementById("tb" + i).value = code[i];
        } else {
          document.getElementById("tb" + i).value = "";
        }
      }
      if (code.length === 6) {
        document.getElementById("btn-submit-form").style.display = "block";
      }
    },
    focusHandler(e) {
      document.getElementById("hdcode").focus();
    }
  }
};
</script>
    <style type="text/css" scoped>
/* page-container */
.page-container {
  position: absolute;
  bottom: 0;
  top: 0;
  left: 50%;
  margin-left: -150px;
  font-family: "Seravek Light";
  font-size: 16px;
  font-weight: normal;
  line-height: 1.4;
  color: #eee;
  overflow: auto;
  border-radius: 3px;
  padding: 50px 0;
  height: auto;
  width: 100%;
  max-width: 300px;
  overflow-y: hidden;
  background: linear-gradient(#00815a, #008120);
  box-shadow: 0 2px 0 rgba(175, 175, 175, 0.12);
}

.pd-container {
  padding: 10px 30px;
}

.bg-green-lighter {
  background: linear-gradient(#339a7b, #339a3d);
}

@media only screen and (max-width: 600px) {
  .page-container {
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    margin: 0;
    padding: 20px 0;
    border: none;
    box-shadow: none;
    width: 100%;
    max-width: 100%;
  }
}

@media only screen and (min-height: 736px) {
  .page-container {
    padding: 120px 0;
  }
}

/* checked-codes */
.checked-codes {
  max-width: 300px;
  margin: 0 auto;
}

.checked-codes .flex {
  justify-content: space-between;
}

.checked-codes a {
  float: right;
  font-size: 13px;
  color: #000000;
  text-decoration: underline;
  line-height: 13px;
}

.checked-codes input {
  box-sizing: border-box;
  height: 40px;
  max-width: 40px;
  border: solid 1px #eee;
  border-radius: 4px;
  margin: 0 2px;
  flex: 1;
  font-size: 18px;
  text-align: center;
  background-color: transparent;
  color: #eee;
}

.con-message {
  padding-top: 100px;
  padding-bottom: 50px;
}

button {
  padding: 6px 0;
  margin: 10px 0;
}

.code-tip {
  font-size: 14px;
}

.code-container:active {
  -moz-box-shadow: 0px 7px 20px #333333;
  -webkit-box-shadow: 0px 7px 20px #333333;
  box-shadow: 0px 7px 20px #333333;
}

.flex {
  display: flex;
}
</style>