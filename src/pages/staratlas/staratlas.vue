<template>
	<view class="wrapper">
		<view class="status_bar">
		</view>
		<view class="content" @touchmove.stop="">
       <view class="header">
        <view class="header_back font_16" @click="toIndex">返回</view>
        <view class="header_title font_16">太阳系134,53</view>
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
            <template v-for="(item, index) in 15">
              <tr :key="index">
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
		</view>
	</view>
</template>

<script>
// import inobounce from 'inobounce/inobounce'
export default {
  data () {
    return {

    }
  },
  created () {
    // const u = navigator.userAgent
    // if (u.indexOf('iPhone') > -1) {
      // inobounce.enable()
    // }
  },
  beforeDestroy () {
    // inobounce.disable()
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
