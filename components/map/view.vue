<script lang="ts" setup>
import nodeMenu from '@mind-elixir/node-menu'
import '@mind-elixir/node-menu/dist/style.css'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash'
import MindElixir from 'mind-elixir'
import { useFileExporter } from '@/composables/ExportJsonFile'

/** ----------- Interfaces/Types ----------- */
interface Props {
  diagramId: string
}

interface EditFormInterface {
  title: string
  details: string
  json: string
  isDetailed: boolean
}

interface DiagramCreationMethodsInterface {
  key: DiagramCreationMethods
  label: string
}

/** ----------- Constants ----------- */
const props = defineProps<Props>()

enum DiagramCreationMethods {
  DataDriven = 'data-driven',
  JSONDriven = 'json-driven',
}

enum ModificationResponsibleOperations {
  AddChild = 'addChild',
  InsertParent = 'insertParent',
  InsertSibling = 'insertSibling',
  RemoveNode = 'removeNode',
  MoveUpNode = 'moveUpNode',
  MoveDownNode = 'moveDownNode',
  CreateArrow = 'createArrow',
  FinishEditArrowLabel = 'finishEditArrowLabel',
  ReshapeNode = 'reshapeNode',
}

const diagramStore = useDiagramStore()
const { $success, $error } = useNuxtApp()
const globalStore = useGlobalStore()
const { exportJSONFile } = useFileExporter()
const route = useRoute()

/** ----------- Refs/Reactive ----------- */
const isLoading = ref<boolean>(false)
const apiResponse = ref()
const oldApiResponse = ref()
const updateApiResponse = ref()
const saveApiResponse = ref()
const editDrawer = ref<boolean>(false)
const versionsDrawer = ref<boolean>(false)
const mind = ref()
const saveModal = ref<boolean>(false)
const diagramHasUnsavedChanges = ref<boolean>(false)
const isDiagramInitialized = ref<boolean>(false)
const hasEvent = ref<boolean>(false)
const destinationRoute = ref()
const versions = ref()
const APIResponseOnInitialPageLoad = ref()
const editForm = ref<EditFormInterface>({
  title: '',
  details: '',
  json: '',
  isDetailed: false,
})
const diagramCreationMethods = ref<DiagramCreationMethodsInterface[]>([
  {
    key: DiagramCreationMethods.DataDriven,
    label: 'Data Driven',
  },
  {
    key: DiagramCreationMethods.JSONDriven,
    label: 'From JSON ',
  },
])
const actionControlsHandler = ref<{ [key: string]: () => void }>({
  onActionControlEditClick,
  onActionControlSaveClick,
  onActionControlVersionsClick,
  onActionControlDownloadClick,
  onActionControlExportJSONClick,
})

/** ----------- Computed ----------- */
const isViewMode = computed(() => route.query?.mode === 'view')
const isEditMode = computed(() => !route.query?.mode || route.query?.mode === 'edit')
const mindMapOptions = computed(() => {
  return {
    el: '#map',
    direction: 2,
    locale: 'en',
    allowUndo: false,
    draggable: false,
    editable: isEditMode.value,
    keyPress: false,
    isFocusMode: false,
    mobileMenu: false,
    overflowHidden: false,
    contextMenu: isEditMode.value,
    toolbar: isEditMode.value,
    contextMenuOption: {
      focus: true,
      link: true,
      extend: [],
    },
  }
})
const actionControls = computed(() => [
  {
    label: 'Edit',
    show: isEditMode.value,
    icon: 'i-heroicons-bars-4',
    method: 'onActionControlEditClick',
  },
  {
    label: 'Save',
    show: isEditMode.value,
    icon: 'i-heroicons-bookmark',
    method: 'onActionControlSaveClick',
  },
  {
    label: 'Versions List',
    show: true,
    icon: 'i-heroicons-rectangle-stack',
    method: 'onActionControlVersionsClick',
  },
  {
    label: 'Download',
    show: true,
    icon: 'i-heroicons-arrow-down-tray',
    method: 'onActionControlDownloadClick',
  },
  {
    label: 'Export JSON',
    show: isEditMode.value,
    icon: 'i-heroicons-document-chart-bar',
    method: 'onActionControlExportJSONClick',
  },
])

/** ----------- Methods ----------- */
function onActionControlEditClick() {
  editDrawer.value = true
}

function onActionControlSaveClick() {
  saveMap()
}

function onActionControlVersionsClick() {
  fetchDiagramVersions()
}

function onActionControlDownloadClick() {
  downloadMap()
}

function onActionControlExportJSONClick() {
  exportJSON()
}

function markDiagramHasUnsavedChanges(status: boolean = true) {
  diagramHasUnsavedChanges.value = status
}

function isDiagramNew() {
  const response = APIResponseOnInitialPageLoad.value[0]?.response
  return response === null
    || response === undefined
    || (Array.isArray(response) && response.length === 0)
    || (typeof response === 'object' && !Array.isArray(response) && Object.keys(response).length === 0)
}

function initCore(apiResponseNodeData: any) {
  mind.value = new MindElixir(mindMapOptions.value)

  // Show node menu only when on edit mode
  if (isEditMode.value)
    mind.value.install(nodeMenu)

  mind.value.init({
    linkData: {},
    nodeData: apiResponseNodeData,
  })

  // Attach a listener to the mind map that will track if any modifiable operations happened
  mind.value.bus.addListener('operation', (operation: any) => {
    if (Object.values(ModificationResponsibleOperations).includes(operation.name))
      markDiagramHasUnsavedChanges()
  })
}

async function fetchDiagramVersions() {
  try {
    versionsDrawer.value = true

    versions.value = await diagramStore.getVersionList({
      diagramId: props.diagramId,
    })
  }
  catch (error) {
    $error(error)
  }
}

async function fetchMap() {
  try {
    apiResponse.value = await diagramStore.get({
      diagramId: props.diagramId,
    })

    if (apiResponse.value[0].response.nodeData || apiResponse.value[0].response.chartDetails) {
      // It means diagram already has the data
      isDiagramInitialized.value = true

      if (apiResponse.value[0].response.nodeData) {
        hasEvent.value = true
        editForm.value.title = apiResponse.value[0].response.nodeData.topic
        oldApiResponse.value = cloneDeep(apiResponse.value[0].response.nodeData)
      }
      else if (apiResponse.value[0].response.chartDetails) {
        editForm.value.title = apiResponse.value[0].response.chartDetails[0].nodeData.topic
        oldApiResponse.value = cloneDeep(apiResponse.value[0].response.chartDetails[0].nodeData)
      }

      initCore(apiResponse.value[0].response.nodeData || apiResponse.value[0].response.chartDetails[0].nodeData)

      globalStore.pageHeading.title = editForm.value.title
      hasEvent.value = true
    }

    return apiResponse.value
  }
  catch (error) {
    $error(error)
    hasEvent.value = false
  }
}

async function updateMap() {
  try {
    isLoading.value = true

    updateApiResponse.value = await diagramStore.update({
      diagramId: props.diagramId,
      title: editForm.value.title,
      isDetailed: editForm.value.isDetailed,
      details: editForm.value.isDetailed ? editForm.value.details : undefined,
    })

    isLoading.value = false
    editDrawer.value = false

    if (updateApiResponse.value.response.chartDetails[0].nodeData) {
      initCore(updateApiResponse.value.response.chartDetails[0].nodeData)

      editForm.value.title = updateApiResponse.value.response.chartDetails[0].nodeData.topic as string

      hasEvent.value = true
    }

    /**
     * On update operation the diagram should be modified only if this is not
     * a new diagram that is being updated for the first time
     */
    const canDiagramMarkAsModifiedOnUpdate = !isDiagramNew()
    markDiagramHasUnsavedChanges(canDiagramMarkAsModifiedOnUpdate)

    $success('Mindmap generated!')

    fetchMap()
  }
  catch (error) {
    $error(error?.message)
  }

  finally {
    isLoading.value = false
  }
}

async function saveMap(isRedirect: boolean = false) {
  try {
    saveApiResponse.value = await diagramStore.save({
      diagramId: props.diagramId,
      existingOpenAIResponse: toRaw(mind.value.getDataString()),
      isDiagramChanged: true,
    })

    markDiagramHasUnsavedChanges(false)

    $success('Mindmap saved!')

    if (isRedirect) {
      navigateTo({
        path: destinationRoute.value.path,
      })
    }
  }
  catch (error) {
    $error(error)
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
  exportJSONFile(toRaw(data), `${editForm.value.title}_MINDMAP.json`)
}

function loadJSON(jsonData: JSON) {
  versionsDrawer.value = false
  updateApiResponse.value = jsonData

  if (updateApiResponse.value.nodeData) {
    initCore(updateApiResponse.value.nodeData)
    editForm.value.title = updateApiResponse.value.nodeData.topic
  }
  else {
    initCore(updateApiResponse.value[0].nodeData)
    editForm.value.title = updateApiResponse.value[0].nodeData.topic
  }

  markDiagramHasUnsavedChanges()

  $success('Selected mindmap loaded')
}

function createMapFromJSON() {
  try {
    JSON.parse(editForm.value.json)
  }
  catch (error) {
    return $error('Invalid JSON')
  }

  try {
    const jsonString = `${JSON.parse(editForm.value.json)}`
    const parsedObject = JSON.parse(jsonString)
    updateApiResponse.value = parsedObject

    if (updateApiResponse.value.nodeData) {
      initCore(updateApiResponse.value.nodeData)
      editForm.value.title = updateApiResponse.value.topic

      editDrawer.value = false
      $success('Mindmap created from JSON')
    }
    saveMap()
  }
  catch (error) {
    $error(error)
  }
}

function discardChanges() {
  markDiagramHasUnsavedChanges(false)
  $success('Mindmap changes discarded')
  closeModal()
  navigateTo(destinationRoute.value.path)
}

function closeModal() {
  saveModal.value = false
}

/** ----------- Hooks ----------- */
onMounted(async () => {
  editDrawer.value = isEditMode.value
  APIResponseOnInitialPageLoad.value = await fetchMap()
})

onBeforeRouteLeave((to) => {
  // No need of this popup in view only mode
  if (isViewMode.value)
    return

  // Save the destination route
  destinationRoute.value = to

  // If diagram is modified, abort the current page leaving operation
  if (diagramHasUnsavedChanges.value) {
    saveModal.value = true
    return false
  }

  // If everything is okay, allow leaving the page
  return true
})

onBeforeUnmount(() => {
  mind.value = null
  apiResponse.value = null
})
</script>

<template>
  <!-- Action Controls -->
  <div class="flex fixed right-0 w-12 flex-col justify-between bg-white z-20">
    <div class="px-2">
      <ul class="space-y-1 border-gray-100 pt-4">
        <template v-for="(actionControl, index) in actionControls">
          <div v-if="actionControl.show" :key="index" :class="{ 'cursor-not-allowed': !hasEvent }">
            <li @click="actionControlsHandler[actionControl.method]()">
              <a
                class="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                <UIcon :name="actionControl.icon" class="size-5" />
                <span
                  class="absolute end-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white invisible group-hover:visible"
                >
                  {{ actionControl.label }}
                </span>
              </a>
            </li>
          </div>
        </template>
      </ul>
    </div>
  </div>

  <!-- Edit Navigation drawer -->
  <USlideover v-model="editDrawer">
    <button class="absolute top-5 right-5" @click="editDrawer = false">
      <UIcon name="i-heroicons-x-mark" class="size-6" />
    </button>

    <div class="mt-10">
      <h1 id="home" class="text-2xl mb-4 font-extrabold text-center mt-6">
        Create Mindmap With AI Magic
      </h1>
      <UTabs :items="diagramCreationMethods" class="w-full px-6 py-6">
        <template #item="{ item }">
          <!-- Data driven tab -->
          <div v-if="item.key === DiagramCreationMethods.DataDriven">
            <form class="max-w-sm mx-auto px-4 py-6">
              <div class="mb-5">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">I would like to
                  create a mindmap on</label>
                <input
                  v-model="editForm.title"
                  :disabled="isDiagramInitialized"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
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
                  <input
                    id="remember" v-model="editForm.isDetailed" type="checkbox" value=""
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                    required
                  >
                </div>
                <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I have more
                  details</label>
              </div>
              <div v-if="editForm.isDetailed" class="mb-5">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Explain your
                  idea in everyday terms</label>
                <textarea
                  v-model="editForm.details"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
                <div class="text-gray-500 text-xs mt-3">
                  For example- I want to visualize the key concepts of blockchain. Start with a central node labeled
                  'Blockchain Technology' and branch out to 'Decentralization,' 'Immutable Ledger,' and 'Cryptographic
                  Security.
                </div>
              </div>
              <UButton
                :loading="isLoading" :disabled="(editForm.isDetailed && !editForm.details) || (!editForm.title)"
                label="Submit" class="px-5 py-2.5 text-center " @click="updateMap()"
              />
            </form>
          </div>
          <!-- Json Tab -->
          <div v-else>
            <form class="max-w-sm mx-auto px-4 py-6">
              <div class="mb-5">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter your JSON
                  Data</label>
                <textarea
                  v-model="editForm.json" size="xl"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
                <UButton label="Submit" class="mt-5 px-5 py-2.5 text-center" @click="createMapFromJSON()" />
              </div>
            </form>
          </div>
        </template>
      </UTabs>
    </div>
  </USlideover>

  <!-- Versions drawer -->
  <USlideover v-model="versionsDrawer" class="">
    <button class="absolute top-5 right-5" @click="versionsDrawer = false">
      <UIcon name="i-heroicons-x-mark" class="size-6" />
    </button>
    <div class="overflow-auto">
      <h1 id="home" class="text-2xl mb-4 font-extrabold text-center mt-6">
        Version History
      </h1>
      <ul class="mt-4 space-y-2 px-2">
        <li v-for="(item, index) in versions" :key="index">
          <a
            href="#" class="block h-full rounded-lg border border-gray-700 p-4 hover:border-gray-300"
            @click="loadJSON(item.response)"
          >
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

  <!-- Map rendering -->
  <UContainer>
    <div class="y-10 ml-5">
      <div id="map" class="h-[700px] overflow-y-auto z-10" />
    </div>
  </UContainer>

  <UModal v-model="saveModal">
    <ModalsConfirmation
      title="Unsaved Changes Detected"
      description="You have unsaved changes in your diagram. Do you want to discard the changes or save them before exiting?"
      :cancel-action="{
        label: 'Discard',
        color: 'bg-gray-500',
      }"
      :confirm-action="{
        label: 'Save',
        color: 'bg-green-500',
      }"
      @on:cancel="discardChanges()"
      @on:close="closeModal()"
      @on:confirm="saveMap(true)"
    />
  </UModal>
</template>

<style scoped>
:deep(.custom-size img) {
  width: 1.5rem !important;
  height: 1.5rem !important;
}
</style>
