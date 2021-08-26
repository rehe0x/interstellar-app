<template>
	<view class="wrapper">
    <view class="status_bar">
    </view>
    <view class="content">
      <view class="header">
        <view class="header_basic">
          <resources-compute :planetId="planetId" />
          <view class="planet_info">
            <view>能量  {{ planetInfo.energyUsed | numberToCurrency}}/{{ planetInfo.energyMax | numberToCurrency}}</view>
            <view>{{ planetInfo.diameter |  numberToCurrency }}公里 ({{ planetInfo.sizeUsed }} / {{ planetInfo.sizeMax }} 空间)</view>
            <view>大约 {{ planetInfo.tempMini }}°C 到 {{ planetInfo.tempMax }}°C</view>
            <view style="display: flex">{{ planetInfo.points |  numberToCurrency }} (<view style="color: springgreen">用户排名 </view> 25 / 70236)</view>
          </view>
        </view>
        <view class="header_planet">
          <view class="planet_icon"></view>
          <view class="planet_info" @tap="getPlanetList">
            <view class="planet_name">
              <view>{{ planetInfo.name }}</view>
              <view>{{ planetInfo.galaxyX }},{{ planetInfo.galaxyY }},{{ planetInfo.galaxyZ }}</view>
            </view>
            <view class="planet_arrow">
              <view class="arrow arrow_left" :class="planetSelectShow ? 'arrow_right' : 'arrow_left'"></view>
              <view class="arrow arrow_left" :class="planetSelectShow ? 'arrow_right' : 'arrow_left'"></view>
            </view>
          </view>
          <view class="planet_select" :class="planetSelectShow ? 'planet_select_show' : ''">
            <scroll-view scroll-x="true" style="writing-mode: vertical-lr;height: 100%;" class="scroll-view_H" scroll-left="0">
              <view class="planet_list">
                <template v-for="(item, index) in userPlanetList">
                  <view :key="index" class="divider_vertical"></view>
                  <view :key="item.id" @tap="planetSelect(item.id)" class="item">
                    <view class="planet_icon"></view>
                    <view class="planet_name">
                      <view>{{ item.name }}</view>
                      <view>{{ item.galaxyX }},{{ item.galaxyY }},{{ item.galaxyZ }}</view>
                    </view>
                    <view class="arrow arrow_down" v-if="item.id == planetId"></view>
                  </view>
                </template>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>
      <view class="main">
        <view class="main_console">
          <view class="main_console_head">
            <view class="font_16 color_springgreen" @click="toStaratlas">消息中心</view>
            <view class="font_14">{{ gameTime }}</view>
            <!-- <view class="font_16 color_springgreen" @click="toStaratlas">战斗报告</view> -->
            <view class="font_16 color_springgreen" @click="toStaratlasFlex">星际探索</view>
          </view>
          <scroll-view scroll-y="true" class="scroll-Y">
            <view v-show="swichSubmenuCode==1">
              <misson-item/>
              <build-queue :planetId="planetId" />
            </view>
            <view v-if="loadComplete">
              <view v-show="swichSubmenuCode==2">
                <build-item title="基础建筑" :buildQueueMax="buildQueueMax" :buildType="BuildTypeEnum.BUILDING" :planetId="planetId" />
              </view>
              <view v-show="swichSubmenuCode==3">
                <build-item title="科技研究" :buildQueueMax="buildQueueMax" :buildType="BuildTypeEnum.RESEARCH" :planetId="planetId" />
              </view>
              <view v-show="swichSubmenuCode==4">
                <build-item title="舰队" :buildQueueMax="buildQueueMax" :buildType="BuildTypeEnum.FLEET" :planetId="planetId" />
              </view>
              <view v-show="swichSubmenuCode==5">
                <build-item title="防御" :buildQueueMax="buildQueueMax" :buildType="BuildTypeEnum.DEFENSE" :planetId="planetId" />
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="main_submenu">
          <view class="submenu ripple" :class="[swichSubmenuAct==1 ? 'submen_active' : '']" @click="swichMenu(1)">控制台</view>
          <view class="submenu ripple" :class="[swichSubmenuAct==2 ? 'submen_active' : '']" @click="swichMenu(2)">建筑</view>
          <view class="submenu ripple" :class="[swichSubmenuAct==3 ? 'submen_active' : '']" @click="swichMenu(3)">研究</view>
          <view class="submenu ripple" :class="[swichSubmenuAct==4 ? 'submen_active' : '']" @click="swichMenu(4)">船厂</view>
          <view class="submenu ripple" :class="[swichSubmenuAct==5 ? 'submen_active' : '']" @click="swichMenu(5)">防御</view>
          <view class="submenu ripple" :class="[swichSubmenuAct==7 ? 'submen_active' : '']" @click="swichMenu(7)">事务官</view>
          <view class="submenu ripple" :class="[swichSubmenuAct==7 ? 'submen_active' : '']" @click="swichMenu(7)">财团</view>
          <view class="submenu ripple" :class="[swichSubmenuAct==8 ? 'submen_active' : '']" @click="swichMenu(8)">联盟</view>
          <view class="submenu ripple" :class="[swichSubmenuAct==99 ? 'submen_active' : '']" @click="swichMenu(99)">更多</view>
        </view>
      </view>
    </view>
    <view class="i_transition_mask" :class="iTransitionMaskOpacity" v-show="indexTransitionMask"></view>
    <view class="popup_more_menu" :class="moreMenuShowOpacity" v-show="moreMenuShow">
      <view class="more_menu">
        <view class="back font_16" @click="moreMenuBackIndex" >返回</view>
        <view class="title">
          <view class="font_20">设置</view>
          <view class="divider" style="width: 80%"></view>
        </view>
        <view class="mainmenu">
          <view class="item">
            <view class="font_18">大战役</view>
            <view class="font_18">用户信息</view>
            <view class="font_18">大战役</view>
            <view class="font_18">用户信息</view>
            <view class="font_18">大战役</view>
            <view class="font_18">用户信息</view>
            <view class="font_18">大战役</view>
            <view class="font_18">用户信息</view>
            <view class="font_18">大战役1</view>
            <view class="font_18">用户信息1</view>
          </view>
        </view>
      </view>
    </view>
	</view>
</template>

<script>
import dayjs from 'dayjs'
import { wait } from '../../common/utils.js'
import { BuildTypeEnum, BuildQueueStatusEnum } from '../../enum/base.enum.js'
import { getNowTime, getUserPlanetInfo } from '../../api/main'
import { getUserPlanetList, updateUserPlanetId } from '../../api/user'
let timerCount = -1
let startTime = dayjs().valueOf()
let nowTime = 0
export default {
  data () {
    return {
      BuildTypeEnum: BuildTypeEnum,
      BuildQueueStatusEnum: BuildQueueStatusEnum,
      loadComplete: false,
      gameTime: '0.0.0',
      iTransitionMaskOpacity: '',
      indexTransitionMask: true,
      moreMenuShowOpacity: '',
      moreMenuShow: false,
      planetSelectShow: false,
      swichSubmenuCode: 1,
      swichSubmenuAct: 1,
      userPlanetList: [],
      buildQueueMax: 0,
      planetId: null,
      planetInfo: {}
    }
  },
  onLoad (option) {
    this.planetId = option.planetId
    this.buildQueueMax = option.buildQueueMax
  },
  onShow (option) {
    this.$root.$emit('missionItemUpdate')
  },
  filters: {
    numberToCurrency (value) {
      if (!value) return '0'
      // 整数部分处理，增加,
      const intPartFormat = value
        .toString()
        .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      return intPartFormat
    }
  },
  async created () {
    uni.$on('toLogin', () => {
      setTimeout(() => {
        this.toLogin()
      }, 1500)
    })
    uni.$on('onHide', () => {
      this.stopTimer()
    })
    uni.$on('onShow', () => {
      this.startTimer()
      this.updateDate(['resource', 'buildQueue', BuildTypeEnum.BUILDING, BuildTypeEnum.RESEARCH, BuildTypeEnum.FLEET, BuildTypeEnum.DEFENSE])
    })
    const planetList = await getUserPlanetList()
    this.userPlanetList = planetList.result

    const planetInfo = await getUserPlanetInfo({ planetId: this.planetId })
    this.planetInfo = planetInfo.result

    const rest = await getNowTime()
    nowTime = rest.result.nowTime
    this.timer()
  },
  async mounted () {
    this.iTransitionMaskOpacity = 'i_transition_mask_opacity'
    setTimeout(() => {
      // // 过度效果 关闭上一个页面  保留
      // const pages = getCurrentPages()
      // // #ifdef APP-PLUS
      // for (let index = 0; index < pages.length - 1; index++) {
      //   pages[index].$getAppWebview().close()
      // }
      // #endif
      this.indexTransitionMask = false
    }, 1000)
    this.$nextTick(() => {
      setTimeout(() => {
        this.loadComplete = true
      }, 1000)
    })
  },
  methods: {
    progressTime (seconds) {
      return this.$utils.remainingTime(seconds)
    },
    toLogin () {
      this.indexTransitionMask = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.iTransitionMaskOpacity = ''
        }, 0)
      })
      uni.removeStorageSync('token')
      setTimeout(() => {
        uni.redirectTo({
          url: '/pages/home/home',
          animationType: 'none'
        })
      }, 300)
    },
    toStaratlas () {
      uni.navigateTo({
        url: '/pages/staratlas/staratlas',
        animationType: 'fade-in',
        animationDuration: 500
      })
    },
    toStaratlasFlex () {
      uni.navigateTo({
        url: `/pages/staratlas_flex/staratlas_flex?planetId=${this.planetId}&galaxyX=${this.planetInfo.galaxyX}&galaxyY=${this.planetInfo.galaxyY}`,
        animationType: 'fade-in',
        animationDuration: 500
      })
    },
    async getPlanetList () {
      this.planetSelectShow = !this.planetSelectShow
    },
    async planetSelect (planetId) {
      this.planetId = planetId
      const planetInfo = await getUserPlanetInfo({ planetId: this.planetId })
      this.planetInfo = planetInfo.result
      this.$nextTick(() => {
        this.updateDate(['resource', 'buildQueue', BuildTypeEnum.BUILDING, BuildTypeEnum.RESEARCH, BuildTypeEnum.FLEET, BuildTypeEnum.DEFENSE])
      })
      updateUserPlanetId({ planetId })
    },
    async swichMenu (code) {
      if (code === 1) {
        this.updateDate(['buildQueue'])
      } else if (code === 2) {
        this.updateDate([BuildTypeEnum.BUILDING])
      } else if (code === 3) {
        this.updateDate([BuildTypeEnum.RESEARCH])
      } else if (code === 4) {
        this.updateDate([BuildTypeEnum.FLEET])
      } else if (code === 5) {
        this.updateDate([BuildTypeEnum.DEFENSE])
      } else if (code === 99) {
        this.moreMenuShowOpacity = 'more_menu_show_opacity'
        this.moreMenuShow = true
        return
      } else {
        this.toStaratlasFlex()
      }
      this.swichSubmenuCode = code
      this.swichSubmenuAct = code
    },
    moreMenuBackIndex () {
      this.moreMenuShowOpacity = ''
      this.moreMenuShow = false
    },
    async updateDate (typeArray) {
      if (typeArray.includes('resource')) {
        this.$root.$emit('resourcesUpdate')
      }
      if (typeArray.includes('buildQueue')) {
        this.$root.$emit('buildQueueUpdate')
      }

      if (typeArray.includes(BuildTypeEnum.BUILDING)) {
        this.$nextTick(() => {
          this.$root.$emit('buildingUpdate')
        })
      }
      if (typeArray.includes(BuildTypeEnum.RESEARCH)) {
        this.$nextTick(() => {
          this.$root.$emit('buildResearchUpdate')
        })
      }
      if (typeArray.includes(BuildTypeEnum.FLEET)) {
        this.$nextTick(() => {
          this.$root.$emit('buildFleetUpdate')
        })
      }
      if (typeArray.includes(BuildTypeEnum.DEFENSE)) {
        this.$nextTick(() => {
          this.$root.$emit('buildDefenseUpdate')
        })
      }
    },
    timer () {
      if (nowTime > 0) {
        timerCount++
        const time = nowTime + timerCount * 1000
        this.$root.$emit('resourcesTimer', time)
        this.$root.$emit('buildQueueTimer', time)
        this.$root.$emit('missionItemTimer', time)
        this.gameTime = dayjs(time).format('MM-DD HH:mm:ss')
        const offset = dayjs().valueOf() - (startTime + timerCount * 1000) // 代码执行所消耗的时间
        this.timers = setTimeout(this.timer, 1000 - offset)
      }
    },
    async startTimer () {
      timerCount = -1
      startTime = dayjs().valueOf()
      const rest = await getNowTime()
      nowTime = rest.result.nowTime
      this.timer()
      console.log('startTimer', nowTime)
    },
    stopTimer () {
      nowTime = 0
      console.log('stopTimer', nowTime)
    }
  },
  destroyed () {
    this.timers && clearTimeout(this.timers)
  },
  beforeDestroy () {
    this.timers && clearTimeout(this.timers)
  }
}
</script>

<style>
@import 'index.css'
</style>
