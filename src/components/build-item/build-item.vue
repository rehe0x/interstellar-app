<template>
  <view class="main_console_build">
    <view class="text_center font_16">{{ title }}</view>
    <view class="divider"></view>
    <template v-for="(item, buildCode) in builds">
      <view :style="fdBuildFormStatus.includes(buildCode) ? 'background-color: rgba(0,0,0,0.4)' : ''" class="main_console_build_list" :key="buildCode">
        <view class="item_info">
          <image @tap="openDetailPopup(item)" src="../../static/image/24.gif" :style="fdBuildFormStatus.includes(buildCode) ? 'transform: translateX(-110rpx);' : ''"/>
          <view class="info" :style="fdBuildFormStatus.includes(buildCode) ? 'transform: translateX(-110rpx);' : ''">
            <view class="font_14">{{ item.name }} {{ item.level > 0 ? item.level: ''}}</view>
            <view class="font_12">{{ item.buildTimeShow }}</view>
          </view>
          <template v-if="item.requeriment.isReq">
            <template v-if="buildType == BuildTypeEnum.BUILDING">
              <template v-if="buildQueues.length === 0">
                <view class="i_button_x" @tap="addBuildingQueue({buildCode})">{{ item.level > 0 ? '升级': '建造'}}</view>
              </template>
              <template v-else-if="buildQueues.length < buildQueueMax">
                <view class="i_button_x" @tap="addBuildingQueue({buildCode})">加入</view>
              </template>
              <template v-else>
                <view class="i_no_button_x">{{ item.level > 0 ? '升级': '建造'}}</view>
              </template>
            </template>
            <template v-else-if="buildType == BuildTypeEnum.RESEARCH">
              <template v-if="buildQueues.length > 0">
                <view class="i_no_button_x">{{ item.level > 0 ? '升级': '建造'}}</view>
              </template>
              <template v-else>
                <view class="i_button_x" @tap="addResearchQueue({buildCode})">{{ item.level > 0 ? '升级': '建造'}}</view>
              </template>
            </template>
            <template v-else-if="buildType == BuildTypeEnum.FLEET || buildType == BuildTypeEnum.DEFENSE">
              <template v-if="buildQueues.length < buildQueueMax">
                <view class="i_button_x" style="transition: all 0.3s;overflow: hidden;" :style="fdBuildFormStatus.includes(buildCode) ? 'height: 0;':''"  @tap="fdBuildFormShow(buildCode)">建造</view>
                <view class="fd_build_form" v-show="fdBuildFormStatus.includes(buildCode)" :style="fdBuildFormStyle">
                  <input class="build_num font_16" :focus="buildNumFocus" maxlength="4" type="number"  v-model="buildNum" placeholder="建造数量" />
                  <view class="i_button_x" style="height: 100rpx;width:72rpx;writing-mode: vertical-lr;" @tap="buildType == BuildTypeEnum.FLEET ? addFleetQueue({buildCode}) : addDefenseQueue({buildCode})">确定</view>
                </view>
              </template>
              <template v-else>
                <view class="i_no_button_x">建造</view>
              </template>
            </template>
          </template>
          <template v-else>
            <view class="i_button_x" @tap="openReqPopup(item.requeriment)">查看</view>
          </template>
        </view>
        <view class="item_resources">
          <view><text>金属：</text>{{ item.metal | numberToCurrency }} <text>晶体：</text>{{ item.crystal | numberToCurrency }} <text>重氦：</text>{{ item.deuterium | numberToCurrency }}</view>
        </view>
      </view>
      <view class="divider" :key="item.id"></view>
    </template>
    <view>
      <view class="i_popup_mask" :class="iPopupMaskOpacity" v-if="isShowReqPopup == true" @click="closeReqPopup(1)">
        <view class="i_popup" :class="iPopupContentOpacity" @click.stop="closeReqPopup(2)">
          <view class="i_popup_title font_16">科技树</view>
          <view v-if="Object.keys(requeriments).length > 0" class="i_popup_content font_14">
            <view v-for="(item, index) in requeriments.requeriments" :key="index">
              {{ item.name }}   {{ item.level }} 级 当前 {{ item.mylevel }} 级
            </view>
          </view>
        </view>
      </view>
      <view class="i_popup_mask" :class="iPopupMaskOpacity" v-if="isShowDetailPopup == true" @click="closeDetailPopup(1)">
        <view v-if="Object.keys(detail).length > 0" class="i_popup" :class="iPopupContentOpacity" @click.stop="closeDetailPopup(2)">
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
import { addBuildingQueue, addResearchQueue, addFleetQueue, addDefenseQueue, getPlanetBuildQueue, getBuilding, getResearch, getFleet, getDefense } from '../../api/main'

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
    },
    buildQueueMax: {
      required: true
    }
  },
  data () {
    return {
      BuildTypeEnum: BuildTypeEnum,
      QueueStatusEnum: QueueStatusEnum,
      fdBuildFormStatus: [],
      fdBuildFormStyle: '',
      iPopupMaskOpacity: '',
      iPopupContentOpacity: '',
      isShowReqPopup: false,
      isShowDetailPopup: false,
      requeriments: {},
      detail: {},
      builds: [],
      buildQueues: [],
      buildNum: null,
      buildNumFocus: false
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
      console.log(this.buildNum)
      if (this.buildNum) {
        const rest = await addFleetQueue({
          planetId: this.planetId,
          buildCode: row.buildCode,
          buildNum: this.buildNum
        })
        this.updateDate(['resource'], BuildTypeEnum.FLEET)
      }
      this.fdBuildFormStyle = ''
      this.buildNumFocus = false
      setTimeout(() => {
        this.fdBuildFormStatus.splice(this.fdBuildFormStatus.indexOf(row.buildCode), 1)
      }, 300)
    },
    async addDefenseQueue (row) {
      console.log(this.buildNum)
      if (this.buildNum) {
        const rest = await addDefenseQueue({
          planetId: this.planetId,
          buildCode: row.buildCode,
          buildNum: this.buildNum
        })
        this.updateDate(['resource'], BuildTypeEnum.DEFENSE)
      }
      this.fdBuildFormStyle = ''
      this.buildNumFocus = false
      setTimeout(() => {
        this.fdBuildFormStatus.splice(this.fdBuildFormStatus.indexOf(row.buildCode), 1)
      }, 300)
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
        const typeBuildQueue = await getPlanetBuildQueue({ planetId: this.planetId, buildType: buildQueueType })
        this.buildQueues = typeBuildQueue.result
      }
    },
    fdBuildFormShow (code) {
      this.fdBuildFormStatus.push(code)
      this.$nextTick(() => {
        setTimeout(() => {
          this.fdBuildFormStyle = 'right: 20rpx'
        }, 0)
        setTimeout(() => {
          this.buildNumFocus = true
        }, 400)
      })
    },
    openReqPopup (r) {
      this.requeriments = r
      this.isShowReqPopup = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.iPopupContentOpacity = 'i_popup_content_opacity'
          this.iPopupMaskOpacity = 'i_popup_mask_opacity'
        }, 0)
      })
    },
    closeReqPopup (v) {
      if (v === 2) return
      this.iPopupMaskOpacity = ''
      this.iPopupContentOpacity = ''
      setTimeout(() => {
        this.isShowReqPopup = false
      }, 300)
    },
    openDetailPopup (r) {
      this.detail = r
      this.isShowDetailPopup = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.iPopupContentOpacity = 'i_popup_content_opacity'
          this.iPopupMaskOpacity = 'i_popup_mask_opacity'
        }, 0)
      })
    },
    closeDetailPopup (v) {
      if (v === 2) return
      this.iPopupContentOpacity = ''
      this.iPopupMaskOpacity = ''
      setTimeout(() => {
        this.isShowDetailPopup = false
      }, 300)
    }
  }
}
</script>

<style scoped>
@import 'build-item.css'
</style>

