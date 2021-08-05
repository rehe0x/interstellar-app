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
      <view class="i_popup_mask" :class="i_popup_mask_opacity" v-if="isShowLoginPopup == true" @click="closeLoginPopup(1)">
        <!-- <view> -->
        <view class="i_popup" :class="i_popup_animation_right" @click.stop="closeLoginPopup(2)">
          <view class="i_popup_close font_16" @click="closeLoginPopup(1)">关闭</view>
          <view class="i_popup_title font_18">登陆</view>
          <view class="i_popup_content font_14">
            <view class="i_popup_content_form">
              <view class="code font_18">+86</view>
              <input class="phone font_18" maxlength="11" @input="onKeyPhoneInput" :value="phoneValue" type="number"  placeholder="请输入手机号" />
            </view>
            <view class="next font_18" :class="nextStyle" @tap="nextLogin" >下一步</view>
          </view>
        </view>
        <view class="i_popup" v-if="nextStep == 2" style="left: 150%" :class="i_popup_animation_left" @click.stop="closeLoginPopup(2)">
          <view class="i_popup_close font_16"  @click="closeLoginPopup(1)">关闭</view>
          <view class="" style="display: flex;align-items: center;">
            <view class="i_popup_title font_16" style="position: absolute;" @tap="backLogin">返回</view>
            <view class="i_popup_title font_18" style="flex: auto">输入验证码</view>
          </view>
          <view class="i_popup_title font_14" style="flex: auto">60s</view>
          <view class="i_popup_content font_14">
            <view class="i_popup_content_form">
              <input class="sms_code font_18" maxlength="1" @input="onKeySmsCodeInput(0,$event)" :focus="smsCodeFocus == 0"  :value="smsCodeValue" type="number"  placeholder="" />
              <input class="sms_code font_18" maxlength="1" @input="onKeySmsCodeInput(1,$event)" :focus="smsCodeFocus == 1"  :value="smsCodeValue" type="number"  placeholder="" />
              <input class="sms_code font_18" maxlength="1" @input="onKeySmsCodeInput(2,$event)" :focus="smsCodeFocus == 2"  :value="smsCodeValue" type="number"  placeholder="" />
              <input class="sms_code font_18" maxlength="1" @input="onKeySmsCodeInput(3,$event)" :focus="smsCodeFocus == 3"  :value="smsCodeValue" type="number"  placeholder="" />
            </view>
            <view class="i_popup_title font_14" style="margin-top: 60rpx">{{ loginMsg }}</view>
          </view>
        </view>
        <!-- </view> -->
      </view>
    </view>
    <view class="i_transition_mask" :class="i_transition_mask_opacity" v-show="toIndexTransition">
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
      i_popup_mask_opacity: '',
      isShowLoginPopup: false,
      i_transition_mask_opacity: '',
      toIndexTransition: false,
      touchstartStyle: [],
      selectUniverseId: 1,
      nextStep: 1,
      nextStyle: 'i-no-button-x',
      phoneValue: '18583158007',
      i_popup_animation_right: '',
      i_popup_animation_left: '',
      smsCode: [],
      smsCodeFocus: 0,
      smsCodeValue: null,
      loginMsg: '',
      universeMap: {}
    }
  },
  onLoad () {
  },
  onUnload () {
  },
  async mounted () {
    const rest = await getUniverse()
    this.universeMap = rest.result
  },
  methods: {
    onKeyPhoneInput: function (event) {
      this.phoneValue = event.detail.value
      if (/^1[3-9]\d{9}$/.test(event.detail.value)) {
        this.nextStyle = 'i-button-x'
      } else {
        this.nextStyle = 'i-no-button-x'
      }
    },
    onKeySmsCodeInput: async function (val, event) {
      console.log(event.detail.value)
      if (event.detail.value) {
        this.smsCode[val] = event.detail.value
        if (val === 3) {
          const rest = await verifyPhoneCode({ phoneCode: this.smsCode.join('') })
          console.log(rest)
          if (rest.code !== 200) {
            this.smsCodeValue == null ? this.smsCodeValue = '' : this.smsCodeValue = null
            this.smsCodeFocus = 0
            this.smsCode = []
            this.loginMsg = '登陆失败'
          } else {
            // 登陆成功
            this.loginMsg = '登陆成功'
            this.smsCodeFocus = val + 1
            this.loginStatus = true
            setTimeout(() => { this.closeLoginPopup(1) }, 1000)
          }
        } else {
          this.smsCodeFocus = val + 1
        }
      } else {
        this.smsCodeFocus = val > 0 ? val - 1 : 0
      }
    },
    touchstart (code) {
      this.touchstartStyle.push(code)
      this.selectUniverseId = code
    },
    touchend (code) {
      this.touchstartStyle.splice(this.touchstartStyle.indexOf(code), 1)
    },
    async toGame () {
      this.toIndexTransition = true
      this.i_transition_mask_opacity = 'i_transition_mask_opacity'
      const rest = await login({ universeId: this.selectUniverseId, phone: this.phoneValue })
      console.log(rest)
      uni.setStorageSync('token', rest.result.token)
      if (rest.code === 200) {
        setTimeout(() => {
          uni.redirectTo({
            url: `/pages/index/index?userId=${rest.result.id}&planetId=${rest.result.planetId}`,
            animationType: 'none'
          })
        }, 300)
      }
    },
    openLoginPopup (r) {
      console.log(r)
      this.isShowLoginPopup = true
      this.nextStep = 1
      this.i_popup_animation_right = ''
      this.$nextTick(() => {
        setTimeout(() => {
          this.i_popup_mask_opacity = 'i_popup_mask_opacity'
        }, 0)
      })
    },
    closeLoginPopup (v) {
      if (v === 2) return
      this.i_popup_mask_opacity = ''
      this.nextStep = 1
      setTimeout(() => {
        this.isShowLoginPopup = false
      }, 200)
    },
    async nextLogin () {
      if (/^1[3-9]\d{9}$/.test(this.phoneValue)) {
        const rest = await sendPhoneCode({ phone: this.phoneValue })
        console.log(rest)
        if (rest.code === 200) {
          this.nextStep = 2
          this.loginMsg = ''
          this.i_popup_animation_right = 'i_popup_animation_right'
          this.i_popup_animation_left = 'i_popup_animation_left'
        }
      }
    },
    backLogin () {
      this.i_popup_animation_left = 'i_popup_animation_left_x'
      this.i_popup_animation_right = 'i_popup_animation_right_x'
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
