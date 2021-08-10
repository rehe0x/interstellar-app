<template>
	<view class="wrapper">
		<view class="status_bar">
		</view>
		<view class="content" @touchmove.stop="">
      <view class="header">
        <view class="header_back font_18" @click="toIndex">返回</view>
        <view class="galaxy_form">
          <view class="font_18">太阳系</view>
          <input class="galaxy_x font_18" maxlength="1" value="1"  type="number"  placeholder="" />
          <input class="galaxy_y font_18" maxlength="3" value="333" type="number"  placeholder="" />
          <view class="x_button font_14">空间跳跃</view>
        </view>
      </view>
			<view class="main">
				<scroll-view scroll-x="true" style="height: 100%" class="scroll-view_H">
          <view class="main_table">
            <view class="row_head">
              <view class="cell" style="width: 1%"><view>##</view></view>
              <view class="cell" style="width: 1%"><view>星球</view></view>
              <view class="cell" style="width: 15%"><view>名称</view></view>
              <view class="cell" style="width: 1%"><view>月球</view></view>
              <view class="cell" style="width: 1%"><view>废墟</view></view>
              <view class="cell" style="width: 15%"><view>玩家</view></view>
              <view class="cell" style="width: 15%"><view>联盟</view></view>
              <view class="cell" style="width: 5%"><view>操作</view></view>
            </view>
            <template v-for="(item, index) in 15">
              <view :key="index" class="row_body">
                <template v-if="item % 3 === 0 || item % 4 === 0">
                  <view class="cell"><view>{{ item }}</view></view>
                  <view class="cell"><view><view class="icon"></view></view></view>
                  <view v-if="item % 4 === 0" class="cell"><view>殖民地殖民地殖民地殖民地</view></view>
                  <view v-else class="cell"><view>殖民地</view></view>
                  <view class="cell"><view><view class="icon"></view></view></view>
                  <view class="cell"><view></view></view>
                  <view class="cell"><view style="color: springgreen">殖民地殖民地</view></view>
                  <view class="cell"><view>殖民地殖民地</view></view>
                  <view class="cell"><view>探测</view></view>
                </template>
                <template v-else>
                  <view class="cell"><view>{{ item }}</view></view>
                  <view class="cell"><view></view></view>
                  <view class="cell"><view></view></view>
                  <view class="cell"><view></view></view>
                  <view class="cell"><view></view></view>
                  <view class="cell"><view></view></view>
                  <view class="cell"><view></view></view>
                  <view class="cell"><view></view></view>
                </template>
              </view>
            </template>
          </view>
				</scroll-view>
			</view>
      <view class="footer">
        <view>
          <view class="arrow arrow_left1"></view>
          <view class="arrow arrow_left2"></view>
        </view>
        <view class="control font_18">控制</view>
        <view>
          <view class="arrow arrow_right2"></view>
          <view class="arrow arrow_right1"></view>
        </view>
      </view>
		</view>
	</view>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  created () {
  },
  beforeDestroy () {
  },
  methods: {
    toIndex () {
      console.log('back')
      uni.navigateBack({
        delta: 1,
        animationType: 'fade-out',
        animationDuration: 500
      })
    }
  }
}
</script>

<style>
@import 'staratlas_flex.css'
</style>
