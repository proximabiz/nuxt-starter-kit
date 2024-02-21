<script lang="ts" setup>
import dayjs from 'dayjs'

const mindmapStore = useMindmapStore()
const notify = useNotification()
const diagramStore = useDiagramStore()
const isLoading = ref(false)
const isDelete = ref(false)
const apiResponse = ref()
const deleteDiagramId = ref('')

const maps = computed(() => mindmapStore.maps)
const headers = computed(() => [
  {
    title: 'Title',
    value: 'title',
  },
  {
    title: 'Keywords',
    value: 'keywords',
  },
  {
    title: 'Last Modified On',
    value: 'modified_at',
  },
  {
    title: 'Actions',
    value: '',
  },
])

const globalStore = useGlobalStore()
globalStore.pageHeading.title = 'My Mindmaps'

async function fetchDiagramTypes() {
  try {
    const diagramStore = useDiagramStore()
    await diagramStore.list()
  }
  catch (error) {
    notify.error(error)
  }
}

async function fetchMaps() {
  try {
    await mindmapStore.list()
    await fetchDiagramTypes()
  }
  catch (error) {
    notify.error(error)
  }
}

async function createMap() {
  isLoading.value = true
  try {
    const mindmapTypeDiagram = diagramStore.getMindMapTypeDiagram
    if (!mindmapTypeDiagram)
      return

    const response = await mindmapStore.create({
      title: 'default',
      diagramTypeId: mindmapTypeDiagram.id,
    })

    isLoading.value = false
    redirectToPath(response?.diagram[0].id)
  }
  catch (error) {
    isLoading.value = false
    notify.error(error)
  }
}

function redirectToPath(diagramId: string) {
  return navigateTo(`/app/maps/${diagramId}`)
}

async function deleteMindMap(diagramId: string) {
  console.log(diagramId)
  try {
    isDelete.value = true
    deleteDiagramId.value = diagramId
  }
  catch (error) {
    isDelete.value = true
    notify.error(error)
  }
}

async function confirmedDeleteDiagram() {
  try {
    apiResponse.value = await mindmapStore.delete({
      diagramId: deleteDiagramId.value,
    })
    console.log(apiResponse.value)
    isDelete.value = false
    notify.success('Diagram deleted successfully!')
    fetchMaps()
  }
  catch (error) {
    notify.error(error)
  }
}

onMounted(() => {
  fetchMaps()
})
</script>

<template>
  <div class="pl-10">
    <div class="flex justify-end my-4">
      <UButton label="Create New" icon="i-heroicons-plus" @click="createMap()" />
    </div>
    <div class="overflow-x-auto">
      <div class="sm:-mx-6 lg:-mx-8">
        <div class="inline-block w-full py-2 sm:px-6 lg:px-8">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm font-light">
              <thead class="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th v-for="(header, index) in headers" :key="index" scope="col" class="px-6 py-4">
                    {{ header.title }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in maps" :key="index" class="border-b dark:border-neutral-500">
                  <!-- <td class="whitespace-nowrap px-6 py-4">
                    {{ item.id }}
                  </td> -->
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ item.title }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ item.Keywords || 'No keywords specified' }}
                  </td>
                  <!-- <td class="whitespace-nowrap px-6 py-4">
                    {{ item.created_at }}
                  </td> -->
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ dayjs(item.created_at).format("dddd, MMMM D YYYY hh:mm:ss") }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <UButton
                      icon="i-heroicons-pencil-square"
                      size="sm"
                      variant="ghost"
                      @click="redirectToPath(item.id)"
                    />
                    <UButton
                      icon="i-heroicons-trash"
                      size="sm"
                      variant="ghost"
                      @click="deleteMindMap(item.id)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <UModal v-model="isLoading">
    <UProgress animation="carousel" />
    <UCard>
      Creating your <span class="font-bold">Default</span> Mindmap...
    </UCard>
  </UModal>
  <UModal v-model="isDelete">
    <UCard>
      Are you sure you want to delete this mindmap?
      <div class="flex justify-end my-4">
        <UButton label="Cancel" class="mr-2" icon="i-heroicons-x-mark" @click="isDelete = false" />
        <UButton label="Delete" icon="i-heroicons-archive-box-x-mark" @click="confirmedDeleteDiagram()" />
      </div>
    </UCard>
  </UModal>
</template>
