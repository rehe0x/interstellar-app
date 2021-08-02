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
        <view class="main_footer i-button-x">登陆</view>
      </view>
      <view class="footer">底部</view>
      <!-- <input class="uni-input" focus placeholder="自动获得焦点" /> -->
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  onLoad () {
  },
  onUnload () {
  },
  async mounted () {
  },
  methods: {
    navigateTo () {
      uni.navigateTo({
        url: '/pages/index/new-nvue-page-1'
      })
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
