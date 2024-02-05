<script lang="ts" setup>
import nodeMenu from '@mind-elixir/node-menu'
import '@mind-elixir/node-menu/dist/style.css'
import type { MindElixirData, Options } from 'mind-elixir'
import MindElixir from 'mind-elixir'
import { useFileExporter } from '@/composables/ExportJsonFile'

interface Props {
  diagramId: string
}

const props = defineProps<Props>()
const mindmapStore = useMindmapStore()
const notify = useNotification()
const diagramStore = useDiagramStore()
const { exportJSONFile } = useFileExporter()

const apiResponse = ref()
const updateApiResponse = ref()
const isOpen = ref(true)
const isVersionDrawerOpen = ref(false)
const mind = ref()
const isRequirements = ref(false)
const form = ref({
  title: '',
  details: '',
})
const items = [{
  key: 'data-driven',
  label: 'Data Driven',
}, {
  key: 'json-driven',
  label: 'From JSON ',
}]

const versionsItems = [{
  time: 'January 10, 2:29 PM',
  user: 'Neha Soni',
}, {
  time: 'January 11, 1:30 PM',
  user: 'Ipsita',
}, {
  time: 'January 12, 2:30 PM',
  user: 'Balakrishna Adasumali',
}, {
  time: 'January 13, 3:30 PM',
  user: 'Raveena Sisodiya',
}, {
  time: 'January 14, 4:30 PM',
  user: 'Supriya Potdar',
}, {
  time: 'January 15, 5:30 PM',
  user: 'Sudhakar Shenoy',
}, {
  time: 'January 16, 6:30 PM',
  user: 'Pushpak Hazare',
}]

async function fetchMap() {
  try {
    apiResponse.value = await mindmapStore.get({
      diagramId: props.diagramId,
    })
    console.log(apiResponse.value[0])
    if (apiResponse.value[0].response.length) {
      init()
      form.value.title = apiResponse.value[0].title
      form.value.details = apiResponse.value[0].details
    }
  }
  catch (error) {
    notify.error(error)
  }
}

function init() {
  const data: MindElixirData = {
    linkData: {},
    nodeData: apiResponse.value[0].response[0].nodeData,
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
    const mindmapTypeDiagram = diagramStore.getMindMapTypeDiagram
    if (!mindmapTypeDiagram)
      return

    updateApiResponse.value = await mindmapStore.update({
      title: form.value.title,
      diagramTypeId: mindmapTypeDiagram.id,
    })
    console.log(updateApiResponse.value)
    // if (apiResponse.value[0].response.length) {
    //   init()
    //   form.value.title = apiResponse.value[0].title
    //   form.value.details = apiResponse.value[0].details
    // }
  }
  catch (error) {
    notify.error(error)
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

onMounted(() => {
  fetchMap()
})

onBeforeUnmount(() => {
  mind.value = null
  apiResponse.value = null
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

            <li @click="updateMap()">
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

            <li @click="isVersionDrawerOpen = true">
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
                <textarea class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
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
                <textarea class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
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
        Mindmap Versions
      </h1>
      <ul class="mt-4 space-y-2 px-2">
        <li v-for="(item, index) in versionsItems" :key="index">
          <a href="#" class="block h-full rounded-lg border border-gray-700 p-4 hover:border-gray-300">
            <div class="grid grid-cols-2">
              <bold class="font-medium text-gray-900">{{ item.time }}</bold>
              <p class="mt-1 text-xs font-medium text-gray-500">
                {{ item.user }}
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
      <div id="map" class="h-[500px] overflow-y-auto z-10" />
    </div>
  </UContainer>
</template>
