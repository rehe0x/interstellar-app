<template>
   <view class="content_left_down_queue">
    <template v-if="buildQueues.length > 0">
      <view class="text_center font_16">建造队列</view>
      <view class="divider"></view>
      <view class="content_left_down_queue_list">
        <view class="item" v-for="(item) in buildQueues" :key="item.id">
          <view> 
            <view v-if="item.buildType === BuildTypeEnum.FLEET || item.buildType === BuildTypeEnum.DEFENSE" class="font_12">
              {{ item.buildName }} {{ item.level }} / {{ Math.floor((time - item.startTime) / 1000 / (item.seconds / item.level)) }}
            </view>
            <view v-else class="font_12">{{ item.buildName }} {{ item.level }}</view>
            <template v-if="item.status === QueueStatusEnum.RUNNING">
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
          <view class="i-button" @tap="delBuildQueue(item.id)">取消</view>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import { BuildTypeEnum, QueueStatusEnum } from '../../enum/base.enum.js'
import { getPlanetBuildQueue, deleteBuildQueue } from '../../api/planet'
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
      QueueStatusEnum: QueueStatusEnum,
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

.content_left_down_queue_list{
  padding: 0 7px 0px 7px;
}
.content_left_down_queue_list > .item{
  display: flex;
  align-items: center;
}
.content_left_down_queue_list > .item > .i-button{
  margin-left: 30rpx;
  align-self: flex-end;
}

.content_left_down_queue_list .i-progress{
  width: 460rpx;
  display: flex;
  align-items: center;
}

/* 进度条 */

.i-progress {
  width: 100%;
  height: 32rpx;
  background-color: rgb(180, 242, 253);
  overflow: hidden;
}

.i-progress .i-striped-active, .i-no-active{
  align-items: center;
  justify-content: space-around;
  font-size: 24rpx;
  color: rgb(180, 242, 253);
}

.i-progress .i-striped-active{
  height: 100%;
  background-color: rgb(45,184,172);
  transition: all 0.4s ease;
}

.i-progress .i-no-active{
  display: flex;
  width: 100%;
  background-color: rgb(48,121,158);
}

.i-striped-active + view{
  width: 200rpx;
  position: absolute;
  left: 50%;
  margin-left: -50rpx;
  color: #000;
  display: flex;
  justify-content: center;
}

.i-striped-active {
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-size: 39px 39px;
  animation: progress-stripes 2s linear infinite;
}

@keyframes progress-stripes {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 39px 0;
  }
}

</style>
