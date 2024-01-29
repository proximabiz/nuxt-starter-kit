<script lang="ts" setup>
import MindElixir from 'mind-elixir'
import nodeMenu from '@mind-elixir/node-menu'
import '@mind-elixir/node-menu/dist/style.css'
import type { MindElixirData, Options } from 'mind-elixir'

interface Props {
  diagramId: string
}

const props = defineProps<Props>()
const mindmapStore = useMindmapStore()

const apiResponse = ref()
const mind = ref()

async function fetchMap() {
  apiResponse.value = await mindmapStore.get({
    diagramId: props.diagramId,
  })

  init()
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

onMounted(() => {
  fetchMap()
})

onBeforeUnmount(() => {
  mind.value = null
  apiResponse.value = null
})
</script>

<template>
  <div id="map" class="w-full custom-class" />
</template>

<style>
.custom-class {
  height: 700px !important;
  width: 100% !important;
}
</style>
