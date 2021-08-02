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
          <view class="main_universe_item">
            <view class="icon"></view>
            <view class="title">
              <view class="font_20">第一宇宙</view>
              <view class="font_16">文明状体：2030.15.2</view>
            </view>
          </view>
          <view class="main_universe_item">
            <view class="icon"></view>
            <view class="title">
              <view class="font_20">第一宇宙</view>
              <view class="font_16">文明状体：2030.15.2</view>
            </view>
          </view>
          <view class="main_universe_item">
            <view class="icon"></view>
            <view class="title">
              <view class="font_20">第一宇宙</view>
              <view class="font_16">文明状体：2030.15.2</view>
            </view>
          </view>
        </view>
        <view class="main_footer">
          <view>
            <view class="i-button-x font_18" @tap="openReqPopup" >登 录</view>
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
      <view class="i_popup_mask" :class="i_popup_mask_opacity" v-if="isShowReqPopup == true" @click="closeReqPopup(1)">
        <view class="i_popup" @click.stop="closeReqPopup(2)">
          <view class="i_popup_title font_16">科技树</view>
          <view class="i_popup_content font_14">
            <view>没有了</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      i_popup_mask_opacity: '',
      isShowReqPopup: false
    }
  },
  onLoad () {
  },
  onUnload () {
  },
  async mounted () {
  },
  methods: {
    toGame () {
      uni.reLaunch({
        url: '/pages/index/index'
      })
    },
    openReqPopup (r) {
      console.log(r)
      this.isShowReqPopup = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.i_popup_mask_opacity = 'i_popup_mask_opacity'
        }, 0)
      })
    },
    closeReqPopup (v) {
      if (v === 2) return
      this.i_popup_mask_opacity = ''
      setTimeout(() => {
        this.isShowReqPopup = false
      }, 200)
    },
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
