<script lang="ts" setup>
import nodeMenu from '@mind-elixir/node-menu'
import '@mind-elixir/node-menu/dist/style.css'
import type { MindElixirData, Options } from 'mind-elixir'
import MindElixir from 'mind-elixir'

interface Props {
  diagramId: string
}

const props = defineProps<Props>()
const mindmapStore = useMindmapStore()
const notify = useNotification()

const apiResponse = ref()
const isOpen = ref(false)
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

onMounted(() => {
  fetchMap()
})

onBeforeUnmount(() => {
  mind.value = null
  apiResponse.value = null
})
</script>

<template>
  <div class="flex fixed right-0 h-auto w-16 flex-col justify-between bg-white">
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

            <li>
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

  <!-- Map rendering -->
  <div id="map" class="w-full custom-class" />
</template>

<style>
.custom-class {
  height: 700px !important;
  width: 100% !important;
}
</style>
