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
            <div class="item"><div @click="toMisson(MissionTypeEnum.COLONY)"><span>殖民</span></div></div>
            <div class="item"><div @click="toMisson(MissionTypeEnum.DISPATCH)"><span>派遣</span></div></div>
            <div class="item"><div @click="toMisson(MissionTypeEnum.TRANSPORT)"><span>运输</span></div></div>
            <div class="item"><div @click="toMisson(MissionTypeEnum.EXPLORE)"><span>探险</span></div></div>
            <div class="item"><div @click="toMisson(MissionTypeEnum.SPY)"><span>探测</span></div></div>
            <div class="item"><div @click="toMisson(MissionTypeEnum.ATTACK)"><span>攻击</span></div></div>
            <div class="item"><div @click="toMisson(MissionTypeEnum.RECYCLE)"><span>回收</span></div></div>
            <div class="item"><div @click="toMisson(MissionTypeEnum.COLONY)"><span>舰队</span></div></div>
            <div class="item"><div @click="toMisson(MissionTypeEnum.JDAM)"><span>导弹</span></div></div>
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
      <view class="misson_content" v-if="missonContent">
        <view class="misson_header">
          <view class="font_18">{{ missionType.VALUE }}</view>
          <view class="divider"></view>
        </view>
        <view class="misson_main">
          <template v-if="missonStep === 1">
            <view class="misson_main_style misson_main_fleet">
              <view class="label">选择舰队</view>
              <template v-for="(item, key, index) in fleets">
                <view :key="index" class="item">
                  <view class="name">{{ item.name }}</view>
                  <view class="form">
                    <input v-model="item.level" type="number" @input="onKeyFleetInput(key, item.originLevel, $event)"  placeholder="" />
                    <view @click="fleetMax(key, item.originLevel)" >最大</view>
                  </view>
                </view>
              </template>
              <view class="item">
                <view class="name">总计</view>
                <view class="form">
                  <input v-model="totalFleet" type="number" disabled  placeholder="" />
                  <view @click="fleetAllReset">{{ missonFleetAllStatus ? '全部' : '重置' }}</view>
                </view>
              </view>
            </view>
          </template>
          <template v-else-if="missonStep === 2">
            <view class="misson_main_style misson_main_info">
              <view class="label">航行信息</view>
              <view class="item">
                <view class="name">目的地</view>
                <view class="form">
                  <input maxlength="2" v-model="missionForm.targetGalaxyX" @input="onKeyTargetGalaxyInput($event)" type="number"  placeholder="" />
                  <input maxlength="3" v-model="missionForm.targetGalaxyY" @input="onKeyTargetGalaxyInput($event)" type="number"  placeholder="" />
                  <input maxlength="3" v-model="missionForm.targetGalaxyZ" @input="onKeyTargetGalaxyInput($event)" type="number"  placeholder="" />
                </view>
              </view>
              <view class="item">
                <view class="name">星球/月球</view>
                <view class="form">
                  <view class="planetType">
                    <view @click="missionForm.planetType = PlanetTypeEnum.STAR" :class="missionForm.planetType === PlanetTypeEnum.STAR ? 'planet_type_on' : ''">星球</view>
                    <view @click="missionForm.planetType = PlanetTypeEnum.MOON" :class="missionForm.planetType === PlanetTypeEnum.MOON ? 'planet_type_on' : ''">月球</view>
                  </view>
                </view>
              </view>
              <view class="item">
                <view class="name">速度</view>
                <view class="form">
                  <view class="speed">
                    <template v-for="(item, index) in 10">
                      <view :key="index" @click="setSpeed(item * 10)" :class="missionForm.speed >= item * 10 ? 'speed_on' : ''">{{ item * 10 }}</view>
                    </template>
                  </view>
                </view>
              </view>
              <view class="item">
                <view class="name">停留时间</view>
                <view class="form">
                  <view class="speed">
                    <template v-for="(item, index) in 10">
                      <view :key="index" @click="missionForm.stayTime = index" :class="missionForm.stayTime >= index ? 'speed_on' : ''">{{ index }}</view>
                    </template>
                  </view>
                </view>
              </view>
              <view class="item">
                <view class="name">距离</view>
                <view class="form">
                  <view>{{ missionCompute.distance }}</view>
                </view>
              </view>
              <view class="item">
                <view class="name">时间</view>
                <view class="form">
                  <view>{{ progressTime(missionCompute.seconds) }}</view>
                </view>
              </view>
              <view class="item">
                <view class="name">预计抵达</view>
                <view class="form">
                  <view>{{ missionCompute.estimatedTime }}</view>
                </view>
              </view>
              <view class="item">
                <view class="name">消耗燃料</view>
                <view class="form">
                  <view>{{ missionCompute.consumption }}</view>
                </view>
              </view>
              <view class="item">
                <view class="name">剩余空间</view>
                <view class="form">
                  <view>{{ missionCompute.capacity - missionCompute.consumption }}</view>
                </view>
              </view>
            </view>
            <view class="misson_main_style misson_main_resource">
              <view class="label">携带资源</view>
              <view class="item">
                <view class="name">金属</view>
                <view class="form">
                  <input v-model="missionForm.metal" @input="onKeyResourceInput('metal', $event)" type="number"  placeholder="" />
                  <view @click="resourceMax('metal')">最大</view>
                </view>
              </view>
              <view class="item">
                <view class="name">晶体</view>
                <view class="form">
                  <input v-model="missionForm.crystal" @input="onKeyResourceInput('crystal', $event)" type="number"  placeholder="" />
                  <view @click="resourceMax('crystal')">最大</view>
                </view>
              </view>
              <view class="item">
                <view class="name">重氦</view>
                <view class="form">
                  <input v-model="missionForm.deuterium" @input="onKeyResourceInput('deuterium', $event)" type="number"  placeholder="" />
                  <view @click="resourceMax('deuterium')">最大</view>
                </view>
              </view>
              <view class="item">
                <view class="name">总计</view>
                <view class="form">
                  <input v-model="totalResource" type="number" disabled  placeholder="" />
                  <view @click="resourceAllReset">{{ missonResourceAllStatus ? '全部' : '重置' }}</view>
                </view>
              </view>
            </view>
          </template>
          <template v-else-if="missonStep === 3">
            <view class="misson_main_style misson_main_info">
              <view class="label">航行信息</view>
              <view class="item">
                <view class="name">目的地</view>
                <view class="form">
                  <view>{{ missionRest.targetGalaxy }}</view>
                </view>
              </view>
              <view class="item">
                <view class="name">星球/月球</view>
                <view class="form">
                  <view>{{ missionRest.targetGalaxy === PlanetTypeEnum.STAR ? '星球':'月球' }}</view>
                </view>
              </view>
              <view class="item">
                <view class="name">速度</view>
                <view class="form">
                  <view>{{ missionRest.detail.speed }}</view>
                </view>
              </view>
              <view class="item">
                <view class="name">停留时间</view>
                <view class="form">
                  <view>{{ progressTime(missionRest.staySeconds) }}</view>
                </view>
              </view>
              <view class="item">
                <view class="name">距离</view>
                <view class="form">
                  <view>{{ missionRest.distance }}</view>
                </view>
              </view>
              <view class="item">
                <view class="name">时间</view>
                <view class="form">
                  <view>{{ progressTime(missionRest.seconds) }}</view>
                </view>
              </view>
              <view class="item">
                <view class="name">预计抵达</view>
                <view class="form">
                  <view>{{ missionRest.estimatedTime }}</view>
                </view>
              </view>
              <view class="item">
                <view class="name">消耗燃料</view>
                <view class="form">
                  <view>{{ missionRest.detail.consumption }}</view>
                </view>
              </view>
            </view>
            <view class="misson_main_style misson_main_resource">
              <view class="label">携带资源</view>
              <view class="item">
                <view class="name">金属</view>
                <view class="form">
                  <view>{{ missionRest.detail.resources.metal }}</view>
                </view>
              </view>
              <view class="item">
                <view class="name">晶体</view>
                <view class="form">
                  <view>{{ missionRest.detail.resources.crystal }}</view>
                </view>
              </view>
              <view class="item">
                <view class="name">重氦</view>
                <view class="form">
                 <view>{{ missionRest.detail.resources.deuterium }}</view>
                </view>
              </view>
              <view class="item">
                <view class="name">总计</view>
                <view class="form">
                  <view>{{ missionRest.detail.resources.metal + missionRest.detail.resources.crystal + missionRest.detail.resources.deuterium }}</view>
                </view>
              </view>
            </view>
            <view class="misson_main_style misson_main_fleet">
              <view class="label">出发舰队</view>
              <template v-for="(item, key, index) in missionRest.detail.fleets">
                  <view :key="index" class="item">
                    <view class="name">{{ fleets[key].name }}</view>
                    <view class="form">
                      <view>{{ item }}</view>
                    </view>
                  </view>
              </template>
            </view>
          </template>
        </view>
        <view class="misson_footer">
          <view class="misson_btn">
            <template v-if="missonStep !== 3">
              <view class="i_button_xx" @click="missonNext(0)">{{ missonStep === 1 ? '关闭' : '返回'}}</view>
              <view class="i_button_xx" @click="missonNext(1)">{{ missonStep === 1 ? '下一步' : '确定'}}</view>
            </template>
            <template v-else>
              <view class="i_button_xx" @click="missonNext(0)">{{ missonStep === 3 ? '关闭' : '返回'}}</view>
            </template>
          </view>
        </view>
      </view>
		</view>
    <view class="misson_menu_mask" :class="missonMenuMaskOpacity" v-show="missonMenuMaskShow"></view>
    <view class="misson_main_mask" :class="missonMainMaskOpacity" v-show="missonMainMaskShow"></view>
	</view>
</template>

<script>
import dayjs from 'dayjs'
import { PlanetTypeEnum, MissionTypeEnum } from '../../enum/base.enum'
import { getStaratlas, getMissionCompute, executeMission, getFleet } from '../../api/main'

export default {
  data () {
    return {
      PlanetTypeEnum,
      MissionTypeEnum,
      openedMissonMenu: false,
      missonMenuMaskShow: false,
      missonMenuMaskOpacity: '',
      missonMainMaskShow: false,
      missonMainMaskOpacity: '',
      missonContent: false,
      missonStep: 1,
      missonFleetAllStatus: false,
      missonResourceAllStatus: true,
      planetId: 0,
      galaxyX: 0,
      galaxyY: 0,
      missionType: {},
      staratlas: [],
      fleets: {},
      missionCompute: {},
      missionForm: {
        planetType: PlanetTypeEnum.STAR,
        targetGalaxyX: 0,
        targetGalaxyY: 0,
        targetGalaxyZ: 0,
        speed: 100,
        stayTime: 0,
        metal: 0,
        crystal: 0,
        deuterium: 0
      },
      missionRest: {}
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
  computed: {
    totalFleet () {
      const c = Object.values(this.fleets).reduce((acc, cur) => +acc + +cur.level, 0)
      return c
    },
    totalResource () {
      return +this.missionForm.metal + +this.missionForm.crystal + +this.missionForm.deuterium
    }
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
        this.$nextTick(() => {
          setTimeout(() => {
            this.missonMenuMaskOpacity = ''
          }, 200)
          setTimeout(() => {
            this.missonMenuMaskShow = false
          }, 500)
        })
      }
    },
    openMissonContent () {
      if (!this.missonContent) {
        this.missonContent = true
        this.missonMainMaskShow = true
        this.$nextTick(() => {
          setTimeout(() => {
            this.missonMainMaskOpacity = 'misson_main_mask_opacity'
          }, 0)
        })
      } else {
        this.missonMainMaskOpacity = ''
        this.$nextTick(() => {
          this.missonContent = false
          setTimeout(() => {
            this.missonMainMaskShow = false
          }, 500)
        })
      }
    },
    async reMissionCompute () {
      const fleets = {}
      for (const key in this.fleets) {
        fleets[key] = this.fleets[key].level
      }
      const rest = await getMissionCompute({ planetId: this.planetId, ...this.missionForm, missionTypeCode: this.missionType.CODE, fleets })
      this.missionCompute = rest.result
    },
    async toMisson (type) {
      this.missionForm.targetGalaxyX = this.galaxyX
      this.missionForm.targetGalaxyY = this.galaxyY
      this.missionForm.targetGalaxyZ = 1
      this.missionType = type
      this.openMissonMenu()
      this.openMissonContent()
      const rest = await getFleet({ planetId: this.planetId })
      const { fleetSolarSatelit, ...r } = rest.result
      this.fleets = r
      switch (type) {
        case MissionTypeEnum.COLONY:
          console.log(1)
          break
        case MissionTypeEnum.DISPATCH:
          console.log(22)
          break
        case MissionTypeEnum.TRANSPORT:
          console.log(22)
          break
        case MissionTypeEnum.EXPLORE:
          console.log(22)
          break
        case MissionTypeEnum.SPY:
          console.log(22)
          break
        case MissionTypeEnum.ATTACK:
          console.log(22)
          break
        default:
          break
      }
    },
    async missonNext (next) {
      if (next) {
        if (this.missonStep === 1) {
          this.missonStep = 2
          this.reMissionCompute()
        } else if (this.missonStep === 2) {
          // 确认
          this.missionForm.planetId = this.planetId
          this.missionForm.missionTypeCode = this.missionType.CODE
          this.missionForm.fleets = {}
          for (const key in this.fleets) {
            this.missionForm.fleets[key] = this.fleets[key].level
          }
          console.log(this.missionForm)
          const rest = await executeMission(this.missionForm)
          if (rest.result) {
            this.missionRest = rest.result
            const estimatedTime = dayjs(rest.time).add(this.missionRest.seconds, 'seconds').format('YYYY-MM-DD HH:mm:ss')
            this.missionRest.estimatedTime = estimatedTime
          }
          this.missonStep = 3
        }
      } else {
        if (this.missonStep === 1 || this.missonStep === 3) {
          this.openMissonContent()
        } else {
          this.missonStep = 1
        }
      }
    },
    fleetMax (key, originLevel) {
      // 延时 不然不会更新
      this.$nextTick(() => {
        this.fleets[key].level = originLevel
      })
    },
    fleetAllReset () {
      if (this.missonFleetAllStatus) {
        for (const key in this.fleets) {
          this.fleets[key].level = this.fleets[key].originLevel
        }
        this.missonFleetAllStatus = false
      } else {
        for (const key in this.fleets) {
          this.fleets[key].level = 0
        }
        this.missonFleetAllStatus = true
      }
    },
    onKeyFleetInput (key, originLevel, event) {
      if (event.detail.value > originLevel) {
        // 延时 不然不会更新
        this.$nextTick(() => {
          this.fleets[key].level = originLevel
        })
      } else if (!event.detail.value || event.detail.value < 0) {
        // 延时 不然不会更新
        this.$nextTick(() => {
          this.fleets[key].level = 0
        })
      } else {
        // 延时 不然不会更新
        this.$nextTick(() => {
          this.fleets[key].level = +event.detail.value
        })
      }
    },
    onKeyTargetGalaxyInput (event) {
      if (event.detail.value) {
        this.reMissionCompute()
      }
    },
    setSpeed (speed) {
      this.missionForm.speed = speed
      this.reMissionCompute()
    },
    resourceMax (key) {
      this.missionForm[key] = this.missionCompute[key]
      // 延时 不然不会更新
      this.$nextTick(() => {
        this.onKeyResourceInput(key, { detail: { value: this.missionCompute[key] } })
      })
    },
    resourceAllReset () {
      if (this.missonResourceAllStatus) {
        this.$nextTick(() => {
          this.missionForm.metal = 0
          this.missionForm.crystal = 0
          this.missionForm.deuterium = 0
          !this.missionForm.metal && (this.missionForm.metal = this.missionCompute.metal)
          this.onKeyResourceInput('metal', { detail: { value: this.missionCompute.metal } })
          !this.missionForm.crystal && (this.missionForm.crystal = this.missionCompute.crystal)
          this.onKeyResourceInput('crystal', { detail: { value: this.missionCompute.crystal } })
          !this.missionForm.deuterium && (this.missionForm.deuterium = this.missionCompute.deuterium)
          this.onKeyResourceInput('deuterium', { detail: { value: this.missionCompute.deuterium } })
          this.missonResourceAllStatus = false
        })
      } else {
        this.missionForm.metal = 0
        this.missionForm.crystal = 0
        this.missionForm.deuterium = 0
        this.missonResourceAllStatus = true
      }
    },
    onKeyResourceInput (key, event) {
      const totalResource = +this.missionForm.metal + +this.missionForm.crystal + +this.missionForm.deuterium
      const c = this.missionCompute.capacity - this.missionCompute.consumption
      if (!event.detail.value || event.detail.value < 0) {
        // 延时 不然不会更新
        this.$nextTick(() => {
          this.missionForm[key] = 0
        })
      } else if (event.detail.value > this.missionCompute[key] || totalResource > c) {
        let s = this.missionCompute[key]
        if (totalResource > c) {
          s = this.missionCompute.capacity - this.missionCompute.consumption - (totalResource - event.detail.value)
          s < 0 && (s = 0)
          if (s > this.missionCompute[key]) {
            s = this.missionCompute[key]
          }
        }
        // 延时 不然不会更新
        this.$nextTick(() => {
          this.missionForm[key] = s
        })
      } else {
        // 延时 不然不会更新
        this.$nextTick(() => {
          this.missionForm[key] = +event.detail.value
        })
      }
    },
    progressTime (seconds) {
      return this.$utils.remainingTime(seconds)
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
