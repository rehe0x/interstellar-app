<template>
  <view>
    <view class="text_center font_16">{{ title }}</view>
    <view class="divider"></view>
    <template v-for="(item, buildCode) in builds">
      <view @touchstart="touchstart(buildCode)" @touchend="touchend(buildCode)" :style="touchstartStyle.indexOf(buildCode) != -1 ? 'background-color: rgb(253 72 72 / 44%)':''" class="content_left_down_build_list" :key="buildCode">
        <view class="item_up">
          <image @tap="openDetailPopup(item)" src="../../static/image/24.gif"/>
          <view class="info">
            <view class="font_14">{{ item.name }} {{ item.level > 0 ? item.level: ''}}</view>
            <view class="font_12">{{ item.buildTimeShow }}</view>
          </view>
          <template v-if="item.requeriment.isReq">
            <template v-if="buildType == BuildTypeEnum.BUILDING">
              <template v-if="buildQueues.length === 0">
                <view class="i-button" @tap="addBuildingQueue({buildCode})">{{ item.level > 0 ? '升级': '建造'}}</view>
              </template>
              <template v-else-if="buildQueues.length < 5">
                <view class="i-button" @tap="addBuildingQueue({buildCode})">加入</view>
              </template>
              <template v-else>
                <view class="i-no-button">{{ item.level > 0 ? '升级': '建造'}}</view>
              </template>
            </template>
            <template v-else-if="buildType == BuildTypeEnum.RESEARCH">
              <template v-if="buildQueues.length > 0">
                <view class="i-no-button">{{ item.level > 0 ? '升级': '建造'}}</view>
              </template>
              <template v-else>
                <view class="i-button" @tap="addResearchQueue({buildCode})">{{ item.level > 0 ? '升级': '建造'}}</view>
              </template>
            </template>
            <template v-else-if="buildType == BuildTypeEnum.FLEET || buildType == BuildTypeEnum.DEFENSE">
              <!-- v-show="fdBuildFormStyle.indexOf(buildCode) == -1" -->
              <view class="i-button" style="height: 40rpx;transition: all 0.3s;overflow: hidden;" :style="fdBuildFormStyle.indexOf(buildCode) != -1 ? 'height: 0;':''"  @tap="fdBuildFormShow(buildCode)">建造</view>
              <view class="fd_build_form" :style="fdBuildFormStyle.indexOf(buildCode) != -1 ? 'right: 10px':''">
                <input class="build_num font_16" maxlength="11" type="number"  placeholder="建造数量" />
                <view class="i-button" style="width: 170rpx;height: 60rpx;" @tap="addFleetQueue({buildCode})">确定</view>
              </view>
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
    <view>
      <view class="i_popup_mask" :class="iPopupMaskOpacity" v-if="isShowReqPopup == true" @click="closeReqPopup(1)">
        <view class="i_popup" @click.stop="closeReqPopup(2)">
          <view class="i_popup_title font_16">科技树</view>
          <view v-if="Object.keys(requeriments).length > 0" class="i_popup_content font_14">
            <view v-for="(item, index) in requeriments.requeriments" :key="index">
              {{ item.name }}   {{ item.level }} 级 当前 {{ item.mylevel }} 级
            </view>
          </view>
        </view>
      </view>
      <view class="i_popup_mask" :class="iPopupMaskOpacity" v-if="isShowDetailPopup == true" @click="closeDetailPopup(1)">
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
    </view>
  </view>
</template>

<script>
import { BuildTypeEnum, QueueStatusEnum } from '../../enum/base.enum.js'
import { addBuildingQueue, addResearchQueue, getPlanetBuildQueueByType, getBuilding, getResearch, getFleet, getDefense } from '../../api/planet'

export default {
  name: 'buildQueue',
  props: {
    title: {
      require: true
    },
    buildType: {
      require: true
    },
    planetId: {
      required: true
    }
  },
  data () {
    return {
      BuildTypeEnum: BuildTypeEnum,
      QueueStatusEnum: QueueStatusEnum,
      touchstartStyle: [],
      fdBuildFormStyle: [],
      iPopupMaskOpacity: '',
      isShowReqPopup: false,
      isShowDetailPopup: false,
      requeriments: {},
      detail: {},
      builds: [],
      buildQueues: []
    }
  },
  filters: {
    numberToCurrency (value) {
      if (!value) return '0'
      // 整数部分处理，增加,
      const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      return intPartFormat
    }
  },
  async created () {
    console.log('=======', this.buildType)
    if (this.buildType === BuildTypeEnum.BUILDING) {
      this.updateDate([BuildTypeEnum.BUILDING], BuildTypeEnum.BUILDING)
      this.$root.$on('buildingUpdate', async () => {
        this.updateDate([BuildTypeEnum.BUILDING], BuildTypeEnum.BUILDING)
      })
    }
    if (this.buildType === BuildTypeEnum.RESEARCH) {
      this.updateDate([BuildTypeEnum.RESEARCH], BuildTypeEnum.RESEARCH)
      this.$root.$on('buildResearchUpdate', async () => {
        this.updateDate([BuildTypeEnum.RESEARCH], BuildTypeEnum.RESEARCH)
      })
    }
    if (this.buildType === BuildTypeEnum.FLEET) {
      this.updateDate([BuildTypeEnum.FLEET], BuildTypeEnum.FLEET)
      this.$root.$on('buildFleetUpdate', async () => {
        this.updateDate([BuildTypeEnum.FLEET], BuildTypeEnum.FLEET)
      })
    }
    if (this.buildType === BuildTypeEnum.DEFENSE) {
      this.updateDate([BuildTypeEnum.DEFENSE], BuildTypeEnum.DEFENSE)
      this.$root.$on('buildDefenseUpdate', async () => {
        this.updateDate([BuildTypeEnum.DEFENSE], BuildTypeEnum.DEFENSE)
      })
    }
  },
  async mounted () {
  },
  computed: {
  },
  methods: {
    async addBuildingQueue (row) {
      const rest = await addBuildingQueue({
        planetId: this.planetId,
        buildCode: row.buildCode
      })
      this.updateDate(['resource'], BuildTypeEnum.BUILDING)
    },
    async addResearchQueue (row) {
      const rest = await addResearchQueue({
        planetId: this.planetId,
        buildCode: row.buildCode
      })
      this.updateDate(['resource'], BuildTypeEnum.RESEARCH)
    },
    async addFleetQueue (row) {
      this.fdBuildFormStyle.splice(this.fdBuildFormStyle.indexOf(row.buildCode), 1)
      // const rest = await addFleetQueue({
      //   planetId: this.planetId,
      //   buildCode: row.buildCode
      // })
      // this.updateDate(['resource'], BuildTypeEnum.BUILDING)
    },
    async updateDate (typeArray, buildQueueType) {
      if (typeArray.includes('resource')) {
        this.$root.$emit('resourcesUpdate')
      }
      if (typeArray.includes(BuildTypeEnum.BUILDING)) {
        const building = await getBuilding({ planetId: this.planetId })
        this.builds = building.result
      }

      if (typeArray.includes(BuildTypeEnum.RESEARCH)) {
        const research = await getResearch({ planetId: this.planetId })
        this.builds = research.result
      }

      if (typeArray.includes(BuildTypeEnum.FLEET)) {
        const fleet = await getFleet({ planetId: this.planetId })
        this.builds = fleet.result
      }

      if (typeArray.includes(BuildTypeEnum.DEFENSE)) {
        const defense = await getDefense({ planetId: this.planetId })
        this.builds = defense.result
      }
      if (buildQueueType) {
        const typeBuildQueue = await getPlanetBuildQueueByType({ planetId: this.planetId, buildType: buildQueueType })
        this.buildQueues = typeBuildQueue.result
      }
    },
    fdBuildFormShow (code) {
      this.fdBuildFormStyle.push(code)
    },
    touchstart (code) {
      this.touchstartStyle.push(code)
    },
    touchend (code) {
      this.touchstartStyle.splice(this.touchstartStyle.indexOf(code), 1)
    },
    openReqPopup (r) {
      this.requeriments = r
      this.isShowReqPopup = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.iPopupMaskOpacity = 'i_popup_mask_opacity'
        }, 0)
      })
    },
    closeReqPopup (v) {
      if (v === 2) return
      this.iPopupMaskOpacity = ''
      setTimeout(() => {
        this.isShowReqPopup = false
      }, 200)
    },
    openDetailPopup (r) {
      this.detail = r
      this.isShowDetailPopup = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.iPopupMaskOpacity = 'i_popup_mask_opacity'
        }, 0)
      })
    },
    closeDetailPopup (v) {
      if (v === 2) return
      this.iPopupMaskOpacity = ''
      setTimeout(() => {
        this.isShowDetailPopup = false
      }, 300)
    }
  }
}
</script>

<style>

.content_left_down_build_list{
  flex-direction: column;
  /* height: 188rpx; */
  padding: 8px 7px 3px 7px;
  box-sizing: border-box;
  /* 透明块改成分割线 */
  /* background-color: rgba(10, 32, 58, 0.5); */
  /* margin-bottom: 8px; */
}

.content_left_down_build_list .item_up{
  display: flex;
  margin-bottom: 3px;
}

.content_left_down_build_list .item_up .i-button,.i-no-button{
  align-self: center;
}

.content_left_down_build_list .item_up image{
  width: 100rpx;
  height: 90rpx;
}

.content_left_down_build_list .item_up .info{
  width: 360rpx;
  padding-left: 8px;
}

.content_left_down_build_list .fd_build_form {
  display: flex;
  align-items: center;
  position: absolute;
  right: -60%;
  transition: all 0.3s;
  width: 280rpx;
}

.content_left_down_build_list .fd_build_form_right {
  right: 0;
}

.content_left_down_build_list .fd_build_form .build_num{
  border: 2px solid;
  height: 60rpx;
  text-indent: 20rpx;
  margin-right: 10px;
}
.content_left_down_build_list .fd_build_form .i-button{
  transition: all 0.5s;
  overflow: hidden;
  /* width: 0px;
  height: 0px;
  width: 30px;
  height: 30px; */
}

.content_left_down_build_list .item_down{
  font-size: 24rpx;
  box-sizing: border-box;
  align-items: center;
  display: flex;
  color: rgb(180, 242, 253);
}

.content_left_down_build_list .item_down text{
  color: rgb(0,205,204);
}
.content_left_down_build_list .item_down text:not(:nth-child(1)){
  margin-left: 10rpx;
}

.i_popup{
  position: relative;
  width: 680rpx;
  margin: auto;
  top: 40%;
  transform: translateY(-40%);
  background-color: rgba(0, 4, 4, 0.7);
  box-shadow: 0px 0px 3px 0px springgreen inset;
  color: rgb(180, 242, 253);
  padding: 20px;
  box-sizing: border-box;
}

.i_popup_content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200rpx;
  max-height: 800rpx;
}

.i_popup_title {
  text-align: center;
}

.i_popup_mask {
  z-index: 1;
  position: fixed;
  /* inset: 0; 安卓不支持次写法*/
  top: 0; right: 0; bottom: 0; left: 0;
  /* background-color: #73d2d233; 安卓不支持*/
  background-color: rgba(0,4,4,0.7);
  opacity: 0;
  transition: all 0.3s;
}

.i_popup_mask_opacity {
  opacity: 1;
}
</style>
