<template>
	<view class="wrapper">
		<view class="status_bar">
		</view>
		<view class="content">
			<table class="content_table" border="1">
				<tr>
					<th width="5%">#</th>
					<th width="5%">星球</th>
					<th width="15%">名称</th>
					<th width="5%">月球</th>
					<th width="5%">废墟</th>
					<th width="15%">玩家</th>
					<th width="15%">联盟</th>
					<th width="5%">操作</th>
					<!-- <th width="5%">###</th>
					<th width="7%">星球</th>
					<th>名称</th>
					<th width="5%">月球</th>
					<th width="5%">废墟</th>
					<th>玩家</th>
					<th>联盟</th>
					<th width="5%">操作</th> -->
				</tr>
				<template v-for="(item, index) in 15">
					<tr :key="index">
						<td>{{ item }}</td>
						<td><view class="icon"></view></td>
						<td>士大夫士大士大夫士大</td>
						<td><view class="icon"></view></td>
						<td></td>
						<td>士大夫士大</td>
						<td>士大夫士大</td>
						<td>攻击</td>
					</tr>
				</template>
			</table>
			<view @click="toIndex">返回</view>
		</view>
	</view>
</template>

<script>
export default {
	data () {
		return{

		}
	},
	methods: {
		toIndex () {
			console.log('back')
			uni.navigateBack({
				delta: 1,
				animationType: 'fade-out',
				animationDuration: 500
      });
		}
	}
}
</script>

<style>
@import 'staratlas.css'
</style>