<template>
	<view class="wrapper">
    <view class="status_bar">
    </view>
    <view class="content">
      <view class="content_left">
        <view class="content_left_up">
          <!-- <view class="font_14"><< 殖民地士大夫 1:333:5 >></view> -->
          <resources-compute />
        </view>
        <view class="content_left_down">
          <scroll-view scroll-y="true" class="scroll-Y" style="height: 100%;">
            <view v-show="swichSubmenuCode==1">
              <view class="content_left_down_head">
                <view class="font_14 color_chartreuse">星际舰队</view>
                <view>{{ t }}</view>
                <view class="font_14 color_chartreuse">星际探索 ></view>
              </view>
              <build-queue />
              <view class="content_left_down_active">
                <view class="text_center font_16">显示器</view>
                <view class="divider"></view>
                <view class="content_left_down_active_list">
                  你要记得那些黑暗中默默抱紧你的人，逗你笑的人，陪你彻夜聊天的人，坐车来看望你的人，陪你哭过的人，在医院陪你的人，总是以你为重的人，带着你四处游荡的人，说想念你的人。是这些人组成你生命中一点一滴的温暖，是这些温暖使你远离阴霾，是这些温暖使你成为善良的人。
                </view>
              </view>
            </view>
            <view v-show="swichSubmenuCode == 2">
              <view class="text_center font_16">基础建造</view>
              <view class="divider"></view>
              <template v-for="(item, buildCode) in buildings">
                <view @touchstart="touchstart(buildCode)" @touchend="touchend(buildCode)" :style="touchstartStyle.indexOf(buildCode) != -1 ? 'background-color: rgb(253 72 72 / 44%)':''" class="content_left_down_build_list" :key="buildCode">
                  <view class="item_up">
                    <image @tap="openDetailPopup(item)" src="../../static/image/24.gif"/>
                    <view class="info">
                      <view class="font_14">{{ item.name }} {{ item.level }}</view>
                      <view class="font_12">{{ item.buildTimeShow }}</view>
                    </view>
                    <template v-if="item.requeriment.isReq">
                      <template v-if="buildingBuildQueue.length === 0">
                        <view class="i-button" @tap="addBuildingQueue({buildCode})">升级</view>
                      </template>
                      <template v-else-if="buildingBuildQueue.length < 5">
                        <view class="i-button" @tap="addBuildingQueue({buildCode})">加入</view>
                      </template>
                      <template v-else>
                        <view class="i-no-button">升级</view>
                      </template>
                    </template>
                    <template v-else>
                      <view class="i-button" @tap="openReqPopup(item.requeriment)">查看</view>
                    </template>
                  </view>
                  <view class="item_down">
                    <view><text>金属：</text>{{ item.metal | numberToCurrency }} <text>晶体：</text>{{ item.crystal | numberToCurrency }} <text>重氦：</text>{{ item.deuterium | numberToCurrency }}</view>
                  </view>
                </view>
                <view class="divider" :key="item.id"></view>
              </template>
            </view>
            <view v-show="swichSubmenuCode==3">
              <view class="text_center font_16">科技研究</view>
              <view class="divider"></view>
              <template v-for="(item, buildCode) in researchs" >
                <view @touchstart="touchstart(buildCode)" @touchend="touchend(buildCode)" :style="touchstartStyle.indexOf(buildCode) != -1 ? 'background-color: rgb(253 72 72 / 44%)':''" class="content_left_down_build_list" :key="buildCode">
                  <view class="item_up">
                    <image @tap="openDetailPopup(item)" src="../../static/image/24.gif"/>
                    <view class="info">
                      <view class="font_14">{{ item.name }} {{ item.level }}</view>
                      <view class="font_12">{{ item.buildTimeShow }}</view>
                    </view>
                    <template v-if="item.requeriment.isReq">
                      <template v-if="researchBuildQueue.length > 0">
                        <view class="i-no-button">升级</view>
                      </template>
                      <template v-else>
                        <view class="i-button" @tap="addResearchQueue({buildCode})">升级</view>
                      </template>
                    </template>
                    <template v-else>
                      <view class="i-button" @tap="openReqPopup(item.requeriment)">查看</view>
                    </template>
                  </view>
                  <view class="item_down">
                    <view><text>金属：</text>{{ item.metal | numberToCurrency }} <text>晶体：</text>{{ item.crystal | numberToCurrency }} <text>重氦：</text>{{ item.deuterium | numberToCurrency }}</view>
                  </view>
                </view>
                <view class="divider" :key="item.id"></view>
              </template>
            </view>
            <view v-show="swichSubmenuCode==4">
              船厂
            </view>
            <view v-show="swichSubmenuCode==5">
              防御
            </view>
          </scroll-view>
        </view>
      </view>
      <view class="content_right">
        <view class="content_right_up">
          <view class="planet_icon"></view>
          <!-- <view class="setting" @tap="showDrawer">设 置</view> -->
          <!-- <view @tap="navigateTo">原生</view>
          <view @tap="openReqPopup">弹出</view> -->
          <view class="content_right_up_planet_info" @tap="planetList" @touchstart="touchstart(3221)" @touchend="touchend(3221)" :style="touchstartStyle.indexOf(3221) != -1 ? 'background-color: rgb(253 72 72 / 44%)':''">
            <view class="planet_name">
              <view>殖民地殖民地殖民地发撒地方</view>
              <view>123,453,112</view>
            </view>
            <view class="planet_select_btn"><<<</view>
          </view>
          <view class="planet_select_list" :class="planet_select_list_show ? 'planet_select_list_show' : ''">
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
                    <view class="planet_on" v-if="item.id == userSelectPlanetId"><</view>
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
    <view class="">
      <!-- <transition name="i_popup_mask"> -->
        <view class="i_popup_mask" :class="i_popup_mask_opacity" v-if="isShowReqPopup == true" @click="closeReqPopup(1)">
          <view class="i_popup" @click.stop="closeReqPopup(2)">
            <view class="i_popup_title font_16">科技树</view>
            <view v-if="Object.keys(requeriments).length > 0" class="i_popup_content font_14">
              <view v-for="(item, index) in requeriments.requeriments" :key="index">
                {{ item.name }}   {{ item.level }} 级 当前 {{ item.mylevel }} 级
              </view>
            </view>
          </view>
        </view>
        <view class="i_popup_mask" :class="i_popup_mask_opacity" v-if="isShowDetailPopup == true" @click="closeDetailPopup(1)">
          <view v-if="Object.keys(detail).length > 0" class="i_popup" @click.stop="closeDetailPopup(2)">
            <view class="i_popup_title font_16">{{detail.name}}</view>
            <view class="i_popup_content font_14">
              <scroll-view scroll-y="true" class="scroll-Y" style="max-height: 800rpx">
                <view>{{ detail.description }}</view>
                <view v-if="detail.requeriment.requeriments.length > 0" class="i_popup_title font_16">科技树</view>
                <view class="text_center" v-for="(item, index) in detail.requeriment.requeriments" :key="index">
                  {{ item.name }}   {{ item.level }} 级 当前 {{ item.mylevel }} 级
                </view>
              </scroll-view>
            </view>
          </view>
        </view>
       <!-- </transition> -->
    </view>
	</view>
</template>

<script>
import dayjs from 'dayjs'
import { BuildTypeEnum, QueueStatusEnum } from '../../enum/base.enum.js'
import { getNowTime, getPlanetBuildQueueByType, getBuilding, getResearch, addBuildingQueue, addResearchQueue } from '../../api/planet'
import { getUserPlanet } from '../../api/user'

let timerCount = 0
const startTime = dayjs().valueOf()
let nowTime = 0
export default {
  data () {
    return {
      i_popup_mask_opacity: '',
      planet_select_list_show: false,
      touchstartStyle: [],
      isShowReqPopup: false,
      isShowDetailPopup: false,
      requeriments: {},
      detail: {},
      BuildTypeEnum: BuildTypeEnum,
      QueueStatusEnum: QueueStatusEnum,
      swichSubmenuCode: 1,
      swichSubmenuAct: 1,
      drawerShow: false,
      buildings: [],
      researchs: [],
      buildingBuildQueue: [],
      researchBuildQueue: [],
      userPlanetList: [],
      userSelectPlanetId: 3,
      t: '0.0.0'
    }
  },
  onLoad () {
    // 监听 drawer 消息
    uni.$on('drawer-page', (data) => {
      uni.showToast({
        title: '点击了第' + data + '项',
        icon: 'none'
      })
    })
  },
  onUnload () {
    uni.$off('drawer-page')
  },
  filters: {
    numberToCurrency (value) {
      if (!value) return '0'
      // 整数部分处理，增加,
      const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      return intPartFormat
    }
  },
  async mounted () {
    const rest = await getNowTime()
    nowTime = rest.result.nowTime
    this.timer()
  },
  methods: {
    touchstart (code) {
      this.touchstartStyle.push(code)
    },
    touchend (code) {
      this.touchstartStyle.splice(this.touchstartStyle.indexOf(code), 1)
    },
    openReqPopup (r) {
      console.log(r)
      this.requeriments = r
      this.isShowReqPopup = true
      this.$nextTick(() => {
        setTimeout(()=>{
          this.i_popup_mask_opacity = 'i_popup_mask_opacity'
        },0)
      })
    },
    closeReqPopup (v) {
      if (v === 2) return
      this.i_popup_mask_opacity = ''
      setTimeout(() => {
        this.isShowReqPopup = false
      }, 200)
    },
    openDetailPopup (r) {
      console.log(r)
      this.detail = r
      this.isShowDetailPopup = true
      this.$nextTick(() => {
        setTimeout(()=>{
          this.i_popup_mask_opacity = 'i_popup_mask_opacity'
        },0)
      })
    },
    closeDetailPopup (v) {
      if (v === 2) return
      this.i_popup_mask_opacity = ''
      setTimeout(() => {
        this.isShowDetailPopup = false
      }, 300)
    },
    showDrawer () {
      uni.getSubNVueById('drawer').show('slide-in-left', 200)
    },
    navigateTo () {
      uni.navigateTo({
        url: '/pages/index/new-nvue-page-1'
      })
    },
    async planetList () {
      const rest = await getUserPlanet()
      this.userPlanetList = rest.result
      this.planet_select_list_show = !this.planet_select_list_show
    },
    async planetSelect (planetId) {
      this.userSelectPlanetId = planetId
    },
    async swichMenu (code) {
      if (code === 1) {
        this.updateDate(['buildQueue'])
      } else if (code === 2) {
        this.updateDate(['building', 'buildingBuildQueue'])
      } else if (code === 3) {
        this.updateDate(['research', 'researchBuildQueue'])
      } else if (code === 4) {
      } else if (code === 5) {
      } else if (code === 6) {
      }
      this.swichSubmenuAct = code
      this.swichSubmenuCode = code
    },
    async addBuildingQueue (row) {
      const rest = await addBuildingQueue({
        buildCode: row.buildCode
      })
      this.updateDate(['resource', 'buildingBuildQueue'])
    },
    async addResearchQueue (row) {
      const rest = await addResearchQueue({
        buildCode: row.buildCode
      })
      this.updateDate(['resource', 'researchBuildQueue'])
    },
    async updateDate (typeArray) {
      if (typeArray.includes('resource')) {
        this.$root.$emit('resourcesUpdate')
      }
      if (typeArray.includes('buildQueue')) {
        this.$root.$emit('buildQueueUpdate')
      }

      if (typeArray.includes('building')) {
        const building = await getBuilding()
        this.buildings = building.result
      }

      if (typeArray.includes('research')) {
        const research = await getResearch()
        this.researchs = research.result
      }

      if (typeArray.includes('buildingBuildQueue')) {
        const typeBuildQueue = await getPlanetBuildQueueByType({ buildType: BuildTypeEnum.BUILDING })
        this.buildingBuildQueue = typeBuildQueue.result
      }

      if (typeArray.includes('researchBuildQueue')) {
        const typeBuildQueue = await getPlanetBuildQueueByType({ buildType: BuildTypeEnum.RESEARCH })
        this.researchBuildQueue = typeBuildQueue.result
      }
    },
    timer () {
      if (nowTime > 0) {
        const time = nowTime + timerCount * 1000
        this.$root.$emit('resourcesTimer', time)
        this.$root.$emit('buildQueueTimer', time)
        this.t = dayjs(time).format('MM-DD HH:mm:ss')
        const offset = dayjs().valueOf() - (startTime + timerCount * 1000) // 代码执行所消耗的时间
        timerCount++
        this.timers = setTimeout(this.timer, 1000 - offset)
      }
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
