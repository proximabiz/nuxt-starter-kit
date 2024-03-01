<script lang="ts" setup>
import nodeMenu from '@mind-elixir/node-menu'
import '@mind-elixir/node-menu/dist/style.css'
import dayjs from 'dayjs'
import type { MindElixirData, Options } from 'mind-elixir'
import MindElixir from 'mind-elixir'
import { useFileExporter } from '@/composables/ExportJsonFile'

const props = defineProps<Props>()

interface Props {
  diagramId: string
}

const diagramStore = useDiagramStore()
const notify = useNotification()
const globalStore = useGlobalStore()
const { exportJSONFile } = useFileExporter()

const apiResponse = ref()
const updateApiResponse = ref()
const saveApiResponse = ref()
const isOpen = ref(true)
const isVersionDrawerOpen = ref(false)
const mind = ref()
const isRequirements = ref(false)
const isSavePopupOpen = ref(false)
const isSave = ref(false)
const toRoute = ref()
const form = ref({
  title: '',
  details: '',
  json: '',
})
const items = [{
  key: 'data-driven',
  label: 'Data Driven',
}, {
  key: 'json-driven',
  label: 'From JSON ',
}]

const versionsItems = ref()
async function fetchDiagramVersions() {
  try {
    isVersionDrawerOpen.value = true
    versionsItems.value = await diagramStore.getVersionList({
      diagramId: props.diagramId,
    })
  }
  catch (error) {
    notify.error(error)
  }
}

async function fetchMap() {
  try {
    apiResponse.value = await diagramStore.get({
      diagramId: props.diagramId,
    })

    if (apiResponse.value[0].response.nodeData || apiResponse.value[0].response.chartDetails) {
      init()
      if (apiResponse.value[0].response.nodeData)
        form.value.title = apiResponse.value[0].response.nodeData.topic
      else
        form.value.title = apiResponse.value[0].response.chartDetails[0].nodeData.topic
      // form.value.details = apiResponse.value[0].details

      globalStore.pageHeading.title = form.value.title
    }
  }
  catch (error) {
    notify.error(error)
  }
}

function init() {
  const data: MindElixirData = {
    linkData: {},
    nodeData: apiResponse.value[0].response.nodeData || apiResponse.value[0].response.chartDetails[0].nodeData,
  }
  const options: Options = {
    el: '#map',
    direction: 2,
    locale: 'en',
    contextMenuOption: {
      focus: true,
      link: true,
      extend: [],
    },
  }

  mind.value = new MindElixir(options)
  mind.value.install(nodeMenu)
  mind.value.init(data)
}

function init1() {
  const data: MindElixirData = {
    linkData: {},
    nodeData: updateApiResponse.value.response.chartDetails[0].nodeData,
  }
  const options: Options = {
    el: '#map',
    direction: 2,
    locale: 'en',
    contextMenuOption: {
      focus: true,
      link: true,
      extend: [],
    },
  }

  mind.value = new MindElixir(options)
  mind.value.install(nodeMenu)
  mind.value.init(data)
}

function init2() {
  const data: MindElixirData = {
    linkData: {},
    nodeData: updateApiResponse.value.nodeData,
  }
  const options: Options = {
    el: '#map',
    direction: 2,
    locale: 'en',
    contextMenuOption: {
      focus: true,
      link: true,
      extend: [],
    },
  }

  mind.value = new MindElixir(options)
  mind.value.install(nodeMenu)
  mind.value.init(data)
}

function init3() {
  const data: MindElixirData = {
    linkData: {},
    nodeData: updateApiResponse.value[0].nodeData,
  }
  const options: Options = {
    el: '#map',
    direction: 2,
    locale: 'en',
    contextMenuOption: {
      focus: true,
      link: true,
      extend: [],
    },
  }

  mind.value = new MindElixir(options)
  mind.value.install(nodeMenu)
  mind.value.init(data)
}

async function updateMap() {
  try {
    // Call update API here
    // const mindmapTypeDiagram = diagramTypeStore.getMindMapTypeDiagram
    // if (!mindmapTypeDiagram)
    //   return

    updateApiResponse.value = await diagramStore.update({
      diagramId: props.diagramId,
      title: form.value.title,
      isDetailed: true,
      details: form.value.details,
      // diagramTypeId: mindmapTypeDiagram.id,
    })

    isOpen.value = false
    if (updateApiResponse.value.response.chartDetails[0].nodeData) {
      init1()
      form.value.title = updateApiResponse.value.response.chartDetails[0].nodeData.topic as string
      // form.value.details = updateApiResponse.value.response.chartDetails[0].nodeData
    }

    notify.success('Mindmap generated!')
  }
  catch (error) {
    notify.error(error)
  }
}

async function saveMap(isRedirect: boolean) {
  try {
    saveApiResponse.value = await diagramStore.save({
      diagramId: props.diagramId,
      existingOpenAIResponse: toRaw(mind.value.getDataString()),
      isDiagramChanged: true,
    })
    notify.success('Mindmap saved!')
    if (isRedirect) {
      isSavePopupOpen.value = false
      isSave.value = true
    }
  }
  catch (error) {
    notify.error(error)
    if (isRedirect) {
      isSavePopupOpen.value = false
      isSave.value = true
    }
  }
  finally {
    if (isRedirect) {
      isSavePopupOpen.value = false
      isSave.value = true
      navigateTo(toRoute.value)
    }
  }
}

async function downloadMap() {
  const blob = await mind.value.exportPng() // Get a Blob!
  if (!blob)
    return
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'filename.png'
  a.click()
  URL.revokeObjectURL(url)
}

async function exportJSON() {
  const data = mind.value.getDataString() // stringify object
  exportJSONFile(toRaw(data), `${form.value.title}_MINDMAP.json`)
}

// async function compareJSON(obj1, obj2) {

//       for(const i in obj2) {
//         if(!obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
//           if(!Array.isArray(obj2[i]) || !(JSON.stringify(obj2[i]) == JSON.stringify(obj1[i]))){
//           ret[i] = obj2[i];
//           }
//         }
//       }
//       return ret;
//     };

function loadJSON(jsonData: JSON) {
  isVersionDrawerOpen.value = false
  updateApiResponse.value = jsonData

  if (updateApiResponse.value.nodeData) {
    init2()
    form.value.title = updateApiResponse.value.nodeData.topic
  }
  else {
    init3()
    form.value.title = updateApiResponse.value[0].nodeData.topic
  }
  // form.value.title = updateApiResponse.value[0].nodeData.topic as string
  // form.value.details = updateApiResponse.value.response.chartDetails[0].nodeData
  notify.success('Selected mindmap loaded')
}

function createMapFromJSON() {
  updateApiResponse.value = JSON.parse(form.value.json)
  if (updateApiResponse.value.nodeData) {
    init2()
    form.value.title = updateApiResponse.value.topic

    isOpen.value = false
    notify.success('Mindmap created from JSON')
  }
}

onMounted(() => {
  fetchMap()
})

onBeforeUnmount(() => {
  mind.value = null
  apiResponse.value = null
})

function closePopup() {
  isSavePopupOpen.value = true
  isSave.value = true
  navigateTo(toRoute.value)
}

onBeforeRouteLeave((to) => {
  isSavePopupOpen.value = true
  toRoute.value = to

  if (!isSave.value)
    return false
})
</script>

<template>
  <div class="flex fixed right-0 w-12 flex-col justify-between bg-white z-20">
    <div>
      <div>
        <div class="px-2">
          <ul class="space-y-1 border-gray-100 pt-4">
            <li @click="isOpen = true">
              <a
                class="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                <UIcon name="i-heroicons-bars-4" class="size-5" />

                <span
                  class="absolute end-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white invisible group-hover:visible"
                >
                  Edit
                </span>
              </a>
            </li>

            <li @click="saveMap(false)">
              <a
                class="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                <UIcon name="i-heroicons-bookmark" class="size-5" />

                <span
                  class="absolute end-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white invisible group-hover:visible"
                >
                  Save Data
                </span>
              </a>
            </li>
            <li @click="fetchDiagramVersions()">
              <a
                class="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                <UIcon name="i-heroicons-rectangle-stack" class="size-5" />

                <span
                  class="absolute end-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white invisible group-hover:visible"
                >
                  Diagram Versions
                </span>
              </a>
            </li>

            <li @click="downloadMap()">
              <a
                class="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                <UIcon name="i-heroicons-arrow-down-tray" class="size-5" />

                <span
                  class="absolute end-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white invisible group-hover:visible"
                >
                  Download Image
                </span>
              </a>
            </li>

            <li @click="exportJSON()">
              <a
                class="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                <UIcon name="i-heroicons-document-chart-bar" class="size-5" />

                <span
                  class="absolute end-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white invisible group-hover:visible"
                >
                  Export JSON
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Navigation drawer -->
  <USlideover v-model="isOpen">
    <div class="">
      <h1 id="home" class="text-2xl mb-4 font-extrabold text-center mt-6">
        Create Mindmap With AI Magic
      </h1>
      <UTabs :items="items" class="w-full px-6 py-6">
        <template #item="{ item }">
          <!-- Data driven tab -->
          <div v-if="item.key === 'data-driven'">
            <form class="max-w-sm mx-auto px-4 py-6">
              <div class="mb-5">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">I would like to create a mindmap on</label>
                <input v-model="form.title" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <div class="text-gray-500 text-xs mt-3">
                  Here are some keywords in form of examples-
                  <ul class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                    <li>Software Development Life Cycle (SDLC)</li>
                    <li>Blockchain Technology</li>
                  </ul>
                </div>
              </div>
              <div class="flex items-start mb-5">
                <div class="flex items-center h-5">
                  <input id="remember" v-model="isRequirements" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required>
                </div>
                <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I have more details</label>
              </div>
              <div v-if="isRequirements" class="mb-5">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Explain your idea in everyday terms</label>
                <textarea v-model="form.details" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                <div class="text-gray-500 text-xs mt-3">
                  For example- I want to visualize the key concepts of blockchain. Start with a central node labeled 'Blockchain Technology' and branch out to 'Decentralization,' 'Immutable Ledger,' and 'Cryptographic Security.
                </div>
              </div>
              <UButton label="Submit" class="px-5 py-2.5 text-center " @click="updateMap()" />
            </form>
          </div>
          <!-- Json Tab -->
          <div v-else>
            <form class="max-w-sm mx-auto px-4 py-6">
              <div class="mb-5">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter your JSON Data</label>
                <textarea v-model="form.json" size="xl" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                <UButton label="Submit" class="mt-5 px-5 py-2.5 text-center" @click="createMapFromJSON()" />
              </div>
            </form>
          </div>
        </template>
      </UTabs>
    </div>
  </USlideover>

  <!-- versions drawer -->
  <USlideover v-model="isVersionDrawerOpen" class="">
    <div class="overflow-auto">
      <h1 id="home" class="text-2xl mb-4 font-extrabold text-center mt-6">
        Version History
      </h1>
      <ul class="mt-4 space-y-2 px-2">
        <li v-for="(item, index) in versionsItems" :key="index">
          <a href="#" class="block h-full rounded-lg border border-gray-700 p-4 hover:border-gray-300" @click="loadJSON(item.response)">
            <div class="grid grid-cols-2">
              <p class="font-medium text-gray-900">{{ dayjs(item.updated_at).format("dddd, MMMM D YYYY hh:mm:ss") }}</p>
              <p class="mt-1 text-xs font-medium text-gray-500">
                Modified By: {{ item.name }}
              </p>
            </div>

          </a>
        </li>
      </ul>
    </div>
  </USlideover>
  -
  <!-- Map rendering -->
  <!-- <div id="map" class="" /> -->
  <UContainer>
    <div class="y-10 ml-5">
      <div id="map" class="h-[700px] overflow-y-auto z-10" />
    </div>
  </UContainer>
  <UModal v-model="isSavePopupOpen">
    <UCard>
      Changes are made to Mindmap. Save Changes?
      <div class="flex justify-end my-4">
        <UButton label="Disacrd Changes" class="mr-2" icon="i-heroicons-backspace" @click="closePopup()" />
        <UButton label="Save Changes" icon="i-heroicons-bookmark" @click="saveMap(true)" />
      </div>
    </UCard>
  </UModal>
</template>
