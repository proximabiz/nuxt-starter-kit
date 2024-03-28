<script lang="ts" setup>
import dayjs from 'dayjs'

const diagramStore = useDiagramStore()
const notify = useNotification()
const diagramTypeStore = useDiagramTypeStore()
const isLoading = ref(false)
const isDelete = ref(false)
const apiResponse = ref()
const deleteDiagramId = ref('')

const diagramsList = computed(() => diagramStore.diagramsList)
const headers = computed(() => [
  {
    title: 'Title',
    value: 'title',
  },
  // {
  //   title: 'Keywords',
  //   value: 'keywords',
  // },
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
globalStore.pageHeading.title = 'My Diagrams'

async function fetchDiagramTypes() {
  try {
    const diagramTypeStore = useDiagramTypeStore()
    await diagramTypeStore.list()
  }
  catch (error) {
    notify.error(error)
  }
}

async function fetchDiagrams() {
  try {
    await diagramStore.list()
    await fetchDiagramTypes()
  }
  catch (error) {
    notify.error(error)
  }
}

async function createDiagram() {
  isLoading.value = true
  try {
    // Right now we have only one type of diagram - mindmap
    const diagramType = diagramTypeStore.getMindMapTypeDiagram
    if (!diagramType)
      return

    const response = await diagramStore.create({
      title: 'default',
      diagramTypeId: diagramType.id,
    })

    isLoading.value = false

    /* @ts-expect-error need to be fixed */
    redirectToPath(response?.diagram[0].id)
  }
  catch (error) {
    isLoading.value = false
    notify.error(error)
  }
}

function redirectToPath(diagramId: string) {
  return navigateTo(`/app/diagram/${diagramId}`)
}

async function deleteDiagram(diagramId: string) {
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
    apiResponse.value = await diagramStore.delete({
      diagramId: deleteDiagramId.value,
    })
    isDelete.value = false
    notify.success('Diagram deleted successfully!')
    fetchDiagrams()
  }
  catch (error) {
    notify.error(error)
  }
}

onMounted(() => {
  fetchDiagrams()
})
</script>

<template>
  <div class="pl-10">
    <div v-if="diagramsList?.length === 0" class="flex justify-center my-4">
      <UButton label="Create your first mindmap" icon="i-heroicons-plus" @click="createDiagram()" />
    </div>
    <div v-else class="flex justify-end my-4">
      <UButton label="Create New" icon="i-heroicons-plus" @click="createDiagram()" />
    </div>
    <DiagramWelComeMessage v-if="diagramsList?.length === 0" />
    <div v-else class="overflow-x-auto">
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
                <tr v-for="(item, index) in diagramsList" :key="index" class="border-b dark:border-neutral-500">
                  <!-- <td class="whitespace-nowrap px-6 py-4">
                    {{ item.id }}
                  </td> -->
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ item.title }}
                  </td>
                  <!-- <td class="whitespace-nowrap px-6 py-4">
                    {{ item.keywords ? item.keywords : 'No keywords specified' }}
                  </td> -->
                  <!-- <td class="whitespace-nowrap px-6 py-4">
                    {{ item.created_at }}
                  </td> -->
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ dayjs(item.created_at).format("dddd, MMMM D YYYY hh:mm:ss") }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <UTooltip text="Edit" :popper="{ arrow: true }">
                      <UButton
                        color="blue"
                        icon="i-heroicons-pencil-square"
                        size="sm"
                        variant="ghost"
                        @click="redirectToPath(item.id)"
                      />
                    </UTooltip>

                    <UTooltip text="Delete" :popper="{ arrow: true }">
                      <UButton
                        color="blue"
                        icon="i-heroicons-trash"
                        size="sm"
                        variant="ghost"
                        @click="deleteDiagram(item.id)"
                      />
                    </UTooltip>
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
      Creating your <span class="font-bold">Default</span> Diagram...
    </UCard>
  </UModal>
  <UModal v-model="isDelete">
    <UCard>
      Are you sure you want to delete this diagram?
      <div class="flex justify-end my-4">
        <UButton label="Cancel" class="mr-2" icon="i-heroicons-x-mark" @click="isDelete = false" />
        <UButton label="Delete" icon="i-heroicons-archive-box-x-mark" @click="confirmedDeleteDiagram()" />
      </div>
    </UCard>
  </UModal>
</template>
