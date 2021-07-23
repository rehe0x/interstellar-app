<template>
	<view class="content">
			<view class="status_bar">
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
							 <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
                @scroll="scroll">
									<view class="flex-item" v-for="(item, buildCode) in buildings" :key="buildCode">
								<view class="flex-item1">
									<view class="img"><image src="../../static/logo.png"/></view>
									<view class="text">
										<view>{{ item.name }} {{ item.level }}</view>
										<view class="small">必要物质 暗物质粒子</view>
									</view>
									<view class="button">
										<button type="primary" plain="true" size="mini" @tap="addBuildingQueue({buildCode})">升级</button>
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
						<view class="flex-column2-item2">D</view>
					</view>
				</view>
			</view>
	</view>
</template>

<script>
import { getResources, getBuilding, getResearch, addBuildingQueue, addResearchQueue } from '../../api/planet'
export default {
  data () {
    return {
      scrollTop: 0,
      old: {
        scrollTop: 0
      },
      resources: {},
      buildings: []
    }
  },
  async mounted () {
    const resource = await getResources()
    console.log(resource)
    this.resources = resource.result
    const building = await getBuilding()
    this.buildings = building.result
  },
  methods: {
    upper: function (e) {
      // console.log(e)
    },
    lower: function (e) {
      // console.log(e)
    },
    scroll: function (e) {
      // console.log(e)
      this.old.scrollTop = e.detail.scrollTop
    },
    addBuildingQueue: async (row) => {
      const rest = await addBuildingQueue({
        buildCode: row.buildCode
      })
      rest && uni.showToast({
        title: '成功',
        icon: 'loading',
        duration: 1500
      })
    }
  }
}
</script>

<style>
@import 'index.css';
</style>
