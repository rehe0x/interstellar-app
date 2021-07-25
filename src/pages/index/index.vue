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
                              				<!-- <u-line-progress :striped="true" :percent="70" :striped-active="true"></u-line-progress> -->

              <!-- <u-dropdown ref="uDropdown">

			<u-dropdown-item title="属性" :class="sss">
				<view class="slot-content" :height="100">
				<u-line-progress :striped="true" :percent="70" :striped-active="true"></u-line-progress>
<u-line-progress :striped="true" :percent="70" :striped-active="true"></u-line-progress>
				</view>
			</u-dropdown-item>
		</u-dropdown> -->

							<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
                @scroll="scroll">
                <view class="flex-item"  v-for="(item, buildCode) in buildings" :key="buildCode">
                  <view class="flex-item1">
                    <view class="img"><image src="../../static/24.gif"/></view>
                    <view class="text">
                      <view class="name">{{ item.name }} {{ item.level }}</view>
                      <view class="small">{{ item.buildTimeShow }}</view>
                    </view>
                    <view class="button">
                      <u-button  ref="bload"  type="primary" size="mini" :ripple="true" :loading="(buttonLoad.indexOf(buildCode)) === -1 ? false : true" ripple-bg-color="#909399" @tap="addBuildingQueue({buildCode})">升级</u-button>
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
						<view class="flex-column2-item1">
<u-icon name="list" color="rgb(181 241 253)" size="62" @click="show = true"></u-icon>

            </view>
						<view class="flex-column2-item2">D</view>
					</view>
				</view>
			</view>
     <u-top-tips ref="uTips" :navbar-height="0"></u-top-tips>
     <u-popup v-model="show" mode="right" :custom-style="cStyle" :mask-custom-style="mStyle" border-radius="0" width="250rpx" height="100%">
        <view class="content1">
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view>
						<view v-for="index in 20" :key="index">
							第{{index}}个Item
						</view>
					</view>
				</scroll-view>
				<view class="confrim-btn">
					<u-button @click="show = false;">确定</u-button>
				</view>
			</view>
      </u-popup>
	</view>
</template>

<script>
import { getResources, getBuilding, getResearch, addBuildingQueue, addResearchQueue } from '../../api/planet'
export default {
  data () {
    return {
      show: false,
      mStyle: {
        background: 'rgba(32, 58, 87, 0.8)'
      },
      cStyle: {
          background: 'rgba(32, 58, 87, 0.8)'
        // background: '#2a4e6d',
      },
      headStyle: {
        color: 'chartreuse'
      },
      itemStyle: {
        // border: '1px solid rgb(230, 230, 230)',
        // 'margin-top': '20px',
        // padding: '0 8rpx'
      },
      zd: {
        head: '队列：金属矿 29 23 42',
        body: '只要我们正确择取一个合适的参照物乃至稍降一格去看待他人，值得赏识的东西便会扑面而来',
        open: true,
        disabled: true
      },
      scrollTop: 0,
      old: {
        scrollTop: 0
      },
      resources: {},
      buildings: [],
      count: 0,
      buttonLoad: []
    }
  },
  onLoad () {

  },
  async mounted () {
    const resource = await getResources()
    console.log(resource)
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
    showL(){

    },
    async addBuildingQueue (row) {
      this.buttonLoad.push(row.buildCode)
      console.log(this.buttonLoad)
      this.$refs.bload.loading = true
      const rest = await addBuildingQueue({
        buildCode: row.buildCode
      })
      const ff = await this.w(1000)
      console.log(ff)
      this.buttonLoad.splice(this.buttonLoad.indexOf(row.buildCode), 1)
      this.$refs.uTips.show({
				title: 'success',
				type: 'success',
				duration: '2300'
			})
    },
    w (time) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('ok')
        }, time)
      })
    },
    destroyed () {
      clearInterval(this.resourceTimer)
    }
  }
}
</script>

<style>
@import 'index.css';
.u-drawer-right {
  background-color: rgba(32, 58, 87, 0.8);
}
</style>
