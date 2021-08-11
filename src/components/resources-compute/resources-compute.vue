<template>
  <view>
    <view><text>金属：</text>{{ numberToCurrency(resources.metalStorageMax) }} / {{ numberToCurrency(resources.metal) }}</view>
    <view><text>晶体：</text>{{ numberToCurrency(resources.crystalStorageMax) }} / {{ numberToCurrency(resources.crystal) }}</view>
    <view><text>重氦：</text>{{ numberToCurrency(resources.deuteriumStorageMax) }} / {{ numberToCurrency(resources.deuterium) }}</view>
    <view><text>能量：</text>{{ numberToCurrency(resources.energyMax) }} / {{ numberToCurrency(resources.energyUsed) }}</view>
   </view>
</template>

<script>
import { computed } from 'vue'
import { getPlanetResources } from '../../api/planet'
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
  setup (props, context) {
    const numberToCurrency = computed(() => {
      return (value) => {
        if (!value) return '0'
        // 整数部分处理，增加,
        const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        return intPartFormat
      }
    })
    return { numberToCurrency }
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
  async created () {
    const resource = await getPlanetResources({ planetId: this.planetId })
    this.resources = resource.result
    this.$root.$on('resourcesUpdate', async () => {
      const resource = await getPlanetResources({ planetId: this.planetId })
      this.resources = resource.result
    })
    this.$root.$on('resourcesTimer', async (time) => {
      this.timer(time)
    })
  },
  async mounted () {
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
