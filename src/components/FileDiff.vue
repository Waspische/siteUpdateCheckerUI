<template>
  <div
      v-if="currentWatch">
        <Dropdown
            v-model="selectedPrevious"
            :options="currentWatch.recordLists"
            @change="updatePrevious($event, currentWatch)"
            placeholder="Previous" >

          <template #value="slotProps">
            <span v-if="slotProps.value">{{ format_date(slotProps.value.date) }}</span>
            <span v-else>
              {{slotProps.placeholder}}
            </span>
          </template>
          <template #option="slotProps">
            <span>{{ format_date(slotProps.option.date) }}</span>
          </template>
        </Dropdown>
        <Dropdown
            v-model="selectedCurrent"
            :options="currentWatch.recordLists"
            @change="updateCurrent($event, currentWatch)"
            placeholder="Current" >

          <template #value="slotProps">
            <span v-if="slotProps.value">{{ format_date(slotProps.value.date) }}</span>
            <span v-else>
              {{slotProps.placeholder}}
            </span>
          </template>
          <template #option="slotProps">
            <span>{{ format_date(slotProps.option.date) }}</span>
          </template>
        </Dropdown>
        <Diff
            :language="getLanguage(currentWatch.watchDTO.type)"
            :prev="currentWatch.previousVersion.content"
            :current="currentWatch.currentVersion.content"
            class="p-text-left"
        />
  </div>
</template>

<script>
import moment from 'moment'
import axios from "axios";

export default {
  name: "SiteDiff",

  data () {
    return {
      currentWatchId: null,
      currentWatch: null,
      selectedPrevious: null,
      selectedCurrent: null
    }
  },
  mounted () {
    this.currentWatchId = this.$route.query.id
    this.getWatchUpdates()
  },
  methods: {
    async getWatchUpdates () {
      try {
        // http://localhost:8080/api/public/watchUpdate/60c791a27ba3cd3fc0ee8afe
        const resp = await this.axios.get('/watchUpdate/' + this.currentWatchId)
        console.log(resp.data)
        if(resp.data.watchDTO.type === "REQUEST"){
          resp.data.currentVersion.content = JSON.stringify(JSON.parse(resp.data.currentVersion.content),null,2);
          if(resp.data.previousVersion.content !== "") {
            resp.data.previousVersion.content = JSON.stringify(JSON.parse(resp.data.previousVersion.content), null, 2);
          }
        }
        this.currentWatch = resp.data
      } catch (err) {
        // console.error(err);
        return null
      }
    },
    async updatePrevious(event, update) {
      try {
        const resp = await this.axios.get('/watch-records/' + this.selectedPrevious.id)
        if(resp.data.watch.type === "REQUEST" && resp.data.content !== ""){
          update.previousVersion.content = JSON.stringify(JSON.parse(resp.data.content), null, 2);
        } else {
          update.previousVersion.content = resp.data.content
        }
      } catch (err) {
        // console.error(err);
        return null
      }
    },
    async updateCurrent(event, update) {
      try {
        const resp = await this.axios.get('/watch-records/' + this.selectedCurrent.id)
        if(resp.data.watch.type === "REQUEST" && resp.data.content !== ""){
            update.currentVersion.content = JSON.stringify(JSON.parse(resp.data.content), null, 2)
        } else {
          update.currentVersion.content = resp.data.content
        }
      } catch (err) {
        // console.error(err);
        return null
      }
    },
    getLanguage(watchType){
      let result = 'plaintext'
      switch (watchType){
        case 'PAGE':
          result = 'html'
          break
        case 'PAGE_SCRIPT':
          result = 'javascript'
          break;
        case 'REQUEST':
          result = 'json'
          break
        default:
          console.log('Watch type not found')
      }
      return result
    },
    format_date(value){
      if (value) {
        return moment(String(value)).format('HH:mm DD/MM/YY')
      }
    },
  }
}
</script>

<style scoped>

</style>
