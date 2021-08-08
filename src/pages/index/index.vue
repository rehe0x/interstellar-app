<template>
	<view class="wrapper">
    <view class="status_bar">
    </view>
    <view class="content">
      <view class="content_left">
        <view class="content_left_up">
          <resources-compute :planetId="planetId" />
        </view>
        <view class="content_left_down">
          <scroll-view scroll-y="true" class="scroll-Y" style="height: 100%;">
            <view v-show="swichSubmenuCode==1">
              <view class="content_left_down_head">
                <view class="font_14 color_chartreuse">星际舰队</view>
                <view>{{ gameTime }}</view>
                <view class="font_14 color_chartreuse" @click="toStaratlas">星际探索</view>
              </view>
              <build-queue :planetId="planetId" />
              <view class="content_left_down_active">
                <view class="text_center font_16">显示器</view>
                <view class="divider"></view>
                <view class="content_left_down_active_list">
                  你要记得那些黑暗中默默抱紧你的人，逗你笑的人，陪你彻夜聊天的人，坐车来看望你的人，陪你哭过的人，在医院陪你的人，总是以你为重的人，带着你四处游荡的人，说想念你的人。是这些人组成你生命中一点一滴的温暖，是这些温暖使你远离阴霾，是这些温暖使你成为善良的人。
                </view>
              </view>
            </view>
            <view v-if="loadComplete">
              <view v-show="swichSubmenuCode==2">
                <build-item title="基础建筑" :buildType="BuildTypeEnum.BUILDING" :planetId="planetId" />
              </view>
              <view v-show="swichSubmenuCode==3">
                <build-item title="科技研究" :buildType="BuildTypeEnum.RESEARCH" :planetId="planetId" />
              </view>
              <view v-show="swichSubmenuCode==4">
                <build-item title="舰队" :buildType="BuildTypeEnum.FLEET" :planetId="planetId" />
              </view>
              <view v-show="swichSubmenuCode==5">
                <build-item title="防御" :buildType="BuildTypeEnum.DEFENSE" :planetId="planetId" />
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
      <view class="content_right">
        <view class="content_right_up">
          <view class="planet_icon"></view>
          <!-- <view class="setting" @tap="showDrawer">设 置</view> -->
          <view class="content_right_up_planet_info" @tap="getPlanetList" @touchstart="touchstart(3221)" @touchend="touchend(3221)" :style="touchstartStyle.indexOf(3221) != -1 ? 'background-color: rgb(253 72 72 / 44%)':''">
            <view class="planet_name">
              <view>{{ planetInfo.name }}</view>
              <view>{{ planetInfo.galaxyX }},{{ planetInfo.galaxyY }},{{ planetInfo.galaxyZ }}</view>
            </view>
            <view class="planet_select_btn"> >>> </view>
          </view>
          <view class="planet_select_list" :class="planetSelectListShow ? 'planet_select_list_show' : ''">
            <scroll-view scroll-x="true" style="writing-mode: vertical-lr;height: 100%;" class="scroll-view_H" scroll-left="0">
              <view class="planet_select_list_item">
                <template v-for="(item) in userPlanetList">
                  <view class="divider_vertical"></view>
                  <view :key="item.id" @tap="planetSelect(item.id)" @touchstart="touchstart(item.id)" @touchend="touchend(item.id)" :style="touchstartStyle.indexOf(item.id) != -1 ? 'background-color: rgb(253 72 72 / 44%)':''" class="item">
                    <view class="planet_icon"></view>
                    <view class="planet_name">
                      <view>{{ item.name }}</view>
                      <view>{{ item.galaxyX }},{{ item.galaxyY }},{{ item.galaxyZ }}</view>
                    </view>
                    <view class="planet_on" v-if="item.id == planetId">> </view>
                  </view>
                </template>
              </view>
            </scroll-view>
          </view>
        </view>
        <view class="content_right_down">
          <view class="submenu ripple" :class="[swichSubmenuAct==1 ? 'submen_activity' : '']" @click="swichMenu(1)">控制台</view>
          <view class="submenu ripple" :class="[swichSubmenuAct==2 ? 'submen_activity' : '']" @click="swichMenu(2)">建筑</view>
          <view class="submenu ripple" :class="[swichSubmenuAct==3 ? 'submen_activity' : '']" @click="swichMenu(3)">研究</view>
          <view class="submenu ripple" :class="[swichSubmenuAct==4 ? 'submen_activity' : '']" @click="swichMenu(4)">船厂</view>
          <view class="submenu ripple" :class="[swichSubmenuAct==5 ? 'submen_activity' : '']" @click="swichMenu(5)">防御</view>
        </view>
      </view>
    </view>
    <view class="i_transition_mask" :class="iTransitionMaskOpacity" v-show="indexTransitionMask">
    </view>
	</view>
</template>

<script>
import dayjs from 'dayjs'
import { wait } from '../../common/utils.js'
import { BuildTypeEnum, QueueStatusEnum } from '../../enum/base.enum.js'
import { getNowTime } from '../../api/planet'
import { getUserPlanet } from '../../api/user'

let timerCount = -1
let startTime = dayjs().valueOf()
let nowTime = 0
export default {
  data () {
    return {
      BuildTypeEnum: BuildTypeEnum,
      QueueStatusEnum: QueueStatusEnum,
      loadComplete: false,
      gameTime: '0.0.0',
      iTransitionMaskOpacity: '',
      indexTransitionMask: true,
      planetSelectListShow: false,
      touchstartStyle: [],
      swichSubmenuCode: 1,
      swichSubmenuAct: 1,
      userPlanetList: [],
      planetId: 3,
      planetInfo: {}
    }
  },
  onLoad (option) {
    this.planetId = option.planetId
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
    const planet = await getUserPlanet()
    this.userPlanetList = planet.result
    this.planetInfo = this.userPlanetList.find(item => { return item.id === +this.planetId })

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
    touchstart (code) {
      this.touchstartStyle.push(code)
    },
    touchend (code) {
      this.touchstartStyle.splice(this.touchstartStyle.indexOf(code), 1)
    },
    showDrawer () {
      uni.getSubNVueById('drawer').show('slide-in-left', 200)
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
      });
    },
    async getPlanetList () {
      this.planetSelectListShow = !this.planetSelectListShow
    },
    async planetSelect (planetId) {
      this.planetId = planetId
      this.planetInfo = this.userPlanetList.find(item => { return item.id === +this.planetId })
      this.$nextTick(() => {
        this.updateDate(['resource', 'buildQueue', BuildTypeEnum.BUILDING, BuildTypeEnum.RESEARCH, BuildTypeEnum.FLEET, BuildTypeEnum.DEFENSE])
      })
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
      }
      this.swichSubmenuCode = code
      this.swichSubmenuAct = code
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
