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
          <view @touchstart="touchstart(1)" @touchend="touchend(1)" :style="touchstartStyle.indexOf(1) != -1 ? 'background-color: rgb(253 72 72 / 44%)':''" class="main_universe_item">
            <view class="icon"></view>
            <view class="title">
              <view class="font_20">第一宇宙</view>
              <view class="font_16">文明状体：2030.15.2</view>
            </view>
            <view v-if="1 == selectUniverseId" class="select">></view>
          </view>
          <view @touchstart="touchstart(2)" @touchend="touchend(2)" :style="touchstartStyle.indexOf(2) != -1 ? 'background-color: rgb(253 72 72 / 44%)':''" class="main_universe_item">
            <view class="icon"></view>
            <view class="title">
              <view class="font_20">第一宇宙</view>
              <view class="font_16">文明状体：2030.15.2</view>
            </view>
            <view v-if="2 == selectUniverseId" class="select">></view>
          </view>
          <view @touchstart="touchstart(3)" @touchend="touchend(3)" :style="touchstartStyle.indexOf(3) != -1 ? 'background-color: rgb(253 72 72 / 44%)':''" class="main_universe_item">
            <view class="icon"></view>
            <view class="title">
              <view class="font_20">第一宇宙</view>
              <view class="font_16">文明状体：2030.15.2</view>
            </view>
            <view v-if="3 == selectUniverseId" class="select">></view>
          </view>
        </view>
        <view class="main_footer">
          <view>
            <view class="i-button-x font_18" @tap="openLoginPopup" >登 录</view>
          </view>
          <view>
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
        <view class="i_popup" v-show="nextStep == 1" :class="i_popup_animation_right" @click.stop="closeLoginPopup(2)">
          <view class="i_popup_title font_18">登陆</view>
          <view class="i_popup_content font_14">
            <view class="i_popup_content_form">
              <view class="code font_18">+86</view>
              <input class="phone font_18" @input="onKeyInput" :value="phoneValue" type="number"  placeholder="请输入手机号" />
            </view>
            <view class="next font_18" :class="nextStyle" @tap="nextLogin" >下一步</view>
          </view>
        </view>
        <view class="i_popup" v-show="nextStep == 2" :class="i_popup_animation_left" @click.stop="closeLoginPopup(2)">
          <view class="i_popup_title font_18">输入验证码</view>
          <view class="i_popup_content font_14">
            <view class="i_popup_content_form">
              <view class="code font_18">+86</view>
              <input class="phone font_18" @input="onKeyInput" :value="phoneValue" type="number"  placeholder="请输入手机号" />
            </view>
            <view class="next font_18" :class="nextStyle" @tap="backLogin" >下一步</view>
          </view>
        </view>
      </view>
    </view>
    <view class="i_transition_mask" :class="i_transition_mask_opacity" v-show="toIndexTransition">
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      i_popup_mask_opacity: '',
      isShowLoginPopup: false,
      i_transition_mask_opacity: '',
      toIndexTransition: false,
      touchstartStyle: [],
      selectUniverseId: 1,
      nextStep: 1,
      nextStyle: 'i-no-button-x',
      phoneValue: '',
      i_popup_animation_right: '',
      i_popup_animation_left: ''
    }
  },
  onLoad () {
  },
  onUnload () {
  },
  async mounted () {
  },
  methods: {
    onKeyInput: function (event) {
      this.phoneValue = event.detail.value
      if (/^1[3-9]\d{9}$/.test(event.detail.value)) {
        this.nextStyle = 'i-button-x'
      } else {
        this.nextStyle = 'i-no-button-x'
      }
    },
    touchstart (code) {
      this.touchstartStyle.push(code)
      this.selectUniverseId = code
    },
    touchend (code) {
      this.touchstartStyle.splice(this.touchstartStyle.indexOf(code), 1)
    },
    toGame () {
      this.toIndexTransition = true
      this.i_transition_mask_opacity = 'i_transition_mask_opacity'
      setTimeout(() => {
        uni.redirectTo({
          url: '/pages/index/index',
          animationType: 'none'
        })
      }, 300)
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
      setTimeout(() => {
        this.isShowLoginPopup = false
      }, 200)
    },
    nextLogin () {
      this.i_popup_animation_right = 'i_popup_animation_right'
      setTimeout(() => {
        this.nextStep = 2
        this.i_popup_animation_left = 'i_popup_animation_left'
      }, 500)
    },
    backLogin () {
      this.i_popup_animation_left = 'i_popup_animation_left_x'
      setTimeout(() => {
        this.nextStep = 1
        console.log(11)
        this.i_popup_animation_right = 'i_popup_animation_right_x'
      }, 300)
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
