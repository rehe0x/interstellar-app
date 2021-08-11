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
          <table class="main_table">
            <tr>
              <th width="1%"><view>##</view></th>
              <th width="1%"><view>星球</view></th>
              <th width="15%"><view>名称</view></th>
              <th width="1%"><view>月球</view></th>
              <th width="1%"><view>废墟</view></th>
              <th width="15%"><view>玩家</view></th>
              <th width="15%"><view>联盟</view></th>
              <th width="5%"><view>操作</view></th>
              <!-- <th width="5%">###</th>
              <th width="7%">星球</th>
              <th>名称</th>
              <th width="5%">月球</th>
              <th width="5%">废墟</th>
              <th>玩家</th>
              <th>联盟</th>
              <th width="5%">操作</th> -->
            </tr>
            <template v-for="(item, index) in 15" :key="index">
              <tr>
                <template v-if="item % 3 === 0 || item % 4 === 0">
                  <td><view>{{ item }}</view></td>
                  <td><view><view class="icon"></view></view></td>
                  <td v-if="item % 4 === 0"><view>殖民地殖民地殖民地殖民地</view></td>
                  <td v-else><view>殖民地</view></td>
                  <td><view><view class="icon"></view></view></td>
                  <td><view></view></td>
                  <td><view style="color: springgreen">殖民地殖民地</view></td>
                  <td><view>殖民地殖民地</view></td>
                  <td><view>探测</view></td>
                </template>
                <template v-else>
                  <td><view>{{ item }}</view></td>
                  <td><view></view></td>
                  <td><view></view></td>
                  <td><view></view></td>
                  <td><view></view></td>
                  <td><view></view></td>
                  <td><view></view></td>
                  <td><view></view></td>
                </template>
              </tr>
            </template>
          </table>
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
  beforeUnmount () {
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
@import 'staratlas.css'
</style>
