<template>
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
</template>

<script>
import { BuildTypeEnum, QueueStatusEnum } from '../../enum/base.enum.js'
export default {
  name: 'buildQueue',
  props: {
    buildQueuesDate: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      BuildTypeEnum: BuildTypeEnum,
      QueueStatusEnum: QueueStatusEnum,
      buildQueues: [],
      timeCount: 0
    }
  },
  watch: {
    buildQueuesDate: {
      handler (val) {
        this.buildQueues = val
      },
      immediate: true
    }
  },
  created () {
  },
  mounted () {
    this.timer()
  },
  methods: {
    progress (item) {
      this.timeCount
      const t = (Math.floor(new Date().getTime()) - item.startTime) / 1000
      if (item.startTime && item.seconds - t <= 0) {
        setTimeout(() => {
          this.$emit('updateBuildQueue')
        }, 1000)
        return { width: `width: ${100}%`, str: '0h 0m 0s' }
      }
      const s = Math.floor((t / item.seconds) * 100)
      const showTime = this.$utils.remainingTime(item.seconds - t)
      return { width: `width: ${s}%`, str: showTime }
    },
    async delBuildQueue (id) {
      this.$emit('delBuildQueue', id)
    },
    timer () {
      this.buildQueueTimer = setInterval(() => {
        this.timeCount++
      }, 1000)
    },
    destroyed () {
      clearInterval(this.buildQueueTimer)
    }
  }
}
</script>

<style scoped>

.content_left_down_queue_list{
  /* background-color: rgba(10, 32, 58, 0.5); */
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
  width: 432rpx;
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
