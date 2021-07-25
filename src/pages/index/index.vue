<template>
	<view class="content">
			<view class="status_bar">
        <view class="list">
          <u-icon name="list" color="rgb(181 241 253)" size="62" @click="drawerShow = true"></u-icon>
        </view>
      </view>
			<view class="flex-row">
				<view class="flex-row-item1">
					<view class="flex-column1">
						<view class="flex-column1-item1">
							<view><text>金属：</text>{{ resources.metal }} / {{ resources.metalStorageMax }}</view>
							<view><text>晶体：</text>{{ resources.crystal }} / {{ resources.crystalStorageMax }}</view>
							<view><text>重氦：</text>{{ resources.deuterium }} / {{ resources.deuteriumStorageMax }}</view>
							<view><text>能量：</text>{{ resources.energyUsed }} / {{ resources.energyMax }}</view>
						</view>
						<view class="flex-column1-item2">
							<scroll-view scroll-y="true" class="scroll-Y">
                <view class="flex-item"  v-for="(item, buildCode) in buildings" :key="buildCode">
                  <view class="flex-item1">
                    <view class="img"><image src="../../static/24.gif"/></view>
                    <view class="text">
                      <view class="name">{{ item.name }} {{ item.level }}</view>
                      <view class="small">{{ item.buildTimeShow }}</view>
                    </view>
                    <view class="button">
                      <u-button  ref="bload"  type="primary" size="mini" :ripple="true" :loading="(buttonLoading.indexOf(buildCode)) === -1 ? false : true" ripple-bg-color="#909399" @tap="addBuildingQueue({buildCode})">升级</u-button>
                    </view>
                  </view>
                  <view class="flex-item2">
                    金属：{{ item.metal }} 晶体：{{ item.crystal }} 重氦：{{ item.deuterium }}
                  </view>
                </view>
              </scroll-view>
						</view>
					</view>
				</view>
				<view class="flex-row-item2">
					<view class="flex-column2">
						<view class="flex-column2-item1">C</view>
						<view class="flex-column2-item2">
              <view class="item">控制台</view>
              <view class="item">建筑</view>
              <view class="item">研究</view>
              <view class="item">船厂</view>
              <view class="item">防御</view>
            </view>
					</view>
				</view>
			</view>
      <!-- 顶部提示 -->
      <u-top-tips ref="uTips" :navbar-height="0"></u-top-tips>
      <!-- 抽屉菜单 -->
      <u-popup v-model="drawerShow" mode="right" :custom-style="customStyle" :mask-custom-style="maskCustomStyle" border-radius="0" width="250rpx" height="100%">
				<view class="drawer-list">
					<u-button @click="drawerShow = false;">确定</u-button>
				</view>
      </u-popup>
	</view>
</template>

<script>
import { getResources, getBuilding, getResearch, addBuildingQueue, addResearchQueue } from '../../api/planet'
export default {
  data () {
    return {
      buttonLoading: [],
      drawerShow: false,
      maskCustomStyle: {
        background: 'rgba(32, 58, 87, 0.5)'
      },
      customStyle: {
        // background: 'rgba(32, 58, 87, 0.8)'
      },
      headStyle: {
        color: 'chartreuse'
      },
      resources: {},
      buildings: [],
    }
  },
  async mounted () {
    const resource = await getResources()
    this.resources = resource.result
    const building = await getBuilding()
    this.buildings = building.result

    let metalT = 0
    let crystalT = 0
    let deuteriumT = 0
    this.resourceTimer = setInterval(() => {
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
    }, 1000)
  },
  methods: {
    async addBuildingQueue (row) {
      this.buttonLoading.push(row.buildCode)
      const rest = await addBuildingQueue({
        buildCode: row.buildCode
      })
      await this.$utils.wait(1000)
      this.buttonLoading.splice(this.buttonLoading.indexOf(row.buildCode), 1)
      this.$refs.uTips.show({
				title: 'success',
				type: 'success',
				duration: '2300'
			})
    },
    destroyed () {
      clearInterval(this.resourceTimer)
    }
  }
}
</script>

<style>
@import 'index.css'
</style>
