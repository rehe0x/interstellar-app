<template>
  <view class="main_console_misson">
    <template v-if="missionList.length > 0">
      <view class="text_center font_16">显示器</view>
      <view class="divider"></view>
      <view class="main_console_misson_list">
        <view class="item" v-for="(item) in missionList" :key="item.id">
          <view v-if="item.missionStatus === MissionStatusEnum.START"><span>{{ progressTime(item) }}</span> 您的一支舰队从 {{item.planetName}}[{{ item.planetType ===  PlanetTypeEnum.STAR ? '星球' : '月球'}}] [{{ item.galaxy }}]
             前往 {{item.targetPlanetName}}[{{ item.planetType ===  PlanetTypeEnum.STAR ? '星球' : '月球'}}] [{{ item.targetGalaxy }}]
             执行<span>{{item.missionName}}</span>任务 预计{{ formatTime(item) }}抵达 <text @click="detail(item)">查看</text></view>

          <view v-if="item.missionStatus === MissionStatusEnum.STAY"><span>{{ progressTime(item) }}</span> 您的一支舰队停留在 {{item.targetPlanetName}}[{{ item.planetType ===  PlanetTypeEnum.STAR ? '星球' : '月球'}}] [{{ item.targetGalaxy }}]
            执行<span>{{item.missionName}}</span>任务 预计{{ formatTime(item) }}离开 <text>查看</text></view>

          <view v-if="item.missionStatus === MissionStatusEnum.BACK"><span>{{ progressTime(item) }}</span> 您的一支舰队从 {{item.targetPlanetName}}[{{ item.planetType ===  PlanetTypeEnum.STAR ? '星球' : '月球'}}] [{{ item.targetGalaxy }}]
            返回 {{item.planetName}}[{{ item.planetType ===  PlanetTypeEnum.STAR ? '星球' : '月球'}}] [{{ item.galaxy }}]
            执行<span>{{item.missionName}}</span>任务 预计{{ formatTime(item) }}抵达 <text>查看</text></view>
          <view class="divider"></view>
        </view>
      </view>
      <view class="misson_content" v-if="missonDetailShow">
        <view class="misson_header">
          <view class="font_18">执行任务：{{ missonDetail.missionName }}</view>
          <view class="divider"></view>
        </view>
        <view class="misson_main">
          <view class="misson_main_style misson_main_info">
            <view class="label">航行信息</view>
            <view class="item">
              <view class="name">目的地</view>
              <view class="form">
                <view>{{ missonDetail.targetGalaxy }}</view>
              </view>
            </view>
            <view class="item">
              <view class="name">星球/月球</view>
              <view class="form">
                <view>{{ missonDetail.targetPlanetType === PlanetTypeEnum.STAR ? '星球':'月球' }}</view>
              </view>
            </view>
            <view class="item">
              <view class="name">速度</view>
              <view class="form">
                <view>{{ missonDetail.speed }}</view>
              </view>
            </view>
            <view class="item">
              <view class="name">停留时间</view>
              <view class="form">
                <view>{{ formatTimeYMDS(missonDetail.staySeconds) }}</view>
              </view>
            </view>
            <view class="item">
              <view class="name">距离</view>
              <view class="form">
                <view>{{ missonDetail.distance }}</view>
              </view>
            </view>
            <view class="item">
              <view class="name">时间</view>
              <view class="form">
                <view>{{ formatTimeYMDS(missonDetail.seconds) }}</view>
              </view>
            </view>
            <view class="item">
              <view class="name">预计抵达</view>
              <view class="form">
                <view>{{ formatTime(missonDetail) }}</view>
              </view>
            </view>
            <view class="item">
              <view class="name">消耗燃料</view>
              <view class="form">
                <view>{{ missonDetail.consumption }}</view>
              </view>
            </view>
          </view>
          <view class="misson_main_style misson_main_resource">
            <view class="label">携带资源</view>
            <view class="item">
              <view class="name">金属</view>
              <view class="form">
                <view>{{ missonDetail.resources.metal }}</view>
              </view>
            </view>
            <view class="item">
              <view class="name">晶体</view>
              <view class="form">
                <view>{{ missonDetail.resources.crystal }}</view>
              </view>
            </view>
            <view class="item">
              <view class="name">重氦</view>
              <view class="form">
                <view>{{ missonDetail.resources.deuterium }}</view>
              </view>
            </view>
            <view class="item">
              <view class="name">总计</view>
              <view class="form">
                <view>{{ missonDetail.resources.metal + missonDetail.resources.crystal + missonDetail.resources.deuterium }}</view>
              </view>
            </view>
          </view>
          <view class="misson_main_style misson_main_fleet">
            <view class="label">出发舰队</view>
            <template v-for="(item, index) in missonDetail.fleets">
                <view :key="index" class="item">
                  <view class="name">{{ item.name }}</view>
                  <view class="form">
                    <view>{{ item.count }}</view>
                  </view>
                </view>
            </template>
          </view>
        </view>
        <view class="misson_footer">
          <view class="misson_btn">
            <view class="i_button_xx" @click="detail()">关闭</view>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import dayjs from 'dayjs'
import { MissionTypeEnum, MissionStatusEnum, PlanetTypeEnum } from '../../enum/base.enum.js'
import { getUserMissionList } from '../../api/user'
export default {
  name: 'missonItem',
  props: {

  },
  data () {
    return {
      MissionTypeEnum,
      MissionStatusEnum,
      PlanetTypeEnum,
      time: 0,
      missonDetailShow: false,
      missionList: [],
      missonDetail: {}
    }
  },
  async created () {
    this.$root.$on('missionItemUpdate', async () => {
      const rest = await getUserMissionList()
      this.missionList = rest.result
    })
    this.$root.$on('missionItemTimer', async (time) => {
      this.time = time
    })
    const rest = await getUserMissionList()
    this.missionList = rest.result
  },
  async mounted () {
  },
  computed: {
  },
  methods: {
    progressTime (item) {
      const t = (this.time - item.startTime) / 1000
      if (item.startTime && item.seconds - t <= 0) {
        return '0h 0m 0s'
      }
      const showTime = this.$utils.remainingTime(item.seconds - t)
      return showTime
    },
    formatTime (item) {
      const time = item.missionStatus === MissionStatusEnum.START ? item.startTime : item.backTime
      const s = item.missionStatus === MissionStatusEnum.STAY ? item.staySeconds : item.seconds
      return dayjs(time).add(s, 'seconds').format('HH:mm:ss')
    },
    formatTimeYMDS (seconds) {
      return this.$utils.remainingTime(seconds)
    },
    async detail (item) {
      console.log(item)
      if (this.missonDetailShow) {
        this.missonDetailShow = false
        this.missonDetail = {}
      } else {
        this.missonDetailShow = true
        this.missonDetail = item
      }
    }
  }
}
</script>

<style scoped>
@import 'misson-item.css'
</style>
