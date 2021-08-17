<template>
   <view class="main_console_queue">
    <template v-if="buildQueues.length > 0">
      <view class="text_center font_16">建造队列</view>
      <view class="divider"></view>
      <view class="main_console_queue_list">
        <view class="item" v-for="(item) in buildQueues" :key="item.id">
          <view>
            <view v-if="item.buildType === BuildTypeEnum.FLEET || item.buildType === BuildTypeEnum.DEFENSE" class="font_12">
              {{ item.buildName }} {{ item.level }} / {{item.status === BuildQueueStatusEnum.RUNNING ? Math.floor((time - item.startTime) / 1000 / (item.seconds / item.level)) : 0 }}
            </view>
            <view v-else class="font_12">{{ item.buildName }} {{ item.level }}</view>
            <template v-if="item.status === BuildQueueStatusEnum.RUNNING">
              <view class="i-progress" style="height: 28rpx">
                <!-- 小程序style不支持计算函数 -->
                <view class="i-striped-active" :style="'width: '+Math.floor((time - item.startTime) / 1000 / item.seconds * 100)+'%'"></view>
                <view>{{ progressTime(item) }}</view>
              </view>
            </template>
            <template v-else>
              <view class="i-progress" style="height: 28rpx"><view class="i-no-active" >等待</view></view>
            </template>
          </view>
          <view class="i_button" @tap="delBuildQueue(item.id)">取消</view>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import { BuildTypeEnum, BuildQueueStatusEnum } from '../../enum/base.enum.js'
import { getPlanetBuildQueue, deleteBuildQueue } from '../../api/main'
export default {
  name: 'buildQueue',
  props: {
    planetId: {
      required: true
    }
  },
  data () {
    return {
      BuildTypeEnum: BuildTypeEnum,
      BuildQueueStatusEnum: BuildQueueStatusEnum,
      time: 0,
      buildQueues: []
    }
  },
  async created () {
    this.$root.$on('buildQueueUpdate', async () => {
      const buildQueue = await getPlanetBuildQueue({ planetId: this.planetId })
      this.buildQueues = buildQueue.result
    })
    this.$root.$on('buildQueueTimer', async (time) => {
      this.time = time
    })
    const buildQueue = await getPlanetBuildQueue({ planetId: this.planetId })
    this.buildQueues = buildQueue.result
  },
  async mounted () {
  },
  computed: {
  },
  methods: {
    progressTime (item) {
      const t = (this.time - item.startTime) / 1000
      if (item.startTime && item.seconds - t <= 0) {
        setTimeout(async () => {
          this.$root.$emit('resourcesUpdate')
          const buildQueue = await getPlanetBuildQueue({ planetId: this.planetId })
          this.buildQueues = buildQueue.result
        }, 1000)
        return '0h 0m 0s'
      }
      const showTime = this.$utils.remainingTime(item.seconds - t)
      return showTime
    },
    progressWidth (item) {
      const t = (this.time - item.startTime) / 1000
      if (item.startTime && item.seconds - t <= 0) {
        return `width: ${100}%`
      }
      const s = Math.floor((t / item.seconds) * 100)
      return `width: ${s}%`
    },
    async delBuildQueue (id) {
      await deleteBuildQueue({ queueId: id })
      this.$root.$emit('resourcesUpdate')
      const buildQueue = await getPlanetBuildQueue({ planetId: this.planetId })
      this.buildQueues = buildQueue.result
    }
  }
}
</script>

<style scoped>
@import 'build-queue.css'
</style>
