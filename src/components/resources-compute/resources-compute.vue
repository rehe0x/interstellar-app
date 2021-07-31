<template>
  <view>
    <view><text>金属：</text>{{ resources.metalStorageMax | numberToCurrency }} / {{ resources.metal | numberToCurrency }}</view>
    <view><text>晶体：</text>{{ resources.crystalStorageMax | numberToCurrency }} / {{ resources.crystal | numberToCurrency }}</view>
    <view><text>重氦：</text>{{ resources.deuteriumStorageMax | numberToCurrency }} / {{ resources.deuterium | numberToCurrency }}</view>
    <view><text>能量：</text>{{ resources.energyMax | numberToCurrency }} / {{ resources.energyUsed | numberToCurrency }}</view>
   </view>
</template>

<script>
import { getResources } from '../../api/planet'
let metalT = 0
let crystalT = 0
let deuteriumT = 0
export default {
  name: 'resourcesCompute',
  props: {
    // resourcesDate: {
    //   type: Object,
    //   required: true
    // }
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
      const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      return intPartFormat
    }
  },
  created () {
  },
  async mounted () {
    const resource = await getResources()
    this.resources = resource.result
    this.$root.$on('resourcesUpdate', async () => {
      const resource = await getResources()
      this.resources = resource.result
    })
    this.$root.$on('resourcesTimer', async (time) => {
      this.timer(time)
    })
  },
  methods: {
    timer (time) {
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
    }
  }
}
</script>

<style scoped>
view > view > text{
  color: rgb(0,205,204);
  font-size: 28rpx;
}
</style>
