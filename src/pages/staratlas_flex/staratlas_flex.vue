<template>
	<view class="wrapper">
		<view class="status_bar">
		</view>
		<view class="content" @touchmove.stop="">
      <view class="header">
        <view class="header_back font_18" @click="toIndex">返回</view>
        <view class="galaxy_form">
          <view class="font_18">太阳系</view>
          <input class="galaxy_x font_18" maxlength="2" v-model="galaxyX"  type="number"  placeholder="" />
          <input class="galaxy_y font_18" maxlength="3" v-model="galaxyY" type="number"  placeholder="" />
          <view class="space_jump_button font_14" @click="pageJump">空间跳跃</view>
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
              <view v-show="false">{{ star = staratlas.find((value) => { return value.galaxyZ === item && value.planetType === PlanetTypeEnum.STAR }) }}</view>
              <view v-show="false">{{ moon = staratlas.find((value) => { return value.galaxyZ === item && value.planetType === PlanetTypeEnum.MOON }) }}</view>
              <view :key="index" class="row_body">
                <template v-if="star">
                  <view class="cell"><view>{{ item }}</view></view>
                  <view class="cell"><view><view class="icon"></view></view></view>
                  <view class="cell"><view>{{ star.planetName }}</view></view>
                  <view class="cell"><view><view v-if="moon" class="icon"></view></view></view>
                  <view class="cell"><view></view></view>
                  <view class="cell"><view style="color: springgreen">{{ star.username }}</view></view>
                  <view class="cell"><view>{{ star.allianceName }}</view></view>
                  <view class="cell" @click="spy(item)"><view>探测</view></view>
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
        <view class="misson_menu" :class="openedMissonMenu ? 'opened_misson_menu' : ''">
          <div class="menu">
            <div class="item"><div><span>殖民</span></div></div>
            <div class="item"><div><span>派遣</span></div></div>
            <div class="item"><div><span>运输</span></div></div>
            <div class="item"><div><span>探险</span></div></div>
            <div class="item"><div><span>探测</span></div></div>
            <div class="item"><div><span>攻击</span></div></div>
            <div class="item"><div><span>回收</span></div></div>
            <div class="item"><div><span>舰队</span></div></div>
            <div class="item"><div><span>导弹</span></div></div>
          </div>
        </view>
        <view @click="pageUp">
          <view class="arrow arrow_left1"></view>
          <view class="arrow arrow_left2"></view>
        </view>
        <view class="control font_18" @click="openMissonMenu">{{ openedMissonMenu ? '关闭' : '舰桥' }}</view>
        <view @click="pageDown">
          <view class="arrow arrow_right2"></view>
          <view class="arrow arrow_right1"></view>
        </view>
      </view>
		</view>
    <view class="misson_menu_mask" :class="missonMenuMaskOpacity" v-show="missonMenuMaskShow"></view>
	</view>
</template>

<script>
import { PlanetTypeEnum, MissionTypeEnum } from '../../enum/base.enum'
import { getStaratlas, getMissionCompute, executeMission } from '../../api/main'

export default {
  data () {
    return {
      PlanetTypeEnum,
      openedMissonMenu: false,
      missonMenuMaskShow: false,
      missonMenuMaskOpacity: '',
      planetId: 0,
      planetInfo: {},
      galaxyX: 0,
      galaxyY: 0,
      staratlas: []
    }
  },
  onLoad (option) {
    this.planetId = +option.planetId
    this.galaxyX = option.galaxyX
    this.galaxyY = option.galaxyY
  },
  async created () {
    const rest = await getStaratlas({ planetId: this.planetId, galaxyX: this.galaxyX, galaxyY: this.galaxyY })
    this.staratlas = rest.result
  },
  beforeDestroy () {
  },
  methods: {
    openMissonMenu () {
      if (!this.openedMissonMenu) {
        this.openedMissonMenu = true
        this.missonMenuMaskShow = true
        this.$nextTick(() => {
          setTimeout(() => {
            this.missonMenuMaskOpacity = 'misson_menu_mask_opacity'
          }, 0)
        })
      } else {
        this.openedMissonMenu = false
        this.missonMenuMaskOpacity = ''
        this.$nextTick(() => {
          setTimeout(() => {
            this.missonMenuMaskShow = false
          }, 500)
        })
      }
    },
    toIndex () {
      uni.navigateBack({
        delta: 1,
        animationType: 'fade-out',
        animationDuration: 500
      })
    },
    async spy (z) {
      await executeMission({
        planetId: this.planetId,
        planetType: PlanetTypeEnum.MOON,
        missionTypeCode: MissionTypeEnum.SPY.CODE,
        targetGalaxyX: this.galaxyX,
        targetGalaxyY: this.galaxyY,
        targetGalaxyZ: z,
        fleets: { fleetSpySonde: 20 },
        metal: 1,
        crystal: 1,
        deuterium: 1
      })
    },
    async pageUp () {
      this.galaxyY--
      const rest = await getStaratlas({ planetId: this.planetId, galaxyX: this.galaxyX, galaxyY: this.galaxyY })
      this.staratlas = rest.result
    },
    async pageDown () {
      this.galaxyY++
      const rest = await getStaratlas({ planetId: this.planetId, galaxyX: this.galaxyX, galaxyY: this.galaxyY })
      this.staratlas = rest.result
    },
    async pageJump () {
      const rest = await getStaratlas({ planetId: this.planetId, galaxyX: this.galaxyX, galaxyY: this.galaxyY })
      this.staratlas = rest.result
    }
  }
}
</script>

<style>
@import 'staratlas_flex.css'
</style>
