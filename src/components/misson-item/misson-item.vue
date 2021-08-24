<template>
  <view class="main_console_misson">
    <template v-if="missionList.length > 0">
      <view class="text_center font_16">显示器</view>
      <view class="divider"></view>
      <view class="main_console_misson_list">
        <view class="item" v-for="(item) in missionList" :key="item.id">
          <view v-if="item.missionStatus === MissionStatusEnum.START"><span>{{ progressTime(item) }}</span> 您的一支舰队从 {{item.planetName}}[{{ item.planetType ===  PlanetTypeEnum.STAR ? '星球' : '月球'}}] [{{ item.galaxy }}]
             前往 {{item.targetPlanetName}}[{{ item.planetType ===  PlanetTypeEnum.STAR ? '星球' : '月球'}}] [{{ item.targetGalaxy }}]
             执行<span>{{item.missionName}}</span>任务 预计{{ formatTime(item) }}抵达 <text>查看</text></view>

          <view v-if="item.missionStatus === MissionStatusEnum.STAY"><span>{{ progressTime(item) }}</span> 您的一支舰队停留在 {{item.targetPlanetName}}[{{ item.planetType ===  PlanetTypeEnum.STAR ? '星球' : '月球'}}] [{{ item.targetGalaxy }}]
            执行<span>{{item.missionName}}</span>任务 预计{{ formatTime(item) }}离开 <text>查看</text></view>

          <view v-if="item.missionStatus === MissionStatusEnum.BACK"><span>{{ progressTime(item) }}</span> 您的一支舰队从 {{item.targetPlanetName}}[{{ item.planetType ===  PlanetTypeEnum.STAR ? '星球' : '月球'}}] [{{ item.targetGalaxy }}]
            返回 {{item.planetName}}[{{ item.planetType ===  PlanetTypeEnum.STAR ? '星球' : '月球'}}] [{{ item.galaxy }}]
            执行<span>{{item.missionName}}</span>任务 预计{{ formatTime(item) }}抵达 <text>查看</text></view>
          <view class="divider"></view>
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
      missionList: []
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
    async missionDetail (id) {

    }
  }
}
</script>

<style scoped>
@import 'misson-item.css'
</style>
