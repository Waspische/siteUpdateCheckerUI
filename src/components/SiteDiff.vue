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
import axios from "axios";

export default {
  name: "SiteDiff",

  data () {
    return {
      sites: [],
      selectedSite: null,
      selectedPrevious: null,
      selectedCurrent: null,
      siteUpdates: []
    }
  },
  mounted () {
    this.getSites()
  },
  methods: {
    async getSites () {
      try {
        const resp = await this.axios.get('/sites?size=1000')
        this.sites = resp.data
      } catch (err) {
        // console.error(err);
        return null
      }
    },
    async getSiteUpdates () {
      try {
        const resp = await this.axios.get('/siteUpdate/' + this.selectedSite.id)
        this.siteUpdates = resp.data.recordUpdateList
            .sort((a, b) => (a.watchDTO.name > b.watchDTO.name) ? 1 : -1)

      } catch (err) {
        // console.error(err);
        return null
      }
    },
    async updatePrevious(event, update) {
      try {
        const resp = await this.axios.get('/watch-records/' + this.selectedPrevious.id)
        update.previousVersion.content = resp.data.content
      } catch (err) {
        // console.error(err);
        return null
      }
    },
    async updateCurrent(event, update) {
      try {
        const resp = await this.axios.get('/watch-records/' + this.selectedCurrent.id)
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
