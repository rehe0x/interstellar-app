<template>
  <view class="resources">
    <view class="item">
      <view class="name">金属</view>
      <view>{{ resources.metal | numberToCurrency }}</view>
      <view>{{ resources.metalStorageMax | numberToCurrency }}</view>
    </view>
    <view class="divider_vertical"></view>
    <view class="item">
      <view class="name">晶体</view>
      <view>{{ resources.crystal | numberToCurrency }}</view>
      <view>{{ resources.crystalStorageMax | numberToCurrency }}</view>
    </view>
    <view class="divider_vertical"></view>
    <view class="item">
      <view class="name">重氦</view>
      <view>{{ resources.deuterium | numberToCurrency }}</view>
      <view>{{ resources.deuteriumStorageMax | numberToCurrency }}</view>
    </view>
    <!-- <view><view> {{ resources.energyUsed | numberToCurrency }} </view><view> {{ resources.energyMax | numberToCurrency }} </view><view>能量</view></view> -->
  </view>
</template>

<script>
import { getPlanetResources } from '../../api/main'
let metalT = 0
let crystalT = 0
let deuteriumT = 0
export default {
  name: 'resourcesCompute',
  props: {
    planetId: {
      required: true
    }
  },
  data () {
    return {
      resources: {}
    }
  },
  filters: {
    numberToCurrency (value) {
      if (!value) return '0'
      // 整数部分处理，增加,
      const intPartFormat = value
        .toString()
        .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      return intPartFormat
    }
  },
  async created () {
    this.$root.$on('resourcesUpdate', async () => {
      const resource = await getPlanetResources({ planetId: this.planetId })
      this.resources = resource.result
    })
    this.$root.$on('resourcesTimer', async (time) => {
      this.timer(time)
    })
    if (this.planetId) {
      const resource = await getPlanetResources({ planetId: this.planetId })
      this.resources = resource.result
    }
  },
  async mounted () {},
  methods: {
    timer (time) {
      if (this.resources.metal < this.resources.metalStorageMax) {
        if (this.resources.metalTime >= 1) {
          this.resources.metal = Math.floor(
            +this.resources.metal + +this.resources.metalTime
          )
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
          this.resources.crystal = Math.floor(
            +this.resources.crystal + +this.resources.crystalTime
          )
        } else {
          crystalT += +this.resources.crystalTime
          if (crystalT >= 1) {
            this.resources.crystal = Math.floor(
              +this.resources.crystal + +crystalT
            )
            crystalT = crystalT % 1
          }
        }
      }
      if (this.resources.deuterium < this.resources.deuteriumStorageMax) {
        if (this.resources.deuteriumTime >= 1) {
          this.resources.deuterium = Math.floor(
            +this.resources.deuterium + +this.resources.deuteriumTime
          )
        } else {
          deuteriumT += +this.resources.deuteriumTime
          if (deuteriumT >= 1) {
            this.resources.deuterium = Math.floor(
              +this.resources.deuterium + +deuteriumT
            )
            deuteriumT = 0
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.resources {
  height: 40%;
  display: flex;
  justify-content: space-around;
}

.resources .item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.resources .name {
  color: rgb(0, 205, 204);
  font-size: 28rpx;
}

.divider_vertical {
  width: 1px;
  height: 100%;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0) 0%,
    rgba(35, 198, 200, 0.8) 5%,
    rgba(35, 198, 200, 0.8) 10%,
    rgba(35, 198, 200, 0.8) 20%,
    rgba(35, 198, 200, 0.8) 30%,
    rgba(35, 198, 200, 0.8) 40%,
    rgba(35, 198, 200, 0.8) 50%,
    rgba(35, 198, 200, 0.8) 60%,
    rgba(35, 198, 200, 0.8) 70%,
    rgba(35, 198, 200, 0.8) 80%,
    rgba(35, 198, 200, 0.8) 90%,
    rgba(35, 198, 200, 0.8) 95%,
    rgba(0, 0, 0, 0) 100%
  );
}
</style>
