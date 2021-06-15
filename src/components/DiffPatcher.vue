<template>
  <div>
    <div
      v-if="isFile">
      <FileDiff></FileDiff>
    </div>
    <div v-else>
      <SiteDiff></SiteDiff>
    </div>
  </div>
</template>

<script>
import SiteDiff from '/src/components/SiteDiff.vue'
import FileDiff from '/src/components/FileDiff.vue'
export default {
  name: "DiffPatcher",
  components: {SiteDiff,FileDiff},
 // word play like Dis-Patcher,
  data () {
    return {
      isFile: false
    }
  },
  mounted() {
    if(this.$route.query.id !== undefined){
      this.isFile = true
    }
  }
}
</script>

<style scoped>

</style>
