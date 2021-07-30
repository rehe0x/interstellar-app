<template>
	<view class="wrapper">
    <view class="status_bar">
    </view>
    <view class="content">
      <view class="content_left">
        <view class="content_left_up">
          <view><text>金属：</text>{{ resources.metalStorageMax | numberToCurrency }} / {{ resources.metal | numberToCurrency }}</view>
          <view><text>晶体：</text>{{ resources.crystalStorageMax | numberToCurrency }} / {{ resources.crystal | numberToCurrency }}</view>
          <view><text>重氦：</text>{{ resources.deuteriumStorageMax | numberToCurrency }} / {{ resources.deuterium | numberToCurrency }}</view>
          <view><text>能量：</text>{{ resources.energyMax | numberToCurrency }} / {{ resources.energyUsed | numberToCurrency }}</view>
        </view>
        <view class="content_left_down">
          <scroll-view scroll-y="true" class="scroll-Y" style="height: 100%;">
            <template v-if="swichSubmenuCode==1">
              <view class="content_left_down_queue">
                <template v-if="buildQueues.length > 0">
                  <view class="text_center font_16">建造队列</view>
                  <view class="divider"></view>
                  <view class="content_left_down_queue_list">
                    <view class="item" v-for="(item) in buildQueues" :key="item.id">
                      <view>
                        <view class="font_12">{{ item.buildName }} {{ item.level }}</view>
                        <template v-if="item.status === QueueStatusEnum.RUNNING">
                          <view class="i-progress" style="height: 28rpx"><view class="i-striped-active" :style="progress(item).width"></view><view>{{progress(item).str}}</view></view>
                        </template>
                        <template v-else>
                          <view class="i-progress" style="height: 28rpx"><view class="i-no-active" >等待</view></view>
                        </template>
                      </view>
                      <view class="i-button" @tap="delBuildQueue(item.id)">取消</view>
                    </view>
                  </view>
                </template>
              </view>
              <view class="content_left_down_active">
                <view class="text_center font_16">显示器</view>
                <view class="divider"></view>
                <view class="content_left_down_active_list">
                  你要记得那些黑暗中默默抱紧你的人，逗你笑的人，陪你彻夜聊天的人，坐车来看望你的人，陪你哭过的人，在医院陪你的人，总是以你为重的人，带着你四处游荡的人，说想念你的人。是这些人组成你生命中一点一滴的温暖，是这些温暖使你远离阴霾，是这些温暖使你成为善良的人。
                </view>
              </view>
            </template>
            <template v-else-if="swichSubmenuCode == 2">
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
                      <template v-if="typeBuildQueues.length === 0">
                        <view class="i-button" @tap="addBuildingQueue({buildCode})">升级</view>
                      </template>
                      <template v-else-if="typeBuildQueues.length < 5">
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
            </template>
            <template v-else-if="swichSubmenuCode==3">
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
                      <template v-if="typeBuildQueues.length > 0">
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
            </template>
            <template v-else-if="swichSubmenuCode==4">
              船厂
            </template>
            <template v-else-if="swichSubmenuCode==5">
              防御
            </template>
          </scroll-view>
        </view>
      </view>
      <view class="content_right">
        <view class="content_right_up">
          <view @tap="showDrawer">设置</view>
          <view @tap="navigateTo">原生</view>
          <view @tap="openReqPopup">弹出</view>
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
      <view class="i_popup_mask" v-if="isShowReqPopup == true" @click="closeReqPopup(1)">
        <view class="i_popup" @click.stop="closeReqPopup(2)">
          <view class="i_popup_title font_16">科技树</view>
          <view class="i_popup_content font_14">
            <view v-for="(item, index) in requeriments.requeriments" :key="index">
              {{ item.name }}   {{ item.level }} 级 当前 {{ item.mylevel }} 级
            </view>
          </view>
        </view>
      </view>
      <view class="i_popup_mask" v-if="isShowDetailPopup == true" @click="closeDetailPopup(1)">
        <view class="i_popup" @click.stop="closeDetailPopup(2)">
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
    </view>
	</view>
</template>

<script>
import { BuildTypeEnum, QueueStatusEnum } from '../../enum/base.enum.js'
import { getPlanetBuildQueue, getPlanetBuildQueueByType, getResources, getBuilding, getResearch, addBuildingQueue, addResearchQueue, deleteBuildQueue } from '../../api/planet'
export default {
  data () {
    return {
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
      resources: {},
      buildings: [],
      researchs: [],
      buildQueues: [],
      typeBuildQueues: [],
      timeCount: 0
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
    const resource = await getResources()
    this.resources = resource.result
    const buildQueue = await getPlanetBuildQueue()
    this.buildQueues = buildQueue.result
    this.timer()
  },
  methods: {
    touchstart (code) {
      console.log('按下', code)
      this.touchstartStyle.push(code)
    },
    touchend (code) {
      console.log('松开')
      this.touchstartStyle.splice(this.touchstartStyle.indexOf(code), 1)
    },
    openReqPopup (r) {
      console.log(r)
      this.requeriments = r
      this.isShowReqPopup = true
    },
    closeReqPopup (v) {
      if (v === 2) return
      this.isShowReqPopup = false
    },
    openDetailPopup (r) {
      console.log(r)
      this.detail = r
      this.isShowDetailPopup = true
    },
    closeDetailPopup (v) {
      if (v === 2) return
      this.isShowDetailPopup = false
    },
    showDrawer () {
      uni.getSubNVueById('drawer').show('slide-in-left', 200)
    },
    navigateTo () {
      uni.navigateTo({
        url: '/pages/index/new-nvue-page-1'
      })
    },
    progress (item) {
      const t = (Math.floor(new Date().getTime()) - item.startTime) / 1000
      if (item.startTime && item.seconds - t <= 0) {
        setTimeout(() => {
          getPlanetBuildQueue().then((rest) => {
            this.buildQueues = rest.result
          })
          getResources().then((rest) => {
            this.resources = rest.result
          })
        }, 1000)
        return { width: `width: ${100}%`, str: '0h 0m 0s' }
      }
      const s = Math.floor((t / item.seconds) * 100)
      const showTime = this.$utils.remainingTime(item.seconds - t)
      return { width: `width: ${s}%`, str: showTime }
    },
    async swichMenu (code) {
      if (code === 1) {
        const buildQueue = await getPlanetBuildQueue()
        this.buildQueues = buildQueue.result
      } else if (code === 2) {
        const building = await getBuilding()
        this.buildings = building.result
        const typeBuildQueue = await getPlanetBuildQueueByType({ buildType: BuildTypeEnum.BUILDING })
        this.typeBuildQueues = typeBuildQueue.result
      } else if (code === 3) {
        const research = await getResearch()
        this.researchs = research.result
        const typeBuildQueue = await getPlanetBuildQueueByType({ buildType: BuildTypeEnum.RESEARCH })
        this.typeBuildQueues = typeBuildQueue.result
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
      const resource = await getResources()
      this.resources = resource.result
      const typeBuildQueue = await getPlanetBuildQueueByType({ buildType: BuildTypeEnum.BUILDING })
      this.typeBuildQueues = typeBuildQueue.result
    },
    async addResearchQueue (row) {
      const rest = await addResearchQueue({
        buildCode: row.buildCode
      })
      const resource = await getResources()
      this.resources = resource.result
      const typeBuildQueue = await getPlanetBuildQueueByType({ buildType: BuildTypeEnum.RESEARCH })
      this.typeBuildQueues = typeBuildQueue.result
    },
    async delBuildQueue (id) {
      const rest = await deleteBuildQueue({
        queueId: id
      })
      const buildQueue = await getPlanetBuildQueue()
      this.buildQueues = buildQueue.result
      const resource = await getResources()
      this.resources = resource.result
    },
    timer () {
      let metalT = 0
      let crystalT = 0
      let deuteriumT = 0
      this.resourceTimer = setInterval(() => {
        this.timeCount++
        if (this.resources.metal < this.resources.metalStorageMax) {
          if (this.resources.metalTime >= 1) {
            this.resources.metal = Math.floor(+this.resources.metal + +this.resources.metalTime)
          } else {
            metalT += +this.resources.metalTime
            if (metalT >= 1) {
              this.resources.metal = Math.floor(+this.resources.metal + +metalT)
              metalT = 0
            }
          }
        }
        if (this.resources.crystal < this.resources.crystalStorageMax) {
          if (this.resources.crystalTime >= 1) {
            this.resources.crystal = Math.floor(+this.resources.crystal + +this.resources.crystalTime)
          } else {
            crystalT += +this.resources.crystalTime
            if (crystalT >= 1) {
              this.resources.crystal = Math.floor(+this.resources.crystal + +crystalT)
              crystalT = crystalT % 1
            }
          }
        }
        if (this.resources.deuterium < this.resources.deuteriumStorageMax) {
          if (this.resources.deuteriumTime >= 1) {
            this.resources.deuterium = Math.floor(+this.resources.deuterium + +this.resources.deuteriumTime)
          } else {
            deuteriumT += +this.resources.deuteriumTime
            if (deuteriumT >= 1) {
              this.resources.deuterium = Math.floor(+this.resources.deuterium + +deuteriumT)
              deuteriumT = 0
            }
          }
        }
      }, 1000)
    },
    destroyed () {
      clearInterval(this.resourceTimer)
    }
  }
}
</script>

<style>
@import 'index.css'
</style>
