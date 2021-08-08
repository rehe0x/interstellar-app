<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "./common/common.css";
</style>

<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
    uni.$emit('onShow')
  },
  onHide: function () {
    console.log('App Hide')
    uni.$emit('onHide')
  }
}
</script>