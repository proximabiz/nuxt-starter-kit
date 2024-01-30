<script lang="ts" setup>
const mindmapStore = useMindmapStore()
const notify = useNotification()
const diagramStore = useDiagramStore()

const maps = computed(() => mindmapStore.maps)
const headers = computed(() => [
  {
    title: 'Id',
    value: 'id',
  },
  {
    title: 'Title',
    value: 'title',
  },
  {
    title: 'Keywords',
    value: 'keywords',
  },
  {
    title: 'Created At',
    value: 'created_at',
  },
  {
    title: 'Modified At',
    value: 'modified_at',
  },
  {
    title: 'Actions',
    value: '',
  },
])

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
  try {
    const mindmapTypeDiagram = diagramStore.getMindMapTypeDiagram
    if (!mindmapTypeDiagram)
      return

    const response = await mindmapStore.create({
      title: 'default',
      diagramTypeId: mindmapTypeDiagram.id,
    })

    redirectToPath(response.diagrams[0].id)
  }
  catch (error) {
    notify.error(error)
  }
}

function redirectToPath(diagramId: string) {
  return navigateTo(`/app/maps/${diagramId}`)
}

onMounted(() => {
  fetchMaps()
})
</script>

<template>
  <div>
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
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ item.id }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ item.title }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ item.Keywords }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ item.created_at }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ item.modified_at }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <UButton
                      icon="i-heroicons-pencil-square"
                      size="sm"
                      variant="ghost"
                      @click="redirectToPath(item.id)"
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
</template>
