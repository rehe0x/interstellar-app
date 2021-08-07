<template>
	<view class="wrapper">
    <view class="status_bar">
    </view>
    <view class="content">
      <view class="header">
        <view class="header_userinfo font_16">热河ing</view>
        <view class="header_title font_20">欢迎.起航</view>
      </view>
      <view class="main">
        <view class="main_universe">
          <template v-for="(item, key) in universeMap">
            <view :key="key" @touchstart="touchstart(key)" @touchend="touchend(key)" :style="touchstartStyle.indexOf(key) != -1 ? 'background-color: rgb(253 72 72 / 44%)':''" class="main_universe_item">
              <view class="icon"></view>
              <view class="title">
                <view class="font_20">{{ item.name }}</view>
                <view class="font_16">{{ item.description }}</view>
              </view>
              <view v-if="key == selectUniverseId" class="select">></view>
            </view>
          </template>
        </view>
        <view class="main_footer">
          <view v-if="!loginStatus">
            <view class="i-button-x font_18" @tap="openLoginPopup" >登 录</view>
          </view>
          <view v-if="loginStatus">
            <view class="i-button-x font_18" @tap="toGame" >进入</view>
          </view>
        </view>
      </view>
      <view class="footer">
        <view>版权所2018</view>
      </view>
    </view>
    <view class="">
      <view class="i_popup_mask" :class="iPopupMaskOpacity" v-if="isShowLoginPopup == true" @click="closeLoginPopup(1)">
        <!-- <view> -->
        <view class="i_popup" :class="[loginAnimationStepone,iPopupContentOpacity]" @click.stop="closeLoginPopup(2)">
          <view class="i_popup_close font_16" @click="closeLoginPopup(1)">关闭</view>
          <view class="i_popup_title font_18">登陆</view>
          <view class="i_popup_content font_14">
            <view class="i_popup_content_form">
              <view class="code font_18">+86</view>
              <input class="phone font_18" maxlength="11" @input="onKeyPhoneInput" :value="phoneValue" type="number"  placeholder="请输入手机号" />
            </view>
            <view class="next font_18" :class="loginStepNextButtonStyle" @tap="nextLogin" >下一步</view>
          </view>
        </view>
        <view class="i_popup" v-if="loginStep == 2" style="left: 150%" :class="[loginAnimationSteptwo,iPopupContentOpacity]" @click.stop="closeLoginPopup(2)">
          <view class="i_popup_close font_16"  @click="closeLoginPopup(1)">关闭</view>
          <view class="" style="display: flex;align-items: center;">
            <view class="i_popup_title font_16" style="position: absolute;" @tap="backLogin">返回</view>
            <view class="i_popup_title font_18" style="flex: auto">输入验证码</view>
          </view>
          <view class="i_popup_title font_14" style="flex: auto">60s</view>
          <view class="i_popup_content font_14">
            <view class="i_popup_content_form">
              <input class="sms_code font_18" maxlength="1" @input="onKeySmsCodeInput(0,$event)" :focus="smsCodeInputFocus == 0"  :value="smsCodeNullValue" type="number"  placeholder="" />
              <input class="sms_code font_18" maxlength="1" @input="onKeySmsCodeInput(1,$event)" :focus="smsCodeInputFocus == 1"  :value="smsCodeNullValue" type="number"  placeholder="" />
              <input class="sms_code font_18" maxlength="1" @input="onKeySmsCodeInput(2,$event)" :focus="smsCodeInputFocus == 2"  :value="smsCodeNullValue" type="number"  placeholder="" />
              <input class="sms_code font_18" maxlength="1" @input="onKeySmsCodeInput(3,$event)" :focus="smsCodeInputFocus == 3"  :value="smsCodeNullValue" type="number"  placeholder="" />
            </view>
            <view class="i_popup_title font_14" style="margin-top: 60rpx">{{ loginStatusMsg }}</view>
          </view>
        </view>
        <!-- </view> -->
      </view>
    </view>
    <view class="i_transition_mask" :class="iTransitionMaskOpacity" v-show="homeTransitionMask">
    </view>
  </view>
</template>

<script>
import { getUniverse } from '../../api/home'
import { sendPhoneCode, verifyPhoneCode, login } from '../../api/user'

export default {
  data () {
    return {
      loginStatus: false,
      iPopupMaskOpacity: '',
      iPopupContentOpacity: '',
      isShowLoginPopup: false,
      iTransitionMaskOpacity: '',
      homeTransitionMask: true,
      touchstartStyle: [],
      loginStep: 1,
      loginStepNextButtonStyle: 'i-no-button-x',
      loginAnimationStepone: '',
      loginAnimationSteptwo: '',
      smsCodeInput: [],
      smsCodeInputFocus: 0,
      smsCodeNullValue: null,
      loginStatusMsg: '',
      universeMap: {},
      selectUniverseId: 1,
      phoneValue: 18583158007
    }
  },
  onLoad () {
  },
  onUnload () {
  },
  async created () {
    const rest = await getUniverse()
    this.universeMap = rest.result
  },
  async mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.iTransitionMaskOpacity = 'i_transition_mask_opacity'
      }, 0)
    })
    setTimeout(() => {
      this.homeTransitionMask = false
    }, 800)
  },
  methods: {
    onKeyPhoneInput: function (event) {
      this.phoneValue = event.detail.value
      if (/^1[3-9]\d{9}$/.test(event.detail.value)) {
        this.loginStepNextButtonStyle = 'i-button-x'
      } else {
        this.loginStepNextButtonStyle = 'i-no-button-x'
      }
    },
    onKeySmsCodeInput: async function (val, event) {
      console.log(event.detail.value)
      if (event.detail.value) {
        this.smsCodeInput[val] = event.detail.value
        if (val === 3) {
          const rest = await verifyPhoneCode({ phoneCode: this.smsCodeInput.join('') })
          console.log(rest)
          if (rest.code !== 200) {
            this.loginStatusMsg = '登陆失败'
            this.smsCodeNullValue == null ? this.smsCodeNullValue = '' : this.smsCodeNullValue = null
            this.smsCodeInputFocus = 0
            this.smsCodeInput = []
          } else {
            // 登陆成功
            this.loginStatusMsg = '登陆成功'
            this.smsCodeInputFocus = val + 1
            this.loginStatus = true
            setTimeout(() => { this.closeLoginPopup(1) }, 1000)
          }
        } else {
          this.smsCodeInputFocus = val + 1
        }
      } else {
        this.smsCodeInputFocus = val > 0 ? val - 1 : 0
      }
    },
    async toGame () {
      this.homeTransitionMask = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.iTransitionMaskOpacity = ''
        }, 0)
      })
      const rest = await login({ universeId: this.selectUniverseId, phone: this.phoneValue, code: +this.smsCodeInput.join('') })

      setTimeout(() => {
        if (!rest) {
          this.homeTransitionMask = false
          this.iTransitionMaskOpacity = 'i_transition_mask_opacity'
        }
      }, 1000)
      if (rest && rest.code === 200) {
        uni.setStorageSync('token', rest.result.token)
        setTimeout(() => {
          uni.redirectTo({
            url: `/pages/index/index?userId=${rest.result.id}&planetId=${rest.result.planetId}`,
            animationType: 'none'
          })
        }, 300)
      }
    },
    touchstart (code) {
      this.touchstartStyle.push(code)
      this.selectUniverseId = code
    },
    touchend (code) {
      this.touchstartStyle.splice(this.touchstartStyle.indexOf(code), 1)
    },
    openLoginPopup (r) {
      this.isShowLoginPopup = true
      this.loginStep = 1
      this.loginAnimationStepone = ''
      this.$nextTick(() => {
        setTimeout(() => {
          this.iPopupContentOpacity = 'i_popup_content_opacity'
          this.iPopupMaskOpacity = 'i_popup_mask_opacity'
        }, 0)
      })
    },
    closeLoginPopup (v) {
      if (v === 2) return
      this.iPopupContentOpacity = ''
      this.iPopupMaskOpacity = ''
      this.loginStep = 1
      setTimeout(() => {
        this.isShowLoginPopup = false
      }, 300)
    },
    async nextLogin () {
      if (/^1[3-9]\d{9}$/.test(this.phoneValue)) {
        const rest = await sendPhoneCode({ phone: this.phoneValue })
        console.log(rest)
        if (rest.code === 200) {
          this.loginStep = 2
          this.loginStatusMsg = ''
          this.loginAnimationStepone = 'login_animation_stepone_next'
          this.loginAnimationSteptwo = 'login_animation_steptwo_next'
        }
      }
    },
    backLogin () {
      this.loginAnimationSteptwo = 'login_animation_steptwo_back'
      this.loginAnimationStepone = 'login_animation_stepone_back'
    }
  },
  destroyed () {
  },
  beforeDestroy () {
  }
}
</script>

<style>
@import 'home.css'
</style>
