<template>
  <div>
    <Dropdown
        v-model="selectedSite"
        :options="sites"
        @change="getSiteUpdates"
        optionLabel="name"
        placeholder="Select a site" />

    <Divider />

    <Accordion
        v-if="siteUpdates">
      <AccordionTab
          v-for="update in siteUpdates"
          :key="update.watchDTO.id"
          :header="update.watchDTO.name">

        <Dropdown
            v-model="selectedPrevious"
            :options="update.recordLists"
            @change="updatePrevious($event, update)"
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
            :options="update.recordLists"
            @change="updateCurrent($event, update)"
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
            :language="getLanguage(update.watchDTO.type)"
            :prev="update.previousVersion.content"
            :current="update.currentVersion.content"
        />
      </AccordionTab>

    </Accordion>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: "SiteDiff",

  data () {
    return {
      sites: [],
      selectedSite: null,
      selectedPrevious: null,
      selectedCurrent: null,
      siteUpdates: [],
    }
  },
  mounted () {
    this.getSites()
  },
  methods: {
    async getSites () {
      try {
        // const resp = await this.axios.get('http://localhost:8080/api/public/sites?size=1000')
        const resp = await this.axios.get('https://earth-2-biomes.herokuapp.com/api/public/sites?size=1000')
        console.log(resp.data)
        this.sites = resp.data
      } catch (err) {
        // Handle Error Here
        // console.error(err);
        return null
      }
    },
    async getSiteUpdates () {
      try {
        // const resp = await this.axios.get('http://localhost:8080/api/public/siteUpdate/' + this.selectedSite.id)
        const resp = await this.axios.get('https://earth-2-biomes.herokuapp.com/api/public/siteUpdate/' + this.selectedSite.id)
        console.log(resp.data)
        this.siteUpdates = resp.data.recordUpdateList
        // this.siteUpdates = data.recordUpdateList.map((update) => {
        // })
        console.log(this.siteUpdates)
      } catch (err) {
        // Handle Error Here
        // console.error(err);
        return null
      }
    },
    async updatePrevious(event, update) {
      console.log('updatePrevious')
      try {
        // const resp = await this.axios.get('http://localhost:8080/api/public/watch-records/' + this.selectedPrevious.id)
        const resp = await this.axios.get('https://earth-2-biomes.herokuapp.com/api/public/watch-records/' + this.selectedSite.id)
        update.previousVersion.content = resp.data.content
      } catch (err) {
        // console.error(err);
        return null
      }
    },
    async updateCurrent(event, update) {
      console.log('updateCurrent')
      try {
        // const resp = await this.axios.get('http://localhost:8080/api/public/watch-records/' + this.selectedCurrent.id)
        const resp = await this.axios.get('https://earth-2-biomes.herokuapp.com/api/public/watch-records/' + this.selectedSite.id)
        update.currentVersion.content = resp.data.content
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
